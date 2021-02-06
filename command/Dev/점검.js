const Discord = require("discord.js")
const reload = require("self-reload-json")
const User = new reload("./user-data.json")
const settings = require('../../config.json')

exports.run = async (client, msg, args, prefix) => {
    let noperm = new Discord.MessageEmbed()
        .setDescription("❎  당신은 Dev 권한이 없습니다.")
        .setColor("RED")
    if (!client.devs.includes(msg.author.id)) 
    return msg.reply(noperm);
      if (!User["status"]) {
        User["status"] = {
                jomgom : false
            }
        User.save()
      }
            if (User["status"].jomgom === true) {
                let question = new Discord.MessageEmbed()
                    .setDescription("정말로 점검 종료 하시겠습니까?")
                    .setColor("7289DA")
                msg.reply(question).then(async message => {
                    await message.react("✅")
                    await message.react("❎")

                    // 필터 생성
                    let filterYes = (reaction, user) => reaction.emoji.name === '✅' && user.id == msg.author.id

                    // 콜랙터 생성
                    let collectorYes = message.createReactionCollector(filterYes, { max: 1, time: 60000 })

                    // 콜랙터 이벤트 생성
                    collectorYes.on('collect', () => {
                            client.user.setStatus("idle")
                            client.user.setActivity(settings.msg, { type: 'WATCHING' })
                            message.delete()
                            let success = new Discord.MessageEmbed()
                                .setDescription("성공적으로 점검 종료 하였습니다.")
                                .setColor("7289DA")
                            msg.reply(success)

                            User["status"].jomgom = false
                            User.save()
                        })
                        // 콜랙터 이벤트 생성
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
                    collectorNo.on('collect', () => {
                        message.delete()
                        let cancel = new Discord.MessageEmbed()
                            .setDescription("점검 종료를 취소하였습니다.")
                            .setColor("RED")
                        msg.reply(cancel)
                    })
                })

            } else if (User["status"].jomgom === false) {
                let question = new Discord.MessageEmbed()
                    .setDescription("정말로 점검 시작 하시겠습니까?")
                    .setColor("7289DA")
                msg.reply(question).then(async message => {
                    await message.react("✅")
                    await message.react("❎")

                    // 필터 생성
                    let filterYes = (reaction, user) => reaction.emoji.name === '✅' && user.id == msg.author.id

                    // 콜랙터 생성
                    let collectorYes = message.createReactionCollector(filterYes, { max: 1, time: 60000 })

                    // 콜랙터 이벤트 생성
                    collectorYes.on('collect', () => {
                        client.user.setStatus("dnd")
                        client.user.setActivity("점검 중..", { type: 'WATCHING' })
                        message.delete()
                        let success = new Discord.MessageEmbed()
                            .setDescription("성공적으로 점검 시작 하였습니다.")
                            .setColor("7289DA")
                        msg.reply(success)

                        User["status"].jomgom = true
                        User.save()

                    })

                    // 콜랙터 이벤트 생성
                    collectorYes.on('end', (_, reason) => { // 이벤트가 종료할 경우
                        if (reason === "time") { // 종료 사유가 time일 경우
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
                            .setDescription("점검 시작을 취소하였습니다.")
                            .setColor("RED")
                        msg.reply(cancel)
                    })
                })
            }
}

exports.config = {
  name: "점검",
  aliases: ["wjarja"],
  category: ["Dev"],
  des: ["개발자의 권한으로 점검합니다."],
  use: ["//점검"]
};