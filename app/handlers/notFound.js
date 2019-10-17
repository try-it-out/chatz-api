/**
 * Middleware for handling 404.
 * @returns {Function}
 */
module.exports = function handleNotFound () {
  return (req, res) => {
    return res.status(404).send({ error: 'Sorry cant find that!' })
  }
}
