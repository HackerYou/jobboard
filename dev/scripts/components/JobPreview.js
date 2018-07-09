import React from 'react';
import firebase from 'firebase';
import moment from 'moment';

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
      archived: this.props.archived,
      posterId: '',
      addressee: this.props.addressee
    })
  }
  componentDidMount(props) { 
    let jobPosterRef = firebase.database().ref(`jobs/${this.props.approved ? 'approved' : 'pending'}/${this.props.jobId}/posterId`)
    let localPosterId = ''
    
    jobPosterRef.once('value', snapshot => {
      localPosterId = snapshot.val()
    })
    this.setState({
      posterId: localPosterId
    })
    
  }
  saveJob = (jobId) => {
    console.log(this.props.jobId, this.props.userId, this.props.approved)
    // get the job in either the posted or pending list
    const jobRef = firebase.database().ref(`jobs/${this.props.approved ? 'approved' : 'pending'}/${this.props.jobId}`)
    // console.log(jobRef)
    // get all the job information that currently exists at that location 
    jobRef.once('value', snapshot => {
      // create a local variable to hold our job information
      const job = snapshot.val();
      //choose where we want to save the job in the user's profile
      const savedRef = firebase.database().ref(`users/${this.props.userId}/savedJobs/${this.props.jobId}`)

      // set the value of that node to be all the job information we got from the jobRef.once
      savedRef.set(job)
    })
    console.log(`savejob in job preview fired`, this.props.jobId, this.props.userId)
  }
  approveJob =  (jobId) =>{
    //get the job in the user's postedJobs list
    // const userApproveRef = firebase.database().ref(`users/${this.props.userId}/postedJobs/${this.props.jobId}`)
    // console.log(this.props.userId, this.props.jobId)
    //set the state of this component to archived: true
    this.setState({
      approved: true
    }, () => {

        //get the job in either the posted or pending list
        const jobRef = firebase.database().ref(`jobs/pending/${this.props.jobId}`)

        // update the approved value to match the state 
          jobRef.update({
            approved: this.state.approved
          })
        // get all the job information that currently exists at that location 
        jobRef.once('value', snapshot => {

          // create a local variable to hold our job information
          const job = snapshot.val();

          //get the location in the archived list where this  job should live after it's archived 
          const approvedJobRef = firebase.database().ref(`jobs/approved/${this.props.jobId}`)

          // set the value of that node to be all the job information we got from line 49
          approvedJobRef.set(job)

          // delete the job from the pending or approved job list
          jobRef.remove()
        })
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
  render() {
    const classes = moment(this.props.datePosted, 'YYYYMMDD').isBefore(moment().subtract(24, 'hours')) ? 'job-preview' : 'job-preview job-preview-recent';
    return (
      <div className={this.props.active} className={classes}>
        <p onClick={(e) => { this.props.showJobDetails(this.props.jobId) }}>{this.props.jobTitle}</p>
        <span >{this.props.companyName}</span> |
        <span>{this.props.jobLocation}</span>
        <span>Posted {moment(this.props.datePosted, 'YYYYMMDD').endOf('day').fromNow()}</span>

        {this.props.admin && this.props.approved === false && <button className="action" onClick={(e) => { this.approveJob(this.props.jobId) }}>Approve Job</button>}

        {this.props.userId === this.state.posterId && <button className="action" onClick={(e) => { this.archiveJob(this.props.jobId) }}>Archive Job</button> || this.props.admin && <button className="action" onClick={(e) => { this.archiveJob(this.props.jobId) }}>Archive Job</button> }

        {this.props.alumni && this.props.admin === false && <button className="action" onClick={(e) => { this.saveJob(this.props.jobId) }}>Save Job</button>} 
      </div>
  
    )
  }
}
export default JobPreview;