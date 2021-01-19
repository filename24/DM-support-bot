const { exec } = require('child_process')
const Discord = require('discord.js')
const settings = require('../../config.json')



exports.run = async (client, msg, args, prefix) => {
    const Hook = new Discord.WebhookClient(settings.webhook.id, settings.webhook.token)
     const m = await msg.channel.send("<a:loading:799947339019321354> 불러오는 중..")
        if (!args.join(" ")) return m.edit("내용을 써 주세요!");
        require('child_process').exec(args.join(" "), (err, out) => {
         
            if (out) return m.edit(`\`>_\`exec | 정상적 실행됨\`\`\`cmd\n${out}\`\`\``).catch((err)=>{
                msg.channel.send(`너무 많아, 불러오지 못했습니다\`\`\`js\n${err}\`\`\``)
            })
            if (err) return m.edit(`\`>_\`exec | 비정상적 실행됨\`\`\`cmd\n${err}\`\`\``);
        
        })
}

exports.config = {
  name: "실행",
  aliases: ["cmd", "exec", "콘솔"],
  category: ["Dev"],
  des: ["콘솔 창을 실행합니다."],
  use: ["#실행 <할말>"]
};

