import React from 'react';
import firebase from 'firebase';

class Search extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {

  }
  render() {
    return (
      <div>
        <h3>Search</h3>
        <button onClick={() =>{ console.log(new Date())}}></button>
      </div>

    )
  }
}
export default Search;