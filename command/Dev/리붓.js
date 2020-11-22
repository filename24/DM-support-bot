exports.run = async (client, message, args, prefix) => {
  if (!client.devs.includes(message.author.id))
    return message.reply("이 명령어는 Dev 권한이 필요합니다");
    try {
      await message.channel.send("재시작 중...");
      process.exit();
    } catch (e) {
      message.channel.send(`ERROR: ${e.message}`);
    }
      if (!client.devs.includes(message.author.id))
        return message.reply("이 명령어는 Dev 권한이 필요합니다");
        try {
          await message.channel.send("재시작 중...");
          process.exit();
        } catch (e) {
    message.channel.send(`ERROR: ${e.message}`);
  }
};

exports.config = {
  name: "리봇",
  aliases: ["restart", "재시작", "종료"],
  category: ["관리자"],
  des: ["리봇을 합니다."],
  use: ["#리봇"]
};
