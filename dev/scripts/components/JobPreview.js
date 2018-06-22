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
  archiveJob = (jobId) => {
    //get the job in the user's postedJobs list
    const userArchiveRef = firebase.database().ref(`users/${this.props.userId}/postedJobs/${this.props.jobId}`)
    //set the state of this component to archived: true
    this.setState({
      archived: true
    }, () => {
      //when the state is set, go to that job in the user's postedJobs list and change the value of archived to true
      userArchiveRef.update({
        archived: this.state.archived
      })

      //get the job in either the posted or pending list
      const jobRef = firebase.database().ref(`jobs/${this.props.approved ? 'approved': 'pending'}/${this.props.jobId}`)
      
      // create a local variable to hold our job information
      let job ={}
      
      // get all the job information that currently exists at that location 
      jobRef.once('value', snapshot => {
        job = snapshot.val();
      })
      // update the archived value to match the state 
      jobRef.update({
        archived: this.state.archived
      })
      //get the location in the archived list where this  job should live after it's archived 
      const archivedJobRef = firebase.database().ref(`jobs/archived/${this.props.jobId}`)
      
      // set the value of that node to be all the job information we got from line 49
      archivedJobRef.set(job)

      // delete the job from the pending or approved job list
      jobRef.remove()
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
        {this.props.showArchive && <button onClick={(jobId) => { this.archiveJob(this.props.jobId) }}>Archive Job</button>}
      </div>

    )
  }
}
export default JobPreview;