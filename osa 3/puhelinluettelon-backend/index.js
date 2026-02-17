require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(express.static("dist"));

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

/* View all persons in json format*/
app.get("/api/persons", (request, response) => {
  console.log("/api/persons");
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

/* Get info about the phonebook */
app.get("/info", (request, response) => {
  const time = new Date().toString();
  Person.find({}).then(persons => {
    const length = persons.length;
    response.send("<p>Phonebook has info for " + length + " people</p>" + time);
  });
});

/* View one person */
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

/* Add new a new person and a number */
app.post("/api/persons", (request, response) => {
  const body = request.body;
  // Check that number and name are included
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
