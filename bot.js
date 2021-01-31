/*
        © 2021 Pigbot
        Using for Discord.js, fs, Child Process

*/
const { inspect } = require('util')
const Discord = require("discord.js")
const client = new Discord.Client()
const fs = require("fs");
const settings = require('./config.json')
const { prefix } = require('./config.json')
const restart = require('./restart.json');
const dotenv = require('dotenv');
const ops = require('./config.json');

dotenv.config({
    path: __dirname + '.env'
});

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.devs = settings.dev || []
client.category = ['Dev', '관리', '정보']
client.hook = settings.webhook || []

client.on("ready", function() {
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
        console.log(`[System] Restarted`)
        client.channels.cache.get(restart.channel).bulkDelete(1);
        client.channels.cache.get(restart.channel).send(embed);
        restart.bool = false;
        restart.channel = '0';
        restart.message = '0';
        fs.writeFile('./restart.json', JSON.stringify(restart), function (err) {
            if (err) console.log(err);
        });
    console.log(`[System] Logged in as ${client.user.tag}!`)
}
})
/*
    OMG This is 욕!
*/
const words = require("./config.json")
client.on('message', message => {
    if (message.author.bot) return

    let i;
    let length = words.badwords.length;
    for(i=0;i<=length;i++){
        if(message.content.includes(words.badwords[i])){
            message.delete()
                .then(
                    message.channel.send(`${message.author}(이)가 "${message.content}"라고 했음.`)
                )
            break;
        }
    }
})
/*
        DM Suppot
*/


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

