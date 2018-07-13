import React from 'react';
import JobPreview from './JobPreview'
import FullJob from './FullJob'
import firebase from 'firebase';

import { sortJobsChronologically } from '../helpers';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class JobFeed extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      showingJobId: '',
      usersSavedJobs: [],
      firstJob: sortJobsChronologically(this.props.filteredJobs)[0],
      showDetails:true,
    }
  }
  componentDidMount(){
    this.dbref = firebase.database().ref(`users/${this.props.userId}/savedJobs`);
    if(this.props && Object.keys(this.props.filteredJobs).length > 0){
      this.dbref.on('value',(snapshot) => {
        const data = snapshot.val();
        const usersSavedJobs = data ? Object.keys(data) : [];
        this.setState({
          usersSavedJobs
        });
      });
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (!Object.keys(props.filteredJobs).includes(state.firstJob)) {
      return {
        firstJob: sortJobsChronologically(props.filteredJobs)[0],
      };
    }
    return null;
  }

  componentWillUnmount() {
    this.dbref.off('value');
  }
  
  showJobDetails = (jobId) =>{
    this.setState({
      showingJobId:jobId
    })
  }

  renderJobs() {
    const sortedJobIds = Object.keys(this.props.filteredJobs).length > 0 ? sortJobsChronologically(this.props.filteredJobs) : []; 
    const jobs = sortedJobIds.map((jobId) => {
      // find jobs by jobId
      let job = this.props.filteredJobs[jobId]
      return (
        <CSSTransition
          key={jobId}
          timeout={500}
          classNames="fade"
        >
          <JobPreview
            showJobDetails={this.showJobDetails}
            saveJob={this.saveJob}
            key={jobId}
            companyName={job.companyName}
            jobTitle={job.jobTitle}
            jobLocation={job.jobLocation}
            jobDescription={job.jobDescription}
            datePosted={job.timeCreated}
            jobId={jobId}
            archived={job.archived}
            approved={job.approved}
            userId={this.props.userId}
            showArchive={true}
            active={this.state.showingJobId === jobId ? 'active' : (this.state.showingJobId === '' && this.state.firstJob === jobId ? 'active' : null)}
            alumni={this.props.alumni}
            admin={this.props.admin}
            addressee={this.props.addressee}
            jobPoster={this.props.jobPoster}
            savedList={this.state.usersSavedJobs.includes(jobId)}
          />
        </CSSTransition>
      )
    })
    return jobs.length > 0 ? jobs : (
      <CSSTransition
        key='not-found'
        timeout={500}
        classNames="fade"
      >
        <h3>No posted jobs match your query</h3>
      </CSSTransition>
      )
  }

  render(){
    let jobId = this.state.showingJobId === '' ? this.state.firstJob : this.state.showingJobId;
    return(
      <div className="job-feed-container job-feed-container-regular">
      <div className="job-feed">
        <TransitionGroup>
          {this.renderJobs()}
        </TransitionGroup>

      </div>
        {this.state.showDetails && Object.keys(this.props.filteredJobs).length != 0 && < FullJob
                                        jobId={jobId}
                                        jobTitle={this.props.filteredJobs[`${jobId}`]['jobTitle']}
                                        jobLocation={this.props.filteredJobs[`${jobId}`]['jobLocation']}
                                        jobDescription={this.props.filteredJobs[`${jobId}`]['jobDescription']}
                                        companyName={this.props.filteredJobs[`${jobId}`]['companyName']}
                                        datePosted={this.props.filteredJobs[`${jobId}`]['datePosted']}
                                        approved={this.props.filteredJobs[`${jobId}`]['approved']}
                                        jobCommitment={this.props.filteredJobs[`${jobId}`]['jobCommitment']}
                                        addressee={this.props.filteredJobs[`${jobId}`]['addressee']}
                                        addresseeEmail={this.props.filteredJobs[`${jobId}`]['addresseeEmail']}
                                        applicationLink={this.props.filteredJobs[`${jobId}`]['applicationLink']}
                                        salary={this.props.salary}

                                        />
          }

      </div>

    )
  }
}
export default JobFeed