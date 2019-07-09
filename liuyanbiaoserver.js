const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const path = require("path");
const ejs = require("ejs")
const port = 3000;
const mime = require("mime");
http.createServer((req,res)=>{
    switch(req.url){
        case "/":
        case "index.html":
            var file = path.join(__dirname,"index.html");
            fs.readFile(file,"utf-8",(err,data)=>{
                if(err) return;
                var datas = data;
                var BLOG = path.join(__dirname,"blog.txt");
                var end = (posts)=>{
                    var html = ejs.render(datas,{data:posts});
                    res.end(html)
                }
                if(fs.existsSync(BLOG) && fs.statSync(BLOG).isFile()){
                    fs.readFile(BLOG,"utf-8",(err,data)=>{
                        if(err) return;
                        var posts = JSON.parse(data);
                        end(posts);
                    })
                } else {
                    var posts = {};
                    end(posts);
                }
            });
            break;
        case "/save":
            var str = "";
            req.on("data",chunk=>str += chunk);
            req.on("end",()=>{
                var obj = querystring.parse(str);
                var post = {
                    title:obj.title,
                    author:obj.author,
                    content:obj.content,
                    time:new Date().toLocaleDateString()
                }
                var BLOG = path.join(__dirname,"blog.txt");
                var write = (arr)=>{
                    arr.push(post);
                    fs.writeFile(BLOG,JSON.stringify(arr),err=>{
                        if(err) return;
                        res.writeHead(200,{"content-type":"text/html;charset=utf-8"});
                        res.end("<h1>发表成功<a href='/'>返回首页</a></h1>");
                    })
                }
                if(fs.existsSync(BLOG)){
                    fs.readFile(BLOG,"utf-8",(err,data)=>{
                        if(err) return;
                        var arr = JSON.parse(data);
                        write(arr);
                    })
                } else {
                    var arr = [];
                    write(arr);
                }
            })
            break;
        default:
            var file = path.join(__dirname,req.url);
            if(fs.existsSync(file) && fs.statSync(file).isFile()){
                fs.readFile(file,(err,data)=>{
                    if(err) return;
                    // res.writeHead(200,{"content-type":mime.getType(file)})
                    res.write(data);
                    res.end();
                })
            }else{
                res.end();
            }
            break;
    }
}).listen(port,()=>{
    console.log(`服务器已成功在${port}端口运行...`)
})