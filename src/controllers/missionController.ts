import { Request, Response } from 'express';
import prisma from '../config/db';
import { SimulationEngine } from '../services/simulationEngine';
import { DifficultyLevel } from '../types/simulation';

export class MissionController {
  /**
   * Initialize a new Mission
   */
  public static async createMission(req: Request, res: Response): Promise<void> {
    try {
      const { name, commanderName, difficulty } = req.body;
      const missionDifficulty = (difficulty || 'STANDARD') as DifficultyLevel;

      // Initial standard resources
      const initialResources = {
        oxygen: 100.0,
        water: 100.0,
        food: 100.0,
        power: 100.0,
        morale: 85.0,
        integrity: 90.0,
        radiation: 20.0,
      };

      const mission = await prisma.mission.create({
        data: {
          name: name || `Ares Expedition - ${Date.now().toString().slice(-4)}`,
          commanderName: commanderName || 'Commander Shepard',
          difficulty: missionDifficulty,
          currentDay: 1,
          duration: 30,
          status: 'ACTIVE',
          resourceState: {
            create: initialResources,
          },
          snapshots: {
            create: {
              day: 1,
              ...initialResources,
              score: 250,
              summary: 'Mission successfully initialized. Habitability telemetry nominal.',
            },
          },
        },
        include: {
          resourceState: true,
          snapshots: true,
          events: true,
          actions: true,
        },
      });

      res.status(201).json({
        success: true,
        mission,
      });
    } catch (err: any) {
      console.error('Error creating mission:', err);
      res.status(500).json({ success: false, error: 'Failed to create mission', details: err?.message });
    }
  }

  /**
   * Get all missions
   */
  public static async getMissions(_req: Request, res: Response): Promise<void> {
    try {
      const missions = await prisma.mission.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
          resourceState: true,
        },
      });
      res.json({ success: true, missions });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to fetch missions' });
    }
  }

  /**
   * Get a mission by ID
   */
  public static async getMissionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const mission = await prisma.mission.findUnique({
        where: { id },
        include: {
          resourceState: true,
          events: {
            orderBy: { createdAt: 'desc' },
          },
          actions: {
            orderBy: { createdAt: 'desc' },
            take: 15,
          },
          snapshots: {
            orderBy: { day: 'asc' },
          },
        },
      });

      if (!mission) {
        res.status(404).json({ success: false, error: 'Mission not found' });
        return;
      }

      res.json({ success: true, mission });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to fetch mission' });
    }
  }

  /**
   * Advance Day (Sol) by 1
   */
  public static async advanceDay(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const mission = await prisma.mission.findUnique({
        where: { id },
        include: { resourceState: true },
      });

      if (!mission || !mission.resourceState) {
        res.status(404).json({ success: false, error: 'Mission or resources not found' });
        return;
      }

      if (mission.status !== 'ACTIVE') {
        res.status(400).json({
          success: false,
          error: `Cannot advance day: Mission is currently in ${mission.status} status`,
        });
        return;
      }

      // Current resources
      const currentRes = {
        oxygen: mission.resourceState.oxygen,
        water: mission.resourceState.water,
        food: mission.resourceState.food,
        power: mission.resourceState.power,
        morale: mission.resourceState.morale,
        integrity: mission.resourceState.integrity,
        radiation: mission.resourceState.radiation,
      };

      // 1. Tick simulation
      const { nextResources, deltas, failureReason } = SimulationEngine.calculateDailyTick(
        currentRes,
        mission.difficulty as DifficultyLevel
      );

      const nextDay = mission.currentDay + 1;
      let nextStatus = mission.status;
      let finalReason = failureReason;

      // Check mission failure or success
      if (failureReason) {
        nextStatus = 'FAILED';
      } else if (nextDay > mission.duration) {
        nextStatus = 'COMPLETED';
      }

      // Check for emergency event trigger if mission is still active
      let triggeredEvent = null;
      if (nextStatus === 'ACTIVE') {
        const potentialEvent = SimulationEngine.evaluateEmergency(
          nextDay,
          mission.difficulty as DifficultyLevel,
          nextResources
        );

        if (potentialEvent) {
          triggeredEvent = await prisma.missionEvent.create({
            data: {
              missionId: mission.id,
              day: nextDay,
              eventType: potentialEvent.eventType,
              severity: potentialEvent.severity,
              title: potentialEvent.title,
              description: potentialEvent.description,
              options: JSON.stringify(potentialEvent.options),
              status: 'ACTIVE',
            },
          });
        }
      }

      // Calculate score & grade
      const { score, grade } = SimulationEngine.calculateMissionScore(
        Math.min(nextDay, mission.duration),
        mission.duration,
        nextResources,
        nextStatus
      );

      // Perform atomic database update
      const [updatedMission, updatedResourceState, snapshot] = await prisma.$transaction([
        prisma.mission.update({
          where: { id: mission.id },
          data: {
            currentDay: Math.min(nextDay, mission.duration),
            status: nextStatus,
            failureReason: finalReason,
            score,
            finalGrade: grade,
          },
        }),
        prisma.resourceState.update({
          where: { missionId: mission.id },
          data: { ...nextResources },
        }),
        prisma.dailySnapshot.create({
          data: {
            missionId: mission.id,
            day: Math.min(nextDay, mission.duration),
            ...nextResources,
            score,
            summary: failureReason
              ? failureReason
              : triggeredEvent
              ? `Sol ${nextDay}: System anomaly detected - ${triggeredEvent.title}`
              : `Sol ${nextDay}: Systems normal. Atmospheric and life support nominal.`,
          },
        }),
      ]);

      res.json({
        success: true,
        mission: updatedMission,
        resources: updatedResourceState,
        deltas,
        newEmergency: triggeredEvent,
        snapshot,
      });
    } catch (err: any) {
      console.error('Error advancing day:', err);
      res.status(500).json({ success: false, error: 'Failed to advance day', details: err?.message });
    }
  }

  /**
   * Pause mission
   */
  public static async pauseMission(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const mission = await prisma.mission.update({
        where: { id },
        data: { status: 'PAUSED' },
      });
      res.json({ success: true, mission });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to pause mission' });
    }
  }

  /**
   * Resume mission
   */
  public static async resumeMission(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const mission = await prisma.mission.update({
        where: { id },
        data: { status: 'ACTIVE' },
      });
      res.json({ success: true, mission });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to resume mission' });
    }
  }

  /**
   * Restart mission
   */
  public static async restartMission(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const initialResources = {
        oxygen: 100.0,
        water: 100.0,
        food: 100.0,
        power: 100.0,
        morale: 85.0,
        integrity: 90.0,
        radiation: 20.0,
      };

      await prisma.missionAction.deleteMany({ where: { missionId: id } });
      await prisma.missionEvent.deleteMany({ where: { missionId: id } });
      await prisma.dailySnapshot.deleteMany({ where: { missionId: id } });

      const mission = await prisma.mission.update({
        where: { id },
        data: {
          currentDay: 1,
          status: 'ACTIVE',
          failureReason: null,
          score: 250,
          finalGrade: null,
          resourceState: {
            update: initialResources,
          },
          snapshots: {
            create: {
              day: 1,
              ...initialResources,
              score: 250,
              summary: 'Mission restarted. Life support calibrated to baseline.',
            },
          },
        },
        include: { resourceState: true },
      });

      res.json({ success: true, mission });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to restart mission' });
    }
  }
}
