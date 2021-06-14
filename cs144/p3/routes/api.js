var express = require('express')
var jwt = require('jsonwebtoken')
var MongoClient = require('mongodb').MongoClient
var router = express.Router()

var options = { useUnifiedTopology: true, writeConcern: { j: true } }
var connection = MongoClient.connect('mongodb://localhost:27017', options)
var secret = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c'

router.get('/posts', async (req, res, next) => {

  if (!req.cookies.jwt) {
    console.log("no cookie found")
    res.status(401).send("No cookie found")
    return
  }

  var decoded = jwt.verify(req.cookies.jwt, secret)
  
  if (req.query.username != decoded.usr) {
    console.log("username does not match")
    res.status(401).send('Username does not match cookie')
    return
  }

  var client = await connection

  if (req.query.username && req.query.postid) {
    var data = await client.db('BlogServer').collection('Posts').find({
      username: req.query.username,
      postid: Number(req.query.postid)
    }).toArray()

    if (data?.length) {
      res.status(200).send(data[0])
    } else {
      res.status(404).send('Not found')
    }
  } else if (req.query.username) {
    var data = await client.db('BlogServer').collection('Posts').find({
      username: req.query.username
    }).toArray()
    res.status(200).send(data)
  } else {
    res.status(400).send('Missing parameters')
  }
})

router.post('/posts', async (req, res, next) => {

  if (!req.cookies.jwt) {
    console.log("no cookie found")
    res.status(401).send("No cookie found")
    return
  }

  var decoded = jwt.verify(req.cookies.jwt, secret)
  
  if (req.body.username != decoded.usr) {
    console.log(`username does not match; cookie: ${decoded.usr}, received: ${req.body.username}`)
    res.status(401).send('Username does not match cookie')
    return
  }

  var client = await connection

  if (req.body.username && req.body.postid != null && req.body.title) {

    var postid = Number(req.body.postid)

    if (postid == 0) {

      var maxid = Number((await client.db('BlogServer').collection('Users').find({
        username: req.body.username
      }).toArray())[0].maxid) + 1

      var now = Date.now()
      var result = await client.db('BlogServer').collection('Posts').insertOne({
        username: req.body.username,
        postid: maxid,
        title: req.body.title,
        body: req.body.body ? req.body.body : "",
        created: now,
        modified: now
      })

      if (result.result.n) {
        res.status(201).send({ postid: maxid, created: now, modified: now })

        var result = await client.db('BlogServer').collection('Users').updateOne({
          username: req.body.username
        }, {
          $set: {
            maxid: maxid
          }
        })

        if (result.result.n) console.log('updated maxid successfully')
        else console.log('update maxid failed')

      } else res.status(500).send('Database operation failed')

    } else if (postid > 0) {

      var now = Date.now()
      var result = await client.db('BlogServer').collection('Posts').updateOne({
        username: req.body.username,
        postid: postid
      }, {
        $set: {
          title: req.body.title,
          body: req.body.body,
          modified: now
        }
      })

      if (result.result.n) res.status(200).send({ modified: now })
      else res.status(404).send('Not found')

    } else res.status(400).send('Invalid parameters')
  } else res.status(400).send('Missing parameters')

})

router.delete('/posts', async (req, res, next) => {

  if (!req.cookies.jwt) {
    res.status(401).send("No cookie found")
    return
  }

  var decoded = jwt.verify(req.cookies.jwt, secret)
  if (req.query.username != decoded.usr) {
    res.status(401).send('Username does not match cookie')
    return
  }

  var client = await connection

  if (req.query.username && req.query.postid) {
    var result = await client.db('BlogServer').collection('Posts').deleteOne({
      username: req.query.username,
      postid: Number(req.query.postid)
    })

    if (result.result.n) res.status(204).send('Deleted')
    else res.status(404).send('Not found')

  } else {
    res.status(400).send('Missing parameters')
  }
})

module.exports = router
