// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	let allArticles = []
	const Max_LIMIT = 100
	// 获取所有文章
	await db.collection('articles').count().then(async res => {
		let times = Math.ceil(res.total / Max_LIMIT)
		for (let i = 0; i < times; i++) {
			await db.collection('articles').where({
				isPublish: "1"
			}).orderBy('createTime', 'desc').orderBy('openId', 'asc').skip(i * Max_LIMIT).limit(Max_LIMIT).get().then(res => {
				allArticles = allArticles.concat(res.data)
			})
		}
	})

	let curTitle = ''
	await db.collection('articles').where({
		_id: event.articleId
	}).get().then(res => {
		curTitle = res.data[0].title
	})

	let resultSimilarity = []
	// 对其相似度进行比较 编辑距离算法
	for (let k = 0; k < allArticles.length; k++) {
		if (allArticles[k]._id !== event.articleId) {
			let title = allArticles[k].title
			let len_cur = curTitle.length
			let len_t = title.length
			let maxtrix = []
			for (let i = 0; i <= len_cur; i++) {
				maxtrix[i] = new Array()
				for (let j = 0; j <= len_t; j++) {
					if (i == 0) {
						maxtrix[i][j] = j
					} else if (j == 0) {
						maxtrix[i][j] = i
					} else {
						// 最小值分析
						let cost = 0
						if (curTitle[i - 1] != title[j - 1]) {
							cost = 1
						}
						const temp = maxtrix[i - 1][j - 1] + cost
						maxtrix[i][j] = Math.min(maxtrix[i - 1][j] + 1, maxtrix[i][j - 1] + 1, temp)
					}
				}
			}
			let dist = maxtrix[len_cur][len_t]
			// 相似度
			let similarity = 1 / (dist + 1)
			resultSimilarity.push({
				info: allArticles[k],
				similarity: similarity
			})
		} 
	}

	// 相似度排序
	resultSimilarity.sort((a, b) => {
		return b.similarity - a.similarity
	})
	// return resultSimilarity

	// 将一半的文章返回
	let length = resultSimilarity.length / 2 + 1
	let result = resultSimilarity.slice(0, length)
	return result
}