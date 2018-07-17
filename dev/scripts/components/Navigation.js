import React from 'react';
import { NavLink, Link } from 'react-router-dom';

class Navigation extends React.Component {
  constructor(props){
    super(props);
    this.state={
      isChecked:false
    }
  }
  componentDidMount(){

  }
  toggleCheckboxChange = () => {
    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    this.props.handleCheckboxChange(this.props.word);
  }
  render(){
    return(
      <nav className="side-nav">
        <p className="user-name">{this.props.userName}</p>
        {this.props.admin && this.props.width <= 630 && <NavLink exact to="/" >Pending Jobs</NavLink>}
        {this.props.admin && this.props.width <= 630 && <NavLink  to="/approved">Approved Jobs</NavLink>}
        {this.props.admin && this.props.width <= 630 && <NavLink  to="/jobFeed">Job Feed</NavLink>}
        {this.props.alumni && <NavLink to="/jobFeed" onClick={this.props.toggleSideNav}>Find a Job</NavLink>}
        {this.props.alumni && <NavLink to="/mySavedJobs" onClick={this.props.toggleSideNav}>Saved Jobs</NavLink>}
        {this.props.jobPoster && <NavLink to="/myPostedJobs" onClick={this.props.toggleSideNav}>Posted Jobs</NavLink>}
        <NavLink to="/addJobForm" onClick={this.props.toggleSideNav}>Post a Job</NavLink>
        <NavLink to="/" onClick={this.props.signOut}>Sign Out</NavLink>
      </nav>
    )
  }
}
export default Navigation;

