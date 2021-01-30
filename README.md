# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)



# time-recording
时光录：一个记录时光过程中技术心得的小程序

- 模块
  1. 首页
    - 轮播图
      1. 使用 swiper、swiper-item 绘制轮播图
      2. 轮播图上显示文章标题，超出打点
      3. 以文章封面图作为轮播的图片
    - 搜索栏
    - 公告
      1. 使用 swiper、swiper-item 切换公告
      2. vant组件
    - 文章列表
      1. 标题
      2. 封面图
      3. 内容显示三行，超出打点
      4. 显示分类、发表时间、评论数、观看数、喜欢数
  2. 专栏
    - 按照文章类别分成专栏
      1. 点击每个专栏，可以跳转到相关的文章页面
      2. 点击订阅按钮可以对专栏进行订阅与取消订阅的操作
        - 当用户登录时，可显示该用户的订阅专栏情况
        - 当用户未登录时，点击订阅按钮提示请登录，并跳转到我的页面进行登录操作
        - 当登录完成时，点击tabbar进行跳转回到专栏时，要注意刷新页面内容
      3. 下拉刷新
        - 当用户进行下拉刷新时，会更新该页面信息

  3. 时钟
    - 创建待办事按钮
    - 历史信息记录折叠菜单
    - 待办事显示区
  4. 寻问 (一个智能聊天机器人，可以讲笑话、聊天、算24点、看新闻、查天气)
  5. 我

    - 获取头像和昵称   
      - 设置两个模板
        - login.wxml
          判断是否已登录
        - login-popup.wxml
          - 判断是否显示该模块
          - 若显示，则弹出遮罩层及获取用户信息的按钮
            1. button按钮绑定的事件获取用户信息，并调用云函数，查看是否存在该用户，若存在，则更新用户信息，若不存在，则添加用户信息
            2. 云函数调用成功，将是否登录的变量、用户信息、按钮是否禁用、遮罩层是否显示进行修改
            3. 将用户信息挂载到全局app.globalData上
            4. 将用户信息存储到本地存储
          - 若不显示则为默认形式
      - 用户信息块
        - 若全局app.globalData上存在userInfo，则将用户信息显示出来
        - 若不存在，则放置一个按钮添加默认内容，按钮上绑定事件，用来修改遮罩层是否显示的值
      - 本地存储是否存有用户信息
        - 若本地存储已经有用户信息，则更新数据库中最新使用的时间信息并更新本地存储信息，直接显示头像和昵称，并将更新后的用户信息挂载到全局上
        - 若本地存储不存在用户信息，则显示用户信息块的默认内容
      注意：
        1. 更新数据集合中的信息（除openId外）不能直接更新，需要调用云函数更新
        2. 一个页面三层，最上层一个按钮，中间为遮罩层，下面为内容层，若遮罩层被点击时，会显示最下面的内容，因而用户信息模块使用按钮来布局

    - 栏目
      5.1 热门排行 (面经的热门排行)
      5.2 最近浏览 (当前用户的浏览记录)
      5.3 我的收藏
      5.4 留言展板 
      5.5 在线咨询 
        - 使用button按钮的open-type属性的contact

      5.6 赞赏作者
        - 调用微信小程序的API wx.previewImage在新页面中全屏预览图片

      5.7 大前端技能栈
        - 实现左右联动的效果
          - 利用 scroll-view 将页面分为左右两块，并分别利用 bindscroll 绑定滚动事件
          - 左边滚动事件实现左边自动带动右边滑动到某个位置
          - 右边滚动事件实现滑动时右边对应左边的菜单栏的切换
            - 先拿到该栏目的高度设置它的 top 和 buttom 的值
            - 判断滑动的距离是否大于设置的 top 但小于设定的 buttom 值
            - 然后对应上左边的菜单的滑动

      5.8 意见反馈
        - 使用button按钮的open-type属性的feedback

      5.9 免费获取
        - 主要是设置系统剪贴板的内容，即复制功能的实现
        - 利用微信小程序API wx.setClipboardData

      5.10 更新日志 (仿layui框架的时间轴)
        - 将每个日志信息做成组件的形式

      5.11 后台管理
        - 跳转到后台管理系统

  6. 后台管理系统
    菜单栏
      - 新增文章
        - 跳转到写文章的界面
          1. 标题 input type = 'text' maxlength
          2. 描述 textarea maxlength
          3. 类别 picker 
            - 所有类别 kindList 存入数据库kind中
            - 默认为首个kindList的名称 
          4. 封面图 cover
            - 若 cover 为空，则为首次上传，图标显示默认图片
            - 点击默认图标，可以从相册中选取一张图片，通过绑定事件获取到图片的地址 wx.chooseImage
            - 若 cover 已存在图片，可以对图片进行预览 wx.previewImage ，并且点击重新上传，也可以重新上传图片
          5. 内容
            - 可以粘贴剪切板上的内容 wx.getClipboardData
            - 也可以直接在文本框中输入内容 不设置其文本长度，其 maxlength 属性需要设置为 -1
            - 内容可以是 html 也可以是 markdown 形式的
            - 引用 Parser 的富文本，用其来将内容进行预览
          6. 保存 或 发布 
            - 使用节流的手段触发保存或发布按钮，减少连续点击的触发频率，以此来提高性能
            - 需要对文章要素进行校验
            - 校验结束后，先将封面图传入云存储中 wx.cloud.uploadFile
            - 封面图传入成功后，将文章信息添加到数据库中
            - 添加成功后，回调函数返回文章的 id
            - 利用 id 和是否发布的标志 isPublish ，调用API wx.showModal 进行页面的跳转
  
      - 文章管理 (所有文章)
        1. 可对所有文章进行删除
        2. 可对所有文章进行修改
        3. 可对未发表的文章进行发表

      - 分类管理 
        1. 对已发表的文章进行分栏管理
        2. 可以删除专栏，在删除时专栏中的文章类型变成其他类
        3. 也可以通过点击跳转到专栏文章页面
  
      - 人员管理
        - 对用户进行管理，跳转到用户界面
          1. 用户总统计
            - 用户总人数
            - 日均人数
            - 总访问人数
              - 注意：用户每次访问的时间存储在一个数组中，所有用户的访问时间则以二维数组的形式展示
            - 日均访问人数
          2. 今日统计
            - 今日访问次数
            - 新用户人数
          3. 月度新用户人数分布
            - 点击左右箭头可以显示前一个月或后一个月
            - 显示当月的新用户人数分布折线图
              - 调用画图接口，获取月天数，及当月每日的情况存储到月天数大小的数组中，索引值代表当月某日
              - 折线图与月份是相匹配的
            - 可以跳转到新页面查看日新用户的信息
          4. 月度访问人数分布
            - 与月度新用户人数分布操作一样
            - 显示当月的访问次数分布折线图
            - 可以跳转到新页面查看日用户访问的信息
          5. 所有用户信息
            - 显示所有用户的信息列表
            - 每次显示十条刷新加载，分页显示
            - 管理员设置
              - 点击设置管理员，调用用户列表函数，更新数据库信息，然后刷新显示
              - 点击取消，即可取消用户管理员权限，其操作与设置管理员操作一样
            - 点击搜索，即可跳转到搜索界面

    亮点与注意：
      1. 将底部横向滚动条隐藏起来 overflow-x: hidden;
      2. 菜单栏实现左右联动
      3. 页面下拉刷新操作
        - onPullDownRefresh 函数监听用户下拉刷新操作
        - 调用相关api，注意api的配对使用
          1. wx.showNavigationBarLoading(Object object)
          2. wx.showLoading(Object object)
          3. wx.hideLoading(Object object)
          4. wx.hideNavigationBarLoading(Object object)
          5. wx.stopPullDownRefresh(Object object)
        - 在属性结束后调用wx.stopPullDownRefresh()，否则页面将会一直保持下拉状态，不会回弹
      4. 防抖与节流
        - 防抖 debounce 延迟函数执行，并且不管触发多少次都只执行最后一次
          1. 多用于input框输入时，显示匹配的输入内容是情况
          2. n秒后延迟执行
          3. 第一次触发函数时，定义一个定时器，在n秒后执行
          4. 第二次触发时，由于闭包的特性，这时定时器已经是第一次触发时的定时器标识了，然后直接清除第一次的setTimeout，这时候第一次setTimeout中的内容就不会执行了，再定义第二次的setTimeout
          5. 以此重复4，一直清除，又一直设置，直到函数触发最后一次，定义一个定时器，并间隔n秒执行
          6. 若最后一个定时器没执行时，函数又触发了，则重复进行5
        - 节流  减少函数的触发频率
          1. 多用于页面scroll滚动，或窗口resize，或防止按钮重复点击
          2. 立马执行，n秒后再立马执行
          3. 第一次执行时，是一定能执行函数的，然后n秒内第二次触发时，若两次触发的间隔时间不足设置的间隔时间，则不会执行，之后在间隔内的触发也不会执行，直到n秒后有且只有一次触发，并且是第一次再次触发函数
      5. 虚化分类栏背景图片 定位 + filter: blur(10rpx);
      6. 父子组件间传参、调用方法
      7. 获取云数据库集合中的所有数据
      8. 制作海报，生成当前文章二维码 (难点 后期更新)
      9. 文本相似度 (难点 NLP算法) 
        文章相似度：以标题相似度为参照，使用编辑距离算法进行比较
        - 编辑距离算法：一个字符串经过增加、删除、修改后转变成另一个字符串所需要的最小操作次数
        - 编辑距离越小，相似度越大
      10. 多级评论实现
      11. 性能优化操作
        - 防抖与节流
        - 分页加载