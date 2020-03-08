//logs.js
const util = require('../../utils/util.js')
var main_text_anim_id
var start_text_anim_id

Page({
  data: {
		btn_disable: true,
		btn_opa: 0,
		start_text: '',
		start_text_arr: ['嗯......\n', '此刻你应该和我一样，\n', '在期待着将要发生的事。\n',
							 '并且，\n', '心跳好像也有点快，\n', '那， 请你戴上耳机'],
		start_text_anim: '',

		main_text: '',
		main_text_arr: ['嗨，宣儿！', '终于', '假生日到了', '生日快乐！', '它有点傻,', '咋写啊？'],
		main_text_anim: '',

		heart_beat_anim: '',
		bg_src: 'http://49.235.29.121:5002/get_photo?photo_name=bg_before.png',
  },

  onLoad: function () {
  },

  onShow: function () {
		this.setData({
			start_text: '',
			main_text: '嗨, 宣儿!'
		})
		this.start_text_anim()
  },

	onHide: function () {
		clearInterval(main_text_anim_id)
		clearInterval(start_text_anim_id)

	},

  heart_beat: function(times, interval) {
		var myAnimation = wx.createAnimation()
		var interval1 = interval * 6 / 7
		var interval2 = interval / 7
		for (let i = 0; i < times; i++) {
			myAnimation.scale(0.3).step({ duration: parseInt(interval1) })
				.scale(1).step({ duration: parseInt(interval2) })
		}
		this.setData({
			heart_beat_anim: myAnimation.export()
		})
		setTimeout(() => {
			this.main_text_anim()
		}, 3*interval)
		setTimeout(() => {
			this.setData({
				btn_disable: false,
				btn_opa: 1
			})
		}, 18000)
	},

	start_text_anim: function () {
		var anim = wx.createAnimation()
		var i = 0
		start_text_anim_id = setInterval(() => {
			this.setData({
				start_text: this.data.start_text + this.data.start_text_arr[i],
			})
			i++
			if (i >= this.data.start_text_arr.length) {
				clearInterval(start_text_anim_id)
				this.heart_beat(100, 700)
				
			}
		}, 3000)
	},
	main_text_anim: function () {
		var anim = wx.createAnimation()
		var i = -1
		main_text_anim_id = setInterval(() => {
			i++
			if (i > this.data.main_text_arr.length - 1)
				i = 0
			anim.opacity(0.99).step({ duration: 400 }).opacity(0).step({ duration: 2000 })
			this.setData({
				main_text: this.data.main_text_arr[i],
				main_text_anim: anim.export()
			})
		}, 2800)
	},

	my_navigate: function () {
		wx.navigateTo({
			url: '../main/main',
		})
	}, 
	onReady: function () {
	},
})


