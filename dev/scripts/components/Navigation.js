import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from "prop-types";

class Navigation extends React.Component {
  static propTypes = {
    updateUserName: PropTypes.func
  }

  constructor(props){
    super(props);
    this.state={
      isChecked:false,
      disabled: true
    }
  }

  editClick = () => {
    this.setState({ disabled: !this.state.disabled })
  } 

  toggleCheckboxChange = () => {
    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    this.props.handleCheckboxChange(this.props.word);
  }

  handleChange = event => {
    const updatedName = { userName: event.currentTarget.value };
    this.props.updateUserName(this.props.index, updatedName);
  };

  render(){
    return(
      <nav className="side-nav">
        <input
          className={this.state.disabled ? "user-name-disabled" : "user-name-enabled"}
          type="text"
          name="name"
          disabled={this.state.disabled && "disabled"}
          onChange={this.handleChange}
          value={this.props.userName}
        />
        <button className="edit-name" onClick={() => this.editClick()}>{this.state.disabled ? "Edit name ▲" : "Save name ▼"}</button>
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

