import { Request, Response } from 'express';
import prisma from '../config/db';
import { ResourceDelta } from '../types/simulation';

export class EventController {
  /**
   * Get all emergency events for a mission
   */
  public static async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const events = await prisma.missionEvent.findMany({
        where: { missionId: id },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ success: true, events });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to fetch events' });
    }
  }

  /**
   * Respond to an active emergency event
   */
  public static async respondToEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id, eventId } = req.params;
      const { optionId } = req.body;

      if (!optionId) {
        res.status(400).json({ success: false, error: 'optionId is required' });
        return;
      }

      const event = await prisma.missionEvent.findUnique({
        where: { id: eventId },
      });

      if (!event || event.missionId !== id) {
        res.status(404).json({ success: false, error: 'Emergency event not found for this mission' });
        return;
      }

      if (event.status === 'RESOLVED') {
        res.status(400).json({ success: false, error: 'This emergency has already been resolved' });
        return;
      }

      const mission = await prisma.mission.findUnique({
        where: { id },
        include: { resourceState: true },
      });

      if (!mission || !mission.resourceState) {
        res.status(404).json({ success: false, error: 'Mission state not found' });
        return;
      }

      // Parse options
      let optionsList: any[] = [];
      try {
        optionsList = JSON.parse(event.options);
      } catch {
        optionsList = [];
      }

      const selectedOpt = optionsList.find((opt) => opt.id === optionId);
      if (!selectedOpt) {
        res.status(400).json({ success: false, error: 'Invalid emergency option selected' });
        return;
      }

      // Calculate new resources
      const cost: ResourceDelta = selectedOpt.resourceCost || {};
      const cur = mission.resourceState;

      let oxygen = Math.max(0, Math.min(100, Math.round((cur.oxygen + (cost.oxygen || 0)) * 10) / 10));
      let water = Math.max(0, Math.min(100, Math.round((cur.water + (cost.water || 0)) * 10) / 10));
      let food = Math.max(0, Math.min(100, Math.round((cur.food + (cost.food || 0)) * 10) / 10));
      let power = Math.max(0, Math.min(100, Math.round((cur.power + (cost.power || 0)) * 10) / 10));
      let morale = Math.max(0, Math.min(100, Math.round((cur.morale + (cost.morale || 0)) * 10) / 10));
      let integrity = Math.max(0, Math.min(100, Math.round((cur.integrity + (cost.integrity || 0)) * 10) / 10));
      let radiation = Math.max(0, Math.min(100, Math.round((cur.radiation + (cost.radiation || 0)) * 10) / 10));

      const impactMsg = `Commander authorized "${selectedOpt.label}": ${selectedOpt.benefit}`;

      // Database transaction
      const [updatedEvent, updatedRes] = await prisma.$transaction([
        prisma.missionEvent.update({
          where: { id: eventId },
          data: {
            selectedOption: selectedOpt.label,
            status: 'RESOLVED',
            impactDescription: impactMsg,
          },
        }),
        prisma.resourceState.update({
          where: { missionId: id },
          data: {
            oxygen,
            water,
            food,
            power,
            morale,
            integrity,
            radiation,
          },
        }),
        prisma.missionAction.create({
          data: {
            missionId: id,
            day: mission.currentDay,
            actionType: `EMERGENCY_RESOLUTION_${event.eventType}`,
            description: `Resolved ${event.title} with: ${selectedOpt.label}`,
            resourceChanges: JSON.stringify(cost),
            success: true,
          },
        }),
      ]);

      res.json({
        success: true,
        event: updatedEvent,
        resources: updatedRes,
        impact: impactMsg,
      });
    } catch (err: any) {
      console.error('Error responding to event:', err);
      res.status(500).json({ success: false, error: 'Failed to process emergency response', details: err?.message });
    }
  }
}
