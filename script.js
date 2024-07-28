// Variables globales para almacenar información de los jugadores y la banca
let players = [];
let playerBalances = {};
let playerPreviousBalances = {};
let houseBalance = 0;

let quadrantResult = '';
let parityResult = '';
let rangeResult = '';

// Colores de la ruleta
const rouletteColors = [
    "verde", // 0
    "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro",
    "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo",
    "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro", "rojo", "negro",
    "negro", "rojo", "negro", "rojo", "negro", "rojo"
];

// Función para configurar el juego
function setupGame() {
    console.log("Setup Game");
    const numPlayers = document.getElementById('numPlayers').value;
    const playerInputs = document.getElementById('playerInputs');
    playerInputs.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
        // Crear inputs para el nombre y saldo inicial de cada jugador
        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.placeholder = `Jugador ${i + 1}`;
        inputName.id = `player${i}`;
        inputName.className = 'input';

        const inputBalance = document.createElement('input');
        inputBalance.type = 'number';
        inputBalance.placeholder = 'Saldo Inicial';
        inputBalance.value = 5;
        inputBalance.id = `balance${i}`;
        inputBalance.className = 'input';

        playerInputs.appendChild(inputName);
        playerInputs.appendChild(inputBalance);
    }
    document.getElementById('setup').style.display = 'none';
    document.getElementById('playerSetup').style.display = 'block';
}

// Función para iniciar el juego
function startGame() {
    console.log("Start Game");
    const numPlayers = document.getElementById('numPlayers').value;
    const playersDiv = document.getElementById('players');
    const betInputsDiv = document.getElementById('betInputs');

    playersDiv.innerHTML = '';
    betInputsDiv.innerHTML = '';
    players = [];

    for (let i = 0; i < numPlayers; i++) {
        const playerName = document.getElementById(`player${i}`).value;
        const initialBalance = parseFloat(document.getElementById(`balance${i}`).value);
        if (playerName) {
            players.push(playerName);
            playerBalances[playerName] = initialBalance;
            playerPreviousBalances[playerName] = initialBalance;
        }
    }

    players.forEach(player => {
        // Mostrar saldo de cada jugador
        const div = document.createElement('div');
        div.id = `player-${player}`;
        div.innerText = `${player}: ${formatCurrency(playerBalances[player])}`;
        playersDiv.appendChild(div);

        // Crear secciones de apuestas para cada jugador
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

// Función para ir a la página de resultados
function goToResults() {
    console.log("Go to Results");
    document.getElementById('bets').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}

// Función para ir a la página de saldos
function goToBalances() {
    console.log("Go to Balances");
    document.getElementById('results').style.display = 'none';
    document.getElementById('balances').style.display = 'block';
}

// Función para volver a la página de apuestas
function goToBets() {
    console.log("Go to Bets");
    document.getElementById('balances').style.display = 'none';
    document.getElementById('bets').style.display = 'block';
}

// Función para girar la ruleta
function spinRoulette() {
    console.log("Spin Roulette");
    const numberResult = Math.floor(Math.random() * 37);
    const colorResult = rouletteColors[numberResult];

    const rouletteWheel = document.getElementById('rouletteWheel');
    rouletteWheel.classList.add('spin');

    const rouletteNumberText = document.getElementById('rouletteNumberText');
    const rouletteSound = document.getElementById('rouletteSound');

    const playPromise = rouletteSound.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log("Sound playing...");
        }).catch(error => {
            console.error("Error playing sound:", error);
        });
    }

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
        console.log("Spin Completed: ", numberResult, colorResult);
    }, 5000);
}

