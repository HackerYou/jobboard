import React from 'react';
import firebase from 'firebase';


class UserBar extends React.Component {
  constructor(props){
    super(props);
    this.signOut = this.signOut.bind(this)
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
      <div>
        This is userbar
            <button onClick={this.signOut}>Sign out</button>
        <p>Hi {this.props.userName ? this.props.userName : 'there'}!</p>
        {}
      </div>
    )
  }
}
export default UserBar;