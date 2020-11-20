const { exec } = require('child_process')
const {MessageEmbed} = require('discord.js')
const {discord} = require('discord.js')
const settings = require('./config.json')
const Hook = new WebhookClient(settings.webhook.id, settings.webhook.token)

exports.run = async (client, message, args, prefix) => {
    const request = msg.content.split(' ').slice(1).join(' ')
    if (!client.devs.includes(message.author.id))
    return message.reply("이 명령어는 Dev 권한이 필요합니다");
    exec(request, (error, stdout, stderr) => {
      console.log('Attempting to exec handler: ' + request)
      if (error) {
        console.log('An error was printed: ' + error)
        error = error.toString()
        msg.channel.send(error, {code: 'bash'})
        return
      }

      if (stdout.includes(client.token)) stdout = stdout.replace(client.token, '토큰은 좀...')
      if (stdout.length > 1990) console.log('Attempted shell prompts: ' + stdout), stdout = 'Too long to be printed (content got console logged)'
      msg.channel.send(stdout, {code: 'bash'})
      if (stderr) {
        if (stderr.includes(client.token)) stdout = stderr.replace(client.token, '(accesstoken was hidden)')
        if (stderr.length > 1990) console.log('An error was printed: ' + stderr), stderr = 'Too long to be printed (content got console logged)'
        msg.channel.send(stderr, {code: 'bash'})
      }
    })
}

exports.config = {
  name: "실행",
  aliases: ["cmd", "exec", "실행"],
  category: ["Dev"],
  des: ["콘솔 창을 실행합니다."],
  use: ["#실행 <할말>"]
};

