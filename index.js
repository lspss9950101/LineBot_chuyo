var linebot = require('linebot');
var express = require('express');
var fs = require('fs');
var bot = linebot({
  channelId: 'ChuyoBot',
  channelSecret: 'edaa7868492d56932953d60315a69312',
  channelAccessToken: 'K4CGvZ4EnqBSawsF1mOgNUm/STJ0nPjvxfRzq4CPOD7AyRoklVvozMw9bBYya+VaM+Jfd6Knr9zM93Wu/Hn+g8vFWwCgAn5edVd9sJ8eteFmSEilIbWJ5Ev/Ucr5X8VHfEPFCwCPZx1ByR90h5M4dQdB04t89/1O/w1cDnyilFU='
});

var ops = ['U7883d95038ed8ffd76e5ea5be8f4b522'];
var score = [0,0,0,0,0,0,0,0];
var mission;

fs.readFile("config.txt", function(err,data){
	if(err)throw err;
	if(data){
		var jsonobj = JSON.parse(data);
		var i;
		score[0] = jsonobj.one;
		score[1] = jsonobj.two;
		score[2] = jsonobj.three;
		score[3] = jsonobj.four;
		score[4] = jsonobj.five;
		score[5] = jsonobj.six;
		score[6] = jsonobj.seven;
		score[7] = jsonobj.eight;
		mission = jsonobj.mission;
	}
});

function save_score(){
	var str = JSON.stringify({one:score[0], two:score[1], three:score[2], four:score[3],
							  five:score[4], six:score[5], seven:score[6], eight:score[7],
							  mission:mission});
	fs.writeFile('config.txt', str, function(err){
		if(err)throw err;
	});
}

function reset(){
	var i;
	for(i = 0; i < 7; i++)score[i] = 0;
	save_score();
}

bot.on('message', function(event) {
	if (msg = event.message.type = 'text'){
		var msg = event.message.text;
		var sender = event.source.userId;
		var tokens = msg.split(" ");
		var cmd = tokens[0];
		//Op commands
		if(ops.indexOf(sender) != -1){
			if(cmd.toUpperCase() === ('ADD')){
				if(tokens.length == 3 && tokens[1] > 0 && tokens[1] <= 8){
					score[tokens[1] - 1] += parseInt(tokens[2]);
					save_score();
					event.reply('Added ' + tokens[2] + ' points to ' + tokens[1] + '.');
				}else event.reply('Invalid Command.\nadd team_number score').then(function(data){
					console.log(sender + ' added ' + tokens[2] + ' points to team ' + tokens[1] + '.');
				}).catch(function(error){
					console.log('error');
				});
			}else if(cmd.toUpperCase() === ('SET')){
				if(tokens.length == 3 && tokens[1] > 0 && tokens[1] <= 8){
					score[tokens[1] - 1] = parseInt(tokens[2]);
					save_score();
					event.reply('Set ' + tokens[2] + ' points to team ' + tokens[1]);
				}else event.reply('Invalid Command.\nset team_number score').then(function(data){
					console.log(sender + ' set team ' + tokens[1] + ' ' + tokens[2] + ' points.');
				}).catch(function(error){
					console.log('error'); 
				});
			}else if(cmd.toUpperCase() === ('RESET')){
				reset();
			}else if(cmd.toUpperCase() === ('MISSION_EN')){
				if(tokens.length == 2){
					if(tokens[1].toUpperCase() === ('TRUE'))mission = true;
					else if(tokens[1].toUpperCase() === ('FALSE'))mission = false;
					save_score();
				}
			}				
		}
		//User commands
		if(cmd.toUpperCase() === ('LIST')){
			var rp_msg = "第一組:" + score[0] + "\n第二組:" + score[1] + "\n第三組:" + score[2] + "\n第四組:" + score[3] + 
						 "\n第五組:" + score[4] + "\n第六組:" + score[5] + "\n第七組:" + score[6] + "\n第八組:" + score[7];
			event.reply(rp_msg);
		}
		if(cmd.toUpperCase() === ('MISSION')){
			if(mission)event.reply("You got mission.");
			else event.reply("Not the time.");
		}
	}
  console.log(event);
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});