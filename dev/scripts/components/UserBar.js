import React from 'react';
import firebase from 'firebase';


class UserBar extends React.Component {
  constructor(props){
    super(props);
    this.signOut = this.signOut.bind(this)
  }
  componentDidMount(){
    // const ref = firebase.database().ref(`views/admin/${this.props.userId}`);

    // ref.on("value", function (snapshot) {
    //   console.log(snapshot.val());
    // }, function (errorObject) {
    //   console.log("The read failed: " + errorObject.code);
    // });

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
        <h1>you are logged in / this is the userbar</h1>
            <button onClick={this.signOut}>Sign out</button>
        <p>Hi {this.props.userName ? this.props.userName : 'there'}!</p>
      </div>
    )
  }
}
export default UserBar;