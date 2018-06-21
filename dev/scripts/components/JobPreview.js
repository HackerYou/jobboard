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
      datePosted: this.props.datePosted,
      approved: this.props.approved,
      archived: false
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
      datePosted: this.state.datePosted,
      archived: this.state.archived
    })
  }
  archiveJob = (jobID) => {
    const archiveRef = firebase.database().ref(`users/${this.props.userId}/postedJobs/${this.props.jobId}`)
    this.setState({
      archived: true
    }, () => {
      archiveRef.update({
        archived: this.state.archived
      })
      const jobRef = firebase.database().ref(`jobs/${this.props.approved ? 'approved': 'pending'}/${this.props.jobId}`)
      jobRef.update({
        archived: this.state.archived
      })
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
        {this.props.showArchive && <button onClick={(jobID) => { this.archiveJob(this.props.jobId) }}>Archive Job</button>}
      </div>

    )
  }
}
export default JobPreview;