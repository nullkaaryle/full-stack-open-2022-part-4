const logger = require('./logger')


const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  const reducer = (sum, item) => {
    logger.info('item on ', item)
    logger.info('item.likes on ', item.likes)
    return sum + item.likes
  }
  logger.info('pituus on ', blogs.length)
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}


const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}


const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}


module.exports = {
  totalLikes,
  dummy,
  reverse,
  average
}
