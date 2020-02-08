let axios = require('axios')
let fs = require('fs')

async function getAPIKey(url) {
	let apiKey =  await axios.get(url).then(res => {
		str = res.data
		key = str.match(/apiKey=.{32}/)[0]
		key = key.split('=')
		return key[1]
	})
	return apiKey
}

async function getWundergroundData() {
	let today = new Date()
	today.setDate(today.getDate() - 1)
	let year = (today.getYear() + 1900).toString()
	let month = today.getMonth() + 1
	if (month < 10) {
		month = '0' + month
	} else {
		month = '' + month
	}
	let date = today.getDate().toString()

	let dateString = [year, month, date].join('-')
	let url = 'https://www.wunderground.com/history/daily/vn/soc-son/VVNB/date/' + dateString + '/'

	getAPIKey(url).then(apiKey => {
		let start = year + month + date
		let end = year + month + date
		let reqURL = 'https://api.weather.com/v1/location/VVNB:9:VN/observations/historical.json?apiKey=' + 
			apiKey + '&units=e&startDate=' + start + 
			'&endDate=' + end

		let row = ['Time', 'Temperature', 'Dew Point', 'Humidity', 'Wind', 'Wind Speed',
		'Win Gust', 'Pressure', 'Condition', 'Visibility']

		for (let i in row) {
			row[i] = row[i].padStart(Math.max(row[i].length + 3, 15)) + ','
		}

		let fd = fs.openSync('wunderground/' + dateString + '.txt', 'w')
		axios.get(reqURL).then(res => {
			fs.writeSync(fd, row.join('\t') + '\n')
			weatherData = res.data.observations
			for (let i in weatherData) {
				let tmpWeather = weatherData[i]
				let tmpTime = new Date(tmpWeather.valid_time_gmt * 1000)
				tmpTime.setMinutes(tmpTime.getMinutes() + tmpTime.getTimezoneOffset() + 420)
				tmpTime = [tmpTime.getHours().toString().padStart(2, '0'), tmpTime.getMinutes().toString().padStart(2, '0')].join(':')
				let tmpTemperature = tmpWeather.temp
				let tmpDewPoint = tmpWeather.dewPt
				let tmpHumidity = tmpWeather.rh
				let tmpWind = tmpWeather.wdir_cardinal
				let tmpWindSpeed = tmpWeather.wspd
				let tmpWindGust = tmpWeather.gust
				let tmpPressure = tmpWeather.pressure
				let tmpCondition = tmpWeather.wx_phrase
				let tmpVisibility = tmpWeather.vis
				let tmpData = [tmpTime, tmpTemperature, tmpDewPoint, tmpHumidity, tmpWind, tmpWindSpeed, tmpWindGust, tmpPressure, tmpCondition, tmpVisibility]
				for (let j in tmpData) {
					tmpData[j] = (tmpData[j] || '0').toString().padStart(row[j].length - 1) + ','
				}
				fs.writeSync(fd, tmpData.join('\t') + '\n')
			}
		})
	})
}

getWundergroundData()

module.exports = getWundergroundData