const mongoose = require("mongoose");

if (process.argv.length != 3 && process.argv.length != 5) {
  console.log("Usage:");
  console.log("node mongo.js yourpassword");
  console.log("OR");
  console.log('node mongo.js yourpassword "Name Here" number-here');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://jaakkel:${password}@full-stack-open.qk4poy7.mongodb.net/puhelinluettelo?appName=Full-stack-open`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const addPerson = () => {
  console.log("process.argv[3]:", process.argv[3]);
  console.log("process.argv[4]:", process.argv[4]);

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(result => {
    console.log("note saved!");
    console.log("result", result);
    mongoose.connection.close();
  });
};

const printPhonebook = () => {
  console.log("phonebook:");
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
};

if (process.argv.length === 5) {
  addPerson();
} else if (process.argv.length === 3) {
  printPhonebook();
}
