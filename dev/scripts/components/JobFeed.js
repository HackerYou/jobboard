import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import Search from './Search'
import FullJob from './FullJob'

class JobFeed extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      jobs: this.props.filteredJobs,
      showingJobId: ''
    }
  }
  componentDidMount(){
  }
  showJobDetails = (jobId) =>{
    this.setState({
      showDetails:true,
      showingJobId:jobId
    })

  }

  render(){
    return(
      <div className="job-feed-container job-feed-container-regular">
      <h2>This is job feed</h2>
      <div className="job-feed">
      {/* get the keys from the jobs we're holding in state, those keys are the jobIds */}
      {/* GET THE FILTERED JOBS and map this information a little differently */}
          {Object.keys(this.props.filteredJobs).map((jobId) =>{
          // find jobs by jobId
            let job = this.props.filteredJobs[jobId]
          
          return(
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
                userId={this.props.userId}
                active={this.state.showingJobId === jobId && 'active'}
              />

          )
        })}
      </div>
        {this.state.showDetails && < FullJob
                                        jobId={this.state.showingJobId}
                                        jobTitle={this.props.jobs[`${this.state.showingJobId}`]['jobTitle']}
                                        jobLocation={this.props.jobs[`${this.state.showingJobId}`]['jobLocation']}
                                        jobDescription={this.props.jobs[`${this.state.showingJobId}`]['jobDescription']}
                                        companyName={this.props.jobs[`${this.state.showingJobId}`]['companyName']}
                                        datePosted={this.props.jobs[`${this.state.showingJobId}`]['datePosted']}
                                        approved={this.props.jobs[`${this.state.showingJobId}`]['approved']}
                                        jobCommitment={this.props.jobs[`${this.state.showingJobId}`]['jobCommitment']}
                                    />
          }

      </div>

    )
  }
}
export default JobFeed