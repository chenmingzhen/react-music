<p align="center">
  <a href="https://ant.design">
    <img width="200" src="http://193.112.175.198/music/musical.png">
  </a>
</p>

<h1 align="center">React Music</h1>

<div align="center"></div>

## 🐛🐛 修复

- 🌈 修复 Can't perform a React state update on an unmounted component 异常 2020/7/21
- 🍕 修复歌单页面偶尔的 coverUrl undefined 或快速切换引起 undefined 错误 2020/7/21
- 🎄 修复 request 的 catch 捕获 控制台不报 uncatch 错误 但是需要注意 添加 catch 后 song 类与 chart 组件部分数据要进行 undefined 判断 否则会出错 2020/7/23

## 🛠🛠 优化

- 👍 切换路由或更新视图 取消先前请求 优化网络性能 2020/7/21
- 👨‍🔧 优化返回歌单再次回到全部选项 offset 为 1 的情况 2020/7/22

## ⌚⌚ 更新

- 🖥 完成排行榜页面 新增返回顶部组件 循环异步获取数据 2020/7/23
