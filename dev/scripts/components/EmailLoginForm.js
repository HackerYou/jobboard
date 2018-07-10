import React from 'react';
import firebase from 'firebase';
import { Link, Route, Switch } from 'react-router-dom';

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
        firebase.auth().createUserWithEmailAndPassword(email, password).catch( (error)=> {
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log(errorCode, errorMessage)
        })
          .then(this.setUserInDB.bind(null,userSubmittedName))
      }
      
    }).then(this.setUserInDB.bind(null,userSubmittedName))
  
  }

  setUserInDB = (userSubmittedName,res) => {
    console.log(userSubmittedName)
      // console.log(usm, email)
      //get the information at the user's uid node in the user database
      const userRef = firebase.database().ref(`users/${res.user.uid}`)

      //if the user exists already in the database, return
      userRef.on('value', function (snapshot) {

        if (snapshot.val() === null){
          // else, create a user in the database 
          userRef.set({
            'name': userSubmittedName,
            // 'email':this.state.email,
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
      <div>
        <h3>Job Posters</h3>
        <div className="cta-container">
          <Link to="/posterLogin/createAccount" className="action" onClick={this.createAccount}>New User</Link>
          <Link to="/posterLogin/returningUser" className="action" onClick={this.returningUser}>Returning User</Link>
        </div>
        <Route exact match path="/posterLogin/createAccount" render={()=>(<form action="submit" id="emailSignInForm" className="">
              <div className="">
                <label htmlFor="userSubmittedName">
                  <input type="userSubmittedName" name="userSubmittedName" id="userSubmittedName" required="false" placeholder="name" onChange={this.onChangeUserSubmittedName} value={this.state.userSubmittedName} />
                </label>
              </div>
            <div className="">
              <label htmlFor="email">
                <input type="email" name="email" id="" placeholder="email address" onChange={this.onChangeEmail} value={this.state.email} />
              </label>
            </div>
            <div className="">
              <label htmlFor="password">
                <input type="password" name="password" placeholder="password" onChange={this.onChangePassword} value={this.state.password} />
              </label>
            </div>
            <button className="action" onClick={this.signInWithEmail}>Create Account</button>
            <button className="login-button action" onClick={this.props.loginWithGoogle}>Create Account with Google</button>
          </form>)} />

          <Route exact match path="/posterLogin/returningUser" render={()=>(<form action="submit" id="emailSignInForm" className="">
            <div className="">
              <label htmlFor="email">
                <input type="email" name="email" id="" placeholder="email address" onChange={this.onChangeEmail} value={this.state.email} />
              </label>
            </div>

            <div className="">
              <label htmlFor="password">
                <input type="password" name="password" placeholder="password" onChange={this.onChangePassword} value={this.state.password} />
              </label>
            </div>
            <button className="action" onClick={this.signInWithEmail}>Sign in</button>
            <button className="login-button action" onClick={this.props.loginWithGoogle}>Log in with Google</button>
          </form>)} />
      </div>
    )
  }
}
export default EmailLoginForm;