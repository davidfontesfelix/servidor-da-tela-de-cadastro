const express = require('express')
const { uuid } = require('uuidv4')
import cors from 'cors'
const port = process.env.PORT || 3001

const app = express()
app.use(express.json());
app.use(cors());

const users = []

app.get('/users/list', (request, response) => {

  return response.json(users)
})

app.get('/users', (request, response) => {
  const name = request.query.name
  const senha = request.query.senha

  const user = users.find(u => u.name === name)

  if (!user) {
    return response.status(404).json({ error: 'Nome de usuário ou senha estão errados' })
  }

  if (user.senha != senha) {
    return response.status(400).json({ error: 'Nome de usuário ou senha estão errados' })
  }

  return response.json(user)
})

app.get('/users/:id', (request, response) => {
  const { id } = request.params
  const user = users.find(u => u.id === id)

  if (!user) {
    return response.status(404).json({ error: "id não encontrado" })
  }

  return response.json(user)
})

app.get('/users/name/:id', (request, response) => {
  const { id } = request.params
  const user = users.find(u => u.id === id)

  if (!user) {
    return response.status(404).json({ error: "id não encontrado" })
  }

  return response.json(user.name)
})

app.get('/users/email/:id', (request, response) => {
  const { id } = request.params
  const user = users.find(u => u.id === id)

  if (!user) {
    return response.status(404).json({ error: "id não encontrado" })
  }

  return response.json(user.email)
})

app.get('/users/senha/:id', (request, response) => {
  const { id } = request.params
  const user = users.find(u => u.id === id)

  if (!user) {
    return response.status(404).json({ error: "id não encontrado" })
  }

  return response.json(user.senha)
})

app.get('/users/search/:email', (request, response) => {
  const { email } = request.params

  const user = users.find(u => u.email === email)

  if (!email) {
    return response.status(404).json({ error: "Desculpe-nos, mas não conseguimos encontrar sua conta." })
  }

  return response.json(user.name)
})

app.post('/registrar', (request, response) => {
  const { name, email, senha, confirmarSenha } = request.body
  const user = { id: uuid(), name, email, senha }

  const existingUser = users.find(user => user.name === name);
  const existingEmail = users.find(user => user.email === email);
  const passwordLength = senha.length


  if (!name || !email || !senha) {
    return response.status(400).json({ error: 'Todos os campos devem ser preenchidos' });
  }

  if (existingUser) {
    return response.status(409).json({ error: 'Nome de usuário já existe' });
  }
  if (existingEmail) {
    return response.status(409).json({ error: 'Email já existe' });
  }

  if (!email.includes('@')) {
    return response.status(409).json({ error: 'Email inválido' })
  }

  if (passwordLength < 8) {
    return response.status(400).json({ error: 'A senha precisa ter no minimo 8 caracteres' })
  }

  if (senha != confirmarSenha) {
    return response.status(400).json({ error: 'senhas não são iguais' })
  }

  users.push(user)

  return response.status(201).json(user)

})

app.put('/user/changes/:id', (request, response) => {
  const { id } = request.params
  const { name, email, senha } = request.query

  const user = users.find(u => u.id === id)

  if (!user) {
    return response.status(404).json({ error: "id não encontrado" })
  }

  user.name = name
  user.email = email
  user.senha = senha

  return response.json(user)
})

app.delete('/user/delete/:id', (request, response) => {
  const { id } = request.params

  const userIndex = users.findIndex(u => u.id === id)

  if (!userIndex) {
    return response.status(404).json({ error: "Não foi possivel encontrar a conta" })
  }

  users.splice(userIndex, 1);

  return response.status(201).json({ message: "conta excluida com sucesso" })
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});