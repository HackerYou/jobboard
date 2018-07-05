import React from 'react';

class Keyword extends React.Component {
  constructor(props){
    super(props);
    this.state={
      isChecked:false
    }
  }
  componentDidMount(){

  }
  toggleCheckboxChange = () => {
    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));
    console.log(this.state.isChecked);

    this.props.handleCheckboxChange(this.props.word);
  }
  render(){
    return(
      <div >
          <input
            type="checkbox"
            value={this.props.word}
            checked={this.state.isChecked}
            onChange={this.toggleCheckboxChange}
            id={this.props.word}
          />
        <label htmlFor={this.props.word}>{this.props.word}</label>
        

      </div>
    )
  }
}
export default Keyword;

