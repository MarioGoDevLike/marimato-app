import React from 'react';
import './RandomNumberTable.css';

class NumberTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: this.generateInitialNumbers(),
      playerTotalValue: 0,
      pcTotalValue: 0,
      isPlayerTurn: true, // Add isPlayerTurn state,
      selectedColumn:null,
      hoveredRow:null
    };
  }

  generateInitialNumbers = () => {
    const numbers = [];
    for (let i = 0; i < 9; i++) {
      numbers.push(this.getRandomNumberArray(9));
    }
    return numbers;
  };

  getRandomNumberArray = (length) => {
    const numbers = Array.from({ length }, (_, index) => index + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  };

  handleCellClick = (rowIndex, colIndex) => {
    if (!this.state.isPlayerTurn) {
      return; // Ignore clicks during PC's turn
    }
  
    const clickedNumber = this.state.numbers[rowIndex][colIndex];
    
    if (clickedNumber !== null) {
      const updatedNumbers = [...this.state.numbers];
      updatedNumbers[rowIndex] = updatedNumbers[rowIndex].map((number, index) =>
        index === colIndex ? null : number
      );
      
      this.setState(
        (prevState) => ({
          numbers: updatedNumbers,
          playerTotalValue: prevState.playerTotalValue + clickedNumber,
          isPlayerTurn: false, // Switch to PC's turn
        }),
        () => {
          setTimeout(() => {
            this.handlePCTurn();
          }, 1000); // Delay PC's turn for 1 second
        }
      );
    this.setState({selectedColumn:colIndex})
    }
  };

  handlePCTurn = () => {
    const {selectedColumn} = this.state
    const availableNumbers = [];
    this.state.numbers.forEach((row, rowIndex) => {
      row.forEach((number, colIndex) => {
        if (number !== null && colIndex === selectedColumn) {
          availableNumbers.push({ number, rowIndex, colIndex });
        }
      });
    });
   
    if (availableNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const { number, rowIndex, colIndex } = availableNumbers[randomIndex];
      const pcChosenNumber = { number, rowIndex, colIndex }
      // Find the first available number in the same row as the player's selection

      if (number !== undefined && rowIndex !== undefined && colIndex !== undefined) {
        const updatedNumbers = this.state.numbers.map((row, rIndex) =>
          row.map((num, cIndex) => (cIndex === selectedColumn && rIndex === rowIndex &&  num === pcChosenNumber.number ? null : num))
        );

        this.setState(
          (prevState) => ({
            numbers: updatedNumbers,
            pcTotalValue: prevState.pcTotalValue + pcChosenNumber.number,
          }),
          () => {
            // Wait for PC's turn, then switch to player's turn
            setTimeout(() => {
              this.setState({ isPlayerTurn: true });
            }, 1000); // Delay PC's turn for 1 second
          }
        );
      }
    } else {
      let highestNumber = {number:this.state.numbers[0][0],rowIndex:0,colIndex:0}
      this.state.numbers.map((row,rowIndex)=>{
        row.map((number,colIndex)=>{
          if(number > highestNumber.number){
            highestNumber= {number,rowIndex,colIndex}
          }
        })
      })
      const updatedNumbers = this.state.numbers.map((row, rIndex) =>
      row.map((num, cIndex) => (cIndex === highestNumber.colIndex && rIndex === highestNumber.rowIndex &&  num === highestNumber.number ? null : num))
    );
      this.setState(
        (prevState) => ({
          numbers: updatedNumbers,
          pcTotalValue: prevState.pcTotalValue + highestNumber.number,
        }),
        () => {
          // Wait for PC's turn, then switch to player's turn
          setTimeout(() => {
            this.setState({ isPlayerTurn: true });
          }, 1000); // Delay PC's turn for 1 second
        }
      );
      alert(`Bot chose the highest available number ${highestNumber.number}, column:${highestNumber.colIndex + 1}, row: ${highestNumber.rowIndex + 1}`)
      this.setState({ isPlayerTurn: true });
    }
  };

  render() {
    const {selectedColumn,hoveredRow,isPlayerTurn} = this.state

    return (
      <div className='all-container'>
        <div className='title-text'>Matimato</div>
        <div className='Total-PC'>Player 1 Total Value: {this.state.playerTotalValue}</div>
        <div className='Total-PC'>PC Total Value: {this.state.pcTotalValue}</div>
        <h3 className='Total-PC' style={{color:'#2F697B'}}>{isPlayerTurn ? 'Your turn' : 'Bot1 turn'}</h3>
        <table className='container'>
          <tbody className='table-all'>
            {this.state.numbers.map((rowNumbers, rowIndex) => (
              <tr onMouseOver={()=>{
                if(hoveredRow !== rowIndex){
                  this.setState({hoveredRow:rowIndex})
                }
              }} className='table-row' key={rowIndex}>
                {rowNumbers.map((number, colIndex) => (
                  <td
                    className='table-number'
                    key={colIndex}
                    style={(colIndex === selectedColumn && !isPlayerTurn) ? {backgroundColor:'grey'} :( rowIndex === hoveredRow && isPlayerTurn) ? {backgroundColor:'grey'} : {}}
                    onClick={() => this.handleCellClick(rowIndex, colIndex)}
                  >
                    {number !== null ? number : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div>
        </div>

      </div>
    );
  }
}

export default NumberTable;