import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, 
  Switch, 
  Link, 
  Route
} from 'react-router-dom';
import firebase from 'firebase';
import ReadmeLoginForm from './components/ReadmeLoginForm';
import EmailLoginForm from './components/EmailLoginForm';
import UserBar from './components/UserBar';
import AddJobForm from './components/AddJobForm';
import JobFeed from './components/JobFeed';
import PendingJobs from './components/PendingJobs';
import ApprovedJobs from './components/ApprovedJobs';
import MyPostedJobs from './components/MyPostedJobs';
import MySavedJobs from './components/MySavedJobs';

import Search from './components/Search'
import axios from 'axios';
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
      filteredJobs:{},
    }

  }
  componentDidMount(){
    
    this.dbRef = firebase.database().ref(`jobs/approved`)
    this.dbRef.on('value', snapshot => {
      const data = snapshot.val();
      if(data !== null) {
        this.setState({
          filteredJobs: data
        })
      }
    })
  
    firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        // this.dbRef.on('value', snapshot => { });
        this.userRef = firebase.database().ref(`users/${user.uid}`)

        this.setState({
          loggedIn: true,
          userId: user.uid,
          userName: user.displayName
        }, () => {
          this.userRef.on('value', snapshot => {
            let resp = snapshot.val()
            if (resp != null){
              this.setState({
                admin: resp.admin,
                alumni: resp.alumni,
                jobPoster: resp.jobPoster,
                userName: resp.name
              });
            }
          });
        });
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
          if (snapshot.val()===null){
          // else, create a user in the database 
            userRef.set({
              'name':res.user.displayName,
              'jobPoster':true,
              'alumni':false,
              'admin':false
            })
          } 
        });
      })
      .catch(err => {

      });

  }

  loginWithEmail = (e) => {
    this.setState({
      provider: 'email'
    })
  }

  changeProvider = () => {
    const newProvider = this.state.provider === 'email' ? 'readme' : 'email';
    this.setState({
      provider: newProvider
    })
  }

  signOut = () => {
    firebase.auth().signOut();
    this.dbRef.off('value');
    this.userRef.off('value');
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
        dbRef.once('value', snapshot => {
          const data = snapshot.val()
          res(data)
        })
      } else {
          dbRef.orderByChild(key).equalTo(param).once('value', snapshot => {
          const data = snapshot.val()
          res(data)
        })
      } 
    });
  }

  getDateData = (key, param) =>{
    return new Promise((res) => {
      const dbRef = firebase.database().ref(`jobs/approved`)
      if (param === 1) {
        dbRef.once('value', snapshot => {
          const data = snapshot.val()
          res(data)
        })
      } else if(param === 0 ){
          res(null)
      }
      else {
          dbRef.orderByChild(key).startAt(param).once('value', snapshot => {
            const data = snapshot.val()
            res(data)
        })
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
  findJobInDatabase = (jobLocation, jobCommitment, timeSincePosting, salary, searchKeywords, advancedSearch) =>{
    let matchingLocation = this.getData(`jobLocation`, jobLocation === '' ? 'any' : jobLocation)
    let matchingSalary = this.getData(`salary`, salary)
    let matchingTimeCommitment = this.getData(`jobCommitment`, jobCommitment)

    let matchingTimeSincePosting = this.getDateData(`timeCreated`, parseInt(timeSincePosting))

      // replace the keywords array with an array of promises 
    searchKeywords = searchKeywords.map(this.getKeywordData)

    Promise.all([matchingLocation, matchingSalary, matchingTimeCommitment, matchingTimeSincePosting, ...searchKeywords])

      .then( allDataSets => {
        
        // console.log(`all data sets`, allDataSets)
        let allJobKeys =[]
        let allJobs = {}
        let numberOfParams=0
        let nonnullDataSets =0
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
            numberOfParams++
          }
          // increase the number of parameters by one
        })

        // intersection() is a lodash function imported at the top of this page
        // that returns all keys that are in all the arrays provided
        // they're passed into the function here using the spread operator
        let chosenJobsKeys = intersection(...allJobKeys)
      
        //go through allJobs using the keys from chosenJobsKeys
        chosenJobsKeys.map(jobKey => {

          for (let job in allJobs) {

            if(allJobs[job].key === jobKey){

              // filteredJobs.push(allJobs[job])
              // make the key equal to the value of the job information
              // add that job information to the filteredJobs object
              filteredJobs[job] = allJobs[job]
            } 
          }
        });

        // if there's more than one parameter and only one dataset, return nothing
        let dataSets = Object.values(allDataSets)

        for (let set in dataSets) {
          if (dataSets[set] != null) {
            nonnullDataSets++
          }
        }

        if (jobLocation === '') {
          
          if (jobCommitment === '' && timeSincePosting === 0 && searchKeywords.length === 0 && salary === ''){
            // if it's the first time a user has loaded the page
            // and they hit search, leave the values as they are
          // console.log( `first time`)
          filteredJobs = this.state.filteredJobs
          } else if (numberOfParams >= 1 && nonnullDataSets <= 2) {
            // if there is more than one param
            // and only one dataset
            // return nothing
            // console.log(`fewer results than parameters`)
            filteredJobs = {}
          }  
        }    
        // if location has been chosen by user or is at its initial state
        // and one or more of the advanced search fields are filled in
        // and there is only one dataset coming back 
        // return nothing
        if (jobLocation ==='any' && 
          (nonnullDataSets<numberOfParams ) && 
          (jobCommitment === '' || timeSincePosting === 0 || searchKeywords.length === 0) 
          ){
            filteredJobs = {}
          } 
        if ((jobLocation === '' || jobLocation === 'any') && jobCommitment === 'any'){
          
        }

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

  search = (e, jobLocation, jobCommitment, timeSincePosting, salary, searchKeywords, advancedSearch) => {
    e.preventDefault();
    this.findJobInDatabase(jobLocation, jobCommitment, timeSincePosting, salary, searchKeywords, advancedSearch)
  } 

  render() {
    return (
            <Router>
              <div className="wrapper">
                  {this.state.loggedIn ? 
                    <div>
                      <UserBar  userId={this.state.userId} 
                                userName={this.state.userName} 
                                loggedIn={this.state.loggedIn} 
                                provider={this.state.provider} 
                                jobPoster={this.state.jobPoster} 
                                alumni={this.state.alumni} 
                                admin={this.state.admin} 
                                signOut={this.signOut} />
                      <div className="tab-container">
                        <Switch>
                          <Route exact path="/addJobForm" render={() => <AddJobForm editing={this.state.editing} userId={this.state.userId} close={this.closePostAJob} />} />

                          {this.state.admin && 
                            <Switch>
                              
                              <Route exact path="/" render={() => ( <PendingJobs userId={this.state.userId} alumni={this.state.alumni} jobPoster={this.state.jobPoster} admin={this.state.admin} /> )} />
                              
                              <Route exact path="/approved" render={() => (<ApprovedJobs userId={this.state.userId}  alumni={this.state.alumni} jobPoster={this.state.jobPoster} admin={this.state.admin} />)} />
                              
                              <Route exact path="/jobFeed" render={() => (<div>
                                <Search userId={this.state.userId} search={this.search} />
                                <JobFeed userId={this.state.userId} alumni={this.state.alumni} jobPoster={this.state.jobPoster} admin={this.state.admin} filteredJobs={this.state.filteredJobs} />
                              </div>)} />
                            
                            </Switch>
                          }

                          {this.state.alumni && 
                            <div>

                              <Switch>
                                <Route exact path="/" render={() => (<div>
                                                                            <Search userId={this.state.userId} search={this.search} /> 
                                                                            <JobFeed userId={this.state.userId} alumni={this.state.alumni} jobPoster={this.state.jobPoster} admin={this.state.admin} filteredJobs={this.state.filteredJobs}/>
                                                                          </div>)}
                                /> 
                                <Route exact path="/jobFeed" render={() => (<div>
                                                                            <Search userId={this.state.userId} search={this.search} /> 
                                                                            <JobFeed userId={this.state.userId} alumni={this.state.alumni} jobPoster={this.state.jobPoster} admin={this.state.admin} filteredJobs={this.state.filteredJobs}/>
                                                                          </div>)}
                                /> 
                                <Route exact path="/mySavedJobs" render={() => (<MySavedJobs userId={this.state.userId} alumni={this.state.alumni} jobPoster={this.state.jobPoster} admin={this.state.admin} />)} />
                                <Route exact path="/myPostedJobs" render={() => (<MyPostedJobs userId={this.state.userId} alumni={this.state.alumni} jobPoster={this.state.jobPoster} admin={this.state.admin} />)} />
                              </Switch>
                            </div>
                          }
                          
                          {this.state.jobPoster &&
                            <Route exact path="/" render={() => (<MyPostedJobs userId={this.state.userId} alumni={this.state.alumni} jobPoster={this.state.jobPoster} admin={this.state.admin} />)} />
                          }

                        </Switch>
                      </div> {/* end tab-container */}
                    </div> // end wrapper
          : 
          
                    <div className='login-wrapper'>
                        <Route exact path="/" render={()=>(
                          <div className="login-content-wrapper">
                            <h1>HackerYou Job Board</h1>
                            <div className="login-button-container">
                              <Link to="/alumniLogin" className="action login-button" onClick={this.loginWithReadme}>Find a Job</Link>
                              <Link to="/posterLogin" className="action login-button" onClick={this.loginWithEmail}>Post a Job</Link>
                            </div>
                          </div>
                        )} />

                        <Route exact path="/alumniLogin" component={ReadmeLoginForm} />
                        <Route path="/posterLogin" render={()=> (<EmailLoginForm loginWithGoogle={this.loginWithGoogle} /> )}
                        />
                    </div>
                    }
                </div>
            </Router>
    )

  }
}

ReactDOM.render(<App />, document.getElementById('app'));
