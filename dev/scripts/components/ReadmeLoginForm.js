import React from 'react';
import firebase from 'firebase';

class ReadmeLoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null,
      loggedIn: false,
      password: '',
      email: ''
    }
    this.onChangeEmail = this.onChangeEmail.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
    this.signInWithReadme = this.signInWithReadme.bind(this)

  }
  componentDidMount() {
  }
  signInWithReadme(e){
    e.preventDefault();
    fetch(`https://notes-api.hackeryou.com/v2/user/firebaseAuth?email=${this.state.email}&password=${this.state.password}`)
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          firebase.auth().signInWithCustomToken(res.token)
            .catch((error) => {
              let errorCode = error.code;
              let errorMessage = error.message;
              console.error(error.code, error.message)
            });
        } else {
          alert(`You must have a valid Readme account to use this sign in method.`)
        }
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
  render() {
    return (
        <form action="" id="readmeSignInForm">
          <label htmlFor="">email:</label>
          <input type="email" name="email" id="" placeholder="enter your readme email" onChange={this.onChangeEmail} value={this.state.email} />
          <label htmlFor="">password:</label>
          <input type="password" name="password" placeholder="enter your readme password" onChange={this.onChangePassword} value={this.state.password} />
          <input type="submit" onClick={this.signInWithReadme}/>
        </form>
    )
  }
}

export default ReadmeLoginForm;
