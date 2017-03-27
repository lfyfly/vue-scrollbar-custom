
var vDrag = {
  inserted: function (el, binding) {
    // 定位初始化
    el.style.position = 'absolute'
    el.style.cursor = 'default'
    // 父容器为限制元素，默认为 position = 'relative'
    if (getComputedStyle(el, null).position === 'static') {
      el.parentNode.style.position = 'relative'
    }

    var mouseDownFn = function (e) {

      var disX, disY
      if (!binding.modifiers.dragY) disX = e.clientX - el.offsetLeft
      if (!binding.modifiers.dragX) disY = e.clientY - el.offsetTop
      var mouseMoveFn = function (e) {
        e.preventDefault()
        var left = e.clientX - disX
        var top = e.clientY - disY

        if (left < 0) {
          left = 0
        }
        else if (left > el.parentNode.clientWidth - el.offsetWidth) {
          left = el.parentNode.clientWidth - el.offsetWidth
        }

        if (top < 0) {
          top = 0
        }
        else if (top > el.parentNode.clientHeight - el.offsetHeight) {
          top = el.parentNode.clientHeight - el.offsetHeight;
        }
        el.style.left = left + 'px'
        el.style.top = top + 'px'

        // 拖拽事件
        if (binding.value && binding.value.ondrag) {
          if (typeof binding.value.ondrag != 'function') throw 'ondrag: should be a function'
          binding.value.ondrag(e, { left: left, top: top })
        }

      }
      // mousemove
      document.addEventListener('mousemove', mouseMoveFn)

      var mouseUpFn = function () {
        document.removeEventListener('mousemove', mouseMoveFn)
        document.removeEventListener('mouseup', mouseUpFn)
      }
      //  mouseup
      document.addEventListener('mouseup', mouseUpFn)
    }

    // mousedown
    el.addEventListener('mousedown', mouseDownFn)

  }
}
export default vDrag
