const lodash = require('lodash')

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

/* Returns the author with the highest total number of blogs */
const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }
  const blogsPerAuthor = blogs.reduce(
    (iterable, blog) => {
      // number of blogs by the current author
      const numberOfBlogs = iterable.authors[blog.author]
      if (numberOfBlogs) {
        iterable.authors[blog.author]++
        const newNumberOfBlogs = iterable.authors[blog.author]
        if (newNumberOfBlogs > iterable.mostSoFar.blogs) {
          // Update the author with the most blogs so far
          iterable.mostSoFar.author = blog.author
          iterable.mostSoFar.blogs = newNumberOfBlogs
        }
      } else {
        // This author is encountered for the first time
        iterable.authors[blog.author] = 1
      }
      return iterable
    },
    { authors: {}, mostSoFar: { author: blogs[0].author, blogs: 1 } },
  )

  //console.log('blogsPerAuthor:', blogsPerAuthor)
  //console.log('blogsPerAuthor.mostSoFar:', blogsPerAuthor.mostSoFar)
  return blogsPerAuthor.mostSoFar
}

/* Returns the author with the highest total number of likes across all blogs */
const mostLikes = blogs => {
  //console.log('blogs:', blogs)
  if (blogs.length === 0) {
    return null
  }
  const grouped = lodash(blogs).groupBy('author')
  const summed = grouped.map((blogs, author) => {
    //console.log(`blogs of ${author}:`, blogs)
    return {
      author: author,
      totalLikes: lodash.sumBy(blogs, 'likes'),
    }
  })
  //console.log('summed:', summed)
  const max = summed.maxBy('totalLikes')
  //console.log('max:', max)
  return max
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
