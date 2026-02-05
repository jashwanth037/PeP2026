import express from 'express';
import { displayComplaints, addComplaints, resolveComplaint, deleteComplaint, getComplaintById } from '../controllers/compalint.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", displayComplaints);
router.post("/", addComplaints);
router.get("/:id", getComplaintById);
router.put("/:id/resolve", authMiddleware, resolveComplaint);
router.delete("/:id", authMiddleware, deleteComplaint);

export default router;
