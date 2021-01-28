// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	let allArticles = []
	const Max_LIMIT = 100
	await db.collection('articles').count().then(async res => {
		let times = Math.ceil(res.total / Max_LIMIT)
		for (let i = 0; i < times; i++) {
			await db.collection('articles').orderBy('createTime', 'desc').orderBy('openId', 'asc').skip(i * Max_LIMIT).limit(Max_LIMIT).get().then(res => {
				allArticles = allArticles.concat(res.data)
			})
		}
	})
	
	return allArticles
}