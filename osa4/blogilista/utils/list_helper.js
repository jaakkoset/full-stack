const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, item) => {
    return item.likes + sum
  }, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((mostLikes, blog) => {
    return blog.likes > mostLikes.likes ? blog : mostLikes
  }, blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
