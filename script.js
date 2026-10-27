// Atividade 2 - Estados e cidades com a API do IBGE
// Aluno(a): ________________________

const selectEstado = document.getElementById('estado')
const selectCidade = document.getElementById('cidade')
const qtdCidades = document.getElementById('qtdCidades')
const inputFiltro = document.getElementById('filtro')
const resumo = document.getElementById('resumo')

const URL_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'

let cidadesDoEstado = []

// 1) Carregar os estados ao abrir a pagina
function carregarEstados() {
    fetch(URL_ESTADOS)
        .then(resposta => resposta.json())
        .then(estados => {
            selectEstado.innerHTML = '<option value="">Selecione o estado</option>'

            estados.forEach(estado => {
                const option = document.createElement('option')
                option.value = estado.sigla
                option.textContent = estado.nome
                selectEstado.appendChild(option)
            })
        })
        .catch(() => {
            selectEstado.innerHTML = '<option value="">Erro ao carregar estados</option>'
        })
}

// Preenche o select de cidades com a lista recebida
function preencherCidades(lista) {
    selectCidade.innerHTML = '<option value="">Selecione a cidade</option>'

    lista.forEach(cidade => {
        const option = document.createElement('option')
        option.value = cidade.nome
        option.textContent = cidade.nome
        selectCidade.appendChild(option)
    })
}

// 2) Carregar as cidades quando o estado mudar
selectEstado.addEventListener('change', () => {
    const uf = selectEstado.value

    cidadesDoEstado = []
    inputFiltro.value = ''
    inputFiltro.disabled = true
    qtdCidades.textContent = ''

    if (uf === '') {
        selectCidade.innerHTML = '<option value="">Escolha um estado primeiro</option>'
        selectCidade.disabled = true
        return
    }

    selectCidade.innerHTML = '<option value="">Carregando...</option>'
    selectCidade.disabled = true

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(resposta => resposta.json())
        .then(cidades => {
            // ignora resposta antiga se o usuario ja trocou de estado
            if (selectEstado.value !== uf) return

            cidadesDoEstado = cidades
            preencherCidades(cidades)
            selectCidade.disabled = false
            inputFiltro.disabled = false
            qtdCidades.textContent = `${selectEstado.options[selectEstado.selectedIndex].text} tem ${cidades.length} cidades.`
        })
        .catch(() => {
            selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>'
        })
})

// Desafio extra: filtrar as cidades enquanto o usuario digita
inputFiltro.addEventListener('input', () => {
    const texto = inputFiltro.value.trim().toLowerCase()
    const filtradas = cidadesDoEstado.filter(c => c.nome.toLowerCase().includes(texto))

    preencherCidades(filtradas)
    qtdCidades.textContent = texto === ''
        ? `${selectEstado.options[selectEstado.selectedIndex].text} tem ${cidadesDoEstado.length} cidades.`
        : `${filtradas.length} de ${cidadesDoEstado.length} cidades encontradas.`
})

// 3) Enviar o formulario
document.getElementById('formInscricao').addEventListener('submit', (evento) => {
    evento.preventDefault() // impede a pagina de recarregar

    const nome = document.getElementById('nome').value.trim()
    const uf = selectEstado.value
    const cidade = selectCidade.value

    if (uf === '' || cidade === '') {
        resumo.innerHTML = '<span class="erro">Selecione o estado e a cidade.</span>'
        return
    }

    resumo.textContent = `${nome}, de ${cidade}/${uf}, inscrito com sucesso`
})

carregarEstados()
