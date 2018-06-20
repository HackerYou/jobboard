import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import Search from './Search'
import FullJob from './FullJob'

class MyPostedJobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postedJobs: []
        }
    }
    componentDidMount() {
        const dbRef = firebase.database().ref(`users/${this.props.userId}/postedJobs`)
        console.log(this.props.userId)
        dbRef.on('value', snapshot => {
            if (snapshot != null){
             this.setState({ postedJobs: snapshot.val() });
            } else{
                return
            }
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
            {Object.keys(this.state.postedJobs).map(i => {
                let job = this.state.postedJobs[i];

                return <div key={i}>
                    <JobPreview showJobDetails={this.showJobDetails} saveJob={this.saveJob} key={i} companyName={job.companyName} jobTitle={job.jobTitle} jobLocation={job.jobLocation} jobDescription={job.jobDescription} datePosted={job.timeCreated} jobId={i} userId={this.props.userId} />
                </div>;
            })}
            {this.state.showDetails && <FullJob jobId={this.state.showingJobId} dbRef={`users/${this.props.userId}/postedJobs/${this.state.showingJobId}`}/>}
        </div>;
    }
}
export default MyPostedJobs