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
            <label for="betType-${player}">Tipo de apuesta:</label>
            <select id="betType-${player}">
                <option value="cuadrante">Cuadrante</option>
                <option value="color">Color</option>
                <option value="paridad">Par o Impar</option>
                <option value="numero">Número</option>
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
    const winningBet = document.getElementById('winningBet').value;
    players.forEach(player => {
        const betType = document.getElementById(`betType-${player}`).value;
        const betAmount = parseFloat(document.getElementById(`betAmount-${player}`).value);
        
        if (betType === winningBet) {
            switch (betType) {
                case 'cuadrante':
                    playerBalances[player] += betAmount * 3;
                    break;
                case 'color':
                    playerBalances[player] += betAmount * 2;
                    break;
                case 'paridad':
                    playerBalances[player] += betAmount * 2;
                    break;
                case 'numero':
                    playerBalances[player] += betAmount * 36;
                    break;
            }
        } else {
            playerBalances[player] -= betAmount;
        }
        
        document.getElementById(`player-${player}`).innerText = `${player}: ${playerBalances[player]}`;
    });
}
