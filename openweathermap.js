let axios = require('axios')
let fs = require('fs')

let collection = null

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
	let date = today.getDate().toString().padStart(2, '0')

	let dateString = [year, month, date].join('-')

	if (!fs.existsSync('openweathermap/' + dateString + '.txt')) {
		fd = fs.openSync('openweathermap/' + dateString + '.txt', 'w')
		fs.writeSync(fd, row.join('\t') + '\n')
	} else {
		fd = fs.openSync('openweathermap/' + dateString + '.txt', 'a')
	}

	let data = await axios.get(url)
	data = data.data
	let tmpTime = today
	tmpTime.setMinutes(tmpTime.getMinutes() + tmpTime.getTimezoneOffset() + 420)
	tmpTime = [tmpTime.getHours().toString().padStart(2, '0'), tmpTime.getMinutes().toString().padStart(2, '0')].join(':')
	let tmpMain = data.weather[0].main
	if (tmpMain != null) {
		tmpMain = tmpMain.replace(' ', '_').replace(',', '/')
	}
	let tmpDescription = data.weather[0].description
	if (tmpDescription != null) {
		tmpDescription = tmpDescription.replace(' ', '_').replace(',', '/')
	}
	let tmpTemperature = data.main.temp
	let tmpPressure = data.main.pressure
	let tmpHumidity = data.main.humidity
	let tmpVisibility = data.visibility
	let tmpWinSpeed = data.wind.speed
	let tmpWinDeg = data.wind.deg
	let tmpClouds = data.clouds.all
	let tmpData = [tmpTime, tmpMain, tmpDescription, tmpTemperature, tmpPressure, tmpHumidity, tmpVisibility,
		tmpWinSpeed, tmpWinDeg, tmpClouds]

	let jsonData = {
		'Time': today,
		'OpenWeatherMap_Main': tmpMain,
		'OpenWeatherMap_Description': tmpDescription,
		'OpenWeatherMap_Temperature': tmpTemperature,
		'OpenWeatherMap_Pressure': tmpPressure,
		'OpenWeatherMap_Humidity': tmpHumidity,
		'OpenWeatherMap_Visibility': tmpVisibility,
		'OpenWeatherMap_WindSpeed': tmpWinSpeed,
		'OpenWeatherMap_WindDeg': tmpWinDeg,
		'OpenWeatherMap_Clouds': tmpClouds
	}

	console.log(jsonData)

	collection.updateOne({"Time": jsonData['Time']}, {"$set": jsonData}, {"upsert": true})

	// for (let j in tmpData) {
	// 	tmpData[j] = (tmpData[j] || '0').toString().padStart(row[j].length - 1) + ','
	// }
	// fs.writeSync(fd, tmpData.join('\t') + '\n')
	// fs.closeSync(fd)
}

getOpenWeatherMapData().then(() => {
	setInterval(getOpenWeatherMapData, 1*60*1000)
})

async function setDB(col) {
	collection = col
}

module.exports = setDB