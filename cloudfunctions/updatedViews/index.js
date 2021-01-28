// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	const checkView = await db.collection('views').where({
		userId: event.userId,
		articleId: event.articleId
	}).get()
	if (checkView.data.length > 0) {
		const updated = await db.collection('views').where({
			userId: event.userId,
			articleId: event.articleId
		}).update({
			data: {
				latestViewTime: new Date()
			}
		})
		return updated
	} else {
		const result = await db.collection('views').add({
			data: {
				userId: event.userId,
				articleId: event.articleId,
				latestViewTime: new Date()
			}
		})
		return result
	}
}