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
    console.log(this.state.showingJobId)
  }

  render(){
    return(
      <div className="job-feed-container job-feed-container-regular">
      <h2>This is job feed</h2>
      <div className="job-feed">
          {Object.keys(this.props.filteredJobs).length === 0 || Object.keys(this.props.filteredJobs).length === undefined  && <h3>No posted jobs match your query</h3>}
      {/* get the keys from the jobs we're holding in state, those keys are the jobIds */}
          {Object.keys(this.props.filteredJobs).map((jobId) =>{
            // console.log(jobId, this.props.filteredJobs[jobId])
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
                  active={this.state.showingJobId === jobId ? 'active': null}
                  alumni={this.props.alumni}
                  admin={this.props.admin}
                  jobPoster={this.props.jobPoster}
                />

            )
          })
      }
      </div>
        {this.state.showDetails && this.props.filteredJobs != undefined && < FullJob
                                        jobId={this.state.showingJobId}
                                        jobTitle={this.props.filteredJobs[`${this.state.showingJobId}`]['jobTitle']}
                                        jobLocation={this.props.filteredJobs[`${this.state.showingJobId}`]['jobLocation']}
                                        jobDescription={this.props.filteredJobs[`${this.state.showingJobId}`]['jobDescription']}
                                        companyName={this.props.filteredJobs[`${this.state.showingJobId}`]['companyName']}
                                        datePosted={this.props.filteredJobs[`${this.state.showingJobId}`]['datePosted']}
                                        approved={this.props.filteredJobs[`${this.state.showingJobId}`]['approved']}
                                        jobCommitment={this.props.filteredJobs[`${this.state.showingJobId}`]['jobCommitment']}/>
          }

      </div>

    )
  }
}
export default JobFeed