import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const remove = (personId) => {
  const url = `${baseUrl}/${personId}`;
  const request = axios.delete(url);
  return request.then((response) => response.data);
};

const update = (personId, updatedPerson) => {
  const url = `${baseUrl}/${personId}`;
  console.log("url", url);
  const request = axios.put(url, updatedPerson);
  return request.then((response) => response.data);
};

export default {
  getAll: getAll,
  create: create,
  remove: remove,
  update: update,
};
