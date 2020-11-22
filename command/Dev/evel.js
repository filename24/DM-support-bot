const {MessageEmbed} = require('discord.js')
const {discord} = require('discord.js')
const settings = require('../../config.json')


exports.run = async (client, msg, args, prefix) => {
if (!client.devs.includes(msg.author.id))
    return msg.reply("이 명령어는 Dev 권한이 필요합니다");

    const request = msg.content.split(' ').slice(1).join(' ')
    const result = new Promise((resolve, reject) => resolve(eval(request)))
    const Hook = new WebhookClient(settings.webhook.id, settings.webhook.token)
    return result.then(output => {
      if (typeof output !== 'string') output = inspect(output, { depth: 0 })
      if (output.includes(client.token)) output = output.replace(client.token, '토큰은 ㄴㄴ')
      if (output.length > 1990) {
        console.log(output)
        output = 'ㅓㅜㅑ 메세지가 1990 이상이라서 인식불가 입니다요'
      }

      return msg.channel.send(output, {code: 'JavaScript'})
    }).catch(error => {
      Hook.send("에러가 발생\n"+error)
      error = error.toString()

      if (error.includes(client.token)) error = error.replace(client.token, '토큰은 ㄴㄴ')

      return msg.channel.send(error, {code: 'JavaScript'})
    })
}

exports.config = {
  name: "코드",
  aliases: ["코드", "evel", "이블"],
  category: ["Dev"],
  des: ["코드를 실행합니다."],
  use: ["ㄲ 코드 <코드>"]
};