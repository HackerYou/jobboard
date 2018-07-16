import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import FullJob from './FullJob'

import { sortJobsChronologically } from '../helpers';

class MyPostedJobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postedJobs: [],
            showingJobId: ''

        }
    }
    componentDidMount() {
        this.dbRef = firebase.database().ref(`users/${this.props.userId}/postedJobs`)
        this.dbRef.on('value', snapshot => {
            if (snapshot != null){
             this.setState({ 
                 postedJobs: snapshot.val(),
                 firstJob : sortJobsChronologically(snapshot.val())[0],
                 showDetails: true
             });
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
        const sortedPostedJobIds = sortJobsChronologically(this.state.postedJobs); 
        const jobs = this.state.postedJobs ? sortedPostedJobIds
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
                            active={this.state.showingJobId === jobId ? 'active' : (this.state.showingJobId === '' && this.state.firstJob === jobId ? 'active' : null)}
                            alumni={this.props.alumni}
                            admin={this.props.admin}
                            addressee={this.props.addressee}
                            jobPoster={this.props.jobPoster}

                        />);
                }
            })
        : [];

        return jobs.length > 0 ? jobs : <h3>No Posted Jobs</h3>
    }

    render() {
        let jobId = this.state.showingJobId === '' ? this.state.firstJob : this.state.showingJobId;
        return (
            <div className="job-feed-container job-feed-container--my-posted">
                <div className="job-feed">
                    {this.renderJobs()}
                </div>
                {this.state.showDetails && <FullJob 
                            jobId={jobId} 
                            jobTitle={this.state.postedJobs[`${jobId}`]['jobTitle']}
                            jobLocation={this.state.postedJobs[`${jobId}`]['jobLocation']}
                            jobDescription={this.state.postedJobs[`${jobId}`]['jobDescription']}
                            companyName={this.state.postedJobs[`${jobId}`]['companyName']}
                            datePosted={this.state.postedJobs[`${jobId}`]['datePosted']}
                            approved={this.state.postedJobs[`${jobId}`]['approved']}
                            jobCommitment={this.state.postedJobs[`${jobId}`]['jobCommitment']}
                            addressee={this.state.postedJobs[`${jobId}`]['addressee']}
                />}
           
            </div>)
    }
}
export default MyPostedJobs