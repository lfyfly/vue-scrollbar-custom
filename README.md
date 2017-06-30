# 什么是vue-scrollbar-custom？
vue自定义垂直滚动条样式组件,适用于PC端

# [DEMO](https://lfyfly.github.io/vue-scrollbar-custom/)
# [GITHUB](https://github.com/lfyfly/vue-scrollbar-custom)

# 安装与引用
## npm安装

```
npm install vue-scrollbar-custom --save-dev
```

## 局部引用
```js
import vScrollbar from 'vue-scrollbar-custom'
```
```js

export default {
  name: 'app',
  components: {
    vScrollbar
  }
}

```
## 全局引用(在main.js中)
```js
  import vScrollbar from 'vue-scrollbar-custom'
  Vue.component('v-scrollbar', vScrollbar)
```
# 开始使用
## 参数
```js
 props: {
    isTopBar: { // 是否为顶部滚动条
      type: Boolean,
      default: false
    },
    isHideBar: { // 是否在鼠标不在滚动区域时隐藏滚动条
      type: Boolean,
      default: false
    },
    barContainerStyle: { // 滚动条容器样式对象
      type: Object,
      default: function () {
        return {
          width: '8px',
        }
      }
    },

    barStyle: {  // 容器内滚动条样式对象
      type: Object,
      default: function () {
        return {
          width: '6px',
          borderRadius: this.isHideBar ? '3px' : '',
          background: '#ccc'
        }
      }
    },
    topBarStyle: { // 顶部滚动条样式对象(一般只设置高度和背景色)
      type: Object,
      default: function () {
        return {
          height: '3px',
          backgroundColor: '#17ce28'
        }
      }
    }
  },
```
### 注意
isTopBar 和 isHideBar 不能同时为true

## slot
slot | header 2
---|---
默认slot | 默认插值位置是内容容器内
slot(name="barIn") | 滚动条元素内
slot(name="topBarIn") | 顶部滚动条元素内
## 事件
### scroll事件
因为只通过特殊布局隐藏了滚动条而已，所以scroll事件其实就是原生的scroll事件
### html
```html
<v-scrollbar class="vScrollbar1" @scroll="scrollFn">
    <h1 v-for="n in 30">default</h1>
</v-scrollbar>
```
### methods
```js
 scrollFn(e) {
      console.log(e.target.className)
      console.log(e.target.scrollTop)
    }
```

