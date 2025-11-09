// Complete logic of game inside this function
const game = () => {
    let playerScore = 0;
    let computerScore = 0;

    // ----- Cache DOM Elements -----
    // We find all the elements we need once and store them in variables
    const playerScoreBoard = document.querySelector('.p-count');
    const computerScoreBoard = document.querySelector('.c-count');
    const playerChoiceDisplay = document.querySelector('.player-choice');
    const computerChoiceDisplay = document.querySelector('.computer-choice');
    const resultDisplay = document.querySelector('.result');
    const optionButtons = document.querySelectorAll('.option-btn');
    const restartBtn = document.querySelector('.restart-btn');

    // ----- Game Data -----
    const computerOptions = ['rock', 'paper', 'scissors'];
    
    // Map for displaying emojis
    const emojiMap = {
        rock: '🪨',
        paper: '📄',
        scissors: '✂️'
    };
    
    // Map for winning conditions
    const winningMoves = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };

    // ----- Functions -----

    // Function to start the game and attach listeners
    const startGame = () => {
        // Attach click listener to all option buttons
        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const playerChoice = button.dataset.choice; // Get choice from data-attribute
                const computerChoice = getComputerChoice();
                playRound(playerChoice, computerChoice);
            });
        });

        // Attach click listener to restart button
        restartBtn.addEventListener('click', resetGame);
    };

    // Function to get a random computer choice
    const getComputerChoice = () => {
        const choiceNumber = Math.floor(Math.random() * 3);
        return computerOptions[choiceNumber];
    };

    // Function to play a single round
    const playRound = (player, computer) => {
        if (player === computer) {
            updateUI('tie', player, computer);
        } else if (winningMoves[player] === computer) {
            // Player wins
            playerScore++;
            updateUI('win', player, computer);
        } else {
            // Computer wins
            computerScore++;
            updateUI('lose', player, computer);
        }
    };

    // Function to update all UI elements
    const updateUI = (result, player, computer) => {
        // Update scores
        playerScoreBoard.textContent = playerScore;
        computerScoreBoard.textContent = computerScore;

        // Update choice displays with emojis
        playerChoiceDisplay.textContent = emojiMap[player];
        computerChoiceDisplay.textContent = emojiMap[computer];
        
        // Helper to capitalize first letter
        const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

        // Update result text and color
        switch (result) {
            case 'tie':
                resultDisplay.textContent = "It's a Tie!";
                resultDisplay.style.color = '#fff'; // White/default
                break;
            case 'win':
                resultDisplay.textContent = `You Win! ${capitalize(player)} beats ${computer}.`;
                resultDisplay.style.color = '#4ade80'; // Bright Green
                break;
            case 'lose':
                resultDisplay.textContent = `You Lose. ${capitalize(computer)} beats ${player}.`;
                resultDisplay.style.color = '#f87171'; // Bright Red
                break;
        }
    };

    // Function to reset the game state
    const resetGame = () => {
        playerScore = 0;
        computerScore = 0;
        
        // Reset all UI elements to default state
        playerScoreBoard.textContent = playerScore;
        computerScoreBoard.textContent = computerScore;
        resultDisplay.textContent = 'Choose your move!';
        resultDisplay.style.color = '#fff';
        playerChoiceDisplay.textContent = '❔';
        computerChoiceDisplay.textContent = '❔';
    };

    // ----- Start the Game -----
    startGame();
};

// Calling the game function to run everything
game();
