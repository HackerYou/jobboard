import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import FullJob from './FullJob'

import { CSSTransition,TransitionGroup } from 'react-transition-group';

import { sortJobsChronologically } from '../helpers';

class PendingJobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pendingJobs: {},
            showingJobId: ''
        }
    }
    componentDidMount() {
        const dbRef = firebase.database().ref(`jobs/pending`)
        dbRef.once('value', snapshot => {
            this.setState({ 
                pendingJobs : snapshot.val(),
                firstJob : sortJobsChronologically(snapshot.val())[0],
                showDetails: true,
            });
        })

    }
    showJobDetails = (jobId) => {
        this.setState({
            showDetails: true,
            showingJobId: jobId
        })
    }
    changePendingJobs = (jobId) =>{
        const newPendingJobs = this.state.pendingJobs;
        delete newPendingJobs[jobId];
        this.setState({
            pendingJobs: newPendingJobs
        })
    }

    renderJobs() {
        const sortedPendingJobIds = sortJobsChronologically(this.state.pendingJobs); 
        const jobs = sortedPendingJobIds.length > 0 ? sortedPendingJobIds.map(jobId => {
            let job = this.state.pendingJobs[jobId];
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
                        userId={this.props.userId}
                        approved={job.approved}
                        archived={job.archived}
                        admin={true}
                        active={this.state.showingJobId === jobId ? 'active' : (this.state.showingJobId === '' && this.state.firstJob === jobId ? 'active' : null)}
                        alumni={this.props.alumni}
                        admin={this.props.admin}
                        addressee={this.props.addressee}
                        jobPoster={this.props.jobPoster}
                        removePendingJob={this.changePendingJobs}
                        salary={job.salary}
                    />
                </CSSTransition>
            )
        }) : [];

        return jobs.length > 0 ? jobs : (
            <CSSTransition
                key={'no-pending-jobs'}
                timeout={500}
                classNames="fade"
            >
                <h3>No pending Jobs</h3>
            </CSSTransition>
        )
    }

    render() {
        let jobId = this.state.showingJobId === '' ? this.state.firstJob : this.state.showingJobId;
        return <div className="job-feed-container job-feed-container--pending ">
            <div className="job-feed">
                <TransitionGroup>
                    {this.renderJobs()}
                </TransitionGroup>
            </div>
            {this.state.showDetails && <FullJob
                jobId={jobId}
                jobTitle={this.state.pendingJobs[`${jobId}`]['jobTitle']}
                jobLocation={this.state.pendingJobs[`${jobId}`]['jobLocation']}
                jobDescription={this.state.pendingJobs[`${jobId}`]['jobDescription']}
                companyName={this.state.pendingJobs[`${jobId}`]['companyName']}
                datePosted={this.state.pendingJobs[`${jobId}`]['datePosted']}
                approved={this.state.pendingJobs[`${jobId}`]['approved']}
                jobCommitment={this.state.pendingJobs[`${jobId}`]['jobCommitment']}
                archived={this.state.pendingJobs[`${jobId}`]['archived']}
                addressee={this.state.pendingJobs[`${jobId}`]['addressee']}
                applicationLink={this.state.pendingJobs[`${jobId}`]['applicationLink']}
                addresseeEmail={this.state.pendingJobs[`${jobId}`]['addresseeEmail']}
                salary={this.props.salary}
            />}
          </div>;
    }
}
export default PendingJobs