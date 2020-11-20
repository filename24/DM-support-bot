const {MessageEmbed} = require('discord.js')
const {discord} = require('discord.js')
const settings = require('./config.json')
const Hook = new WebhookClient(settings.webhook.id, settings.webhook.token)
const server = client.guilds.cache.get(settings.serverId)
const ch = server.channels.cache.get(settings.channelId)

exports.run = async (client, message, args, prefix) => {
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

exports.config = {
  name: "핑",
  aliases: ["ping", "vld", "ㅔㅑㅜㅎ"],
  category: ["정보"],
  des: ["핑을 측정합니다."],
  use: ["#핑"]
};