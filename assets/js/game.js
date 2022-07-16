// USE MODULE PATTERN
const blackjack = (() => {

    'use strict';
    // VARIABLES INITAILIZATION
    // ========================

    let deck = [];
    const suits = ['C', 'D', 'H', 'S'],
        specialCards = ['A', 'J', 'Q', 'K'];


    let playerPoints = [];


    const btnNewGame = document.querySelector('#btn-new-game'),
        btnGetCard = document.querySelector('#btn-get-card'),
        btnStop = document.querySelector('#btn-stop');

    // create arrays of each element to acces each element easier
    const divCardsPlayers = document.querySelectorAll('.div-user-cards'),
        playerPointsHTML = document.querySelectorAll('small');

    
    // ==========================
    // FUNCTIONS
    // ==========================

    // function to initialize the game (need the number of players (2 by default)) 
    const initializeGame = (playersNumber = 2) => {
        
        deck = createDeck();
        playerPoints = [];

        // the last player always will be the computer in the playerPoints array
        for (let i = 0; i < playersNumber; i++) {
            playerPoints.push(0);
        }

        // set the initial value of the points of the players
        playerPointsHTML.forEach(elem => elem.innerText = `(0)`);
        divCardsPlayers.forEach(elem => elem.innerHTML = '');

        // disable the buttons
        btnGetCard.disabled = false;
        btnStop.disabled = false;

    }


    // function to create the deck
    const createDeck = () => {

        deck = [];

        // loop to create the deck of cards adding the regular suits
        for (let i = 2; i <= 10; i++) {
            for (let suit of suits) {
                deck.push(i + suit);
            }
        }

        // loop to add the special cards to the deck
        for (let specialCard of specialCards) {
            for (let suit of suits) {
                deck.push(specialCard + suit);
            }
        }

        // shuffle the deck using underscore.js library
        return _.shuffle(deck);
    }

    // create a function to deal a card
    const dealCard = () => {

        if (deck.length === 0) {
            throw new Error('The deck is empty');
        }

        return deck.pop();
    }

    // function to get the card value of each card
    const cardValue = (card) => {

        const value = card.substring(0, card.length - 1);
        /*
            if the card is number return the number, 
            if is special card return 10, 
            if is an ace return 11
        */
        return (!isNaN(value))
            ? value * 1 :
            (value === 'A')
                ? 11 : 10;
    }

    // function to store the players points into the playerPoints array
    // player:0 = first player, last player = computer
    const storePlayerPoints = (card, player) => {

        // depending on the player, get the points of the player and inner the value into the array anf html
        playerPoints[player] += cardValue(card);
        playerPointsHTML[player].innerText = playerPoints[player];

        return playerPoints[player];
    }

    // funciton to create the html element for the cards
    const createCardHTML = (card, player) => {

        const imgCard = document.createElement('img');
        imgCard.src = `assets/cards/${card}.png`;
        imgCard.classList.add('cards-game');

        divCardsPlayers[player].appendChild(imgCard);
    }

    // function to select the winner based on the points of the players
    const selectWinner = () => {

        // get the lowerpoint of the players (pos[0]) and the lasted point (pos[playerpoints.length - 1])
        // in this case we know there's only two players, so no problem to use the same index
        let [lowerPoints, computerPoints] = playerPoints;

        // function to show cards before the alert message to show the game result
        setTimeout(() => {

            let messageGameResult =
                    (computerPoints === lowerPoints) ? `It's a tie! 😐`
                    : (lowerPoints > 21) ? 'Computer won 😐'
                    : (computerPoints > 21) ? 'Player won 😐'
                    : `Computer won 😐`;

            alert(messageGameResult);

        }, 300);

    }

    // function to start the computer's turn
    const computerTurn = (lowerPoints) => {

        // set initial points to the computer
        let computerPoints = 0;

        do {

            const card = dealCard();
            computerPoints = storePlayerPoints(card, playerPoints.length - 1);
            createCardHTML(card, playerPoints.length - 1);

        } while ((computerPoints < lowerPoints) && (lowerPoints <= 21)); 
        // ends before the player's points is greater than the computer points

        // when it ends, select the winner based on the points obtained
        selectWinner();
    }


    // ==========================
    // EVENTS
    // ==========================

    //  event to deal a card to the player
    btnGetCard.addEventListener('click', () => {

        const card = dealCard();
        // store the points into the array in pos[0]
        const userPoints = storePlayerPoints(card, 0);
        // create the html element for the card in pos[0]
        createCardHTML(card, 0);

        if (userPoints >= 21) {
            btnGetCard.disabled = true;
            btnStop.disabled = true;
            computerTurn(userPoints);
        }

    });

    // event listener to the stop button
    btnStop.addEventListener('click', () => {

        btnGetCard.disabled = true;
        btnStop.disabled = true;
        // send the lower points obtained by the player to the computer
        computerTurn(playerPoints[0]);

    });

    // event listener to the new game button
    btnNewGame.addEventListener('click', () => {
        initializeGame();
    })



    // ==========================
    // EXPORT THE MODULE
    // ==========================

    return {
        startGame: initializeGame
    };

})();