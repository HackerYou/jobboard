import React from 'react';


class Keyword extends React.Component {
  constructor(props){
    super(props);

  }
  componentDidMount(){

  }

handleChange = (e) =>{
  e.preventDefault()
  this.setState({
    newUserName: e.target.value
  })
}
  render(){
    return(
      <div>
       <label htmlFor=""></label>
       <input type="checkbox"/>
      </div>
    )
  }
}
export default Keyword;