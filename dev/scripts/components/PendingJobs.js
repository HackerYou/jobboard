import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import Search from './Search'
import FullJob from './FullJob'

class PendingJobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pendingJobs: []
        }
    }
    componentDidMount() {
        const dbRef = firebase.database().ref(`jobs/pending`)
        dbRef.on('value', snapshot => {
            this.setState({ pendingJobs     : snapshot.val() });
        })

    }
    showJobDetails = (jobId) => {
        this.setState({
            showDetails: true,
            showingJobId: jobId
        })
    }

    render() {
        return <div>
            <Search />
            this is pending jobs
            {this.state.pendingJobs && Object.keys(this.state.pendingJobs).map(jobId => {
              let job = this.state.pendingJobs[jobId];

              return (
              <JobPreview showJobDetails={this.showJobDetails} saveJob={this.saveJob} key={jobId} companyName={job.companyName} jobTitle={job.jobTitle} jobLocation={job.jobLocation} jobDescription={job.jobDescription} datePosted={job.timeCreated} jobId={jobId} userId={this.props.userId} />)
            })}
            {this.state.showDetails && <FullJob
                jobId={this.state.showingJobId}
                jobTitle={this.state.pendingJobs[`${this.state.showingJobId}`]['jobTitle']}
                jobLocation={this.state.pendingJobs[`${this.state.showingJobId}`]['jobLocation']}
                jobDescription={this.state.pendingJobs[`${this.state.showingJobId}`]['jobDescription']}
                companyName={this.state.pendingJobs[`${this.state.showingJobId}`]['companyName']}
                datePosted={this.state.pendingJobs[`${this.state.showingJobId}`]['datePosted']}
                approved={this.state.pendingJobs[`${this.state.showingJobId}`]['approved']}
                jobCommitment={this.state.pendingJobs[`${this.state.showingJobId}`]['jobCommitment']}

            />}
          </div>;
    }
}
export default PendingJobs