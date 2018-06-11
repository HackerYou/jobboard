import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter} from 'react-router-dom';
class App extends React.Component {
  render() {
    return (
      <div>
        This is our job board!
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
