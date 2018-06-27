const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const cors = require('cors')({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.searchKeywords = functions.https.onRequest((req, res) => {
  const { keyword } = req.query; 
  cors(req,res, () => {
      admin.database().ref('jobs/approved').once('value',(snapshot) => {
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
});
