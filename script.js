function goToResults() {
    document.getElementById('bets').style.display = 'none';
    document.getElementById('balances').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    // Limpiar los campos de resultado
    document.getElementById('numberResult').value = '';
    document.getElementById('colorResult').value = 'green';
}

function recordRound() {
    const numberResult = parseInt(document.getElementById('numberResult').value);
    const colorResult = document.getElementById('colorResult').value;

    if (isNaN(numberResult) || numberResult < 0 || numberResult > 36) {
        alert("Por favor, ingrese un número válido entre 0 y 36.");
        return;
    }

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
    });

    updateHistory(numberResult, colorResult);
    showBalances();
}

function showBalances() {
    const playersDiv = document.getElementById('players');
    playersDiv.innerHTML = '';
    const winningNumberDiv = document.getElementById('winningNumber');
    const numberResult = parseInt(document.getElementById('numberResult').value);
    const colorResult = document.getElementById('colorResult').value;
    winningNumberDiv.textContent = `${numberResult} - ${colorResult}`;
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
            <p>${netResult >= 0 ? 'Ganancia' : 'Pérdida'}: ${Math.abs(netResult)}</p>
            <p>Nuevo Saldo: ${currentBalance}</p>
            <p>Nivel: ${playerLevels[player].level}</p>`;

        balanceDiv.innerHTML = betDetails;
        playersDiv.appendChild(balanceDiv);
    });

    document.getElementById('houseBalance').innerText = `Saldo de la Casa: ${houseBalance}`;
    
    document.getElementById('balances').style.display = 'block';
    document.getElementById('results').style.display = 'none';
}
