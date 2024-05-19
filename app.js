var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

app.get('/api/price', (req, res) => {
    db.all('SELECT * FROM PriceTable', (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        res.json(rows);
    });
});

// 新增的 /api/submit 路由來處理用戶的查詢請求
app.get('/api/submit', (req, res) => {
    const { store, year } = req.query;

    // 查詢數據庫獲取符合條件的價格信息
    const query = 'SELECT * FROM PriceTable WHERE store = ? AND year = ?';
    db.all(query, [store, year], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            // 返回 JSON 格式的查询结果
            res.json(rows);
        }
    });
});

module.exports = app;
