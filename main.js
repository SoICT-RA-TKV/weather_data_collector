let env = require('dotenv').config().parsed
let WundergroundData = require('./wunderground')
let OpenWeatherMapData = require('./openweathermap')
let AirBoxData = require('./airbox')
let Darksky = require('./darksky')
let mongodb = require('mongodb')

async function main() {
	var mongoClient = mongodb.MongoClient
	var url = env.URI
	var srv = await mongoClient.connect(url)
	var db = srv.db('weather')

	WundergroundData(db.collection('wunderground'))
	OpenWeatherMapData(db.collection('openweathermap'))
	AirBoxData(db.collection('airbox'))
	Darksky(db.collection('darksky'))
}

main()