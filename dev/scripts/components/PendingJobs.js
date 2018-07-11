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
            pendingJobs: []
        }
    }
    componentDidMount() {
        const dbRef = firebase.database().ref(`jobs/pending`)
        dbRef.once('value', snapshot => {
            this.setState({ pendingJobs : snapshot.val() });
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
    render() {
        const sortedPendingJobIds = sortJobsChronologically(this.state.pendingJobs); 

        return <div className="job-feed-container job-feed-container--pending ">
            <div className="job-feed">
                <TransitionGroup>
                    {this.state.pendingJobs && sortedPendingJobIds.map(jobId => {
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
                                    active={this.state.showingJobId === jobId ? 'active' : null}
                                    alumni={this.props.alumni}
                                    admin={this.props.admin}
                                    addressee={this.props.addressee}
                                    jobPoster={this.props.jobPoster}
                                    removePendingJob={this.changePendingJobs}
                                    />
                                </CSSTransition>
                            )
                    })
                    }
                </TransitionGroup>
            </div>
            {this.state.showDetails && <FullJob
                jobId={this.state.showingJobId}
                jobTitle={this.state.pendingJobs[`${this.state.showingJobId}`]['jobTitle']}
                jobLocation={this.state.pendingJobs[`${this.state.showingJobId}`]['jobLocation']}
                jobDescription={this.state.pendingJobs[`${this.state.showingJobId}`]['jobDescription']}
                companyName={this.state.pendingJobs[`${this.state.showingJobId}`]['companyName']}
                datePosted={this.state.pendingJobs[`${this.state.showingJobId}`]['datePosted']}
                approved={this.state.pendingJobs[`${this.state.showingJobId}`]['approved']}
                jobCommitment={this.state.pendingJobs[`${this.state.showingJobId}`]['jobCommitment']}
                archived={this.state.pendingJobs[`${this.state.showingJobId}`]['archived']}
                addressee={this.state.pendingJobs[`${this.state.showingJobId}`]['addressee']}
            />}
          </div>;
    }
}
export default PendingJobs