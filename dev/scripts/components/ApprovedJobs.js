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
            approvedJobs: [],
            showingJobId: ''
        }
    }
    componentDidMount() {
        const dbRef = firebase.database().ref(`jobs/approved`)

        dbRef.on('value', snapshot => {
            this.setState({ 
                approvedJobs: snapshot.val(), 
                firstJob : sortJobsChronologically(snapshot.val())[0],
                showDetails: true
            });
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
        let showingFullJobId = this.state.showingJobId === '' ? this.state.firstJob : this.state.showingJobId;
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
                                active={this.state.showingJobId === jobId ? 'active' : (this.state.showingJobId === '' && this.state.firstJob === jobId ? 'active' : null)}
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
                jobId={showingFullJobId}
                jobTitle={this.state.approvedJobs[`${showingFullJobId}`]['jobTitle']}
                jobLocation={this.state.approvedJobs[`${showingFullJobId}`]['jobLocation']}
                jobDescription={this.state.approvedJobs[`${showingFullJobId}`]['jobDescription']}
                companyName={this.state.approvedJobs[`${showingFullJobId}`]['companyName']}
                datePosted={this.state.approvedJobs[`${showingFullJobId}`]['datePosted']}
                approved={this.state.approvedJobs[`${showingFullJobId}`]['approved']}
                jobCommitment={this.state.approvedJobs[`${showingFullJobId}`]['jobCommitment']}
                archived={this.state.approvedJobs[`${showingFullJobId}`]['archived']}
                addressee={this.state.approvedJobs[`${showingFullJobId}`]['addressee']}
                applicationLink={this.state.approvedJobs[`${showingFullJobId}`]['applicationLink']}
                addresseeEmail={this.state.approvedJobs[`${showingFullJobId}`]['addresseeEmail']}
                salary={this.props.salary}

            />}
          </div>;
    }
}
export default ApprovedJobs