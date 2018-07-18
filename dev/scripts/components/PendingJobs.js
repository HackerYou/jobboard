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
            if (snapshot != null){
            this.setState({ 
                pendingJobs : snapshot.val(),
                firstJob : sortJobsChronologically(snapshot.val())[0],
                showDetails: true,
            });
            }
            else {
                this.setState({
                    pendingJobs: {},
                    showDetails: false,
                    firstJob: null
                });
            }
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
                        width={this.props.width}
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
                <h3 className="message-no-jobs">No pending jobs!</h3>
            </CSSTransition>
        )
    }

    render() {
        const jobId = this.state.showingJobId === '' ? this.state.firstJob : this.state.showingJobId;
        let jobInfo = {};
        if(this.state.pendingJobs) {
            jobInfo = this.state.pendingJobs[`${jobId}`];
        }
        return <div className="job-feed-container job-feed-container--pending ">
            <div className="job-feed">
                <TransitionGroup>
                    {this.renderJobs()}
                </TransitionGroup>
            </div>
            {this.state.showDetails && this.props.width > 630 && <FullJob
                jobId={jobId}
                jobTitle={jobInfo['jobTitle']}
                jobLocation={jobInfo['jobLocation']}
                jobDescription={jobInfo['jobDescription']}
                companyName={jobInfo['companyName']}
                datePosted={jobInfo['datePosted']}
                approved={jobInfo['approved']}
                jobCommitment={jobInfo['jobCommitment']}
                archived={jobInfo['archived']}
                addressee={jobInfo['addressee']}
                applicationLink={jobInfo['applicationLink']}
                addresseeEmail={jobInfo['addresseeEmail']}
                salary={this.props.salary}
            />}
          </div>;
    }
}
export default PendingJobs