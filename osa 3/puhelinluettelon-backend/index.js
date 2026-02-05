const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
//app.use(morgan("tiny"));

morgan.token("POST-body", request => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
  return " ";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :POST-body",
  ),
);

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
  { id: "5", name: "Dr. Livingstone", number: "+260-12-03-1873" },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const time = new Date().toString();
  const length = persons.length;
  response.send("<p>Phonebook has info for " + length + " people</p>" + time);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id === id);
  //console.log("person:", person);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  // Check that number and name are included
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  // Check that name does not already exist
  const nameReserved = persons.find(p => p.name === body.name);
  if (nameReserved) {
    return response.status(409).json({ error: "name must be unique" });
  }

  const person = {
    id: String(Math.floor(Math.random() * 10 ** 6)),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
