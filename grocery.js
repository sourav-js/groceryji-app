require("dotenv").config();
var express				=require("express"),
	app                 =express(),
passport 				=require("passport"),
passportlocal 			=require("passport-local"),
passportlocalmongoose  	=require("passport-local-mongoose"),
method					=require("method-override"),
mongoose 	            =require("mongoose"),
body                    =require("body-parser"),
session                 =require("express-session"),
method                  =require("method-override"),
https = require("https"),
qs = require("querystring"),



flash                   =require("connect-flash"),
// flashs                  =require("express-flash"),
nodemailer              =require("nodemailer"),
 upload                 =require("express-fileupload"),
path					=require("path"),
fs                      =require("fs"),

// fetch					=require("node-fetch"),			
request                 =require("request"),
cheerio                 =require("cheerio"),
checksum_lib            =require("./Paytm/checksum"),
Razorpay                =require("razorpay"),
crypto                  = require("crypto"),
cron                    =require("node-cron"),
config                  =require("./Paytm/config"),
secret_key="sk_test_51HYDa6DEQHowOc9K5x2DAfrJ2a2hDQn4NbzTg0TdIfw4put9bnK8D4Lz3MESPLuKzMBbWmwOI76qm3up59H9t9Y500VIrk1GAI",
public_key="pk_test_51HYDa6DEQHowOc9KWUatQJTsMzgOTdRLgxsglppcuXrLpaXH6ZAeewv2MCn0ZpdD08e3YH2mUZMFrJs6BQTnc6AX00FsXjmk2E",
stripe=require("stripe")(secret_key),

port=process.env.PORT || 2000;

path.parse("D:/Backup/web-server/shop/public");
mongoose.connect("mongodb+srv://localGrocery:TV8mAWGwGFJDyqhU@mongodb-tutorial.wvkvs.mongodb.net/Grocery?retryWrites=true&w=majority");
var marker="cant"
app.use(method("_method"));
app.use(body.urlencoded({extended:true}));
// app.use(body.json()); 

app.use(express.json());

app.use(upload());
app.use(flash());
// app.use(flashs());

app.use(express.static("./public"));
var MongoStore=require("connect-mongo"); 



// var mongostore = MongoStore.create({
//     mongooseConnection:mongoose.connection,
//     collection:"sessions"
// });
app.use(session({
	secret:"Grocery",
	resave:false,
	saveUninitialized:false,
	store:MongoStore.create({
    mongoUrl: 'mongodb+srv://localGrocery:TV8mAWGwGFJDyqhU@mongodb-tutorial.wvkvs.mongodb.net/Grocery?retryWrites=true&w=majority',
     // time period in seconds
    collection:"session"
  }),
    //new mongoDbStore({ mongooseConnection:mongoose.connection,collection:"sessions"}),
	cookie:{maxAge:1800*600*1000}
}));
app.use(passport.initialize());
app.use(passport.session());
let instance = new Razorpay({
  key_id: 'rzp_test_fEiizHFA6gj75D', // your `KEY_ID`
  key_secret: 'S7HnMrnoaUOMcqqgQTTSt4mf' // your `KEY_SECRET`
});
 var cartSchema=new mongoose.Schema({
	Name:String,
	image:String,
	Price:Number,
	offer:Number,
	key:String,
	pid:String,
 	ratings:String,
    off:String,
    qty:Number,
    urls:String,
    leters:String,
    author:String,
    mainuser:String

})
 var carts=mongoose.model("carts",cartSchema)
var stockCSchema=new mongoose.Schema({
    Name:String,
    image:String,
    Price:Number,
    offer:Number,
    key:String,
    pid:String,
    ratings:String,
    off:String,
    qty:Number,
    urls:String,
    leters:String,
    author:String,
    mainuser:String

})
 var stockC=mongoose.model("stockC",stockCSchema)
var wishSchema=new mongoose.Schema({
	Name:String,
	image:String,
	Price:Number,
	offer:Number,
	key:String,
	pid:String,
 	ratings:String,
    off:String,
    qty:Number,
    username:String,
    urls:String,  
    leters:String

})
 var wishlist=mongoose.model("wish",wishSchema)



var popSchema=new mongoose.Schema({

    id:String,
    text:String,
    image:String,
    urls:String,
    api:String,
    view:String
})



var pop=mongoose.model("pop",popSchema)


var selectSchema=new mongoose.Schema({

    id:String,
    date:{type:Date,default:Date.now()}    
})



var selects=mongoose.model("selects",selectSchema)



var userSchema=new mongoose.Schema({
	first:String,
	last:String,
	username:String,
	passsword:String,
	name:String,
    notinum:Number,
	sum:Number,
    month:String,
    offerHold:Boolean,
    
    selection:[{

            type: mongoose.Schema.Types.ObjectId,
            ref:"selects"

    }],
	cart:[
          {

          	type: mongoose.Schema.Types.ObjectId,
			ref:"carts"
          }
	],
	

	// categorys:
			// [  

			// 						{  
   //                                      type: mongoose.Schema.Types.ObjectId,
   //                                      ref:  "category"
											
			// 						}
				
			// 	]
			
	pops:[{

        type:mongoose.Schema.Types.ObjectId,
        ref:"pop"
    }]	
	
	
});

var stockSchema=new mongoose.Schema({
	id:String,
	

})
 


 var stocks=mongoose.model("stocks",stockSchema)

var notiSchema=new mongoose.Schema({
	username:String,
	

})
 


 var noti=mongoose.model("noti",notiSchema)
var categorySchema=new mongoose.Schema({
 
  Name:String,
  id:String,
  quan:Number,
  image:String,


})	


var categ=mongoose.model("categ",categorySchema)

var productSchema=new mongoose.Schema({
	Name:String,
	image:String,
	imagesec:String,
	urls:String,
	Price:Number,
	offer:Number,
	key:String,
	off:String,
	ratings:String,
    leters:String,
    empty:Boolean,
    stocking:Number,
    date:{type:Date,default:Date.now},
	stock:[
          {

          	type: mongoose.Schema.Types.ObjectId,
			ref:"stocks"
          }
	],

    
   notify:[
       {
            type: mongoose.Schema.Types.ObjectId,
			ref:"noti"      
       }
   ]
})
 


 var product=mongoose.model("product",productSchema)
 var orderSchema=new mongoose.Schema({
	 
   first:String,
   image:String,
   locality:String,
   last:String,
   name:String,
   city:String,
   phone:Number,
   roadNumber:String,
   landmark:String,
   productD:String,
   Price:Number,
   qty:Number,
   pid:String,
   returnId:String,
   returnQ:Number,
   pay:String,
   ifsc:String,
   account:String,
   mainuser:String,
   cartId:String,
   date:{type:Date,default:Date.now},
   cDate:{type:Date,default:Date.now},
   ordered:String,
   dateone:{type:Date,default:Date.now},
   shipped:String,
   datetwo:{type:Date,default:Date.now},
   outfor:String,
   datethree:{type:Date,default:Date.now},
   update:String,
   datefour:{type:Date,default:Date.now},
   autoCancel:Boolean,
   lid:String,  
   urls:String,
   leters:String,
   author:{
   	username:String,
   	id:String
   },
   month:String,




})
 


 var order=mongoose.model("order",orderSchema)
 var locationSchema=new mongoose.Schema({
	 
   first:String,
   image:String,
   locality:String,
   last:String,
   name:String,
   city:String,
   phone:Number,
   roadNumber:String,
   landmark:String,
   productD:String,
   Price:Number,
   qty:Number,
   pid:String,
   returnId:String,
   returnQ:Number,
   pay:String,
   ifsc:String,
   account:String,
   mainuser:String,
   cartId:String,
   date:{type:Date,default:Date.now},
   cDate:{type:Date,default:Date.now},
   ordered:String,
   dateone:{type:Date,default:Date.now},
   shipped:String,
   datetwo:{type:Date,default:Date.now},
   outfor:String,
   datethree:{type:Date,default:Date.now},
   update:String,
   datefour:{type:Date,default:Date.now},
   autoCancel:Boolean,  
   oid:String,


   author:{
   	username:String,
   	id:String
   }




})
 


 var location=mongoose.model("location",locationSchema)
 var coproductSchema=new mongoose.Schema({
	image:String,
	Price:Number,
	offer:Number,
	key:String,
	pid:String,
	ratings:String


})
 var coproduct=mongoose.model("coproduct",coproductSchema)
 // var checksum_lib = require('./checksum.js'),
 userSchema.plugin(passportlocalmongoose)
 var user=mongoose.model("user",userSchema)
passport.use(new passportlocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
 if(req.user) {   
  user.findById(req.user._id).populate("cart").exec(function(err,users){
              var sums=0
              var i=0
              while (i<users.cart.length){
              

                  sums=sums+users.cart[i].Price
                  
               
                  i=i+1
              } 
 
               users.sum=sums 
               users.save()
  
 })
}
    if(req.user) {   


   user.findById(req.user._id).populate("pops").exec(function(err,users){
     var totalnoti=0
     for (var i=0;i<users.pops.length;i++){

         if(users.pops[i].view==""){

             totalnoti=totalnoti+1
         }
     }
    
     res.locals.allnoti=totalnoti

   })

} 
 else{
       	 
	      res.locals.allnoti=0

 }


    res.locals.error=req.flash("error")
	res.locals.success=req.flash("success")
    res.locals.currentUser=req.user
    if (req.user){
     res.locals.sum=req.user.sum
    }
    next()
})
app.get("/time",function(req,res){

    res.send(new Date().toString())
})

// cron.schedule("*/2 * * * *",function(){

//     request("http://localhost:2000/checking",function(error,response,data){


//     })
// })

cron.schedule("*/1 * * * *",function(){

    request("http://localhost:2000/autoremove",function(error,response,data){


    })
})
app.get("/autoremove",function(req,res){

     console.log("autoremove hitting")
     user.find({},function(err,users){

          for(var i=0;i<users.length;i++){


              user.findById(users[i]._id).populate("pops").exec(function(err,found){

                 if(found.offerHold && found.offerHold==true){

                   if(found.pops.length>0){
                      for(var i=0;i<found.pops.length;i++){

                         if(found.pops[i].api=="vip"){

                             pop.findByIdAndDelete(found.pops[i]._id,function(err,info){


                             })
                         }
                      }
                    }  
                       found.offerHold=false
                      found.save()
                      console.log("changed")
                 }
              })
          }
     })
})


