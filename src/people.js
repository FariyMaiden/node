const http = require('http');
const express = require('express');
const app = express();
const mssql = require('mssql');
const router = express.Router
const bodyParser = require('body-parser');

const urlencodeParser = bodyParser.urlencoded({
    extended: false
})
app.use(express.static('public'));

http.createServer(

        app.post('/addList', urlencodeParser, (req, res) => {

            mssql.close();

            mssql.connect("mssql://sa:123456LL!@localhost:1433/data").then(() => {
                console.log(req.query)
                let name = " '" + req.query.name + "'"
                let age = " '" + req.query.age + "'"
                let sex = " '" + req.query.sex + "'"
                let nationality = " '" + req.query.nationality + "'"

                let sqlyu = 'INSERT INTO [data]. [dbo]. [peoplemenage] VALUES (' + name + ',' + age + ',' + sex + ',' + nationality + ')'
                new mssql.Request().query(sqlyu)
                    .then((recordset) => {
                        // console.log(recordset)

                        //设置允许跨域请求
                        let reqOrigin = req.header("origin");

                        if (reqOrigin != undefined && reqOrigin.indexOf("http://localhost:8081") > -1) {
                            res.header("Access-Control-Allow-Origin", '*');
                            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
                            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
                        }
                        res.end(JSON.stringify(recordset));
                    }).catch(function (err) {
                        console.log(err);
                    });
            }).catch(function (err) {
                console.log(err);
            });

        }),
        app.get('/m', (req, res) => {
            mssql.close();

            //连接方式1："mssql://用户名:密码@ip地址（无需端口号）/SqlServer名/数据库名称"
            //连接方式2："mssql://用户名:密码@ip地址:1433(默认端口号)/数据库名称"
            //mssql.connect("mssql://sa:123456LL!@localhost:1433/data").then(function () {
            //sql.connect("mssql://sa:123@localhost:1433/data").then(function() {
            mssql.connect("mssql://sa:123456LL!@localhost:1433/data").then(function () {
                console.log(req.query.nationality)

                // let na = "'g%'"
                let na = " '" + req.query.nationality + "'"
                // Query
                let sqlYU = ' SELECT * FROM [data]. [dbo]. [peoplemenage] WHERE [name] LIKE' + na;
                new mssql.Request().query(sqlYU)

                    .then(function (recordset) {

                        //设置允许跨域请求
                        let reqOrigin = req.header("origin");

                        if (reqOrigin != undefined && reqOrigin.indexOf("http://localhost:8081") > -1) {

                            res.header("Access-Control-Allow-Origin", '*');
                            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
                            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
                        }
                        res.end(JSON.stringify(recordset));
                        console.log(JSON.stringify(recordset))
                    }).catch(function (err) {
                        console.log(err);
                    });
            }).catch(function (err) {
                console.log(err);
            });

        })
    )
    // .listen(3000, () => {
    //     console.log('监听成功')
    // });
    .listen(process.env.PORT);