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
      password:''
    }
  }
  componentDidMount(){
  }
  signInWithEmail(e){
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
      console.log(res)
        //get the information at the user's uid node in the user database
        const userRef = firebase.database().ref(`users/${res.user.uid}`)
        
        //if the user exists already in the database, return
        userRef.on('value', function (snapshot) {

          if (snapshot.val() != null) {
            console.log(snapshot.val())
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
  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    })
  }
  onChangePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  
  render(){
    return(
      <div>
        <form action="" id="emailSignInForm">
          <label htmlFor="">email:</label>
          <input type="email" name="email" id="" placeholder="enter your email" onChange={this.onChangeEmail} value={this.state.email} />
          <label htmlFor="">password:</label>
          <input type="password" name="password" placeholder="enter your password" onChange={this.onChangePassword} value={this.state.password} />
          <input type="submit" onClick={this.signInWithEmail} />
        </form>
        <p>signing in will create an account if you don't already have one!</p>
      </div>
    )
  }
}
export default EmailLoginForm;