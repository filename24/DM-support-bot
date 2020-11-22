const Discord = require("discord.js");
exports.run = async (client, msg, args, prefix) => {
  if (!client.devs.includes(msg.author.id))
    return msg.reply("이 명령어는 Dev 권한이 필요합니다"); // bot.js에서 client.devs를 저장한 것을 불러와 포함하지 않으면 해당 메세지로 답변해줍시다.
  const coode = args.join(" ");
  const module = 'const Discord = require("discord.js")';
  if (!coode) return msg.reply("실행할 코드를 입력해주세요.");
  new Promise(res => res(eval(coode)))
    .then(code => {
      if (typeof code !== "string")
        code = require("util").inspect(code, { depth: 0 });
      /**
       *  util.inspect에 대해 자세히 알고 싶다면 아래의 링크를 클릭해주세요.
       * https://nodejs.org/api/util.html#util_util_inspect_object_options
       * */
      let evaled = new Discord.MessageEmbed()
        .setTitle("✅  Code Execution")
        .setColor("7289DA")
        .addField(
          "📥 **Input**",
          `\`\`\`js\n${module}\n\n${coode}\`\`\``,
          false
        )
        .addField("📤 **Output**", `\`\`\`js\n${code}\`\`\``, false);
      msg.reply(evaled);
    })
    .catch(e => {
      let evaled = new Discord.MessageEmbed()
        .setTitle("❎  Code Execution")
        .setColor("RED")
        .setDescription(`\`\`\`js\n${e}\`\`\``);
      msg.reply(evaled);
    });
};

exports.config = {
  name: "코드",
  aliases: ["eval"],
  category: ["Dev"],
  des: ["코드 실행합니다."],
  use: ["#코드 <코드>"]
};
