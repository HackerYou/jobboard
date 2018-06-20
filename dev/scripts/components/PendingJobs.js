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
            {Object.keys(this.state.pendingJobs).map(i => {
              let job = this.state.pendingJobs[i];

              return <div key={i}>
                  <JobPreview showJobDetails={this.showJobDetails} saveJob={this.saveJob} key={i} companyName={job.companyName} jobTitle={job.jobTitle} jobLocation={job.jobLocation} jobDescription={job.jobDescription} datePosted={job.timeCreated} jobId={i} userId={this.props.userId} />
                </div>;
            })}
            {this.state.showDetails && <FullJob jobId={this.state.showingJobId} />}
          </div>;
    }
}
export default PendingJobs