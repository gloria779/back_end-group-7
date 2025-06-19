const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require("'./routes/authRoutes'"));
app.use('/api/listings', require('./routes/listingRoutes'));

app.get('/', (req, res) => res.send('UCU Accommodation Finder API'));

module.exports = app;