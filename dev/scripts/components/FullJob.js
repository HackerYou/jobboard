import React from 'react';
import firebase from 'firebase';

class FullJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applied: false
  }
}
  componentDidMount() {

  }

  
  render() {
    return (
      <div className="fullJob">
        <h2 className="jobTitle">{this.props.jobTitle}</h2>
        <p className="companyName">{this.props.companyName}</p>
        <p className="jobLocation">{this.props.jobLocation}</p>
        <p className="jobCommitment">{this.props.jobCommitment}</p>
        <p className="jobDescription">{this.props.jobDescription}</p>
        <a className="action" href={this.props.applicationLink ? this.props.applicationLink : `mailto:${this.props.addresseeEmail}?subject=${this.props.jobTitle}&body=Hi%20${this.props.addressee}`}>Apply Now</a>
      </div>
    )
  }
}
export default FullJob;