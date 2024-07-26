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
    const winnerSelect = document.getElementById('winner');

    playersDiv.innerHTML = '';
    winnerSelect.innerHTML = '';
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

        const option = document.createElement('option');
        option.value = player;
        option.innerText = player;
        winnerSelect.appendChild(option);
    });

    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('game').style.display = 'block';
}

function recordRound() {
    const winner = document.getElementById('winner').value;
    const betAmount = parseFloat(document.getElementById('betAmount').value);

    players.forEach(player => {
        if (player === winner) {
            playerBalances[player] += betAmount;
        } else {
            playerBalances[player] -= betAmount;
        }
        document.getElementById(`player-${player}`).innerText = `${player}: ${playerBalances[player]}`;
    });
}
