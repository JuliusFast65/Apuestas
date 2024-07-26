let players = [];
let playerBalances = {};
let playerPreviousBalances = {};
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
            <label for="quadrantBet-${player}">Cuadrante:</label>
            <select id="quadrantBet-${player}" class="input">
                <option value="cuadrante1">1-12</option>
                <option value="cuadrante2">13-24</option>
                <option value="cuadrante3">25-36</option>
            </select>
            <input type="number" id="quadrantAmount-${player}" min="1" placeholder="Monto" class="input">
            <br>
            <label for="parityBet-${player}">Paridad:</label>
            <select id="parityBet-${player}" class="input">
                <option value="par">Par</option>
                <option value="impar">Impar</option>
            </select>
            <input type="number" id="parityAmount-${player}" min="1" placeholder="Monto" class="input">
            <br>
            <label for="colorBet-${player}">Color:</label>
            <select id="colorBet-${player}" class="input">
                <option value="rojo">Rojo</option>
                <option value="negro">Negro</option>
            </select>
            <input type="number" id="colorAmount-${player}" min="1" placeholder="Monto" class="input">
            <br>
            <label for="numberBet-${player}">Número (0-36):</label>
            <input type="number" id="numberBet-${player}" min="0" max="36" placeholder="Número" class="input">
            <input type="number" id="numberAmount-${player}" min="1" placeholder="Monto" class="input">
            <br>
            <label for="rangeBet-${player}">Baja/Alta:</label>
            <select id="rangeBet-${player}" class="input">
                <option value="baja">1-18</option>
                <option value="alta">19-36</option>
            </select>
            <input type="number" id="rangeAmount-${player}" min="1" placeholder="Monto" class="input">
        `;
        betInputsDiv.appendChild(betSection);
    });

    document.getElementById('playerSetup').style.display =
