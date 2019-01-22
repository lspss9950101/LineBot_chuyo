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
	var date = new Date();
	var time = date.getTime();
	time += (8 * 60 * 60 * 1000);
	var hour = Math.floor(time / 1000 / 60 / 60) % 24;
	var minute = Math.floor(time / 1000 / 60) % 60;
	var second = Math.floor(time / 1000) % 60;
	return {
		"type": "flex",
		"altText": "this is a flex message",
		"contents": {
			"type": "bubble",
			"header": {
				"type": "box",
				"layout": "horizontal",
				"contents": [{
					"type": "text",
					"text": "當前世界局勢分佈",
					"weight": "bold",
					"color": "#06a862",
					"size": "lg"
				}]
			},
		"hero": {
			"type": "image",
			"url": "https://02imgmini.eastday.com/mobile/20181004/20181004114807_fa262ff7ce086aedcaa804d5d76c1d83_1.jpeg",
			"size": "full",
			"aspectRatio": "20:13",
			"aspectMode": "cover"
		},
		"body": {
			"type": "box",
			"layout": "vertical",
			"contents": [{
				"type": "text",
				"text": "第" + list[team] + "組",
				"color": "#0f4c32",
				"weight": "bold",
				"size": "xxl",
				"margin": "md"
			},
			{
				"type": "box",
				"layout": "horizontal",
				"margin": "xs",
				"contents": [{
					"type": "text",
					"text": "佔領區域數量：",
					"color": "#444444",
					"size": "md",
					"align": "start"
				},
				{
					"type": "text",
					"text": "3",
					"color": "#444444",
					"size": "md",
					"align": "end"
				}]
			},
			{
				"type": "separator",
				"margin": "xxl"
			},
			{
				"type": "text",
				"text": "詳細世界局勢",
				"color": "#0f4c32",
				"weight": "bold",
				"size": "xl",
				"margin": "md"
			},
			{
				"type": "box",
				"layout": "horizontal",
				"margin": "xs",
				"contents": [{
					"type": "text",
					"text": "A",
					"color": "#444444",
					"size": "md",
					"align": "start"
				},
				{
					"type": "text",
					"text": "被第n組佔領",
					"color": "#444444",
					"size": "md",
					"align": "end"
				}]
			},
			{
				"type": "box",
				"layout": "horizontal",
				"margin": "xs",
				"contents": [{
					"type": "text",
					"text": "B",
					"color": "#444444",
					"size": "md",
					"align": "start"
				},
				{
					"type": "text",
					"text": "被第n組佔領",
					"color": "#444444",
					"size": "md",
					"align": "end"
				}]
			},
			{
				"type": "box",
				"layout": "horizontal",
				"margin": "xs",
				"contents": [{
					"type": "text",
					"text": "C",
					"color": "#444444",
					"size": "md",
					"align": "start"
				},
				{
					"type": "text",
					"text": "被第n組佔領",
					"color": "#444444",
					"size": "md",
					"align": "end"
				}]
			},
			{
				"type": "box",
				"layout": "horizontal",
				"margin": "xs",
				"contents": [{
					"type": "text",
					"text": "D",
					"color": "#444444",
					"size": "md",
					"align": "start"
				},
				{
					"type": "text",
					"text": "被第n組佔領",
					"color": "#444444",
					"size": "md",
					"align": "end"
				}]
			},
			{
				"type": "separator",
				"margin": "xxl"
			},
			{
				"type": "box",
				"layout": "horizontal",
				"margin": "md",
				"contents": [{
					"type": "text",
					"text": "更新時間：",
					"color": "#aaaaaa",
					"size": "xs",
					"align": "start"
				},
				{
					"type": "text",
					"text": date.getFullYear() + "/" + (1 + date.getMonth()) + "/" + date.getDate() +  " " + hour + ":" + minute + ":" + second,
					"color": "#aaaaaa",
					"size": "xs",
					"align": "end"
				}]
			}]
		},
			"footer": {
				"type": "box",
				"layout": "horizontal",
				"contents": [{
					"type": "button",
					"action": {
						"type": "message",
						"label": "更新",
						"text": "!list"
					}
				}]
			}
		}
	};
}

