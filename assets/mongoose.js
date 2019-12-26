var express = require("express");
var bodyParser = require('body-parser');
var upload = require('express-fileupload');
var mongoose = require('mongoose');
var fs = require('fs');
var CsvReadableStream = require('csv-reader');
var Schema = mongoose.Schema;
var r  = "";
// var status = false;

mongoose.connect('mongodb+srv://<username>:<password>@cluster0-koel1.mongodb.net/Quiz?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.set('useFindAndModify', false);

var qSchema = new Schema({
    question: {
        type: String,
        required: true,
        async:true
    },
    opt1: {
        type: String,
        required: true,
        async:true
    },
    opt2: {
        type: String,
        required: true,
        async:true
    },
    opt3: {
        type: String,
        required: true,
        async:true
    },
    opt4: {
        type: String,
        required: true,
        async:true
    },
    ans: {
        type: String,
        required: true,
        async:true
    }
});

var Question = mongoose.model('Question', qSchema);

var suSchema = new Schema({
    username: {
        type: String,
        required: true,
        async: true
    },
    password: {
        type: String,
        required: true,
        async: true
    },
    confirmpw: {
        type: String,
        required: true,
        async: true
    },
    email: {
        type: String,
        required: true,
        async: true
    },
    status: {
        type: String,
        default: 'pending',
        required: true,
        async: true
    }
});

var Signedup = mongoose.model('Signedup', suSchema);

var ansSchema = new Schema({
    uid:{
        type: Schema.Types.ObjectId,
        ref: "Signedup",
        required: true,
        async: true
    },
    qid:{
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
        async: true
    },
    cans:{
        type: String,
        required: true,
        async:true
    },
    uans:{
        type: String,
        required: true,
        async:true
    }
});

var Answer = mongoose.model('Answer', ansSchema);


module.exports = function(app){

    app.use(express.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(upload())

// get to add product page

    app.get('/', (req, res)=>{
        res.render('addqu');
    });
    
// add product

    app.post("/addQuestion", (req, res)=>{
        if(req.files){
            var file = req.files.filename,
                filename = Date.now() + file.name;
            file.mv("./uploads/" + filename, (err)=>{
                if(err){
                    console.log(err)
                    res.send("error occured")
                }
            })
        
        var AutoDetectDecoderStream = require('autodetect-decoder-stream');
        
        var inputStream = fs.createReadStream('./uploads/' + filename)
            .pipe(new AutoDetectDecoderStream({ defaultEncoding: '1255' })); // If failed to guess encoding, default to 1255
        
        // The AutoDetectDecoderStream will know if the stream is UTF8, windows-1255, windows-1252 etc.
        // It will pass a properly decoded data to the CsvReader.
        
        inputStream
            .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
            .on('data', function (row) {
                const newQues = new Question({
                    question: row[0],
                    opt1:row[1],
                    opt2:row[2],
                    opt3:row[3],
                    opt4:row[4],
                    ans:row[5]
                })
                newQues.save()
                .then(()=>{

                })  
                .catch((error)=>{
                    console.log(error)
                }) 
            }).on('end', function (data) {
                console.log('No more rows!');
                res.redirect('/viewQuestion')
            });

        }
    });


// fetch added questions from db to view page    
    
    app.get('/viewQuestion', async function(req, res){
        await Question.find({}, (err, data)=>{
            if(err) throw err;
            res.render('view', {data});
        });
    });

// delete question from view page
    app.post("/deleteQuestion/:id", async (req, res) => {
        const data = await Question.findByIdAndDelete({_id: req.params.id});
        console.log(data);
        res.send(data);
    });

    // fetch data for edit question
    
    app.get('/editQuestion/:id',(req, res)=>{
        //console.log(req.params.id)
        Question.findById(req.params.id)
        .then((data)=>{
            res.render('edit', {data})
        })
        .catch((error)=>{
            console.log(error)
        })
    })
    
// update question

    app.post("/updateQuestion/:id", async (req, res) => {
        const data = await Question.findByIdAndUpdate(req.params.id, req.body, {new: true});
        // if(err) throw err;
        res.redirect('/viewQuestion')
    });

    // get data to home page
    app.get('/homePage', async function(req, res){
        await Question.find({}, (err, data)=>{
            if(err) throw err;
            res.render('home', {data});
        });
    });



// signup btn
app.get('/signUp', function(req, res){
    Signedup.find({}, (err, data)=>{
        if(err) throw err;
        res.render('signup', {data});
    });
});

// login btn
app.get('/logIn', function(req, res){
    Signedup.find({}, (err, data)=>{
        if(err) throw err;
        res.render('login', {data});
    });
});

// signup form
app.post('/signedUp', (req, res)=>{
    var signUp = Signedup(req.body).save((err, data)=>{
        if(err) throw err;


        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }
         r = makeid(6);
         console.log(r);


        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey('<PUT YOUR SENDGRID API KEY HERE>');
        const msg = {
        to: req.body.email,
        from: '<PUT YOUR EMAIL LINKED TO SENDGRID>',
        subject: 'Sending with Twilio SendGrid is Fun',
        text: r,
        };
        sgMail.send(msg);

        res.redirect('/confirmIdentity/'+ data._id);
    });
});

// confirm identity
app.get('/confirmIdentity/:id', function(req, res){
    Signedup.findById(req.params.id, (err, data)=>{
        if(err) throw err;
        res.render('confirm', {data});
}); 
});

// submit code
app.post('/submitIdentity/:id', (req, res)=>{
    Signedup.findById(req.params.id, (err, data)=>{
        console.log(req.body.code);
        console.log(r);
        console.log(req.params.id);
        if(req.body.code==r){
           Signedup.findByIdAndUpdate(req.params.id, {$set: {status: 'active'}}, {new: true})
           .then((data1)=>{
                console.log(data1)
           })
           .catch((error)=>{
               console.log(error)
           })
            res.redirect('/userView/'+ req.params.id);
        }
        else{
            res.redirect('/signUp');
        }
    });
});

// login form
app.post('/loggedIn', (req, res)=>{
    Signedup.find({}, (err, data)=>{
        if(err) throw err;
        console.log(data.length)
        for(var i=0;i < data.length;i++){
        console.log(data[i].email)
        if(data[i].email == req.body.email && data[i].password == req.body.password && data[i].status == 'active'){
            res.redirect('/userView/' + data[i]._id);
            flag=1;
            break;
        }
        else{
            flag=0;
        }
    }
    if(flag==0){
            res.send('User Not Found!!! Email or Password is Invalid');
    }
    });
    });

// signedUp User
app.get('/userView/:id', function(req, res){
    Signedup.findById(req.params.id, (err, data1)=>{
        if(err) throw err;
        Question.find({}, (err, data)=>{
            if(err) throw err;
        res.render('user', {data1, data});
    });
}); 
});

app.post('/userSubmit/:id/:id1/:cans', (req, res)=>{
    var flag=0;
    Answer.find()
    .then((ques)=>{  
        if( ques.length != 0 ){
            for( i=0;i<ques.length;i++ ){

            if( ques[i].qid.toString() == req.params.id1 && ques[i].uid.toString() == req.params.id ){
                Answer.findByIdAndUpdate(ques[i]._id, req.body, {new: true})
                .then((dt)=>{
                    res.send({success: true})
                })
                .catch((error)=>{
                    console.log(error)
                })
                flag=1;
                break;
            }
            else if(ques[i].qid.toString() == req.params.id1 || ques[i].uid.toString() == req.params.id ){
                flag=0;
            }
            else{
                flag=0;
            }
        }
        if(flag==0){
                const newans = new Answer({
                    uid: req.params.id,
                    qid: req.params.id1,
                    cans: req.params.cans,
                    uans: req.body.uans
                })
            
                newans.save()
                .then (()=>{
                    res.send({success: true})
                })
                .catch((error)=>{
                    console.log(error)
                })
        }
        }
        else{
            console.log('ok')
            const newans = new Answer({
                uid: req.params.id,
                qid: req.params.id1,
                cans: req.params.cans,
                uans: req.body.uans
            })
        
            newans.save()
            .then (()=>{
                res.send({success: true})
            })
            .catch((error)=>{
                console.log(error)
            })
        }
    })
    .catch((error)=>{
        console.log(error)
    })    
});


app.get('/userScore/:id', async(req, res)=>{
    var score = 0;
    var id = req.params.id;    
            await Answer.find({}, (err, data)=>{
                if(err) throw err;
                for(var i=0;i<data.length;i++){
                    if(data[i].uid == req.params.id){
                        if(data[i].cans == data[i].uans){
                            score += 1;
                        }
                    }
                }
        res.render('score', {score, id});
    });

})

app.get('/viewAnswer/:id', (req, res)=>{
    Question.find({}, (err, data)=>{
        if(err) throw err;
        res.render('answer', {data});
    });
});

}