app.get("/checking",function(req,res){
 console.log("hitted")
 user.find({},function(err,users){
  
  for(var i=0;i<users.length;i++){

   user.findById(users[i]._id).populate("cart").populate("selection").populate("pops").exec(function(err,alluser){
      if(!alluser.offerHold){
        
         alluser.offerHold=false
         alluser.save()
                     
    }
     var m=0 
     var temp=0
     if (alluser.selection.length>0){
      if(alluser.cart.length>0){
      for (var j=0;j<alluser.cart.length;j++){
             
              if(alluser.cart[j].mainuser==alluser.username){

                 carts.findByIdAndDelete(alluser.cart[j]._id,function(err,info){


                 })
              }

        }
     }
      for (var j=0;j<alluser.selection.length;j++){
         
         
         product.findById(alluser.selection[j].id,function(err,prods){
              var flag=true 

              for (var p=0;p<alluser.cart.length;p++){

                  if(alluser.cart[p].pid==prods._id){

                      flag=false
                      break
                  }
              }


              if(flag==true){
                 m=m+1
                  
                  if(alluser.offerHold==true){

                      var amounts=prods.Price-20
                      var calc=parseInt((amounts*100)/prods.offer)
                      var calcs=calc + " % off"   
                 }
                 else if(alluser.offerHold==false){

                     var amounts=prods.Price
                     var calcs=prods.off
                 }
                 carts.create({pid:prods._id,image:prods.image,Name:prods.Name,Price:amounts,off:calcs,qty:1,urls:prods.urls,key:prods.key,author:"Added By GroceryJi",mainuser:alluser.username},function(err,car){
                    
                   for (var c=0;c<alluser.pops.length;c++){
                     // pop.drop()
                     
                      if(alluser.pops[c].api=="cart"){

                         pop.findByIdAndDelete(alluser.pops[c]._id,function(err,info){

                         }) 
                      }
                   
                   }
                      
                    
                      // if (temp==0){

                      //    for (var al=0;al<alluser.selection.length;al++){
         
                      //        product.findOne({_id:alluser.selection[al].id},function(err,checkprod){
                      //             var check=true 

                      //             for (var w=0;w<alluser.cart.length;w++){

                      //                 if(alluser.cart[w].pid==checkprod._id){

                      //                     check=false
                      //                     break
                      //                 }
                      //             }
                          
                      //             if(check==true){
                             
                      //                 temp=temp+1



                      //              }
             
                      //          })
                      //       }
                      //   }           



                            // alluser.cart.push(car)

                            
                            // if (temp==m){
                            //                      // pop.create({text:"Some product has been added to your cart,check it",api:"cart",urls:prods.urls,view:""},function(err,popup){ 
   
                            //     if(!alluser.notinum){

                            //        alluser.notinum=0
                                   
                            //   }
                            //     alluser.notinum=alluser.notinum+1 
                            //      console.log(alluser.notinum)
                            //      console.log("hitted here")
                            //                                 alluser.pops.push(popup)
 
                            //      alluser.save()
                            // // })
                            // }
                            

                      
                           
                   
                 
                 
                 })
              }
           
            
         
         })  
     }
             if(alluser.pops.length>0){
               for (var c=0;c<alluser.pops.length;c++){
                     // pop.drop()
                     
                      if(alluser.pops[c].api=="cart"){

                         pop.findByIdAndDelete(alluser.pops[c]._id,function(err,info){

                         }) 
                      }
                   
            }
           } 
       carts.find({mainuser:alluser.username},function(err,allcart){

             var p=0
             for(var d=0;d<allcart.length;d++){
                
                 carts.findById(allcart[d]._id,function(err,alls){
          product.findById(alls.pid,function(err,prods){

                     alluser.cart.push(alls)
                     p=p+1
                     if(p==allcart.length){
                         pop.create({text:"Some product has been added to your cart,check it",api:"cart",urls:prods.urls,view:""},function(err,popup){ 
                         alluser.pops.push(popup)
                         alluser.save()
                     
                     })
                     }
             })    
       })
             
             }
           
      })

     }
  })    
  } 
 })
})
 

app.get("/login",function(req,res){

	res.render("login.ejs")
})


app.get("/",function(req,res){
  res.render("landingPage.ejs")
})




app.get("/api",function(req,res)
	{
  var array = [];
  var array2 = [];
  for (var i=0; i<50000; i++)
  {
    array.push("Item >>> "+i);
    
  }
  array2 = array;

  const finalRes = { status: true, arrayData: array, arrayData2: array2, arrayData3: array, arrayData4: array2, arrayData5: array, arrayData6: array2,
    arrayData7: array, arrayData8: array2, arrayData9: array, arrayData10: array2, arrayData11: array, arrayData12: array2,
    arrayData8: array, arrayData9: array2, arrayData10: array, arrayData11: array2, arrayData12: array, arrayData13: array2,
    arrayData14: array, arrayData15: array2, arrayData16: array, arrayData17: array2, arrayData18: array, arrayData19: array2,
    arrayData20: array, arrayData21: array2, arrayData22: array, arrayData23: array2, arrayData24: array, arrayData25: array2,
    arrayData26: array, arrayData27: array2, arrayData28: array, arrayData29: array2, arrayData30: array, arrayData31: array2,

    arrayData32: array, arrayData33: array2, arrayData34: array, arrayData35: array2, arrayData36: array, arrayData37: array2,
    arrayData38: array, arrayData39: array2, arrayData40: array, arrayData41: array2, arrayData42: array, arrayData43: array2,
    arrayData44: array, arrayData45: array2, arrayData46: array, arrayData47: array2, arrayData48: array, arrayData49: array2,
    arrayData50: array, arrayData51: array2, arrayData52: array, arrayData53: array2, arrayData54: array, arrayData55: array2,
    arrayData56: array, arrayData57: array2, arrayData58: array, arrayData59: array2, arrayData60: array, arrayData61: array2,
    arrayData62: array
    //, arrayData63: array2, arrayData64: array, arrayData65: array2, arrayData66: array, arrayData67: array2


  };
  res.json(finalRes);
});

app.get("/product",function(req,res){

  product.find({Name:{$regex:"eggs",$options:"$i"}},function(err,prod){
  	console.log(prod)
  })

})




app.get("/category",function(req,res){

	res.render("category.ejs")
})

app.get("/catproduct/:keys",function(req,res){
  
    product.find({key:{$regex:req.params.keys,$options:"$i"}},function(err,prod){
               
                         res.render("products.ejs",{prod:prod})
                    
                   }) 

})


app.get("/wishlist",isLoggedin,function(req,res){
 user.findById(req.user._id).populate("pops").exec(function(err,users){
	wishlist.find({username:req.user.username},function(err,prod){
       
       if (prod.length>0){
	  
		res.render("wish.ejs",{prod:prod,users:users})
	 }
	 else{

	 			res.render("nowish.ejs",{prod:prod})

	 }

	})
})
})
app.get("/deleteWish/:id/:aid",function(req,res){

if(req.params.aid=="off"){
	wishlist.findByIdAndDelete(req.params.id,function(err,wishs){

		  req.flash("success","Items is deleted from wishList")
		  res.redirect("/wishlist")
             
		
	})
}
else{

product.findById(req.params.aid,function(err,prod){
	wishlist.find({username:req.user.username},function(err,wishs){


		for(var i=0;i<wishs.length;i++){

			 if(wishs[i].pid==prod._id){

            	wishlist.findByIdAndDelete(wishs[i]._id,function(err,wishs){

			 	})
		       
                   req.flash("success","Items is deleted from wishList")
	           res.redirect("/moreinfo/"+prod._id) 
	            
	           break
                }
	     }
	})
 
	 

})
}
        

})
app.get("/wishlist/:id",isLoggedin,function(req,res){

 user.findById(req.user._id,function(err,users){ 


  product.findById(req.params.id,function(err,prod){
   

     wishlist.create({Name:prod.Name,image:prod.image,pid:prod._id,Price:prod.Price,username:req.user.username,urls:prod.urls,leters:prod.leters},function(err,wish){
          
    	req.flash("success","Item Added To The WishList")
        res.redirect("back")
    
    })   
  
  })
      

})
})


app.get("/allProduct",function(req,res){
 if(req.user){

    var primary=req.user._id
 } 
else{
    var primary="4444"
}
  
user.findById(primary).populate("pops").exec(function(err,users){
  if (!req.query.query){
   product.find({},function(err,prod){
   	  	res.render("products.ejs",{prod:prod,users:users})

   })
 }
 else{
    var prods=""
    var data=req.query.query
    var search=data.toLowerCase()
   	var flag=true
   	var C=[]
    product.find({},function(err,produ){
   	  	
          
   	   for (var p=0;p<produ.length;p++){	
   	  	  for (var i=0;i<search.length;i++){
   	  		var k=i
   	  		flag=true
             
             for (var j=0;j<produ[p].key.length-1;j++){
                 if (search[k]!==produ[p].key[j]){

                       flag=false
                       break
                 }
                 k++
             }
                  
             if (flag==true){

             	flag=false
             	C.push(0)
                product.find({key:{$regex:produ[p].key,$options:"$i"}},function(err,prod){
                         
                         res.render("products.ejs",{prod:prod,users:users})
                    
                   }) 
                var produ=[]
                break
           }        
          
           
     }
     
           
   } 
   if (C.length==0){

   	 res.render("NoProduct.ejs")
   } 

    
    })
    
   
 }

 
  })
})




app.get("/moreinfo/:id",function(req,res){
  var prods=[]
  var flag=true
  var flags=true
  var mark=""
  if (req.user){

    var primary=req.user._id
  }
  else{

    var primary="333"
  }
  user.findById(primary).populate("pops").populate("selection").populate("cart").exec(function(err,users){
  product.findOne({_id:req.params.id}).populate("stock").populate("notify").exec(function(err,prod){
    
    if(req.user){
      if (users.offerHold==true){

          var actualPrice=prod.Price-20
          var calcs=parseInt((actualPrice*100)/prod.offer)
           var calc=calcs + "% off" 
         
      }
     else if(users.offerHold==false){


          var actualPrice=""
          var calc=""

    }
   } 
    else{
     

          var actualPrice=""
          var calc=""

    } 

     product.find({key:{$regex:prod.key,$options:"$i"}},function(err,prods){
      // prods.push(prods)      
      // console.log(prods)
            if(req.user){
           
                        var point=true
                        for (var i=0;i<users.selection.length;i++){
                       
                           if (users.selection[i].id==prod._id){

                             point=false
                             var added="yes"
                             break
                           }

                      }   
                      if (point==true){

                          var added="no"
                      }

              var points=true
                        for (var i=0;i<users.cart.length;i++){
                       
                           if (users.cart[i].pid==prod._id){
                            
                             if(users.cart[i].qty<prod.stock.length){   
                              
                               points=false
                               var cart="no"
                               break
                              }
                            else{
          
                              points=false
                               var cart="yes"
                               break
                            }

                           }
                          

                      }   
                      if (points==true){

                          var cart="no"
                      }


            if(req.user){ 
             for(var i=0;i<prod.notify.length;i++){

             	 if(prod.notify[i].username==req.user.username){

             	 	  flag=false
             	 	  mark="found"
             	 	  break
             	 }
             }
            } 
             if(flag==true){

             	   mark="not"


             }
            
             console.log(flags) 
             
           


               wishlist.find({username:req.user.username},function(err,wishd){
              
               for(var p=0;p<wishd.length;p++){  
              
                if(wishd[p].pid==prod._id){
                 console.log(mark)
                 res.render("moreInfoproduct.ejs",{prod:prod,prods:prods,mark:mark,wishes:wishd,users:users,added:added,cart:cart,calc:calc,actualPrice:actualPrice})
                
                 flags=false
                 break  
             }
            }
            
            if (flags==true){

            	                 res.render("moreInfoproduct.ejs",{prod:prod,prods:prods,mark:mark,wishes:"",users:users,added:added,cart:cart,calc:calc,actualPrice:actualPrice})

            }

            })
            }
       
      else{

                        res.render("moreInfoproduct.ejs",{prod:prod,prods:prods,mark:mark,wishes:"",users:users,added:"",cart:"no",calc:calc,actualPrice:actualPrice})


      }
  
})
})
})
})


