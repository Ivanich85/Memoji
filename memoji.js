//  Initialized game parameters. They depend on difficult level
var NUMBER_OF_LINES;
var NUMBER_OF_COLUMNS;
var NUMBER_OF_CARDS;
var START_TIMER; // seconds

var EASY_MODE = 'easy_mode';
var NORMAL_MODE = 'normal_mode';
var HARD_MODE = 'hard_mode';

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
var GAME_FIELD;
var PLAY_AGAIN_BUTTON;
var START_GAME_BUTTON;

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
var TIMER_START = false;

// Game result texts
var BUTTON_TEXT_WIN = 'Играть снова';
var BUTTON_TEXT_LOSE = 'Попробовать еще раз';
var TEXT_WIN = 'Победа!';
var TEXT_LOSE = 'Поражение...';

window.onload = function () {
    prepareMainMenu();
}

// Main menu module
function prepareMainMenu() {
    setDifficultLevel();
    difficultLevelRadioListener();
    startGameButtonListener();
}

function difficultLevelRadioListener() {
    var gameModeRadioButtons = document.getElementsByName('mode');
    Array.from(gameModeRadioButtons).forEach(function (item) {
        item.addEventListener('click', setDifficultLevel);
    });
}

function setDifficultLevel() {
    var gameModeRadioButtons = document.getElementsByName('mode');
    var chooseLevelText = document.querySelector('.choose_level_text');
    Array.from(gameModeRadioButtons).forEach(function (item) {
        if (item.checked) {
            if (item.classList.contains(EASY_MODE)) {
                chooseLevelText.textContent = 'Низкий уровень сложности';
            } else if (item.classList.contains(NORMAL_MODE)) {
                chooseLevelText.textContent = 'Средний уровень сложности';
            } else if (item.classList.contains(HARD_MODE)) {
                chooseLevelText.textContent = 'Высокий уровень сложности';
            }
        }
    });
}

function startGameButtonListener() {
    START_GAME_BUTTON = document.querySelector('.game_start_button');
    START_GAME_BUTTON.addEventListener('click', startButtonListener);
}

function startButtonListener() {
    var mainMenu = document.querySelector('.main_menu');
    mainMenu.style.display = 'none';
    prepareGame();
}

// Prepare new game module
function prepareGame() {
    clearGameField();
    clearTextResult();
    clearOpenCardsArray(RESULT_EMOJI_ARRAY);
    clearOpenCardsArray(OPEN_CARDS_ARRAY);
    initGameParams();
    generateEmojiArray(EMOJI_ARRAY);
    buildGameField(setGameFieldWidth(NUMBER_OF_COLUMNS), NUMBER_OF_LINES, NUMBER_OF_COLUMNS);
    resetTimer();
    setTimer(START_TIMER);
}

function initGameParams() {
    var gameModeRadioButtons = document.getElementsByName('mode');
    Array.from(gameModeRadioButtons).forEach(function (item) {
        if (item.checked) {
            if (item.classList.contains(EASY_MODE)) {
                NUMBER_OF_LINES = 3;
                NUMBER_OF_COLUMNS = 4;
                START_TIMER = 40;
            } else if (item.classList.contains(NORMAL_MODE)) {
                NUMBER_OF_LINES = 3;
                NUMBER_OF_COLUMNS = 6;
                START_TIMER = 65;
            } else if (item.classList.contains(HARD_MODE)) {
                NUMBER_OF_LINES = 3;
                NUMBER_OF_COLUMNS = 8;
                START_TIMER = 100;
            }
            NUMBER_OF_CARDS = NUMBER_OF_LINES * NUMBER_OF_COLUMNS;
        }
    });
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
    var timerText = document.querySelector('.timer');
    var time = remainTime;
    var minutes = getMinutes(minutes, remainTime);
    var seconds = getSeconds(seconds, remainTime);
    timerText.textContent = showCountdown(minutes, seconds, time);
    if (TIMER_START) {
        TIMER_ID = setInterval(function () {
            time = checkTimer(time);
            timerText.textContent = showCountdown(minutes, seconds, time);
        }, 1000);
    }
}

function showCountdown(minutes, seconds, time) {
    return getMinutes(minutes, time) + ':' + getSeconds(seconds, time);
}

function getMinutes(minutes, time) {
    minutes = parseInt(time / 60);
    return getMinutesAndSecondsPrefix(minutes) + minutes;
}

function getSeconds(seconds, time) {
    seconds = time % 60;
    return getMinutesAndSecondsPrefix(seconds) + seconds;

}

function getMinutesAndSecondsPrefix(minutesOrSeconds) {
    return minutesOrSeconds < 10 ? '0' : '';
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
    document.querySelector('.fade').style.display = 'flex';
    document.querySelector('.play_again_button').textContent = buttonText;
    animateGameResultMessage(resumeText);
    setPlayAgainButtonListener();
    setMainMenuButtonListener();
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
    if (letter == ' ') {
        textResultChild.style.display = 'inline'; // If display is inline-block, bsp disappears 
        return textResultChild;
    }
    textResultChild.style.animation = 'animate_game_result_message';
    textResultChild.style.animationDuration = '0.5s';
    textResultChild.style.animationDirection = 'alternate';
    textResultChild.style.animationIterationCount = 'infinite';
    textResultChild.style.animationDelay = letterNumber / 10 + 's';
    textResultChild.style.display = 'inline-block';
    return textResultChild;
}

function setPlayAgainButtonListener() {
    PLAY_AGAIN_BUTTON = document.querySelector('.play_again_button');
    PLAY_AGAIN_BUTTON.addEventListener('click', playAgainButtonListener);
}

function playAgainButtonListener() {
    var fade = document.querySelector('.fade');
    fade.style.display = 'none';
    prepareNewGame();
}

function setMainMenuButtonListener() {
    document.querySelector('.main_menu_button').addEventListener('click', function () {
        window.location.reload();
    });
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