import React from 'react';

class FullJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applied: false
  }
}
  componentDidMount() {
    // console.log(this.props.applicationLink, this.props.addresseeEmail)
  }

  
  render() {
    return (
      <div className="full-job">
        <h2 className="job-title">{this.props.jobTitle}</h2>
        <span className="company-name">{this.props.companyName}</span><span className="job-location"> |  {this.props.jobLocation}</span>
        <p className="job-commitment">{this.props.jobCommitment}</p>
        <p className="job-description">{this.props.jobDescription}</p>
        {/* <p className="salary">Salary range: {this.props.salary}k</p> */}

        {this.props.applicationLink && <a className="action" target="_blank" href={this.props.applicationLink}>Apply Now</a>
          || this.props.addresseeEmail && <a className="action"
            href={`mailto:${this.props.addresseeEmail}?subject=${this.props.jobTitle}&body=Hi%20${this.props.addressee}`}>Apply Now</a>
      }
      </div>
    )
  }
}
export default FullJob;