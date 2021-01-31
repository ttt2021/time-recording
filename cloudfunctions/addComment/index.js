// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	const checkLike = await db.collection('commentsLike').where({
		commentId: event.commentId,
		userId: event.userId
	}).get()
	// return checkLike
	const getInfo = await db.collection('comments').where({
		_id: event.commentId
	}).get()
	let likes = getInfo.data[0].commentLike

	if (checkLike.data.length > 0) {
		const reduceUpdated = await db.collection('comments').where({
			_id: event.commentId
		}).update({
			data: {
				commentLike: likes - 1
			}
		})
		const removeResult = await db.collection('commentsLike').where({
			commentId: event.commentId,
			userId: event.userId
		}).remove()
		return removeResult
	} else {
		const updated = await db.collection('comments').where({
			_id: event.commentId
		}).update({
			data: {
				commentLike: likes + 1
			}
		})
		const result = await db.collection('commentsLike').add({
			data: {
				userId: event.userId,
				commentId: event.commentId,
				likeTime: new Date()
			}
		})
		return result
	}
}