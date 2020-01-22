let axios = require('axios')
let fs = require('fs')

async function getOpenWeatherMapData() {
	const apiKey = '72f5455137b440f773d48b8d98081892'

	url = 'http://api.openweathermap.org/data/2.5/weather?q=' + 'Hanoi' + '&APPID=' + apiKey

	row = ['Time', 'Main', 'Description', 'Temperature', 'Pressure', 'Humidity', 'Visibility',
		'Win Speed', 'Win Deg', 'Clouds']

	for (let i in row) {
		row[i] = row[i].padStart(Math.max(row[i].length + 3, 15)) + ','
	}
	today = new Date()
	year = (today.getYear() + 1900).toString()
	month = today.getMonth() + 1
	if (month < 10) {
		month = '0' + month
	} else {
		month = '' + month
	}
	date = today.getDate().toString()

	dateString = [year, month, date].join('-')

	if (!fs.existsSync('openweathermap/' + dateString + '.txt')) {
		fd = fs.openSync('openweathermap/' + dateString + '.txt', 'w')
		fs.writeSync(fd, row.join('') + '\n')
	} else {
		fd = fs.openSync('openweathermap/' + dateString + '.txt', 'a')
	}

	data = await axios.get(url)
	data = data.data
	tmpTime = new Date()
	tmpTime = [tmpTime.getHours().toString().padStart(2, '0'), tmpTime.getMinutes().toString().padStart(2, '0')].join(':')
	tmpMain = data.weather.main
	tmpDescription = data.weather[0].description
	tmpTemperature = data.main.temp
	tmpPressure = data.main.pressure
	tmpHumidity = data.main.humidity
	tmpVisibility = data.visibility
	tmpWinSpeed = data.wind.speed
	tmpWinDeg = data.wind.deg
	tmpClouds = data.clouds.all
	tmpData = [tmpTime, tmpMain, tmpDescription, tmpTemperature, tmpPressure, tmpHumidity, tmpVisibility,
		tmpWinSpeed, tmpWinDeg, tmpClouds]
	for (let j in tmpData) {
		tmpData[j] = (tmpData[j] || '0').toString().padStart(row[j].length - 1) + ','
	}
	fs.writeSync(fd, tmpData.join('') + '\n')
	fs.closeSync(fd)
}

module.exports = getOpenWeatherMapData