require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;


let batterySOC = 0;
let chargeLevel = 0;

getNewestData();

setTimeout(() => {
  getNewestData();
}, 600000);


app.get('/lametric', (req, res) => {
  res.json(
    {
      'frames': [
        {
          'text': `${batterySOC}%`,
          'icon': 'i39605',
          'index': 0
        }
      ]
    }
  );
});

app.get('/data', (req, res) => {
  res.json(
    {
      'batterySOC': batterySOC,
      'chargeLevel': chargeLevel
    }
  );
});

function getNewestData() {

  let oneWeekAgo = new Date(Date.now() - 6.048e+8).toISOString();

  axios.get(`https://api.autopi.io/logbook/storage/read/?device_id=fbb8ceb7-f437-4755-9d27-489e17d628e8&field=obd.batt-soc.value&field_type=long&from_utc=${oneWeekAgo}`, {
    headers: {
      'Authorization': `APIToken ${process.env.API_KEY}`
    }
  }).then((response) => {
    batterySOC = response.data[response.data.length - 1].value;
  }).catch((error) => {
    console.log(error);
  });

  axios.get(`https://api.autopi.io/logbook/storage/read/?device_id=fbb8ceb7-f437-4755-9d27-489e17d628e8&field=obd.charger-level.value&field_type=long&from_utc=${oneWeekAgo}`, {
    headers: {
      'Authorization': `APIToken ${process.env.API_KEY}`
    }
  }).then((response) => {
    chargeLevel = response.data[response.data.length - 1].value;
  }).catch((error) => {
    console.log(error);
  });
}

app.listen(port, () => {
  console.log(`RESTfulCar listening on port: ${port}`);
});
