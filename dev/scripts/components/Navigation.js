import React from 'react';
import { NavLink } from 'react-router-dom';

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
      <nav className="sideNav">
        {this.props.alumni && <NavLink to="/jobFeed" onClick={this.props.toggleSideNav}>Find a Job</NavLink>}
        {this.props.alumni && <NavLink to="/mySavedJobs" onClick={this.props.toggleSideNav}>Saved Jobs</NavLink>}
        {this.props.jobPoster && <NavLink to="/myPostedJobs" onClick={this.props.toggleSideNav}>Posted Jobs</NavLink>}

        <NavLink to="/addJobForm" onClick={this.props.toggleSideNav}>Post a Job</NavLink>
        <button onClick={this.props.signOut}>Sign Out</button>
      </nav>
    )
  }
}
export default Navigation;

