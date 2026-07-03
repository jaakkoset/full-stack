import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async blogObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, blogObject, config)
  return response.data
}

const update = async (blogObject, blogId) => {
  const url = `${baseUrl}/${blogId}`
  const response = await axios.put(url, blogObject)
  return response.data
}

const deleteBlog = async blogId => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response
}

export default { getAll, create, setToken, update, deleteBlog }
