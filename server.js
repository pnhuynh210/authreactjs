const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const cors = require('cors');

const app = express();

// Bodyparser Middleware
app.use(express.json());

app.use(cors());
app.options('*', cors());

// DB Config
const db = config.get('mongoURI');
console.log("url", db);

// Connect to Mongo
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoReconnect: true,
    connectTimeoutMS: 30000,
    keepAlive: true,
    keepAliveInitialDelay: 300000
  }) // Adding new mongo url parser
  .then(() => {
    console.log('MongoDB Connected...');
    require('./models/User');
  })
  .catch(err => console.log(err));

// Use Routes
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
