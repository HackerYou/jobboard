import React from 'react';

class Keyword extends React.Component {
  constructor(props){
    super(props);

  }
  componentDidMount(){

  }

handleChange = (e) =>{
  // e.preventDefault()
  // this.setState({
  //   newUserName: e.target.value
  // })
}
  render(){
    return(
      <div>
        {/* <h1>{this.props.word}</h1> */}
        <input type="checkbox" />
        <label htmlFor={this.props.word}>{this.props.word}</label>
      </div>
    )
  }
}
export default Keyword;