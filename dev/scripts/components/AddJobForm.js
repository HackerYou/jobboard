import React from 'react';
import firebase from 'firebase';


class AddJobForm extends React.Component {
    constructor() {
        super()
        this.state = {
            jobTitle: '',
            companyName: '',
            jobLocation: '',
            jobCommitment: '',
            jobDescription: '',
            keywords: ''
        }
        this.submitJob = this.submitJob.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {

    }
    submitJob(e) {
        const dbRef = firebase.database().ref(`jobs/`);
        e.preventDefault();
        // dbRef.push
        dbRef.push({
            jobTitle: this.state.jobTitle,
            companyName: this.state.companyName,
            jobLocation: this.state.jobLocation,
            jobCommitment: this.state.jobCommitment,
            jobDescription: this.state.jobDescription,
            keywords: this.state.keywords
        });
        console.log("submitted");

        // we want to push all job information to firebase/jobs

        this.setState({
            jobTitle: '',
            companyName: '',
            jobLocation: '',
            jobCommitment: '',
            jobDescription: '',
            keywords: ''
        })

        //we want to empty the form
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    render() {
        return <form method="POST" id="addJobForm" autoComplete="off" name="addJobForm" onSubmit={this.submitJob}>
            <label htmlFor="jobTitle">Job Title</label>
            <input type="text" name="jobTitle" id="jobTitle" placeholder="Job Title" required="true" onChange={this.handleChange} />

            <label htmlFor="companyName">Company Name</label>
            <input type="text" name="companyName" id="companyName" placeholder="Company Name" required="true" onChange={this.handleChange} />

            <label htmlFor="jobLocation">Job Location</label>
            <input type="text" name="jobLocation" id="jobLocation" placeholder="Job Location" required="true" onChange={this.handleChange} />

            <label htmlFor="fullTime">Full Time</label>
            <input type="radio" name="jobCommitment" id="fullTime" value="Full Time" onChange={this.handleChange} />

            <label htmlFor="partTime">Part Time</label>
            <input type="radio" name="jobCommitment" id="partTime" value="Part Time" onChange={this.handleChange} />

            <label htmlFor="contract">Contract</label>
            <input type="radio" name="jobCommitment" id="contract" value="Contract" onChange={this.handleChange} />

            <label htmlFor="keywords">Key Words</label>
            <input type="text" name="keywords" id="keywords" placeholder="HTML, CSS, javascript" onChange={this.handleChange} />

            <label htmlFor="jobDescription">Job Description</label>
            <textarea type="textarea" name="jobDescription" id="jobDescription" placeholder="Put dat descrippy here plz" cols="50" rows="10" onChange={this.handleChange} />

            <input type="submit" value="Submit Job Posting" />
        </form>
    }
}




export default AddJobForm;

