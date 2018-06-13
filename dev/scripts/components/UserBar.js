import React from 'react';
import firebase from 'firebase';


class UserBar extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){

  }
  render(){
    return(
      <div>
        <h1>you are logged in / this is the userbar</h1>
          <p>{this.props.provider}</p>
            <button onClick={this.props.signOut}>Sign out</button>
        <p>Hi {this.props.userName ? this.props.userName : 'there'}!</p>
      </div>
    )
  }
}
export default UserBar;