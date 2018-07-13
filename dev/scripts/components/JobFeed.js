import React from 'react';
import JobPreview from './JobPreview'
import FullJob from './FullJob'

import { sortJobsChronologically } from '../helpers';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class JobFeed extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      showingJobId: '',
      startingJobHighlight: true
    }
  }
  componentDidMount(){
    if(this.props && Object.keys(this.props.filteredJobs).length > 0 && this.state.startingJobHighlight){
     const sortedJobIds = sortJobsChronologically(this.props.filteredJobs);
     const firstJob = sortedJobIds[0];
     this.setState({
      showDetails:true,
      showingJobId: firstJob,
      startingJobHighlight: false
    })
    }
  }
  showJobDetails = (jobId) =>{
    this.setState({
      showDetails:true,
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
            active={this.state.showingJobId === jobId ? 'active' : null}
            alumni={this.props.alumni}
            admin={this.props.admin}
            addressee={this.props.addressee}
            jobPoster={this.props.jobPoster}
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
    return(
      <div className="job-feed-container job-feed-container-regular">
      <div className="job-feed">
        <TransitionGroup>
          {this.renderJobs()}
        </TransitionGroup>

      </div>
        {this.state.showDetails && Object.keys(this.props.filteredJobs).length != 0 && < FullJob
                                        jobId={this.state.showingJobId}
                                        jobTitle={this.props.filteredJobs[`${this.state.showingJobId}`]['jobTitle']}
                                        jobLocation={this.props.filteredJobs[`${this.state.showingJobId}`]['jobLocation']}
                                        jobDescription={this.props.filteredJobs[`${this.state.showingJobId}`]['jobDescription']}
                                        companyName={this.props.filteredJobs[`${this.state.showingJobId}`]['companyName']}
                                        datePosted={this.props.filteredJobs[`${this.state.showingJobId}`]['datePosted']}
                                        approved={this.props.filteredJobs[`${this.state.showingJobId}`]['approved']}
                                        jobCommitment={this.props.filteredJobs[`${this.state.showingJobId}`]['jobCommitment']}
                                        addressee={this.props.filteredJobs[`${this.state.showingJobId}`]['addressee']}
                                        addresseeEmail={this.props.filteredJobs[`${this.state.showingJobId}`]['addresseeEmail']}
                                        applicationLink={this.props.filteredJobs[`${this.state.showingJobId}`]['applicationLink']}
                                        salary={this.props.salary}

                                        />
          }

      </div>

    )
  }
}
export default JobFeed