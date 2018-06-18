import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import Search from './Search'
class JobsFeed extends React.Component { 
  constructor(){
    super();
    this.state = {
      jobs:[]
    }
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
  render(){
    return(
      <div>
      <Search />

      {Object.keys(this.state.jobs).map((i) =>{
        let job= this.state.jobs[i]
        
        return(

          <JobPreview 
            key={i}
            company={job.company}
            title={job.title}
            location={job.location}
          />

        )
      })}
      </div>

    )
  }
}
export default JobsFeed