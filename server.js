const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const pool = mysql.createPool(dbConfig);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/verify-email', async (req, res) => {
  const { correo } = req.body;

  try {
    console.log('Conectando a la base de datos...');
    const [rows] = await pool.execute('SELECT * FROM Usuarios WHERE correo_u = ?', [correo]);
    console.log('Consulta ejecutada con éxito:', rows);
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    console.error('Error al verificar el correo:', err);
    res.status(500).send({ error: 'Error al verificar el correo', details: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).send('Correo y contraseña son obligatorios');
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM Usuarios WHERE correo_u = ?', [correo]);

    if (rows.length > 0) {
      if (contrasena === rows[0].password_u) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error('Error al verificar las credenciales:', err);
    res.status(500).send({ error: 'Error al verificar las credenciales', details: err.message });
  }
});

app.post('/register', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).send('Correo y contraseña son obligatorios');
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM Usuarios WHERE correo_u = ?', [correo]);

    if (rows.length > 0) {
      return res.status(400).send('El correo ya está registrado');
    }

    await pool.execute('INSERT INTO Usuarios (correo_u, password_u) VALUES (?, ?)', [correo, contrasena]);

    res.json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).send({ error: 'Error al registrar el usuario', details: err.message });
  }
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registrar.html'));
});

app.get('/password', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'password.html');
  console.log('Ruta a password.html:', filePath);
  res.sendFile(filePath);
});

app.get('/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
