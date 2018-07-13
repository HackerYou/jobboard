import React from 'react';
import Navigation from './Navigation';
import TabNav from './TabNav';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


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
    return (
    <div className="userBar">
      <div className="infoUserBar">
        <div className="logo">
          <img src="../../../assets/hy-logo-mark.svg" alt="HackerYou College of Technology Logo" /> 
        </div>
        {this.props.admin && pathnames.indexOf(location.pathname) === -1 && <h2>Admin</h2>}
        {this.props.alumni && !this.props.admin && pathnames.indexOf(location.pathname) === -1 && <h2>Find A Job</h2>}
        {location.pathname === "/addJobForm" && <h2>Post A Job</h2>}
        {location.pathname === "/mySavedJobs" && <h2>My Saved Jobs</h2>}
        {location.pathname === "/myPostedJobs" && <h2>My Approved Jobs</h2>}

      </div>
      <div className="actionsUserBar">
        <TabNav admin={this.props.admin} jobPoster={this.props.jobPoster} alumni={this.props.alumni} />
        <div className={this.state.navOpen ? `side-nav-ex` : `hamburger-side-nav`}><img src={this.state.navOpen ? `../assets/icon-x.svg` : `../assets/icon-menu.svg`} alt={this.state.navOpen ? `Close icon` : `Menu icon`}  onClick={this.toggleSideNav}/></div>
        {this.state.navOpen && <Navigation admin={this.props.admin} userName={this.props.userName}  jobPoster={this.props.jobPoster} alumni={this.props.alumni} signOut={this.props.signOut} toggleSideNav={this.toggleSideNav}/> }
      </div>
    </div>
    )
  }
}
export default UserBar;