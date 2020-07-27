// This app can take in a Brainfuck script and generate a step-by-step visualization
// by feeding the inputted script to a Brainfuck server, and then retrieving all of the steps
// of executing that script.  It can show a user-specified N number of cells.  The visualization
// can go to the first step, the previous step, the next step, and the last step.

import React, { Component } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Cells from './components/Cells';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bfInputText : "",
      bfScript : "",
      bfStateArray: [],
      bfState : {},
      currentBfUuid: "",
      errorText: "",
      showNCells: 10, // default
      step: 0
    };
  }

  updateBfScript = (e) => {
    this.setState({
      bfScript: e.target.value
    });
  }


  initializeBfState = () => {
    const { bfStateArray, bfScript } = this.state;

    axios.post('http://localhost:4000/brainfuck', {"script": bfScript, 'Access-Control-Allow-Origin': '*'})
    .then(response => {
      console.log("response", response.data);
      this.setState({ bfStateArray: [ ...bfStateArray, response.data ], currentBfUuid: response.data.uuid, errorText: "" });
    })
    .catch(error => {
      console.log('Error: ', error.response.data);
      this.setState({ errorText: error.toString() + "; did you enter a script?" });
    });
  }

  updateN = (e) => {
    this.setState({
      showNCells: e.target.value
    });
  }

  getAllSteps = () => {
    axios
      .post(`http://localhost:4000/brainfuck/${this.state.currentBfUuid}/allsteps`, {'Access-Control-Allow-Origin': '*'})
      .then(response => {
        this.setState({ bfStateArray: [...this.state.bfStateArray, ...response.data], errorText: "" })
      })
      .catch(error => {
        console.log('Error: ', error.toString());
        this.setState({ errorText: "There has been an error" });
        return "Error!!"
      });
  }

  // Here, I tried to recursively post to the /step endpoint, but it seemed like the
  // async functions didn't want to await for the post requests to finish.
  // getAllSteps = async (subsequentBfStates, done) => {
  //   // simulate the whole thing:
  //   //// at each step, store the steps in a state array
  //   //// keep track of what step we're on with a step counter
  //   // console.log("BSA", this.state.bfStateArray);

  //   const { currentBfUuid } = this.state;
  //   if (done) {
  //     return subsequentBfStates;
  //   }
    
  //   axios.post(`http://localhost:4000/brainfuck/${currentBfUuid}/step`, {'Access-Control-Allow-Origin': '*'})
  //   .then(async (response) => {
  //       return await this.getAllSteps([...subsequentBfStates, response.data], response.data.done);
  //     }
  //   )
  //   .catch(error => {
  //     console.log('Error: ', error);
  //     // this.setState({ errorText: error });
  //     return "Error!!"
  //   });
  // }

  // beginVisualization = async () => {
  //   await this.initializeBfState();
  //   await this.getAllSteps();
  // }
  
  navToFirstStep = () => {
    this.setState({ step: 0 });
  }

  navToLastStep = () => {
    this.setState({ step: this.state.bfStateArray.length - 1 });
  }

  navToPrevStep = () => {
    this.setState({ step: this.state.step - 1 });
  }

  navToNextStep = () => {
    this.setState({ step: this.state.step + 1 });
  }
  

  render() {
    const { bfStateArray, errorText, showNCells, step, currentBfUuid } = this.state;
    return (
      <div className="App">
          <div className="setup">
            <div>
              <h1>Brain%@!# Interpreter</h1>
              <div>
              Enter your brainfuck script here:<br />
              <textarea onChange={this.updateBfScript} /><br/>
              <Button onClick={this.initializeBfState}>Enter Brainfuck script</Button>
            </div>
              <h3>What is Brain%@!#?</h3>
              <p>Brainfuck is the ungodly creation of Urban Müller, whose goal was apparently to create a Turing-complete language for which he could write the smallest compiler ever, for the Amiga OS 2.0. His compiler was 240 bytes in size. (Though he improved upon this later -- he informed me at one point that he had managed to bring it under 200 bytes.)</p>
              <table>
                <tr><td><tt>&gt;&nbsp;</tt></td><td>Increment the pointer.</td></tr>
                <tr><td><tt>&lt;&nbsp;</tt></td><td>Decrement the pointer.</td></tr>
                <tr><td><tt>+&nbsp;</tt></td><td>Increment the byte at the pointer.</td></tr>
                <tr><td><tt>-&nbsp;</tt></td><td>Decrement the byte at the pointer.</td></tr>
                <tr><td><tt>.&nbsp;</tt></td><td>Output the byte at the pointer.</td></tr>
                <tr><td><tt>,&nbsp;</tt></td><td>Input a byte and store it in the byte
                                                at the pointer.</td></tr>
                <tr><td><tt>[&nbsp;</tt></td><td>Jump forward past the matching <tt>]</tt>
                                                if the byte at the pointer is zero.</td></tr>
                <tr><td><tt>]&nbsp;</tt></td><td>Jump backward to the matching <tt>[</tt>
                                                unless the byte at the pointer is zero.</td></tr>
                </table>
              
              <p>From https://www.muppetlabs.com/~breadbox/bf/</p>
            </div>
          </div>
        <div className="visual">
          {
            currentBfUuid &&
              <Button onClick={this.getAllSteps}>Begin visualization</Button>
          }

          {
            bfStateArray.length > 1 &&
            <div>
              <p>
                <span style={{color: "red"}}>Red</span> is the pointer at the instruction; <u>underline</u> is the pointer at the cell.
              </p>
              <Cells
                bfState={bfStateArray[step]}
                N={showNCells}
              />
              Show <input onChange={this.updateN} value={showNCells}/> cells at a time
              <div><strong>Viewing step {step}</strong></div>
              <div>
                <Button onClick={this.navToFirstStep} disabled={step == 0}>First</Button>
                <Button onClick={this.navToPrevStep} disabled={step == 0}>Prev</Button>
                <Button onClick={this.navToNextStep} disabled={step == bfStateArray.length - 1}>Next</Button>
                <Button onClick={this.navToLastStep} disabled={step == bfStateArray.length - 1}>Last</Button>
              </div>
            </div>
          }
          {
            errorText &&
            <div>{errorText}</div>
          }
        </div>
      </div>
    );
  }
}

export default App;
