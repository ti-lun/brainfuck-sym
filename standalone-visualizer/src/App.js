import React, { Component } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Cells from './components/Cells';

import './App.css';

class Visualizer extends Component {
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
    const { bfInputText, bfScript, bfStateArray, errorText, showNCells, step, currentBfUuid } = this.state;
    return (
      <div className="App">
        <div>
          <h1>Brain%@!# Interpreter</h1>
          <p>Hello this is a BRAIN FUZZLES interpreter.  YEET</p>
        </div>
        <div>
          Enter your brainfuck script here:<br />
          <textarea onChange={this.updateBfScript} />
        </div>
        <div>
          <Button onClick={this.initializeBfState}>Enter Brainfuck script</Button>
          {
            currentBfUuid &&
              <Button onClick={this.getAllSteps}>Begin visualization</Button>
          }
          {
            bfStateArray.length > 1 &&
            <div>
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

export default Visualizer;
