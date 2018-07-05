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
        <NavLink to="/addJobForm">Post a Job</NavLink>
        <NavLink to="/mySavedJobs">Saved Jobs</NavLink>
        <button onClick={this.props.signOut}>Sign Out</button>
      </nav>
    )
  }
}
export default Navigation;

