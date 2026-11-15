import { Request, Response } from 'express';
import prisma from '../config/db';
import { SimulationEngine } from '../services/simulationEngine';

export class AnalyticsController {
  /**
   * Get mission analytics & daily snapshots
   */
  public static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const mission = await prisma.mission.findUnique({
        where: { id },
        include: {
          snapshots: {
            orderBy: { day: 'asc' },
          },
          events: true,
          actions: true,
          resourceState: true,
        },
      });

      if (!mission) {
        res.status(404).json({ success: false, error: 'Mission not found' });
        return;
      }

      // Calculate aggregated metrics
      const totalEvents = mission.events.length;
      const resolvedEvents = mission.events.filter((e) => e.status === 'RESOLVED').length;
      const totalActions = mission.actions.length;

      res.json({
        success: true,
        missionId: mission.id,
        currentDay: mission.currentDay,
        status: mission.status,
        snapshots: mission.snapshots,
        stats: {
          totalEvents,
          resolvedEvents,
          totalActions,
          currentScore: mission.score,
          finalGrade: mission.finalGrade,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to retrieve analytics' });
    }
  }

  /**
   * Generate complete scientific and educational debrief report
   */
  public static async getMissionReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const mission = await prisma.mission.findUnique({
        where: { id },
        include: {
          resourceState: true,
          snapshots: { orderBy: { day: 'asc' } },
          events: true,
          actions: true,
        },
      });

      if (!mission || !mission.resourceState) {
        res.status(404).json({ success: false, error: 'Mission not found' });
        return;
      }

      const resState = mission.resourceState;
      const currentRes = {
        oxygen: resState.oxygen,
        water: resState.water,
        food: resState.food,
        power: resState.power,
        morale: resState.morale,
        integrity: resState.integrity,
        radiation: resState.radiation,
      };

      const scoreData = SimulationEngine.calculateMissionScore(
        mission.currentDay,
        mission.duration,
        currentRes,
        mission.status
      );

      // Evaluate strengths and mistakes based on actual state and actions
      const strengths: string[] = [];
      const mistakes: string[] = [];
      const educationalLessons: string[] = [];

      if (resState.oxygen > 50) {
        strengths.push('Atmospheric Management: Kept oxygen margins robust through disciplined MOXIE cycling.');
      } else {
        mistakes.push('Hypoxia Risk: Oxygen dipped into dangerous territory, risking asphyxiation.');
      }

      if (resState.water > 50) {
        strengths.push('Closed-Loop Hydrology: Excellent stewardship of ECLSS distillation and water reserves.');
      } else {
        mistakes.push('Water Depletion: Water recovery was deferred, stressing crew hydration and hydroponics.');
      }

      if (resState.radiation < 45) {
        strengths.push('Radiation Shielding: Maintained excellent radiation mitigation with superconducting coils & regolith vaults.');
      } else {
        mistakes.push('Radiation Sickness Risk: High cumulative radiation exposure accumulated across prolonged surface Sols.');
      }

      if (resState.morale > 60) {
        strengths.push('Crew Psychology: Prevented chronic confinement fatigue and preserved strong command team cohesion.');
      } else {
        mistakes.push('Morale Decline: Overburdened crew with continuous high-tempo work without sufficient decompression.');
      }

      educationalLessons.push(
        'Mass trade-offs dictate space missions: Every kilogram of water or oxygen launched from Earth costs thousands of dollars. ISRU and recycling are non-negotiable for human Mars settlement.'
      );
      educationalLessons.push(
        'Energy is the ultimate currency on Mars: Solar arrays require active dust management; power loss triggers an immediate chain reaction across life-support systems.'
      );
      educationalLessons.push(
        'Human factors matter as much as hardware: Physical survival without psychological wellbeing leads to operational breakdown in deep-space isolation.'
      );

      res.json({
        success: true,
        report: {
          missionId: mission.id,
          missionName: mission.name,
          commanderName: mission.commanderName,
          difficulty: mission.difficulty,
          status: mission.status,
          failureReason: mission.failureReason,
          daysSurvived: mission.currentDay,
          totalDuration: mission.duration,
          finalResources: currentRes,
          score: scoreData.score,
          grade: scoreData.grade,
          scoreBreakdown: scoreData.breakdown,
          strengths,
          mistakes,
          educationalLessons,
          totalActionsExecuted: mission.actions.length,
          totalEmergenciesHandled: mission.events.length,
          disclaimer:
            'Educational Simulation Notice: MARSBASE is a student mission trainer designed for the NASA Space Apps Challenge 2026. Simulation values are simplified educational approximations and do not represent classified NASA mission flight software.',
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to generate mission report' });
    }
  }
}
