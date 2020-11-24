const {MessageEmbed} = require('discord.js')
const {discord} = require('discord.js')
const settings = require('../../config.json')


exports.run = async (client, message, args, prefix) => {
const Hook = new WebhookClient(settings.webhook.id, settings.webhook.token)
if (!client.devs.includes(message.author.id))
    return message.reply("이 명령어는 Dev 권한이 필요합니다"); // bot.js에서 client.devs를 저장한 것을 불러와 포함하지 않으면 해당 메세지로 답변해줍시다.


    if (!args.join(" ")) return message.channel.send("내용을 써 주세요!");

        message.channel.send(new MessageEmbed().setTitle(`공지사항`).setDescription(`\`\`\`\n${args.join(" ")}\n\`\`\``).setColor("BLUE")).then(async th => {
            await th.react("⭕");
            await th.react("❌");
            
            th.awaitReactions((reaction, user) => (reaction.emoji.name === "❌" || reaction.emoji.name === "⭕") && user.id === message.author.id, {
                max: 1
            }).then(collected => {
                if (collected.array()[0].emoji.name === "⭕") {
                    let result = '';
th.edit(new MessageEmbed().setTitle('📡공지가 전송되었습니다.').setColor('BLUE'))
                    client.guilds.cache.forEach(g => {
                        let gc;

                        g.channels.cache.forEach(c => {
                            if (c.name.includes("📜ㅣ공지사항")) gc = c.id;
                        
                        
                        });
                        if (!gc && (g.channels.cache.some(x => x.type == 'text' && x.permissionsFor(client.user).has(['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'])))) gc = g.channels.cache.filter(x => x.type == 'text' && x.permissionsFor(client.user).has(['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'])).random().id; 
                        const Ch = client.channels.cache.get(gc);
                        try {
                         
                            if (!Ch) return message.author.send(`${g.name}: 발신 실패 (채널 없음)\n`).then((m) => {
                              
                            })
                            if (!Ch.permissionsFor(g.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'])) return message.author.send(`${g.name}: 발신 실패 (메시지 발신 실패)\n`)
                            
                            Ch.send(new MessageEmbed().setTitle(`공지사항`).setThumbnail(client.user.displayAvatarURL()).setDescription(args.join(" ")).setColor("BLUE").setFooter(message.author.tag, message.author.displayAvatarURL()).setTimestamp())
                        } catch (e) {
                            message.author.send(`에러남.\n${e.message || e}`)
                        }
                    })
                } else {
                    th.edit(new MessageEmbed().setTitle("공지사항 발신 취소됨").setColor(0x00ff00))
                }
            })
        })
}

exports.config = {
  name: "공지",
  aliases: ["공지", "보내기", "공지사항"],
  category: ["Dev"],
  des: ["공지사항을 보냅니다 실행합니다."],
  use: ["#공지 <할말>"]
};
