var express = require('express')
var crypto = require('crypto')
var app = express()

var hmac = function (key, content) {
  var method = crypto.createHmac('sha1', key)
  method.setEncoding('base64')
  method.write(content)
  method.end()
  return method.read()
}

app.use('/iceconfig', function (req, resp) {
  var query = req.query
  var key = '4080218913' //key must be same as the static-auth-secret value in turnserver.conf
  var time_to_live = 600
  var timestamp = Math.floor(Date.now() / 1000) + time_to_live
  var turn_username = timestamp + ':mytest' //mytest is realm name, see https://www.ietf.org/proceedings/87/slides/slides-87-behave-10.pdf
  var password = hmac(key, turn_username)

  return resp.send({
    iceServers: [
      {
        urls: [
          'stun:39.105.194.195:3478',
          'turn:39.105.194.195:3478'
        ],
        username: turn_username,
        credential: password
      }
    ]
  })
})

app.listen('3033', function () {
  console.log('server started')
})
