import React, { Component } from 'react';

class Cells extends Component {
  constructor(props) {
    super(props);
  }

  onlyDisplayImportantNOrNonempty = (dataArray, N) => {
    if (dataArray) {
      let trimmedDataArray = [ ...dataArray ];
      for (let i = trimmedDataArray.length - 1; trimmedDataArray[i] === 0 && i !== N - 1; i--) {
        trimmedDataArray = trimmedDataArray.slice(0, i);
      }
      return trimmedDataArray;
    }
    else return null;
  }

  render() {
    const { bfState, N } = this.props;
    const trimmedBfState = this.onlyDisplayImportantNOrNonempty(bfState.data, N);
    console.log("bfSTate", bfState);

    return (
      <div>
        <div>
          {
            bfState.script.map((ch, idx) => {
              let chSpan = <span key={ idx } style={{color : idx == bfState.instruction_pointer - 1 ? "red" : "black", "font-size" : 30}}>{ ch }</span>;
              console.log("ip", bfState.instruction_pointer);
              return chSpan;
            })
          }
        </div>
        <div>
          { 
            trimmedBfState.map((cell, idx) => {
              let cellSpan = <span key={ idx } style={{"font-size": 30}}>{ cell }</span>;
              if (idx == bfState.data_pointer) {
                cellSpan = <u>{ cellSpan }</u>;
              }
              return cellSpan;
            })
          }
        </div>

      </div>
    );
  }
}

export default Cells;