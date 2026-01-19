import express from 'express';
import reservationsRouter from './routes/reservations';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Meeting Room Reservation API');
});

app.use('/reservations', reservationsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});