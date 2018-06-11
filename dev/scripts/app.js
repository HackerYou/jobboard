import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, NavLink, Route} from 'react-router-dom';
import axios from 'axios';
import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyD2e9M8yWeL6_pQCH9PKoEE4Uvnseciahk",
  authDomain: "job-board-3ae3c.firebaseapp.com",
  databaseURL: "https://job-board-3ae3c.firebaseio.com",
  projectId: "job-board-3ae3c",
  storageBucket: "job-board-3ae3c.appspot.com",
  messagingSenderId: "1035884032107"
};
firebase.initializeApp(config);

class App extends React.Component {
  render() {
    return (
      <div>
        This is our job board!
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
