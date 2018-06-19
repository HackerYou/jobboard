import React from 'react';
import firebase from 'firebase';

class FullJob extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const dbRef = firebase.database().ref(`jobs/${this.props.jobId}`)
    let job = {}
    dbRef.on('value', function(snapshot){
       job = snapshot.val()
      console.log(job, job.jobTitle)

    })
    this.setState({
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      jobCommitment: job.jobCommitment,
      jobLocation: job.jobLocation,
      companyName: job.companyName
    })
  }
  render() {
    return (
      <div>
        <h3>this is full job: {this.props.jobId}</h3>
        <h2>{this.state.jobTitle}</h2>
        <p>{this.state.companyName}</p>
        <p>{this.state.jobCommitment}</p>
        <p>{this.state.jobDescription}</p>
        <p>{this.state.jobLocation}</p>
      </div>

    )
  }
}
export default FullJob;