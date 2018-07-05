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
            jobLocation: '',
            jobCommitment: '',
            jobDescription: '',
            keywords: [],
            salary:'',
            timeCreated:'',
            posterId: props.userId,
            addressee: '',
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
        let keywords = Array.from(this.state.selectedCheckboxes)

        dbRef.push({
            jobTitle: this.state.jobTitle,
            companyName: this.state.companyName,
            jobLocation: this.state.jobLocation,
            jobCommitment: this.state.jobCommitment,
            jobDescription: this.state.jobDescription,
            keywords: keywords,
            salary:this.state.salary,
            posterId: this.state.posterId,
            approved: this.state.approved,
            archived: this.state.archived,
            addressee: this.state.addressee,
            timeCreated:this.state.timeCreated
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
              keywords: keywords,
              salary: this.state.salary,
              posterId: this.state.posterId,
              approved: this.state.approved,
              archived: this.state.archived,
              addressee: this.state.addressee,
              timeCreated: this.state.timeCreated
            });

            this.setState({
              jobTitle: "",
              companyName: "",
              jobLocation: "",
              jobCommitment: "",
              jobDescription: "",
              keywords: [],
              salary: "",
              timeCreated: "",
              addressee: "",
              editing: this.props.editing
            });
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
            <div className="jobForm">
                <p>Fill out the information about your job posting below.</p>

                <form method="POST" id="addJobForm" autoComplete="off" name="addJobForm" onSubmit={this.submitJob}>
                <button onClick={this.props.close}><img src="../../../assets/icon-x.svg" alt="Close form button"/></button>
                    <div className="inputGroup">
                        <div className="formTextInput">
                            <label htmlFor="jobTitle">Job Title</label>
                            <input type="text" name="jobTitle" id="jobTitle" placeholder="Job Title" required="true" onChange={this.handleChange} value={this.state.jobTitle} />
                        </div>
                        <div className="formTextInput">
                            <label htmlFor="companyName">Company Name</label>
                            <input type="text" name="companyName" id="companyName" placeholder="Company Name" required="true" onChange={this.handleChange} value={this.state.companyName} />  
                        </div>
                        <div className="formTextInput">
                            <label htmlFor="addressee">Addressee for Cover Letter or Application</label>
                            <input type="text" name="addressee" id="addressee" placeholder="Addressee" required="false" onChange={this.handleChange} value={this.state.addressee} />
                        </div>
                        <div className="formTextInput">
                            <label htmlFor="jobLocation">Job Location</label>
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
                        </div>
                    </div>

                    {/* <label htmlFor="keywords">Key Words</label>
                    <input type="text" name="keywords" id="keywords" placeholder="HTML, CSS, javascript" onChange={this.handleChange} value={this.state.keywords} /> */}
                    <div className="keywords-container">
                        <label htmlFor="keywords">Keywords/Tags</label>
                        {keywords.map(word => {
                            return (
                                <Keyword key={word} word={word} handleCheckboxChange={this.handleCheckboxChange} />
                            )
                        })
                        }
                    </div>
                    <label htmlFor="fullTime">Full Time</label>
                    <input type="radio" name="jobCommitment" id="fullTime" value="Full Time" onChange={this.handleChange} checked={this.state.jobCommitment === 'Full Time' ? true : false} />

                    <label htmlFor="partTime">Part Time</label>
                    <input type="radio" name="jobCommitment" id="partTime" value="Part Time" onChange={this.handleChange} checked={this.state.jobCommitment === 'Part Time' ? true : false} />

                    <label htmlFor="contract">Contract</label>
                    <input type="radio" name="jobCommitment" id="contract" value="Contract" onChange={this.handleChange} checked={this.state.jobCommitment === 'Contract' ? true : false} />
                    
                    <select name="salary" id="salary" onChange={this.handleChange} >
                        <option name="salary" value="-" id="-" selected>-</option>
                        <option name="salary" value="under40">under $40,000</option>
                        <option name="salary" value="40-50">$40,000 - $50,000</option>
                        <option name="salary" value="51-60">$50,001 - $60,000</option>
                        <option name="salary" value="61-70">$60,001 - $70,000</option>
                        <option name="salary" value="71-80">$70,001 - $80,000</option>
                        <option name="salary" value="81-90">$80,001 - $90,000</option>
                        <option name="salary" value="91-100">$90,001 - $100,000</option>
                        <option name="salary" value="100+">over $100,000</option>
                    </select>

                    <label htmlFor="jobDescription">Job Description</label>
                    <textarea type="textarea" name="jobDescription" id="jobDescription" placeholder="Put dat descrippy here plz" cols="50" rows="10" onChange={this.handleChange} value={this.state.jobDescription} />

                    <input type="submit" value="Submit Job Posting" className="action"/>
            </form>
        </div>
)
    }
}

export default AddJobForm;

