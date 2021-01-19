const Discord = require('discord.js');
const fs = require('fs');

exports.run = async (client, message, args, prefix) => {
if (!client.devs.includes(message.author.id))
    return message.reply("이 명령어는 Dev 권한이 필요합니다");
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loading')} 재시작 중`)
            .setColor(0xffff00)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .addField('진행 상황', '환경 확인 중')
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        let m = await message.channel.send(embed);
        if (process.platform == 'linux' || client.shard) {
            const imbed = new Discord.MessageEmbed()
                .setTitle(`${client.emojis.cache.find(x => x.name == 'loading')} 재시작 중`)
                .setColor(0xffff00)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField('진행 상황', '재시작 파일 수정 중')
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(imbed);
            const restart = require('../../restart.json');
            restart.bool = true;
            restart.channel = message.channel.id;
            fs.writeFile('./restart.json', JSON.stringify(restart), function (err) {
                if (err) console.log(err);
                const ymbed = new Discord.MessageEmbed()
                    .setTitle(`${client.emojis.cache.find(x => x.name == 'loading')} 재시작 중`)
                    .setColor(0xffff00)
                    .setThumbnail(client.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .addField('진행 상황', '재시작 중')
                    .setFooter("만약 이문구가 계속 진행되면 오류가 난거에요.")
                    .setTimestamp()
                m.edit(ymbed).then(function () {
                    process.exit();
                });
            });
        } else {
            const imbed = new Discord.MessageEmbed()
                .setTitle(`${client.emojis.cache.find(x => x.name == 'loading')} 종료 중`)
                .setColor(0xffff00)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField('진행 상황', '종료 중')
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(imbed);
            const ymbed = new Discord.MessageEmbed()
                .setTitle('봇이 종료되었어요.')
                .setColor(0x00ffff)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .setFooter(client.user.tag, client.user.displayAvatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(ymbed).then(function () {
                console.clear().then(function () {
                    process.exit();
                });
            });
        }
}

exports.config = {
  name: "리붓",
  aliases: ["reboot", "restart"],
  category: ["Dev"],
  des: ["재시작 합니다."],
  use: ["//리붓"]
};