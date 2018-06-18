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
      <div>
        <p onClick={(jobId) => { this.props.showJobDetails(this.props.jobId) }}>{this.props.jobTitle}</p>
        <span >{this.props.companyName}</span> |
        <span>{this.props.jobLocation}</span>
        <span>Posted on {this.props.datePosted}</span>
        <button onClick={(jobId) => { this.props.saveJob(this.props.jobId) }}>Save Job</button>
        <button>Applied</button>
      </div>

    )
  }
}
export default JobPreview;