app.get("/notify/:id",isLoggedin,function(req,res){
    var flag=true
  	product.findById(req.params.id).populate("notify").exec(function(err,prods){
          if(req.user){
             for(var i=0;i<prods.notify.length;i++){

             	 if(prods.notify[i].username==req.user.username){

             	 	  flag=false
             	 	  break
             	 }
             }
             if(flag==true){

             	   noti.create({username:req.user.username},function(err,infos){

             	   	   prods.notify.push(infos)
             	   	   prods.save()
             	   	  
             	   })


             }
	                   req.flash("success","You will be notified, when this product will be restored in stock")
             	   	   res.redirect("back") 
	
	}
	else{

		req.flash("error","Do Log In First")
        res.redirect("/login")
	}
	})

})

app.get("/cart",isLoggedin,function(req,res){

	
    user.findById(req.user._id).populate("cart").populate("pops").exec(function(err,users){
           
     console.log("here is cart"+req.query.noti)       
     if(req.query.noti){

          if(users.notinum && users.notinum>0){
             users.notinum=users.notinum-1
             users.save()
          }
    }
       	 	
            if(users.cart.length>0){
       		 
               
              res.render("cart.ejs",{users:users})
       		
            }
       		else{

       			res.render("nocart.ejs")
       		}
	
	
    
    })
}) 


app.get("/carti/:cid/:pid",function(req,res){
  user.findById(req.user._id,function(err,users){
	carts.findById(req.params.cid,function(err,cart){
 
      product.findById(req.params.pid).populate("stock").exec(function(err,prod){

          if (cart.qty<prod.stock.length){

          	 cart.qty=cart.qty+1
             cart.Price=cart.qty*prod.Price
          	 users.sum=users.sum+prod.Price
          	 users.save()
          	 cart.save()
             req.flash("success","quantity updated")
             res.redirect("back")
          }                 
          else{

             req.flash("error","quantity can't updated more")
             res.redirect("back")          	
          }
      })
    })
})
})

app.get("/cartd/:cid/:pid",function(req,res){
  user.findById(req.user._id).populate("cart").exec(function(err,users){ 
    product.findById(req.params.pid,function(err,prod){

  
   carts.findById(req.params.cid,function(err,cart){
  
   if(cart.qty>1){
   
       	cart.updateOne({qty:cart.qty-1,Price:(cart.qty-1)*prod.Price},function(err,info){
       // req.user.sum=req.user.sum-(cart.qty-1)*prod.Price
  	          console.log(req.user.sum-prod.Price)
              

  	})
    users.updateOne({sum:req.user.sum-prod.Price},function(err,info){

     	        })  
  
  }
  else{
    
  	if (users.cart.length==1) 
              { 
                 users.updateOne({sum:0},function(err,info){

     	        })              
  	      }
  	      else{
  	      	
              users.updateOne({sum:req.user.sum-cart.Price},function(err,info){

     	        })   	        
  	      }  
  	carts.deleteOne({_id:cart._id},function(err,car){
           
  	}) 
    
   
  }
  req.flash("success","quantity reduced")
  res.redirect("back")
  })
})
})
})



app.post("/cart/:id",isLoggedin,function(req,res){
 user.findById(req.user._id).populate("cart").exec(function(err,users){	
  product.findById(req.params.id).populate("stock").exec(function(err,prod){
    

    var flag=true
    var pr=0
     // req.session.sum=0
     
     
     if (!req.user.sum){

     	console.log("sum nei too")
        users.sum=0
     	
     }  
  
     if (Number(req.body.qty)<=prod.stock.length){ 
      for (var i=0;i<users.cart.length;i++){

     	if(users.cart[i].pid==prod._id){
            flag=false 
     	 if (users.cart[i].qty!==prod.stock.length){	
     		 
     		  if (users.offerHold==false){

                 var amounts=(users.cart[i].qty+Number(req.body.qty))*prod.Price
              }
              
              else if(users.offerHold==true){

                 var amounts=((users.cart[i].qty+Number(req.body.qty))*prod.Price)
                 var money=amounts
                 for(var y=0;y<users.cart[i].qty+Number(req.body.qty);y++){
                     amounts=amounts-20
                 }
               
              
              }
              
              carts.findById(users.cart[i]._id,function(err,cartp){ 
     		  cartp.updateOne({qty:users.cart[i].qty+Number(req.body.qty),Price:amounts},function(err,info){
     		  console.log(users.cart[i].qty)
     		  users.cart[i].qty=users.cart[i].qty+Number(req.body.qty)
     		  // req.user.sum=req.user.sum+(req.body.qty*prod.Price)
     		   


     		  console.log(users.cart[i].qty)
     		  
     		  if( users.cart[i].qty>prod.stock.length){
                if (users.offerHold==false){

                         var amounts=prod.stock.length*prod.Price
                      }
                      else if(users.offerHold==true){

                         var amounts=prod.stock.length*prod.Price
                      
                         for(var y=0;y<prod.stock.length;y++){
                             amounts=amounts-20
                         }
                      }
                cartp.updateOne({qty:prod.stock.length,Price:amounts},function(err,info){ 
                 
                 users.cart[i].qty=prod.stock.length
                 // req.user.sum=prod.stock.length*prod.Price
              //     users.updateOne({sum:prod.stock.length*prod.Price},function(err,info){

     	        // })
                       
                
                        
             })
                  

     		 }
     		
            
             })        
           	 // carts.findById(users.cart[i]._id,function(err,newcart){ 
              // console.log("here")
              // console.log(newcart.qty)
              // console.log(cartp.qty)

              // console.log(pr)
              // console.log(".............") 
           	 
      	    req.flash("success","quantity is increased")
      	    res.redirect("back")
      	    
      	   })
      	  }
      	  
      	  else{

            req.flash("error","can't add more product") 
      	  	res.redirect("back")
      	  }
      	
        break
      }
     }
     if(flag==true){
     if(users.offerHold==true){

         var amounts=Number(req.body.qty)*prod.Price
         var money=amounts
         for(var i=0;i<Number(req.body.qty);i++){

             amounts=amounts-20
         }
         var calc=parseInt((amounts*100)/prod.offer)
         var calcs=calc + "% off"
     
     }
     else if(users.offerHold==false){

         var amounts=Number(req.body.qty)*prod.Price
         var calcs=prod.off 
     }

      carts.create({image:prod.image,Name:prod.Name,Price:amounts,offer:prod.offer,key:prod.key,pid:prod._id,off:calcs,qty:Number(req.body.qty),urls:prod.urls,leters:prod.leters},function(err,onecart){

      	    users.cart.push(onecart)

            users.sum=users.sum+amounts
            users.save()
            req.flash("success","product added to the cart")
            res.redirect("/moreinfo/"+prod._id)
      })
    }
  }
 
  else{
    req.flash("error","product quantity is out of stock") 
  	res.redirect("back")
  } 
  
            
 })
})
})

app.get("/times",function(req,res){

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

     console.log(month[date.getMonth()])
})


app.get("/month/:id",function(req,res){
 

     var totalSum=0
 
if (!req.query.search){
     order.find({month:req.params.id},function(err,orders){
      if(orders.length>0){

       for (var i=0;i<orders.length;i++){

          if(orders[i].update!=="Canceled"){
            
             totalSum=totalSum+orders[i].Price

          }
       }
     
         res.render("monthOrder.ejs",{orders:orders,month:req.params.id,totalSum:totalSum,search:"",month:req.params.id})
      }
      else{

                         res.render("noOrders.ejs")


      }

     })
  }

  else{

     
          var key=req.query.search
          var find=[]
          order.find({month:req.params.id},function(err,orders){

              
              for(var i=0;i<orders.length;i++){
             
              
                 for (var j=0;j<orders[i].name.length;j++){

                     var k=j
                     var flag=true
                     for (var p=0;p<key.length;p++){
                      
                         if(orders[i].name[k].toLowerCase()!==key[p].toLowerCase()){

                                      flag=false
                                      break

                  
                        }
                        k=k+1 
                       
                     
                    }
                    if (flag==true){
                        console.log(orders[i].name)
                        find.push(0)
                      order.find({name:{$regex:orders[i].name,$options:"$i"}},function(err,orderf){
                         for (var i=0;i<orderf.length;i++){

                          if(orderf[i].update!=="Canceled" && orderf[i].month==req.params.id){
                            
                             totalSum=totalSum+orderf[i].Price

                          }
                       }

                            
                                res.render("monthOrder.ejs",{orders:orderf,month:req.params.id,totalSum:totalSum,search:key})

                       })

                       var orders=[]

                       break
                    }

                 
                 }       

                      

              }
           

            if (find.length==0){

                               res.render("nocustomer.ejs")



            }       


      })
        

  }


})

app.get("/vip",function(req,res){
    
 
  if(!req.query.search){
           user.find({offerHold:true},function(err,users){

       if(users.length>0){ 
         res.render("vip.ejs",{users:users,search:""})
       }
       else{

        res.render("novip.ejs")
       }
      
  })
 }
 else{
    var key=req.query.search
    var find=[]
    user.find({offerHold:true},function(err,users){
     

     for(var i=0;i<users.length;i++){
       


             for (var j=0;j<users[i].name.length;j++){

                 var flag=true
                 var p=j
                 for (k=0;k<key.length;k++){

                     if(users[i].name[p].toLowerCase()!==key[k].toLowerCase()){

                         flag=false
                         break

                     }
                     p=p+1
                 }
                 if(flag==true){
                     user.find({name:{$regex:users[i].name,$options:"$i"}},function(err,found){

                                  res.render("vip.ejs",{users:found,search:req.query.search})

                     })
                   find.push(0)

                   var users=[]
                   break
                 }
         
              }
           
         
        
        
     }
    
    if(find.length==0){

      res.render("novip.ejs")
              
    } 

})
 }

})



