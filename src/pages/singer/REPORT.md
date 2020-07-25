<p align="center">
  <a href="https://ant.design">
    <img width="200" src="http://193.112.175.198/music/musical.png">
  </a>
</p>

<h1 align="center">React Music</h1>

<div align="center"></div>



## 布局滚动情况
------- 

### 需求一

歌手默认加载个数，当滑到底端自动更新下一个偏差页

### 出现状况

滚动事件无法执行 不管是在标签中添加react合成事件onScroll还是getElementById
找到元素，或者ReactDom执行滚动事件 均无法执行，

### 解决方法

因为singer-wrapper的宽高是100%的 而父容器是固定90vh左右，如果height设为100%
高度就与父容器一致 但不会出现滚动事件 即使设置了overflow: scroll;
如果不设置height 会由里面的内容撑开 有自己的高度 但是还是无法触发滚动事件
由于我的布局关系 需要把wrapper给一个确切的值 才能触发滚动事件 不符合我的预期

