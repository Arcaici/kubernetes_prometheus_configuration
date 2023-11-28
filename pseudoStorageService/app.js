const express = require('express');
const fs = require('fs');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const port = 3001;

// HTTP function to retrieve data from prometheus query api
async function fetchDataAndSave() {
  try {
    const response = await axios.get('http://prometheus.monitoring.svc.cluster.local:9090/api/v1/query?query={__name__!=""}');
    const jsonData = response.data;

    const timestamp = new Date().toISOString();
    const filename = `data_${timestamp}.json`;

    fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
    console.log(`Data saved to ${filename}`);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

// Schedule the fetchDataAndSave function to run every 30 seconds
cron.schedule('*/30 * * * * *', fetchDataAndSave);

// Endpoint to retrieve the last saved JSON file
app.get('/lastData', (req, res) => {
  const files = fs.readdirSync(__dirname);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  if (jsonFiles.length === 0) {
    return res.status(404).send('No data available.');
  }

  const lastFile = jsonFiles.reduce((a, b) => (fs.statSync(a).mtime > fs.statSync(b).mtime ? a : b));

  const jsonData = fs.readFileSync(lastFile, 'utf-8');
  res.json(JSON.parse(jsonData));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
