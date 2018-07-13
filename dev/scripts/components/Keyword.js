import React from 'react';

class Keyword extends React.Component {
  constructor(props){
    super(props);
    this.state={
      isChecked: false
    }
  }

  toggleCheckboxChange = () => {
    console.log(`clicked`)
    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));
    this.props.handleCheckboxChange(this.props.word);
  }
  render(){
    return(
      <div>
          <input
            type="checkbox"
            value={this.props.word}
            checked={this.props.checkedList ? this.props.checkedList.has(this.props.word) : false}
            onChange={this.toggleCheckboxChange}
            id={this.props.word}
          />
        <label htmlFor={this.props.word}>{this.props.word}</label>
        

      </div>
    )
  }
}
export default Keyword;

