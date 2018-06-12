import React from 'react';
import firebase from 'firebase';


class GoogleLoginForm extends React.Component {
  constructor(){
    super();
    this.signOut = this.signOut.bind(this)
  }
  componentDidMount(){

  }
  signOut() {
    const dbRef = firebase.database().ref();

    firebase.auth().signOut();
    dbRef.off('value');
    this.setState({
      loggedIn: false,
      userID: ''
    });
  }
  render(){
    return(
        <div><button onClick={this.signOut}>Sign out of google </button></div>
    )
  }
}
export default GoogleLoginForm;