import React from 'react';
import firebase from 'firebase';
import Keyword from './Keyword.js'
const keywords = ['css', 'js', 'html', 'ruby', 'design']

class AddJobForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            jobTitle: '',
            companyName: '',
            jobLocation: 'Toronto',
            jobCommitment: '',
            jobDescription: '',
            keywords: '',
            timeCreated:'',
            posterId: props.userId,
            approved: false,
            archived: false
        }
    }
    componentDidMount() {
      let timeCreated = new Date()

      timeCreated = timeCreated.toString()
      this.setState({
        timeCreated: timeCreated,
        selectedCheckboxes: new Set()
      })
    }

    submitJob = (e) => {
        const dbRef = firebase.database().ref(`jobs/pending`);
        e.preventDefault();

        dbRef.push({
            jobTitle: this.state.jobTitle,
            companyName: this.state.companyName,
            jobLocation: this.state.jobLocation,
            jobCommitment: this.state.jobCommitment,
            jobDescription: this.state.jobDescription,
            keywords: this.state.keywords,
            posterId: this.state.posterId,
            approved: this.state.approved,
            timeCreated:this.state.timeCreated,
            archived: this.state.archived
        }).then(res => {
            let uniqueKey = res.path.pieces_[2];
            const userRef = firebase.database().ref(`users/${this.state.posterId}/postedJobs/${uniqueKey}`);
            const locations = firebase.database().ref(`jobs/locations`)
            userRef.set({
                jobTitle: this.state.jobTitle,
                companyName: this.state.companyName,
                jobLocation: this.state.jobLocation,
                jobCommitment: this.state.jobCommitment,
                jobDescription: this.state.jobDescription,
                keywords: this.state.keywords,
                posterId: this.state.posterId,
                approved: this.state.approved,
                archived: this.state.archived,
                timeCreated: this.state.timeCreated
            });

            this.setState({
                jobTitle: '',
                companyName: '',
                jobLocation: '',
                jobCommitment: '',
                jobDescription: '',
                keywords: '',
                timeCreated: '',
                editing: this.props.editing
            })
        })



    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCheckboxChange = word => {
        if (this.state.selectedCheckboxes.has(word)) {
            this.state.selectedCheckboxes.delete(word)
        } else {
            this.state.selectedCheckboxes.add(word)
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.props.close}>Close</button>
                <form method="POST" id="addJobForm" autoComplete="off" name="addJobForm" onSubmit={this.submitJob}>
                    <label htmlFor="jobTitle">Job Title</label>
                    <input type="text" name="jobTitle" id="jobTitle" placeholder="Job Title" required="true" onChange={this.handleChange} value={this.state.jobTitle} />

                    <label htmlFor="companyName">Company Name</label>
                    <input type="text" name="companyName" id="companyName" placeholder="Company Name" required="true" onChange={this.handleChange} value={this.state.companyName} />

                    <label htmlFor="jobLocation">Job Location</label>
                    {/* <input type="text" name="jobLocation" id="jobLocation" placeholder="Job Location" required="true" onChange={this.handleChange} value={this.state.jobLocation} />   */}
                    <select name="jobLocation" id="jobLocation" placeholder="Job Location" required="true" onChange={this.handleChange} value={this.state.jobLocation}>
                        <option name="jobLocation" value="Toronto" id="toronto">Toronto</option>
                        <option name="jobLocation" value="GTA" id="gta">GTA</option>
                        <option name="jobLocation" value="Hamilton" id="hamilton">Hamilton</option>
                        <option name="jobLocation" value="Guelph" id="guelph">Guelph</option>
                        <option name="jobLocation" value="Kitchener/Waterloo" id="kitchener-waterloo">Kitchener/Waterloo</option>
                        <option name="jobLocation" value="Montreal" id="montreal">Montreal</option>
                        <option name="jobLocation" value="Ottawa" id="ottawa">Ottawa</option>
                        <option name="jobLocation" value="Vancouver" id="vancouver">Vancouver</option>
                        <option name="jobLocation" value="New York" id="new-york">New York</option>
                        <option name="jobLocation" value="Other" id="other">Other (mention in description)</option>
                    </select>    
                    <label htmlFor="fullTime">Full Time</label>
                    <input type="radio" name="jobCommitment" id="fullTime" value="Full Time" onChange={this.handleChange} checked={this.state.jobCommitment === 'Full Time' ? true : false} />

                    <label htmlFor="partTime">Part Time</label>
                    <input type="radio" name="jobCommitment" id="partTime" value="Part Time" onChange={this.handleChange} checked={this.state.jobCommitment === 'Part Time' ? true : false} />

                    <label htmlFor="contract">Contract</label>
                    <input type="radio" name="jobCommitment" id="contract" value="Contract" onChange={this.handleChange} checked={this.state.jobCommitment === 'Contract' ? true : false} />

                    {/* <label htmlFor="keywords">Key Words</label>
                    <input type="text" name="keywords" id="keywords" placeholder="HTML, CSS, javascript" onChange={this.handleChange} value={this.state.keywords} /> */}
                    <div className="keywords-container">
                    <label htmlFor="keywords">Keywords/Tags</label>
                        {keywords.map(word =>{
                            return(
                                <Keyword key={word} word={word} handleCheckboxChange={this.handleCheckboxChange} />
                            )
                        })
                        }
                    </div>
                    <label htmlFor="jobDescription">Job Description</label>
                    <textarea type="textarea" name="jobDescription" id="jobDescription" placeholder="Put dat descrippy here plz" cols="50" rows="10" onChange={this.handleChange} value={this.state.jobDescription} />

                    <input type="submit" value="Submit Job Posting" />
            </form>
        </div>
)
    }
}

export default AddJobForm;

