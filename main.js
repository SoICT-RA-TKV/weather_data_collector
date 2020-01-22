let getWundergroundData = require('./wunderground')
let getOpenWeatherMapData = require('./openweathermap')

async function main() {
	getWundergroundData()
	getOpenWeatherMapData()
}

main().then(() => {
	setInterval(main, 1*60*1000)
})