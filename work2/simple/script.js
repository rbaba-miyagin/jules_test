document.addEventListener('DOMContentLoaded', () => {
  // Memory Game Logic
  const grid = document.querySelector('.grid-container');
  const memoryStatus = document.querySelector('#memory-status');
  if (grid) {
    const cardsArray = [ 'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H' ];
    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];
    let flippedCards = 0;
    let gameWon = false;

    function shuffle(array) {
      array.sort(() => 0.5 - Math.random());
    }

    function createBoard() {
      shuffle(cardsArray);
      for (let i = 0; i < cardsArray.length; i++) {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('data-id', i);
        const cardInner = document.createElement('div');
        cardInner.setAttribute('class', 'card-inner');
        const cardFront = document.createElement('div');
        cardFront.setAttribute('class', 'card-front');
        const cardBack = document.createElement('div');
        cardBack.setAttribute('class', 'card-back');
        cardBack.textContent = cardsArray[i];
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        grid.appendChild(card);
        card.addEventListener('click', flipCard);
      }
    }

    function checkForMatch() {
      const cards = document.querySelectorAll('.card');
      const optionOneId = cardsChosenId[0];
      const optionTwoId = cardsChosenId[1];

      if (cardsChosen[0] === cardsChosen[1]) {
        memoryStatus.textContent = 'You found a match!';
        cards[optionOneId].removeEventListener('click', flipCard);
        cards[optionTwoId].removeEventListener('click', flipCard);
        cardsWon.push(cardsChosen);
        if (cardsWon.length === cardsArray.length / 2) {
          gameWon = true;
          memoryStatus.textContent = 'Congratulations! You found them all!';
        }
      } else {
        memoryStatus.textContent = 'Sorry, try again.';
        cards[optionOneId].classList.remove('flipped');
        cards[optionTwoId].classList.remove('flipped');
      }
      cardsChosen = [];
      cardsChosenId = [];
      flippedCards = 0;
      setTimeout(() => {
          if (!gameWon) {
            memoryStatus.textContent = '';
          }
      }, 1500);
    }

    function flipCard() {
      if (flippedCards < 2 && !this.classList.contains('flipped') && !gameWon) {
        let cardId = this.getAttribute('data-id');
        cardsChosen.push(cardsArray[cardId]);
        cardsChosenId.push(cardId);
        this.classList.add('flipped');
        flippedCards++;
        if (flippedCards === 2) {
            setTimeout(checkForMatch, 500);
        }
      }
    }
    createBoard();
  }


  // Tic-Tac-Toe Logic
  const statusDisplay = document.querySelector('#status');
  const cells = document.querySelectorAll('[data-cell]');
  const restartButton = document.querySelector('#restartButton');

  if (statusDisplay && cells.length && restartButton) {
    const X_CLASS = 'x';
    const O_CLASS = 'o';
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let oTurn;

    startGame();

    restartButton.addEventListener('click', startGame);

    function startGame() {
        oTurn = false;
        cells.forEach(cell => {
            cell.classList.remove(X_CLASS);
            cell.classList.remove(O_CLASS);
            cell.removeEventListener('click', handleClick);
            cell.addEventListener('click', handleClick, { once: true });
        });
        setBoardHoverClass();
        statusDisplay.innerText = `X's turn`;
    }

    function handleClick(e) {
        const cell = e.target;
        const currentClass = oTurn ? O_CLASS : X_CLASS;
        placeMark(cell, currentClass);
        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
            statusDisplay.innerText = `${oTurn ? "O" : "X"}'s turn`;
        }
    }

    function endGame(draw) {
        if (draw) {
            statusDisplay.innerText = 'Draw!';
        } else {
            statusDisplay.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
        }
        cells.forEach(cell => {
            cell.removeEventListener('click', handleClick);
        });
    }

    function isDraw() {
        return [...cells].every(cell => {
            return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
        });
    }

    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
    }

    function swapTurns() {
        oTurn = !oTurn;
    }

    function setBoardHoverClass() {
        // This function would be used to show a hover state for the current player
    }

    function checkWin(currentClass) {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return cells[index].classList.contains(currentClass);
            });
        });
    }
  }
});
