import express from 'express';
import {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  replyMessage,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getMessages)
  .post(createMessage);

router.route('/:id')
  .get(protect, getMessage)
  .put(protect, updateMessage)
  .delete(protect, deleteMessage);

router.post('/:id/reply', protect, replyMessage);

export default router;

