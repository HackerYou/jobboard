import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, NavLink, Route} from 'react-router-dom';
import firebase from 'firebase';
import LoginForm from './components/LoginForm'

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      // username:null,
      // loggedIn:false,
      // password:'',
      // email: ''
    }
    this.loginWithReadme = this.loginWithReadme.bind(this)

    this.onChangeEmail = this.onChangeEmail.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
    this.logOut = this.logOut.bind(this)

  }
  componentDidMount(){

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user)
        this.setState({
          loggedIn: true,
          buttonText:'Log out'
        })
        return;
      }
      this.setState({
        loggedIn: false,
        buttonText: 'Log in'

      })
    });

  }
  logOut(){

  }
loginWithReadme(e) {
    e.preventDefault();
    fetch(`https://notes-api.hackeryou.com/v2/user/firebaseAuth?email=${this.state.email}&password=${this.state.password}`)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        firebase.auth().signInWithCustomToken(res.token)
          .then(() => console.log('user logged in'))
          .catch(err => console.error(err));
      });
  }

  
  onChangeEmail(e){
    this.setState({
      email:e.target.value
    })
  }
  logOut(){
      firebase.auth().signOut();
  }
  
  onChangePassword(e){
    this.setState({
      password: e.target.value
    })
  }
  render() {
    return (
      <div>
        This is our job board!
        <div>
            {this.state.loggedIn ? (
              <div>i am logged in 

              <button onClick={this.logOut}>{this.state.buttonText}</button>

              </div>
            ) : (
              <div>

              <LoginForm />
              </div>
              )
            }
          </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
