// Game field parameters
var ROWS_QUANTITY = 3;
var COLUMNS_QUANTITY = 4;
var CARD_QUANTITY = ROWS_QUANTITY * COLUMNS_QUANTITY;

// Card`s geometry and color parameters
var CARD_WIDTH = 120;
var CARD_HEIGHT = 120;
var CARD_MARGIN = 12.5;
var CARD_BORDER = 5;
var BORDER_RADIUS = 9;
var BORDER_COLOR = '#FFFFFF';

// All emojies array
var EMOJI_ARRAY = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐟', '🐊', '🐸', '🐙', '🐵',
    '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐓', '🦃', '🦄', '🐞', '🦀'
];

// The array will be filled by generateEmojiArray() method
var RESULT_EMOJI_ARRAY = [];

window.onload = function () {
    generateEmojiArray(EMOJI_ARRAY);
    console.log(RESULT_EMOJI_ARRAY);
    let gameField = createGameField(COLUMNS_QUANTITY);
    fillGameField(gameField, ROWS_QUANTITY, COLUMNS_QUANTITY);
    setCardListener(Array.from(gameField.querySelectorAll('.card')));
}

// The method takes 'CARD_QUANTITY / 2' random emojies from 'MAIN_EMOJI_ARRAY'
// After that this method multiplies the result by two, because we need two similar emoji into array
// Then the method generate result array
function generateEmojiArray(emojiArr) {
    let emojiArrIndex = Math.floor(Math.random() * emojiArr.length);
    let emoji = emojiArr[emojiArrIndex];
    if (RESULT_EMOJI_ARRAY.indexOf(emoji) < 0) {
        RESULT_EMOJI_ARRAY.push(emoji);
    }
    if (RESULT_EMOJI_ARRAY.length < CARD_QUANTITY / 2) {
        generateEmojiArray(emojiArr);
    } else {
        RESULT_EMOJI_ARRAY = RESULT_EMOJI_ARRAY.concat(RESULT_EMOJI_ARRAY);
        return RESULT_EMOJI_ARRAY;
    } 
}

function createGameField(columns) {    
    let fieldWidth = columns * (CARD_WIDTH + CARD_MARGIN * 2 + CARD_BORDER * 2);
    let field = document.querySelector('.game_field');
    field.style.width = fieldWidth + 'px';
    return field;
}

function fillGameField(gameField, row, col) {
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            gameField.appendChild(createCard(i, j));
        }
    }
}

function createCard(row, col) {
    let card = document.createElement('div');
    card.className = 'card';
    card.id = 'card_' + row + '_' + col;
    setCardSize(card);
    setEmoji(card, RESULT_EMOJI_ARRAY);
    return card;
}

function setCardSize(card) {
    card.style.width = CARD_WIDTH + 'px';
    card.style.height = CARD_HEIGHT + 'px';
    card.style.margin = CARD_MARGIN + 'px';
    card.style.border = 'solid ' + CARD_BORDER + 'px ' + BORDER_COLOR;
    card.style.borderRadius = BORDER_RADIUS + 'px';
}

function setCardListener(cardsArr) {
    cardsArr.forEach(function (item) {
        item.addEventListener('click', function () {
            animateCard(item);
        })
    });
}

function setEmoji(card, arr) {
    let arrIndex = Math.floor(Math.random() * arr.length);
    if (arr[arrIndex]) {
        card.emoji = arr[arrIndex];
        delete arr[arrIndex];
    } else if (arr) {
        setEmoji(card, arr);
    } else {
        return;
    }
}

function animateCard(card) {
    //rotateCard(elem) 90 град. до смены фона и 90 град после смены
    card.classList.toggle('card');
    card.classList.toggle('card-reverse');
    if (card.classList.contains('card-reverse')) {
        card.textContent = card.emoji;
    } else {
        card.textContent = '';
    }
    //rotateCard(elem)
}

// Для анимации. Должна прицепляться в animateCard
function rotateCard(elem) {
    elem.style.transform = 'rotateY(180deg)';
}
