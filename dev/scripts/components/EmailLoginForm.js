import React from 'react';
import firebase from 'firebase';
import { Link, Route } from 'react-router-dom';

class EmailLoginForm extends React.Component {
  constructor(){
    super();
    this.state = {
      email:'',
      password:'',
      userSubmittedName:'',
      returningUser:''
    }
  }

  signInWithEmail = (e) =>{
    e.preventDefault();
    let email = this.state.email
    let password = this.state.password

    firebase.auth().signInWithEmailAndPassword(email, password).catch( (error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage, email, password);

      if (error.code === `auth/user-not-found`) {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch( (error)=> {
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log(errorCode, errorMessage)
        })
        .then(this.setUserInDB);
      }
      
    }).then(this.setUserInDB)
  }

  setUserInDB = (res) => {
      //get the information at the user's uid node in the user database
      const userRef = firebase.database().ref(`users/${res.user.uid}`)
      //if the user exists already in the database, return
      userRef.on('value', function (snapshot) {

        if (snapshot.val() === null){
          // else, create a user in the database 
          userRef.set({
            'name': this.state.userSubmittedName,
            'jobPoster': true,
            'alumni': false,
            'admin': false
          })
        }
      });
    }
  onChangeEmail = (e) => {
    this.setState({
      email: e.target.value
    })
  }
  onChangePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }
  onChangeUserSubmittedName = (e) => {
    this.setState({
      userSubmittedName: e.target.value
    })
  }
  returningUser = () =>{
    this.setState({
      returningUser:true
    })
  }
  createAccount = () =>{
    this.setState({
      returningUser: false
    })
  }
  
  render(){
    return(
      <div>
        <h3>Job Posters</h3>
        <button className="action" onClick={this.createAccount}>Create an Account</button>
        <button className="action" onClick={this.returningUser}>Returning User</button>

          <form action="submit" id="emailSignInForm" className="">
          {this.state.returningUser === false && 
            <div className="">
            <label htmlFor="userSubmittedName">
              <input type="userSubmittedName" name="userSubmittedName" id="userSubmittedName" required="false" placeholder="name" onChange={this.onChangeUserSubmittedName} value={this.state.userSubmittedName} />
            </label> 
            </div>
          }
          <div className="">
            <label htmlFor="email">
              <input type="email" name="email" id="" placeholder="email address" onChange={this.onChangeEmail} value={this.state.email} />
            </label>
          </div>  

          <div className="">
            <label htmlFor="password">
              <input type="password" name="password" placeholder="password" onChange={this.onChangePassword} value={this.state.password} />
            </label>
          </div>  
            <button className="action" onClick={this.signInWithEmail}>Sign In</button>
            <button className="login-button action" onClick={this.props.loginWithGoogle}>Log in with Google</button>

          </form>
      </div>
    )
  }
}
export default EmailLoginForm;