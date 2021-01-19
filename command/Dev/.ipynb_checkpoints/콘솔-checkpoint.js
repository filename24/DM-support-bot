const { exec } = require('child_process')
const Discord = require('discord.js')
const settings = require('../../config.json')



exports.run = async (client, message, args, prefix) => {
    const Hook = new Discord.WebhookClient(settings.webhook.id, settings.webhook.token)
    const { exec } = require('child_process')

  
    const request = message.data.args
    if(!message.data.args) return message.reply(locale.error.usage(message.data.cmd))
    if (request.includes('client.token')&&request.includes('message')){
        return message.channel.send('토큰을 전송해도 될까요?')
    }
    exec(request, (error, stdout, stderr) => {
        console.log('Attempting to exec handler: ' + request)
        if (error) {
            console.log('An error was printed: ' + error)
            error = error.toString()
            message.channel.send(error, {code: 'bash'})
            return
        }
        if (stdout.includes(client.token)) stdout = stdout.replace(new RegExp(client.token, 'gi'), '(accesstoken was hidden)')
        message.channel.send(stdout.slice(0, 1990) + '\n...', {code: 'bash'}) 
        if (stderr) {
            if (stderr.includes(client.token)) stdout = stderr.replace(new RegExp(client.token, 'gi'), '(accesstoken was hidden)')
            message.channel.send(stderr.slice(0, 1990) + '\n...', {code: 'bash'})
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

