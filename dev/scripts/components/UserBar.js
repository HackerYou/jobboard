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
        {this.props.admin && <h2>Admin</h2>}

        <TabNav admin={this.props.admin} jobPoster={this.props.jobPoster} alumni={this.props.alumni} />
        <div className={this.state.navOpen ? `side-nav-ex` : `hamburger-side-nav`}><img src={this.state.navOpen ? `../assets/icon-x.svg` : `../assets/icon-menu.svg`} alt={this.state.navOpen ? `Close icon` : `Menu icon`}  onClick={this.toggleSideNav}/></div>
        {this.state.navOpen && <Navigation admin={this.props.admin} userName={this.props.userName}  jobPoster={this.props.jobPoster} alumni={this.props.alumni} signOut={this.props.signOut} toggleSideNav={this.toggleSideNav}/> }
      </div>
    )
  }
}
export default UserBar;