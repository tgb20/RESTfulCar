import config from "./config.json";
import express from 'express';
import axios from 'axios';


const app = express();
const port = config.port;

app.get('/charge', (req, res) => {

  axios.post('https://api.autopi.io/auth/login/', {
    username: config.autopi_username,
    email: config.autopi_email,
    password: config.autopi_password
  })
    .then((response) => {

      let token = response.data.token;

      let currentTime = new Date(Date.now() - 3600000).toISOString();


      axios.get(`https://api.autopi.io/logbook/storage/read/?device_id=fbb8ceb7-f437-4755-9d27-489e17d628e8&field=obd.batt-soc.value&field_type=long&from_utc=${currentTime}`, {
        headers: {
          'Authorization': `bearer ${token}`
        }
      }).then((response) => {

        let charge = response.data[response.data.length - 1].value;
        res.json(
          {
            'frames': [
              {
                'text': `${charge}%`,
                'icon': 'i39605'
              }
            ]
          }
        );

      }).catch((error) => {
        console.log(error);
        res.json({ error: error });
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({ error: error });
    });


});

app.listen(port, () => {
  console.log(`RESTfulCar listening on port: ${port}`);
});
