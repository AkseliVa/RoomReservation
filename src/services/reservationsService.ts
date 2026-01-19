import { Reservation } from '../models/Reservation';

export const reservations: Reservation[] = [];
let idCounter = 1;

export function createReservation(roomId: string, startTime: string, endTime: string, userId: string): Reservation | { error: string } {
  if (!roomId || !startTime || !endTime || !userId) {
    return { error: 'Kaikki kentät ovat pakollisia.' };
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();
  
  if (start >= end) {
    return { error: 'Alkuajan on oltava ennen loppuaikaa.' };
  }

  if (start < now) {
    return { error: 'Varausta ei voi tehdä menneisyyteen.' };
  }

  const isOverlapping = reservations.some(existing => {
    if (existing.roomId !== roomId) return false;
    const overlaps = start < existing.endTime && end > existing.startTime;
    return overlaps;
  });

  if (isOverlapping) {
    return { error: 'Huone on jo varattu valitulla aikavälillä.' };
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

  return reservation;
}

export function deleteReservation(id: string): boolean {
  const index = reservations.findIndex(r => r.id === id);
  if (index === -1) {
    return false;
  }
  reservations.splice(index, 1);
  return true;
}

export function getReservationsByRoom(roomId: string): Reservation[] {
  return reservations.filter(r => r.roomId === roomId);
}