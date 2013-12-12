/**
  * Copyright (c) 2011 TJ Holowaychuk
  * Copyright (c) 2010, 2011 Justin Tulloss

  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:

  * The above copyright notice and this permission notice shall be included in
  * all copies or substantial portions of the Software.

  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  * THE SOFTWARE.
  */

var zmq = require('zmq')
var assert = require('assert')

if (process.argv.length != 5) {
  console.log('usage: remote_thr <bind-to> <message-size> <message-count>')
  process.exit(1)
}

var connect_to = process.argv[2]
var message_size = Number(process.argv[3])
var message_count = Number(process.argv[4])
var message = new Buffer(message_size)
message.fill('h')

var counter = 0

var sock = zmq.socket('pub')
//sock.setsockopt(zmq.ZMQ_SNDHWM, message_count);
sock.connect(connect_to)

function send(){
  for (var i = 0; i < message_count; i++) {
    sock.send(message)
  }

  // all messages may not be received by local_thr if closed immediately
  setTimeout(function () {
    sock.close()
  }, 1000);
}

// because of what seems to be a bug in node-zmq, we would lose messages
// if we start sending immediately after calling connect(), so to make this
// benchmark behave well, we wait a bit...

setTimeout(send, 1000);

