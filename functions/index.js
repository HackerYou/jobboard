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
      // get all the data from the approved list
      const data = snapshot.val();
      const dataArray = Object.keys(data).map((key) => {
        data[key].key = key;
        return data[key];
      }).filter((job) => { 
        return job.keywords.includes(keyword);
      });
      
      const filteredData = dataArray.reduce((acc, cur)=>{
        acc[cur.key] = cur 
        return acc
      }, {})
      res.send(filteredData);
    });

});

module.exports = {
  searchKeywords: functions.https.onRequest((req, res) => {
    return app(req, res)
  })
};


