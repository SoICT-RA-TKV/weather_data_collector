let axios = require('axios')
let fs = require('fs')

async function getAirBoxData() {
	let queryInfo = {
		'method': 'POST',
		'url': 'https://airbox.edimaxcloud.com/fe/query_history',
		'headers': {
			'Cookie' : 'edxsessionid=58a754290ac4172276ce269e009ba594',
			'Content-Type' : 'application/json',
			'Accept' : 'application/json, text/javascript, */*; q=0.01',
			'Accept-Encoding' : 'gzip, deflate, br',
			'Accept-Language' : 'vi,en-US;q=0.9,en;q=0.8',
			'Connection' : 'keep-alive',
			'Content-Length' : 28,
			'Host' : 'airbox.edimaxcloud.com',
			'Origin' : 'https://airbox.edimaxcloud.com',
			'Referer' : 'https://airbox.edimaxcloud.com/index.html',
			'Sec-Fetch-Dest' : 'empty',
			'Sec-Fetch-Mode' : 'cors',
			'Sec-Fetch-Site' : 'same-origin',
			'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
			'X-Requested-With' : 'XMLHttpRequest',
		},
		'data': {'device_id' : '74DA3895C446'}
	}

	let data = await axios(queryInfo)
	data = data.data

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

	let row = ['Time', 'PM1', 'PM25', 'PM10', 'Temperature', 'Humidity']

	for (let i in row) {
		row[i] = row[i].padStart(Math.max(row[i].length + 3, 15)) + ','
	}

	if (!fs.existsSync('airbox/' + dateString + '.txt')) {
		fd = fs.openSync('airbox/' + dateString + '.txt', 'w')
		fs.writeSync(fd, row.join('\t') + '\n')
	} else {
		fd = fs.openSync('airbox/' + dateString + '.txt', 'a')
	}

	let tmpTime = [today.getHours().toString().padStart(2, '0'), today.getMinutes().toString().padStart(2, '0')].join(':')
	let tmpPM1 = 'null'
	let tmpPM25 = 'null'
	let tmpPM10 = 'null'
	let tmpT = 'null'
	let tmpH = 'null'

	if (data.status == 'ok') {
		tmpPM1 = data.pm1[24]
		tmpPM25 = data.pm25[24]
		tmpPM10 = data.pm10[24]
		tmpT = data.t[24]
		tmpH = data.h[24]
	}

	tmpData = [tmpTime, tmpPM1, tmpPM25, tmpPM10, tmpT, tmpH]

	for (let j in tmpData) {
		row[j] = row[j].toString()
		tmpData[j] = (tmpData[j] || '0').toString().padStart(row[j].length - 1) + ','
	}
	fs.writeSync(fd, tmpData.join('\t') + '\n')
	fs.closeSync(fd)
}
	

getAirBoxData().then(() => {
	setInterval(getAirBoxData, 1*60*1000)
})