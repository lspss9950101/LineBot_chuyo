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
var score = [0, 0, 0, 0, 0, 0, 0, 0];
var awake_time = 0;
var country_name = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
var story = [];
var map_url = getUrl("https://drive.google.com/file/d/1gawWtMLbTQ5ztgi8VzDcI-Whu8jJgMj2/view?usp=sharing");

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
	fs.readFile("country.txt", "utf8", function (err, data) {
		if (err) throw err;
		if (data) country_name = data.split(",");
	});
	fs.readFile("story.txt", "utf8", function (err, data) {
		if (err) throw err;
		if (data) story = data.split('|');
	});
}

function reset() {
	var i;
	for (i = 0; i < 11; i++)occupation[i] = 0;
	for (i = 0; i < 8; i++)score[i] = 0;
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
	var str_hour, str_minute, str_second;
	if (hour < 10) str_hour = "0" + hour.toString();
	else str_hour = hour.toString();
	if (minute < 10) str_minute = "0" + minute.toString();
	else str_minute = minute.toString();
	if (second < 10) str_second = "0" + second.toString();
	else str_second = second.toString();
	for (var i = 0; i < 11; i++)if (occupation[i] == team + 1) occupied++;
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
				"url": map_url,
				"size": "full",
				"aspectRatio": "20:13",
				"aspectMode": "cover"
			},
			"body": {
				"type": "box",
				"layout": "vertical",
				"contents": [{
					"type": "text",
					"text": ("第" + list[team] + "組"),
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
					"type": "box",
					"layout": "horizontal",
					"margin": "xs",
					"contents": [{
						"type": "text",
						"text": "分數：",
						"color": "#444444",
						"size": "md",
						"align": "start"
					},
					{
						"type": "text",
						"text": score[team].toString(),
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
						"text": date.getFullYear() + "/" + (1 + date.getMonth()) + "/" + date.getDate() + " " + str_hour + ":" + str_minute + ":" + str_second,
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
						"label": "詳細局勢",
						"text": "!詳情"
					}
				},
				{
					"type": "button",
					"action": {
						"type": "message",
						"label": "更新",
						"text": "!我愛種子營"
					}
				}]
			}
		}
	};
}

function generate_list_ops() {
	var list = "0一二三四五六七八";
	var date = new Date();
	var time = date.getTime();
	time += (8 * 60 * 60 * 1000);
	var hour = Math.floor(time / 1000 / 60 / 60) % 24;
	var minute = Math.floor(time / 1000 / 60) % 60;
	var second = Math.floor(time / 1000) % 60;
	var str_hour, str_minute, str_second;
	if (hour < 10) str_hour = "0" + hour.toString();
	else str_hour = hour.toString();
	if (minute < 10) str_minute = "0" + minute.toString();
	else str_minute = minute.toString();
	if (second < 10) str_second = "0" + second.toString();
	else str_second = second.toString();
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
							"text": country_name[0],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[0] == 0 ? "尚未被占領" : "被第" + list[occupation[0]] + "組佔領"),
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
							"text": country_name[1],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[1] == 0 ? "尚未被占領" : "被第" + list[occupation[1]] + "組佔領"),
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
							"text": country_name[2],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[2] == 0 ? "尚未被占領" : "被第" + list[occupation[2]] + "組佔領"),
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
							"text": country_name[3],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[3] == 0 ? "尚未被占領" : "被第" + list[occupation[3]] + "組佔領"),
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
							"text": country_name[4],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[4] == 0 ? "尚未被占領" : "被第" + list[occupation[4]] + "組佔領"),
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
							"text": country_name[5],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[5] == 0 ? "尚未被占領" : "被第" + list[occupation[5]] + "組佔領"),
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
							"text": country_name[6],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[6] == 0 ? "尚未被占領" : "被第" + list[occupation[6]] + "組佔領"),
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
							"text": country_name[7],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[7] == 0 ? "尚未被占領" : "被第" + list[occupation[7]] + "組佔領"),
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
							"text": country_name[8],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[8] == 0 ? "尚未被占領" : "被第" + list[occupation[8]] + "組佔領"),
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
							"text": date.getFullYear() + "/" + (1 + date.getMonth()) + "/" + date.getDate() + " " + str_hour + ":" + str_minute + ":" + str_second,
							"color": "#aaaaaa",
							"size": "xs",
							"align": "end"
						},
						{
							"type": "separator",
							"margin": "xl"
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
						"text": "!詳情"
					}
				}]
			}
		}
	};
}

