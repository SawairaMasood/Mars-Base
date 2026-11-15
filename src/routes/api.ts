import { Router } from 'express';
import { MissionController } from '../controllers/missionController';
import { ActionController } from '../controllers/actionController';
import { EventController } from '../controllers/eventController';
import { AnalyticsController } from '../controllers/analyticsController';
import { AiController } from '../controllers/aiController';

const router = Router();

// Health Check
router.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'MARSBASE Beyond Earth Simulation Engine',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5),
  });
});

// Missions
router.post('/missions', MissionController.createMission);
router.get('/missions', MissionController.getMissions);
router.get('/missions/:id', MissionController.getMissionById);
router.post('/missions/:id/advance-day', MissionController.advanceDay);
router.post('/missions/:id/pause', MissionController.pauseMission);
router.post('/missions/:id/resume', MissionController.resumeMission);
router.post('/missions/:id/restart', MissionController.restartMission);

// Actions
router.get('/missions/:id/actions', ActionController.getActions);
router.post('/missions/:id/actions', ActionController.executeAction);

// Events
router.get('/missions/:id/events', EventController.getEvents);
router.post('/missions/:id/events/:eventId/respond', EventController.respondToEvent);

// Analytics & Reports
router.get('/missions/:id/analytics', AnalyticsController.getAnalytics);
router.get('/missions/:id/report', AnalyticsController.getMissionReport);

// AI & Educational Science
router.post('/ai/advisor', AiController.askAdvisor);
router.get('/science/glossary', AiController.getGlossary);

export default router;
