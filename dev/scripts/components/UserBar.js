import React from 'react';
import Navigation from './Navigation';


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
        <div className="hamburger"><img src="../assets/icon-menu.svg" alt="Hamburger menu icon"/></div>
        <Navigation signOut={this.props.signOut}/>
      </div>
    )
  }
}
export default UserBar;