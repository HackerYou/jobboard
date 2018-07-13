import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import Search from './Search'
import FullJob from './FullJob'

import { sortJobsChronologically } from '../helpers';
import { CSSTransition,TransitionGroup } from 'react-transition-group';


class ApprovedJobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            approvedJobs: []
        }
    }
    componentDidMount() {
        const dbRef = firebase.database().ref(`jobs/approved`)

        dbRef.on('value', snapshot => {
            this.setState({ approvedJobs: snapshot.val() });
        })
    }
    showJobDetails = (jobId) => {
        this.setState({
            showDetails: true,
            showingJobId: jobId
        })
    }

    render() {
        const sortedApprovedJobIds = sortJobsChronologically(this.state.approvedJobs); 
        return <div className="job-feed-container job-feed-container--approved ">
            <div className="job-feed">
                <TransitionGroup>
                    {this.state.approvedJobs && sortedApprovedJobIds.map(jobId => {
                        let job = this.state.approvedJobs[jobId];
                        return (
                            <CSSTransition
                            key={jobId}
                            timeout={500}
                            classNames="fade"
                            >
                                <JobPreview showJobDetails={this.showJobDetails} 
                                saveJob={this.saveJob} 
                                key={jobId} 
                                companyName={job.companyName} 
                                jobTitle={job.jobTitle} 
                                jobLocation={job.jobLocation} 
                                jobDescription={job.jobDescription} 
                                datePosted={job.timeCreated} 
                                archived={job.archived} 
                                approved={job.approved} 
                                jobId={jobId} 
                                userId={this.props.userId} 
                                active={this.state.showingJobId === jobId ? 'active' : null}
                                alumni={this.props.alumni}
                                admin={this.props.admin}
                                addressee={this.props.addressee}
                                jobPoster={this.props.jobPoster}
                                salary={this.salary}
                                />
                            </CSSTransition>
                                
                        )
                    })
                    }
                </TransitionGroup>
            </div>
            {this.state.showDetails && <FullJob
                jobId={this.state.showingJobId}
                jobTitle={this.state.approvedJobs[`${this.state.showingJobId}`]['jobTitle']}
                jobLocation={this.state.approvedJobs[`${this.state.showingJobId}`]['jobLocation']}
                jobDescription={this.state.approvedJobs[`${this.state.showingJobId}`]['jobDescription']}
                companyName={this.state.approvedJobs[`${this.state.showingJobId}`]['companyName']}
                datePosted={this.state.approvedJobs[`${this.state.showingJobId}`]['datePosted']}
                approved={this.state.approvedJobs[`${this.state.showingJobId}`]['approved']}
                jobCommitment={this.state.approvedJobs[`${this.state.showingJobId}`]['jobCommitment']}
                archived={this.state.approvedJobs[`${this.state.showingJobId}`]['archived']}
                addressee={this.state.approvedJobs[`${this.state.showingJobId}`]['addressee']}
                applicationLink={this.state.approvedJobs[`${this.state.showingJobId}`]['applicationLink']}
                addresseeEmail={this.state.approvedJobs[`${this.state.showingJobId}`]['addresseeEmail']}
                salary={this.props.salary}

            />}
          </div>;
    }
}
export default ApprovedJobs