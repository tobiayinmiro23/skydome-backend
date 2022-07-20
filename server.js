const express= require('express')
const app=express()
const bcrypt = require("bcrypt");
const cors =require('cors')
// const path=require('path')
const { Client } = require('pg');

// middleware
app.use(express.json())
app.use(cors())
app.use(express.static("./ecommerceFrontend/build"));
if(process.env.PORT === 'production'){
    app.use(express.static("./ecommerceFrontend/build"));
    // app.use(express.static(path.join(__dirname ,"ecommerceFrontend/build")))
}


// database connection
  // const client = new Client({
  //   connectionString: process.env.DATABASE_URL,
  //   ssl: {
  //     rejectUnauthorized: false
  //   }
  // });
  // client.connect();
  const client=new Client({
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password:'database',
    database : 'ecommerce'

  })
  client.connect();

  // routes
 
  // for getting all the products
  app.get('/allproduct',async(req,res)=>{
    try{
      const allProducts=await client.query('select * from index')
      res.json(allProducts.rows)
    }catch(err){
        console.log(err.message,'all product')
    }
  })
  // for getting  info about a product
  app.post('/product',async(req,res)=>{
    try{
      const {id}=req.body
      const product=await client.query('select * from index where id = $1 ',[id])
      res.json(product.rows[0])
  }catch(err){
      console.log(err.message,'all users')
    }
  })
  // for creating a  product
  app.post('/newProduct',async(req,res)=>{
    try{
      const {id,productname,productprice,productinfo,productimage1,productimage2,processortype, processorname,brand,batteryinfo,ram,rom, windowversion, color,touchscreen,netweight,inch,gaminggraphics,network,frontcamera,rearcamera,shoesize}=req.body
      const product=await client.query('insert into index (id,productname,productprice,productinfo,productimage1,productimage2,processortype, processorname,brand,batteryinfo,ram,rom, windowversion, color,touchscreen,netweight,inch,gaminggraphics,network,frontcamera,rearcamera,shoesize) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22) RETURNING *',[id,productname,productprice,productinfo,productimage1,productimage2,processortype, processorname,brand,batteryinfo,ram,rom, windowversion, color,touchscreen,netweight,inch,gaminggraphics,network,frontcamera,rearcamera,shoesize])
      res.json(product.rows[0])
  }catch(err){
    res.json('an error occured : new product')
      console.log(err.message,'new product')
    }
  })
  // for updating a product
  app.put('/updateProduct',async(req,res)=>{
    try{
      const {id,productname,productprice,productinfo,productimage1,productimage2,processortype, processorname,brand,batteryinfo,ram,rom, windowversion, color,touchscreen,netweight,inch,gaminggraphics,network,frontcamera,rearcamera,shoesize}=req.body
      const updatedproduct=await client.query(' update index set productname = $2,productprice = $3,productinfo = $4,productimage1 = $5,productimage2 = $6,processortype = $7,processorname = $8,brand = $9,batteryinfo = $10,ram = $11,rom = $12,windowversion = $13,color = $14,touchscreen = $15,netweight = $16,inch = $17,gaminggraphics = $18,network = $19,frontcamera = $20,rearcamera = $21,shoesize = $22 where id=$1 RETURNING *',[id,productname,productprice,productinfo,productimage1,productimage2,processortype, processorname,brand,batteryinfo,ram,rom, windowversion, color,touchscreen,netweight,inch,gaminggraphics,network,frontcamera,rearcamera,shoesize])
      res.json(updatedproduct.rows[0])
  }catch(err){
    res.json('an error occured : update product')
      console.log(err.message,'update product')
    }
  })
    //for deleting a product
    app.delete('/product/:id',(req,res)=>{
      try{
        const{id}=req.params
        client.query('delete from index where id = $1',[id])
        res.json('delete was successfull')
      }catch(err){
        console.log('unable to delete product',err)
      }
    }) 
    // for getting all users
    app.get('/allusers',async(req,res)=>{
      try{
        const allusers=await client.query('select * from users')
        res.json(allusers.rows)
      }catch(err){
          console.log(err.message,'all users')
        }
    })
    // for creating a users
    app.post('/signin', async(req,res)=>{
      try{
      const {name,email,password,joined}=req.body
      let plaintext=password
      const saltRounds = 10;
      bcrypt.hash(plaintext, saltRounds)
      .then(async(hash) => {
        const newUser=await client.query('insert into users (name,email,password,joined) values ($1,$2,$3,$4) RETURNING *',[name,email,hash,joined])
        res.json(newUser.rows[0])
      })
       .catch(err =>{
        console.error(err.message)
        res.status(400).json("an error occured :new users --hashing")
      } );
    }catch(err){
      res.json("an error occured :new users")
      console.log(err.message,'new users')
    }
    })
      // for login users 
      app.post('/login',async(req,res)=>{
        try{
          const{email,password}=req.body
          const login=await client.query('select * from users where email = ($1)',[email])
          let plaintext=password
          const hash = login.rows[0].password;
          bcrypt.compare(plaintext, hash)
          .then(ressponse => {
            if (ressponse){
                res.json(login.rows[0])
                console.log('correct')
              }else{
                res.json('incorrect password')
                console.log('incorrect')
              }
            })
            .catch(err => {
              res.json("an error occured :login --hash",err)
              console.error(err.message)
            });
        }catch(err){
        res.json("an error occured :login")
          console.log(err.message,'login')
        }
      })
      // updating password endpoint
      app.put('/update',async(req,res)=>{
        try{
          const{email,password}=req.body
          let plaintext=password
          const saltRounds = 10;
          bcrypt.hash(plaintext, saltRounds)
          .then(async(hash) => {
            const updatePassword=await client.query('update users set password = $1 where email =$2 returning *',[hash,email])
            res.json(updatePassword.rows[0])
          }).catch(err =>{
            console.error(err.message)
           res.json("an error occured :update password --hash")
          })
        }catch(err){
        res.json("an error occured :update password")
          console.log(err.message,'update password')
        }
      })
      //for deleting a user
      app.delete('/user/:id',async(req,res)=>{
        try{
            const{id}=req.params
            const deleteUser=await client.query('delete from users  where id = $1',[id])
            res.json('user was deleted')
        }catch(err){
            console.log(err.message)
        }
      })
      // for sending info about a paid product to the database
      app.post('/cleared',async(req,res)=>{
          try{
            const {productname,pproductprice,productquantity,orderdate,paymentstatus,email,phonenumber,buyersname,address}=req.body
            const clearedProduct=await client.query('insert into usercheckout (productname,pproductprice,productquantity,orderdate,paymentstatus,email,phonenumber,buyersname,address) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',[productname,pproductprice,productquantity,orderdate,paymentstatus,email,phonenumber,buyersname,address])
            res.json(clearedProduct.rows[0])
          }catch(err){
            res.json('unable to add clearedproduct')
            console.log(err.message,'cleared')
          }
       })

        // for getting information about the cleared product
        app.get('/cleared',async(req,res)=>{
          try{
            const clearedProduct=await client.query('select * from usercheckout')
            res.json(clearedProduct.rows)
          }catch(err){
              res.json('unable to get clearedproduct')
              console.log(err.message,'cleared')
            }
          })
        
        //for deleting a cleared product
        app.delete('/cleared/:id',async(req,res)=>{
          try{
              const{id}=req.params
              const deleteUser=await client.query('delete from usercheckout  where id =$1',[id])
              res.json('product was deleted')
          }catch(err){
              console.log(err.message)
          }
        })
        // for adding to login
        app.post('/addusers', async(req,res)=>{
          try{
          const data=req.body
          const newUser=await client.query('insert into users  (email,password,name,joined) values ($1) RETURNING *',[data])
          res.json(newUser.rows[0])
        }catch(err){
          console.log(err.message,'new addusers')
        }
        })
      


app.get('*',(req,res)=>{
  res.sendFile(__dirname + '/ecommerceFrontend/build/index.html')
})
app.listen(process.env.PORT || 3001,()=>{
  console.log(`im listening on ${process.env.PORT}`)
})