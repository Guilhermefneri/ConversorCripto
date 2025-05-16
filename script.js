const cryptoList = document.getElementById('crypto-list')
const main = document.querySelector('.main')

fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        exibirConversor(data);
    })
    .catch(error => console.error('Erro ao buscar criptomoedas:', error));

function exibirConversor(cripto) {
    const divIinputRow = document.createElement('div')
    let optionsCripto = `<option value="" disabled selected>Selecione uma moeda</option>`

    // mostra as opcoes de criptomoedas
    cripto.forEach(element => {
        optionsCripto += `<option value="${element.id}"> ${element.name} (${element.symbol.toUpperCase()}) </option>`
    });

    divIinputRow.innerHTML = `
        <h2 class="titulo">Conversor de Criptomoedas</h2>
        <div class="inputRow">
            <input type="number" id="inputValor" placeholder="Digite o valor">
            <select name="criptomoedas" id="criptoSelect">
                ${optionsCripto}
            </select>
            <button id="btn">Ver resultado</button>
            <div id="output"></div>
        </div>
        <div class="infoContent">Informações aq</div>
         `
    main.appendChild(divIinputRow)
    const select = document.querySelector('#criptoSelect')
    const btn = document.querySelector('#btn')
    const output = document.querySelector('#output')
    const inputValor = document.querySelector('#inputValor')
    const infoContent = document.querySelector(".infoContent")

    btn.addEventListener("click", () => {
        const valor = parseFloat(inputValor.value)
        const selectCripto = cripto.find(c => c.id === select.value)

        if (selectCripto && !isNaN(valor) && valor > 0) {
            const resultado = valor * selectCripto.current_price
            console.log(selectCripto.name, resultado)

            const resultadoFormatado = resultado.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })

            output.innerHTML = `
                <span>${selectCripto.symbol.toUpperCase()}: ${resultadoFormatado}</span> <span>Ultima atualizacao em ${selectCripto.last_updated}</span>
            `
            infoContent.innerHTML = `
                <h3>${selectCripto.name}</h3>
                <span>Variação de preço nas últimas 24 horas: R$${selectCripto.price_change_24h.toFixed(2)}</span>
                <span>Variação percentual do preço nas últimas 24 horas: ${selectCripto.price_change_percentage_24h.toFixed(2)}%</span>
                <span>Preço mais alto da história: ${selectCripto.ath} em ${selectCripto.ath_date}</span>
                <span>Posição no ranking de capitalização: ${selectCripto.market_cap_rank}</span>
            `

        } else {
            output.innerHTML = `
                <span style="color: red;">Selecione uma criptomoeda e insira um valor maior que 0.</span>
            `
        }
    })
}

