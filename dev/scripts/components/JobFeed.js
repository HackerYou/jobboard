import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import Search from './Search'
import FullJob from './FullJob'

class JobFeed extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      jobs:[]
    }
    this.showJobDetails = this.showJobDetails.bind(this)
    this.saveJob = this.saveJob.bind(this)

  }
  componentDidMount(){
    const dbRef = firebase.database().ref(`jobs`)
    dbRef.on('value', snapshot =>{
      // console.log(Object.entries(snapshot.val()))
      // console.log(Object.values(snapshot.val()))
      // console.log(Object.keys(snapshot.val()))

      this.setState({
        jobs: snapshot.val()
      })
    })

  }
  showJobDetails(jobId){
    this.setState({
      showDetails:true,
      showingJobId:jobId
    })
    console.log('clicked')
  }
  saveJob(jobId){
    console.log(`let me save this job:${jobId}`)
    // const savedRef = firebase.database().ref(`users/${this.props.userId}/savedJobs/${jobId}`)
    // savedRef.set({
    //   jobKey:jobId
    // })
  }
  render(){
    return(
      <div>
      <Search />

      {Object.keys(this.state.jobs).map((i) =>{
        let job= this.state.jobs[i]
        
        return(
          <div key={i}>
            <JobPreview 
              showJobDetails={this.showJobDetails}
              saveJob={this.saveJob}
              key={i}
              companyName={job.companyName}
              jobTitle={job.jobTitle}
              jobLocation={job.jobLocation}
              datePosted={job.timeCreated}
              jobId={i}
              userId={this.props.userId}
            />

          </div>

        )
      })}

        {this.state.showDetails ? <FullJob jobId={this.state.showingJobId} /> : null}

      </div>

    )
  }
}
export default JobFeed