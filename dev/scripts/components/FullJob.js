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
  // handleClick = (e) => {
  //   e.preventDefault();

  // }
  
  render() {
    return (
      <div className="fullJob">
        <h3>this is full job: {this.props.jobId}</h3>
        <h2 className="jobTitle">{this.props.jobTitle}</h2>
        <p className="companyName">{this.props.companyName}</p>
        <p className="jobLocation">{this.props.jobLocation}</p>
        <p className="jobCommitment">{this.props.jobCommitment}</p>
        <p className="jobDescription">{this.props.jobDescription}</p>

        {/* {this.props.addressee.includes("@") ? <a href={`mailto:${this.props.addressee}`}>Apply Email</a> : <a href={`${this.props.addressee}`} target="_blank">Apply URL</a>} */}
      

      </div>
    )
  }
}
export default FullJob;