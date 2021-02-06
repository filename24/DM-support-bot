exports.run = async (client, msg, args, prefix, message) => {
  if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("🛑 당신은 관리자 권한이 없습니다.");
  if(!msg.guild.me.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) return msg.channel.send("🛑 봇권한중에 관리자 권한이 없습니다")
  if (!args[0]) return msg.reply("청소할 만큼의 값을 정수로 적어주세요!");
  if (!Number(args[0]))
    return msg.reply("메세지를 지울 값이 숫자가 아니면 안되요!");
  if (args[0] < 1)
    return msg.reply("메세지를 지울 값을 1보다 작게 하시면 안되요!");
  if (args[0] > 100)
    return msg.reply("메세지를 지울 값이 100보다 크면 메세지가 안지워져요!");
  await msg.delete();
  await msg.channel.bulkDelete(parseInt(args[1]));
  await msg.channel.send(`${args[1]}개의 메세지를 삭제했어요.`).then(m => {
        setTimeout(async () => {
            await m.delete();
        }, 3000);
    });
};

exports.config = {
  name: "청소",
  aliases: ["clear", "clean"],
  category: ["관리"],
  des: ["채팅을 깨긋하게 해줍니다."],
  use: ["//청소 <청소 할 메세지의 수>"]
};