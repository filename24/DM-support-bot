const { inspect } = require('util')
const Discord = require('discord.js')  //디스코드
const client = new Discord.Client()
const fs = require("fs");

const settings = require('./config.json')

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.devs = settings.dev || []
client.category = ['Dev', '관리', '정보']

client.on("ready", function() {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity(settings.msg, { type: 'WATCHING' })
})


fs.readdirSync("./command/").forEach(dir => {
    const Filter = fs.readdirSync(`./command/${dir}`).filter(f => f.endsWith(".js"));
    Filter.forEach(file => {
        const cmd = require(`./command/${dir}/${file}`);
        client.commands.set(cmd.config.name, cmd)
        for (let alias of cmd.config.aliases) {
            client.aliases.set(alias, cmd.config.name)
        }
    })
})


function runCommand(command, msg, args, prefix) {
    if (client.commands.get(command) || client.aliases.get(command)) {
        const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
        if (cmd) cmd.run(client, msg, args, prefix);
        return
    }
}
client.on("message", async msg => {
    const {prefix} = require("./config.json")
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    let args = msg.content.slice(prefix.length).trim().split(/ +/g)
    let command = args.shift().toLowerCase()
    try {
        runCommand(command, msg, args, prefix)
    } catch (e) {
        console.error(e)
    }

})

// https://discord.com/api/webhooks/778141467935637534/Zm4kdEomynB8CE19RHXnGETCqKJ_6wxYfHGfBFURBGKWArPnb6NVC5c6lKik5YkvqIsY
client.on('message', async msg => {
  if (msg.author.bot) return

  const Hook = new WebhookClient(settings.webhook.id, settings.webhook.token)

  const server = client.guilds.cache.get(settings.serverId)
  const ch = server.channels.cache.get(settings.channelId)

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
