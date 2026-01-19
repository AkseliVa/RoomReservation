import express from 'express';
import { createReservation, deleteReservation, getReservationsByRoom } from '../services/reservationsService';

const router = express.Router();

router.post('/', (req, res) => {
  const { roomId, startTime, endTime, userId } = req.body;

  const result = createReservation(roomId, startTime, endTime, userId);

  if ('error' in result) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json(result);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const success = deleteReservation(id);

  if (!success) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  res.status(204).send();
});

router.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params;

  const roomReservations = getReservationsByRoom(roomId);

  res.json(roomReservations);
});

export default router;