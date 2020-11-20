const { inspect } = require('util')
const { exec } = require('child_process')
const { Client, WebhookClient, MessageEmbed } = require('discord.js')  //디스코드
const client = new Client()

const settings = require('./config.json')
client.devs = settings.dev || []

client.on("ready", function() {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity(settings.msg, { type: 'WATCHING' })
})
  
client.devs = settings.dev || []

// https://discord.com/api/webhooks/778141467935637534/Zm4kdEomynB8CE19RHXnGETCqKJ_6wxYfHGfBFURBGKWArPnb6NVC5c6lKik5YkvqIsY
client.on('message', async msg => {
  if (msg.author.bot) return

  const Hook = new WebhookClient(settings.webhook.id, settings.webhook.token)

  const server = client.guilds.cache.get(settings.serverId)
  const ch = server.channels.cache.get(settings.channelId)

  if(msg.content.startsWith('#핑')) {
    const ping = new MessageEmbed()
      .setTitle("봇상태")
      .setDescription("퐁!")
      .setColor("BLUE")
      .setFooter("확인 일")
      .setTimestamp()
      .addField("웹소켓 지연시간", `${client.ws.ping}ms`)
      .addField("봇 상태", `온라인`)

    msg.reply(ping)
  }

  if (msg.content.startsWith('#답변')) {
    if (msg.channel.type === "dm") return

    const args = msg.content.split(' ').slice(1)
    if (client.devs.includes(msg.author.id)) {
      if (args.length < 2) {
        msg.reply('사용법: `#답변 (ID) [TEXT]`\n만약 오타도 없는데 이문구가 뜬다고요?\n그럼 상대가 개인메세지를 혀용하지 않았다는 거에요.')
      } else {
        const content = args.slice(1).join(' ')
        const user = await client.users.fetch(args[0])
        console.log(' SENDED ')

        user.send(content)
          .then(msg.reply('성공적으로 메세지를 DM으로 보냈습니다.'))
          .catch((e)=>{
Hook.send("에러가 발생\n"+e)
})
      }
    }
  }

  if (msg.content.startsWith('#코드')) {
    if (!client.devs.includes(msg.author.id)) return

    const request = msg.content.split(' ').slice(1).join(' ')
    const result = new Promise((resolve, reject) => resolve(eval(request)))

    return result.then(output => {
      if (typeof output !== 'string') output = inspect(output, { depth: 0 })
      if (output.includes(client.token)) output = output.replace(client.token, '토큰은 ㄴㄴ')
      if (output.length > 1990) {
        console.log(output)
        output = 'ㅓㅜㅑ 메세지가 1990 이상이라서 인식불가 입니다요 (로그하고 있다 ㅅㄱ)'
      }

      return msg.channel.send(output, {code: 'JavaScript'})
    }).catch(error => {
      console.error(error)
      error = error.toString()

      if (error.includes(client.token)) error = error.replace(client.token, '토큰은 ㄴㄴ')

      return msg.channel.send(error, {code: 'JavaScript'})
    })
  }

  if (msg.content.startsWith('#cmd')) {
    if (!client.devs.includes(msg.author.id)) return

    const request = msg.content.split(' ').slice(1).join(' ')

    exec(request, (error, stdout, stderr) => {
      console.log('Attempting to exec handler: ' + request)
      if (error) {
        console.log('An error was printed: ' + error)
        error = error.toString()
        msg.channel.send(error, {code: 'bash'})
        return
      }

      if (stdout.includes(client.token)) stdout = stdout.replace(client.token, '(accesstoken was hidden)')
      if (stdout.length > 1990) console.log('Attempted shell prompts: ' + stdout), stdout = 'Too long to be printed (content got console logged)'
      msg.channel.send(stdout, {code: 'bash'})
      if (stderr) {
        if (stderr.includes(client.token)) stdout = stderr.replace(client.token, '(accesstoken was hidden)')
        if (stderr.length > 1990) console.log('An error was printed: ' + stderr), stderr = 'Too long to be printed (content got console logged)'
        msg.channel.send(stderr, {code: 'bash'})
      }
    })
  }

  if (msg.channel.type !== "dm") return
  console.log(`${msg.author.tag}(${msg.author.id})\n${msg.content}\n${msg.createdAt}`)
  msg.react("✅") 
  const webhoom = new MessageEmbed()
    .setTitle(`${msg.author.tag} (${msg.author.id}`)
    .setDescription(`\`#답변 ${msg.author.id} [내용]\`으로 답변을 보내세요.`)
    .setColor("BLUE")
    .setFooter("보낸 일")
    .setTimestamp()
    .addField("메세지 내용", `${msg.content}`)
  Hook.send(webhoom)
.catch((e)=>{
Hook.send("에러가 발생\n"+e)
})
})

client.login(process.env.TOKEN || settings.token)
