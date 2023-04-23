const express = require('express');
require('dotenv').config({ path: './.env' });
const cors = require('cors');

//sample edit for demo
const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

const tempRoutes = require('./routes/api/temperature.js');
const auth = require('./routes/api/auth.js');
const chat = require('./routes/api/openai.js');

app.get('/', (req, res) => res.send('API Running, No Error'));
app.use(express.json({ extend: false }));

app.use('/api/temperature', tempRoutes);
app.use('/api/auth', auth);
app.use('/api/openai', chat);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
