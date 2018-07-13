import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import FullJob from './FullJob'

class MyPostedJobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postedJobs: []
        }
    }
    componentDidMount() {
        this.dbRef = firebase.database().ref(`users/${this.props.userId}/postedJobs`)
        this.dbRef.on('value', snapshot => {
            if (snapshot != null){
             this.setState({ postedJobs: snapshot.val() });
            } else{
                return
            }
        })
    }
    componentWillUnmount() {
        this.dbRef.off('value');
    }
    showJobDetails = (jobId) => {
        const dbRef = firebase.database().ref(`users/${this.props.userId}/postedJobs/${jobId}`);
        this.setState({
            showDetails: true,
            showingJobId: jobId
        }) 
    }

    renderJobs() {
        const jobs = this.state.postedJobs ? Object.keys(this.state.postedJobs)
            .filter(jobId => this.state.postedJobs[jobId].archived === false)
            .map(jobId => {
                let job = this.state.postedJobs[jobId];
                if (job.archived === false) {
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
                            active={this.state.showingJobId === jobId ? 'active' : null}
                            alumni={this.props.alumni}
                            admin={this.props.admin}
                            addressee={this.props.addressee}
                            jobPoster={this.props.jobPoster}

                        />);
                }
            })
        : [];

        return jobs.length > 0 ? jobs : <h3 className="message-no-jobs">You haven't submitted a job yet!</h3>
    }

    render() {
        return (
            <div className="job-feed-container job-feed-container--my-posted">
                <div className="job-feed">
                    {this.renderJobs()}
                </div>
                {this.state.showDetails && <FullJob 
                            jobId={this.state.showingJobId} 
                            jobTitle={this.state.postedJobs[`${this.state.showingJobId}`]['jobTitle']}
                            jobLocation={this.state.postedJobs[`${this.state.showingJobId}`]['jobLocation']}
                            jobDescription={this.state.postedJobs[`${this.state.showingJobId}`]['jobDescription']}
                            companyName={this.state.postedJobs[`${this.state.showingJobId}`]['companyName']}
                            datePosted={this.state.postedJobs[`${this.state.showingJobId}`]['datePosted']}
                            approved={this.state.postedJobs[`${this.state.showingJobId}`]['approved']}
                            jobCommitment={this.state.postedJobs[`${this.state.showingJobId}`]['jobCommitment']}
                            addressee={this.state.postedJobs[`${this.state.showingJobId}`]['addressee']}

                />}
           
            </div>)
    }
}
export default MyPostedJobs