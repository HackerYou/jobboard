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
    // console.log('toggle')
    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    this.props.handleCheckboxChange(this.props.word);
  }
  render(){
    return(
      <div >
        <label htmlFor={this.props.word}>{this.props.word}
          <input
            type="checkbox"
            value={this.props.word}
            checked={this.state.isChecked}
            onChange={this.toggleCheckboxChange}
          />
        </label>

      </div>
    )
  }
}
export default Keyword;

