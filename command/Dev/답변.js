const {MessageEmbed} = require('discord.js')
const Discord = require('discord.js')
const settings = require('../../config.json')



exports.run = async (client, msg, prefix) => {
const Hook = new Discord.WebhookClient(settings.webhook.id, settings.webhook.token)
const server = client.guilds.cache.get(settings.serverId)
const ch = server.channels.cache.get(settings.channelId)
    if (!message.member.hasPermission("VIEW_AUDIT_LOG")) {
        return message.reply("Missing Permissions!").then(m => m.delete(5000));
    }
    if (msg.channel.type === "dm") return

    const args = msg.content.split(' ').slice(1)
    if (client.devs.includes(msg.author.id)) {
      if (args.length < 2) {
        msg.reply('사용법: `#답변 (ID) [TEXT]`')
      } else {
        const content = args.slice(1).join(' ')
        const user = await client.users.fetch(args[0])
        console.log(' SENDED ')

        user.send(`《${msg.author.tag}》 : ` + content)
          .then(msg.reply('성공적으로 메세지를 DM으로 보냈습니다.'))
          .catch((e)=>{
Hook.send("에러가 발생\n"+e)
})
      }
    }
}

exports.config = {
  name: "답변",
  aliases: ["reply", "ekqqus", "ㄱ데ㅣㅛ"],
  category: ["Dev"],
  des: ["메세지를 DM으로 보냅니다."],
  use: ["#답변 <ID> <내용>"]
};
