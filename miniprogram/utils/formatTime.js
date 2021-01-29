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

// const getStrLength = function (str) {
//   return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
// }

// //绘制文字：文章题目、摘要、扫码阅读
// const drawTitleExcerpt = function (context, title, content) {

//   context.setFillStyle("#000000");
//   context.setTextAlign('left');

//   if (getStrLength(title) <= 14) {
//     //14字以内绘制成一行，美观一点
//     context.setFontSize(40);
//     context.fillText(title, 40, 460);
//   } else {
//     //题目字数很多的，只绘制前36个字（如果题目字数在15到18个字则也是一行，不怎么好看）
//     context.setFontSize(30);
//     context.fillText(title.substring(0, 19), 40, 460);
//     context.fillText(title.substring(19, 36), 40, 510);
//   }
//   context.setFontSize(24);
//   context.setTextAlign('left');
//   context.setGlobalAlpha(0.7);
//   for (var i = 0; i <= 50; i += 20) {
//     //摘要只绘制前50个字，这里是用截取字符串
//     if (getStrLength(content) > 50) {
//       if (i == 40) {
//         context.fillText(content.substring(i, i + 20) + "...", 40, 570 + i * 2);
//       } else {
//         context.fillText(content.substring(i, i + 20), 40, 570 + i * 2);
//       }
//     } else {
//       context.fillText(content.substring(i, i + 20), 40, 570 + i * 2);
//     }
//   }

//   context.stroke();
//   context.save();
// }

module.exports = {
  datetime,
  diffDays,
  dayDate,
  currentMonths,
  prevMonths,
  curYearMonth,
  getDaysOfMonth
  // drawTitleExcerpt
}