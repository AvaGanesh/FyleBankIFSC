console.log("Working")

const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3001;
const app = express();
// Username: 2hyuCDmV1E
//
// Password: 9yfNHDCKRA
//
// Database Name: 2hyuCDmV1E
//
// Server: remotemysql.com
//
// Port: 3306


// const db = mysql.createConnection({
//   host:'localhost',
//   user:'root',
//   password:'ganesh123',
//   database:'fyle'
// });
const db = mysql.createConnection({
  host :'remotemysql.com',
  port:'3306',
  user:'2hyuCDmV1E',
  password:'9yfNHDCKRA',
  database:'2hyuCDmV1E'

});


app.set("view engine","ejs");
// app.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

db.connect((err)=>{
  if(err){
    throw err;
  }
  console.log("Connected!!");
});


app.get('/ifsc',(req,res)=>{
  res.render("ifsc");
});

app.get('/',(req,res)=>{
  res.render("home");
});

app.get('/bank',(req,res)=>{
  res.render("bank");
});



app.get('/getifsc',(req,res)=>{
  var response = req.query.ifsc;
  let sql = 'select * from mytable where ifsc= ?';
  let query = db.query(sql,response,(err,result)=>{
    if(err) throw err;
    console.log(result);
    if(result.length == 0){
        res.send("Sorry IFSC code is not in our database");
    }else {
      res.render('result',{ifsc:result[0].ifsc,
      bank_id:result[0].bank_id,
      branch:result[0].branch,
      address:result[0].address,
      city:result[0].city,
      district:result[0].district,
      state:result[0].state,
      bank_name:result[0].bank_name});
    }
  });


});

app.get('/getbankdetails',(req,res)=>{
  var bank_name = req.query.bank;
  var name = req.query.city;
  let sql = 'select * from mytable where city="'+name+ '" and bank_name="'+bank_name+'"';
  let query = db.query(sql,(err,result)=>{
    if(err) throw err;
    console.log(result);
    JSON.stringify(result);
    if(result.length==0){
      res.send("Bank details is not in our database");
    }else{
        res.render('bankresults',{'banklist' : result} );
    }
  });

  console.log(query);
})


// app.post('/getifsc',urlencodedParser,(req,res)=>{
//   console.log(req.body);
//   res.render('ifsc',{qs:req.ifsc});
// });

app.get('*',(req,res)=>{
  res.send("Error page not found");
});


//select * from  mytable where bank_name="ABHYUDAYA COOPERATIVE BANK LIMITED";

app.get('/allbanks',(req,res)=>{
  let sql = ' select * from  mytable where bank_name="ABHYUDAYA COOPERATIVE BANK LIMITED"';
  db.query(sql,(err,result)=>{
    if(err){
      console.log(err);
    }
    console.log(result);
    res.send(result);
  });
});

//ifsc code
app.listen(port,()=>{
  console.log("Server started in port"+port);
});
