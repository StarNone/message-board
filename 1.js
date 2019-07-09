const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const ejs = require("ejs");
const path = require("path");
var port = 3000;
http.createServer((req,res)=>{
    switch(req.url){
        case "/":
        case "index.html":
            var file = path.join(__dirname,"index.html");
            var datas = fs.readFileSync(file,"utf-8");
            var BLOG = path.join(__dirname,"blog.txt");
            if(fs.existsSync(BLOG)){
                var blogdata = fs.readFileSync(BLOG,"utf-8");
                var posts = JSON.parse(blogdata);
            } else {
                var posts = {};
            }
            var html = ejs.render(datas,{data:posts});
            res.end(html);
            break;
        case "/save":
            var str = "";
            req.on("data",(chunk)=>str += chunk);
            req.on("end",()=>{
                var obj = querystring.parse(str);
                var post = {
                    title:obj.title,
                    author:obj.author,
                    content:obj.content,
                    time:new Date().toLocaleDateString()
                }
                var BLOG = path.join(__dirname,"blog.txt");
                if(fs.existsSync(BLOG)){
                    var str1 = fs.readFileSync(BLOG,"utf-8");
                    var arr = JSON.parse(str1);
                } else {
                    var arr = {};
                }
                arr.push(post);
                fs.writeFile(BLOG,JSON.stringify(arr),(err)=>{
                    if(err) return;
                    res.writeHead(200,{"content-type":"text/html;charset=utf-8"});
                    res.write("<h1>发表成功<a href='/'>返回首页</a></h1>");
                })
            })
            break;
        default:
            var file = path.join(__dirname,req.url);
            if(fs.existsSync(file) && fs.statSync(file).isFile()){
                data = fs.readFileSync(file);
                res.end(data);
            } else {
                res.end();
            }
            break;
    }
}).listen(port,()=>{
    console.log(`服务器已经成功在${port}端口运行...`);
})