//  Game field parameters
var NUMBER_OF_LINES = 3;
var NUMBER_OF_COLUMNS = 4;
var NUMBER_OF_CARDS = NUMBER_OF_LINES * NUMBER_OF_COLUMNS;

//  The card geometry parameters and border color
var CARD_WIDTH = 120;
var CARD_HEIGHT = 120;
var CARD_MARGIN = 12.5;
var CARD_BORDER = 5;
var BORDER_RADIUS = 9;
var BORDER_COLOR = '#FFFFFF';

//  Animation preferences
var ANIMATION_DURATION = 300;
var ANIMATION_START_POSITION = '0';
var ANIMATION_MIDDLE_POSITION = '180deg';
var ANIMATION_FINISH_POSITION = '360deg';

//  All emojies array
var EMOJI_ARRAY = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐟', '🐊', '🐸', '🐙', '🐵',
    '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐓', '🦃', '🦄', '🐞', '🦀'
];

//  The array will be filled by 'generateEmojiArray()' method
var RESULT_EMOJI_ARRAY = [];

// The array used for open cards comparison
var OPEN_CARDS_ARRAY = [];

// Timer and countdown time
var TIMER_ID = null;
var START_TIMER = 60; //sec
var TIMER_START = false;

// Listeners
var GAME_FIELD = null;
var BUTTON = null;

window.onload = function () {
    prepareGame();
}

/**
 * Prepare new game module
 * ===============================================
 */
function prepareGame() {
    clearGameField();
    clearOpenCardsArray(RESULT_EMOJI_ARRAY);
    clearOpenCardsArray(OPEN_CARDS_ARRAY);
    generateEmojiArray(EMOJI_ARRAY);
    buildGameField(setGameFieldWidth(NUMBER_OF_COLUMNS), NUMBER_OF_LINES, NUMBER_OF_COLUMNS);
    resetTimer();
    setTimer(START_TIMER);
}

/*  
    This method takes 'CARD_QUANTITY / 2' random emojies from 'MAIN_EMOJI_ARRAY' 
    and puts them to the result array 'RESULT_EMOJI_ARRAY'
    After that the method multiplies the result by two, because we need two similar emoji into the array
*/
function generateEmojiArray(emojiArr) {
    let emojiArrIndex = Math.floor(Math.random() * emojiArr.length);
    let emoji = emojiArr[emojiArrIndex];
    if (RESULT_EMOJI_ARRAY.indexOf(emoji) < 0) {
        RESULT_EMOJI_ARRAY.push(emoji);
    }
    if (RESULT_EMOJI_ARRAY.length < NUMBER_OF_CARDS / 2) {
        generateEmojiArray(emojiArr);
    } else {
        RESULT_EMOJI_ARRAY = RESULT_EMOJI_ARRAY.concat(RESULT_EMOJI_ARRAY).sort();
    }
}

function setGameFieldWidth(columns) {
    let fieldWidth = columns * (CARD_WIDTH + CARD_MARGIN * 2 + CARD_BORDER * 2);
    let field = document.querySelector('.game_field');
    field.style.width = fieldWidth + 'px';
    return field;
}

function buildGameField(gameField, row, col) {
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            gameField.appendChild(createCard(i, j));
        }
    }
    setFieldListener(gameField);
    setButtonListener();
}

function createCard(row, col) {
    let card = document.createElement('div');
    card.className = 'card_closed';
    card.id = 'card_' + row + '_' + col;
    setCardEmoji(card, RESULT_EMOJI_ARRAY);
    card.rear = '';
    setCardSize(card);
    return card;
}

function setCardSize(card) {
    card.style.width = CARD_WIDTH + 'px';
    card.style.height = CARD_HEIGHT + 'px';
    card.style.margin = CARD_MARGIN + 'px';
    card.style.border = 'solid ' + CARD_BORDER + 'px ' + BORDER_COLOR;
    card.style.borderRadius = BORDER_RADIUS + 'px';
}

function setCardEmoji(card, arr) {
    let arrIndex = Math.floor(Math.random() * arr.length);
    if (arr[arrIndex]) {
        card.emoji = arr[arrIndex];
        delete arr[arrIndex];
    } else if (arr) {
        setCardEmoji(card, arr);
    } else {
        return;
    }
}

/**
 * Listeners module
 * ===============================================
 */
function setFieldListener() {
    GAME_FIELD = document.querySelector('.game_field');
    GAME_FIELD.addEventListener('click', fieldListener);
}

function fieldListener(event) {
    var target = event.target;
    if (target.classList.contains('card_closed') || target.classList.contains('card_opened')) {
        turnCard(target);
        compareOpenCards(target);
    }
    if (!TIMER_START) {
        TIMER_START = true;
        setTimer(START_TIMER);
    }
}

function setButtonListener() {
    BUTTON = document.querySelector('.play_again_button');
    BUTTON.addEventListener('click', buttonListener);
}

function buttonListener() {
    var fade = document.querySelector('.fade');
    fade.style.display = 'none';
    prepareNewGame();
}

/**
 * Animation module
 * ===============================================
 */
