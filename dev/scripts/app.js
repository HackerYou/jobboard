import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, NavLink, Route} from 'react-router-dom';
import firebase from 'firebase';
import ReadmeLoginForm from './components/ReadmeLoginForm';
import EmailLoginForm from './components/EmailLoginForm';
import UserBar from './components/UserBar';
import { Z_DEFAULT_COMPRESSION } from 'zlib';

const config = {
  apiKey: "AIzaSyDhpZQDqygKV1G_ne9JJwxxWPnYYKxaX0Q",
  authDomain: "hy-jobs-board.firebaseapp.com",
  databaseURL: "https://hy-jobs-board.firebaseio.com",
  projectId: "hy-jobs-board",
  storageBucket: "hy-jobs-board.appspot.com",
  messagingSenderId: "1023755007156"
};
firebase.initializeApp(config);


class App extends React.Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false,
      userId: '', 
      provider:''    
    }

    this.loginWithReadme = this.loginWithReadme.bind(this)
    this.loginWithGoogle = this.loginWithGoogle.bind(this)
    this.loginWithEmail = this.loginWithEmail.bind(this)
    this.signOut = this.signOut.bind(this)
  }
  componentDidMount(){
    const dbRef = firebase.database().ref();

    firebase.auth().onAuthStateChanged(user => {

      if (user !== null) {
        // console.log(user)
        dbRef.on('value', snapshot => { });
        this.setState({
          loggedIn: true,
          userId: user.uid,
          userName: user.displayName
        });
      } else {
        this.setState({
          loggedIn: false,
          userId: '',
          userName: ''
        });
      }
    });
  } 

  onChangeEmail(e){
    this.setState({
      email:e.target.value
    })
  }

  
  onChangePassword(e){
    this.setState({
      password: e.target.value
    })
  }

  loginWithReadme(e){
    e.preventDefault();

    this.setState({
      provider:'readme'
    })
  }

  loginWithGoogle(e) {
    e.preventDefault();
    
    this.setState({
      provider: 'google'
    })

    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        this.setState({
          loggedIn: true
        });
        //find the user's uid from the firebase auth process
        const userRef = firebase.database().ref(`users/${res.user.uid}`)
        //if the user exists already in the database, return
        userRef.on('value', function (snapshot) {
          if (snapshot.val() !=null){
            console.log(snapshot.val())
          }else{
          // else, create a user in the database 
            userRef.set({
              'name':res.user.displayName,
              'jobPoster':true,
              'alumni':false,
              'admin':false
            })
          }
        });
      })
      .catch(err => {

      });

  }

  loginWithEmail(e) {
    e.preventDefault();
    this.setState({
      provider: 'email'
    })
  }

  signOut() {
    const dbRef = firebase.database().ref();

    firebase.auth().signOut();
    dbRef.off('value');
    this.setState({
      loggedIn: false,
      userId: '',
      provider:''
    });
  }
  render() {
    return (
        <div>
          {this.state.loggedIn ? (
            <div>
            <UserBar 
              userId={this.state.userId} 
              userName={this.state.userName} 
              userEmail ={this.state.email}
              loggedIn={this.state.loggedIn}
              provider={this.state.provider}
              signOut={this.signOut}
              />
            </div>
          ) : (
              <div>
                <p>Sign up or sign in with</p>
                <button onClick={this.loginWithReadme}>Readme</button>
                <button onClick={this.loginWithGoogle}>Google</button>
                <button onClick={this.loginWithEmail}>Email</button>
              {this.state.loggedIn === false && this.state.provider === 'readme' && <ReadmeLoginForm /> }
                {this.state.loggedIn === false && this.state.provider === 'google' && null}
                {this.state.loggedIn === false && this.state.provider === 'email' && <EmailLoginForm  />}
              </div>
            )
          }
        </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
