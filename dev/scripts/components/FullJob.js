import React from 'react';
import firebase from 'firebase';

class FullJob extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  render() {
    return (
      <div>
        <h3>this is full job{this.props.jobId}</h3>
      </div>

    )
  }
}
export default FullJob;