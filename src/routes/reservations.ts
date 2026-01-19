import express from 'express';
import { Reservation } from '../models/Reservation';

const router = express.Router();

const reservations: Reservation[] = [];
let idCounter = 1;

router.post('/', (req, res) => {
  const { roomId, startTime, endTime, userId } = req.body;

  if (!roomId || !startTime || !endTime || !userId) {
    return res.status(400).json({ error: 'Kaikki kentät ovat pakollisia.' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();
  
  if (start >= end) {
    return res.status(400).json({ error: 'Alkuajan on oltava ennen loppuaikaa.' });
  }

  if (start < now) {
    return res.status(400).json({ error: 'Varausta ei voi tehdä menneisyyteen.' });
  }

  const isOverlapping = reservations.some(existing => {
    if (existing.roomId !== roomId) return false;

    const overlaps = start < existing.endTime && end > existing.startTime;
    return overlaps;
  });

  if (isOverlapping) {
    return res.status(400).json({ error: 'Huone on jo varattu valitulla aikavälillä.' });
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

  return res.status(201).json(reservation);
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
export { reservations };