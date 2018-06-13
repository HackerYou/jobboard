import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, NavLink, Route} from 'react-router-dom';
import firebase from 'firebase';
import ReadmeLoginForm from './components/ReadmeLoginForm';
import EmailLoginForm from './components/EmailLoginForm';
import UserBar from './components/UserBar';

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

  }
  componentDidMount(){
    // const dbRef = firebase.database().ref();

    // dbRef.on("value", function (snapshot) {
    //   console.log(snapshot.val());
    // }, function (errorObject) {
    //   console.log("The read failed: " + errorObject.code);
    // });
    firebase.auth().onAuthStateChanged(user => {

      if (user !== null) {
        // console.log(user)
        dbRef.on('value', snapshot => { });
        this.setState({
          loggedIn: true,
          userId: user.uid,
          userName: user.displayName            // provider won't stay on page reload
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
      .then(user => {
        this.setState({
          loggedIn: true
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

  render() {
    return (
        <div>
          {this.state.loggedIn ? (
            <div>
            <UserBar userId={this.state.userId} userName={this.state.userName} view={this.state.userView}/>
            </div>
          ) : (
              <div>
                <p>Sign up or sign in with</p>
                <button onClick={this.loginWithReadme}>Readme</button>
                <button onClick={this.loginWithGoogle}>Google</button>
                <button onClick={this.loginWithEmail}>Email</button>
                {this.state.loggedIn === false && this.state.provider ==='readme'&& <ReadmeLoginForm /> }
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
