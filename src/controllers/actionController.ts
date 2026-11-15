import { Request, Response } from 'express';
import prisma from '../config/db';
import { SimulationEngine, AVAILABLE_ACTIONS } from '../services/simulationEngine';

export class ActionController {
  /**
   * Get available action catalog and recent mission actions
   */
  public static async getActions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const actions = await prisma.missionAction.findMany({
        where: { missionId: id },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        catalog: Object.values(AVAILABLE_ACTIONS),
        history: actions,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to retrieve actions' });
    }
  }

  /**
   * Execute an engineering / life-support action
   */
  public static async executeAction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { actionType } = req.body;

      if (!actionType) {
        res.status(400).json({ success: false, error: 'actionType is required' });
        return;
      }

      const mission = await prisma.mission.findUnique({
        where: { id },
        include: { resourceState: true },
      });

      if (!mission || !mission.resourceState) {
        res.status(404).json({ success: false, error: 'Mission or resources not found' });
        return;
      }

      if (mission.status !== 'ACTIVE') {
        res.status(400).json({ success: false, error: 'Cannot execute actions on an inactive or finished mission' });
        return;
      }

      const currentRes = {
        oxygen: mission.resourceState.oxygen,
        water: mission.resourceState.water,
        food: mission.resourceState.food,
        power: mission.resourceState.power,
        morale: mission.resourceState.morale,
        integrity: mission.resourceState.integrity,
        radiation: mission.resourceState.radiation,
      };

      const result = SimulationEngine.executeAction(currentRes, actionType);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error || 'Action could not be executed due to insufficient resources',
        });
        return;
      }

      const actionDef = AVAILABLE_ACTIONS[actionType];

      // Update in database atomically
      const [updatedState, actionRecord] = await prisma.$transaction([
        prisma.resourceState.update({
          where: { missionId: mission.id },
          data: { ...result.nextResources },
        }),
        prisma.missionAction.create({
          data: {
            missionId: mission.id,
            day: mission.currentDay,
            actionType,
            description: actionDef ? actionDef.title : actionType,
            resourceChanges: JSON.stringify(result.changes),
            success: true,
          },
        }),
      ]);

      res.json({
        success: true,
        action: actionRecord,
        resources: updatedState,
        changes: result.changes,
        scienceNote: actionDef?.scienceNote || '',
      });
    } catch (err: any) {
      console.error('Error executing action:', err);
      res.status(500).json({ success: false, error: 'Failed to execute action', details: err?.message });
    }
  }
}
