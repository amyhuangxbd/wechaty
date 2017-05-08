/**
 *
 * Wechaty - Wechat for Bot
 *
 * Connecting ChatBots
 * https://github.com/wechaty/wechaty
 *
 */

/* tslint:disable:variable-name */
const QrcodeTerminal = require('qrcode-terminal')

// import { inspect }            from 'util'
import { createWriteStream, writeFileSync }  from 'fs'

import {
  Config,
  Message,
  MsgType,
  Wechaty,
  Contact,
  log,
  MediaMessage,
} from '../'
const bot = Wechaty.instance({ profile: Config.DEFAULT_PROFILE })

bot
.on('scan', (url, code) => {
  if (!/201|200/.test(String(code))) {
    const loginUrl = url.replace(/\/qrcode\//, '/l/')
    QrcodeTerminal.generate(loginUrl)
  }
  console.log(`${url}\n[${code}] Scan QR Code in above url to login: `)
})
.on('login'	  , user => console.log(`${user} logined`))
.on('message', m => {
  console.log(`RECV: ${m}`)

  // console.log(inspect(m))
  saveRawObj(m.rawObj)

  if ( m.type() === MsgType.IMAGE
    || m.type() === MsgType.EMOTICON
    || m.type() === MsgType.VIDEO
    || m.type() === MsgType.VOICE
    || m.type() === MsgType.MICROVIDEO
    || m.type() === MsgType.APP
    || (m.type() === MsgType.TEXT && m.typeSub() === MsgType.LOCATION)  // LOCATION
  ) {
    Message
    // saveMediaFile(m)
  }

  if (m.self()) {
      // m.say('dong')
      log.info('Bot', 'REPLY: dong')

      // m.say(`Join Wechaty Developers' Community

      //       Wechaty is used in many ChatBot projects by hundreds of developers.
      //       If you want to talk with other developers, just scan the following QR Code in WeChat with secret code: wechaty,
      //       you can join our Wechaty Developers' Home at once.
      //   `.replace(/  /, ' '),
      // )
      Contact
      MediaMessage
      // const fileHelper = Contact.load('filehelper')
      // fileHelper.say(new MediaMessage('test.mp4'))
      // m.say('Scan now, because other Wechaty developers want to talk with you too! (secret code: wechaty)')
      log.info('Bot', 'REPLY: Image')
      var request = require('request');
      var sContent = m.content()

      console.log('sContent.length: ' + sContent.length)
      if (sContent.length === 4 || sContent.length === 6) {
        let sendTextUrl = 'http://news.10jqka.com.cn/public/index_keyboard_' + sContent + '_0_5_jsonp.html'
        request(sendTextUrl, async function optionalCallback(err, httpResponse, body) {
          if (err) {
            return console.error('upload failed:', err);
          }
          console.log("hello")
          console.log(body)
          if (body) {
            var sArray = body.slice(6, -1)
            var aArr = JSON.parse(sArray)
            if (aArr.length > 0) {
              var stockNumber = aArr[0].substr(3, 6)
              var sImgUrl = "http://comment.10jqka.com.cn/quotepic/12161707/" + stockNumber + ".png?r=" + Math.random()
              console.log(sImgUrl)

              var download = function(uri, filename, callback){
                request.head(uri, function(err, res, body){
                  // console.log('content-type:', res.headers['content-type']);
                  // console.log('content-length:', res.headers['content-length']);

                  request(uri).pipe(createWriteStream(filename)).on('close', callback);
                });
              };

              download(sImgUrl, 'stock.png', function(){
                console.log('done');
                const fileHelper = Contact.load('filehelper')
                fileHelper.say(new MediaMessage('stock.png'))
              });


            }
          }
        })
      }
      

      


    } else if (/^(ding|ping|bing|code)$/i.test(m.content()) && !m.self()) {
      log.info('Bot', 'REPLY: dong')

      // const fileHelper = Contact.load('filehelper')
      m.say(new MediaMessage('logo.png'))
      


    }
})
.init()
.catch(e => console.error('bot.init() error: ' + e))

// function saveMediaFile(message: Message) {
//   const filename = message.filename()
//   console.log('IMAGE local filename: ' + filename)

//   const fileStream = createWriteStream(filename)

//   console.log('start to readyStream()')
//   message.readyStream()
//           .then(stream => {
//             stream.pipe(fileStream)
//                   .on('close', () => {
//                     console.log('finish readyStream()')
//                   })
//           })
//           .catch(e => console.log('stream error:' + e))
// }

function saveRawObj(o) {
  writeFileSync('rawObj.log', JSON.stringify(o, null, '  ') + '\n\n\n', { flag: 'a' })
}
