let players = [];
let playerBalances = {};

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
    const betsDiv = document.getElementById('bets');

    playersDiv.innerHTML = '';
    betsDiv.innerHTML = '';
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
            <label for="quadrantBet-${player}">Apuesta Cuadrante:</label>
            <select id="quadrantBet-${player}">
                <option value="cuadrante1">Cuadrante 1</option>
                <option value="cuadrante2">Cuadrante 2</option>
                <option value="cuadrante3">Cuadrante 3</option>
            </select>
            <label for="parityBet-${player}">Apuesta Paridad:</label>
            <select id="parityBet-${player}">
                <option value="par">Par</option>
                <option value="impar">Impar</option>
            </select>
            <label for="colorBet-${player}">Apuesta Color:</label>
            <select id="colorBet-${player}">
                <option value="rojo">Rojo</option>
                <option value="negro">Negro</option>
            </select>
            <label for="betAmount-${player}">Monto apostado:</label>
            <input type="number" id="betAmount-${player}" min="1">
        `;
        betsDiv.appendChild(betSection);
    });

    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('game').style.display = 'block';
}

function recordRound() {
    const quadrantResult = document.getElementById('quadrantResult').value;
    const parityResult = document.getElementById('parityResult').value;
    const colorResult = document.getElementById('colorResult').value;

    players.forEach(player => {
        const quadrantBet = document.getElementById(`quadrantBet-${player}`).value;
        const parityBet = document.getElementById(`parityBet-${player}`).value;
        const colorBet = document.getElementById(`colorBet-${player}`).value;
        const betAmount = parseFloat(document.getElementById(`betAmount-${player}`).value);
        
        let won = false;
        let winnings = 0;

        if (quadrantBet === quadrantResult) {
            winnings += betAmount * 3;
            won = true;
        }
        if (parityBet === parityResult) {
            winnings += betAmount * 2;
            won = true;
        }
        if (colorBet === colorResult) {
            winnings += betAmount * 2;
            won = true;
        }

        if (won) {
            playerBalances[player] += winnings;
        } else {
            playerBalances[player] -= betAmount;
        }

        document.getElementById(`player-${player}`).innerText = `${player}: ${playerBalances[player]}`;
    });
}
