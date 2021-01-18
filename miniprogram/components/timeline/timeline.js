// components/timeline/timeline.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		contants: {
			type: Object,
			value: {},
			observer: function (newVal) {
				console.log(newVal)
			}
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		docSrc: '../../images/circle.png'
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	}
})
