let players = [];
let playerBalances = {};
let playerPreviousBalances = {};
let houseBalance = 0;

const rouletteColors = [
    "verde", // 0
    "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro",
    "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo",
    "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro",
    "negro", "rojo", "negro", "rojo", "negro", "rojo"
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
        }
    }

    players.forEach(player => {
        const div = document.createElement('div');
        div.id = `player-${player}`;
        div.innerText = `${player}: ${playerBalances[player]}`;
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
    rouletteWheel.classList.add('spin');

    const rouletteNumberText = document.getElementById('rouletteNumberText');
    const rouletteSound = document.getElementById('rouletteSound');
    rouletteSound.play();

    const spinInterval = setInterval(() => {
        const currentNumber = Math.floor(Math.random() * 37);
        const currentColor = rouletteColors[currentNumber];
        rouletteNumberText.textContent = currentNumber;
        rouletteNumberText.style.color = currentColor === "verde" ? "green" : currentColor === "rojo" ? "red" : "black";
    }, 100);

    setTimeout(() => {
        clearInterval(spinInterval);
        rouletteWheel.classList.remove('spin');
        rouletteSound.pause();
        rouletteSound.currentTime = 0;
        rouletteNumberText.textContent = numberResult;
        rouletteNumberText.style.color = colorResult === "verde" ? "green" : colorResult === "rojo" ? "red" : "black";
        document.getElementById('numberResult').value = numberResult;
        document.getElementById('colorResult').value = colorResult;
    }, 5000);
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
            totalWinnings += quadrantAmount * 2; // Se gana 2 a 1 en Cuadrante
        } else {
            totalLosses += quadrantAmount;
        }

        if (parityBet === parityResult) {
            totalWinnings += parityAmount; // Se gana 1 a 1 en Paridad
        } else {
            totalLosses += parityAmount;
        }

        if (colorBet === colorResult) {
            totalWinnings += colorAmount; // Se gana 1 a 1 en Color
        } else {
            totalLosses += colorAmount;
        }

        if (numberBet === numberResult) {
            totalWinnings += numberAmount * 35; // Se gana 35 a 1 en Número
        } else {
            totalLosses += numberAmount;
        }

        if (rangeBet === rangeResult) {
            totalWinnings += rangeAmount; // Se gana 1 a 1 en Baja/Alta
        } else {
            totalLosses += rangeAmount;
        }

        playerBalances[player] += totalWinnings;
        playerBalances[player] -= totalLosses;

        houseBalance -= totalWinnings;
        houseBalance += totalLosses;

        document.getElementById(`player-${player}`).innerText = `${player}: ${playerBalances[player]}`;
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
    winningNumberDiv.style.color = colorResult === "verde" ? "green" : colorResult === "rojo" ? "red" : "black";

    players.forEach(player => {
        const balanceDiv = document.createElement('div');
        const previousBalance = playerPreviousBalances[player];
        const currentBalance = playerBalances[player];
        const quadrantBet = document.getElementById(`quadrantBet-${player}`).value;
        const parityBet = document.getElementById(`parityBet-${player}`).value;
        const colorBet = document.getElementById(`colorBet-${player}`).value;
        const numberBet = document.getElementById(`numberBet-${player}`).value;
        const rangeBet = document.getElementById(`rangeBet-${player}`).value;

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
        
        if (quadrantAmount > 0) betDetails += `<li>Cuadrante: ${quadrantBet} - ${quadrantAmount}</li>`;
        if (parityAmount > 0) betDetails += `<li>Paridad: ${parityBet} - ${parityAmount}</li>`;
        if (colorAmount > 0) betDetails += `<li>Color: ${colorBet} - ${colorAmount}</li>`;
        if (numberAmount > 0) betDetails += `<li>Número: ${numberBet} - ${numberAmount}</li>`;
        if (rangeAmount > 0) betDetails += `<li>Baja/Alta: ${rangeBet} - ${rangeAmount}</li>`;

        betDetails += `</ul>
            <p>Total Apostado: ${totalBets}</p>
            <p>${netResult >= 0 ? 'Ganancia' : 'Pérdida'}: ${netResult}</p>
            <p>Nuevo Saldo: ${currentBalance}</p>`;

        balanceDiv.innerHTML = betDetails;
        playersDiv.appendChild(balanceDiv);
    });
    goToBalances(); // Mover aquí para asegurar la navegación
}
