var express = require('express');
var fs = require('fs');
var session = require('express-session');
var path = 'G:\\nodeProject';

app.use(cookieParser('sourceweb'));
app.use(session({
    secret: 'sourceweb',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24   //有效期一天
    }
}));


/**
 * 设置中间件，监控在该拦截器后面的所有请求
 * || arr[1] === 'stylesheets' || arr[1] === 'javascripts' || arr[1] === 'images' || arr[1] === 'upload'
 * 将公共目录的文件放在拦截器之前，防止拦截public中的文件，以至于无法加载白名单中的public中的文件，js、css、image
 */

/**
 * 拦截器
 */
app.use(function (req, res, next) {   
    if (req.session.user) {
        //用户登录过
        next();
    } else {
        //解析用户请求路径
        var arr = req.url.split('/');
       
        //去除get请求携带的参数
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split('?')[0];
        }

        if (arr.length > 1) {
            if (arr[1] === 'adminlogin' || arr[1] === 'adminlogout' || arr[1] === 'login_commit'||arr[1] === 'video') {
                next();
            } else {
                logger.error('intercept：用户未登录执行登录拦截，路径为：' + arr[1]);
                res.redirect('/adminlogin');  // 将用户重定向到登录页面
                res.end();
            }
        }
    }


});




const app = express();

  fs.readdir(path,function (err,files){
    if(err){
      return console.log('folder is not exist!');
    }
    app.use(express.static(path));
    app.get(path+'/*', function (req, res) {
        res.sendFile( __dirname + "/" + req.url );
        console.log("Request for " + req.url + " received.");
    })       
    //如果访问网页和本地同名，可以使用以下版本
    app.get(path+'/*.html', function (req, res) {
       res.sendFile( __dirname + "/" + req.url );
       console.log("Request for " + req.url + " received.");
    })    
    // 404
    app.use((req, res, next) => {
      res.status(404).end('')
    })

  })
  
  

  const server = app.listen(80, () => {
    
  })
  server.on('error', ({ message }) => { node.status({ text: message, fill: 'red', shape: 'ring' }) })
 

