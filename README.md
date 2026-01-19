# Meeting Room Reservation API

A TypeScript Node.js backend API for managing meeting room reservations using an in-memory database.

## Features

- Reserve meeting rooms for specific times
- Delete reservations
- View all reservations for a specific room

## Business Rules

- Reservations cannot overlap
- Reservations cannot be in the past
- Start time must be before end time

## API Endpoints

### POST /reservations
Reserve a meeting room.

**Request Body:**
```json
{
  "roomId": "string",
  "startTime": "ISO string",
  "endTime": "ISO string",
  "userId": "string"
}
```

**Response:** 201 Created with reservation object, or 400 Bad Request with error.

### DELETE /reservations/:id
Delete a reservation by ID.

**Response:** 204 No Content, or 404 Not Found.

### GET /reservations/room/:roomId
Get all reservations for a specific room.

**Response:** Array of reservation objects.

## Installation

1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Start the server: `npm start`
4. For development: `npm run dev`

## Testing

Run tests with: `npm test`