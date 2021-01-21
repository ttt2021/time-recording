// 格式化时间函数

// 年月日 时分秒
const datetime = function (e) {
  const year = e.getFullYear()
  const month = e.getMonth() + 1
  const day = e.getDate()
  const hour = e.getHours()
  const minute = e.getMinutes()
  const second = e.getSeconds()
  const date = `${year}-${month}-${day} ${hour}:${minute}:${second}`
  return date
}

// 计算两日期相差的天数
const diffDays = function () {
  // 将时间转成毫秒数
  const start = Date.parse("2021-01-15T15:32:15Z")
  const end = Date.parse(new Date())
  // 计算天数
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  return days
}

// 将时间转成日期
const dayDate = function (e) {
  const year = e.getFullYear()
  const month = e.getMonth() + 1
  const day = e.getDate()
  const date = `${year}-${month}-${day}`
  return date
}

// 获取当前月份
const currentMonths = function (e) {
  const year = e.getFullYear()
  const month = e.getMonth() + 1
  let date
  if (Math.floor(month / 10) === 0) {
    date = `${year} 年 0${month} 月`
  } else {
    date = `${year} 年 ${month} 月`
  }
  return date
}

// 前一个月后一个月
const prevMonths = function (e, addMonths) {
  let curYear = Number(e.slice(0, 4)) // 当前年份
  let curMonth = Number(e.slice(7, 9)) // 当前月份
  // console.log(curYear, curMonth)
  curYear = curMonth + addMonths > 12 ? (curYear + 1) : curYear
  if (curMonth + addMonths === 0) {
    curYear--
    curMonth = 12
  } else {
    if (curMonth + addMonths > 12) {
      curMonth = '01'
    } else {
      curMonth = curMonth + 1 < 10 ? '0' + (curMonth + addMonths) : (curMonth + addMonths)
    }
  }
  return `${curYear} 年 ${curMonth} 月`
}

// 年月
const curYearMonth = function (e) {
  let curYear = e.slice(0, 4) // 当前年份
  let curMonth = e.slice(7, 9) // 当前月份
  return `${curYear}-${curMonth}`
}

// 计算当前月份天数
const getDaysOfMonth = function (e) {
  let year = e.slice(0, 4) // 当前年份
  let month = e.slice(7, 9) // 当前月份
  month = parseInt(month)
  year = parseInt(year)
  switch (month) {
    case 1: 
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? 29 : 28;
    default: 
      return 0;
  }
}

module.exports = {
  datetime,
  diffDays,
  dayDate,
  currentMonths,
  prevMonths,
  curYearMonth,
  getDaysOfMonth
}