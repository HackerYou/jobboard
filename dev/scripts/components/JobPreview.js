import React from 'react';
import firebase from 'firebase';

class JobPreview extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      jobKey: this.props.jobId,
      jobTitle: this.props.jobTitle,
      companyName: this.props.companyName,
      jobLocation: this.props.jobLocation,
      datePosted: this.props.datePosted
    })
  }
  componentDidMount() {

  }
  saveJob = (jobId)=> {
    const savedRef = firebase.database().ref(`users/${this.props.userId}/savedJobs/${this.props.jobId}`)
    savedRef.set({
      jobKey: jobId,
      jobTitle: this.state.jobTitle,
      companyName: this.state.companyName,
      jobLocation: this.state.jobLocation,
      datePosted: this.state.datePosted
    })
  }
  render() {
    return (
      <div>
        <p onClick={(jobId) => { this.props.showJobDetails(this.props.jobId) }}>{this.props.jobTitle}</p>
        <span >{this.props.companyName}</span> |
        <span>{this.props.jobLocation}</span>
        <span>Posted on {this.props.datePosted}</span>
        <button onClick={(jobId) => { this.saveJob(this.props.jobId) }}>Save Job</button> 
      </div>

    )
  }
}
export default JobPreview;