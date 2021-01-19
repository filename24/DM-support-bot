const { inspect } = require('util')
const Discord = require("discord.js")
const client = new Discord.Client()
const fs = require("fs");
const settings = require('./config.json')
const { prefix } = require('./config.json')
const restart = require('./restart.json');

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.devs = settings.dev || []
client.category = ['Dev', '관리', '정보']
client.hook = settings.webhook || []

client.on("ready", function() {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity(settings.msg, { type: 'WATCHING' })
    if (restart.bool == true) {
        const embed = new Discord.MessageEmbed()
            .setTitle('재시작이 완료되었어요.')
            .setColor(0x00ffff)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setFooter(client.user.tag, client.user.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
        client.channels.cache.get(restart.channel).bulkDelete(1);
        client.channels.cache.get(restart.channel).send(embed);
        restart.bool = false;
        restart.channel = '0';
        restart.message = '0';
        fs.writeFile('./restart.json', JSON.stringify(restart), function (err) {
            if (err) console.log(err);
        });
}
})

client.on('message', async msg => {
  if (msg.author.bot) return
  const server = client.guilds.cache.get(settings.serverId)
  const ch = server.channels.cache.get(settings.channelId)
  
  if (msg.channel.type !== "dm") return
  const Hook = new Discord.WebhookClient(settings.webhook.id, settings.webhook.token)
  console.log(`${msg.author.tag}(${msg.author.id})\n${msg.content}\n${msg.createdAt}`)
  msg.react("✅") 
  const webhoom = new Discord.MessageEmbed()
    .setTitle(`문의자 : **${msg.author.tag}** (${msg.author.id})`)
    .setDescription(`\`${settings.prefix}답변 ${msg.author.id} [내용]\`으로 답변을 보내세요.`)
    .setColor("BLUE")
    .setFooter("보낸 일")
    .setTimestamp()
    .addField("메세지 내용", `${msg.content}`)
  Hook.send(webhoom)
      .catch((e)=>{
    Hook.send("에러가 발생\n"+e)
  })
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
})

function registerSlashCommands(guild){
    const data = {}
    data.name = "hello"
    data.description = "안녕하세요!"
    data.options = new Array();
    
    const option = {};
    option.name = "멘션"
    option.description = "격하게 환영해줄까요?"
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

client.on('guildMemberAdd', async function (member) {
    const welcome = member.guild.channels.cache.find("738526472377073674")
        if (member.guild.channels.cache.some(x => (x.name.includes('👋환영합니다') || x.name.includes('입장') || x.name.includes('퇴장')) && (!x.topic || !x.topic.includes('nogreeting')))) {
            welcome.send(new Discord.MessageEmbed()
                .setTitle('멤버 입장')
                .setColor(0x00ffff)
                .setDescription(`${member.user}님이 ${member.guild.name}에 오셨어요.\n<#763400400216260658>읽어주세요`)
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
                .setTimestamp()
        );
    }
})
client.on('guildMemberRemove', async function (member) {
        if (member.guild.channels.cache.some(x => (x.name.includes('👋환영합니다') || x.name.includes('입장') || x.name.includes('퇴장')) && (!x.topic || !x.topic.includes('nogreeting')))){
            welcome.send(new Discord.MessageEmbed()
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
                .setTimestamp()
        );
    }
})

function runCommand(command, msg, args, prefix) {
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
    } catch (e) {
       client.channels.cache.get("").send("에러가 발생했습니다:"+e)
      console.error(e)
    }

})

client.login(process.env.TOKEN || settings.token)
