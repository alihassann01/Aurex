import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createAnnouncement,
  createPermit,
  createRequest,
  getAnalyticsOverview,
  listAnnouncements,
  listEvents,
  listPermits,
  listRequests,
  markAnnouncementRead,
  registerForEvent,
  updatePermit,
  updateRequest,
} from '../controllers/platform.controllers.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Aurex CivicConnect API',
    timestamp: new Date().toISOString(),
  });
});

router.get('/requests', authMiddleware, listRequests);
router.post('/requests', authMiddleware, createRequest);
router.patch('/requests/:id', authMiddleware, updateRequest);

router.get('/permits', authMiddleware, listPermits);
router.post('/permits', authMiddleware, createPermit);
router.patch('/permits/:id', authMiddleware, updatePermit);

router.get('/announcements', authMiddleware, listAnnouncements);
router.post('/announcements', authMiddleware, createAnnouncement);
router.patch('/announcements/:id/read', authMiddleware, markAnnouncementRead);

router.get('/events', authMiddleware, listEvents);
router.post('/events/:id/register', authMiddleware, registerForEvent);

router.get('/analytics/overview', authMiddleware, getAnalyticsOverview);

export default router;
