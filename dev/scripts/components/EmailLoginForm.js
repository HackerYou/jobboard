import React from 'react';


class EmailLoginForm extends React.Component {
  constructor(){
    super();
    // this.loginWithGoogle = this.loginWithGoogle.bind(this)
    // this.signOut = this.signOut.bind(this)
    this.onChangeEmail = this.onChangeEmail.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
    this.state = {
      email:'',
      password:''
    }
  }
  componentDidMount(){

  }
  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    })
  }
  onChangePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  render(){
    return(
      <form action="" id="emailSignInForm">
        <label htmlFor="">email:</label>
        <input type="email" name="email" id="" placeholder="enter your email" onChange={this.onChangeEmail} value={this.state.email} />
        <label htmlFor="">password:</label>
        <input type="password" name="password" placeholder="enter your password" onChange={this.onChangePassword} value={this.state.password} />
        <input type="submit" />
      </form>
    )
  }
}
export default EmailLoginForm;