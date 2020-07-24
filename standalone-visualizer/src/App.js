import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Visualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bfText : ""
    };
  }

  updateBfText = (e) => {
    this.setState({
      bfText: e.target.value
    });
  }

  render() {
    const { bfText } = this.state;
    return (
      <div className="App">
        <div>
          <h1>Brain%@!# Interpreter</h1>
          <p>Hello this is a BRAIN FUZZLES interpreter.  YEET</p>
        </div>
        <div>
          <textarea value={bfText} onChange={this.updateBfText}/>
        </div>
        <div>
          You typed in: {bfText}
        </div>
        <div>
          HEIFNSDFKSDF lol
        </div>
      </div>
    );
  }
}

export default Visualizer;
