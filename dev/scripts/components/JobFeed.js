import React from 'react';
import JobPreview from './JobPreview'
import FullJob from './FullJob'

class JobFeed extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
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
      <div className="job-feed">
          {Object.keys(this.props.filteredJobs).length === 0 && <h3>No posted jobs match your query</h3> || Object.keys(this.props.filteredJobs).length === undefined  && <h3>No posted jobs match your query</h3>}
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
                archived={job.archived}
                approved={job.approved}
                userId={this.props.userId}
                showArchive={true}
                active={this.state.showingJobId === jobId ? 'active' : null}
                alumni={this.props.alumni}
                admin={this.props.admin}
                jobPoster={this.props.jobPoster}
                />

            )
          })
      }
      </div>
        {this.state.showDetails && Object.keys(this.props.filteredJobs).length != 0 && < FullJob
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