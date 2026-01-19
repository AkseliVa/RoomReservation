import request from 'supertest';
import app from '../src/index';
import { reservations } from '../src/services/reservationsService';

describe('Reservations API', () => {
  beforeEach(() => {
    reservations.length = 0;
  });

  describe('POST /reservations', () => {
    it('should create a reservation successfully', async () => {
      const response = await request(app)
        .post('/reservations')
        .send({
          roomId: 'room1',
          startTime: '2026-01-20T10:00:00',
          endTime: '2026-01-20T11:00:00',
          userId: 'user1'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.roomId).toBe('room1');
    });

    it('should fail if required fields are missing', async () => {
      const response = await request(app)
        .post('/reservations')
        .send({
          startTime: '2026-01-20T10:00:00',
          endTime: '2026-01-20T11:00:00',
          userId: 'user1'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Kaikki kentät ovat pakollisia.');
    });

    it('should fail if start time is after end time', async () => {
      const response = await request(app)
        .post('/reservations')
        .send({
          roomId: 'room1',
          startTime: '2026-01-20T12:00:00',
          endTime: '2026-01-20T11:00:00',
          userId: 'user1'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Alkuajan on oltava ennen loppuaikaa.');
    });

    it('should fail if reservation overlaps', async () => {
      await request(app)
        .post('/reservations')
        .send({
          roomId: 'room1',
          startTime: '2026-01-20T10:00:00',
          endTime: '2026-01-20T11:00:00',
          userId: 'user1'
        });

      const response = await request(app)
        .post('/reservations')
        .send({
          roomId: 'room1',
          startTime: '2026-01-20T10:30:00',
          endTime: '2026-01-20T11:30:00',
          userId: 'user2'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Huone on jo varattu valitulla aikavälillä.');
    });
  });

  describe('GET /reservations/room/:roomId', () => {
    it('should return reservations for the room', async () => {
      await request(app)
        .post('/reservations')
        .send({
          roomId: 'room1',
          startTime: '2026-01-20T10:00:00',
          endTime: '2026-01-20T11:00:00',
          userId: 'user1'
        });

      const response = await request(app)
        .get('/reservations/room/room1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].roomId).toBe('room1');
    });
  });

  describe('DELETE /reservations/:id', () => {
    it('should delete a reservation successfully', async () => {
      const createResponse = await request(app)
        .post('/reservations')
        .send({
          roomId: 'room1',
          startTime: '2026-01-20T10:00:00',
          endTime: '2026-01-20T11:00:00',
          userId: 'user1'
        });

      const id = createResponse.body.id;

      const deleteResponse = await request(app)
        .delete(`/reservations/${id}`);

      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app)
        .get('/reservations/room/room1');

      expect(getResponse.body).toHaveLength(0);
    });

    it('should fail if reservation does not exist', async () => {
      const response = await request(app)
        .delete('/reservations/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Reservation not found');
    });
  });
});