app.get("/moreMonth/:id/:mon",function(req,res){

     
     
     var total=0
     user.findOne({username:req.params.id},function(err,alluser){
      order.find({mainuser:req.params.id},function(err,orders){

       for (var i=0;i<orders.length;i++){

          if(orders[i].month==req.params.mon && orders[i].update!=="Canceled"){
            
             total=total+orders[i].Price

          }
       }
      
        if(alluser.offerHold==true){

             var vip=true
        }
        else{

            var vip=false
        }
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        
         var date=new Date()
         
         res.render("monthuser.ejs",{total:total,alluser:alluser,month:req.params.mon,vip:vip,secondmonth:months[date.getMonth()]})  
     
     })
 })
     
})

app.get("/updateCustomersStatus/:id/:mon",function(req,res){
 const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                            var date=new Date()
 user.findById(req.params.id).populate("pops").exec(function(err,users){

     if(users.offerHold==false){
 pop.create({text:"You are a VIP customer Of " +" "+ req.params.mon,api:"vip",view:"viewed"},function(err,popup){
            
            users.pops.push(popup)
           users.offerHold=true
         users.month=months[date.getMonth()]

         users.save() 
           
              
 
 })         
        
      req.flash("success",users.name + " is now VIP Customer")
      res.redirect("back")  
   
 var transport=nodemailer.createTransport({
                                              service:"gmail",
                                              auth:{
                                               user:"grocery.ofc@gmail.com",
                                               pass:process.env.password
                                              }
                                               });  

                                         var mailoptions={
                                           from:"grocery.ofc@gmail.com",
                                           bcc:`${users.username}`,
                                           subject:"GroceryJi",
                                           html:`Hi,welcome to GroceryJi<br>
                                           Hi,${users.name},You Are A VIP Customer Of ${req.params.mon}... 
                                           <br>
                                           <b>Congratulations</b>
                                            <br>
                                                       
                        
                        
                                            <a href="https://grocery-ji.herokuapp.com/"><button style=color:green>GroceryJi</button></a>                       
                                                          
                                                        `
                                    } 
                              
                             
                                   
 
                                      
                              console.log("hmmmmm")
                               transport.sendMail(mailoptions,function(err,info){
                                    if(err)
                                    {
                                        req.flash("error","something went wrong...");

                                        res.redirect("/login");
                                    }
                                        else{
                                            console.log("here")

                                        }


                                })  

     }
   else{

    
    users.offerHold=false
         users.save()
      
   if(users.pops.length>0){ 
    for(var i=0;i<users.pops.length;i++){

         if(users.pops[i].api=="vip"){

             pop.findByIdAndDelete(users.pops[i]._id,function(err,info){


             })
         }
    }
   } 
    req.flash("error",users.name + " is removed from VIP Customer")
    res.redirect("back")  

   }
  

  })    




})

app.get("/buy/:pid",isLoggedin,function(req,res){

   var author={

   	username:req.user.username,
   	id:req.user._id
   }
  user.findById(req.user._id,function(err,users){ 

   product.findById(req.params.pid).populate("stock").exec(function(err,prod){
   if (users.offerHold==true){

     var amounts=(req.query.qty*prod.Price)-20
   }
   else if(users.offerHold==false){

          var amounts=req.query.qty*prod.Price

  

   }

   if(prod.stock.length>=req.query.qty){ 
    if(!req.query.new){   
      location.find({mainuser:req.user.username},function(err,preord){
        console.log(preord)
        if (preord.length>0){
               
                         res.render("preorder.ejs",{prod:prod,qty:req.query.qty,key:public_key,preord:preord,amount:amounts})

            
         }
         else{
            

         res.render("order.ejs",{prod:prod,qty:req.query.qty,key:public_key,amount:amounts})
       }
     })
   }
   else{
              console.log(req.query.qty*prod.Price)
   	          res.render("order.ejs",{prod:prod,qty:req.query.qty,key:public_key,amount:amounts})

   }
   }
   else{

   	req.flash("error","Selected quantity is greater than the number of total stock of this product")
   	res.redirect("back")
   }
   })


 })
})

app.get("/allbuy",function(req,res){

   location.find({mainuser:req.user.username},function(err,preord){
        console.log(preord)
        if(!req.query.new){


         if(preord.length>0){
               
                         res.render("preordercart.ejs",{prod:"3ert",qty:0,key:public_key,preord:preord})

            
         }
         else{
            

        res.render("allcartorder.ejs",{key:public_key,prod:"3ert"})
       }
     }
     else{

                     res.render("allcartorder.ejs",{key:public_key,prod:"3ert"})


     }
     })
   

   
})


app.post("/allbuy/:id",function(req,res){

  location.findById(req.params.id,function(err,loc){ 
   user.findById(req.user._id).populate("cart").exec(function(err,users){


   if (req.body.method=="Stripe"){


  	 stripe.customers.create({ 
					        email: req.body.stripeEmail, 
					        source: req.body.stripeToken, 
					        name: req.user.username, 
					        address: { 
					            line1: 'TC 9/4 Old MES colony', 
					            postal_code: '110092', 
					            city: 'Kolkata', 
					            state: 'India', 
					            country: 'India', 
					        } 
					    }) 
					    .then((customer) => { 

					    		return stripe.charges.create({ 
					            amount:req.user.sum,    // Charing Rs 25 
					            description:"All Products Of Your Cart", 
					            currency: 'INR', 
					            customer: customer.id 
					       	

					        })

					   })	
					    	.then((charge) => {
                           
                                 

                           })
					    	.catch((error)=>{

                           })


  }	
  
   
                        if(req.body.method=="Stripe"){

                              var pay="Paid"
                           }
                           
                           
                          else if(req.body.method=="razorpay"){

                            var pay="Paid"
                          }  


                           else if (req.body.method=="Cash-On-Delivery"){
 
                                 var pay="Cash-On-Delivery"


          

                           }
    	 var author={
    	 	username:req.user.username,
    	 	id:req.user._id
    	 }
    	 
                  
                            const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                            var d=new Date()

                                           order.find({mainuser:req.user.username},function(err,orders){
                                           var flag=true
                                   
                                           if(loc){ 
                                                for(var p=0;p<orders.length;p++){

                                                         if(orders[p].lid==loc._id){
                                                                 
                                                                  flag=false
                                                                    
                                                                 	 for (var i=0;i<users.cart.length;i++){
    
                                                                      
                                                                           
                                                                           order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:users.cart[i].Price,returnId:"",author:author,productD:users.cart[i].Name,qty:users.cart[i].qty,locality:req.body.locality,pay:pay,image:users.cart[i].image,returnQ:0,pid:users.cart[i].pid,ifsc:"",account:"",cartId:users.cart[i]._id,ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,lid:loc._id,mainuser:req.user.username,urls:users.cart[i].urls,leters:users.cart[i].leters,month:months[d.getMonth()],offerHold:false},function(err,orders){
	 
	                                                                     product.findById(orders.pid).populate("stock").exec(function(err,pro){                                
	                                                        pro.stocking=pro.stocking-orders.qty

	                                                          pro.date=Date.now()
	                                         	              
	                                                        for(var p=0;p<orders.qty;p++){
	                                                           console.log("here inside") 
	                                        	               stocks.deleteOne({id:orders.pid},function(err,info){
	                            
	                                         	          
	                                         	                          })
	                                                 
	                                                         }                 

	                                                        carts.deleteOne({_id:orders.cartId},function(err,inf){

	                                                            })
	                           
	                           
		                                        if (pro.stocking==0){
		                           	                  pro.empty=true
		                           	                  pro.stocking=0
		                           	                   pro.date=Date.now()
		                                               pop.find({},function(err,pup){

                                                            for (var i=0;i<pup.length;i++){

                                                               if (pup[i].id==pro._id){

                                                                    pop.findByIdAndDelete(pup[i]._id,function(err,info){

                                                                 })
                                                               }
                                                            }
                                                         })  	 
		                                          
                                                  }
                                                  pro.save()

	                           })
	                 })

                }
      
                                                               
                                                               
                                                               break
                                                               }  
                                                                
                                              // var ids=users.cart[i]._id
                                               }         
                                               }
                                               
                                              if(flag==true){
                                          location.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,returnId:"",author:author,locality:req.body.locality,pay:pay,returnQ:0,ifsc:"",account:"",ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",mainuser:req.user.username},function(err,loca){
 
                                                for (var j=0;j<users.cart.length;j++){

                                                   
                                       
	                                               order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:users.cart[j].Price,returnId:"",author:author,productD:users.cart[j].Name,qty:users.cart[j].qty,locality:req.body.locality,pay:pay,image:users.cart[j].image,returnQ:0,pid:users.cart[j].pid,ifsc:"",account:"",cartId:users.cart[j]._id,ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,lid:loca._id,mainuser:req.user.username,urls:users.cart[j].urls,leters:users.cart[j].leters,month:months[d.getMonth()],offerHold:false},function(err,orders){
	 
	                                                   product.findById(orders.pid).populate("stock").exec(function(err,pro){                                
	                                                        pro.stocking=pro.stocking-orders.qty

	                                                          pro.date=Date.now()
	                                                        for(var p=0;p<orders.qty;p++){
	                                                           console.log("here inside") 
	                                        	               stocks.deleteOne({id:orders.pid},function(err,info){
	                            
	                                         	          
	                                         	                          })
	                                                 
	                                                         }                 

	                                                        carts.deleteOne({_id:orders.cartId},function(err,inf){

	                                                            })
	                           
	                           
		                                        if (pro.stocking==0){
		                           	                  pro.empty=true
		                           	                  pro.stocking=0
		                           	                   pro.date=Date.now()
		                                         	
		                                          }
                                                  pro.save()

	                           })
	                 })
	  	 }
	  	 })
	  	 
                                
         }
           })                      


                                       
                               

                              var transport=nodemailer.createTransport({
			                                  service:"gmail",
			                                  auth:{
				                               user:"grocery.ofc@gmail.com",
				                               pass:process.env.password
			                                  }
		                                       });	


			                             var mailoptions={
				                           from:"grocery.ofc@gmail.com",
				                           bcc:`${req.user.username}`,
				                           subject:"GroceryJi",
				                           html:`Hi,${req.body.first},welcome to GroceryjI<br>
                                           All product of your cart is successfully
                                           perchased..
                                           <br>
                                           Amount ${pay}:${req.user.sum}
				                            <br>
						                               
						
						
					                        <a href="https://grocery-ji.herokuapp.com/Orders"<button style=color:green>Check Your Order</button></a>						
						                                  
						                                  </form>
						                                     `
		 	               } 
                              console.log("hmmmmm")
				               transport.sendMail(mailoptions,function(err,info){
									if(err)
									{
										console.log("error")
									}
										else{
											console.log("here")

										}


			                    })    
    
                  
                  users.sum=0
                  users.save()
                  req.flash("success","successfully perchased all product of your cart")
                  res.redirect("/orders") 


  })

   
})

})



