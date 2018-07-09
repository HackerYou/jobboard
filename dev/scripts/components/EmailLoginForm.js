import React from 'react';
import firebase from 'firebase';

class EmailLoginForm extends React.Component {
  constructor(){
    super();
    // this.loginWithGoogle = this.loginWithGoogle.bind(this)
    // this.signOut = this.signOut.bind(this)
    this.onChangeEmail = this.onChangeEmail.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
    this.signInWithEmail = this.signInWithEmail.bind(this)

    this.state = {
      email:'',
      password:'',
      userSubmittedName:''
    }
  }
  componentDidMount(){
  }
  signInWithEmail = (e) =>{
    e.preventDefault();
    let email = this.state.email
    let password = this.state.password
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage, email, password);

      if (error.code === `auth/user-not-found`) {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log(errorCode, errorMessage)
        });
      } else {
        return
      }
      
    }).then( (res) => {
        //get the information at the user's uid node in the user database
        const userRef = firebase.database().ref(`users/${res.user.uid}`)
        
        //if the user exists already in the database, return
        userRef.on('value', function (snapshot) {

          if (snapshot.val() != null) {
          } else {
            // else, create a user in the database 
            userRef.set({
              'name': res.user.displayName || '' ,
              'jobPoster': true,
              'alumni':false,
              'admin':false
            })
          }
        });
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

  
  render(){
    return(
      <div>
        <h3>Job Posters</h3>
        <p>Logging in will create an account if you don't already have one</p>
        <form action="submit" id="emailSignInForm">
          <label htmlFor="userSubmittedName">
            <input type="userSubmittedName" name="userSubmittedName" id="userSubmittedName" required="false" placeholder="name" onChange={this.onChangeEmail} value={this.state.userSubmittedName} />
          </label>
          <label htmlFor="email">
            <input type="email" name="email" id="" placeholder="email address" onChange={this.onChangeEmail} value={this.state.email} />
          </label>
          <label htmlFor="password">
            <input type="password" name="password" placeholder="password" onChange={this.onChangePassword} value={this.state.password} />
          </label>
          <button className="action" onClick={this.signInWithEmail}>Sign In</button>
        </form>
        <button className="login-button action" onClick={this.props.loginWithGoogle}>Log in with Google</button>

      </div>
    )
  }
}
export default EmailLoginForm;