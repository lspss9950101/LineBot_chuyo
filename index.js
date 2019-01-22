var linebot = require('linebot');
var express = require('express');
var http = require("http");
var fs = require('fs');
var bot = linebot({
  channelId: 'ChuyoBot',
  channelSecret: 'edaa7868492d56932953d60315a69312',
  channelAccessToken: 'K4CGvZ4EnqBSawsF1mOgNUm/STJ0nPjvxfRzq4CPOD7AyRoklVvozMw9bBYya+VaM+Jfd6Knr9zM93Wu/Hn+g8vFWwCgAn5edVd9sJ8eteFmSEilIbWJ5Ev/Ucr5X8VHfEPFCwCPZx1ByR90h5M4dQdB04t89/1O/w1cDnyilFU='
});

var ops = [];
var groups = [];
var score = [0,0,0,0,0,0,0,0];
var awake_time = 0;

function load_config(){
	console.log('acquiring data');
	fs.readFile("config.txt", function(err,data){
		if(err)throw err;
		if(data){
			console.log('get data');
			var jsonobj = JSON.parse(data);
			score[0] = jsonobj.one;
			score[1] = jsonobj.two;
			score[2] = jsonobj.three;
			score[3] = jsonobj.four;
			score[4] = jsonobj.five;
			score[5] = jsonobj.six;
			score[6] = jsonobj.seven;
			score[7] = jsonobj.eight;
		}
	});
	fs.readFile("ops.txt", "utf8" ,function(err,data){
		if(err)throw err;
		if(data)ops = data.split(",");
	});
	fs.readFile("groups.txt", "utf8", function(err,data){
		if(err)throw err;
		if(data)groups = data.split(",");
	});
}


function save_score(){
	var str = JSON.stringify({one:score[0], two:score[1], three:score[2], four:score[3],
							  five:score[4], six:score[5], seven:score[6], eight:score[7]});
	fs.writeFile('config.txt', str, function(err){
		if(err)throw err;
	});
}

function reset(){
	var i;
	for(i = 0; i < 7; i++)score[i] = 0;
	save_score();
}

function get_rank(team){
	var i, rank = 0;
	for(i = 0; i < 8; i++)if(score[i] > score[team])rank++;
	return rank;
}

function generate_list(team){
	var list = '一二三四五六七八';
	var team_name = "第" + list[team] + "組";
	return{
		"type": "bubble",
		"header": {
			"type": "box",
			"layout": "horizontal",
			"contents": [
			{
				"type": "text",
				"text": "當前世界局勢分佈",
				"weight": "bold",
				"color": "#199e5e",
				"size": "md"
			}
			]
		}
	}
}

function list_command(event, hasPermission){
	if(hasPermission)command_list = '>List: list all teams\' scores.\n' +
									'usage:!List\n' + '\n' +
									'>Add: add points to a team.\n' +
									'usage:!Add <team> <points>\n' + '\n' +
									'>Set: set a team\'s points.\n' +
									'usage:!Set <team> <Points>\n' + '\n' +
									'>Reset: reset all teams\' scores.\n' +
									'usage:!Reset\n' + '\n' +
									'>Broadcast: broadcast message to all teams.\n' +
									'usage(text):!Broadcast text <message>\n' +
									'usage(image):!Broadcast image <url>';
	else command_list = '>List: list team\'s score and rank.\n' +
						'usage:!List';
	event.reply(command_list);
}

load_config();

bot.on('message', function(event) {
	if (event.message.type == 'text'){
		var msg = event.message.text;
		var sender = event.source.userId;
		var group = event.source.groupId;
		console.log("Group:" + group + " User:" + sender + " msg:" + msg);
		load_config();
		if(msg != null){
			var tokens = msg.split(" ");
			var cmd = tokens[0];
			//Op commands
			if(ops.indexOf(sender) != -1){
				if(cmd.toUpperCase() === ('!ADD')){
					if(tokens.length == 3 && tokens[1] > 0 && tokens[1] <= 8){
						score[tokens[1] - 1] += parseInt(tokens[2]);
						save_score();
						event.reply('Added ' + tokens[2] + ' points to ' + tokens[1] + '.');
					}else event.reply('Invalid Command.\nadd team_number score').then(function(data){
						console.log(sender + ' added ' + tokens[2] + ' points to team ' + tokens[1] + '.');
					}).catch(function(error){
						console.log('error');
					});
				}else if(cmd.toUpperCase() === ('!SET')){
					if(tokens.length == 3 && tokens[1] > 0 && tokens[1] <= 8){
						score[tokens[1] - 1] = parseInt(tokens[2]);
						save_score();
						event.reply('Set ' + tokens[2] + ' points to team ' + tokens[1]);
					}else event.reply('Invalid Command.\nset team_number score').then(function(data){
						console.log(sender + ' set team ' + tokens[1] + ' ' + tokens[2] + ' points.');
					}).catch(function(error){
						console.log('error'); 
					});
				}else if(cmd.toUpperCase() === ('!RESET')){
					reset();
				}else if(cmd.toUpperCase() === ('!BROADCAST')){
					if(tokens.length > 2){
						var msg, i;
						if(tokens[1].toUpperCase() === 'TEXT'){
							msg = "";
							for(i = 2; i < tokens.length; i++)msg += (tokens[i] + ' ');
							for(i = 0; i < groups.length; i++)bot.push(groups[i], msg);
							console.log(msg);
						}else if(tokens[1].toUpperCase() === 'IMAGE'){
							var url = tokens[2].split('/');
							for(i = 0; i < url.length; i++)if(url[i] == 'd'){
								url = url[i+1];
								break;
							}
							msg = {
								type: 'image',
								originalContentUrl: 'https://drive.google.com/uc?export=view&id=' + url,
								previewImageUrl: 'https://drive.google.com/uc?export=view&id=' + url
							}
							for(i = 0; i < groups.length; i++)bot.push(groups[i], msg);
						}
					}
				}
			}
			//User commands
			if(cmd.toUpperCase() === ('!LIST')){
				var rp_msg;
				if(ops.indexOf(sender) != -1 && group == undefined)rp_msg = "第一組:" + score[0] + "\n第二組:" + score[1] + "\n第三組:" + score[2] + "\n第四組:" + score[3] + 
																		  "\n第五組:" + score[4] + "\n第六組:" + score[5] + "\n第七組:" + score[6] + "\n第八組:" + score[7];
				else if(group != undefined){
					var index = groups.indexOf(group);	
					rp_msg = generate_list(index);
				}
				event.reply(rp_msg);
			}else if(cmd.toUpperCase() === ('!HELP'))list_command(event, (ops.indexOf(sender) != -1 && group == undefined));
		}
	}
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});

setInterval(function() {
    http.get("http://chuyo-linebot.herokuapp.com");
	console.log('wake->' + awake_time++);
}, 300000);