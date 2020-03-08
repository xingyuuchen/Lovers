//logs.js
const util = require('../../utils/util.js')

var heart_beat_period = 2100
var eat_period = 2100
var my_heart_beat_anim
var heart_beat_anim_id
var eat_anim_id
var bg_anim

Page({
  data: {
		heart_beat_anim: '',
		eat_anim: '',
		text_anim: '',
		eat_image_src: '../../images/open.png',
		wbx_src: '../../images/wbx.png',
		wbx_anim: '',
		text1: "", text2: "", text3: "", text4: "", text5: "",

		bg_src: 'http://49.235.29.121:5002/get_photo?photo_name=bg_before.png',
		bg_src_temp: 'https://s2.ax1x.com/2020/02/22/',
				// 'http://49.235.29.121:5002/get_photo?photo_name=',
		bg_src_arr: ['3M6g2T.gif', '3M6oI1.gif']
	},
	

  onLoad: function () {
		this.setData({
			text1: '记得这段对话？',
			text2: '右边呢是我的星跳！  \n',
			text3: '等一会点它试试？',
			text4: '希望这个程序不会出错...',
			text5: '你肯定记得这段对话？听一听',
		})

		const backgroundAudioManager = wx.getBackgroundAudioManager()
		backgroundAudioManager.coverImgUrl = 'http://49.235.29.121:5002/get_photo?photo_name=album.jpg'
		backgroundAudioManager.singer = 'your陈星宇'
		backgroundAudioManager.title = '记得这段对话？'
		backgroundAudioManager.src = 'http://49.235.29.121:5002/get_mp3?song_name=unfold_gift.m4a'
		backgroundAudioManager.play()
		var that = this
		backgroundAudioManager.onEnded(function () {
			var anim1 = wx.createAnimation()
			anim1.opacity(0).step({ duration: 70 }).opacity(0.99).step({ duration: 2000 })
			that.setData({
				text_anim: anim1.export(),
				text1: '又是礼物ya',
				text2: '右边呢是我的星跳！  \n',
				text3: '天上的星星笑地上的人，总是不能懂不能觉得足够',
				text4: 'This is pure and simple, and u must realize\n That this is coming from my heart and not my head',
				text5: '时间再一次走到了清爽的秋天。这两个秋天，都记录了些东西，并且传达给你。是想留下点什么给自己，也是宣读下内心，还是为了给未来留下点回忆的线索。\n\n最终还是决定用写下来的方式，传达这一些感情，——几乎所有重要的时刻我们都一直认真地记录着它们。最终还是决定用写下来的方式，传达这一些感情，它们很纯很简单——发生地毫不刻意。\n\n这回我不想像7月份那次不明不白地重新开始又不明不白地结束了。毕竟上次之后我才真正感觉到了每个人表达爱的方式是真的不一样的，而我缺少的就是去理解不同人的表达方式。\n\n开学的场景依旧是那样熟悉，我们刻意闲逛到长安的母校来看这开学的热闹。又或者说是来让这热闹看我们，因为这热闹是他们的，和我们无关。我们只是一个站票观众，我们会看着她们开学，军训......也许再看着她们离开。一如当年或许在大一就见过吴秉宣的我，恍不知再过上小半年就能和她开启美好的恋爱时光。'
			})
			that.play_music()
		})
  },

	onShow: function () {
		this.eat_animation(5000)
		this.heart_beat(2100)
	},
	onHide: function () {
		clearInterval(bg_anim)
		clearInterval(eat_anim_id)
	},

	eat_animation: function(interval) {
		var my_eat_anim = wx.createAnimation()
		for (let i=0; i<3; i++) {
			my_eat_anim.translateX(280).step({ duration: interval }).translateY(-250).step({ duration: interval }).
				translateX(-20).step({ duration: interval }).translateY(25).step({ duration: interval })
		}
		this.setData({eat_anim: my_eat_anim.export()})
		eat_anim_id = setInterval(() => {
			if (this.data.eat_image_src === '../../images/open.png') 
				this.setData({ eat_image_src: '../../images/close.png' })
			else 
				this.setData({ eat_image_src: '../../images/open.png' })
		}, 150)
	},

	heart_beat: function (interval) {
		heart_beat_period = interval

		my_heart_beat_anim = wx.createAnimation()
		heart_beat_anim_id = setInterval(() => {
			my_heart_beat_anim.scale(0.3).step({ duration: parseInt(heart_beat_period * 5 / 7) })
				.scale(1).step({ duration: parseInt(heart_beat_period / 7) })
			this.setData({
				heart_beat_anim: my_heart_beat_anim.export()
			})
		}, heart_beat_period)
	},

	speed_up_heart_beat: function () {
		if (heart_beat_period > 1200) {
			wx.showToast({
				title: '星跳加速',
				duration: 2000,
				icon: 'success',
			})

			heart_beat_period -= 700
			clearInterval(heart_beat_anim_id)
			heart_beat_anim_id = setInterval(() => {
				my_heart_beat_anim.scale(0.3).step({ duration: parseInt(heart_beat_period * 5 / 7) })
					.scale(1).step({ duration: parseInt(heart_beat_period / 7) })
				this.setData({
					heart_beat_anim: my_heart_beat_anim.export()
				})
			}, heart_beat_period)
		} else {
			wx.showToast({
				title: '星跳加不动速了',
				duration: 2000,
				icon: 'none',
			})
		}
		console.log(heart_beat_period)
	},

	// 播放服务器音乐
	play_music: function () {
		const backgroundAudioManager = wx.getBackgroundAudioManager()
		backgroundAudioManager.coverImgUrl = 'http://49.235.29.121:5002/get_photo?photo_name=album.jpg'
		backgroundAudioManager.singer = 'your陈星宇'
		backgroundAudioManager.title = '献给宣的歌'
		backgroundAudioManager.src = 'http://49.235.29.121:5002/get_mp3?song_name=listen_together.m4a'
		backgroundAudioManager.play()

		var song_idx = 0
		var songs = ['complete.mp3', 'zhi_zu.mp3', 'small_yu.mp3']
		backgroundAudioManager.onEnded(function () {
			if (song_idx < songs.length) {
				if (songs[song_idx] === 'zhi_zu5.mp3') {
					console.log('playing zhizu5')
					var timer_id = setInterval(() => {
						if (backgroundAudioManager.currentTime >= 33 && backgroundAudioManager.currentTime <= 34) {
							console.log('天上的星星')
						}
					}, 1000)
					setTimeout(() => {
						clearInterval(timer_id)
					}, 256000)
				}
				backgroundAudioManager.title = '献宣歌:' + songs[song_idx]
				backgroundAudioManager.src = 'http://49.235.29.121:5002/get_mp3?song_name='
					+ songs[song_idx]
				backgroundAudioManager.play()
				song_idx++
			}
		})

		backgroundAudioManager.onError((err) => {
			wx.showToast({
				title: '完了出错了..',
				duration: 2000,
			})		
		})
	},

	onReady: function () {
	},

	start_bg_anim: function() {
		var i = 0
		bg_anim = setInterval(() => {
			this.setData({
				bg_src: this.data.bg_src_temp + this.data.bg_src_arr[i]
			})
			i++
			if (i == this.data.bg_src_arr.length)
				i = 0
		}, 20000)
	},

	scroll: function(event) {
		// console.log(event.detail)
	},

	wbx_shows_up: function() {
		var anim = wx.createAnimation()
		anim.opacity(0.8).step({duration: 1000})
		this.setData({wbx_anim: anim.export()})
	},

	scroll_low: function() {
		wx.showToast({
			title: '吴秉宣即将出现！',
			duration: 2000,
			icon: 'success',
		})
		this.start_bg_anim()
		
		setTimeout(() => {
			this.wbx_shows_up()
		}, 3000)

		setTimeout(() => {
			var my_eat_anim = wx.createAnimation()
			my_eat_anim.translateX(260).step({ duration: 200 })
			this.setData({ eat_anim: my_eat_anim.export() })
		}, 4000)

		setTimeout(() => {
			// this.setData({ wbx_src: '../../images/wbx2.png' })
		}, 4500)
	}
})


