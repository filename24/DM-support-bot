const Discord = require("discord.js");
exports.run = async (client, msg, args, prefix) => {
  if (!args[0]) {
    const categorys = client.category; // bot.js에 있는 client.category 를 categorys로 선언하였습니다.
    let Commands = new Discord.MessageEmbed()
      .setAuthor(
        client.user.username + " 봇 명령어",
        client.user.displayAvatarURL()
      )
      .setColor("7289DA")
      .setFooter(
        "#도움말 <명령어> 를 하여 더 자세히 알아보세요."
      );
    for (const category of categorys) {
      Commands.addField(
        category,
        `> **\`${client.commands
          .filter(el => el.config.category == category)
          .keyArray()
          .join("`, `")}\`**`
      );
    }
    msg.reply(Commands);
  } else {
    if (client.commands.get(args[0])) {
      var command = client.commands.get(args[0]); // command 는 client.commands.get(args[0])로 선언해줍시다.
    } else if (client.aliases.get(args[0])) {
      // 만약에 client.aliases 안에 args[0] 라는게 있다면
      let aliases = client.aliases.get(args[0]); // aliases 를 client.aliases.get(args[0])로 선언해주고 (왜냐하면 저기서 aliases를 불러오면 command 이름이 나오기 때문입니다.)
      var command = client.commands.get(aliases); // commands는 client.commands.get(aliases)으로 선언해줍시다.
    } else return msg.reply(`${args[0]} 요청한 명령어 찾지 못했습니다`);

    let config = command.config;
    let name = config.name;
    let aliases = config.aliases;
    let category = config.category;
    let description = config.des;
    let use = config.use;

    let Command = new Discord.MessageEmbed()
      .setTitle(`${name} 명령어`)
      .setColor("7289DA")
      .setDescription(`\`\`\`fix\n사용법: ${use}\`\`\``)
      .addField("명령어 설명", `**${description}**`, false)
      .addField("카테고리", `**${category}**`, true)
    msg.reply(Command);
  }
};

exports.config = {
  name: "도움말",
  aliases: ["도움", "명령어"],
  category: ["정보"],
  des: ["봇에 대한 명령어 리스트들을 불러와드립니다."],
  use: ["#도움말 <명령어>"]
};
