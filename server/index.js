const express = require('express')
const app = express()
//post 请求表单数据
app.use(express.urlencoded({ extended: true }))

// 资源共享
const cors = require('cors');
app.use(cors());

// 静态文件托管  ---------  访问图标地址  回显图片
app.use(express.static('upload'));

//路由
const router = require('./router')
app.use('/', router)


app.listen(3333, () => {
    console.log(3333);
})