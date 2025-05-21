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
    let optionsCripto = `<option value="" disabled selected>Selecione uma criptomoeda</option>`

    // mostra as opcoes de criptomoedas
    cripto.forEach(element => {
        optionsCripto += `<option value="${element.id}"> ${element.name} (${element.symbol.toUpperCase()}) </option>`
    });

    // adiciona os inputs e select na página html
    divIinputRow.innerHTML = `
        <h2 class="titulo">Conversor de Criptomoedas</h2>
        <div class="container">
            <div class="inputRow">
                <div class="inputColumn">
                    <label for="quantCripto" class="label">Insira a quantidade de criptomoedas</label>
                    <input type="number" id="quantCripto" placeholder="Ex.: 3">
                </div>

                <div class="inputColumn">
                    <label for="criptoSelect" class="label">Selecione uma criptomoeda</label>
                    <select name="criptomoedas" id="criptoSelect">
                        ${optionsCripto}
                    </select>
                </div>

                <div class="inputColumn">
                    <label class="label">&nbsp;</label> <!-- label com espaço em branco para ajustar o botao -->
                    <button id="btn">Ver resultado</button>
                </div>   
        </div>
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

    // evento de clique para que mostre as informações da cripto moeda selecionada
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
            <span id="precoConvertido">${selectCripto.symbol.toUpperCase()}: ${resultadoFormatado}</span> <span id="ultAtualizacao">Última atualização em ${dataUltimaAtualizacao} às ${horaUltimaAtualizao}h</span>
            `

            infoContent.style.display = ""
            infoContent.innerHTML = `
                <div class="infoHeader">
                    <h3 style="font-size: 30px;">${selectCripto.name}</h3>
                    <img id="criptoImg" src="${selectCripto.image}">
                </div>
                <div class="infoItem">
                    <span>Variação de preço nas últimas 24 horas: ${precoUltimasHoras}</span>
                    <span>Variação percentual do preço nas últimas 24 horas: ${selectCripto.price_change_percentage_24h.toFixed(2)}%</span>
                    <span>Preço mais alto da história: ${maiorPreco} em ${dataMaiorPrecoFormatado}</span>
                    <span>Preço mais baixo da história: ${menorPreco}</span>
                    <span>Posição no ranking de capitalização: ${selectCripto.market_cap_rank}</span>
                </div>
            `

        } else {
            output.innerHTML = `
                <span id="campoVazio">Selecione uma criptomoeda e insira um valor maior que 0.</span>
            `
        }
    })
}
