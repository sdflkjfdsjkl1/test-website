const rockPaperScissors = {
    movesBtn: Array.from(document.getElementsByClassName('moves-btn')),
    winnerDOM: document.getElementById('winner'),
    resultDOM: document.getElementById('result'),
    scoreDOM: document.getElementById('score'),
    score: {wins: 0, losses: 0, ties: 0},
    resetBtn: document.getElementById('reset-btn'),
    autoPlayBtn: document.getElementById('auto-play-btn'),
    intervalID: 0,
    isAutoPlay: false,
    yesBtn: document.getElementById('yes-btn'),
    noBtn: document.getElementById('no-btn'),
    promptDiv:document.getElementById('confirmation'),
    isActive: false,
    initBtns() {
        this.movesBtn.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (index === 0) {
                    this.playGame('rock');
                } else if (index === 1) {
                    this.playGame('paper');
                } else if (index === 2) {
                    this.playGame('scissors');
                }
            })
        });

        this.autoPlay = this.autoPlay.bind(this);
        this.resetScore = this.resetScore.bind(this);

        this.resetBtn.addEventListener('click', () => {
            this.displayPrompt();
        });

        this.yesBtn.addEventListener('click', () => {
            this.resetScore();
            this.isActive = true;
            this.displayPrompt();
        });

        this.noBtn.addEventListener('click', () => {
            this.isActive = true;
            this.displayPrompt();
        });
        this.autoPlayBtn.addEventListener('click', this.autoPlay);

        window.addEventListener('keydown', (event) => {
            if (event.key === 'a') {
                this.autoPlay();
            } else if (event.key === 'Backspace') {
                this.displayPrompt();
            } else if (event.key === 'r') {
                this.playGame('rock');
            } else if (event.key === 'p') {
                this.playGame('paper');
            } else if (event.key === 's') {
                this.playGame('scissors');
            }
        });
    },
    displayPrompt() {
        let confirmationFunc = (event) => {
            if (event.key === 'y') {
                this.resetScore();
                this.isActive = true;
                this.displayPrompt();
                window.removeEventListener('keydown', confirmationFunc);
            } else if (event.key === 'n') {
                this.isActive = true;
                this.displayPrompt();
                window.removeEventListener('keydown', confirmationFunc);
            }
        }

        if (!this.isActive) {
            window.addEventListener('keydown', confirmationFunc);

            confirmation.classList.add('active');
            this.isActive = true;
        } else {
            confirmation.classList.remove('active');
            this.isActive = false;
        }
    },
    autoPlay() {
        if (!this.isAutoPlay) {
            this.intervalID = setInterval(() => {
                let playerMove = this.generateComputerMove();

                this.playGame(playerMove);
            }, 1500);

            this.autoPlayBtn.textContent = 'Stop';
            this.isAutoPlay = true;
        } else {
            clearInterval(this.intervalID);
            this.autoPlayBtn.textContent = 'Auto play';
            this.isAutoPlay = false;
        }
    },
    initScores() {
        try {
            this.score = JSON.parse(localStorage.getItem('score')) || {wins: 0, losses: 0, ties: 0};
        } catch (e) {
            this.score = null;
        }

        if (this.score === null || typeof this.score.wins !== 'number' || typeof this.score.losses !== 'number' || typeof this.score.ties !== 'number') {
            this.score = {wins: 0, losses: 0, ties: 0};
        }

        this.displayResult();
    },
    playGame(playerMove) {
        let computerMove = this.generateComputerMove();
        let playerMoveImg = '';
        let computerMoveImg = '';

        if (computerMove === playerMove) {
            this.winnerDOM.classList.remove('winner');
            this.winnerDOM.classList.remove('lose');
            this.winnerDOM.classList.add('tie');
            this.winnerDOM.textContent='It\'s a tie!';
            this.score.ties++;
        } else if (computerMove === 'rock' && playerMove === 'scissors' || computerMove === 'paper' && playerMove ==='rock' || computerMove === 'scissors' && playerMove ==='paper') {
            this.winnerDOM.classList.remove('winner');
            this.winnerDOM.classList.remove('tie');
            this.winnerDOM.classList.add('lose');
            this.winnerDOM.textContent = 'Computer wins!';
            this.score.losses++;
        } else {
            this.winnerDOM.classList.remove('lose');
            this.winnerDOM.classList.remove('tie');
            this.winnerDOM.classList.add('winner');
            this.winnerDOM.textContent = 'Player wins!';
            this.score.wins++;
        }

        this.updateScore();

        if (playerMove === 'rock' ) {
            playerMoveImg = 'fist.png';
        } else if (playerMove === 'paper') {
            playerMoveImg = 'hand-paper.png';
        } else {
            playerMoveImg = 'scissors.png';
        }

        if (computerMove === 'rock' ) {
            computerMoveImg = 'fist.png';
        } else if (computerMove === 'paper') {
            computerMoveImg = 'hand-paper.png';
        } else {
            computerMoveImg = 'scissors.png';
        }

        this.resultDOM.innerHTML = `You <img class="player-picked-moves"  src="../Images/${playerMoveImg}"> <img class="computer-picked-moves" src="../Images/${computerMoveImg}"> Computer`;
        this.scoreDOM.textContent = `Wins: ${this.score.wins} Losses: ${this.score.losses} Ties: ${this.score.ties}`;     
    },
    generateComputerMove() {
        let randomNum = Math.random();

        if (randomNum >= 0 && randomNum <= 1/3) {
            return 'rock';
        } else if (randomNum >= 1/3 && randomNum <= 2/3) {
            return 'paper';
        } else {
            return 'scissors';
        }
    },
    updateScore() {
        localStorage.setItem('score', JSON.stringify(this.score));
    },
    displayResult() {
        this.scoreDOM.textContent = `Wins: ${this.score.wins} Losses: ${this.score.losses} Ties: ${this.score.ties}`;
    },
    resetScore() {
        localStorage.removeItem('score');
        this.resultDOM.innerHTML = "";
        this.winnerDOM.textContent = "";
        this.initScores();
    }
};

rockPaperScissors.initBtns();
rockPaperScissors.initScores();