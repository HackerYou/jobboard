import React from 'react';
import firebase from 'firebase';

class ReadmeLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.userName,
      loggedIn: false,
      password: '',
      email: '',
      provider:'readme'
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
          //if the token comes back, sign in with it
          firebase.auth().signInWithCustomToken(res.token)
          .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.error(error.code, error.message)
          })
          .then((res) =>{
            //get the user's uid from the auth portion of firebase
            let user = firebase.auth().currentUser
            
            //if the user exists already in the database
            const userRef = firebase.database().ref(`users/${user.uid}`)
              userRef.on('value', function (snapshot) {
                const userData = snapshot.val();

                //if the user already exists, return
                if (userData !=null) {
                  console.log(snapshot.val())
              } else {  
               // else create an entry for the user in the database 
                  userRef.set({
                    'name': user.displayName || '',
                    'alumni': true,
                    'jobPoster': true,
                    'admin':false
                  })
                }
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
