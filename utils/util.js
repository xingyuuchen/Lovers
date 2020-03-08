const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatTime1 = dateStr => {
  const t = dateStr.split(/[ :]/)
  if (t[2] === 'Jan')
    t[2] = '1'
  else if (t[2] === 'Feb')
    t[2] = '2'
  else if (t[2] === 'Mar')
    t[2] = '3'
  else if (t[2] === 'Apr')
    t[2] = '4'
  else if (t[2] === 'May')
    t[2] = '5'
  else if (t[2] === 'Jun')
    t[2] = '6'
  else if (t[2] === 'Jul')
    t[2] = '7'
  else if (t[2] === 'Aug')
    t[2] = '8'
  else if (t[2] === 'Dec')
    t[2] = '12'
  else if (t[2] === 'Oct')
    t[2] = '10'
  else if (t[2] === 'Nov')
    t[2] = '11'
  else
    t[2] = '9'
  return [t[3], t[2], t[1]].map(formatNumber).join('/') + ' ' + dateStr.substring(16, 25)
}

const upd_usr_info = data => {
  // console.log(data.openid)
  // console.log(data.userInfo.nickName)
  // console.log(data.userInfo.gender)
  wx.request({
    url: 'https://www.cxingyu.cn:5002/api/upd_usr_info',
    data: {
      openid: data.openid,
      nickName: data.userInfo.nickName,
      gender: data.userInfo.gender,
      avatarUrl: data.userInfo.avatarUrl,
    },
    success: res => {
      if (res.data.success === '1') {

        if (data.bind_lovers) {
          data.bind_lovers()
        }

      } else {
        wx.showToast({
          title: '更新个人信息出错',
          icon: 'none',
        })      
      }
    },
  })
}


// 对外暴露方法
module.exports = {
  // '暴露方法名': '本地方法名'
  formatTime: formatTime,
  formatTime1: formatTime1,
  upd_usr_info: upd_usr_info,
}





