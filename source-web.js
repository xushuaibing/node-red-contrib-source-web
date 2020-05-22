var express = require('express');
var fs = require('fs');
module.exports = RED => {
  // 输入节点
  RED.nodes.registerType('source-web', class {
    constructor (config) {
      const node = this
      RED.nodes.createNode(node, config)
      const web_config = RED.nodes.getNode(config.webconfig)
      const app = express();
      var path = web_config.path;
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

      const server = app.listen(web_config.port, () => {
        node.status({ text: `port: ${web_config.port}`, fill: 'green', shape: 'dot' })
        node.log(`listening on port ${web_config.port}`)
      })
      server.on('error', ({ message }) => { node.status({ text: message, fill: 'red', shape: 'ring' }) })
      node.on('close', () => server.close())
    }
  })
}
