import React from 'react';
import firebase from 'firebase';
import moment from 'moment';
import classnames from 'classnames';

moment.updateLocale('en', {
  relativeTime: {
      future: "in %s",
      past: "%s ago",
      s:  "today",
      m:  "today",
      mm: "today",
      h:  "today",
      hh: "today",
      d:  "1 day",
      dd: "%d days",
  }
});

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
    // get the job in either the posted or pending list
    const jobRef = firebase.database().ref(`jobs/${this.props.approved ? 'approved' : 'pending'}/${this.props.jobId}`);

    // get all the job information that currently exists at that location 
    jobRef.once('value', snapshot => {
      // create a local variable to hold our job information
      const job = snapshot.val();
      //choose where we want to save the job in the user's profile
      const savedRef = firebase.database().ref(`users/${this.props.userId}/savedJobs/${this.props.jobId}`);
      // set the value of that node to be all the job information we got from the jobRef.once
      if(this.props.savedList) {
        savedRef.remove();
      }
      else {
        savedRef.set(job);
      }
    })
  }

  approveJob = (jobId) => {

      //get the job in either the posted or pending list
      const jobRef = firebase.database().ref(`jobs/pending/${this.props.jobId}`)

      // update the approved value to match the state 
      jobRef.update({
        approved: true
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
      this.props.removePendingJob(jobId);
  }

  archiveJob = (jobId) => {
    //get the job in the user's postedJobs list
    const userArchiveRef = firebase.database().ref(`users/${this.props.userId}/postedJobs/${this.props.jobId}`)
    
      //when the state is set, go to that job in the user's postedJobs list and change the value of archived to true
      userArchiveRef.update({
        archived: true
      })

      //get the job in either the posted or pending list
      const jobRef = firebase.database().ref(`jobs/${this.props.approved ? 'approved' : 'pending'}/${this.props.jobId}`)


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
  }
  render() {

    const jobPreviewClasses = classnames('job-preview', {
      'showing-job': this.props.active,
      'job-preview-recent': moment(this.props.datePosted, 'YYYYMMDD').isBefore(moment().subtract(24, 'hours')) === false
    });
    return (
      <div className={jobPreviewClasses} >
        <div className="left" onClick={() => { this.props.showJobDetails(this.props.jobId) }}>
          <p className="job-title">{this.props.jobTitle}</p>
          <span className="company-name" >{this.props.companyName}</span> | &nbsp;
          <span className="job-location">{this.props.jobLocation}</span>
          {this.props.width <= 630 && <p className="posted-on">Posted {moment().format('YYYYMMDD') === moment(this.props.datePosted, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD') ? 'yesterday' : moment().format('YYYYMMDD') === moment(this.props.datePosted, 'YYYYMMDD').format('YYYYMMDD') ? moment(this.props.datePosted, 'YYYYMMDD').endOf('day').fromNow(true) : moment(this.props.datePosted, 'YYYYMMDD').endOf('day').fromNow() }</p>}
        </div>
        <div className="right">
          {this.props.width > 630 && <p className="posted-on" >Posted {moment().format('YYYYMMDD') === moment(this.props.datePosted, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD') ? 'yesterday' : moment().format('YYYYMMDD') === moment(this.props.datePosted, 'YYYYMMDD').format('YYYYMMDD') ? moment(this.props.datePosted, 'YYYYMMDD').endOf('day').fromNow(true) : moment(this.props.datePosted, 'YYYYMMDD').endOf('day').fromNow() }</p>}
          <div className="icon-container">
            {this.props.admin && this.props.approved === false && <button className="icon" onClick={(e) => { this.approveJob(this.props.jobId) }}>
              <img src="../assets/icon-approve.svg" className="approve-icon"  alt="approve job button" /></button>}

            {this.props.userId === this.state.posterId && <button className="icon" onClick={(e) => { this.archiveJob(this.props.jobId) }}><img src="../assets/icon-trash.svg" className=" archive-icon"  alt="archive job button" /></button> || this.props.admin && 
              <button className="icon" onClick={(e) => { this.archiveJob(this.props.jobId) }}> <img src="../assets/icon-trash.svg" className="trash-icon"  alt="archive job button" /> </button>}

            {this.props.alumni && this.props.admin === false && <button onClick={(e) => { this.saveJob(this.props.jobId) }} className="icon">
              <img src={this.props.savedList ? '../assets/icon-favourite-red.svg' : '../assets/icon-favourite.svg'} className="icon save-icon"  alt="save job button" /></button>
            } 
          </div>
        </div>
        {this.props.width <= 630 && this.props.active === 'active' &&
          <div className="fullJobMobile">
            <p className="job-description">{this.props.jobDescription}</p>
            {this.props.applicationLink && <a className="applyNow action" target="_blank" href={this.props.applicationLink}>Apply Now</a>
          || this.props.addresseeEmail && <a className="applyNow action"
            href={`mailto:${this.props.addresseeEmail}?subject=${this.props.jobTitle}&body=Hi%20${this.props.addressee}`}>Apply Now</a>
      }
          </div>
        }
      </div>
  
    )
  }
}
export default JobPreview;