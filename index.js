const express = require('express')
const morgan = require('morgan')
const app = express()



app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let numbers = [
	{
		name: "Arto Hellas",
		number: "040-123456",
		id: 1
	},
	{
		name: "Ada Lovelace",
		number: "39-44-5323523",
		id: 2
	},
	{
		name: "Dan Abramov",
		number: "12-43-234345",
		id: 3
	},
	{
		name: "Mary Poppendieck",
		number: "39-23-6423122",
		id: 4
	}
]

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
	response.json(numbers)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const number = numbers.find(number => number.id === id)
	
	if (number) {
		response.json(number)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	numbers = numbers.filter(number => number.id !== id)
	
	response.status(204).end()
})

app.post('/api/persons', (request, response) => {
	const body = request.body
	
	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'content missing'
		})
	}
	
	const temp = numbers.filter(number => number.name == body.name)
	
	if (temp.length > 0) {
		return response.status(400).json({
			error: 'Name must be unique'
		})
	}
	
	const number = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random() * 20000)
	}
	
	numbers = numbers.concat(number)
	
	response.json(numbers)
})

app.get('/info', (request, response) => {
	let answer = '<p>Phonebook has info for ' + numbers.length + ' people</p>'
	answer += '<p>' + new Date() + '</p>'
	response.send(answer)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})