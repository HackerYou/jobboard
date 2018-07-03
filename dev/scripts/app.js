import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, NavLink, Route} from 'react-router-dom';
import firebase from 'firebase';
import ReadmeLoginForm from './components/ReadmeLoginForm';
import EmailLoginForm from './components/EmailLoginForm';
import UserBar from './components/UserBar';
import AddJobForm from './components/AddJobForm';
import JobFeed from './components/JobFeed';
import PendingJobs from './components/PendingJobs';
import ApprovedJobs from './components/ApprovedJobs';
import MyPostedJobs from './components/MyPostedJobs';
import Search from './components/Search'
import axios from 'axios';
import groupby from 'lodash.groupby';
import intersection from 'lodash.intersection';

const config = {
  apiKey: "AIzaSyDhpZQDqygKV1G_ne9JJwxxWPnYYKxaX0Q",
  authDomain: "hy-jobs-board.firebaseapp.com",
  databaseURL: "https://hy-jobs-board.firebaseio.com",
  projectId: "hy-jobs-board",
  storageBucket: "hy-jobs-board.appspot.com",
  messagingSenderId: "1023755007156"
};
firebase.initializeApp(config);


class App extends React.Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false,
      userId: '', 
      provider:'',
      filteredJobs:{}
    }

    const dbRef = firebase.database().ref(`jobs/approved`)
    dbRef.on('value', snapshot => {
      this.setState({
        filteredJobs: snapshot.val()
      })
    })
  }

  componentDidMount(){
    
    this.dbRef = firebase.database().ref();

    this.userRef = firebase.database().ref(`users/${this.state.userId}`)
    
    firebase.auth().onAuthStateChanged(user => {

      if (user !== null) {
        // console.log(user)
        this.dbRef.on('value', snapshot => { });
        this.setState({
          loggedIn: true,
          userId: user.uid,
          userName: user.displayName
        });
        this.userRef.on('value', snapshot =>{
          let resp = snapshot.val()
          resp = resp[this.state.userId]
          this.setState({
            admin: resp.admin,
            alumni: resp.alumni,
            jobPoster: resp.jobPoster
          })
        })

      } else {
        this.setState({
          loggedIn: false,
          userId: '',
          userName: '',
          admin:'',
          alumni:'',
          jobPoster:''

        });
      }
    });
  } 

  onChangeEmail = (e) =>{
    this.setState({
      email:e.target.value
    })
  }

  
  onChangePassword = (e) =>{
    this.setState({
      password: e.target.value
    })
  }

  loginWithReadme = (e) =>{
    e.preventDefault();

    this.setState({
      provider:'readme'
    })
  }

  loginWithGoogle = (e) => {
    e.preventDefault();
    
    this.setState({
      provider: 'google'
    })

    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        this.setState({
          loggedIn: true
        });
        //find the user's uid from the firebase auth process
        const userRef = firebase.database().ref(`users/${res.user.uid}`)
        //if the user exists already in the database, return
        userRef.on('value', function (snapshot) {
          if (snapshot.val()==null){
          // else, create a user in the database 
            userRef.set({
              'name':res.user.displayName,
              'jobPoster':true,
              'alumni':false,
              'admin':false
            })
          } else{
            console.log('already there!')
            return
          }
        });
      })
      .catch(err => {

      });

  }

  loginWithEmail = (e) => {
    e.preventDefault();
    this.setState({
      provider: 'email'
    })
  }

  signOut = () => {
    firebase.auth().signOut();
    this.dbRef.off('value');
    this.setState({
      loggedIn: false,
      userId: '',
      provider:'',
      admin: '',
      alumni: '',
      jobPoster: ''
    });
  }
  postAJob = () => {
    this.setState({
      editing:true
    })
  }
  closePostAJob = () =>{
    this.setState({
      editing:false
    })
  }

  getData = (key, param) =>{
    return new Promise((res,rej) => {
      const dbRef = firebase.database().ref(`jobs/approved`)
      if (param === 'any') {
        console.log(key)
        dbRef.once('value', snapshot => {
          const data = snapshot.val()
          res(data)
        })
      } else if (param !== '' || param !== undefined || param !== null) {
          dbRef.orderByChild(key).equalTo(param).once('value', snapshot => {
          const data = snapshot.val()
          res(data)
        })
      } else {
        res(null);
      }
    });
  }

  getKeywordData = (keyword) => {
    // console.log(keyword)
    // axois call to functions endpoint with keyword as a param
    return axios({
      method: 'get',
      url: `https://us-central1-hy-jobs-board.cloudfunctions.net/searchKeywords/?keyword=${keyword}`,
      responseType: 'json'
    })
      .then(res => {
        res = res.data;
        return res
      })
      .catch(err =>{
        console.log(err)
      })
    
  }
  findJobInDatabase(jobLocation, jobCommitment, timeSincePosting, salary, searchKeywords){

    let matchingLocation = this.getData(`jobLocation`, jobLocation)
    let matchingSalary = this.getData(`salary`, salary)
    let matchingTimeCommitment = this.getData(`jobCommitment`, jobCommitment)

    // replace the keywords array with an array of promises 
    searchKeywords = searchKeywords.map(this.getKeywordData)

    Promise.all([matchingLocation, matchingSalary, matchingTimeCommitment, ...searchKeywords])
 
      .then( allDataSets => {
        console.log(`this is all data sets`, allDataSets)
        console.log('got em all');

        let allJobKeys =[]
        let allJobs = {}
        let numberOfParams=0
        let filteredJobs ={}
        allDataSets.map( singleJobDataSet => {
          let parametersKeys=[]

          // for each dataset that is not null
          if (singleJobDataSet != null){
            // get each job 
            for (let job in singleJobDataSet){
              // push each job's key into an array
              parametersKeys.push(job)
              singleJobDataSet[job].key = job
              // add each job to our collection of jobs for this search
              allJobs[job] = (singleJobDataSet[job])
            }
            //push that array of keys into an array of arrays
            allJobKeys.push(parametersKeys)
          }
          numberOfParams++
        })

        // intersection() is a lodash function imported at the top of this page
        // that returns all keys that are in all the arrays provided
        // they're passed into the function here using the spread operator
        let chosenJobsKeys = intersection(...allJobKeys)
      
        //go through allJobs using the keys from chosenJobsKeys
        chosenJobsKeys.map(jobKey =>{

          for (let job in allJobs) {

            if(allJobs[job].key === jobKey){

              // filteredJobs.push(allJobs[job])
              // make the key equal to the value of the job information
              // add that job information to the filteredJobs object
              filteredJobs[job] = allJobs[job]
              // console.log(filteredJobs[job], allJobs[job])
            } else{
              // console.log('nope')
            }
          }
        });
        if (chosenJobsKeys.length < 2 && numberOfParams > 1) {
          console.log('there are no results at this intersection')
        }

        console.log(`filteredJobs `, filteredJobs)
        return filteredJobs
      })
      .then( res =>{
        this.setState({
          filteredJobs: res
        })
      })
      .catch( err => {
        console.log(err)
      }); 
    }
  search = (e, jobLocation, jobCommitment, timeSincePosting, salary, searchKeywords) => {
    e.preventDefault();
    this.findJobInDatabase(jobLocation, jobCommitment, timeSincePosting, salary, searchKeywords)
  } 
  render() {
    return <div className="wrapper">
        {this.state.loggedIn ? <div>
            <UserBar userId={this.state.userId} userName={this.state.userName} userEmail={this.state.email} loggedIn={this.state.loggedIn} provider={this.state.provider} jobPoster={this.state.jobPoster} alumni={this.state.alumni} admin={this.state.admin} signOut={this.signOut} />

            {this.state.editing ? <AddJobForm editing={this.state.editing} userId={this.state.userId} close={this.closePostAJob} /> : <button onClick={this.postAJob}>
                Post a job </button>}
                <nav>
                  {/* <NavLink>Pending Jobs</NavLink>
                  <NavLink>My Posted Jobs</NavLink>
                  <NavLink>Approved Jobs</NavLink>
                  <NavLink>Approved Jobs</NavLink> */}

                </nav>
            <Search userId={this.state.userId} search={this.search} />
            <div className="tab-container">
          {this.state.admin && <PendingJobs userId={this.state.userId}/>}
              {this.state.jobPoster && <MyPostedJobs userId={this.state.userId} />}
              {this.state.alumni && <JobFeed userId={this.state.userId} filteredJobs = {this.state.filteredJobs}/>}
          {this.state.admin && <ApprovedJobs userId={this.state.userId}/>}
            </div>
          </div> : <div>
            <p>Sign up or sign in with</p>
            <button onClick={this.loginWithReadme}>Readme</button>
            <button onClick={this.loginWithGoogle}>Google</button>
            <button onClick={this.loginWithEmail}>Email</button>
            {this.state.loggedIn === false && this.state.provider === "readme" && <ReadmeLoginForm />}
            {this.state.loggedIn === false && this.state.provider === "email" && <EmailLoginForm />}
          </div>}
      </div>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
