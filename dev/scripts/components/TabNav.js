import React from 'react';
import { NavLink } from 'react-router-dom';

class TabNav extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <nav className='tabNav'>
        {this.props.admin && <NavLink to="/pending" >Pending Jobs</NavLink>}
        {this.props.admin && <NavLink to="/approved">Approved Jobs</NavLink>}
        {this.props.admin && <NavLink to="/jobFeed">All Posted Jobs</NavLink>}
        {this.props.jobPoster && <NavLink to="/myPostedJobs">My Posted Jobs</NavLink>}
        {this.props.alumni && <NavLink to="/jobFeed">Job Feed</NavLink>}
      </nav>
    )
  }
}
export default TabNav;

