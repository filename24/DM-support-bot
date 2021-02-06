/*
        Author(s) : Anhgerel, MadeGOD
        © 2020 Team. Pigbot. All rights reserved.
*/
const { inspect } = require('util')
const Discord = require("discord.js")
const client = new Discord.Client()
const fs = require("fs");
const settings = require('./config.json')
const { prefix } = require('./config.json')
const restart = require('./restart.json');
const dotenv = require('dotenv');

dotenv.config({
    path: __dirname + '.env'
});

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.devs = settings.dev || []
client.category = ['Dev', '관리', '정보']
client.hook = settings.webhook || []

client.on("ready", function() {
  client.user.setStatus('idle');
  client.user.setActivity(settings.msg, { type: 'WATCHING' })
    if (restart.bool == true) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'yes')}  재시작이 완료되었어요.`)
            .setColor(0x00ffff)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setFooter(client.user.tag, client.user.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
        console.log(`[System] Restarted`)
        client.channels.cache.get(restart.channel).bulkDelete(1);
        client.channels.cache.get(restart.channel).send(embed);
        restart.bool = false;
        restart.channel = '0';
        restart.message = '0';
        fs.writeFile('./restart.json', JSON.stringify(restart), function (err) {
            if (err) console.log(err);
        });
    if (User["status"].jomgom === true) {
        client.user.setStatus("dnd")
        client.user.setActivity("점검 중..", { type: 'WATCHING' })
    }
    console.log(`[System] Logged in as ${client.user.tag}!`)
    }
})

/*
        DM Suppot
*/
const reload = require("self-reload-json")
const User = new reload("./user-data.json")

client.on('message', async msg => {
  if (msg.author.bot) return
  const server = client.guilds.cache.get(settings.serverId)
  const ch = server.channels.cache.get(settings.channelId)

  if (msg.content.startsWith(prefix)) return;
      if (msg.channel.type == "dm") {
      const Hook = new Discord.WebhookClient(settings.webhook.id, settings.webhook.token)
      if (!User[msg.author.id]) {
        User[msg.author.id] = {
                content : true
            }
        User.save()
      }
      console.log(`[Log] Username : ${msg.author.tag}(${msg.author.id})\n[Log] Message :${msg.content}\n${msg.createdAt}`)
      msg.react("✅") 
      const webhoom = new Discord.MessageEmbed()
        .setTitle(`문의자 : **${msg.author.tag}** (${msg.author.id})`)
        .setDescription(`\`${settings.prefix}답변 ${msg.author.id} [내용]\``)
        .setColor("BLUE")
        .setFooter("보낸 일")
        .setTimestamp()
        .addField("메세지 내용", `${msg.content}`)
      Hook.send(webhoom)
          .catch((e)=>{
        Hook.send("에러가 발생\n"+e)
          })
      if (User[msg.author.id].content === false) {
      User[msg.author.id].content = true
      let welcome = new Discord.MessageEmbed()
        .setTitle(`안녕하세요 이용자님`)
        .setDescription(`모든 DM 내용은 관리자에게 전달됩니다. \n바르고 고운말을 사용하여, 관리자를 존중해주세요.`)
        .setColor("BLUE")
        .setFooter("데이터 수정 완료!")
        .setTimestamp()
      msg.channel.send(welcome)
          .catch((e)=>{
        Hook.send("에러가 발생\n"+e)
          })
        }
    User.save()
    }
})


/*
        독도 시스템
*/

const Dokdo = require('dokdo')

const DokdoHandler = new Dokdo(client, { aliases: ['dokdo', 'dok'], prefix: '//' }) // Using Bot Application ownerID as default for owner option.

client.on('message', async message => {
  if (message.content === 'ping') return message.channel.send('Pong') // handle commands first
  DokdoHandler.run(message) // try !dokdo
})

/*
        Slash Command For Intert
*/
client.on('message',(msg)=>{
    const text = msg.content;
    if(text.startsWith('//slash')){
        registerSlashCommands(msg.guild);
        msg.reply('Slash command register successful')
    }
});

