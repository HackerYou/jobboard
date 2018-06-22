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
      archived: this.props.archived
    })
  }
  componentDidMount() { 
    console.log(this.state.archived)
  }
  saveJob = (jobId)=> {
<<<<<<< Updated upstream
    //get the job in either the posted or pending list
    const jobRef = firebase.database().ref(`jobs/${this.props.approved ? 'approved' : 'pending'}/${this.props.jobId}`)

    
    // get all the job information that currently exists at that location 
    jobRef.once('value', snapshot => {
      // create a local variable to hold our job information
      const job = snapshot.val();
      //choose where we want to save the job in the user's profile
      const savedRef = firebase.database().ref(`users/${this.props.userId}/savedJobs/${this.props.jobId}`)
  
      // set the value of that node to be all the job information we got from the jobRef.once
      savedRef.set(job)
=======
    const savedRef = firebase.database().ref(`users/${this.props.userId}/savedJobs/${jobId}`)
    console.log(this.props.userId)
    savedRef.set({
      jobKey: jobId,
      jobTitle: this.state.jobTitle,
      companyName: this.state.companyName,
      jobLocation: this.state.jobLocation,
      datePosted: this.state.datePosted
>>>>>>> Stashed changes
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
      
      
      // get all the job information that currently exists at that location 
      jobRef.once('value', snapshot => {
        // create a local variable to hold our job information
        const job = snapshot.val();
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
  })

  }
  approveJob = (jobId) => {
    const dbRef = firebase.database().ref(`jobs/approved/${jobId}`)
    console.log(dbRef)
    dbRef.on('value', snapshot => {
        console.log(snapshot.val())
    })
  }
  render() {
    return (
      <div>
          <p onClick={(jobId) => { this.props.showJobDetails(this.props.jobId) }}>{this.props.jobTitle}</p>
          <span >{this.props.companyName}</span> |
        <span>{this.props.jobLocation}</span>
<<<<<<< Updated upstream
          <span>Posted on {this.props.datePosted}</span>
          <button onClick={(jobId) => { this.saveJob(this.props.jobId) }}>Save Job</button>
          {this.props.showArchive && <button onClick={(jobId) => { this.archiveJob(this.props.jobId) }}>Archive Job</button>}
        </div>
  
=======
        <span>Posted on {this.props.datePosted}</span>
        <button onClick={(jobId) => { this.saveJob(this.props.jobId) }}>Save Job</button> 
        <button onClick={(jobId) => { this.approveJob(this.props.jobId)} }>Approve Job</button>
      </div>

>>>>>>> Stashed changes
    )
  }
}
export default JobPreview;