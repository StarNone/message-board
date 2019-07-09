const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const path = require("path");
const ejs = require("ejs");
var port = 3000;
http.createServer((req, res) => {
    switch (req.url) {
        case "/":
        case "index":
            var file = path.join(__dirname, "index.html");
            var datas = fs.readFileSync(file, "utf-8");
            var BLOG = path.join(__dirname,"blog.txt");
            if(fs.existsSync(BLOG) && fs.statSync(BLOG).isFile()){
                var blogData = fs.readFileSync(BLOG,"utf-8");
                var posts = JSON.parse(blogData);               
            } else {
                var posts = {}
            }        
            var html = ejs.render(datas,{data:posts})
            res.end(html);
            break;
        case "/save":
            var str = "";
            req.on("data",chunk=>str += chunk);
            req.on("end",function(){
                var obj = querystring.parse(str);
                var post = {
                    title:obj.title,
                    author:obj.author,
                    content:obj.content,
                    time:new  Date().toLocaleDateString()
                };
                var BLOG = path.join(__dirname,"blog.txt");
                if(fs.existsSync(BLOG)){
                    var str1 = fs.readFileSync(BLOG,"utf-8");
                    var arr = JSON.parse(str1);
                } else {
                    var arr = [];
                }
                arr.push(post);
                fs.writeFile(BLOG,JSON.stringify(arr),err=>{
                    if(err) return;
                    res.writeHead(200,{"content-type":"text/html;charset=utf-8"});
                    res.end("<h1>发表成功<a href='/'>返回首页</a></h1>");
                })
            })
            break;
        default:
            var file = path.join(__dirname, req.url);
            if (fs.existsSync(file) && fs.statSync(file).isFile()) {
                res.end(fs.readFileSync(file));
            } else {
                res.end();
            }
            break;
    }
}).listen(port, () => {
    console.log(`服务器已在${port}端口运行起来。。。`)
})