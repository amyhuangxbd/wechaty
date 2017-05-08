/**
 *
 * Wechaty - Wechat for Bot
 *
 * Connecting ChatBots
 * https://github.com/wechaty/wechaty
 *
 */

/* tslint:disable:variable-name */
const QrcodeTerminal  = require('qrcode-terminal')
const finis           = require('finis')

import {
  Config,
  Wechaty,
  log,
  MediaMessage,
} from '../'

const welcome = `
| __        __        _           _
| \\ \\      / /__  ___| |__   __ _| |_ _   _
|  \\ \\ /\\ / / _ \\/ __| '_ \\ / _\` | __| | | |
|   \\ V  V /  __/ (__| | | | (_| | |_| |_| |
|    \\_/\\_/ \\___|\\___|_| |_|\\__,_|\\__|\\__, |
|                                     |___/

=============== Powered by Wechaty ===============
-------- https://github.com/zixia/wechaty --------

I'm a bot, my super power is talk in Wechat.

If you send me a 'ding', I will reply you a 'dong'!
__________________________________________________

Hope you like it, and you are very welcome to
upgrade me for more super powers!

Please wait... I'm trying to login in...

`

console.log(welcome)
const bot = Wechaty.instance({ profile: Config.DEFAULT_PROFILE })

bot
.on('logout'	, user => log.info('Bot', `${user.name()} logouted`))
.on('login'	  , user => {
  log.info('Bot', `${user.name()} logined`)
  bot.say('Wechaty login')
})
.on('error'   , e => {
  log.info('Bot', 'error: %s', e)
  bot.say('Wechaty error: ' + e.message)
})
.on('scan', (url, code) => {
  if (!/201|200/.test(String(code))) {
    const loginUrl = url.replace(/\/qrcode\//, '/l/')
    QrcodeTerminal.generate(loginUrl)
  }
  console.log(`${url}\n[${code}] Scan QR Code in above url to login: `)
})
.on('message', m => {
  try {
    const room = m.room()
    console.log((room ? '[' + room.topic() + ']' : '')
                + '<' + m.from().name() + '>'
                + ':' + m.toStringDigest(),
    )

    // if (/^(ding|ping|bing|code)$/i.test(m.content()) && !m.self()) {
    //   m.say('dong')
    //   log.info('Bot', 'REPLY: dong')

    //   m.say(`Join Wechaty Developers' Community

    //         Wechaty is used in many ChatBot projects by hundreds of developers.
    //         If you want to talk with other developers, just scan the following QR Code in WeChat with secret code: wechaty,
    //         you can join our Wechaty Developers' Home at once.
    //     `.replace(/  /, ' '),
    //   )
    //   m.say(new MediaMessage(__dirname + '/../image/BotQrcode.png'))
    //   m.say('Scan now, because other Wechaty developers want to talk with you too! (secret code: wechaty)')
    //   log.info('Bot', 'REPLY: Image')
    // }

    if (/^(ding|ping|bing|code)$/i.test(m.content()) && !m.self()) {
      m.say('dong')
      log.info('Bot', 'REPLY: dong')

      m.say(`Join Wechaty Developers' Community

            Wechaty is used in many ChatBot projects by hundreds of developers.
            If you want to talk with other developers, just scan the following QR Code in WeChat with secret code: wechaty,
            you can join our Wechaty Developers' Home at once.
        `.replace(/  /, ' '),
      )
      m.say(new MediaMessage('http://file.ynet.com/2/1405/29/9021049-500.jpg'))
      m.say("&lt;msg&gt;<br/>    &lt;appmsg appid=\"\" sdkver=\"0\"&gt;<br/>        &lt;title&gt;&lt;![CDATA[女朋友掉水里，各类程序猿怎么救？]]&gt;&lt;/title&gt;<br/>        &lt;des&gt;&lt;![CDATA[如果程序员的女朋友落水了，他们会怎么救呢？不会像在校的计算机学院的学生那样“找跟网线，把女朋友拉上来”吧。]]&gt;&lt;/des&gt;<br/>        &lt;action&gt;&lt;/action&gt;<br/>        &lt;type&gt;5&lt;/type&gt;<br/>        &lt;showtype&gt;1&lt;/showtype&gt;<br/>        &lt;content&gt;&lt;![CDATA[]]&gt;&lt;/content&gt;<br/>        &lt;contentattr&gt;0&lt;/contentattr&gt;<br/>        &lt;url&gt;&lt;![CDATA[http://mp.weixin.qq.com/s?__biz=MzA3NTUzNjk1OA==&amp;mid=2651560873&amp;idx=1&amp;sn=825cc1bdc0bbb9b2763aad4471d5217b&amp;chksm=849034f8b3e7bdee17eb57a285f8efd122c4379a71ee9c60b1f96136f1718fd19440438ee5f6&amp;scene=0#rd]]&gt;&lt;/url&gt;<br/>        &lt;lowurl&gt;&lt;![CDATA[]]&gt;&lt;/lowurl&gt;<br/>        &lt;appattach&gt;<br/>            &lt;totallen&gt;0&lt;/totallen&gt;<br/>            &lt;attachid&gt;&lt;/attachid&gt;<br/>            &lt;fileext&gt;&lt;/fileext&gt;<br/>        &lt;/appattach&gt;<br/>        &lt;extinfo&gt;&lt;/extinfo&gt;<br/>        &lt;mmreader&gt;<br/>            &lt;category type=\"20\" count=\"1\"&gt;<br/>                &lt;name&gt;&lt;![CDATA[Web开发]]&gt;&lt;/name&gt;<br/>                &lt;topnew&gt;<br/>                    &lt;cover&gt;&lt;![CDATA[http://mmbiz.qpic.cn/mmbiz_jpg/oGp3ImQqDoYIQ513xdvstnE8rXHeNicibxt9ph2UOHM7cztttYsHaYtjDlmsWtyscbUhqqE1hBAHV0HK54NBFiacw/640?wxtype=jpeg&amp;wxfrom=0]]&gt;&lt;/cover&gt;<br/>                    &lt;width&gt;0&lt;/width&gt;<br/>                    &lt;height&gt;0&lt;/height&gt;<br/>                    &lt;digest&gt;&lt;![CDATA[]]&gt;&lt;/digest&gt;<br/>                &lt;/topnew&gt;<br/>                <br/>                &lt;item&gt;<br/>                    &lt;itemshowtype&gt;0&lt;/itemshowtype&gt;<br/>                    &lt;title&gt;&lt;![CDATA[女朋友掉水里，各类程序猿怎么救？]]&gt;&lt;/title&gt;<br/>                    &lt;url&gt;&lt;![CDATA[http://mp.weixin.qq.com/s?__biz=MzA3NTUzNjk1OA==&amp;mid=2651560873&amp;idx=1&amp;sn=825cc1bdc0bbb9b2763aad4471d5217b&amp;chksm=849034f8b3e7bdee17eb57a285f8efd122c4379a71ee9c60b1f96136f1718fd19440438ee5f6&amp;scene=0#rd]]&gt;&lt;/url&gt;<br/>                    &lt;shorturl&gt;&lt;![CDATA[]]&gt;&lt;/shorturl&gt;<br/>                    &lt;longurl&gt;&lt;![CDATA[]]&gt;&lt;/longurl&gt;<br/>                    &lt;pub_time&gt;1493967051&lt;/pub_time&gt;<br/>                    &lt;cover&gt;&lt;![CDATA[http://mmbiz.qpic.cn/mmbiz_jpg/oGp3ImQqDoYIQ513xdvstnE8rXHeNicibxt9ph2UOHM7cztttYsHaYtjDlmsWtyscbUhqqE1hBAHV0HK54NBFiacw/640?wxtype=jpeg&amp;wxfrom=0]]&gt;&lt;/cover&gt;<br/>                    &lt;tweetid&gt;&lt;/tweetid&gt;<br/>                    &lt;digest&gt;&lt;![CDATA[如果程序员的女朋友落水了，他们会怎么救呢？不会像在校的计算机学院的学生那样“找跟网线，把女朋友拉上来”吧。]]&gt;&lt;/digest&gt;<br/>                    &lt;fileid&gt;504077213&lt;/fileid&gt;<br/>                    &lt;sources&gt;<br/>                        &lt;source&gt;<br/>                            &lt;name&gt;&lt;![CDATA[Web开发]]&gt;&lt;/name&gt;<br/>                        &lt;/source&gt;<br/>                    &lt;/sources&gt;<br/>                    &lt;styles&gt;&lt;/styles&gt;<br/>                    &lt;native_url&gt;&lt;/native_url&gt;<br/>                    &lt;del_flag&gt;0&lt;/del_flag&gt;<br/>                    &lt;contentattr&gt;0&lt;/contentattr&gt;<br/>                    &lt;play_length&gt;0&lt;/play_length&gt;<br/>                &lt;/item&gt;<br/>                <br/>            &lt;/category&gt;<br/>            &lt;publisher&gt;<br/>                &lt;username&gt;&lt;![CDATA[gh_681fbbe63774]]&gt;&lt;/username&gt;<br/>                &lt;nickname&gt;&lt;![CDATA[Web开发]]&gt;&lt;/nickname&gt;<br/>            &lt;/publisher&gt;<br/>            &lt;template_header&gt;&lt;/template_header&gt;<br/>            &lt;template_detail&gt;&lt;/template_detail&gt;<br/>            &lt;forbid_forward&gt;0&lt;/forbid_forward&gt;<br/>        &lt;/mmreader&gt;<br/>        &lt;thumburl&gt;&lt;![CDATA[http://mmbiz.qpic.cn/mmbiz_jpg/oGp3ImQqDoYIQ513xdvstnE8rXHeNicibxt9ph2UOHM7cztttYsHaYtjDlmsWtyscbUhqqE1hBAHV0HK54NBFiacw/640?wxtype=jpeg&amp;wxfrom=0]]&gt;&lt;/thumburl&gt;<br/>    &lt;/appmsg&gt;<br/>    &lt;fromusername&gt;&lt;![CDATA[gh_681fbbe63774]]&gt;&lt;/fromusername&gt;<br/>    &lt;appinfo&gt;<br/>        &lt;version&gt;&lt;/version&gt;<br/>        &lt;appname&gt;&lt;![CDATA[Web开发]]&gt;&lt;/appname&gt;<br/>        &lt;isforceupdate&gt;1&lt;/isforceupdate&gt;<br/>    &lt;/appinfo&gt;<br/>    <br/>    <br/>    <br/>    <br/>    <br/>    <br/>&lt;/msg&gt;")
      log.info('Bot', 'REPLY: Image')
    }
  } catch (e) {
    log.error('Bot', 'on(message) exception: %s' , e)
  }
})

bot.init()
.catch(e => {
  log.error('Bot', 'init() fail: %s', e)
  bot.quit()
  process.exit(-1)
})

finis((code, signal) => {
  const exitMsg = `Wechaty exit ${code} because of ${signal} `
  console.log(exitMsg)
  bot.say(exitMsg)
})
