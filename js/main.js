import ui from "./ui.js"
import api from "./api.js"

function removerEspaços(string) {
    return string.replaceAll(/\s+/g, '')
}

const regexConteudo = /^[A-Za-z\s]{10,}$/
const regexAutoria = /^[A-Za-z]{3,15}$/

document.addEventListener('DOMContentLoaded', () => {
    ui.renderizarPensamentos()

    const formularioPensamento = document.getElementById('pensamento-form')
    const botaoCancelar = document.getElementById('botao-cancelar')
    const inputBusca = document.getElementById('campo-busca')
    
    formularioPensamento.addEventListener('submit', manipularSubmissaoFormulario)
    botaoCancelar.addEventListener('click', manipularCancelamento)
    inputBusca.addEventListener('input', manipularBusca)
})

async function manipularSubmissaoFormulario(event) {
    event.preventDefault()
    
    const id = document.getElementById('pensamento-id').value
    const conteudo = document.getElementById('pensamento-conteudo').value
    const autoria = document.getElementById('pensamento-autoria').value
    const data = document.getElementById('pensamento-data').value

    const conteudoSemEspaços = removerEspaços(conteudo)
    const autoriaSemEspaços = removerEspaços(autoria)

    if (!validarConteudo(conteudoSemEspaços)) {
        alert('É permitido a inclusão somente de letras e espaços com no mínimo 10 caracteres.')
        return
    }

    if (!validarAutoria(autoriaSemEspaços)) {
        alert('É permitido a inclusão somente de letras entre 3 e 15 caracteres sem espaços.')
        return
    }

    if (!validarData(data)) {
        alert('Não é permitido o cadastro de datas futuras. Selecione outra data.')
        return
    }

    try {
        if (id) {
            await api.editarPensamento({ id, conteudo, autoria, data })
        } else {
            await api.salvarPensamento({ conteudo, autoria, data })
        }
        ui.renderizarPensamentos()
    }
    catch {
        alert('Erro ao submeter o formulário')
    }
}

function manipularCancelamento() {
    ui.limpaFormulario()
}

async function manipularBusca() {
    const termoBusca = document.getElementById('campo-busca').value
    try {
        const pensamentosFiltrados = await api.buscarPensamentoPorTermo(termoBusca)
        console.log(pensamentosFiltrados)
        ui.renderizarPensamentos(pensamentosFiltrados)
    } catch {
        alert('Erro ao realizar busca')
    }
}

function validarData(data) {
    const dataAtual = new Date()
    const dataEscolhida = new Date(data)
    return dataEscolhida <= dataAtual
}

function validarConteudo(conteudo) {
    return regexConteudo.test(conteudo)
}

function validarAutoria(autoria) {
    return regexAutoria.test(autoria)
}