const Discord = require("discord.js")
const reload = require("self-reload-json")
const User = new reload("./user-data.json")

exports.run = async (client, msg, prefix) => {
     if (!msg.member.hasPermission("VIEW_AUDIT_LOG")) {
        return msg.reply("403 Missing Permissions!").then(m => m.delete(5000));
    }
    const args = msg.content.split(' ').slice(1)
    
    let emptyGuild = new Discord.MessageEmbed()
        .setDescription("❎  해당 유저를 찾지 못했거나 데이터가 없습니다.")
        .setFooter(`데이터가 없다면 해당유저가 문의를 한번도 안한거일수 있습니다`)
        .setColor("RED")

    if (!User[msg.author.id]) return msg.reply(emptyGuild)
    if (User[msg.author.id].content === false) {
        let noContent = new Discord.MessageEmbed()
            .setDescription(`<@${args[0]}>는 문의한 기록이 없습니다.`)
            .setColor("RED")
        msg.reply(noContent)
    }
    if (User[msg.author.id].content === true) {
        let question = new Discord.MessageEmbed()
            .setDescription(`정말로 이 해당 <@${args[0]}>유저 문의를 종료 하시겠습니까?`)
            .setColor("7289DA")
        msg.reply(question).then(async message => {
            await message.react("✅")
            await message.react("❎")

            // 필터 생성
            let filterYes = (reaction, user) => reaction.emoji.name === '✅' && user.id == msg.author.id

            // 콜랙터 생성
            let collectorYes = message.createReactionCollector(filterYes, { max: 1, time: 60000 })

            // 콜랙터 이벤트 생성
            collectorYes.on('collect', () => { // 반응을 할 경우
                    message.delete()
                    const user = client.users.cache.get(args[0])
                    user.send(`문의해 주셔서 감사해요! 관리진은 유저분의 질문이 잼있게 답변되었기를 바랍니다!\n서버 데이터를 정리하기 위해 문의가 종료되었습니다. **__문의 내역은 보관처리되었습니다__**.\n아직 문제가 해결되지 않았다면, 주저하지 마시고 다시 DM 주세요!`)
                    let success = new Discord.MessageEmbed()
                        .setDescription(`<@${args[0]}>의 문의가 종료되었습니다.`)
                        .setColor("7289DA")
                    msg.reply(success)

                    // content = false
                    User[msg.author.id].content = false

                    User.save()
                })
                            collectorYes.on('end', (_, reason) => { // 이벤트가 종료되었을 경우
                    if (reason === "time") { // 종료된 사유가 time일 경우
                        message.delete()
                        let timeover = new Discord.MessageEmbed()
                            .setDescription("시간이 초과가 되었으니 다시 시도해주세요.")
                            .setColor("RED")
                        msg.reply(timeover)
                    }
                })

                // 필터 생성
                let filterNo = (reaction, user) => reaction.emoji.name === '❎' && user.id === msg.author.id

                // 콜랙터 생성
                let collectorNo = message.createReactionCollector(filterNo, { max: 1, time: 60000 })

                // 콜랙터 이벤트 생성
                collectorNo.on('collect', () => { // 반응을 할 경우
                    message.delete()
                    let cancel = new Discord.MessageEmbed()
                        .setDescription(`<@${args[0]}>의 문의가 계속 진행됩니다.`)
                        .setColor("RED")
                    msg.reply(cancel)
                })
            })
    }
}
exports.config = {
  name: "문의종료",
  aliases: ["stop", "ㄴ새ㅔ", "ansdmlwhdfy"],
  category: ["Dev"],
  des: ["문의를 종료 합니다."],
  use: ["//문의종료 (ID)"]
};