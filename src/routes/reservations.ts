import express from 'express';
import { Reservation } from '../models/Reservation';

const router = express.Router();

const reservations: Reservation[] = [];
let idCounter = 1;

router.post('/', (req, res) => {
  const { roomId, startTime, endTime, userId } = req.body;

  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (start.getTime() >= end.getTime()) {
    return res.status(400).json({ error: 'Start time must be before end time' });
  }

  if (start.getTime() < now.getTime()) {
    return res.status(400).json({ error: 'Cannot reserve in the past' });
  }

  // Check for overlapping reservations
  const overlapping = reservations.find(r => r.roomId === roomId && !(r.endTime <= start || end <= r.startTime));
  if (overlapping) {
    return res.status(400).json({ error: 'Reservation overlaps with existing one' });
  }

  const reservation: Reservation = {
    id: idCounter.toString(),
    roomId,
    startTime: start,
    endTime: end,
    userId
  };

  reservations.push(reservation);
  idCounter++;

  res.status(201).json(reservation);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = reservations.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found' });
  }
  reservations.splice(index, 1);
  res.status(204).send();
});

router.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const roomReservations = reservations.filter(r => r.roomId === roomId);
  res.json(roomReservations);
});

export default router;