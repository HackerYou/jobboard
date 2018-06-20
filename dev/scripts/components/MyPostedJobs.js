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
        let dbRef = firebase.database().ref(`users/${this.props.userId}/postedJobs`)
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
        // console.log(this.props.dbRef)
        const dbRef = firebase.database().ref(`users/${this.props.userId}/postedJobs/${jobId}`);console.log(dbRef)
        // const dbRef = firebase.database().ref(`${this.props.dbRef}`)
        // console.log(this.props.dbRef)
        // console.log(dbRef);
        // let job = {}
        // dbRef.on('value', function (snapshot) {
        //     job = snapshot.val()
        //     console.log(job)
        // })
        // this.setState({
        //     jobTitle: job.jobTitle,
        //     jobDescription: job.jobDescription,
        //     jobCommitment: job.jobCommitment,
        //     jobLocation: job.jobLocation,
        //     companyName: job.companyName
        // })
        this.setState({
            showDetails: true,
            showingJobId: jobId
        }, () => {
            console.log(dbRef)
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
            {this.state.showDetails && <FullJob 
                        jobId={this.state.showingJobId} 
                        jobTitle={this.state.postedJobs[`${this.state.showingJobId}`]['jobTitle']}
                        jobLocation={this.state.postedJobs[`${this.state.showingJobId}`]['jobLocation']}
                        jobDescription={this.state.postedJobs[`${this.state.showingJobId}`]['jobDescription']}
                        companyName={this.state.postedJobs[`${this.state.showingJobId}`]['companyName']}
                        datePosted={this.state.postedJobs[`${this.state.showingJobId}`]['datePosted']}
                        approved={this.state.postedJobs[`${this.state.showingJobId}`]['approved']}
                        jobCommitment={this.state.postedJobs[`${this.state.showingJobId}`]['jobCommitment']}

             />}
          </div>;
    }
}
export default MyPostedJobs