app.post("/razor/:pid/:lid",function(req,res){
  location.findById(req.params.lid,function(err,loc){ 

        product.findById(req.params.pid).populate("stock").exec(function(err,prod){
    user.findById(req.user._id,function(err,users){
    if(users.offerHold==true){

         var amounts=(req.body.qty*prod.Price)-20
    }
    else if(users.offerHold==false){

         var amounts=req.body.qty*prod.Price
    }
    if (loc){
 
        res.render("razor.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:loc._id,prod:prod,amount:amounts})

 
 }      
 else{

    res.render("razor.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:"tttt",prod:prod,amount:amounts})



 } 
     
    
 

})

})
})

})


app.post("/razorcart/:lid",function(req,res){
  location.findById(req.params.lid,function(err,loc){ 

    if (loc){
 
        res.render("razorcart.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:loc._id,amount:req.user.sum})

 
 }      
 else{

    res.render("razorcart.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:"tttt",amount:req.user.sum})



 } 
     
    
 




})

})


app.post("/api/payment/order",(req,res)=>{
params=req.body;
instance.orders.create(params).then((data) => {
       res.send({"sub":data,"status":"success"});
}).catch((error) => {
       res.send({"sub":error,"status":"failed"});
})
});

app.get("/deleteselection/:id",function(req,res){

     user.findById(req.user._id).populate("selection").exec(function(err,users){
    
       
         for (var i=0;i<users.selection.length;i++){

             if(users.selection[i].id==req.params.id){
                  
                   selects.deleteOne({_id:users.selection[i]._id},function(err,sele){
                      
                       req.flash("success","removed from future selects")
                       res.redirect("/moreinfo/"+req.params.id)

                   })
 
            
               break
             }
              
         
         }
     })
})

app.get("/selection/:id",function(req,res){
 user.findById(req.user._id).populate("selection").exec(function(err,users){
    

    product.findById(req.params.id,function(err,prods){
           
               var flag=true
               for (var i=0;i<users.selection.length;i++){

                   if(users.selection[i].id==prods._id){
                       
                        req.flash("error","already added")
                     res.redirect("back") 
                        flag=false
                        break
                   }
               }
              
               if (flag==true){

                  selects.create({id:prods._id},function(err,selec){

                     users.selection.push(selec)
                     users.save()
                     req.flash("success","you will be notified,when the product will be added")
                     res.redirect("back")

                  })
               }


    })
})

})

app.post("/buy/:pid/:lid",function(req,res){
 const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
 var d=new Date() 


 location.findById(req.params.lid,function(err,loc){ 
   user.findById(req.user._id).populate("cart").populate("pops").exec(function(err,users){
        
        product.findById(req.params.pid).populate("stock").exec(function(err,prod){
        
        if(!users.offerHold){

             users.offerHold=false
             users.save()
        } 

            if(users.offerHold==true){

                 var amounts=(req.body.qty*prod.Price)-20
            }
            else if(users.offerHold==false){

                    var amounts=req.body.qty*prod.Price


            }

        if (req.body.qty<=prod.stock.length){
        	if (req.body.method=="Stripe"){ 
        	 
           
            stripe.customers.create({ 
					        email: req.body.stripeEmail, 
					        source: req.body.stripeToken, 
					        name: req.user.username, 
					        address: { 
					            line1: 'TC 9/4 Old MES colony', 
					            postal_code: '110092', 
					            city: 'Kolkata', 
					            state: 'India', 
					            country: 'India', 
					        } 
					    }) 
					    .then((customer) => { 

					    		return stripe.charges.create({ 
					            amount:amounts,    // Charing Rs 25 
					            description:prod.Name, 
					            currency: 'INR', 
					            customer: customer.id 
					       	

					        })

					   })	
					    	.then((charge) => {
                           })
					    	.catch((err) => { 
        			          res.send(err)    
    				        })


}
                           
      


                            if(users.offerHold==true){

                                 var amounts=(req.body.qty*prod.Price)-20
                            }
                            else if(users.offerHold==false){

                                    var amounts=req.body.qty*prod.Price


                            }

                           

                            

                           var flag=true 
                           for(var i=0;i<users.cart.length;i++){
                                 
                                  if (users.cart[i].pid==prod._id){
                                      
                                      carts.findById(users.cart[i]._id,function(err,car){
                                           
                                            if (car.qty==req.body.qty){
                                                users.sum=users.sum-car.Price
                                                users.save()
                                            	car.deleteOne({_id:car._id},function(err,info){

                                            	})
                                            }
                                           else if(car.qty<req.body.qty){
                                                users.sum=users.sum-car.Price
                                                users.save()
                                                car.deleteOne({_id:car._id},function(err,info){

                                            	})

                                           }
                                           else{
                                                  users.sum=users.sum-(req.body.qty*prod.Price)
                                                  users.save()
                                                  car.updateOne({qty:car.qty-req.body.qty,Price:car.Price-amounts},function(err,info){

                                                  })

                                           }
                                           
                                      })
                                       break
                                      }
                                  }
                                  
                             
                           var author={
                           	username:req.user.username,
                           	id:req.user._id
                           }
                           var p=0
                            prod.stocking=prod.stocking-req.body.qty
                            prod.date=Date.now()
                            
                           for (var i=0;i<req.body.qty;i++){
                                     	
                                     	
                                     	stocks.deleteOne({id:prod._id},function(err,info){
                                               
                                                   
                                     	 
                                     	})

                                      
                                   
                            	 }
                           

                           if(prod.stocking==0){
                           	 prod.empty=true
                           	 prod.stocking=0
                           	 prod.date=Date.now()
                           
                             pop.find({pid:prod._id},function(err,pup){

                                for (var i=0;i<pup.length;i++){

                                   if (pup[i].id==prod._id){


                                            pop.findByIdAndDelete(pup[i]._id,function(err,info){

                                     })
                                   }
                                }
                             })                             
 
                           }
                           prod.save()
                           
                           if(req.body.method=="Stripe"){

                           	  var pay="Paid"
                           }
                           
                           
                          else if(req.body.method=="razorpay"){

                            var pay="Paid"
                          }  


                           else if (req.body.method=="Cash-On-Delivery"){
 
                                 var pay="Cash-On-Delivery"


          

                           }
                           
                            var id=""
     
                            if(users.offerHold==true){

                                     var amounts=(req.body.qty*prod.Price)-20
                                }
                                else if(users.offerHold==false){

                                        var amounts=req.body.qty*prod.Price


                                }
 
   
                            order.find({mainuser:req.user.username},function(err,orders){
                                  var flag=true
                                   
                                if(loc){ 
                                  for(var i=0;i<orders.length;i++){

                                           if(orders[i].lid==loc._id){

                                                 order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:amounts,returnId:"",author:author,productD:prod.Name,qty:Number(req.body.qty),locality:req.body.locality,pay:pay,image:prod.image,returnQ:0,pid:prod._id,ifsc:"",account:"",cartId:"",ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,mainuser:req.user.username,lid:loc._id,urls:prod.urls,leters:prod.leters,month:months[d.getMonth()]},function(err,order){
                            
                           
                                                      
                           
 
                                                     
                                         var transport=nodemailer.createTransport({
			                                  service:"gmail",
			                                  auth:{
				                               user:"grocery.ofc@gmail.com",
				                               pass:process.env.password
			                                  }
		                                       });	


			                             var mailoptions={
				                           from:"grocery.ofc@gmail.com",
				                           bcc:`${req.user.username}`,
				                           subject:"GroceryjI",
				                           html:`Hi,${req.user.first},welcome to GroceryjI<br>
                                           Your Order ${prod.Name}, Price: ${prod.Price},Qty:${req.body.qty} is successfully
                                           perchased..
                                           <br>
                                           Amount ${pay}:<b>${req.body.qty*prod.Price}</b>
				                            <br>
						                               
						
						
					                        <a href="https://grocery-ji.herokuapp.com/Orders/${order._id}"<button style=color:green>Check Your Order</button></a>						
						                                  
						                                  </form>
						                                     `
		 	               } 
                              console.log("hmmmmm")
				               transport.sendMail(mailoptions,function(err,info){
									if(err)
									{
										req.flash("error","something went wrong...");

									}
										else{
											console.log("here")

										}


			                                             


                                  })
                                 

                    })





                                                 console.log("here")
                                                 console.log(id)
                                                 flag=false
                                                 break        

                                           }

                               
                                 }                      
                                } 
                                 if(flag==true){

                                                        location.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:req.body.qty*prod.Price,returnId:"",author:author,productD:prod.Name,qty:Number(req.body.qty),locality:req.body.locality,pay:pay,image:prod.image,returnQ:0,pid:prod._id,ifsc:"",account:"",cartId:"",ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,mainuser:req.user.username},function(err,loca){
                                                 
                                                    

                                                         order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:amounts,returnId:"",author:author,productD:prod.Name,qty:Number(req.body.qty),locality:req.body.locality,pay:pay,image:prod.image,returnQ:0,pid:prod._id,ifsc:"",account:"",cartId:"",ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,mainuser:req.user.username,lid:loca._id,urls:prod.urls,leters:prod.leters,month:months[d.getMonth()],offerHold:false},function(err,order){
                            
                           
                                                      
                           
 
                                                     
                                         var transport=nodemailer.createTransport({
			                                  service:"gmail",
			                                  auth:{
				                               user:"grocery.ofc@gmail.com",
				                               pass:process.env.password
			                                  }
		                                       });	


			                             var mailoptions={
				                           from:"grocery.ofc@gmail.com",
				                           bcc:`${req.user.username}`,
				                           subject:"GroceryJi",
				                           html:`Hi,${req.user.first},welcome to GroceryJi<br>
                                           Your order ${prod.Name}, Price: ${prod.Price},Qty:${req.body.qty} is successfully
                                           perchased..
                                           <br>
                                           Amount ${pay}:${req.body.qty*prod.Price}
				                            <br>
						                               
						
						
					                        <a href="https://grocery-ji.herokuapp.com/Orders/${order._id}"<button style=color:green>Check Your Order</button></a>						
						                                  
						                                  </form>
						                                     `
		 	               } 
                              console.log("hmmmmm")
				               transport.sendMail(mailoptions,function(err,info){
									if(err)
									{
										req.flash("error","something went wrong...");

									}
										else{
											console.log("here")

										}


			                                             


                                  })
                                 

                    })
                                 
                  
               
           
              })  
         
             }
        
        })                  
                          
          req.flash("success","product purchased successfully")
           res.redirect("/moreinfo/"+prod._id)
     }
      else{

          	req.flash("error","quantity is out of stock")
          	  res.redirect("back")
       } 	
   
   })
   })
})
})
app.get("/orders",isLoggedin,function(req,res){

	order.find({mainuser:req.user.username},function(err,orders){
	  if (orders.length>0){


		res.render("orders.ejs",{orders:orders})
	}
    else{
    	res.render("nomyorders.ejs")
    } 	
	})
})



