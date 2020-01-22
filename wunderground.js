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
	today = new Date()
	today.setMinutes(today.getMinutes() + today.getTimezoneOffset() + 420)
	today.setDate(today.getDate() - 1)
	year = (today.getYear() + 1900).toString()
	month = today.getMonth() + 1
	if (month < 10) {
		month = '0' + month
	} else {
		month = '' + month
	}
	date = today.getDate().toString()

	dateString = [year, month, date].join('-')
	url = 'https://www.wunderground.com/history/daily/vn/soc-son/VVNB/date/' + dateString + '/'

	getAPIKey(url).then(apiKey => {
		start = year + month + date
		end = year + month + date
		reqURL = 'https://api.weather.com/v1/location/VVNB:9:VN/observations/historical.json?apiKey=' + 
			apiKey + '&units=e&startDate=' + start + 
			'&endDate=' + end

		row = ['Time', 'Temperature', 'Dew Point', 'Humidity', 'Wind', 'Wind Speed',
		'Win Gust', 'Pressure', 'Condition', 'Visibility']

		for (let i in row) {
			row[i] = row[i].padStart(Math.max(row[i].length + 3, 15)) + ','
		}

		fd = fs.openSync('wunderground/' + dateString + '.txt', 'w')
		axios.get(reqURL).then(res => {
			fs.writeSync(fd, row.join('') + '\n')
			weatherData = res.data.observations
			for (let i in weatherData) {
				tmpWeather = weatherData[i]
				tmpTime = new Date((tmpWeather.valid_time_gmt + 420 * 60) * 1000)
				tmpTime = [tmpTime.getHours().toString().padStart(2, '0'), tmpTime.getMinutes().toString().padStart(2, '0')].join(':')
				tmpTemperature = tmpWeather.temp
				tmpDewPoint = tmpWeather.dewPt
				tmpHumidity = tmpWeather.rh
				tmpWind = tmpWeather.wdir_cardinal
				tmpWindSpeed = tmpWeather.wspd
				tmpWindGust = tmpWeather.gust
				tmpPressure = tmpWeather.pressure
				tmpCondition = tmpWeather.wx_phrase
				tmpVisibility = tmpWeather.vis
				tmpData = [tmpTime, tmpTemperature, tmpDewPoint, tmpHumidity, tmpWind, tmpWindSpeed, tmpWindGust, tmpPressure, tmpCondition, tmpVisibility]
				for (let j in tmpData) {
					tmpData[j] = (tmpData[j] || '0').toString().padStart(row[j].length - 1) + ','
				}
				fs.writeSync(fd, tmpData.join('') + '\n')
			}
		})
	})
}

module.exports = getWundergroundData