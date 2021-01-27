const addArticle = {
  className: 'addArticle',
  bindTab: 'go',
  goPage: 'newArticle',
  icon: '../../../images/article.jpg',
  title: '新增文章'
}

const articles = {
  className: 'articles',
  bindTab: 'go',
  goPage: 'articles',
  icon: '../../../images/articles.jpg',
  title: '文章管理'
}

const draft = {
  className: 'draft',
  bindTab: 'go',
  goPage: 'draft',
  icon: '../../../images/draft.jpg',
  title: '草稿箱'
}

const people = {
  className: 'people',
  bindTab: 'go',
  goPage: 'people',
  icon: '../../../images/people.jpg',
  title: '人员管理'
}

const kind = {
  className: 'kind',
  bindTab: 'go',
  goPage: 'kind',
  icon: '../../../images/kind.jpg',
  title: '分类管理'
}

const homeItems = {
  addArticle,
  people,
  kind,
  articles,
  draft
}

export default homeItems;