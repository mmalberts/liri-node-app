require("dotenv").config();
// console.log(process.env);

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var name = "";

for (i = 3; i < process.argv.length; i++) {
	name += process.argv[i] + " ";
};
// console.log(name); //for debugging

switch (command) {
	case "my-tweets":
		getTweets();
		break;
	case "spotify-this-song":
		spotifyThis();
		break;
	case "movie-this":
		movieThis();
		break;
	case "do-what-it-says":
		doThis();
};

function getTweets() {
	client.get("statuses/user_timeline", function(error, tweets, response) {
		if (!error && response.statusCode ===200) {
			// console.log(tweets);
			for (var i = 0; i < 20; i++) {
				console.log(tweets[i].text);
				console.log(tweets[i].created_at);
			}
		};
	});
};

function spotifyThis() {

	var songName = "";

	if (name === "") {
		songName = "The Sign";
	}
	else {
		songName = name;
	};

	var query = {
		type: "track",
		query: songName,
		type: "track"
	};
	spotify.search(query, function(error, data) {
		if(error) {
			return console.log(error);
		}
		var thisSong = data.tracks.items[0];
		console.log(thisSong.artists[0].name);
		console.log(thisSong.name);
		console.log(thisSong.album.name);
		console.log(thisSong.href);
	});
};

function movieThis() {
	var omdbReqUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + name;
	request(omdbReqUrl, function(error, response, body) {
		if(error) return console.log(error);
		if (response.statusCode !== 200) return console.log(response.statusCode);
		console.log(body);
		console.log("Title: " + body.Title); //title of movie
		console.log("Year: " + body.Year); //release year
		console.log("IMDB Rating: " + body.Ratings[0].value); //IMDB rating
		console.log("Rotten Tomatoes Rating: " + body.Ratings[1].value); //rotten tomatoes rating
		console.log("Country: " + body.Country); //production country
		console.log("Language: " + body.Language); //language
		console.log("Plot: " + body.Plot); //plot
		console.log("Actors: " + body.Actors); //actors
	});
};

function doThis() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if(error) return console.log(error);
		var dataArr = data.split(",");
		command = dataArr[0];
		name = dataArr[1];
		spotifyThis();
	});
};