client.on('raw',(evt)=>{
if(evt.t !== 'INTERACTION_CREATE') return;
const {d: data} = evt;

if(data.type !== 2) return;
const CommandData = data.data;

    if(CommandData.name === 'hello'){
        let TargetUser;
        if(CommandData.options) TargetUser = CommandData.options.find(element => element.name == '멘션');
        const channel = client.channels.cache.get(data.channel_id);

        if(TargetUser){
            const user = client.users.cache.get(TargetUser.value);
            callback(data,`${user}님 안녕하세요!`);

        }else{
            callback(data,`안녕하세요!`);
        }
    }
    if(CommandData.name === 'hey'){
        let TargetUser;
        if(CommandData.options) TargetUser = CommandData.options.find(element => element.name == '멘션');
        const channel = client.channels.cache.get(data.channel_id);

        if(TargetUser){
            const user = client.users.cache.get(TargetUser.value);
            callback(data,`${user}님 일어나세요!`);

        }else{
            callback(data,`일어났군요!`);
        }
    }
})
function registerSlashCommands(guild){
    const data = {}
    data.name = "hey"
    data.description = "일어나세요"
    data.options = new Array();

    const option = {};
    option.name = "멘션"
    option.description = "잠에서 깨야죠 ㅎㅎ"
    /*
     * type list:
     * 1 = SubCommand
     * 2 = SubCommandGroup
     * 3 = String
     * 4 = Integer
     * 5 = Boolean
     * 6 = User
     * 7 = Channel
     * 8 = Role
    */
    option.type = 6 // 6 = User
    option.required = false

    data.options.push(option);

    client.api.applications(client.user.id).guilds(guild.id).commands().post({data});
}
function callback(eventdata,message){
   const data = {
        "type": 4,
        "data": {
            "tts": false,
            "content": message,
            "embeds": [],
            "allowed_mentions": []
        }
    }
    client.api.interactions(eventdata.id)[eventdata.token].callback().post({data});
}
function registerSlashCommands(guild){
    const data = {}
    data.name = "hey"
    data.description = "이러날 사람을 지목해야죠"
    data.options = new Array();

    const option = {};
    option.name = "멘션"
    option.description = "꺠어날 준비 되었나요?"
    /*
     * type list:
     * 1 = SubCommand
     * 2 = SubCommandGroup
     * 3 = String
     * 4 = Integer
     * 5 = Boolean
     * 6 = User
     * 7 = Channel
     * 8 = Role
    */
    option.type = 6 // 6 = User
    option.required = false

    data.options.push(option);

    client.api.applications(client.user.id).guilds(guild.id).commands().post({data});
}
function callback(eventdata,message){
   const data = {
        "type": 4,
        "data": {
            "tts": true,
            "content": message,
            "embeds": [],
            "allowed_mentions": []
        }
    }
    client.api.interactions(eventdata.id)[eventdata.token].callback().post({data});
}

/*
           멤버 입장 로그
*/
/*const channelI = '719800187404681257' // welcome channel
const targetChannelId = '738526472377073674' // rules and info

client.on('guildMemberAdd', (member) => {
const channel = member.guild.channels.cache.get(channelI)
channel.send(new Discord.MessageEmbed()
                .setTitle('멤버 입장')
                .setColor(0x00ffff)
                .setDescription(`${member.user}님이 ${member.guild.name}에 오셨어요. ${member.guild.channels.cache.get(targetChannelId).toString()} 을 확인해 주세요`)
                .setThumbnail(member.user.displayAvatarURL({
                    dynamic: true,
                    type: 'jpg',
                    size: 2048
                }))
                .setFooter(member.user.tag, member.user.displayAvatarURL({
                    dynamic: true,
                    type: 'jpg',
                    size: 2048
                }))
                .setTimestamp())
})

client.on('guildMemberRemove', (member) => {
channel.send(new Discord.MessageEmbed()
                .setTitle('멤버 퇴장')
                .setColor(0xffff00)
                .setDescription(`${member.user.tag}님이 ${member.guild.name}에서 나갔어요.`)
                .setThumbnail(member.user.displayAvatarURL({
                    dynamic: true,
                    type: 'jpg',
                    size: 2048
                }))
                .setFooter(member.user.tag, member.user.displayAvatarURL({
                    dynamic: true,
                    type: 'jpg',
                    size: 2048
                }))
                .setTimestamp())
})
*/
/*
        명령어 핸들링 (For command Folder)
*/
function runCommand(command, msg, args, prefix, message) {
    if (msg.channel.type == "dm") return
    if (client.commands.get(command) || client.aliases.get(command)) {
        const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
        if (cmd) cmd.run(client, msg, args, prefix);
        return
    }
}
client.on("message", async msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    let args = msg.content.slice(prefix.length).trim().split(/ +/g)
    let command = args.shift().toLowerCase()
    try {
        runCommand(command, msg, args, prefix)
    } catch (err) {
        const embed = new Discord.MessageEmbed()
            .setTitle('❌에러...')
            .setColor(0xff0000)
            .addField('에러 내용', err)
            .addField('에러 발생 메세지 내용', msg.content)
            .addField('에러 발생 메세지 작성자', `${msg.author.tag}(${msg.author.id})`)
            .setFooter(msg.author.tag, msg.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        msg.channel.send(embed);
    }
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
client.login(process.env.TOKEN || settings.token)
