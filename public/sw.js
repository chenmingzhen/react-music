//改变名字 重启服务 就会重新激活当前的PWA  或者代码重启缓存
const CACHE_NAME = "cache-v1.0.0";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      //添加需要缓存的内容
      cache.addAll([
        "./index.html",
        "./static/css/10.f32aa1a3.chunk.css",
        "./static/css/11.a0983636.chunk.css",
        "./static/css/12.fa3de8bc.chunk.css",
        "./static/css/13.3ace3065.chunk.css",
        "./static/css/14.4d43d6ba.chunk.css",
        "./static/css/15.8c64b3f2.chunk.css",
        "./static/css/16.8ca21cdc.chunk.css",
        "./static/css/17.adde32b5.chunk.css",
        "./static/css/18.dbc1cc67.chunk.css",
        "./static/css/2.fe9067de.chunk.css",
        "./static/css/3.eae7dc04.chunk.css",
        "./static/css/5.006ed42c.chunk.css",
        "./static/css/6.fea39390.chunk.css",
        "./static/css/7.d5978c4d.chunk.css",
        "./static/css/8.a02e1ce9.chunk.css",
        "./static/css/9.2cb83252.chunk.css",
        "./static/css/main.89f4b68b.chunk.css",
        "./static/js/10.3fb60d49.chunk.js",
        "./static/js/11.108a6f29.chunk.js",
        "./static/js/12.11b33f97.chunk.js",
        "./static/js/13.f93b27a1.chunk.js",
        "./static/js/14.158daa3b.chunk.js",
        "./static/js/15.44469287.chunk.js",
        "./static/js/16.22a336f3.chunk.js",
        "./static/js/17.f0363a02.chunk.js",
        "./static/js/18.3898fd95.chunk.js",
        "./static/js/2.a1e3f472.chunk.js",
        "./static/js/2.a1e3f472.chunk.js.LICENSE.txt",
        "./static/js/3.84798f7e.chunk.js",
        "./static/js/4.9670f591.chunk.js",
        "./static/js/5.77658551.chunk.js",
        "./static/js/6.fa2918d1.chunk.js",
        "./static/js/7.922e26cd.chunk.js",
        "./static/js/8.7de28c15.chunk.js",
        "./static/js/9.68166c16.chunk.js",
        "./static/js/main.605dd785.chunk.js",
        "./static/js/runtime-main.fbc8a38b.js",
        "./static/media/bg_singer.c8631602.jpg",
        "./static/media/iconfont.1bbb0b74.eot",
        "./static/media/iconfont.29fc50fa.woff",
        "./static/media/iconfont.8874f224.ttf",
        "./static/media/iconfont.d081eeeb.svg",
      ]);
    })
  );
});
self.addEventListener("activate", (event) => {
  console.log("activate");
  event.waitUntil(
    Promise.all([
      // 更新客户端
      self.clients.claim(),

      // 清理旧版本
      caches.keys().then(function (cacheList) {
        return Promise.all(
          cacheList.map(function (cacheName) {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
    ])
  );
});
//发送请求的时候执行
self.addEventListener("fetch", (event) => {
  console.log("fetch");
  //查询缓存，如果存在就返回缓存，否则就查询
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        if (response) return response;

        return fetch(event.request).then((response) => {
          cache.put(event.request, response.clone()).catch((e) => {
            console.log(e);
          });
          return response;
        });
      });
    })
  );
});
