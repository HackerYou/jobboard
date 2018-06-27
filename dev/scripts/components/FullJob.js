import React from 'react';
import firebase from 'firebase';

class FullJob extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  render() {
    return (
      <div className="fullJob">
        <h3>this is full job: {this.props.jobId}</h3>
        <h2 className="jobTitle">{this.props.jobTitle}</h2>
        <p className="companyName">{this.props.companyName}</p>
        <p className="jobLocation">{this.props.jobLocation}</p>
        <p className="jobCommitment">{this.props.jobCommitment}</p>
        <p className="jobDescription">{this.props.jobDescription}</p>
      </div>
    )
  }
}
export default FullJob;