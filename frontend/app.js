const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var pgp = require('pg-promise')(/* options */)
var db = pgp('postgres://postgres:password@db/postgres')
//var fs = require('fs');
const port = 3001


app.use(bodyParser.json())

//const emails = JSON.parse(fs.readFileSync("emails.json"))

const EMAILS_BY_FILTER= async (filter)=>{
    try {
        const result = await db.query(`SELECT * FROM emails WHERE ${filter} ORDER BY id ASC`);
        return result;
    
    }catch(e) {
        console.log(e.message);
    }
    return [];
    
}
const NEW_EMAIL=async (data)=> {
    try {
        if (!data.date) {
            data.date = new Date().toISOString();
        }  
        //TODO strip inputs to avoid injection
        const result = db.result('INSERT INTO emails (sender,recipient,subject,message, date) VALUES ($1,$2,$3,$4,$5)',[data.sender,data.recipient,data.subject,data.message,data.date])
        return result.rowCount > 0;
    }catch(e) {
        console.log(e.message);
    }
    return false;
}
/*
app.get('/import', (req, res) => {
    Promise.all(emails.map(email => {
        NEW_EMAIL(email);
    })).then(res.json("completed")).catch(e=>{
        res.send(e.message);
    })
    
})
*/
app.get('/',(req,resp)=>{
    resp.send("Express is Running");
});

app.get('/emails', (req, res) => {
    EMAILS_BY_FILTER(`1=1`).then(emails=>
        {
            res.send(emails);
        });
})
app.get('/emails/:id', (req, res) => {
    let id = req.params.id.replace(/[^(0-9).]/,'');

    EMAILS_BY_FILTER(`id = ${id}`).then(emails=>
        {
            res.send(emails);
        });

})

app.get('/search',(req,res) => {
    const query = decodeURIComponent(req.query.query)
    //const filteredEmails = emails.filter(email => email.subject.includes(query))
    EMAILS_BY_FILTER(`subject like '%${query}%'`).then(filteredEmails=>{
        res.send(filteredEmails)
    });
});

app.post('/send',function(req,res){
    let result;
    const emailSender = req.body;
    if(emailSender.sender && emailSender.recipient && emailSender.subject && emailSender.message){
        //emails.push({ sender: emailSender.sender, recipient: emailSender.recipient, subject: emailSender.subject, email: emailSender.message, })
        NEW_EMAIL(emailSender).then(()=>res.json({
            "status": "success",
            "message": "The message was successfully sent"
        })).catch(()=>res.status(400).json({
            "status": "failure",
            "message": "The message was unable to be sent"
        }))
    }else{
        res.status(400).json({
            "status": "failure",
            "message":"missing require field in email"
        })
    }
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))