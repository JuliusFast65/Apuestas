let players = [];
let playerBalances = {};
let playerPreviousBalances = {};
let houseBalance = 0;
let playerLevels = {};

const rouletteColors = [
    "green", // 0
    "red", "black", "red", "black", "red", "black", "red", "black", "red", "black",
    "black", "red", "black", "red", "black", "red", "black", "red", "black", "red",
    "red", "black", "red", "black", "red", "black", "red", "black", "red", "black",
    "black", "red", "black", "red", "black", "red"
];

function setupGame() {
    const numPlayers = document.getElementById('numPlayers').value;
    const playerInputs = document.getElementById('playerInputs');
    playerInputs.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Jugador ${i + 1}`;
        input.id = `player${i}`;
        input.className = 'input';
        playerInputs.appendChild(input);
    }
    document.getElementById('setup').style.display = 'none';
    document.getElementById('playerSetup').style.display = 'block';
}

function startGame() {
    const numPlayers = document.getElementById('numPlayers').value;
    const initialBalance = document.getElementById('initialBalance').value;
    const playersDiv = document.getElementById('players');
    const betInputsDiv = document.getElementById('betInputs');

    playersDiv.innerHTML = '';
    betInputsDiv.innerHTML = '';
    players = [];

    for (let i = 0; i < numPlayers; i++) {
        const playerName = document.getElementById(`player${i}`).value;
        if (playerName) {
            players.push(playerName);
            playerBalances[playerName] = parseFloat(initialBalance);
            playerPreviousBalances[playerName] = parseFloat(initialBalance);
            playerLevels[playerName] = { level: 1, experience: 0 };
        }
    }

    players.forEach(player => {
        const div = document.createElement('div');
        div.id = `player-${player}`;
        div.innerHTML = `${player}: ${playerBalances[player]} <br> Nivel: ${playerLevels[player].level}`;
        playersDiv.appendChild(div);

        const betSection = document.createElement('div');
        betSection.className = 'bet-section';
        betSection.innerHTML = `
            <h3>Apuestas de ${player}</h3>
            <label for="quadrantBet-${player}">Cuadrante (paga 2 a 1):</label>
            <select id="quadrantBet-${player}" class="input-half">
                <option value="cuadrante1">1-12</option>
                <option value="cuadrante2">13-24</option>
                <option value="cuadrante3">25-36</option>
            </select>
            <input type="number" id="quadrantAmount-${player}" min="1" placeholder="Monto" class="input-half">
            <br>
            <label for="parityBet-${player}">Paridad (paga 1 a 1):</label>
            <select id="parityBet-${player}" class="input-half">
                <option value="par">Par</option>
                <option value="impar">Impar</option>
            </select>
            <input type="number" id="parityAmount-${player}" min="1" placeholder="Monto" class="input-half">
            <br>
            <label for="colorBet-${player}">Color (paga 1 a 1):</label>
            <select id="colorBet-${player}" class="input-half">
                <option value="rojo">Rojo</option>
                <option value="negro">Negro</option>
            </select>
            <input type="number" id="colorAmount-${player}" min="1" placeholder="Monto" class="input-half">
            <br>
            <label for="numberBet-${player}">Número (paga 35 a 1):</label>
            <select id="numberBet-${player}" class="input-half">
                ${Array.from({ length: 37 }, (_, i) => `<option value="${i}">${i}</option>`).join('')}
            </select>
            <input type="number" id="numberAmount-${player}" min="1" placeholder="Monto" class="input-half">
            <br>
            <label for="rangeBet-${player}">Baja/Alta (paga 1 a 1):</label>
            <select id="rangeBet-${player}" class="input-half">
                <option value="baja">1-18</option>
                <option value="alta">19-36</option>
            </select>
            <input type="number" id="rangeAmount-${player}" min="1" placeholder="Monto" class="input-half">
        `;
        betInputsDiv.appendChild(betSection);
    });

    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('bets').style.display = 'block';
}

function goToResults() {
    document.getElementById('bets').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}

function goToBalances() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('balances').style.display = 'block';
}

function goToBets() {
    document.getElementById('balances').style.display = 'none';
    document.getElementById('bets').style.display = 'block';
}

function spinRoulette() {
    const numberResult = Math.floor(Math.random() * 37);
    const colorResult = rouletteColors[numberResult];

    const rouletteWheel = document.getElementById('rouletteWheel');
    const rouletteNumberText = document.getElementById('rouletteNumberText');
    const rouletteSound = document.getElementById('rouletteSound');
    
    if (rouletteSound) {
        rouletteSound.play().catch(e => console.log("Error playing sound:", e));
    }

    const spinAnimation = rouletteWheel.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(1800deg)' }
    ], {
        duration: 5000,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
    });

    const spinInterval = setInterval(() => {
        const currentNumber = Math.floor(Math.random() * 37);
        const currentColor = rouletteColors[currentNumber];
        rouletteNumberText.textContent = currentNumber;
        rouletteNumberText.style.color = currentColor;
    }, 100);

    spinAnimation.onfinish = () => {
        clearInterval(spinInterval);
        rouletteWheel.style.transform = 'rotate(1800deg)';
        if (rouletteSound) {
            rouletteSound.pause();
            rouletteSound.currentTime = 0;
        }
        rouletteNumberText.textContent = numberResult;
        rouletteNumberText.style.color = colorResult;
        document.getElementById('numberResult').value = numberResult;
        document.getElementById('colorResult').value = colorResult;
        updateHistory(numberResult, colorResult);
    };
}

function recordRound() {
    const numberResult = parseInt(document.getElementById('numberResult').value);
    const colorResult = document.getElementById('colorResult').value;

    let quadrantResult = '';
    if (numberResult >= 1 && numberResult <= 12) {
        quadrantResult = 'cuadrante1';
    } else if (numberResult >= 13 && numberResult <= 24) {
        quadrantResult = 'cuadrante2';
    } else if (numberResult >= 25 && numberResult <= 36) {
        quadrantResult = 'cuadrante3';
    }

    const parityResult = (numberResult !== 0) ? (numberResult % 2 === 0 ? 'par' : 'impar') : null;
    const rangeResult = numberResult >= 1 && numberResult <= 18 ? 'baja' : 'alta';

    players.forEach(player => {
        playerPreviousBalances[player] = playerBalances[player];

        const quadrantBet = document.getElementById(`quadrantBet-${player}`).value;
        const parityBet = document.getElementById(`parityBet-${player}`).value;
        const colorBet = document.getElementById(`colorBet-${player}`).value;
        const numberBet = parseInt(document.getElementById(`numberBet-${player}`).value);
        const rangeBet = document.getElementById(`rangeBet-${player}`).value;

        const quadrantAmount = parseFloat(document.getElementById(`quadrantAmount-${player}`).value) || 0;
        const parityAmount = parseFloat(document.getElementById(`parityAmount-${player}`).value) || 0;
        const colorAmount = parseFloat(document.getElementById(`colorAmount-${player}`).value) || 0;
        const numberAmount = parseFloat(document.getElementById(`numberAmount-${player}`).value) || 0;
        const rangeAmount = parseFloat(document.getElementById(`rangeAmount-${player}`).value) || 0;

        let totalWinnings = 0;
        let totalLosses = 0;

        if (quadrantBet === quadrantResult) {
            totalWinnings += quadrantAmount * 2;
        } else {
            totalLosses += quadrantAmount;
        }

        if (parityBet === parityResult) {
            totalWinnings += parityAmount;
        } else {
            totalLosses += parityAmount;
        }

        if (colorBet === colorResult) {
            totalWinnings += colorAmount;
        } else {
            totalLosses += colorAmount;
        }

        if (numberBet === numberResult) {
            totalWinnings += numberAmount * 35;
        } else {
            totalLosses += numberAmount;
        }

        if (rangeBet === rangeResult) {
            totalWinnings += rangeAmount;
        } else {
            totalLosses += rangeAmount;
        }

        playerBalances[player] += totalWinnings;
        playerBalances[player] -= totalLosses;

        houseBalance -= totalWinnings;
        houseBalance += totalLosses;

        updatePlayerLevel(player);

        document.getElementById(`player-${player}`).innerHTML = `${player}: ${playerBalances[player]} <br> Nivel: ${playerLevels[player].level}`;
    });

    document.getElementById('houseBalance').innerText = `Saldo de la Casa: ${houseBalance}`;
    showBalances();
}

function showBalances() {
    const playersDiv = document.getElementById('players');
    playersDiv.innerHTML = '';
    const winningNumberDiv = document.getElementById('winningNumber');
    const numberResult = parseInt(document.getElementById('numberResult').value);
    const colorResult = document.getElementById('colorResult').value;
    winningNumberDiv.textContent = numberResult;
    winningNumberDiv.style.color = colorResult;

    players.forEach(player => {
        const balanceDiv = document.createElement('div');
        const previousBalance = playerPreviousBalances[player];
        const currentBalance = playerBalances[player];
        const quadrantAmount = parseFloat(document.getElementById(`quadrantAmount-${player}`).value) || 0;
        const parityAmount = parseFloat(document.getElementById(`parityAmount-${player}`).value) || 0;
        const colorAmount = parseFloat(document.getElementById(`colorAmount-${player}`).value) || 0;
        const numberAmount = parseFloat(document.getElementById(`numberAmount-${player}`).value) || 0;
        const rangeAmount = parseFloat(document.getElementById(`rangeAmount-${player}`).value) || 0;
        const totalBets = quadrantAmount + parityAmount + colorAmount + numberAmount + rangeAmount;
        const netResult = currentBalance - previousBalance;

        let betDetails = `
            <h3>${player}</h3>
            <p>Saldo Anterior: ${previousBalance}</p>
            <p>Apuestas:</p>
            <ul>`;
        
        if (quadrantAmount > 0) betDetails += `<li>Cuadrante: ${quadrantAmount}</li>`;
        if (parityAmount > 0) betDetails += `<li>Paridad: ${parityAmount}</li>`;
        if (colorAmount > 0) betDetails += `<li>Color: ${colorAmount}</li>`;
        if (numberAmount > 0) betDetails += `<li>Número: ${numberAmount}</li>`;
        if (rangeAmount > 0) betDetails += `<li>Baja/Alta: ${rangeAmount}</li>`;

        betDetails += `</ul>
            <p>Total Apostado: ${totalBets}</p>
            <p>${netResult >= 0 ? 'Ganancia' : 'Pérdida'}: ${netResult}</p>
            <p>Nuevo Saldo: ${currentBalance}</p>
            <p>Nivel: ${playerLevels[player].level}</p>`;

        balanceDiv.innerHTML = betDetails;
        playersDiv.appendChild(balanceDiv);
    });
    goToBalances();
}

function updateHistory(number, color) {
    const historyList = document.getElementById('resultHistory');
    const listItem = document.createElement('li');
    listItem.textContent = `${number} - ${color}`;
    listItem.style.color = color;
    historyList.prepend(listItem);
    if (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

function updatePlayerLevel(player) {
    playerLevels[player].experience += 10;
    if (playerLevels[player].experience >= playerLevels[player].level * 100) {
        playerLevels[player].level++;
        alert(`¡${player} ha subido al nivel ${playerLevels[player].level}!`);
    }
}
