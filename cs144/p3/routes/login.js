var express = require('express')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var MongoClient = require('mongodb').MongoClient
var router = express.Router()

var options = { useUnifiedTopology: true, writeConcern: { j: true } }
var connection = MongoClient.connect('mongodb://localhost:27017', options)

router.get('/', (req, res, next) => {
  res.render('login', {
    redirect: req.query.redirect
  })
})

router.post('/', async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).render('login', {
      redirect: req.query.redirect
    })
  } else {
    var client = await connection
    var data = await client.db('BlogServer').collection('Users').find({
      username: req.body.username
    }).toArray()

    if (data?.length) {
      if (bcrypt.compareSync(req.body.password, data[0].password)) {

        var secret = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c'
        var token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + 7200,
          usr: req.body.username
        }, secret, {
          header: {
            alg: 'HS256',
            typ: 'JWT'
          }
        })

        if (req.body.redirect) {
          res.status(302).cookie('jwt', token).redirect(req.body.redirect)
        } else {
          res.status(200).cookie('jwt', token).send('success')
        }
      }
      return
    }
    res.status(401).render('login', {
      redirect: req.query.redirect
    })
  }
})

module.exports = router
