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
// Add a counter for request durations
const numberOfRequests = new prometheus.Counter({
  name: 'simulation_app_requests_total',
  help: 'Total number of requests to the simulation app',
  labelNames: ['method', 'route', 'statusCode'],
  registers: [prometheusRegistry],
});

// Add a histogram for request durations
const requestDurationHistogram = new prometheus.Histogram({
  name: 'simulation_app_request_duration_milliseconds',
  help: 'Histogram of request durations for the simulation app in milliseconds',
  labelNames: ['method', 'route', 'code'],
  registers: [prometheusRegistry],
  buckets: [1,2,3,4,5,10,25,50,100,250,500,1000],
});


/* application routes and logic */
app.use((req, res, next) => {
  res.locals.startEpoch = Date.now();
  numberOfRequests.labels({method: req.method, route: req.originalUrl, statusCode: res.statusCode}).inc();

  next();
});

app.get('/', (req, res) => {
  // Home page endpoint
  res.send('Hello, this is your web server!');
  const responseTimeInMilliseconds = Date.now() - res.locals.startEpoch;
  requestDurationHistogram.labels(req.method, req.route.path, res.statusCode).observe(responseTimeInMilliseconds)
});

app.get('/error', (req, res) => {
  numberOfRequests.inc({ method: 'error' });
  // Simulate an error
  throw new Error('Simulated error');
});

app.get('/simulate-requests', (req, res) => {
  // Simulate some requests

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // The simulated request has a random time of execution
  async function randomSleep() {
    const minDuration = 0.1 * 1000; 
    const maxDuration = 8 * 1000;  
  
    const randomDuration = Math.random() * (maxDuration - minDuration) + minDuration;
    
    console.log(`Sleeping for ${randomDuration / 1000} seconds...`);
    
    await sleep(randomDuration);
    
    console.log('Awake!');

    randomSleep()

    res.send('Simulated requests completed!');
    const responseTimeInMilliseconds = Date.now() - res.locals.startEpoch;
    requestDurationHistogram.labels(req.method, req.route.path, res.statusCode).observe(responseTimeInMilliseconds)

  }
  randomSleep();
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