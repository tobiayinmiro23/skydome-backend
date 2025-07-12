const express = require("express")
const cors = require('cors')
const dotenv = require('dotenv').config()
const app=express() 


app.use(cors())
app.use(express.json())
const port=process.env.PORT || 3001


app.get('/',(req,res)=>{
        res.send("we're live !!")
})
app.post('/pay',async(req,ress)=>{
    const{email}=req.body
    const https = require('https')
    const params = JSON.stringify({
      "email": email,
      "amount": "10000"
    })  
  
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: process.env.SECRET_KEY,
      'Content-Type': 'application/json'
    }
  }
  
  let data = ''
  const pay = https.request(options, res => {
  
    res.on('data', (chunk) => {
      data += chunk
      ress.send(data)
  
    });
    res.on('end', () => {   
      console.log('success')
    })
  }).on('error', error => {
    console.error(error)
    ress.send(error)
  
  })
  
  pay.write(params)
  pay.end()
  
  })   
  app.post('/verify',async(req,ress)=>{
    const https = require('https')
    const {reference}=req.body  
    console.log(reference)
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/verify/'+ reference,
      method: 'GET',
      headers: {  
        Authorization:  process.env.SECRET_KEY
      }
    }
    
    https.request(options, res => {
      let data = ''  
    
      res.on('data', (chunk) => {
        data += chunk
      });
  
      res.on('end', () => {
        console.log('success')
        ress.send(data)
      })
    }).on('error', error => {
      console.error(error)
    })
  
  })


app.listen(port,()=>console.log('listening an port '+ port))
