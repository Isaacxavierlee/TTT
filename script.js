window.addEventListener('DOMContentLoaded', () => {
  const mainElement = document.querySelector('main');
  const themeToggle = document.getElementById('theme-toggle');
  const tiles = Array.from(document.querySelectorAll('.tile'));
  const playerDisplay = document.querySelector('.display-player');
  const resetButton = document.querySelector('#reset');
  const announcer = document.querySelector('.announcer');

  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let isGameActive = true;

  const PLAYERX_WON = 'PLAYERX_WON';
  const PLAYERO_WON = 'PLAYERO_WON';
  const TIE = 'TIE';

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function handleResultValidation() {
    let roundWon = false;
    let winningTiles = [];

    for (let i = 0; i <= 7; i++) {
      const winCondition = winningConditions[i];
      const a = board[winCondition[0]];
      const b = board[winCondition[1]];
      const c = board[winCondition[2]];

      if (a === '' || b === '' || c === '') {
        continue;
      }

      if (a === b && b === c) {
        roundWon = true;
        winningTiles = winCondition;
        break;
      }
    }

    if (roundWon) {
      announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
      highlightWinningTiles(winningTiles);
      isGameActive = false;
      return;
    }

    if (!board.includes('')) {
      announce(TIE);
    }
  }

  const announce = (type) => {
    switch (type) {
      case PLAYERO_WON:
        announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
        break;
      case PLAYERX_WON:
        announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
        break;
      case TIE:
        announcer.innerText = 'Tie';
    }
    announcer.classList.remove('hide');
  };

  const highlightWinningTiles = (winningTiles) => {
    winningTiles.forEach(index => {
      tiles[index].classList.add('winning-tile');
    });
  };

  const isValidAction = (tile) => {
    if (tile.innerText === 'X' || tile.innerText === 'O') {
      return false;
    }

    return true;
  };

  const updateBoard = (index) => {
    board[index] = currentPlayer;
  };

  const changePlayer = () => {
    playerDisplay.classList.remove(`player${currentPlayer}`);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerDisplay.innerText = currentPlayer;
    playerDisplay.classList.add(`player${currentPlayer}`);
  };

  const userAction = (tile, index) => {
    if (isValidAction(tile) && isGameActive) {
      tile.innerText = currentPlayer;
      tile.classList.add(`player${currentPlayer}`);
      updateBoard(index);
      handleResultValidation();
      changePlayer();
    }
  };

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    announcer.classList.add('hide');

    tiles.forEach(tile => {
      tile.innerText = '';
      tile.classList.remove('playerX', 'playerO', 'winning-tile');
    });
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateRandomThemes = () => {
    const themes = [];
    for (let i = 0; i < 5000; i++) {
      themes.push(`linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`);
    }
    return themes;
  };

  const applyTheme = (theme) => {
    mainElement.style.background = theme;
  };

  const themes = generateRandomThemes();
  let currentThemeIndex = 0;

  themeToggle.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(themes[currentThemeIndex]);
  });

  tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => userAction(tile, index));
  });

  resetButton.addEventListener('click', resetBoard);
});
