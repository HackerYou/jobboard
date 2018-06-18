import React from 'react';
import firebase from 'firebase';

class JobPreview extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {

  }
  render() {
    return (
      <div onClick={(jobId) =>{this.props.showJobDetails(this.props.jobId)} }>
        <p>{this.props.jobTitle}</p>
        <span>{this.props.companyName}</span> |
        <span>{this.props.jobLocation}</span>
        <span>Posted on {this.props.datePosted}</span>
      </div>

    )
  }
}
export default JobPreview;