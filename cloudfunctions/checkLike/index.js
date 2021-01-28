// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	// 查询是否已点赞
	const checkLike = await db.collection('likes').where({
		userId: event.userId,
		articleId: event.articleId
	}).get()
	// return checkLike
	const getInfo = await db.collection('articles').where({
		_id: event.articleId
	}).get()
	let likes = getInfo.data[0].likes

	if (checkLike.data.length > 0) {
		const reduceUpdated = await db.collection('articles').where({
			_id: event.articleId
		}).update({
			data: {
				likes: likes - 1
			}
		})
		const removeResult = await db.collection('likes').where({
			userId: event.userId,
			articleId: event.articleId
		}).remove()
		return removeResult
	} else {
		const updated = await db.collection('articles').where({
			_id: event.articleId
		}).update({
			data: {
				likes: likes + 1
			}
		})
		const result = await db.collection('likes').add({
			data: {
				userId: event.userId,
				articleId: event.articleId,
				userAvatar: event.userAvatar,
				likeTime: new Date()
			}
		})
		return result
	}

}