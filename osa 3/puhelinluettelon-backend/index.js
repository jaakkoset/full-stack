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
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        console.log("Person not found in the database");
        response.status(404).end();
      }
    })
    .catch(error => {
      console.log(
        "Searching for a person resulted in an error",
        "likely because of a malformatted ID.",
      );
      next(error);
    });
});

/* Add new a new person and a number */
app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  // Check that number and name are included

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => {
      console.log("Adding a person resulted in an error.");
      next(error);
    });
});

/* Delete a person */
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      return response.status(204).end();
    })
    .catch(error => {
      console.log("Deleting a person resulted in an error.");
      next(error);
    });
});

/* Update a number */
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end();
      }

      person.name = name;
      person.number = number;

      return person.save().then(updatedPerson => {
        response.json(updatedPerson);
      });
    })
    .catch(error => {
      console.log("Updating number resulted in an error");
      next(error);
    });
});

const errorHandler = (error, request, response, next) => {
  console.log("------ error.message ------");
  console.error(error.message);
  console.log("---------------------------");

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
