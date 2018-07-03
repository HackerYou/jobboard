const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const admin = require('firebase-admin');
admin.initializeApp();


app.use(cors());

app.get('*', (req, res) => {
  const { keyword } = req.query;
    admin.database().ref('jobs/approved').once('value', (snapshot) => {
      const data = snapshot.val();

      const dataArray = Object.keys(data).map((key) => {
        data[key].key = key;
        return data[key];
      }).filter((job) => {
        return job.keywords.includes(keyword);
      });

      res.send(dataArray);
    });

});

module.exports = {
  searchKeywords: functions.https.onRequest((req, res) => {
    return app(req, res)
  })
};