/*
        Log
*/
client.on('message', async function (message) {
     const server = client.guilds.cache.get(settings.serverId)
     const log = server.channels.cache.get(settings.log)
    
      if (message.author.bot) return;
      log.send(new Discord.MessageEmbed()
                .setTitle('메세지 로그')
                .setColor(0x00ffff)
                .addField("이름", `${message.author.tag} <@${message.author.id}>`)
                .addField("채널", `<#${message.channel.id}> ID : ${message.channel.id}`)
                .addField("메세지 내용", `${message.content}`)
                .setFooter("Log System")
                .setTimestamp()) 

})
client.on('messageUpdate', async (old, message) => {
    if (!message.author || message.author.bot) return;
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle('메세지 수정됨')
        .setColor('RANDOM')
        .addField('새 메세지', message.content ? (message.content.length > 1024 ? `${message.content.substr(0, 1021)}...` : message.content) : '내용 없음')
        .addField('기존 메세지', old.content ? (old.content.length > 1024 ? `${old.content.substr(0, 1021)}...` : old.content) : '내용 없음')
        .addField('메세지 링크', message.url)
        .addField('유저', `${message.author.toString()}(${message.author.id})`)
        .addField('채널', `${message.channel.toString()}(${message.channel.id})`)
        .setFooter(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
    });
    if (message.member.roles.cache.has(ops.adminRole)) return;
    if (ops.invites.some(x => message.content.includes(x)) && !ops.inviteWLChannels.includes(message.channel.id)) {
        await message.delete();
        message.author.send('초대 링크는 보낼 수 없어요.');
    }
});
client.on('messageDelete', message => {
    if (!message.author || message.author.bot) return;
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle('메세지 삭제됨')
        .setColor('RANDOM')
        .addField('메세지 내용', message.content ? (message.content.length > 1024 ? `${message.content.substr(0, 1021)}...` : message.content) : '내용 없음')
        .addField('메세지 id', message.id)
        .addField('유저', `${message.author}(${message.author.id})`)
        .addField('채널', `${message.channel}(${message.channel.id})`)
        .setFooter(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('messageDeleteBulk', async messages => {
    let al = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'MESSAGE_BULK_DELETE'
    });
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`메세지 ${messages.size}개 삭제됨`)
        .setColor('RANDOM')
        .addField('채널', `${messages.first().channel}(${messages.first().channel.id})`)
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('channelCreate', async channel => {
    if (channel.type == 'dm') return;
    let al = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'CHANNEL_CREATE'
    });
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`채널 생성됨`)
        .setColor('RANDOM')
        .addField('채널', `${channel}(${channel.id})`)
        .addField('채널 타입', ops.channels[channel.type])
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('channelDelete', async channel => {
    if (channel.type == 'dm') return;
    let al = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'CHANNEL_DELETE'
    });
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`채널 삭제됨`)
        .setColor('RANDOM')
        .addField('채널', `${channel.name}(${channel.id})`)
        .addField('채널 타입', ops.channels[channel.type])
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('guildBanAdd', async (guild, user) => {
    let al = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'MEMBER_BAN_ADD'
    });
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`멤버 차단됨`)
        .setColor('RANDOM')
        .addField('차단된 유저', `${user.tag || '알 수 없는 유저'}(${user.id})`)
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('guildBanRemove', async (guild, user) => {
    let al = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'MEMBER_BAN_REMOVE'
    });
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`멤버 차단 해제됨`)
        .setColor('RANDOM')
        .addField('차단 해제된 유저', `${user.tag || '알 수 없는 유저'}(${user.id})`)
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('channelUpdate', async (old, _new) => {
    let al = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'CHANNEL_UPDATE'
    });
    if (_new.type == 'dm') return;
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`채널 설정 변경됨`)
        .setColor('RANDOM')
        .addField('채널', `${_new}(${_new.id})`)
        .addFields(channelChanges(old, _new))
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('roleCreate', async role => {
    let al = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'ROLE_CREATE'
    });
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`역할 생성됨`)
        .setColor('RANDOM')
        .addField('역할', `${role}(${role.id})`)
        .addField('역할 색', role.hexColor)
        .addField('역할 호이스팅 여부', role.hoist ? '✅' : '❌')
        .addField('역할 멘션 가능 여부', role.mentionable ? '✅' : '❌')
        .addField('권한', role.permissions.toArray().map(x => ops.rolePerms[x]).join('\n'))
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('roleUpdate', async (old, _new) => {
    let al = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'ROLE_UPDATE'
    });
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`역할 수정됨`)
        .setColor('RANDOM')
        .addField('역할', `${_new}(${_new.id})`)
        .addFields(roleChanges(old, _new))
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('roleDelete', async role => {
    let al = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'ROLE_DELETE'
    });
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`역할 삭제됨`)
        .setColor('RANDOM')
        .addField('역할', `${role.name}(${role.id})`)
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('guildUpdate', async (old, _new) => {
    let al = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'GUILD_UPDATE'
    });
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`서버 설정 변경됨`)
        .setColor('RANDOM')
        .addFields(guildChanges(old, _new))
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('guildMemberRemove', async member => {
    let al = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'MEMBER_KICK'
    });
    if (!al || !al.entries || !al.entries.first() || !al.entries.first() || !al.entries.first().target || al.entries.first().target.id != member.user.id) return;
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`멤버 추방됨`)
        .setColor('RANDOM')
        .addField('추방된 유저', `${member.user.tag}(${member.user.id})`)
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
client.on('guildMemberUpdate', async (old, _new) => {
    let al;
    let al1 = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'MEMBER_UPDATE'
    });
    let al2 = await client.guilds.cache.get(ops.guildId).fetchAuditLogs({
        type: 'MEMBER_ROLE_UPDATE'
    });
    if (al1.entries.first().createdAt > al2.entries.first().createdAt) {
        al = al1;
    } else {
        al = al2;
    }
    client.channels.cache.get(ops.logChannel).send({
        embed: new Discord.MessageEmbed()
        .setTitle(`멤버 설정 변경됨`)
        .setColor('RANDOM')
        .addField('멤버', `${_new.user}(${_new.id})`)
        .addFields(memberChanges(old, _new))
        .setFooter(al.entries.first().executor.tag, al.entries.first().executor.displayAvatarURL())
        .setTimestamp()
    });
});
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

/*
           멤버 입장 로그
*/
const channelI = '719800187404681257' // welcome channel
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

/*
        명령어 핸들링 (For command Folder)
*/
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
    } catch (err) {
        const embed = new Discord.MessageEmbed()
            .setTitle('❌에러...')
            .setColor(0xff0000)
            .addField('에러 내용', err)
            .addField('에러 발생 메세지 내용', message.content)
            .addField('에러 발생 메세지 작성자', `${message.author.tag}(${message.author.id})`)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        message.channel.send(embed);
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
