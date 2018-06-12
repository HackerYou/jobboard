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
    })
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
        <p>Sign in to create an account</p>
        <form action="" id="emailSignInForm">
          <label htmlFor="">email:</label>
          <input type="email" name="email" id="" placeholder="enter your email" onChange={this.onChangeEmail} value={this.state.email} />
          <label htmlFor="">password:</label>
          <input type="password" name="password" placeholder="enter your password" onChange={this.onChangePassword} value={this.state.password} />
          <input type="submit" onClick={this.signInWithEmail} />
        </form>
      </div>
    )
  }
}
export default EmailLoginForm;