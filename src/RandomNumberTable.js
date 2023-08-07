import React from 'react';
import './RandomNumberTable.css';

class NumberTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: this.generateInitialNumbers(),
      playerTotalValue: 0,
      pcTotalValue: 0,
      isPlayerTurn: true, // Add isPlayerTurn state
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
    }
  };

  handlePCTurn = () => {
    const availableNumbers = [];
    this.state.numbers.forEach((row, rowIndex) => {
      row.forEach((number, colIndex) => {
        if (number !== null) {
          availableNumbers.push({ number, rowIndex, colIndex });
        }
      });
    });

    if (availableNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const { number, rowIndex, colIndex } = availableNumbers[randomIndex];

      // Find the first available number in the same row as the player's selection
      const pcChosenNumber = this.state.numbers[rowIndex].find((num) => num !== null);

      if (pcChosenNumber !== undefined) {
        const updatedNumbers = this.state.numbers.map((row, rIndex) =>
          row.map((num, cIndex) => (rIndex === rowIndex && num === pcChosenNumber ? null : num))
        );

        this.setState(
          (prevState) => ({
            numbers: updatedNumbers,
            pcTotalValue: prevState.pcTotalValue + pcChosenNumber,
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
      // No available numbers for PC, switch to player's turn immediately
      this.setState({ isPlayerTurn: true });
    }
  };

  render() {
    return (
      <div className='all-container'>
        <div className='title-text'>Matimato</div>
        <div className='Total-PC'>Player 1 Total Value: {this.state.playerTotalValue}</div>
        <div className='Total-PC'>PC Total Value: {this.state.pcTotalValue}</div>
        <table className='container'>
          <tbody className='table-all'>
            {this.state.numbers.map((rowNumbers, rowIndex) => (
              <tr className='table-row' key={rowIndex}>
                {rowNumbers.map((number, colIndex) => (
                  <td
                    className='table-number'
                    key={colIndex}
                    onClick={() => this.handleCellClick(rowIndex, colIndex)}
                  >
                    {number !== null ? number : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default NumberTable;