function generate_list_all() {
	var list = "0一二三四五六七八";
	var date = new Date();
	var time = date.getTime();
	time += (8 * 60 * 60 * 1000);
	var hour = Math.floor(time / 1000 / 60 / 60) % 24;
	var minute = Math.floor(time / 1000 / 60) % 60;
	var second = Math.floor(time / 1000) % 60;
	var str_hour, str_minute, str_second;
	if (hour < 10) str_hour = "0" + hour.toString();
	else str_hour = hour.toString();
	if (minute < 10) str_minute = "0" + minute.toString();
	else str_minute = minute.toString();
	if (second < 10) str_second = "0" + second.toString();
	else str_second = second.toString();
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
							"text": country_name[0],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[0] == 0 ? "尚未被占領" : "被第" + list[occupation[0]] + "組佔領"),
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
							"text": country_name[1],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[1] == 0 ? "尚未被占領" : "被第" + list[occupation[1]] + "組佔領"),
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
							"text": country_name[2],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[2] == 0 ? "尚未被占領" : "被第" + list[occupation[2]] + "組佔領"),
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
							"text": country_name[3],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[3] == 0 ? "尚未被占領" : "被第" + list[occupation[3]] + "組佔領"),
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
							"text": country_name[4],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[4] == 0 ? "尚未被占領" : "被第" + list[occupation[4]] + "組佔領"),
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
							"text": country_name[5],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[5] == 0 ? "尚未被占領" : "被第" + list[occupation[5]] + "組佔領"),
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
							"text": country_name[6],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[6] == 0 ? "尚未被占領" : "被第" + list[occupation[6]] + "組佔領"),
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
							"text": country_name[7],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[7] == 0 ? "尚未被占領" : "被第" + list[occupation[7]] + "組佔領"),
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
							"text": country_name[8],
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": (occupation[8] == 0 ? "尚未被占領" : "被第" + list[occupation[8]] + "組佔領"),
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
						"margin": "xs",
						"contents": [{
							"type": "text",
							"text": "第一組",
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": score[0] + "分",
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
							"text": "第二組",
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": score[1] + "分",
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
							"text": "第三組",
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": score[2] + "分",
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
							"text": "第四組",
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": score[3] + "分",
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
							"text": "第五組",
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": score[4] + "分",
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
							"text": "第六組",
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": score[5] + "分",
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
							"text": "第七組",
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": score[6] + "分",
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
							"text": "第八組",
							"color": "#444444",
							"size": "md",
							"align": "start"
						},
						{
							"type": "text",
							"text": score[7] + "分",
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
							"text": date.getFullYear() + "/" + (1 + date.getMonth()) + "/" + date.getDate() + " " + str_hour + ":" + str_minute + ":" + str_second,
							"color": "#aaaaaa",
							"size": "xs",
							"align": "end"
						},
						{
							"type": "separator",
							"margin": "xl"
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

function list_command(event, hasPermission) {
	var command_list;
	if (hasPermission) command_list = {
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
								"text": "Add points to a team.",
								"size": "lg",
								"weight": "bold"
							},
							{
								"type": "text",
								"text": "usage : !add <team> <add>",
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
								"text": "Update the game map.",
								"size": "lg",
								"weight": "bold"
							},
							{
								"type": "text",
								"text": "usage : !update <url>",
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
						"text": "用法 : !我愛種子營",
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

function getUrl(google_url) {
	var url = google_url.split('/');
	var target;
	for (i = 0; i < url.length; i++)if (url[i] == 'd') {
		target = url[i + 1];
		break;
	}
	return 'https://drive.google.com/uc?export=view&id=' + target;
}

load_config();

bot.on('message', function (event) {
	if (event.message.type == 'text') {
		var msg = event.message.text;
		var sender = event.source.userId;
		var group = event.source.groupId;
		console.log(">>Group:" + group + " User:" + sender + " msg:" + msg);
		load_config();
		if (msg != null) {
			var tokens = msg.split(" ");
			var cmd = tokens[0];
			//Op commands
			if (ops.indexOf(sender) != -1) {
				if (cmd.toUpperCase() === ('!ADD')) {
					if (tokens.length > 2) {
						if (parseInt(tokens[1]) > 0 && parseInt(tokens[1]) <= 8) {
							score[parseInt(tokens[1]) - 1] += parseInt(tokens[2]);
							event.reply('Added ' + tokens[2] + ' points to team ' + tokens[1]);
						}
					}
				} else if (cmd.toUpperCase() === ('!SET')) {
					if (tokens.length > 2) {
						var index = country_name.indexOf(tokens[1]);
						console.log(index);
						if (index != -1) {
							occupation[index] = parseInt(tokens[2]);
							event.reply('Has set region ' + country_name[index] + ' occupied by team ' + tokens[2]);
						}
					}
				} else if (cmd.toUpperCase() === ('!CLEAR')) {
					if (tokens.length > 1) {
						occupation[parseInt(tokens[1])] = 0;
						event.reply('Has clear region ' + country_name[parseInt(tokens[1])] + '\'s occupation');
					}
				} else if (cmd.toUpperCase() === ('!RESET')) {
					reset();
				} else if (cmd.toUpperCase() === ('!UPDATE')) {
					if (tokens.length > 1) {
						map_url = getUrl(tokens[1]);
						console.log(map_url);
						event.reply("Image has been updated")
					}
				} else if (cmd.toUpperCase() === ('!BROADCAST')) {
					if (tokens.length > 2) {
						var msg, i;
						if (tokens[1].toUpperCase() === 'TEXT') {
							msg = "";
							for (i = 2; i < tokens.length; i++)msg += (tokens[i] + ' ');
							for (i = 0; i < groups.length; i++)bot.push(groups[i], msg);
						} else if (tokens[1].toUpperCase() === 'IMAGE') {
							var url = getUrl(tokens[2]);
							msg = {
								type: 'image',
								originalContentUrl: url,
								previewImageUrl: url
							}
							for (i = 0; i < groups.length; i++)bot.push(groups[i], msg);
						}
					}
				} else if (cmd.toUpperCase() === ('!STORY')) {
					var msg = {
						"type": "flex",
						"altText": "[故事]",
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
										"text": "楔子",
										"weight": "bold",
										"color": "#06a862",
										"size": "xl"
									},
									{
										"type": "text",
										"text": story[4],
										"color": "#555555",
										"wrap": true,
										"size": "lg"
									}
								]
							},
							"footer": {
								"type": "box",
								"layout": "horizontal",
								"contents": [
									{
										"type": "spacer",
										"size": "xxl"
									},
									{
										"type": "text",
										"text": "如欲知曉 請待下回分析 並留言 “咖哩湯之亂”",
										"weight": "bold",
										"color": "#000000",
										"size": "lg",
										"wrap": true,
										"align": "center"
									}
								]
							}
						}
					};
					for (var i = 0; i < groups.length; i++)bot.push(groups[i], msg);
				} else if (cmd.toUpperCase() === ('!RULE')) {
					var msg = {
						"type": "flex",
						"altText": "[故事]",
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
										"text": "注意！",
										"weight": "bold",
										"color": "#06a862",
										"size": "xl"
									},
									{
										"type": "text",
										"text": story[5],
										"color": "#555555",
										"wrap": true,
										"size": "lg"
									}
								]
							},
							"footer": {
								"type": "box",
								"layout": "horizontal",
								"contents": [
									{
										"type": "spacer",
										"size": "xxl"
									},
									{
										"type": "text",
										"text": "使用說明：欲查詢目前競爭狀況請輸入“！我愛種子營”，即時檢視各隊菁英狀況。",
										"weight": "bold",
										"color": "#000000",
										"size": "lg",
										"wrap": true,
										"align": "center"
									}
								]
							}
						}
					};
					for (var i = 0; i < groups.length; i++)bot.push(groups[i], msg);
				}
			}
			//User commands
			if (cmd.toUpperCase() === ('!LIST') || cmd == '!我愛種子營' || cmd == '！我愛種子營') {
				var rp_msg;
				if (ops.indexOf(sender) != -1 && group == undefined) rp_msg = generate_list_all();
				else if (group != undefined) {
					var index = groups.indexOf(group);
					if(index >= 0 && index < 8)rp_msg = generate_list(index);
				}
				event.reply(rp_msg);
			} else if (cmd.toUpperCase() === ('!HELP')) list_command(event, (ops.indexOf(sender) != -1 && group == undefined));
			if (cmd == '!詳情' || cmd == '！詳情') event.reply(generate_list_ops());
			if (cmd == '!骰子' || cmd == '！骰子') event.reply('擲出了' + Math.floor(Math.random() * 6 + 1));
			if (cmd == '咖哩湯之亂') {
				var msg = {
					"type": "flex",
					"altText": "[故事]",
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
									"text": "咖哩湯之亂",
									"weight": "bold",
									"color": "#06a862",
									"size": "xl"
								},
								{
									"type": "text",
									"text": story[0],
									"color": "#555555",
									"wrap": true,
									"size": "lg"
								}
							]
						},
						"footer": {
							"type": "box",
							"layout": "horizontal",
							"contents": [
								{
									"type": "spacer",
									"size": "xxl"
								},
								{
									"type": "text",
									"text": "留言 “種子帝國大亂”  ，小編立即私訊！",
									"weight": "bold",
									"color": "#000000",
									"size": "lg",
									"wrap": true,
									"align": "center"
								}
							]
						}
					}
				};
				event.reply(msg);
			}
			if (cmd == '種子帝國大亂') {
				var msg = {
					"type": "flex",
					"altText": "[故事]",
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
									"text": "種子帝國大亂",
									"weight": "bold",
									"color": "#06a862",
									"size": "xl"
								},
								{
									"type": "text",
									"text": story[1],
									"color": "#555555",
									"wrap": true,
									"size": "lg"
								}
							]
						},
						"footer": {
							"type": "box",
							"layout": "horizontal",
							"contents": [
								{
									"type": "spacer",
									"size": "xxl"
								},
								{
									"type": "text",
									"text": "趕緊輸入“灰高灰低不知道”來繼續了解故事666～",
									"weight": "bold",
									"color": "#000000",
									"size": "lg",
									"wrap": true,
									"align": "center"
								}
							]
						}
					}
				};
				event.reply(msg);
			}
			if (cmd == '灰高灰低不知道') {
				var msg = {
					"type": "flex",
					"altText": "[故事]",
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
									"text": "灰高灰低不知道",
									"weight": "bold",
									"color": "#06a862",
									"size": "xl"
								},
								{
									"type": "text",
									"text": story[2],
									"color": "#555555",
									"wrap": true,
									"size": "lg"
								}
							]
						},
						"footer": {
							"type": "box",
							"layout": "horizontal",
							"contents": [
								{
									"type": "spacer",
									"size": "xxl"
								},
								{
									"type": "text",
									"text": "誓言：“擊敗水屁王的大水屁”",
									"weight": "bold",
									"color": "#000000",
									"size": "lg",
									"wrap": true,
									"align": "center"
								}
							]
						}
					}
				};
				event.reply(msg);
			}
			if (cmd == '擊敗水屁王的大水屁') {
				var msg = {
					"type": "flex",
					"altText": "[故事]",
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
									"text": "擊敗水屁王的大水屁",
									"weight": "bold",
									"color": "#06a862",
									"size": "xl"
								},
								{
									"type": "text",
									"text": story[3],
									"color": "#555555",
									"wrap": true,
									"size": "lg"
								}
							]
						}
					}
				};
				event.reply(msg);
			}
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