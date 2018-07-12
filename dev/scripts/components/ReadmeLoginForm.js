import React from 'react';
import firebase from 'firebase';

class ReadmeLoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      password: '',
      email: '',
      provider:'readme',
      isFirstLogin:false
    }
  }
  componentDidMount() {
  }
  signInWithReadme = (e) =>{
    e.preventDefault();
    fetch(`https://notes-api.hackeryou.com/v2/user/firebaseAuth?email=${this.state.email}&password=${this.state.password}`)
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          //if the token comes back, sign in with it
          firebase.auth().signInWithCustomToken(res.token)
          .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.error(error.code, error.message)
          })
          .then((res) =>{
            //if the user exists already in the database, don't do anything
            const userRef = firebase.database().ref(`users/${res.user.uid}`)
            //update the user's email in the auth table
            res.user.updateEmail(this.state.email).then( () =>{
              userRef.once('value', (snapshot) => {
                // see if there's anything at that location
                const userData = snapshot.val();
                // if not, create an entry for the user in the database 
                if (userData === null) {
                  userRef.set({
                    'name': res.user.displayName || res.user.email,
                    'alumni': true,
                    'jobPoster': true,
                    'admin': false
                  })
                }
                this.props.history.push('/')
              })
            })
          })
          
        } else {
          alert(`You must have a valid Readme account to use this sign in method.`)
        }
      })
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
  render() {
    return (
        <form action="submit" id="readmeSignInForm">
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
