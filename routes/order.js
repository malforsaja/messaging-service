import { Router } from 'express';
const order = require('../controllers/messaging-controller');

const router = Router();

router.get("/:orderId", order.findOne);

export default router;