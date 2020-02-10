let axios = require('axios')
let fs = require('fs')

async function getDarkSkyData() {
	const apiKey = '3996e9f26ff4b088644a901f3b718d97'
	const latitude = '21.0044157'
	const longitude = '105.8444014'

	let url = `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}`

	let row = ['Time', 'Summary', 'Icon', 'PrecipIntensity', 'PrecipProbability', 'PrecipType', 'Temperature', 'ApparentTemperature',
		'DewPoint', 'Humidity', 'Pressure', 'WindSpeed', 'WindGust', 'WindBearing', 'CloudCover', 'UVIndex', 'Visibility', 'Ozone']

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

	if (!fs.existsSync('darksky/' + dateString + '.txt')) {
		fd = fs.openSync('darksky/' + dateString + '.txt', 'w')
		fs.writeSync(fd, row.join('\t') + '\n')
	} else {
		fd = fs.openSync('darksky/' + dateString + '.txt', 'a')
	}

	let data = await axios.get(url)
	data = data.data
	let tmpTime = new Date()
	tmpTime.setMinutes(tmpTime.getMinutes() + tmpTime.getTimezoneOffset() + 420)
	tmpTime = [tmpTime.getHours().toString().padStart(2, '0'), tmpTime.getMinutes().toString().padStart(2, '0')].join(':')
	let tmpSummary = data.currently.summary
	let tmpIcon = data.currently.icon
	let tmpPrecipIntensity = data.currently.precipIntensity
	let tmpPrecipProbability = data.currently.precipProbability
	let tmpPrecipType = data.currently.precipType
	let tmpTemperature = data.currently.temperature
	let tmpApperentTemperature = data.currently.apparentTemperature
	let tmpDewPoint = data.currently.dewPoint
	let tmpHumidity = data.currently.humidity
	let tmpPressure = data.currently.pressure
	let tmpWindSpeed = data.currently.windSpeed
	let tmpWindGust = data.currently.windGust
	let tmpWindBearing = data.currently.windBearing
	let tmpCloudCover = data.currently.cloudCover
	let tmpUVIndex = data.currently.uvIndex
	let tmpVisibility = data.currently.visibility
	let tmpOzone = data.currently.ozone
	let tmpData = [tmpTime, tmpSummary, tmpIcon, tmpPrecipIntensity, tmpPrecipProbability, tmpPrecipType, tmpTemperature, tmpApperentTemperature,
		tmpDewPoint, tmpHumidity, tmpPressure, tmpWindSpeed, tmpWindGust, tmpWindBearing, tmpCloudCover, tmpUVIndex, tmpVisibility, tmpOzone]
	for (let j in tmpData) {
		tmpData[j] = (tmpData[j] || '0').toString().padStart(row[j].length - 1) + ','
	}
	fs.writeSync(fd, tmpData.join('\t') + '\n')
	fs.closeSync(fd)
}

module.exports = getDarkSkyData

getDarkSkyData()