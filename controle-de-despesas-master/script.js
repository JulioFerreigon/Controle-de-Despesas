/* aqui indicamos que a transactionUl tira aperecer embaixo do Titulo "Transações" como uma transação e la embaixo indicamos em que ordem ela vai aparecer */
const transactionUl = document.querySelector('#transactions')
/*aqui indicamos os valores que irão aparecer em receitas, despesas e saldo, nessa ordem */
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
         transaction.id !== ID)
    uppdateLocalStorage()
    init()
}

/*criando o ternário que dará o sinal de positivo ou negativo ao valor*/
const addTransactionIntoDOM = transaction => {
/*aqui criamos o ternário, adicionamos a situação e suas respostas*/
  const operator = transaction.amount < 0 ? '-' : '+'
/*aqui criamos o ternário que aplicará a class ao nosso elemento li*/              
  const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
/*aqui apontamos que o valor que vira de transcation sera um valor absoluto já que o sinal do valor sera colocado por ourta função */
  const amountWhitoutOperator = Math.abs(transaction.amount)
/* aqui criamos nosso elemento li (o elemento li é o valor que a pessoa aplicará no controle de despesas) */
  const li = document.createElement('li')
/* aqui indicamos ao html oq sera inserido na aba Transações quando clicarmos no botão Adicionar */  
  li.innerHTML = `
  ${transaction.name}
  <span>${operator} R$ ${amountWhitoutOperator}</span>
  <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
    x
  </button> 
  `
  /*aqui indicamos que toda transação criada ira aparecer por ultimo referente as outras criando uma linha temporal crescente*/
  transactionUl.append(li)
}

/*aqui criamos os valores que irão aparecer como receitas, despesas e saldo atual no html */
const updateBalanceValues = () => {
/*aqui é um caso clássico de uso do map, utilizamos o map para retornar uma array que contém somente os valores de amount */
    const transacationsAmounts = transactions
        .map(transaction => transaction.amount)
/*aqui é um caso clássico de uso do reduce, utilizamos o reduce para somar todos os elementos da array feita pelo map e retornar apenas 1 valor. */
    const total = transacationsAmounts
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)
/*aqui é um caso clássico de uso do filter, utilizamos um filter para criar uma array baseada em outra porem os valores dessa nova array deve atender a critérios pré informados, após esse filter utilizamos um reduce para que esse valores retornados sejam somados e retorne apenas 1 valor, o valor de Receitas.  */
    const income = transacationsAmounts
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2)
/*aqui é um caso clássico de uso do filter, utilizamos um filter para criar uma array baseada em outra porem os valores dessa nova array deve atender a critérios pré informados, após esse filter utilizamos um reduce para que esse valores retornados sejam somados e retorne apenas 1 valor, o valor de Despesas.  */
    const expense = Math.abs (transacationsAmounts.filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
        .toFixed(2)
 
/* aqui indicamos o que deve aparecer no html referente o que foi dito no topo da página*/
    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

/* aqui criamos uma função que quando a página é atualizada todas as informações que estão em Transações irão continuar aparecendo, para que essa informação não seja perdida*/
const init = () => {
  transactionUl.innerHTML = ''  
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()  
}
init()

const uppdateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

form.addEventListener('submit', event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()

    if(inputTransactionName.value.trim() === '' || inputTransactionAmount.value.trim() === '') {
        alert('Por favor, preencha tanto o nome quanto o valor da transação')
        return
    }

    const transaction = {
         id: generateID(),
         name: transactionName,
         amount: Number(transactionAmount) 
    }


    transactions.push(transaction)
    init()
    uppdateLocalStorage()

    inputTransactionName.value = ''
    inputTransactionAmount.value = ''

})


