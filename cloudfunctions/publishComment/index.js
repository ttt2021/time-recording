// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	const articleInfo = await db.collection('articles').where({
		_id: event.articleId
	}).update({
		data: {
			comments: event.comments
		}
	})
	const addComment = await db.collection('comments').add({
		data: {
			userId: event.userId,
			articleId: event.articleId,
			username: event.username,
			avatarUrl: event.avatar,
			commentTime: new Date(),
			content: event.content,
			commentLike: 0
		}
	})

	return {
		articleInfo,
		addComment
	}
}