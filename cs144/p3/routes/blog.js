var express = require('express')
var commonmark = require('commonmark')
var MongoClient = require('mongodb').MongoClient
var router = express.Router()

var options = { useUnifiedTopology: true, writeConcern: { j: true } }
var connection = MongoClient.connect('mongodb://localhost:27017', options)

router.get('/:username', async (req, res, next) => {

  var start = Number(req.query.start) || 1

  var client = await connection
  var data = await client.db('BlogServer').collection('Posts').find({
    username: req.params.username,
    postid: {
      $gte: start,
      $lte: start + 5
    }
  }).toArray()

  if (data?.length) {
    res.render('list', {
      username: req.params.username,
      posts: data.slice(0, 5),
      hasNext: data?.length == 6,
      start: start
    })
  }
  else res.sendStatus(404)

})

router.get('/:username/:postid', async (req, res, next) => {

  var client = await connection
  var data = await client.db('BlogServer').collection('Posts').find({
    username: req.params.username,
    postid: Number(req.params.postid)
  }).toArray()

  if (data?.length) {

    data = data[0]
    
    var reader = new commonmark.Parser()
    var writer = new commonmark.HtmlRenderer()

    data.title = writer.render(reader.parse(data.title))
    data.body = writer.render(reader.parse(data.body))

    res.render('post', {
      post: data
    })
  }
  else res.sendStatus(404)

})

module.exports = router
