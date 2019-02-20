//  Game field parameters
var ROWS_QUANTITY = 3;
var COLUMNS_QUANTITY = 4;
var CARD_QUANTITY = ROWS_QUANTITY * COLUMNS_QUANTITY;

//  The card geometry parameters and color
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

window.onload = function () {
    generateEmojiArray(EMOJI_ARRAY);
    console.log(RESULT_EMOJI_ARRAY);
    let gameField = createGameField(COLUMNS_QUANTITY);
    fillGameField(gameField, ROWS_QUANTITY, COLUMNS_QUANTITY);
    setAnimation(Array.from(gameField.querySelectorAll('.card_closed')));
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
    if (RESULT_EMOJI_ARRAY.length < CARD_QUANTITY / 2) {
        generateEmojiArray(emojiArr);
    } else {
        RESULT_EMOJI_ARRAY = RESULT_EMOJI_ARRAY.concat(RESULT_EMOJI_ARRAY);
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
    card.className = 'card_closed';
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

function setAnimation(cardsArr) {
    cardsArr.forEach(function (item) {
        item.addEventListener('click', function () {
            turnCard(item);
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

function turnCard(card) {
    animateCard(card);
    setTimeout(function () {
        card.classList.toggle('card_closed');
        card.classList.toggle('card_opened');
        if (card.classList.contains('card_opened')) {
            card.textContent = card.emoji;
        } else {
            card.textContent = '';
        }
    }, ANIMATION_DURATION / 2);
}

function animateCard(card) {
    if (card.classList.contains('card_opened')) {
        animateCardSide(card, ANIMATION_START_POSITION, ANIMATION_MIDDLE_POSITION);
    } else {
        animateCardSide(card, ANIMATION_MIDDLE_POSITION, ANIMATION_FINISH_POSITION);
    }
}

function animateCardSide(card, startPos, finishPos) {
    var animation = card.animate([
        {
            transform: 'rotateY(' + startPos + ')'
        },
        {
            transform: 'rotateY(' + finishPos + ')'
        }
    ], ANIMATION_DURATION);
    animation.addEventListener('finish', function () {
        card.style.transform = 'rotateY(' + finishPos + ')';
    });
}
