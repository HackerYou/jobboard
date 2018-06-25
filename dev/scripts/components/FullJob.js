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
      <div className="full-job">
        <h3>this is full job: {this.props.jobId}</h3>
        <h2>{this.props.jobTitle}</h2>
        <p>{this.props.companyName}</p>
        <p>{this.props.jobCommitment}</p>
        <p>{this.props.jobDescription}</p>
        <p>{this.props.jobLocation}</p>
      </div>
    )
  }
}
export default FullJob;