// Función para registrar los resultados de la ronda
function recordRound() {
    console.log("Record Round");
    const numberResult = parseInt(document.getElementById('numberResult').value);
    const colorResult = document.getElementById('colorResult').value;

    quadrantResult = '';
    if (numberResult >= 1 && numberResult <= 12) {
        quadrantResult = 'cuadrante1';
    } else if (numberResult >= 13 && numberResult <= 24) {
        quadrantResult = 'cuadrante2';
    } else if (numberResult >= 25 && numberResult <= 36) {
        quadrantResult = 'cuadrante3';
    }

    parityResult = (numberResult !== 0) ? (numberResult % 2 === 0 ? 'par' : 'impar') : null;
    rangeResult = numberResult >= 1 && numberResult <= 18 ? 'baja' : 'alta';

    players.forEach(player => {
        console.log("Processing player: ", player);
        playerPreviousBalances[player] = playerBalances[player];

        const quadrantBetElement = document.getElementById(`quadrantBet-${player}`);
        const parityBetElement = document.getElementById(`parityBet-${player}`);
        const colorBetElement = document.getElementById(`colorBet-${player}`);
        const numberBetElement = document.getElementById(`numberBet-${player}`);
        const rangeBetElement = document.getElementById(`rangeBet-${player}`);
        
        if (!quadrantBetElement || !parityBetElement || !colorBetElement || !numberBetElement || !rangeBetElement) {
            console.log("Bet elements not found for player: ", player);
            return;
        }
        
        const quadrantBet = quadrantBetElement.value;
        const parityBet = parityBetElement.value;
        const colorBet = colorBetElement.value;
        const numberBet = parseInt(numberBetElement.value);
        const rangeBet = rangeBetElement.value;

        const quadrantAmount = parseFloat(document.getElementById(`quadrantAmount-${player}`).value) || 0;
        const parityAmount = parseFloat(document.getElementById(`parityAmount-${player}`).value) || 0;
        const colorAmount = parseFloat(document.getElementById(`colorAmount-${player}`).value) || 0;
        const numberAmount = parseFloat(document.getElementById(`numberAmount-${player}`).value) || 0;
        const rangeAmount = parseFloat(document.getElementById(`rangeAmount-${player}`).value) || 0;

        let totalWinnings = 0;
        let totalLosses = 0;

        // Calcular ganancias y pérdidas de cada jugador
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

        // Actualizar saldos
        playerBalances[player] += totalWinnings;
        playerBalances[player] -= totalLosses;

        houseBalance -= totalWinnings;
        houseBalance += totalLosses;

        const playerElement = document.getElementById(`player-${player}`);
        if (playerElement) {
            playerElement.innerText = `${player}: ${formatCurrency(playerBalances[player])}`;
        }
        console.log(`${player}: Balance - ${playerBalances[player]}`);
    });

    document.getElementById('houseBalance').innerText = `Saldo de la Casa: ${formatCurrency(houseBalance)}`;
    showBalances();
}

// Función para mostrar los saldos de los jugadores
function showBalances() {
    console.log("Show Balances");
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

        // Mostrar detalles de las apuestas de cada jugador
        let betDetails = `
            <h3>${player}</h3>
            <p>Saldo Anterior: ${formatCurrency(previousBalance)}</p>
            <p>Apuestas:</p>
            <ul>`;
        
        if (quadrantAmount > 0) {
            betDetails += `<li>${formatCurrency(quadrantAmount)} <span style="text-decoration: ${quadrantBet === quadrantResult ? 'underline' : 'none'}; font-style: ${quadrantBet !== quadrantResult ? 'italic' : 'normal'}">${quadrantBet === quadrantResult ? `(Ganó ${formatCurrency(quadrantAmount * 2)})` : '(Perdió)'}</span></li>`;
        }
        if (parityAmount > 0) {
            betDetails += `<li>${formatCurrency(parityAmount)} <span style="text-decoration: ${parityBet === parityResult ? 'underline' : 'none'}; font-style: ${parityBet !== parityResult ? 'italic' : 'normal'}">${parityBet === parityResult ? `(Ganó ${formatCurrency(parityAmount)})` : '(Perdió)'}</span></li>`;
        }
        if (colorAmount > 0) {
            betDetails += `<li>${formatCurrency(colorAmount)} <span style="text-decoration: ${colorBet === colorResult ? 'underline' : 'none'}; font-style: ${colorBet !== colorResult ? 'italic' : 'normal'}">${colorBet === colorResult ? `(Ganó ${formatCurrency(colorAmount)})` : '(Perdió)'}</span></li>`;
        }
        if (numberAmount > 0) {
            betDetails += `<li>${formatCurrency(numberAmount)} <span style="text-decoration: ${numberBet === numberResult ? 'underline' : 'none'}; font-style: ${numberBet !== numberResult ? 'italic' : 'normal'}">${numberBet === numberResult ? `(Ganó ${formatCurrency(numberAmount * 35)})` : '(Perdió)'}</span></li>`;
        }
        if (rangeAmount > 0) {
            betDetails += `<li>${formatCurrency(rangeAmount)} <span style="text-decoration: ${rangeBet === rangeResult ? 'underline' : 'none'}; font-style: ${rangeBet !== rangeResult ? 'italic' : 'normal'}">${rangeBet === rangeResult ? `(Ganó ${formatCurrency(rangeAmount)})` : '(Perdió)'}</span></li>`;
        }

        betDetails += `</ul>
            <p>Total Apostado: ${formatCurrency(totalBets)}</p>
            <p>${netResult >= 0 ? 'Ganancia' : 'Pérdida'}: ${formatCurrency(netResult)}</p>
            <p>Nuevo Saldo: ${formatCurrency(currentBalance)}</p>`;

        balanceDiv.innerHTML = betDetails;
        playersDiv.appendChild(balanceDiv);
    });
    goToBalances(); // Mover aquí para asegurar la navegación
}

// Función para formatear los montos de dinero
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
