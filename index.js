const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('success')).catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('노드 와우 재밋음!')
})



app.post('/api/users/register', (req, res) => {
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어주기
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success:true
    })
  })
})

app.post('/api/users/login', (req, res) => {

  // 요청된 이메일을 데이터베이스에서 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess : false,
        message: "이메일이 일치하는 유저가 없습니다."
      })
    }

    // 요청된 이메일이 있다면, 비밀번호가 일치하는지 확인
    user.comparePassword( req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({loginSuccess:false, message: "비밀번호가 틀렸습니다."})

      // 비밀번호도 맞다면 Token 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        // token을 저장한다 쿠키에! (로컬스토리지에도 할수있음)
        res.cookie('x_auth', user.token)
        .status(200)
        .json({loginSuccess:true, userId: user._id })

      })

    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})