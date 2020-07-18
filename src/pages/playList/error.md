# ❌❌bug总结

------

> * 不能在shouldComponentUpdate和componentWillUpdate调用setState，造成循环调用
> * #####[资料](https://zhidao.baidu.com/question/716771893935519725.html)
 
------

> * LazyLoad停留在所在区域 会不停地发送img的请求 停止使用

-------

> * 因为在render中进行axios请求 所以使用shouldComponentUpdate判断是否是要重新渲染  