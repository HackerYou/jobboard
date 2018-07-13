import React from 'react';
import firebase from 'firebase';
import { NavLink, Link, Route, Switch } from 'react-router-dom';

class EmailLoginForm extends React.Component {
  constructor(){
    super();
    this.state = {
      email:'',
      password:'',
      userSubmittedName:'',
      returningUser:''
    }
  }

  signInWithEmail = (e) =>{
    e.preventDefault();
    let email = this.state.email
    let password = this.state.password
    let userSubmittedName = this.state.userSubmittedName;

    firebase.auth().signInWithEmailAndPassword(email, password).catch( (error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage, email, password);

      if (error.code === `auth/user-not-found`) {
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log(errorCode, errorMessage)
      }
      
    }).then(this.setUserInDB.bind(null,userSubmittedName))
  
  }

  createNewUser = (e) =>{
    e.preventDefault();
    let email = this.state.email
    let password = this.state.password
    let userSubmittedName = this.state.userSubmittedName;

    firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
      console.log(`creating`)
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage)
    })
    .then(this.setUserInDB.bind(null, userSubmittedName))
  }

  setUserInDB = (userSubmittedName,res) => {
    console.log(res)
      //get the information at the user's uid node in the user database
      const userRef = firebase.database().ref(`users/${res.user.uid}`)

      //if the user exists already in the database, return
      userRef.on('value', function (snapshot) {

        if (snapshot.val() === null){
          // else, create a user in the database 
          userRef.set({
            'name': userSubmittedName,
            'jobPoster': true,
            'alumni': false,
            'admin': false
          })
        }
      });
    }
  onChangeEmail = (e) => {
    this.setState({
      email: e.target.value
    })
  }
  onChangePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }
  onChangeUserSubmittedName = (e) => {
    this.setState({
      userSubmittedName: e.target.value
    })
  }
  returningUser = () =>{
    this.setState({
      returningUser:true
    })
  }
  createAccount = () =>{
    this.setState({
      returningUser: false
    })
  }
  
  render(){
    return(
      <div className="secondWrapper">
        <div className="signInForm">
          <h2>Job Posters</h2>
          <div className="userType">
            <NavLink to="/posterLogin/createAccount" className="userTypeLink" activeClassName='activeLink' onClick={this.createAccount}>New User</NavLink>
            <NavLink to="/posterLogin/returningUser" className="userTypeLink" activeClassName='activeLink' onClick={this.returningUser}>Returning User</NavLink>
          </div>
          <Route exact match path="/posterLogin/createAccount" render={()=>(<form action="submit" id="emailSignInForm" className="">
              <div className="formTextInput">
                <label htmlFor="userSubmittedName">Name</label>
              <input type="userSubmittedName" name="userSubmittedName" id="userSubmittedName" required="false" placeholder="name" onChange={this.onChangeUserSubmittedName} value={this.state.userSubmittedName} />
              </div>
              <div className="formTextInput">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="" placeholder="email address" onChange={this.onChangeEmail} value={this.state.email} />
              </div>
              <div className="formTextInput">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="password" onChange={this.onChangePassword} value={this.state.password} />
              </div>
              <button className="action login-button" onClick={this.createNewUser}>Create Account</button>
              <p className="orSeparation">OR</p>
              <button className="login-button action" onClick={this.props.loginWithGoogle}>Create Account with Google</button>
            </form>)} />

            <Route exact match path="/posterLogin/returningUser" render={()=>(<form action="submit" id="emailSignInForm" className="">
              <div className="formTextInput">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="" placeholder="email address" onChange={this.onChangeEmail} value={this.state.email} />
              </div>

              <div className="formTextInput">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="password" onChange={this.onChangePassword} value={this.state.password} />
              </div>

              <button className="action login-button" onClick={this.signInWithEmail}>Sign in</button>
              <p className="orSeparation">OR</p>
              <button className="login-button action" onClick={this.props.loginWithGoogle}>Log in with Google</button>
            </form>
            )} 
            />
            <p className="otherOption">If you would like to search for jobs, <Link to="/posterLogin" className="" onClick={this.loginWithReadme}> sign in here. </Link></p>
        </div>
      </div>
    )
  }
}
export default EmailLoginForm;
