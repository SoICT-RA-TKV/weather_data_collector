let axios = require('axios')
let fs = require('fs')

async function getOpenWeatherMapData() {
	const apiKey = '72f5455137b440f773d48b8d98081892'

	let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + 'Hanoi' + '&APPID=' + apiKey

	let row = ['Time', 'Main', 'Description', 'Temperature', 'Pressure', 'Humidity', 'Visibility',
		'Win Speed', 'Win Deg', 'Clouds']

	for (let i in row) {
		row[i] = row[i].padStart(Math.max(row[i].length + 3, 15)) + ','
	}
	let today = new Date()
	today.setMinutes(today.getMinutes() + today.getTimezoneOffset() + 420)
	let year = (today.getYear() + 1900).toString()
	let month = today.getMonth() + 1
	if (month < 10) {
		month = '0' + month
	} else {
		month = '' + month
	}
	let date = today.getDate().toString()

	let dateString = [year, month, date].join('-')

	if (!fs.existsSync('openweathermap/' + dateString + '.txt')) {
		fd = fs.openSync('openweathermap/' + dateString + '.txt', 'w')
		fs.writeSync(fd, row.join('') + '\n')
	} else {
		fd = fs.openSync('openweathermap/' + dateString + '.txt', 'a')
	}

	let data = await axios.get(url)
	data = data.data
	let tmpTime = new Date()
	tmpTime.setMinutes(tmpTime.getMinutes() + tmpTime.getTimezoneOffset() + 420)
	tmpTime = [tmpTime.getHours().toString().padStart(2, '0'), tmpTime.getMinutes().toString().padStart(2, '0')].join(':')
	let tmpMain = data.weather[0].main
	let tmpDescription = data.weather[0].description
	let tmpTemperature = data.main.temp
	let tmpPressure = data.main.pressure
	let tmpHumidity = data.main.humidity
	let tmpVisibility = data.visibility
	let tmpWinSpeed = data.wind.speed
	let tmpWinDeg = data.wind.deg
	let tmpClouds = data.clouds.all
	let tmpData = [tmpTime, tmpMain, tmpDescription, tmpTemperature, tmpPressure, tmpHumidity, tmpVisibility,
		tmpWinSpeed, tmpWinDeg, tmpClouds]
	for (let j in tmpData) {
		tmpData[j] = (tmpData[j] || '0').toString().padStart(row[j].length - 1) + ','
	}
	fs.writeSync(fd, tmpData.join('') + '\n')
	fs.closeSync(fd)
}

module.exports = getOpenWeatherMapData