app.get("/notifications/:id",function(req,res){

     pop.findById(req.params.id,function(err,popup){

         if(popup.api=="cart"){

             res.redirect("/cart")

         }
         else if(popup.api!=="vip"){

             res.redirect("/moreinfo/"+popup.id)
         }

         popup.updateOne({view:"viewed"},function(err,pp){


         })
     })
}) 



app.get("/orders/:id",function(req,res){

 user.findById(req.user._id).populate("pops").exec(function(err,users){
 	order.findById(req.params.id,function(err,orders){
		res.render("ordersmore.ejs",{orders:orders,users:users})
	})
})
})

app.get("/updateOrders/:id",function(req,res){

     	 location.findById(req.params.id,function(err,loc){

         res.render("updateOrder.ejs",{loc:loc})
   })

})

app.post("/updateOrders/:id",function(req,res){

	 location.findById(req.params.id,function(err,loc){

	 	            if(req.body.first){


                       loc.first=req.body.first
                       
                     }
                     if (req.body.last){

                        loc.last=req.body.last
                     } 
                        
                       loc.name=loc.first +" "+ loc.last 
                       if (req.body.phone){


                          loc.phone=req.body.phone
                        }
                       if (req.body.roadNumber){


                        loc.roadNumber=req.body.road
                      }
                       
                       if(req.body.city){


                        loc.city=req.body.city
                      }
                       
                       if(req.body.landmark){


                        loc.landmark=req.body.landmark
                      }
                      
                       if(req.body.locality){


                         loc.locality=req.body.locality
                       }
                   
                     loc.save()

	 	 order.find({lid:loc._id},function(err,orders){

	 	 	 orders.forEach(function(data){
                     
                     if(req.body.first){


                       data.first=req.body.first
                       
                     }
                     if (req.body.last){

                        data.last=req.body.last
                     } 
                        
                       data.name=data.first +" "+ data.last 
                       if (req.body.phone){


                          data.phone=req.body.phone
                        }
                       if (req.body.roadNumber){


                        data.roadNumber=req.body.road
                      }
                       
                       if(req.body.city){


                        data.city=req.body.city
                      }
                       
                       if(req.body.landmark){


                        data.landmark=req.body.landmark
                      }
                      
                       if(req.body.locality){


                         data.locality=req.body.locality
                       }
                   
                     data.save()	 	 	 
	 	 	 

	 	 	 })
	 	            req.flash("success","Updated,Go Back To Previous Page")
                   res.redirect("back")
	 	 })
	 })
})



app.get("/cancel/:id",function(req,res){

	order.findById(req.params.id,function(err,orders){
		
              

		res.render("cancel.ejs",{orders:orders})
	})
})


app.post("/cancel/:id",function(req,res){
 var flag=true
	order.findById(req.params.id,function(err,orders){
		product.findById(orders.pid).populate("stock").populate("notify").exec(function(err,prods){

		    
			
			if(orders.pay=="Cash-On-Delivery"){
			  var ifsc=""
			  var account=""
              var phone=orders.phone 
		   }
		   else{

		   	
		   	    var ifsc=req.body.ifsc
			  var account=req.body.account
			  var phone=req.body.number


		   	  }

		   	   orders.updateOne({returnId:orders._id,ifsc:ifsc,account:account,phone:phone,cDate:Date.now(),update:"Canceled",datefour:Date.now()},function(err,info){
  
              
                
			  console.log("total stock before cancel")
			  console.log(prods.stock.length)
		
  		
		
  })
	   
         
 
         if(prods.stock.length==0){

            prods.stocking=0
            prods.save()
                user.find({},function(err,alluser){

                   for (var i=0;i<alluser.length;i++){
                      
                     user.findById(alluser[i]._id,function(err,infos){ 
                      for(var j=0;j<prods.notify.length;j++){

                          if (infos.username==prods.notify[j].username){


                                      pop.create({id:prods._id,text:prods.Name,image:prods.image,urls:prods.urls,view:""},function(err,pups){
                                         infos.pops.push(pups)
                                         infos.save()
                                       
                                       })
                                      
                                   
                              break
                          }
                           {

                           }
                      }

                    
                 
                  })
                 }                    
                }) 

            for( var n=0;n<prods.notify.length;n++){


                    var transport=nodemailer.createTransport({
			                                  service:"gmail",
			                                  auth:{
				                               user:"grocery.ofc@gmail.com",
				                               pass:process.env.password
			                                  }
		                                       });	

			                             var mailoptions={
				                           from:"grocery.ofc@gmail.com",
				                           bcc:`${prods.notify[n].username}`,
				                           subject:"GroceryJi",
				                           html:`Hi,welcome to GroceryJi<br>
                                           Your requested  product ${prods.Name}, Price: ${prods.Price} is available
                                           in stock..
                                           <br>
                                           
				                            <br>
						                               
						
						
					                        <a href="https://grocery-ji.herokuapp.com/moreinfo/${prods._id}"<button style=color:green>Check Your product Details</button></a>						
						                                  
						                                  </form>`
						            } 
                              
                             
                                   
 
                                      
                              console.log("hmmmmm")
				               transport.sendMail(mailoptions,function(err,info){
									if(err)
									{
										req.flash("error","something went wrong...");

										res.redirect("/login");
									}
										else{
											console.log("here")

										}


			                    })


            }
}




         var i=0; 
         var p=0; 
		 prods.stocking=prods.stocking+orders.qty
		 prods.empty=false
		 prods.date=Date.now()

		 for ( i=0;i<orders.qty;i++){

              console.log("hitted")
		 	
		 	stocks.create({id:prods._id},function(err,sto){
		 		console.log(sto)
		 		prods.stock.push(sto)
		 		console.log(i)
		 	    if(p==orders.qty-1){
		 	     console.log("total stock after cancel")
			      console.log(prods.stock.length)	
		 	    	prods.save()
		 	    
		 	    }	
		 	    p=p+1

		 	})
		 
		 
		 }
          
            if(orders.pay=="Cash-On-Delivery"){

            	var status=""
            }
            else{

            	var status="Refundable"
            }

            var transport=nodemailer.createTransport({
			                                  service:"gmail",
			                                  auth:{
				                               user:"grocery.ofc@gmail.com",
				                               pass:process.env.password
			                                  }
		                                       });	

			                             var mailoptions={
				                           from:"grocery.ofc@gmail.com",
				                           bcc:`${req.user.username}`,
				                           subject:"GroceryJi",
				                           html:`Hi,${req.user.first},welcome to GroceryJi<br>
                                           Your Cancellation request ${prods.Name}, Price: ${prods.Price},Qty:${orders.qty} is successfully
                                           submitted..
                                           <br>
                                           Amount ${status}:${orders.Price}
				                            <br>
						                               
						
						
					                        <a href="https://grocery-ji.herokuapp.com/Orders/${orders._id}"<button style=color:green>Check Your Order</button></a>						
						                                  
						                                  </form>`
						            } 
                              
                             
                                   
 
                                      
                              console.log("hmmmmm")
				               transport.sendMail(mailoptions,function(err,info){
									if(err)
									{
										req.flash("error","something went wrong...");

										res.redirect("/login");
									}
										else{
											console.log("here")

										}


			                    })	  
                                
                                req.flash("success","Request submitted successfully")
                                res.redirect("/orders/"+orders._id)  

	})

})

})


app.get("/mydata",function(req,res){

   product.find({},function(err,data){
         
         var mains=JSON.stringify(data,null,2)
         fs.writeFile("./grocery.json",mains,finished)
         function finished(){

             fs.readFile("./grocery.json","utf-8",function(err,all){

             	var finallys=JSON.parse(all)
                res.send(finallys)   
             })         	
         }
   })
})



app.get("/data/:product",function(req,res){
	request(`https://www.flipkart.com/search?q=${req.params.product}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`,function(error,response,html){
	if(!error && response.statusCode==200)
	{
		const $=cheerio.load(html)
		// console.log(html)
		$("._4ddWXP").each(function(i,el){
			var datas=$(el)
			console.log(datas.find(".s1Q9rs").attr("title"))
			var val=datas.find("._30jeq3").text()
			var final=""
			var lets=""
			console.log(".........................................")
			// if(datas.find("._3Djpdu").text()){
			//  lets=datas.find("._3Djpdu").text()
			// }
			// else{

               
  	// 		}
			console.log(".........................................")
			for(var i=1;i<val.length;i++){
							final=final+val[i]

			}
			if (final==""){
				console.log("here")
                var final=Math.floor(Math.random()*123)

			    console.log(final)
			 }
			console.log(".............")
			console.log(Number(final))
			console.log(".............")
			console.log(datas.find("._396cs4").attr("src"))	
		    var vals=datas.find("._3I9_wc").text()
		    var finals=""
		    for (var i=1;i<vals.length;i++){

		    	finals=finals+vals[i]
		    }
		    if (Number(finals)==0){
 
                    console.log("here")

				    var finals=Math.floor(Math.random()*123)
			        console.log(finals)		    
			  }
		    console.log(final)
		    var info=""
		    info=datas.find("._3Ay6Sb").text()
		    if (info==""){
		       if (finals && final){
                 info=`${parseInt((Number(final)*100)/Number(finals))} % off`
		       }
		       else{

		       	 info="28 % off"
		       }
		    }
			// product.deleteOne({key:"buiscuits"},function(err,info){

			// })
			product.create({image:datas.find("._396cs4").attr("src"),Name:datas.find(".s1Q9rs").attr("title"),Price:Number(final),offer:Number(finals),off:info,key:`${req.params.product}s`,ratings:datas.find("._3LWZlK").text(),empty:false,stocking:5,date:Date.now(),urls:"URL",leters:""},function(err,products){
			if (products!==undefined){
 	
		      // coproduct.create({image:datas.find("._396cs4").attr("src"),Price:Number(final),offer:Number(finals),key:`${req.params.product}s`,ratings:datas.find("._3LWZlK").text(),pid:products._id},function(err,cos){
		                var p=0



		                  stocks.create({id:products._id},function(err,stoOne){
		                  stocks.create({id:products._id},function(err,stotwo){
		                  stocks.create({id:products._id},function(err,stothree){
		                  stocks.create({id:products._id},function(err,stofour){
		                  stocks.create({id:products._id},function(err,stofive){
                           
		                  
                           products.stock.push(stoOne)
                           products.stock.push(stotwo)
                           products.stock.push(stothree)
                           products.stock.push(stofour)
                           products.stock.push(stofive)
                         
                           


                           products.save()
                            
                           
		                  })	
		                  })
		                  })
		                  })
		                  })

                    
              console.log(products)
		// })	
          }  
		})	
		// 	if(datas.find(".FHCV02u6Cp2zYL0fhQPsO").text()!==""){


		// 	console.log("comments.....")

		// 	console.log(datas.find(".FHCV02u6Cp2zYL0fhQPsO").text())
		// }
		})
	 
   }
   res.send("Done")

})	
})

