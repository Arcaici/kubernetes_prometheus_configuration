const express = require('express');
const prometheus = require('prom-client');

const app = express();
const port = process.env.PORT || 3000;

/* Default labels for application metrics*/
/* and default metrics collection */
const prometheusRegistry = new prometheus.Registry();
prometheus.collectDefaultMetrics({ register: prometheusRegistry });
prometheusRegistry.setDefaultLabels({
  app: 'simulation'
})

/* Custom metrics */
const numberOfRequests = new prometheus.Counter({
  name: 'simulation_app_requests_total',
  help: 'Total number of requests to the simulation app',
  labelNames: ['method'],
  registers: [prometheusRegistry],
});

// Add a histogram for request durations
const requestDurationHistogram = new prometheus.Histogram({
  name: 'simulation_app_request_duration_seconds',
  help: 'Histogram of request durations for the simulation app',
  labelNames: ['route'],
  registers: [prometheusRegistry],
  buckets: [0.1, 0.5, 1, 2, 5], // Specify histogram buckets in seconds
});


/* application routes and logic */

app.use((req, res, next) => {
  numberOfRequests.inc({ method: req.method });

  // Start measuring request duration
  const end = requestDurationHistogram.startTimer();

  // Attach the histogram timer to the request for use in later middleware
  req.requestDurationTimer = end;

  next();
});

app.get('/', (req, res) => {
  res.send('Hello, this is your web server!');
  req.requestDurationTimer();
});

app.get('/error', (req, res) => {
  numberOfRequests.inc({ method: 'error' });
  // Simulate an error
  throw new Error('Simulated error');
});

app.get('/simulate-requests', (req, res) => {
  // Simulate some requests
  for (let i = 0; i < 5; i++) {
    console.log(`Processing request ${i + 1}`);
  }
  numberOfRequests.inc({ method: 'succeed' });
  res.send('Simulated requests completed!');
  req.requestDurationTimer();
});

/* metrics endpoint */
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  prometheusRegistry.metrics().then(data => res.status(200).send(data))
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// clear shutdown
process.on('SIGTERM', () => {
  clearInterval(metricsInterval)

  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    process.exit(0)
  })
})