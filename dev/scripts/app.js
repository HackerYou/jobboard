import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, NavLink, Route} from 'react-router-dom';
import axios from 'axios';
import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyDhpZQDqygKV1G_ne9JJwxxWPnYYKxaX0Q",
  authDomain: "hy-jobs-board.firebaseapp.com",
  databaseURL: "https://hy-jobs-board.firebaseio.com",
  projectId: "hy-jobs-board",
  storageBucket: "hy-jobs-board.appspot.com",
  messagingSenderId: "1023755007156"
};
firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      userID: ''
    };
  }
  componentDidMount() {
    const dbRef = firebase.database().ref();

    firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
       dbRef.on('value', snapshot => {});
        this.setState({
          loggedIn: true,
          userID: user.uid,
          userName: user.displayName
        });
      } else {
        this.setState({
          loggedIn: false,
          userID: '',
          userName: ''
        });
      }
    });
  }

  signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then
        console.log("we're in");
        (user => {
        this.setState({
          loggedIn: true
        });
      })
      .catch(err => {
        console.log("no good.");
      });
  }

  signOut() {
    firebase.auth().signOut();
    dbRef.off('value');
    this.setState({
      loggedIn: false,
      userID: ''
    });
  }


  render() {
    return (
      <div>
        <h1>Welcome to our Job Board!</h1>
        {this.state.loggedIn === false ? (
          <button onClick={this.signIn}>Sign In.</button>
        ) : (
          <button onClick={this.signOut}>Sign Out.</button>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
