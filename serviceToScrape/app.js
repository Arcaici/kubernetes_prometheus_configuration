const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, this is your web server!');
});

app.get('/simulate-requests', (req, res) => {
  // Simulate some requests
  for (let i = 0; i < 5; i++) {
    console.log(`Processing request ${i + 1}`);
  }

  res.send('Simulated requests completed!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