function turnCard(card) {
    animateCard(card);
    setTimeout(function () {
        card.classList.toggle('card_closed');
        card.classList.toggle('card_opened');
        if (card.classList.contains('card_opened')) {
            card.textContent = card.emoji;
        } else {
            card.textContent = card.rear;
        }
    }, ANIMATION_DURATION / 2);
}

function animateCard(card) {
    if (card.classList.contains('card_opened')) {
        animateCardSide(card, ANIMATION_START_POSITION, ANIMATION_MIDDLE_POSITION, ANIMATION_START_POSITION);
    } else {
        animateCardSide(card, ANIMATION_MIDDLE_POSITION, ANIMATION_FINISH_POSITION, ANIMATION_FINISH_POSITION);
    }
}

function animateCardSide(card, startPos, finishPos, finishTransformPos) {
    var animation = card.animate([
        {
            transform: 'rotateY(' + startPos + ')'
        },
        {
            transform: 'rotateY(' + finishPos + ')'
        }
    ], ANIMATION_DURATION);
    animation.addEventListener('finish', function () {
        card.style.transform = 'rotateY(' + finishTransformPos + ')';
    });
}

/**
 * Game logic module
 * ===============================================
 */
function compareOpenCards(openCard) {
    if (openCard.classList.contains('card_closed')) {
        OPEN_CARDS_ARRAY.push(openCard);
    } else {
        OPEN_CARDS_ARRAY.pop(openCard);
    }
    // If two cards opened, mark them as similar or different
    if (OPEN_CARDS_ARRAY.length == 2) {
        setOpenCardsColors(OPEN_CARDS_ARRAY, openCard);
    }
    // If third card opened, close first two different cards
    if (OPEN_CARDS_ARRAY.length == 3) {
        closeDifferentOpenedCards(OPEN_CARDS_ARRAY, openCard);
        clearOpenCardsArray(OPEN_CARDS_ARRAY);
        OPEN_CARDS_ARRAY.push(openCard);
    }
}

function setOpenCardsColors(openCardsArr, openCard) {
    openCardsArr.forEach(function (item) {
        if (cardOpenedButNotGuessed(item) && differentCardsId(item, openCard)) {
            if (item.emoji == openCard.emoji) {
                item.classList.toggle('cards_are_same');
                openCard.classList.toggle('cards_are_same');
                clearOpenCardsArray(OPEN_CARDS_ARRAY);
                isWin();
            } else {
                item.classList.toggle('cards_are_different');
                openCard.classList.toggle('cards_are_different');
            }
        }
    });
}

function closeDifferentOpenedCards(openCardsArr, openCard) {
    openCardsArr.forEach(function (item) {
        if (item.classList.contains('cards_are_different') && differentCardsId(item, openCard)) {
            item.classList.toggle('cards_are_different');
            turnCard(item);
        }
    });
}

function clearOpenCardsArray(array) {
    array.length = 0;
}

function differentCardsId(cardOne, cardTwo) {
    return cardOne.id != cardTwo.id;
}

function cardOpenedButNotGuessed(card) {
    return card.classList.contains('card_opened') && !card.classList.contains('cards_are_same');
}

/**
 * Timer module
 * ===============================================
 */
function setTimer(remainTime) {
    var prefix;
    var timerText = document.querySelector('.timer');
    var time = remainTime;
    prefix = getTimerPrefix(remainTime);
    setTextContent(timerText, '01:', '00');
    if (TIMER_START) {
        TIMER_ID = setInterval(function () {
            prefix = getTimerPrefix(time);
            time = checkTimer(time);
            setTextContent(timerText, prefix, time);
        }, 1000);
    }
}

function getTimerPrefix(remainTime) {
    return remainTime > 10 ? '00:' : '00:0';
}

function setTextContent(timerText, prefix, remainTime) {
    timerText.textContent = prefix + (remainTime);
}

function checkTimer(remainTime) {
    if (remainTime > 0) {
        remainTime = remainTime - 1;
    } else {
        clearInterval(TIMER_ID);
        lose();
    }
    return remainTime;
}


/**
 * End game module
 * ===============================================
 */
function isWin() {
    if (document.querySelectorAll('.cards_are_same').length == RESULT_EMOJI_ARRAY.length) {
        clearInterval(TIMER_ID);
        setTimeout(function () {
            showEndGameWindow('Win', 'Play again');
        }, ANIMATION_DURATION);
    }
}

function lose() {
    showEndGameWindow('Lose', 'Try again');
}

function showEndGameWindow(resumeText, buttonText) {
    var fade = document.querySelector('.fade');
    var text = fade.querySelector('.text_result');
    var button = fade.querySelector('.play_again_button');
    text.textContent = resumeText;
    button.textContent = buttonText;
    fade.style.display = 'flex';
}

/**
 * Restart game module
 * ===============================================
 */
function prepareNewGame() {
    closeAllOpenCards();
    // Clean and shuffle after close
    setTimeout(function () {
        prepareGame();
    }, ANIMATION_DURATION);
}

function closeAllOpenCards() {
    var openCards = Array.from(document.querySelectorAll('.card_opened'));
    openCards.forEach(function (item) {
        turnCard(item);
    });
}

function clearGameField() {
    document.querySelector('.game_field').innerHTML = '';
}

function resetTimer() {
    TIMER_START = false;
}