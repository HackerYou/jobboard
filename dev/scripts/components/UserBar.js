import React from 'react';
import firebase from 'firebase';


class UserBar extends React.Component {
  constructor(props){
    super(props);

    this.submitUserName = this.submitUserName.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount(){

  }
submitUserName(e){
  e.preventDefault();
  console.log(this.state.newUserName)
  this.setState({
    newUserName: this.state.newUserName
  })
}
handleChange(e){
  e.preventDefault()
  this.setState({
    newUserName: e.target.value
  })
}
  render(){
    return(
      <div>
        <h1>you are logged in / this is the userbar</h1>

        <button onClick={this.props.signOut}>Sign out</button>
      </div>
    )
  }
}
export default UserBar;