app.get("/updateData/:id/:subject",function(req,res){

	 product.findById(req.params.id,function(err,prods){

	 	 if(req.params.subject=="price"){


	 	  res.render("updatePrice.ejs",{prods:prods,data:"price"})
	  }
	  else if(req.params.subject=="name"){
           
            	 	  res.render("updatePrice.ejs",{prods:prods,data:"name"})


	  }
	 else if(req.params.subject=="offer"){

                      	 	  res.render("updatePrice.ejs",{prods:prods,data:"offer"})


	 }
 
     	
	 })
})

app.post("/updateData/:id/:data",function(req,res){

	 product.findById(req.params.id,function(err,prods){

          if(req.params.data=="price"){

           if(prods.offer>req.body.price){

              prods.updateOne({Price:req.body.price},function(err,info){
 
 
            	 var calc=parseInt((req.body.price*100)/prods.offer)
            	 prods.off=`${calc} % off`
            	 prods.save()
            	 req.flash("success","Updated")
           	     res.redirect("/groceryProduct")

             })
            
           
       
       }
	  else{

	  	req.flash("error","offerprice should be lower than actual price")
	  	res.redirect("back")
	  }    
	 
	 }
	 else if(req.params.data=="name"){
       
         prods.updateOne({Name:req.body.name},function(err,info){

           	 req.flash("success","Updated")
           	 res.redirect("/groceryProduct")

           })
      
      pop.find({id:prods._id},function(err,pups){

         for (var i=0;i<pups.length;i++){

             pop.findById(pups[i]._id,function(err,pup){

                 pup.updateOne({text:req.body.name},function(err,info){


                 })
             })
         }
      })  
	 
     }
	 else if(req.params.data=="offer"){

	 	 if(prods.Price<req.body.offer){
	 	  prods.updateOne({offer:req.body.offer},function(err,info){

                 var calc=parseInt((prods.Price*100)/req.body.offer)
            	 prods.off=`${calc} % off`
            	 prods.save()
           	 req.flash("success","Updated")
           	 res.redirect("/groceryProduct")

           })
	 
	 }
   else{

   	 req.flash("error","Product's actual price should be greater than the product's offer price")
   	 res.redirect("back")
   }
   }
})

})
app.get("/increaseStock/:id/:stock",function(req,res){

	product.findById(req.params.id).populate("stock").populate("notify").exec(function(err,prods){

       if (prods.stock.length==0){  
       	 prods.stocking=0
       	 prods.save()
        
      user.find({},function(err,users){  
      
      for(var i=0;i<users.length;i++)
       user.findById(users[i]._id,function(err,found){
        for(var j=0;j<prods.notify.length;j++){
           
           if (found.username==prods.notify[j].username){



                 pop.create({id:prods._id,text:prods.Name,image:prods.image,urls:prods.urls,view:""},function(err,pup){

                     found.pops.push(pup)
                     found.save()

                 })
              
               break
           }                   
               

     }
   })
  })
         for(var i=0;i<prods.notify.length;i++){

         	  var transport=nodemailer.createTransport({
			service:"gmail",
			auth:{
				user:"grocery.ofc@gmail.com",
				pass:process.env.password
			}
		});	


			var mailoptions={
				from:"grocery.ofc@gmail.com",
				bcc:`${prods.notify[i].username}`,
				subject:"GroceryJi",
				html:`Hi,welcome to GroceryJi<br>
                                           Your requested  product ${prods.Name}, Price: ${prods.Price} is now available
                                           in stock..
                                           <br>
                                           
				                            <br>
						                               
						
						
					                        <a href="https://grocery-ji.herokuapp.com/moreinfo/${prods._id}"<button style=color:green>Check Your product Details</button></a>						
						                                  
						                                  </form>`
			}
                console.log("hmmmmm")
				transport.sendMail(mailoptions,function(err,info){
					if(err)
					{
						console.log("error")
					}
						else{
							console.log("here")

						}


				

  })
 }  
}



         var p=0
		 prods.stocking=prods.stocking+Number(req.params.stock)
		 prods.empty=false
		 prods.date=Date.now()
		 for (var i=0;i<Number(req.params.stock);i++){

		 	  stocks.create({id:prods._id},function(err,sto){
                  prods.stock.push(sto) 
                  if(p==Number(req.params.stock)-1){

                  	  prods.save()
                  }
                  p=p+1
		 	  })
		 }
	     
         
			 

            

	})
 
     
     req.flash("success","Stock Is Increased")
     res.redirect("back")

})


app.get("/addProduct",function(req,res){

	res.render("addProduct.ejs")
})

app.get("/deleteProduct/:id",function(req,res){

   wishlist.find({pid:req.params.id},function(err,wish){

     for (var i=0;i<wish.length;i++){

     	wishlist.deleteOne({pid:wish[i].pid},function(err,info){
           

     	})
     }

   })

    

   pop.find({id:req.params.id},function(err,pups){

      for (var i=0;i<pups.length;i++){


             pop.findByIdAndDelete(pups[i]._id,function(err,info){


             })
         
      }
   })


   user.find({},function(err,users){

   	 for (var i=0;i<users.length;i++){

   	 	 user.findById(users[i]._id).populate("cart").exec(function(err,alluser){

   	 	  if(alluser.cart.length>0){	
   	 	 	 for (var p=0;p<alluser.cart.length;p++){

   	 	 		 if (alluser.cart[p].pid==req.params.id){
                        
                      alluser.sum=alluser.sum-alluser.cart[p].Price
                      alluser.save()
   	 	 		 
   	 	 	          break
   	 	 	}
   	 	 	}
   	 	 }
   	 	 
   	 	 
   	 	 })
   	 }
   })
   
   carts.find({pid:req.params.id},function(err,car){

     for (var i=0;i<car.length;i++){

     	carts.deleteOne({pid:car[i].pid},function(err,info){

     		
     	})
     }

   })

   product.findByIdAndDelete(req.params.id,function(err,infos){

   	 req.flash("success","Product is deleted")
     res.redirect("back")
   })

})
app.post("/addProduct",function(req,res){
 
 if(parseInt(req.body.actual)>parseInt(req.body.offer)){  


   if (req.files){

  	 var file=req.files.filename,
  	 filesname=file.name;
  	 file.mv("./public/"+filesname)

  }
 
  
   if (req.body.image){

  	 var filesname=req.body.image
  }
   
   var calc=parseInt((req.body.offer*100)/req.body.actual) 
   var total=`${calc} % off`
   
   product.create({Name:req.body.name,Price:parseInt(req.body.offer),offer:parseInt(req.body.actual),off:total,image:filesname,stocking:req.body.stock,empty:false,date:Date.now(),key:req.body.keys,urls:req.body.urls},function(err,prod){
        var p=0
        for (var i=0;i<parseInt(req.body.stock);i++){

        	 console.log(i)
        	 stocks.create({id:prod._id},function(err,stoc){

        	 	prod.stock.push(stoc)
        	    console.log(prod)
        	  p=p+1
              if(p==parseInt(req.body.stock)){
                console.log(p)
             	prod.save()
              }
        })
            
        }
   
    user.find({},function(err,users){

      var p=0
       for (var i=0;i<users.length;i++){
      

        user.findById(users[i]._id,function(err,us){
          pop.create({id:prod._id,image:prod.image,urls:prod.urls,text:prod.Name,view:""},function(err,pup){
            if(!us.notinum){
                 us.notinum=0
            } 
            us.pops.push(pup)
            us.notinum=us.notinum+1
               
            us.save()  
              
          
             

          }) 
        })   
         var transport=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"grocery.ofc@gmail.com",
                pass:process.env.password
            }
        }); 


            var mailoptions={
                from:"grocery.ofc@gmail.com",
                bcc:`${users[i].username}`,
                subject:"GroceryJi",
                html:`<div align=center><b>Hi,${users[i].first}</b><br><b>${prod.Name} New Product Added<br></b>
                        <a href=https://grocery-ji.herokuapp.com/moreinfo/${prod._id}><b>Check It Out</b></b></a></div>
                        
                        
                       
                        `
            }
                console.log("hmmmmm")
                transport.sendMail(mailoptions,function(err,info){
                    if(err)
                    {
                        res.redirect("/moreinfo/"+prod._id)
                    }
                        else{
                            console.log("here")

                        }


                

})


       }

    
    })  
  
   })

   req.flash("success","product added successfully")
   res.redirect("/groceryProduct")
}
else{

	console.log("here")
	req.flash("error","Actual price of product should be greater than offer price of product")
	res.redirect("back")
}
})


app.get("/groceryProduct",function(req,res){
   if(!req.query.search){


	 product.find({},function(err,prods){
	 	 
	 	  res.render("allproducts.ejs",{prods:prods})
	 })
}

else{

	var search=req.query.search
		 product.find({},function(err,prods){
        var C=[]
        
        for (var i=0;i<prods.length;i++){

        	 for (var p=0;p<search.length;p++){

        	 	 k=p
        	 	 var flag=true
        	 	 for (var j=0;j<prods[i].key.length-1;j++){

        	 	 	  if(prods[i].key[j]!==search[k]){

        	 	 	  	  flag=false
        	 	 	  	  break
        	 	 	  }
        	 	     k++
        	 	 }
        	   
        	     if (flag==true){
                    
                     product.find({key:{$regex:prods[i].key,$options:"$i"}},function(err,prods){
	 	 
	 	               res.render("allproducts.ejs",{prods:prods})
	         })
                 
                  C.push(0)
                  prods=[]
                  break
        	     
        	     }
        	 }
        }
  
     if(C.length==0){

         res.render("allproducts.ejs",{prods:0})


     }

})
}
})

