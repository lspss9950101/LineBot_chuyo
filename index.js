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
var occupation = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var awake_time = 0;
var country_name = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

function load_config() {
	console.log('acquiring data');
	fs.readFile("ops.txt", "utf8", function (err, data) {
		if (err) throw err;
		if (data) ops = data.split(",");
	});
	fs.readFile("groups.txt", "utf8", function (err, data) {
		if (err) throw err;
		if (data) groups = data.split(",");
	});
}

function reset() {
	var i;
	for (i = 0; i < 7; i++)occupation[i] = 0;
}

function get_rank(team) {
	var i, rank = 0;
	for (i = 0; i < 8; i++)if (occupation[i] > occupation[team]) rank++;
	return rank;
}

function generate_list(team) {
	var list = '一二三四五六七八';
	var date = new Date();
	var time = date.getTime();
	time += (8 * 60 * 60 * 1000);
	var hour = Math.floor(time / 1000 / 60 / 60) % 24;
	var minute = Math.floor(time / 1000 / 60) % 60;
	var second = Math.floor(time / 1000) % 60;
	var occupied = 0;
	for (var i = 0; i < 11; i++)if (occupation[i] == team) occupied++;
	return {
		"type": "flex",
		"altText": "[狀態]",
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
						"text": occupied.toString(),
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
						"text": date.getFullYear() + "/" + (1 + date.getMonth()) + "/" + date.getDate() + " " + hour + ":" + minute + ":" + second,
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
						"label": "詳細世界局勢",
						"text": "!詳情"
					}
				},
				{
					"type": "button",
					"action": {
						"type": "message",
						"label": "更新",
						"text": "!狀態"
					}
				}]
			}
		}
	};
}

function generate_list_ops() {
	var date = new Date();
	var time = date.getTime();
	time += (8 * 60 * 60 * 1000);
	var hour = Math.floor(time / 1000 / 60 / 60) % 24;
	var minute = Math.floor(time / 1000 / 60) % 60;
	var second = Math.floor(time / 1000) % 60;
	var msg = {
		"type": "flex",
		"altText": "[狀態]",
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
							"text": date.getFullYear() + "/" + (1 + date.getMonth()) + "/" + date.getDate() + " " + hour + ":" + minute + ":" + second,
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
	var append = [];
	for (var i = 0; i < 11; i++) {
		var status;
		var list = "0一二三四五六七八"
		if (occupation[i] == 0) status = "目前尚未被佔領";
		else status = "被第" + list[occupation[i]] + "組佔領";
		append.concat([{
			"type": "box",
			"layout": "horizontal",
			"margin": "xs",
			"contents": [{
				"type": "text",
				"text": country_name[i],
				"color": "#444444",
				"size": "md",
				"align": "start"
			},
			{
				"type": "text",
				"text": status,
				"color": "#444444",
				"size": "md",
				"align": "end"
			}]
		}]);
	}
	msg.contents.body.contents.push(append);
	return msg;
}

function list_command(event, hasPermission) {
	var command_list;
	if (hasPermission) command_list = {
		"type": "flex",
		"altText": "幫助",
		"contents": {
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
								"text": "usage : !set <region> <team>",
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
								"text": "usage : !clear <region>",
								"size": "lg"
							},
							{
								"type": "separator",
								"margin": "xl"
							},

							{
								"type": "text",
								"text": "Reset the status of all regions.",
								"size": "lg",
								"weight": "bold"
							},
							{
								"type": "text",
								"text": "usage : !reset",
								"size": "lg"
							}
						]
					}
				]
			}
		}
	};
	else command_list = {
		"type": "flex",
		"altText": "[幫助]",
		"contents": {
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
						"type": "separator",
						"margin": "xl"
					},
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
					}


				]
			}
		}
	};
	event.reply(command_list);
}

load_config();

bot.on('message', function (event) {
	if (event.message.type == 'text') {
		var msg = event.message.text;
		var sender = event.source.userId;
		var group = event.source.groupId;
		console.log("Group:" + group + " User:" + sender + " msg:" + msg);
		load_config();
		if (msg != null) {
			var tokens = msg.split(" ");
			var cmd = tokens[0];
			//Op commands
			if (ops.indexOf(sender) != -1) {
				if (cmd.toUpperCase() === ('!SET')) {
					if (tokens.length > 2) {
						occupation[tokens[1]] = tokens[2];
					}
				} else if (cmd.toUpperCase() === ('!CLEAR')) {
					if (tokens.length > 1) {
						occupation[tokens[1]] = 0;
					}
				} else if (cmd.toUpperCase() === ('!RESET')) {
					reset();
				} else if (cmd.toUpperCase() === ('!BROADCAST')) {
					if (tokens.length > 2) {
						var msg, i;
						if (tokens[1].toUpperCase() === 'TEXT') {
							msg = "";
							for (i = 2; i < tokens.length; i++)msg += (tokens[i] + ' ');
							for (i = 0; i < groups.length; i++)bot.push(groups[i], msg);
							console.log(msg);
						} else if (tokens[1].toUpperCase() === 'IMAGE') {
							var url = tokens[2].split('/');
							for (i = 0; i < url.length; i++)if (url[i] == 'd') {
								url = url[i + 1];
								break;
							}
							msg = {
								type: 'image',
								originalContentUrl: 'https://drive.google.com/uc?export=view&id=' + url,
								previewImageUrl: 'https://drive.google.com/uc?export=view&id=' + url
							}
							for (i = 0; i < groups.length; i++)bot.push(groups[i], msg);
						}
					}
				}
			}
			//User commands
			if (cmd.toUpperCase() === ('!LIST') || cmd == '!狀態') {
				var rp_msg;
				if (ops.indexOf(sender) != -1 && group == undefined) rp_msg = generate_list_ops();
				else if (group != undefined) {
					var index = groups.indexOf(group);
					rp_msg = generate_list(index);
				}
				event.reply(rp_msg);
			} else if (cmd.toUpperCase() === ('!HELP')) list_command(event, (ops.indexOf(sender) != -1 && group == undefined));
			if (cmd == '!詳情') event.reply(generate_list_ops());
		}
	}
}
);

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});

setInterval(function () {
	http.get("http://chuyo-linebot.herokuapp.com");
	console.log('wake->' + awake_time++);
}, 300000);