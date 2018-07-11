import React from 'react';
import keywordList  from '../KeywordList'
import Keyword from './Keyword.js'

import moment from 'moment';

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      searchTerm:'',
      jobLocation: '',
      jobCommitment: '',
      timeSincePosting:'',
      salary:'',
      importedKeywords:keywordList,
      searchKeywords:[],
      selectedCheckboxes: new Set(),
      advancedSearch:false
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleCheckboxChange = (word) => {
    if (this.state.selectedCheckboxes.has(word)) {
      this.state.selectedCheckboxes.delete(word)
    } else {
      this.state.selectedCheckboxes.add(word)
    }
    
    const keywords = Array.from(this.state.selectedCheckboxes)
    
    this.setState({
      searchKeywords:keywords
    })
  }

  toggleAdvancedSearch = (e) =>{
    e.preventDefault()
    this.setState({
      advancedSearch: !this.state.advancedSearch
    })
  }

  clearInputs = () =>{
    this.setState({
      searchTerm: '',
      jobLocation: '',
      jobCommitment: '',
      timeSincePosting: '',
      salary: '',
      searchKeywords: [],
      selectedCheckboxes: new Set()
    })
  }
  render() {
    return (
      <div className="search">
        <form action="submit" onSubmit={(e) => { this.props.search(e, this.state.jobLocation, this.state.jobCommitment, this.state.timeSincePosting, this.state.salary, this.state.searchKeywords) }}>
          <div className="searchTop">
            {/* <input type="text" name="searchTerm" id="searchTerm" placeholder="Search" onChange={this.handleChange} value={this.state.searchTerm} />  */}
            <select name="jobLocation" id="jobLocation" onChange={this.handleChange}>
              <option name="jobLocation" id="locationOption" disabled defaultValue>Location</option>
              <option name="jobLocation" value="any" id="">Anywhere</option>
              <option name="jobLocation" value="Toronto" id="toronto" >Toronto</option>
              <option name="jobLocation" value="GTA" id="gta">GTA</option>
              <option name="jobLocation" value="Hamilton" id="hamilton">Hamilton</option>
              <option name="jobLocation" value="Guelph" id="guelph">Guelph</option>
              <option name="jobLocation" value="Kitchener/Waterloo" id="kitchenerWaterloo">Kitchener/Waterloo</option>
              <option name="jobLocation" value="Montreal" id="montreal">Montreal</option>
              <option name="jobLocation" value="Ottawa" id="ottawa">Ottawa</option>
              <option name="jobLocation" value="Vancouver" id="vancouver">Vancouver</option>
              <option name="jobLocation" value="New York" id="newYork">New York</option>
              <option name="jobLocation" value="Other" id="other">Other (mention in description)</option>
            </select> 
            <button className="search-button"><img src="../../../assets/icon-search.svg" alt="Click to search"/></button>
            <a className="advanced-toggle" href="#" onClick={this.toggleAdvancedSearch}> {this.state.advancedSearch ? `—` : `+`}advanced search</a>
          </div>
         {this.state.advancedSearch && 
            <div className="advanced">
              <div className="selectContainer">
                <select name="timeSincePosting" id="timeSincePosting" onChange={this.handleChange} placeholder="time since posting">
                  <option name="timeSincePosting" value="" id="timeSincePostingOption" disabled selected>Time Since Posting</option>
                  <option name="timeSincePosting" value="any">Any</option>
                  <option name="timeSincePosting" value={moment().subtract(3, 'days').format('YYYYMMDD')}>last 3 days</option>
                  <option name="timeSincePosting" value={moment().subtract(7, 'days').format('YYYYMMDD')}>last week</option>
                  <option name="timeSincePosting" value={moment().subtract(14, 'days').format('YYYYMMDD')}>last two weeks</option>
                  <option name="timeSincePosting" value={moment().subtract(1, 'month').format('YYYYMMDD')}>last month</option>
                </select>
                <select name="salary" id="salary" onChange={this.handleChange} >
                  <option name="salary" value="" id="salaryOption" selected disabled>Salary</option>
                  <option name="salary" value="any">Any</option>
                  <option name="salary" value="under40">under $40,000</option>
                  <option name="salary" value="40-50">$40,000 - $50,000</option>
                  <option name="salary" value="51-60">$50,001 - $60,000</option>
                  <option name="salary" value="61-70">$60,001 - $70,000</option>
                  <option name="salary" value="71-80">$70,001 - $80,000</option>
                  <option name="salary" value="81-90">$80,001 - $90,000</option>
                  <option name="salary" value="91-100">$90,001 - $100,000</option>
                  <option name="salary" value="100+">over $100,000</option>
                </select>
                <select name="jobCommitment" id="jobCommitment" onChange={this.handleChange} >
                  <option name="jobCommitment" value='' id="commitment" selected disabled>Commitment</option>
                  <option name="jobCommitment" value="any"> >Any</option>
                  <option name="jobCommitment" value="Contract">Contract</option>
                  <option name="jobCommitment" value="Part Time">Part Time</option>
                  <option name="jobCommitment" value="Full Time">Full Time</option>
                </select>
              </div>
              <div className="keywords-container">
                {/* <label htmlFor="keywords">Keywords</label> */}
                {keywordList.map(word => {
                  return (
                    <Keyword key={word} word={word} handleCheckboxChange={this.handleCheckboxChange} />
                  )
                })
                }
              </div>
            </div>
          }
        </form>
      </div>

    )
  }
}
export default Search;