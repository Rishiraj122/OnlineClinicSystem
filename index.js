const express = require('express'); 
const req = require('express/lib/request');
const res = require('express/lib/response');
const app=express();
const Doctor = require('./models/doctor');
const Patient = require('./models/patient');
const Reporter = require('./models/reporter');
const bcrypt = require('bcrypt');
const session = require('express-session');
var today = new Date();
const mongoose = require("mongoose");
const { use } = require('bcrypt/promises');
const { text } = require('express');
let alert = require('alert');
const user = require('./models/user');
const Admin = require('./models/admin');
const crypto = require("crypto");
mongoose.connect("mongodb+srv://clinic:clinic@cluster0.lysrs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}, () => { 
    console.log('connected to database') 
})

app.use( express.static( "public" ) );
app.set('view engine','ejs');
app.set('views','views');
app.use(express.urlencoded({extended: true}));
app.use(session({secret:'notagoodsecret'})) 

app.get('/',(req,res)=>{
    res.render("home");
})

//For Logout

app.get('/logout',(req,res)=>{
    req.session.user_id=null;
    res.redirect('/');
})

//Doctor

app.get('/doctors',(req,res)=>{
    if(req.session.user_id==null){
        return res.redirect("/reporterlogin");
    }
    Doctor.find({},(err,data)=>{
        res.render("doctors",{
            doctor:data
        })
    })
})

app.get('/adddoctor',(req,res)=>{
    if(req.session.user_id==null){
        return res.redirect("/adminlogin");
    }
    res.render("adddoctor");
})

app.post('/adddoctor',async(req,res)=>{
    const{name,specialization,date}=req.body;
    const doctor = new Doctor({
        name,
        specialization,
        date
    });
    await doctor.save();
    res.redirect('/adddoctor');
})


//Patient

app.get('/schedulepatient',(req,res)=>{
    res.render("schedulepatient");
})

app.get('/patienthome',(req,res)=>{
    res.render("patienthome");
})

app.get('/patientlogin',(req,res)=>{
    res.render("patientlogin");
})

app.get('/patientdashboard',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/patientlogin');
    }
    Patient.findOne({email:req.session.user_id},(err,data)=>{
        res.render('patientdashboard',{
            patient: data
        })
    })
})

app.get('/patientregister',(req,res)=>{
    res.render("patientregister");
})

app.post('/patientlogin',async(req,res)=>{
    const{email,password}=req.body;
    const patient = await Patient.findOne({email});
    if(!patient){
        alert("Patient not found");
        res.redirect('/patientlogin');
    } 
    else{
        const validPassword = await bcrypt.compare(password,patient.password);
        if(!validPassword){
            alert("Incorrect Password");
            res.redirect('/patientlogin');
        }
        else{
            req.session.user_id=email;
            res.redirect('/patientdashboard');
        }
    }
})

app.post('/schedulepatient',async(req,res)=>{
    const{email,doctor}=req.body;

    const patient=await Patient.findOneAndUpdate({email:email},
        {$set:{doctor:doctor}},
        (err,data)=>{
            if(err){
                alert("Doctor Cannot be Character");
                res.redirect("/reporterdashboard");
            }
            alert("Doctor Updated Successfully")
            res.redirect("/reporterdashboard");
        })
})

app.post('/patientregister',async(req,res)=>{
    const{firstname,lastname,gender,address,email,password,mobile,disease,date}=req.body;
    const hash = await bcrypt.hash(password,12);

    const userExists = await Patient.findOne({email:email});
    if(userExists!=null){
        alert("User Already Exists");
        res.redirect('/patientregister');
    }
    else{
        const patient = new Patient({
            firstname,
            lastname,
            gender,
            address,
            email,
            password:hash,
            mobile,
            disease,
            date
        })

        await patient.save();
        res.redirect('/patientlogin');

    }
    
})


//Reporter

app.get('/reporterhome',(req,res)=>{
    res.render("reporterhome");
})

app.get('/reporterlogin',(req,res)=>{
    res.render("reporterlogin");
})

app.get('/reporterregister',(req,res)=>{
    res.render("reporterregister");
})

app.get('/reporterdashboard',(req,res)=>{
    if(req.session.user_id==null){
       return res.redirect("/reporterlogin");
    }
    Patient.find({},(err,data)=>{
        res.render('reporterdashboard',{
            patient:data
        })
    })
})

app.post('/reporterlogin',async(req,res)=>{
    const{email,password}=req.body;
    const reporter = await Reporter.findOne({email});
    if(!reporter){
        alert("Admin not found");
        res.redirect('/reporterlogin');
    } 
    else{
        const validPassword = await bcrypt.compare(password,reporter.password);
        if(!validPassword){
            alert("Incorrect Password");
            res.redirect('/reporterlogin');
        }
        else{
            req.session.user_id=email;
            res.redirect('/reporterdashboard');
        }
    }

})

app.post('/reporterregister',async(req,res)=>{
    const{firstname,lastname,mobile,email,password}=req.body;
    const hash = await bcrypt.hash(password,12);

    const userExists = await Reporter.findOne({email:email});
    if(userExists!=null){
        alert("User Already Exists");
        res.redirect('/reporterregister');
    }
    else{
        const reporter = new Reporter({
            firstname,
            lastname,
            mobile,
            email,
            password:hash
        })

        await reporter.save();
        res.redirect('/reporterlogin');

    }
})


//Admin Get Requests
app.get('/adminhome',(req,res)=>{
    res.render("adminhome");
})

app.get('/adminlogin',(req,res)=>{
    res.render("adminlogin");
})

app.get('/adminregister',(req,res)=>{
    res.render("adminregister");
})

app.get('/admindashboard',(req,res)=>{
    if(req.session.user_id==null){
       return res.redirect("/adminlogin");
    }
    Doctor.find({},(err,data)=>{
        res.render('admindashboard',{
            doctor: data
        })
    })
})

//Admin Post Requests

app.post('/adminlogin',async(req,res)=>{
    const{email,password}=req.body;
    const admin = await Admin.findOne({email});
    if(!admin){
        alert("Admin not found");
        res.redirect('/adminlogin');
    } 
    else{
        const validPassword = await bcrypt.compare(password,admin.password);
        if(!validPassword){
            alert("Incorrect Password");
            res.redirect('/adminlogin');
        }
        else{
            req.session.user_id=email;
            res.redirect('/admindashboard');
        }
    }

})

app.post('/adminregister',async(req,res)=>{
    const{firstname,lastname,mobile,email,password}=req.body;
    const hash = await bcrypt.hash(password,12);

    const userExists = await Admin.findOne({email:email});
    if(userExists!=null){
        alert("User Already Exists");
        res.redirect('/adminregister');
    }
    else{
        const admin = new Admin({
            firstname,
            lastname,
            mobile,
            email,
            password:hash
        })

        await admin.save();
        res.redirect('/adminlogin');

    }
})


app.listen(process.env.PORT || 3003, process.env.IP, function(req, res) {
    console.log("Server Started");
});
