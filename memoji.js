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

// Card classes
var CARD_OPENED = 'card_opened';
var CARD_CLOSED = 'card_closed';
var CARDS_ARE_DIFFERENT = 'cards_are_different';
var CARDS_ARE_SAME = 'cards_are_same';

// Listeners
var GAME_FIELD = null;
var BUTTON = null;

//  Animation preferences
var ANIMATION_DURATION = 260;
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

// Game result texts
var BUTTON_TEXT_WIN = 'Play again';
var BUTTON_TEXT_LOSE = 'Try again';
var TEXT_WIN = 'Win';
var TEXT_LOSE = 'Lose';

// Start first game
window.onload = function () {
    prepareGame();
}

// Prepare new game module
function prepareGame() {
    clearGameField();
    clearTextResult();
    clearOpenCardsArray(RESULT_EMOJI_ARRAY);
    clearOpenCardsArray(OPEN_CARDS_ARRAY);
    generateEmojiArray(EMOJI_ARRAY);
    buildGameField(setGameFieldWidth(NUMBER_OF_COLUMNS), NUMBER_OF_LINES, NUMBER_OF_COLUMNS);
    resetTimer();
    setTimer(START_TIMER);
}

/**
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
    card.className = CARD_CLOSED;
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

// Listeners 
function setFieldListener() {
    GAME_FIELD = document.querySelector('.game_field');
    GAME_FIELD.addEventListener('click', fieldListener);
}

function fieldListener(event) {
    var target = event.target;
    if (target.classList.contains(CARD_CLOSED) || target.classList.contains(CARD_OPENED)) {
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

// Animation module
function turnCard(card) {
    animateCard(card);
    setTimeout(function () {
        card.classList.toggle(CARD_CLOSED);
        card.classList.toggle(CARD_OPENED);
        if (card.classList.contains(CARD_OPENED)) {
            card.textContent = card.emoji;
        } else {
            card.textContent = card.rear;
        }
    }, ANIMATION_DURATION / 2);
}

function animateCard(card) {
    if (card.classList.contains(CARD_OPENED)) {
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

// Game logic module
function compareOpenCards(openCard) {
    if (openCard.classList.contains(CARD_CLOSED)) {
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
                item.classList.toggle(CARDS_ARE_SAME);
                openCard.classList.toggle(CARDS_ARE_SAME);
                clearOpenCardsArray(OPEN_CARDS_ARRAY);
                isWin();
            } else {
                item.classList.toggle(CARDS_ARE_DIFFERENT);
                openCard.classList.toggle(CARDS_ARE_DIFFERENT);
            }
        }
    });
}

function closeDifferentOpenedCards(openCardsArr, openCard) {
    openCardsArr.forEach(function (item) {
        if (item.classList.contains(CARDS_ARE_DIFFERENT) && differentCardsId(item, openCard)) {
            item.classList.toggle(CARDS_ARE_DIFFERENT);
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
    return card.classList.contains(CARD_OPENED) && !card.classList.contains(CARDS_ARE_SAME);
}

// Timer module
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

// Game result module
function isWin() {
    if (document.querySelectorAll('.' + CARDS_ARE_SAME).length == RESULT_EMOJI_ARRAY.length) {
        clearInterval(TIMER_ID);
        setTimeout(function () {
            showEndGameWindow(TEXT_WIN, BUTTON_TEXT_WIN);
        }, ANIMATION_DURATION);
    }
}

function lose() {
    showEndGameWindow(TEXT_LOSE, BUTTON_TEXT_LOSE);
}

function showEndGameWindow(resumeText, buttonText) {
    var fade = document.querySelector('.fade');
    var button = fade.querySelector('.play_again_button');
    button.textContent = buttonText;
    fade.style.display = 'flex';
    animateGameResultMessage(resumeText);
}

function animateGameResultMessage(message) {
    message.split('').forEach(function (item, i) {
        var textResult = document.querySelector('.text_result');
        var testResultChild = textResult.appendChild(document.createElement('div'));
        setTextResultChildStyle(testResultChild, item, i);
    });
}

function setTextResultChildStyle(textResultChild, letter, letterNumber) {
    textResultChild.textContent = letter;
    textResultChild.style.animation = "animate_game_result_message";
    textResultChild.style.animationDuration = "0.5s";
    textResultChild.style.animationDirection = "alternate";
    textResultChild.style.animationIterationCount = "infinite";
    textResultChild.style.animationDelay = letterNumber / 10 + 's';
    textResultChild.style.display = "inline-block";
    return textResultChild;
}

// Restart game module
function prepareNewGame() {
    closeAllOpenCards();
    // Clean and shuffle after close
    setTimeout(function () {
        prepareGame();
    }, ANIMATION_DURATION);
}

function closeAllOpenCards() {
    var openCards = Array.from(document.querySelectorAll('.' + CARD_OPENED));
    openCards.forEach(function (item) {
        turnCard(item);
    });
}

function clearGameField() {
    document.querySelector('.game_field').innerHTML = '';
}

function clearTextResult() {
    document.querySelector('.text_result').innerHTML = '';
}

function resetTimer() {
    TIMER_START = false;
}