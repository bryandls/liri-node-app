require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var keyList = new Twitter(keys.twitter);

var action = process.argv[2];

var parameter = process.argv[3];

command();
log();

function command() {

	switch (action) {
		case "my-tweets":
			tweet();
			break;

		case "spotify-this-song":
			thisSpotify();
			break;

		case "movie-this":
			movie();
			break;

		case "do-what-it-says":
			justDoIt();
			break;
	}
}

function tweet() {
	var params = { screen_name: 'BryanSm43549127' };
	keyList.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (!error) {
			for (var i = 0; i < tweets.length; i++) {
				console.log(tweets[i].created_at + ": " + tweets[i].text);
			}
		}
	});
}

function thisSpotify() {
	if (parameter === "") {
		parameter = "The sign by ace of base";
		//console.log("blank input")
	} else {
		//console.log("Song entered")
	}
	spotify.search({ type: 'track', query: parameter }, function (err, data) {
		if (err) {
			console.log('Error occurred: ' + err);
			return;
		}
		else if (!err) {
			console.log(data.tracks.items[0].artists[0].name);
			console.log(data.tracks.items[0].name);
			console.log(data.tracks.items[0].preview_url);
			console.log(data.tracks.items[0].album.name);
		}

	});
}

function movie() {
	if (parameter === "") {
		parameter = "Mr. Nobody";
		console.log("blank input");
	} else {
		console.log("Song entered");
	}

	var queryUrl = "http://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&tomatoes=True&apikey=trilogy";

	request(queryUrl, function (error, response, body) {
		if (!error && response.statusCode === 200) {

			console.log("Title: " + JSON.parse(body).Title);
			console.log("Release Year: " + JSON.parse(body).Year);
			console.log("IMBD Rating: " + JSON.parse(body).imdbRating);
			console.log("Production Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
			console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
		}
	});
}

function justDoIt() {

	fs.readFile("random.txt", "utf8", function (error, data) {
        var dataArr = data.split(",");
		console.log(dataArr);

		var randomCommand = dataArr[0];
		parameter = dataArr[1];

		switch (parameter) {
			case "my-tweets":
				tweet();
				break;

			case "spotify-this-song":
				thisSpotify();
				break;

			case "movie-this":
				movie();
				break;

			case "do-what-it-says":
				justDoIt();
				break;
		}
	});

}

function log() {
	action = "Log Action: " + action + "\n";
	fs.appendFile('log.txt', action, function (err) {
    	if (err) {
			console.log(err);
		}
		else {
			console.log("Content Added!");
		}
	});
}



