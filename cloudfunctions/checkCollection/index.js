// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	const checkCollected = await db.collection('collection').where({
		userId: event.userId,
		articleId: event.articleId
	}).get()

	if (checkCollected.data.length > 0) {
		const removeResult = await db.collection('collection').where({
			userId: event.userId,
			articleId: event.articleId
		}).remove()
		return removeResult
	} else {
		const result = await db.collection('collection').add({
			data: {
				userId: event.userId,
				articleId: event.articleId,
				collectedTime: new Date()
			}
		})
		return result
	}
}