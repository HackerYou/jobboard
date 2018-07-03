import React from 'react';
import Search from './Search';


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
    return (
    <div className="userBar">
        <div className="logo">
          <img src="../../../assets/hy-logo-mark.svg" alt="HackerYou College of Technology Logo" /> 
        </div>
        

        {/* <div>Hi {this.props.userName ? this.props.userName 	
-                                   : <div>	
-                                    <input type="text" placeholder="your name here" onChange={this.handleChange}/>	
-                                    <button onClick={this.submitUserName}>Save Name</button> 	
-                                     </div>	
-              } !</div> */}
        <Search />
        <button onClick={this.props.signOut}>Sign out</button>
    </div>);
  }
}
export default UserBar;