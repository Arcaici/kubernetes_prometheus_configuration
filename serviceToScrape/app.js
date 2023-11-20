const express = require('express');
const Prometheus = require('prom-client');

const app = express();
const port = 3000;

const register = new Prometheus.Registry();
register.setDefaultLabels({
  app: 'simulationjs'
})
Prometheus.collectDefaultMetrics({register})


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

app.get('/metrics', (req, res) => {
  res.setHeader('Content-Type',register.contentType)
  register.metrics().then(data => res.status(200).send(data))
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
