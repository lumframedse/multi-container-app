 import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Fib from './Fib';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header >
          <Link to="/">Home page</Link> 
        </header>
        <div>
          <Route exact path="/" component={Fib} />
        </div>
      </div>
    </Router>
  );
}
 
export default App;
