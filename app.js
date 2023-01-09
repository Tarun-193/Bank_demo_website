// const exp=require('express');
// const db=require('./db_connect');
// const path=require('path');
// const bodyParser=require('body-parser');
// const encoder = bodyParser.urlencoded({ extended: false });

// const init=exp();

// const public_dir=path.join(__dirname,'./public');
// init.use(exp.static(public_dir));

// init.set('view engine','ejs');


// db.connect((error)=>{
//     if(error){
//         console.log(error);
//     }
//     else
//     console.log("mysql connected");
// });

// init.use('/',require('./routes/pages'));


// init.post("/details",encoder,(req,res)=>{
//     console.log('inside post');
//     accno=req.body.accno;
//     pass=req.body.pass;
//     db.query("select * from bank_customers where accno=? and password=?",[accno,pass],(err,result)=>{
//          if (err) {
//              console.log(err);
//              res.end(`<h1>Oops!,Some error has occured!</h1><a href='/'>Login page</a>`);
//          }
//         else if(result.length>0){
//             console.log(result);
//             db.query('select * from user_info where accno=?',[accno],(err,result1)=>{
//                     if(err){
//                         console.log(err);
//                         console.log('some error');
//                     }
//                     else
//                     console.log(result1);
//                     res.render('welcome',{info:{accno:result1[0].Accno,name:result1[0].name,age:result1[0].age,email:result1[0].email,phone:result1[0].phone,address:result1[0].address,image:result1[0].image}});
//             })
//         }
//         else res.send(`<h1>Enter valid details!<h1><a href='/'>Go to login page</a>`);
//     });
// })

// init.get('/balance',(req,res)=>{
//     db.query('select balance from user_info where accno=?',[accno],(err,result2)=>{
//         if(err){
//             console.log(err);
//             console.log('some error');
//         }
//         else if(result2.length>0){
//             console.log(result2);
//             res.render('balance',{balance:result2[0].balance});
//         }
// });
// })


// init.listen(3000);
// const bodyParser = require('body-parser');
// const express = require('express');
// const mysql = require('mysql');
// const dotenv = require('dotenv');
// let ejs = require('ejs');
//  const path =require('path');
// const { send } = require('process');
// const prompt = require('prompt');   
// const { brotliDecompress } = require('zlib');
// const { url } = require('inspector');
const exp=require('express');
const db=require('./db_connect');
const path=require('path');
const bodyParser=require('body-parser');
const prompt = require('prompt');   
const encoder = bodyParser.urlencoded({ extended: false });

// dotenv.config({path: './.env'})

const app = exp();

const public_dir=path.join(__dirname,'./public');
app.use(exp.static(public_dir));


app.set('view engine', 'ejs');
db.connect((error)=>{
    if(error){
        console.log(error);
    }
    else
    console.log("mysql connected");
});


app.use('/',require('./routes/pages'));

app.post("/details",encoder,(req,res)=>{
    console.log('inside post');
    accno=req.body.accno;
    pass=req.body.pass;
    db.query("select * from bank_customers where accno=? and password=?",[accno,pass],(err,result)=>{
         if (err) {
             console.log(err);
             res.end(`<h1>Oops!,Some error has occured!</h1><a href='/'>Login page</a>`);
         }
        else if(result.length>0){
            console.log(result);
            db.query('select * from user_info where accno=?',[accno],(err,result1)=>{
                    if(err){
                        console.log(err);
                        console.log('some error');
                    }
                    else
                    console.log(result1);
                    res.render('welcome',{info:{accno:result1[0].Accno,name:result1[0].name,age:result1[0].age,email:result1[0].email,phone:result1[0].phone,address:result1[0].address,image:result1[0].image}});
            })
        }
        else res.send(`<h1>Enter valid details!<h1><a href='/'>Go to login page</a>`);
    });
})


// app.get("/pin", (req,res)=>{
//     res.render('pin');
// })

app.get("/balance",(req,res)=>{
    // pin=req.body.pin;
    db.query('select balance from user_info where accno=?',[accno],(err,result2)=>{
        if(err){
            console.log(err);
            console.log('some error');
        }
        else if(result2.length>0){
            console.log(result2);
            res.render('balance',{balance:result2[0].balance});
        }
});
})

// app.get('/transfer',(req,res)=>{
//     res.render('index1');
//     // console.log('transfer button clicked')
// })

app.post('/transaction',encoder,(req,res)=>{
    let recieverAccno= req.body.accno;
    let recieverName= req.body.name;
    let recieverAmount = req.body.amount;
    let balance;
    
    db.query('select balance from user_info where accno=?',[accno],(error,result)=>{
        if(error){
            console.log('incorrect error');
        }
        else{
            balance=result[0].balance;
            console.log(balance);

            if(balance<recieverAmount){
                res.send('insufficient balance...');
            }
            else{
                db.query('update user_info set  user_info.balance =user_info.balance +? where accno=? and name=?',[recieverAmount,recieverAccno,recieverName],(error,result)=>{
                    if(error){
                        console.log('transfer query error...');
                        console.log(result);
                    }
                    else{
                        db.query('update user_info set  user_info.balance =user_info.balance -? where accno=?',[recieverAmount,accno,],(error,result)=>{
                            if(error){
                                console.log('error')
                            }
                            else{
                                res.send('sucessful TRANSACTION...........');
                            }
                        })
                      
                        console.log(result.affectedRows + " record(s) updated")
                    }
                }
                )
            }
        
            console.log(recieverAccno,recieverName,recieverAmount)
        }
    })

  
})


app.listen('3000',() =>{
    console.log('server started on port 3000');

});





