const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, item) => {
    return item.likes + sum
  }, 0)
}

module.exports = {
  dummy,
  totalLikes,
}
