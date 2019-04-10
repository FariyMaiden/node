// var http = require('http');

// http.createServer(function (req, res) {


//     res.writeHead(200, {
//         'Content-Type': 'text/html'
//     });
//     //res.write('<head><meta charset="utf-8"/></head>');
//     // res.header('Access-Control-Allow-Origin', '*');
//     // res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//     // res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

//     res.end('You have reached the default node.js application at index.js! [defaultdocument sample]');
// }).listen(process.env.PORT);



// var http = require('http');

// http.createServer(function (req, res) {


//     res.writeHead(200, {
//         'Content-Type': 'text/html'
//     });
//     res.write('<head><meta charset="utf-8"/></head>');
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

//     res.end('You have reached the default node.js application at index.js! [defaultdocument sample]');
// }).listen(process.env.PORT);



var mssql = require('mssql');
var http = require('http');
var express = require('express')
var app = express();
var router = express.Router()


http.createServer(

    app.get('/main', function (req, res) {
        var FourthRegionCode = req.query.FourthRegionCode
        var newFourthRegionCode = FourthRegionCode

        mssql.close();

        //连接方式1："mssql://用户名:密码@ip地址（无需端口号）/SqlServer名/数据库名称"
        //连接方式2："mssql://用户名:密码@ip地址:1433(默认端口号)/数据库名称"
        // mssql.connect("mssql://sa:123456LL!@localhost:1433/data").then(function () {
        //sql.connect("mssql://sa:123@localhost:1433/data").then(function() {
        mssql.connect("mssql://sa:Zz1@172.0.41.82/IOTCollectionSystem").then(function () {
            // Query
            var sqlYU = 'SELECT [TransactionManagement].[TransactionOrder],[TransactionType], [TransactionAmount],[TransactionMethod],[TransactionMode], [TransactionTime], OpenAccountRecord. [PAN], OpenAccountRecord. [MeterAssetsCode], Meter. [HouseRegionCode], HouseRegionName FROM[IOTCollectionSystem]. [dbo]. [TransactionManagement], [SaleElectricityRecord], OpenAccountRecord, Meter, HouseRegion where [TransactionManagement]. [TransactionOrder] = [SaleElectricityRecord]. [TransactionOrder] and OpenAccountRecord. [PAN] = [SaleElectricityRecord]. [PAN] and OpenAccountRecord. [MeterAssetsCode] = Meter. [MeterAssetsCode] and Meter. [HouseRegionCode] = HouseRegion. [HouseRegionCode] and TransactionManagement.[FourthRegionCode] = ' + newFourthRegionCode

            new mssql.Request().query(sqlYU)

                .then(function (recordset) {
                    // res.writeHead(200, {
                    //     'Content-Type': 'text/html'
                    // });
                    // res.write('<head><meta charset="utf-8"/></head>');
                    // res.header('Access-Control-Allow-Origin', '*');
                    // res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
                    // res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

                    //设置允许跨域请求
                    var reqOrigin = req.header("origin");


                    if (reqOrigin != undefined && reqOrigin.indexOf("http://localhost:8080") > -1) {
                        //设置允许 http://172.0.0.116:83 这个域响应

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
    })

).listen(process.env.PORT);