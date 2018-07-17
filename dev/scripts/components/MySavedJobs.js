import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import FullJob from './FullJob'

import { sortJobsChronologically } from '../helpers';

class MySavedJobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            savedJobs: [],
            showingJobId: ''
        }
    }
    componentDidMount() {
        this.dbRef = firebase.database().ref(`users/${this.props.userId}/savedJobs`)
        this.dbRef.on('value', snapshot => {
            if (snapshot != null){
                this.setState({ 
                    savedJobs: snapshot.val(),
                    firstJob : sortJobsChronologically(snapshot.val())[0],
                    showDetails: true
                });
            }
            else {
                this.setState({
                    savedJobs: {},
                    showDetails: false,
                    firstJob: null
                });
            }
        });
    }
    
    componentWillUnmount() {
        this.dbRef.off('value');
    }

    showJobDetails = (jobId) => {
        this.setState({
            showDetails: true,
            showingJobId: jobId
        });
    }

    render() {
        const sortedSavedJobIds = sortJobsChronologically(this.state.savedJobs); 
        const showingFullJobId = this.state.showingJobId === '' ? this.state.firstJob : this.state.showingJobId;
        let jobInfo = {};
        if(this.state.savedJobs) {
            jobInfo = this.state.savedJobs[`${showingFullJobId}`];
        }
        return (
        <div className="job-feed-container job-feed-container--my-saved">
            <div className="job-feed">
                {this.state.savedJobs && sortedSavedJobIds
                .filter(jobId => this.state.savedJobs[jobId].archived === false)
                .map(jobId => {
                    let job = this.state.savedJobs[jobId];
                    if(job.archived === false){
                        return (
                        <JobPreview 
                        showJobDetails={this.showJobDetails} 
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
                        jobPoster={this.props.jobPoster}
                        savedList={true}
                        addressee={job.addressee}
                        applicationLink={job.applicationLink}
                        addresseeEmail={job.addresseeEmail}
                        width={this.props.width}

                        />);
                    } 
                })}
                {this.state.savedJobs == null ? <h3 className="message-no-jobs"> You don't have any saved jobs yet!</h3> :null}
            </div>
            {this.state.showDetails && this.props.width > 630 && <FullJob 
                        jobId={showingFullJobId} 
                        jobTitle={jobInfo['jobTitle']}
                        jobLocation={jobInfo['jobLocation']}
                        jobDescription={jobInfo['jobDescription']}
                        companyName={jobInfo['companyName']}
                        datePosted={jobInfo['datePosted']}
                        approved={jobInfo['approved']}
                        jobCommitment={jobInfo['jobCommitment']}
                        applicationLink={jobInfo['applicationLink']}
                        addresseeEmail={jobInfo['addresseeEmail']}
             />}
           
          </div>)
    }
}
export default MySavedJobs