const express = require('express');
const cors = require('cors');
const path = require('path');
const dataRouter = require('./routes/data');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/data', dataRouter);

// Fallback route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../single_app.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 