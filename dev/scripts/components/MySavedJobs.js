import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import FullJob from './FullJob'

class MySavedJobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            savedJobs: []
        }
    }
    componentDidMount() {
        let dbRef = firebase.database().ref(`users/${this.props.userId}/savedJobs`)
        dbRef.on('value', snapshot => {
            if (snapshot != null){
              console.log(snapshot.val())
             this.setState({ savedJobs: snapshot.val() });
            } else{
                return
            }
        })
    }
    showJobDetails = (jobId) => {
        const dbRef = firebase.database().ref(`users/${this.props.userId}/savedJobs/${jobId}`);
        this.setState({
            showDetails: true,
            showingJobId: jobId
        }) 
    }

    render() {
        return (
        <div className="job-feed-container job-feed-container--my-saved">
            <h2>THIS IS MY Saved JOBS</h2>
            <div className="job-feed">
                {this.state.savedJobs && Object.keys(this.state.savedJobs)
                .filter(jobId => this.state.savedJobs[jobId].archived === false)
                .map(jobId => {
                let job = this.state.savedJobs[jobId];
                console.log(`job`, job)
                    if(job.archived === false){
                        return (
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
                        active={this.state.showingJobId === jobId ? 'active': null}
                        alumni={this.props.alumni}
                        admin={this.props.admin}
                        jobPoster={this.props.jobPoster}

                        />);
                    } 
                })}
                {this.state.savedJobs == null ? <h2> No saved jobs yet!</h2> :null}
            </div>
            {this.state.showDetails && <FullJob 
                        jobId={this.state.showingJobId} 
                        jobTitle={this.state.savedJobs[`${this.state.showingJobId}`]['jobTitle']}
                        jobLocation={this.state.savedJobs[`${this.state.showingJobId}`]['jobLocation']}
                        jobDescription={this.state.savedJobs[`${this.state.showingJobId}`]['jobDescription']}
                        companyName={this.state.savedJobs[`${this.state.showingJobId}`]['companyName']}
                        datePosted={this.state.savedJobs[`${this.state.showingJobId}`]['datePosted']}
                        approved={this.state.savedJobs[`${this.state.showingJobId}`]['approved']}
                        jobCommitment={this.state.savedJobs[`${this.state.showingJobId}`]['jobCommitment']}

             />}
           
          </div>)
    }
}
export default MySavedJobs