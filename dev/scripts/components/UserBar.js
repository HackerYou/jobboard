import React from 'react';
import Navigation from './Navigation';
import TabNav from './TabNav';

class UserBar extends React.Component {
  constructor(props){
    super(props);
    this.state={
      navOpen:false
    }
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
toggleSideNav=() =>{
  this.setState({
    navOpen: !this.state.navOpen
  })
}
  render(){
    return (
    <div className="userBar">
        <div className="logo">
          <img src="../../../assets/hy-logo-mark.svg" alt="HackerYou College of Technology Logo" /> 
        </div>
        <div className={this.state.navOpen ? `sideNavEx` : `hamburgerSideNav`}><img src={this.state.navOpen ? `../assets/icon-x.svg` : `../assets/icon-menu.svg`} alt={this.state.navOpen ? `Close icon` : `Menu icon`}  onClick={this.toggleSideNav}/></div>
        {this.state.navOpen && <Navigation signOut={this.props.signOut} />}
        <TabNav admin={this.props.admin} jobPoster={this.props.jobPoster} alumni={this.props.alumni} />
      </div>
    )
  }
}
export default UserBar;