app.get("/outof",function(req,res){

	 product.find({empty:true},function(err,prods){
	 	  
	 	if(prods.length>0){


	 	  res.render("out.ejs",{prods:prods})
	 }
	 else{

	 	  	res.render("noout.ejs")

	 }
	 })
})
app.post("/registering",function(req,res){
 user.findOne({username:req.body.username},function(err,user){
  console.log(user)
  if (user!==null){
    req.flash("error","User already exists")
    res.redirect("back")	
  }
  else{
    console.log("here")
    var code=Math.floor(Math.random()*11223)
    var transport=nodemailer.createTransport({
			service:"gmail",
			auth:{
				user:"grocery.ofc@gmail.com",
				pass:process.env.password
			}
		});	


			var mailoptions={
				from:"grocery.ofc@gmail.com",
				bcc:`${req.body.username}`,
				subject:"GroceryJi",
				html:`Hi,${req.body.first},welcome to GroceryJi<br>please activate your account<br>
						Your activation code is <b>${code}</b>
						
						
						</form>
						`
			}
                console.log("hmmmmm")
				transport.sendMail(mailoptions,function(err,info){
					if(err)
					{
						req.flash("error","something went wrong...");

						res.redirect("/login");
					}
						else{
							console.log("here")
						    res.render("active.ejs",{first:req.body.first,username:req.body.username,last:req.body.last,password:req.body.password,number:code})

						}


				

})

}
})
})

app.get("/forgot",function(req,res){
	res.render("forget.ejs")
})

app.post("/forgot",function(req,res){
user.findOne({username:req.body.username},function(err,user){
  if (user){	
	var transport=nodemailer.createTransport({
		service:"gmail",
		auth:{
			user:"grocery.ofc@gmail.com",
			pass:process.env.password
		}
	})
 
    var mailoptions={
				from:"grocery.ofc@gmail.com",
				bcc:`${req.body.username}`,
				subject:"GroceryJi",
				html:`Hi,${user.first},welcome to GroceryJi<br>Reset Your Password<br>
						<a href="https://grocery-ji.herokuapp.com/set/${user._id}">Change Password</a>
						
						
						</form>
						`
			} 

 
             transport.sendMail(mailoptions,function(err,info){
  	              if(err){
                     req.flash("error","cant send the mail")
  		             res.redirect("back")
  	            }
                else{

    	             req.flash("success","mail sent")
    	             res.redirect("back")
                 }
  })
}
else{
	req.flash("error","No user found")
	res.redirect("back")
}
})
})
app.get("/set/:id",function(req,res){

	user.findById(req.params.id,function(err,user){
		res.render("set.ejs",{user:user})
	})
})
app.post("/setPassword",function(req,res){
	user.findOne({username:req.body.username},function(err,user){
 
        if (req.body.password==req.body.confirm){

		user.setPassword(req.body.password,function(err,user){
			user.save()
			req.flash("success","Password changed")
			res.redirect("/")
		})
	
	}
    else{
        req.flash("error","Password not matched") 
    	res.redirect("back")
    }

	
 
	})
})
app.post("/registered",function(req,res){
			// if(req.files)
			// {
			// 	var file=req.files.filename,
			// 		filesname=file.name;
			// 		file.mv("./public/"+filesname);
			// }
			if(req.body.two)
			{
			if(req.body.one!==req.body.two)
			{
				 req.flash("error","Your code was wrong,it's destroyed,try again...")
				 res.redirect("/login")
			}
			
			
			
			else{
			user.register(new user({first:req.body.first,last:req.body.last,name:req.body.first + " " + req.body.last,username:req.body.username,offerHold:false}),req.body.password,function(err,user){
					
		if(err)
		{
			
				console.log(err);
			return res.redirect("/login");	
		}
	
			
			
			passport.authenticate("local")(req,res,function(){
				

				req.flash("success","successfully Registered...");
				res.redirect("/");
			});
		

});	
}
}
else{
		req.flash("error","Please give the code as input...")
		res.redirect("back")

}
});

app.get("/logout",function(req,res){

	req.logout()
   req.flash("success","We Have Logged You Out!")
   res.redirect("/login")

})

app.post("/login",passport.authenticate("local",{
successRedirect:"/", 
failureRedirect:"/login"
}),function(req,res){

});

app.get("/admin",function(req,res){
 
 var totalSum=0
 if(!req.query.search){

  order.find({},function(err,orders){
   if (orders.length>0){

  	 for (var i=0;i<orders.length;i++){

  	 	if (orders[i].returnId==""){

  	 		 totalSum=totalSum+orders[i].Price
  	 	}
  	 } 

  	 res.render("adminOrders.ejs",{orders:orders,totalSum:totalSum,search:""})
   }
   else{

   	    	 res.render("noOrders.ejs")

   }
  })
}
else{

	var key=req.query.search
    var find=[]
    order.find({},function(err,orders){

       
       for (var i=0;i<orders.length;i++){


           for (var j=0;j<orders[i].name.length;j++){

              var k=j
              var flag=true
              for (var p=0;p<key.length;p++){

                  if(orders[i].name[k].toLowerCase()!==key[p].toLowerCase()){

                      flag=false
                      break

                  
                    
              

                  }
                  k=k+1 

              
              }
            
              if (flag==true){
                 find.push(0)

                 order.find({name:{$regex:orders[i].name,$options:"$i"}},function(err,orderf){

                      var totals=0
                      for (var x=0;x<orderf.length;x++){

                         if(orderf[x].returnId==""){

                             totals=totals+orderf[x].Price

                         }
                      }
                   

                           res.render("adminOrders.ejs",{orders:orderf,totalSum:totals,search:key})



                 })
                 
                 var orders=[]
                 break
               }

           }
       }

       if(find.length==0){

                res.render("nocustomer.ejs")

       }
    
    })    

 
}

})

app.get("/statusChange/:id/:key",function(req,res){

   order.findById(req.params.id,function(err,orders){
    if (req.params.key=="Shipped"){
      orders.updateOne({shipped:req.params.key,datetwo:Date.now()},function(err,info){


      })
    } 
    else if (req.params.key=="Out-For-Delivery"){
    	orders.updateOne({outfor:req.params.key,datethree:Date.now()},function(err,info){


      })
    } 
 

    else if (req.params.key=="Canceled"){
        console.log("yaaaaaa")
    	orders.updateOne({update:req.params.key,datefour:Date.now(),autoCancel:true,returnId:orders._id},function(err,info){

              product.findById(orders.pid).populate("stock").populate("notify").exec(function(err,prods){
                var p=0
                
     if (prods.stock.length==0){
              prods.stocking=0 
              prods.save()
                user.find({},function(err,alluser){

               for (var i=0;i<alluser.length;i++){
                  
                     user.findById(alluser[i]._id,function(err,infos){ 
                      for(var j=0;j<prods.notify.length;j++){

                          if (infos.username==prods.notify[j].username){


                                      pop.create({id:prods._id,text:prods.Name,image:prods.image,urls:prods.urls,view:""},function(err,pups){
                                         infos.pops.push(pups)
                                         infos.save()
                                       
                                       })
                                      
                                   
                               break
                          }
                           {

                           }
                      }

                    
                 
                  })
                 }                    
                })  


              for(var i=0;i<prods.notify.length;i++){

                      var transport=nodemailer.createTransport({
			           service:"gmail",
		           	  auth:{
				         user:"grocery.ofc@gmail.com",
				         pass:process.env.password
		         	}
		      
               
             });	


			var mailoptions={
				from:"grocery.ofc@gmail.com",
				bcc:`${prods.notify[i].username}`,
				subject:"GroceryJi",
				html:`Hi,welcome to GroceryJi<br>
                                           Your requested  product ${prods.Name}, Price: ${prods.Price} is now available
                                           in stock..
                                           <br>
                                           
				                            <br>
						                               
						
						
					                        <a href="https://grocery-ji.herokuapp.com/moreinfo/${prods._id}"<button style=color:green>Check Your product Details</button></a>						
						                                  
						                                  </form>`
			}
                console.log("hmmmmm")
				transport.sendMail(mailoptions,function(err,info){
					if(err)
					{
						console.log("error")

					}
						else{
							console.log("here")

						}


				

  })

                }   

             } 

                prods.stocking=prods.stocking+orders.qty
                prods.empty=false
                prods.date=Date.now()
                for(var i=0;i<orders.qty;i++){
              	   
              	   stocks.create({id:orders.pid},function(err,sto){
                     
              	      prods.stock.push(sto)
              	      if(p==orders.qty-1){

              	      	 prods.save()
              	      }
              	     p=p+1
              	   })
                }
                 
              })
                    if(orders.pay=="Paid"){

                    	var amount="Give Us Account Details, so that we can give back you the paid money" +" "+ orders.Price
                    }
                   
                     var transport=nodemailer.createTransport({
			                                  service:"gmail",
			                                  auth:{
				                               user:"grocery.ofc@gmail.com",
				                               pass:process.env.password
			                                  }
		                                       });	


			                             var mailoptions={
				                           from:"grocery.ofc@gmail.com",
				                           bcc:`${orders.author.username}`,
				                           subject:"GroceryJi",
				                           html:`Hi,we have canceled your order for ${orders.productD}<br>
                                           Price:${orders.Price},
                                           <br>
                                           Quantity:${orders.qty} 
                                            for some issues
                                           <br>
                                           ${amount} 
				                            <br>
						                    Thank You 
						                    <br>
						                    From GroceryJi           
						
						
					                       
						                                     `
		 	               } 
                              console.log("hmmmmm")
				               transport.sendMail(mailoptions,function(err,info){
									if(err)
									{
										req.flash("error","something went wrong...");

									}
										else{
											console.log("here")

										}


			                    }) 

      })
    } 
     else if (req.params.key=="Delivered"){
    	orders.updateOne({update:req.params.key,datefour:Date.now()},function(err,info){


      })

    } 
   
    req.flash("success","Order Is Updated")
    res.redirect("back")

   })

})

app.get("/allcancelOrders/:key",function(req,res){

	 order.find({update:req.params.key},function(err,orders){
      
      if (orders.length>0){

	 	 res.render("cancels.ejs",{orders:orders,key:req.params.key})
      }
	  else{
	  		 	 res.render("noOrders.ejs")

	  } 
	 })
})





function isLoggedin(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}

		
		req.flash("error","Do log in first...");

		res.redirect("/login");
	
}

app.listen(port,function(){

	console.log("server 4 has started")
})
