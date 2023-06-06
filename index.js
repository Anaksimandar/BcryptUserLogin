const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const users = [];

app.use(express.json());

app.get('/users',(req,res)=>{
    res.json(users)
})

app.post('/users',async (req,res)=>{

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        console.log(salt);
        console.log(hashedPassword);
        const user = {name:req.body.name, password:hashedPassword};
        users.push(user);
        res.status(201).send('ADDED');
        // bcrypt.hash(salt + 'password'); // aaaaa // same user passwod same hash so hacker could easily hash others
        // with salt which is random value, all passwords will be hashed diffrendly even same passwords

    }
    catch(e){
        res.status(500).send('Error'+e);
    }
    
})

app.post('/users/login',async (req,res)=>{
    const user = users.find(u=>u.name === req.body.name);
    console.log(user);
    if(!user){
        return res.send('Cannot find user');
    }
    try{
        console.log(req.body.password);
        console.log(user);
        if(await bcrypt.compare(req.body.password,user.password )){
            res.send('Success');
            
        }
        else{
            res.send('Not allowed');
        }
    }
    catch(e){
        res.status(500).send('Error'+e);
    }
})

app.listen(3000,()=>{
    console.log('Server is active at port 3000');
})