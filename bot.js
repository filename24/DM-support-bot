const Discord = require('discord.js');  //디스코드
var client = new Discord.Client()
client.on("ready", function() {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('DM(개인메세지) ㄱㄱ', { type: 'WATCHING' })
    
  });
  
client.devs = ['552103947662524416', "1234567890"]
//https://discord.com/api/webhooks/778141467935637534/Zm4kdEomynB8CE19RHXnGETCqKJ_6wxYfHGfBFURBGKWArPnb6NVC5c6lKik5YkvqIsY
client.on("message", function(message) {
    Hook = new Discord.WebhookClient("778141467935637534", "Zm4kdEomynB8CE19RHXnGETCqKJ_6wxYfHGfBFURBGKWArPnb6NVC5c6lKik5YkvqIsY");
    server = client.guilds.find((x => x.id === '738294838063136808'))
ch = server.channels.find((x => x.id === '778141417712254986'))
if (message.author.equals(client.user)) return;
if (message.content.startsWith('#답변')){
  if (message.channel.type == "dm") return;
var args = message.content.substring(1).split(" ");
if(client.devs.includes(message.author.id)){
  if (args[1]||args[2]){
  var all = message.content.slice(8 + args[1].length)
  user = client.users.find((x => x.id === args[1]))
  console.log(user.tag+ ' SENDED ' + all)
}
  

if (!all||!user){
  message.reply('`#답변 (ID) [TEXT]`')
}
else
user.send(all)
.then(message.reply('SENDING MSG'))
.catch(error => message.reply('NO PERMISSION TO SEND MESSAGE TO USER'))



}
}
if(message.content.startsWith('#코드')){
  if (!client.devs.includes(message.author.id)) return
  const request = message.content.slice(7+1)
  const result = new Promise((resolve, reject) => resolve(eval(request)))

  return result.then(output => {
    if (typeof output !== 'string') output = require('util').inspect(output, {
      depth: 0
    })
    if (output.includes(client.token)) output = output.replace(client.token, '토큰은 ㄴㄴ')
    if (output.length > 1990) console.log(output), output = 'ㅓㅜㅑ 메세지가 1990 이상이라서 인식불가 입니다요 (로그하고 있다 ㅅㄱ)'

    return message.channel.send(output, {code: 'JavaScript'})
  }).catch(error => {
    console.error(error)
    error = error.toString()

    if (error.includes(client.token)) error = error.replace(client.token, '토큰은 ㄴㄴ')

    return message.channel.send(error, {code: 'JavaScript'})
  })
}
if(message.content.startsWith('#cmd'{
  if (!client.devs.includes(message.author.id)) return
  const { exec } = require('child_process')
  const request = message.content.slice(5+1)

  exec(request, (error, stdout, stderr) => {
    console.log('Attempting to exec handler: ' + request)
    if (error) {
      console.log('An error was printed: ' + error)
      error = error.toString()
      message.channel.send(error, {code: 'bash'})
      return
    }
    if (stdout.includes(client.token)) stdout = stdout.replace(client.token, '(accesstoken was hidden)')
    if (stdout.length > 1990) console.log('Attempted shell prompts: ' + stdout), stdout = 'Too long to be printed (content got console logged)'
    message.channel.send(stdout, {code: 'bash'})
    if (stderr) {
      if (stderr.includes(client.token)) stdout = stderr.replace(client.token, '(accesstoken was hidden)')
      if (stderr.length > 1990) console.log('An error was printed: ' + stderr), stderr = 'Too long to be printed (content got console logged)'
      message.channel.send(stderr, {code: 'bash'})
    }
  })

}
if (message.channel.type !== "dm") return;
console.log(`${message.author.tag}(${message.author.id})\n${message.content}\n${message.createdAt}`)

return Hook.send(`> 문의한 사람 \n${message.author.tag}(${message.author.id})\n> 메세지 내용 \n${message.content}\n> 날짜 \n ${message.createdAt}\n>  #답변 ${message.author.id} (답변) 으로 답변해주세요!`)

if(message.content.startsWith('#핑"{
    let embed = new Discord.MessageEmbed() // var -> let으로 수정하였습니다.
        .setTitle("봇상태")
        .setDescription("퐁!")
        .setColor("BLUE")
        .setFooter("Powered by 문의봇")
        .setTimestamp()
        .addField("웹소겟 지연시간", `${client.ws.ping}ms`)
        .addField("봇상태: ", `온라인`)
    msg.reply(embed)
}
})
client.login('NzU2ODQ5MTI1ODQ0MDU4MTcy.X2X0rQ.W8FJ6QBik-7hZ3C0QafYk7o6jL8');
