import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import Search from './Search'
import FullJob from './FullJob'

class JobsFeed extends React.Component { 
  constructor(){
    super();
    this.state = {
      jobs:[]
    }
    this.showJobDetails = this.showJobDetails.bind(this)
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
    console.log('clicked', jobId)
  }
  render(){
    return(
      <div>
      <Search />

      {Object.keys(this.state.jobs).map((i) =>{
        let job= this.state.jobs[i]
        
        return(
          <div>
            <JobPreview 
              showJobDetails={this.showJobDetails}
              key={i}
              companyName={job.companyName}
              jobTitle={job.jobTitle}
              jobLocation={job.jobLocation}
              datePosted={job.timeCreated}
              jobId={i}
            />

          </div>

        )
      })}

        {this.state.showDetails ? <FullJob jobId={this.state.showingJobId} /> : null}

      </div>

    )
  }
}
export default JobsFeed