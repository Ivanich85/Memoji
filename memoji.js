var rowsQuantity = 3;
var columnsQuantity = 4;

// Геометрические параметры карточки
var cardWidth = 120;
var cardHeight = 120;
var cardMargin = 12.5;
var cardBorder = 5;
var borderRadius = 9;
var borderColor = '#FFFFFF';

var prev = performance.now();
var times = 0;

function myMove(elem) {
    elem.style.transform = 'rotateY(180deg)';
  }

window.onload = function () {
    var gameField = createGameField(columnsQuantity);
    fillGameField(gameField, rowsQuantity, columnsQuantity);
    setListener(Array.from(gameField.querySelectorAll('.card')));
}

// На вход принимает только столбцы, т.к необходима только ширина поля
function createGameField(columns) {
    var fieldWidth = columns * (cardWidth + cardMargin * 2 + cardBorder * 2);
    var field = document.querySelector('.game_field');
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
    var card = document.createElement('div');
    card.className = 'card';
    card.id = 'card_' + row + '_' + col;
    setCardSize(card);
    return card;
}

function setCardSize(card) {
    card.style.width = cardWidth + 'px';
    card.style.height = cardHeight + 'px';
    card.style.margin = cardMargin + 'px';
    card.style.border = 'solid ' + cardBorder + 'px ' + borderColor;
    card.style.borderRadius = borderRadius + 'px';
}

function setListener(cardsArr) {
    cardsArr.forEach(function (item) {
        item.addEventListener('click', function () {
            rollCard(item);
        })
    });
}

function rollCard(card) {
    card.classList.toggle('card');
    card.classList.toggle('card-reverse');
    myMove(card);
    if (card.classList.contains('card-reverse')) {
        card.textContent = '🐰';
    } else {
        card.textContent = '';
    }
}



