import React from 'react';
import Search from './Search'


class UserBar extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){

  }
submitUserName = (e) =>{
  e.preventDefault();
  this.setState({
    newUserName: this.state.newUserName
  })
}
handleChange = (e) =>{
  e.preventDefault()
  this.setState({
    newUserName: e.target.value
  })
}
  render(){
    return(
      <div className="user-bar">
        <h1>you are logged in / this is the userbar</h1>
        {/* <div>Hi {this.props.userName ? this.props.userName 	
-                                   : <div>	
-                                    <input type="text" placeholder="your name here" onChange={this.handleChange}/>	
-                                    <button onClick={this.submitUserName}>Save Name</button> 	
-                                     </div>	
-              } !</div> */}
        <button onClick={this.props.signOut}>Sign out</button>
        <Search />

      </div>
    )
  }
}
export default UserBar;