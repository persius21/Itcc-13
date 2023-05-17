const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

console.log('running program')

// Connect to the database
const db = new sqlite3.Database('C:/Users/Vinni/Desktop/Itcc 13/Survey.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the survey database.');
});

// Create instance of Express application
const app = express();

// Middleware to parse HTTP request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" folder
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
    fs.readFile('./index.html', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error loading index.html');
        } else {
          res.send(data);
        }
      });

  
});



app.post('/submit', (req, res) => {
  const name = req.body.q1;
  const email = req.body.q2;
  const source = req.body.q3;
  const feedback = req.body.q4;

  // Insert survey response into the database
  db.run('INSERT INTO survey_responses(question1, question2, question3, question4) VALUES (?, ?, ?, ?)', [name, email, source, feedback], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to submit the form. Please try again later.' });
    } else {
      res.json({ message: 'Thank you for your response!' });
    }
  });
});



// Start server and listen for incoming requests
const port = process.env.PORT || 3000; // use PORT from .env file, or default to 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});