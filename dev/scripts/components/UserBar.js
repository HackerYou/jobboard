import React from 'react';
import Navigation from './Navigation';
import TabNav from './TabNav';
import classnames from 'classnames';

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
    const pathnames = ['/addJobForm', '/mySavedJobs', '/myPostedJobs'];
    const userBarClasses = classnames('userBar', {
      "adminUserBar": this.props.admin,
    });
    return (
    <div className={userBarClasses}>
      <div className="infoUserBar">
        <div className="logo">
          <img src="../../../assets/hy-logo-mark.svg" alt="HackerYou College of Technology Logo" /> 
        </div>
        {this.props.admin && pathnames.indexOf(location.pathname) === -1 && <h2>Admin</h2>}
        {this.props.alumni && !this.props.admin && pathnames.indexOf(location.pathname) === -1 && <h2>Find A Job</h2>}
        {location.pathname === "/addJobForm" && <h2>Post A Job</h2>}
        {location.pathname === "/mySavedJobs" && <h2>My Saved Jobs</h2>}
        {location.pathname === "/myPostedJobs" || this.props.jobPoster && !this.props.admin && !this.props.alumni && pathnames.indexOf(location.pathname) === -1 && <h2>My Approved Jobs</h2>}

      </div>
      <div className="actionsUserBar">
        <TabNav admin={this.props.admin} jobPoster={this.props.jobPoster} alumni={this.props.alumni} width={this.props.width}/>
        <div className={this.state.navOpen ? `side-nav-ex` : `hamburger-side-nav`}><img src={this.state.navOpen ? `../assets/icon-x.svg` : `../assets/icon-menu.svg`} alt={this.state.navOpen ? `Close icon` : `Menu icon`}  onClick={this.toggleSideNav}/></div>
        {this.state.navOpen && <Navigation admin={this.props.admin} userName={this.props.userName}  jobPoster={this.props.jobPoster} alumni={this.props.alumni} signOut={this.props.signOut} toggleSideNav={this.toggleSideNav} width={this.props.width}/> }
      </div>
    </div>
    )
  }
}
export default UserBar;