function generate_list_ops(){
	var date = new Date();
	var time = date.getTime();
	time += (8 * 60 * 60 * 1000);
	var hour = Math.floor(time / 1000 / 60 / 60) % 24;
	var minute = Math.floor(time / 1000 / 60) % 60;
	var second = Math.floor(time / 1000) % 60;
	return {
		"type": "flex",
		"altText": "this is a flex message",
		"contents": {
			"type": "bubble",
			"header": {
				"type": "box",
				"layout": "horizontal",
				"contents": [{
					"type": "text",
					"text": "當前世界局勢分佈",
					"weight": "bold",
					"color": "#06a862",
					"size": "lg"
				}]
			},
		"body": {
			"type": "box",
			"layout": "vertical",
			"contents": [
			{
				"type": "box",
				"layout": "horizontal",
				"margin": "xs",
				"contents": [{
					"type": "text",
					"text": "A",
					"color": "#444444",
					"size": "md",
					"align": "start"
				},
				{
					"type": "text",
					"text": "被第n組佔領",
					"color": "#444444",
					"size": "md",
					"align": "end"
				}]
			},
			{
				"type": "box",
				"layout": "horizontal",
				"margin": "xs",
				"contents": [{
					"type": "text",
					"text": "B",
					"color": "#444444",
					"size": "md",
					"align": "start"
				},
				{
					"type": "text",
					"text": "被第n組佔領",
					"color": "#444444",
					"size": "md",
					"align": "end"
				}]
			},
			{
				"type": "box",
				"layout": "horizontal",
				"margin": "xs",
				"contents": [{
					"type": "text",
					"text": "C",
					"color": "#444444",
					"size": "md",
					"align": "start"
				},
				{
					"type": "text",
					"text": "被第n組佔領",
					"color": "#444444",
					"size": "md",
					"align": "end"
				}]
			},
			{
				"type": "box",
				"layout": "horizontal",
				"margin": "xs",
				"contents": [{
					"type": "text",
					"text": "D",
					"color": "#444444",
					"size": "md",
					"align": "start"
				},
				{
					"type": "text",
					"text": "被第n組佔領",
					"color": "#444444",
					"size": "md",
					"align": "end"
				}]
			},
			{
				"type": "separator",
				"margin": "xxl"
			},
			{
				"type": "box",
				"layout": "horizontal",
				"margin": "md",
				"contents": [{
					"type": "text",
					"text": "更新時間：",
					"color": "#aaaaaa",
					"size": "xs",
					"align": "start"
				},
				{
					"type": "text",
					"text": date.getFullYear() + "/" + (1 + date.getMonth()) + "/" + date.getDate() +  " " + hour + ":" + minute + ":" + second,
					"color": "#aaaaaa",
					"size": "xs",
					"align": "end"
				}]
			}]
		},
			"footer": {
				"type": "box",
				"layout": "horizontal",
				"contents": [{
					"type": "button",
					"action": {
						"type": "message",
						"label": "更新",
						"text": "!list"
					}
				}]
			}
		}
	};
}

function list_command(event, hasPermission){
	if(hasPermission)command_list = {
		"type": "flex",
		"altText": "this is a flex message",
		"contents": {
			{
  "type": "bubble",
  "styles": {
    "footer": {
      "separator": true
    }
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "Commands：",
        "weight": "bold",
        "color": "#06a862",
        "size": "xl"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "xxl",
        "spacing": "sm",
        "contents": [
          {
            "type": "text",
            "text": "List the status.",
            "size": "lg",
            "weight": "bold"
          },
          {
            "type": "text",
            "text": "usage : !list",
            "size": "lg"
          },
          {
            "type": "separator",
            "margin": "xl"
          },
          
          {
            "type": "text",
            "text": "Set the occupier of a region.",
            "size": "lg",
            "weight": "bold"
          },
          {
            "type": "text",
            "text": "usage : !set <rigion> <team>",
            "size": "lg"
          },
          {
            "type": "separator",
            "margin": "xl"
          },
          
          {
            "type": "text",
            "text": "Clear the status of a region.",
            "size": "lg",
            "weight": "bold"
          },
          {
            "type": "text",
            "text": "usage : !clear <rigion>",
            "size": "lg"
          },
          {
            "type": "separator",
            "margin": "xl"
          },
          
          {
            "type": "text",
            "text": "Reset the status of all rigions.",
            "size": "lg",
            "weight": "bold"
          },
          {
            "type": "text",
            "text": "usage : !reset",
            "size": "lg"
          },
          {
            "type": "separator",
            "margin": "xl"
          }
        ]
      }
    ]
  }
}
		}};
	else command_list = "type": "flex",
		"altText": "this is a flex message",
		"contents": {
			{
  "type": "bubble",
  "styles": {
    "footer": {
      "separator": true
    }
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "指令：",
        "weight": "bold",
        "color": "#06a862",
        "size": "xl"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "xxl",
        "spacing": "sm",
        "contents": [
          {
            "type": "text",
            "text": "列出所有區域的占領狀態",
            "size": "lg",
            "weight": "bold"
          },
          {
            "type": "text",
            "text": "用法 : !狀態",
            "size": "lg"
          },
          {
            "type": "separator",
            "margin": "xl"
          },
          
          {
            "type": "text",
            "text": "擲骰子",
            "size": "lg",
            "weight": "bold"
          },
          {
            "type": "text",
            "text": "用法 : !骰子",
            "size": "lg"
          },
          {
            "type": "separator",
            "margin": "xl"
          }
        ]
      }
    ]
  }
}
		}
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
				if(ops.indexOf(sender) != -1 && group == undefined)rp_msg = generate_list_ops();
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