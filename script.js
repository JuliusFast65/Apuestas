let players = [];
let playerBalances = {};
let houseBalance = 0;

function setupGame() {
    const numPlayers = document.getElementById('numPlayers').value;
    const playerInputs = document.getElementById('playerInputs');
    playerInputs.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Jugador ${i + 1}`;
        input.id = `player${i}`;
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
            <label for="quadrantBet-${player}">Cuadrante:</label>
            <select id="quadrantBet-${player}">
                <option value="cuadrante1">1-12</option>
                <option value="cuadrante2">13-24</option>
                <option value="cuadrante3">25-36</option>
            </select>
            <input type="number" id="quadrantAmount-${player}" min="1" placeholder="Monto">
            <br>
            <label for="parityBet-${player}">Paridad:</label>
            <select id="parityBet-${player}">
                <option value="par">Par</option>
                <option value="impar">Impar</option>
            </select>
            <input type="number" id="parityAmount-${player}" min="1" placeholder="Monto">
            <br>
            <label for="colorBet-${player}">Color:</label>
            <select id="colorBet-${player}">
                <option value="rojo">Rojo</option>
                <option value="negro">Negro</option>
            </select>
            <input type="number" id="colorAmount-${player}" min="1" placeholder="Monto">
            <br>
            <label for="numberBet-${player}">Número (0-36):</label>
            <input type="number" id="numberBet-${player}" min="0" max="36" placeholder="Número">
            <input type="number" id="numberAmount-${player}" min="1" placeholder="Monto">
            <br>
            <label for="rangeBet-${player}">Baja/Alta:</label>
            <select id="rangeBet-${player}">
                <option value="baja">1-18</option>
                <option value="alta">19-36</option>
            </select>
            <input type="number" id="rangeAmount-${player}" min="1" placeholder="Monto">
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

    const parityResult = numberResult % 2 === 0 ? 'par' : 'impar';
    const rangeResult = numberResult >= 1 && numberResult <= 18 ? 'baja' : 'alta';

    players.forEach(player => {
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
    goToBalances();
}
