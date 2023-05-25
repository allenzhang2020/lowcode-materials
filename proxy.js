// 引入模块
const http = require('http');
const httpProxy = require('http-proxy');

// 创建代理对象
const proxy = httpProxy.createProxyServer({});

// 定义一个对象存储不同请求路径转发次数
const count = {};

// 监听 proxyReq 事件，在代理请求发送前执行一些操作
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  // 获取请求路径（去掉查询参数）
  const path = req.url.split('?')[0];
  // 如果对象中没有该路径，就初始化为 0，否则就加一
  count[path] = count[path] ? count[path] + 1 : 1;
  
});

// 监听 end 事件，在代理请求结束后执行一些操作
proxy.on('end', function(req, res, proxyRes) {
  // 打印日志信息，包括请求方法、路径、状态码和转发次数
  console.log(`${req.method} ${req.url} => ${proxyRes.statusCode} (${count[req.url.split('?')[0]]})`);
});

// 创建代理服务器
const server = http.createServer(function(req, res) {
  // 根据请求路径判断要转发到哪个目标服务器（和之前一样）
  if (req.url.startsWith('/lowcode/api')) {
    console.log("/lowcode/api的请求");
    proxy.web(req, res, { target: 'http://localhost:8080' });//后端的请求地址，即需要代理的地址
  } else if(req.url.startsWith('/api')){
    console.log("/api的请求");
    proxy.web(req, res, { target: 'http://localhost:8087' });//后端的请求地址，即需要代理的地址
  }
  else if (req.url.startsWith('/preview.html/')) {
    console.log("/preview.html的请求");
    // res.writeHead(301, {'Location':'http://localhost:5556/preview.html'});
    // res.end();
  } else {
    console.log("其他请求接口的请求");
    proxy.web(req, res, { target: 'http://localhost:3333' });//其他请求走回前端的地址
  }

  
});


// 监听端口（和前端的启动端口保持一致）
server.listen(3333, ()=>{
    console.log("代理服务已经启动！！！");
});
