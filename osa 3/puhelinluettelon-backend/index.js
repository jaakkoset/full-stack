const express = require("express");
const app = express();

let persons = [
  { name: "Arto Hellas", number: "040-123456" },
  { name: "Ada Lovelace", number: "39-44-5323523" },
  { name: "Dan Abramov", number: "12-43-234345" },
  { name: "Mary Poppendieck", number: "39-23-6423122" },
  { name: "Dr. Livingstone", number: "+260-12-03-1873" },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const time = new Date().toString();
  const length = persons.length;
  response.send("<p>Phonebook has info for " + length + " people</p>" + time);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
