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
  }
  componentDidMount() {
    document.getElementById('readmeSignInForm').addEventListener('submit', function (e) {
      e.preventDefault();
      fetch(`https://notes-api.hackeryou.com/v2/user/firebaseAuth?email=${this.email.value}&password=${this.password.value}`)
        .then(res => res.json())
        .then(res => {
          console.log(res.token);
          firebase.auth().signInWithCustomToken(res.token)
            .then(() => console.log('user logged in'))
            .catch(err => console.error(err));
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
  render() {
    return (
        <form action="" id="readmeSignInForm">
          <label htmlFor="">email:</label>
          <input type="email" name="email" id="" placeholder="enter your readme email" onChange={this.onChangeEmail} value={this.state.email} />
          <label htmlFor="">password:</label>
          <input type="password" name="password" placeholder="enter your readme password" onChange={this.onChangePassword} value={this.state.password} />
          <input type="submit" />
        </form>
    )
  }
}

export default ReadmeLoginForm;
