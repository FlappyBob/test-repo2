const express = require("express");
const app = express();
const morgan = require("morgan");

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());

// configure morgan
morgan.token('content', (req, res) => { //creating id token\
  if (req.method == 'POST') 
    return JSON.stringify(req.body)
})
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :content')

app.use(logger)

app.get("/info", (request, response) => {
  const len = persons.length;
  response.send(`Phonebook has info for ${len} people <br> ${new Date()}`);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const person = persons.find(
    (person) => person.id === Number(request.params.id)
  );
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000);
};

const isDuplicate = (name) => {
  if (persons.find((person) => person.name === name)) return true;
  return false;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body) {
    return response.status(400).send("Bad request: body is not defined");
  }
  if (!body.name || !body.number) {
    return response
      .status(400)
      .send("Bad request: body.name or body.number is not defined");
  }
  if (isDuplicate(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);
  response.send("Person sent successfully");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
