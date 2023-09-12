const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: '116.193.191.220',
    database: 'postgres',
    password: 'Golanggabut@123',
    port: 5432,
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    pool.query('SELECT * FROM tvkurs_crud', (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
      } else {
        const data = result.rows;
        res.json(data);
      }
    });
});

app.get('/api/:id', (req, res) => {
    const { id } = req.params;
  
    pool.query(
      'SELECT * FROM tvkurs_crud WHERE id = $1',
      [id],
      (error, result) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
          if (result.rows.length === 0) {
            res.status(404).json({ message: 'Data not found' });
          } else {
            const data = result.rows[0];
            res.json(data);
          }
        }
      }
    );
  });

  app.get('/api/video/:id', (req, res) => {
    const { id } = req.params;
  
    pool.query(
      'SELECT video_url FROM tvkurs_crud WHERE id = $1',
      [id],
      (error, result) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
          if (result.rows.length === 0) {
            res.status(404).json({ message: 'Data not found' });
          } else {
            const data = result.rows[0];
            res.json(data);
          }
        }
      }
    );
  });

app.post('/api/data', (req, res) => {
    const { nama_cabang, video_url, jam_buka, jam_tutup } = req.body; // Assuming you're inserting these fields
    const sequence_name = "nextval('TVKURS_CRUD_ID_SEQ')";
    pool.query(
      'INSERT INTO tvkurs_crud (id, nama_cabang, video_url, jam_buka, jam_tutup) VALUES ('+sequence_name+',$1, $2, $3, $4)',
      [nama_cabang, video_url, jam_buka, jam_tutup],
      (error, result) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'An error occurred while inserting data.' });
        } else {
          res.json({ message: 'Data inserted successfully' });
        }
      }
    );
  });

app.delete('/api/data/:id', (req, res) => {
    const { id } = req.params;
  
    pool.query('DELETE FROM tvkurs_crud WHERE id = $1', [id], (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred while deleting data.' });
      } else {
        res.json({ message: 'Data deleted successfully' });
      }
    });
});