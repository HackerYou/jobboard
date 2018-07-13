import React from 'react';
import { NavLink } from 'react-router-dom';

class TabNav extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <nav className='tab-nav'>
        {this.props.admin && <NavLink exact to="/" >Pending Jobs</NavLink>}
        {this.props.admin && <NavLink  to="/approved">Approved Jobs</NavLink>}
        {this.props.admin && <NavLink  to="/jobFeed">Job Feed</NavLink>}
      </nav>
    )
  }
}
export default TabNav;

