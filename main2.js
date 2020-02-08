let getDarkSkyData = require('./darksky.js')

async function main2() {
	getDarkSkyData()
}

main2().then(() => {
	setInterval(main2, 5*60*1000)
})