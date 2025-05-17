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
            <input type="number" id="quantCripto" placeholder="Digite o valor">
            <select name="criptomoedas" id="criptoSelect">
                ${optionsCripto}
            </select>
            <button id="btn">Ver resultado</button>
            <div id="output"></div>
        </div>
        <div class="infoContent" style="display: none;"></div>
         `

    main.appendChild(divIinputRow)

    const select = document.querySelector('#criptoSelect')
    const btn = document.querySelector('#btn')
    const output = document.querySelector('#output')
    const quantCripto = document.querySelector('#quantCripto')
    const infoContent = document.querySelector(".infoContent")

    btn.addEventListener("click", () => {
        const quantidadeC = quantCripto.value
        const selectCripto = cripto.find(c => c.id === select.value)

        if (selectCripto && !isNaN(quantidadeC) && quantidadeC > 0) {
            const resultado = quantidadeC * selectCripto.current_price
            console.log(selectCripto.name, resultado)

            // funcao para formatar preços em reais
            const formatarEmReais = (reais) => reais.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })

            // funcao para formatar as datas
            const dataFormatada = (dateFormat) => dateFormat.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })

            // funcao para formatar hora
            const horaFormatada = (hora) => hora.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            })

            const resultadoFormatado = formatarEmReais(resultado)
            const precoUltimasHoras = formatarEmReais(selectCripto.price_change_24h)
            const maiorPreco = formatarEmReais(selectCripto.ath)
            const menorPreco = formatarEmReais(selectCripto.atl)
            const dataUltimaAtualizacao = dataFormatada(new Date(selectCripto.last_updated))
            const dataMaiorPrecoFormatado = dataFormatada(new Date(selectCripto.ath_date))
            const horaUltimaAtualizao = horaFormatada(new Date(selectCripto.last_updated))

            output.innerHTML = `
            <span>${selectCripto.symbol.toUpperCase()}: ${resultadoFormatado}</span> <span>Ultima atualizacao em ${dataUltimaAtualizacao} as ${horaUltimaAtualizao}</span>
            `

            infoContent.style.display = ""
            infoContent.innerHTML = `
                <h3>${selectCripto.name}</h3>
                <img id="criptoImg" src="${selectCripto.image}" style="width: 40px;">
                <span>Variação de preço nas últimas 24 horas: ${precoUltimasHoras}</span>
                <span>Variação percentual do preço nas últimas 24 horas: ${selectCripto.price_change_percentage_24h.toFixed(2)}%</span>
                <span>Preço mais alto da história: ${maiorPreco} em ${dataMaiorPrecoFormatado}</span>
                <span>Preço mais baixo da história: ${menorPreco}</span>
                <span>Posição no ranking de capitalização: ${selectCripto.market_cap_rank}</span>
            `

        } else {
            output.innerHTML = `
                <span style="color: red;">Selecione uma criptomoeda e insira um valor maior que 0.</span>
            `
        }
    })
}
