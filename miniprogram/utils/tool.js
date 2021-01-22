// 防抖与节流

// 节流  立马执行，n秒后再立马执行
function throttle (fn, interval) {
  let enterTime = 0 // 触发事件
  let gapTime = interval || 1000 // 间隔时间
  return function () {
    const context = this
    const backTime = new Date() // 第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments)
      enterTime = backTime // 赋值给第一次触发的时间，保存再次触发的时间
    }
  }
}

// 防抖 n秒后延迟执行
function debounce (fn, interval) {
  let timer
  let gapTime = interval || 1000
  return function () {
    clearTimeout(timer)
    const context = this
    const args = arguments // 保存arguments，因为setTimeout是全局的
    timer = setTimeout(() => {
      fn.call(context, args)
    }, gapTime);
  }
}

module.exports = {
  throttle,
  debounce
}