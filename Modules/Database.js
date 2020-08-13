var mysql = require('mysql');
const { Module } = require('module');
const { assert } = require('console');

// Create connection configuration I
var con = mysql.createConnection({
host: "localhost",
user: "root",
password: "1234",
database: "STMS"
});

// Connect I
const connection = ()=>{  
        con.connect (function(err) {
              if (err) throw err;
              console.log("Connected!");
          });      
};

// Create connection configuration II
var con1 = mysql.createConnection({
host: "localhost",
user: "root",
password: "1234"
});

// Connect II
const connection_creation = () =>{
    con1.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
     });
};

// Create Database
function Create_STMS_DataBase()
{
    return new Promise(function(resolve, reject) {
        connection_creation();
        con1.query("CREATE DATABASE STMS", function (err, result) {
          if (err){
            console.log("Database createtion failed");
            resolve(result);
            } else {
              console.log("Database created");
              resolve(result);
            }
        });
    });
}

// cCreate Tables
const Create_STMS_tables=()=>
{
    connection();
    var sql = "CREATE TABLE traffic (traffic_ID int primary key not null , street_ID int ,squere_ID int, number_of_vehicles int)";
     con.query(sql, function (err, result) {
       if (err) throw err;
       console.log(" Traffic Table created");

     });
   var sql = "CREATE TABLE squere (squere_ID int primary key not null  ,  n_vehicle_S1 int ,  n_vehicle_S2 int ,  n_vehicle_S3 int ,  n_vehicle_S4 int, foreign key (squere_ID) references traffic(traffic_ID) )";
     con.query(sql, function (err, result) {
       if (err) throw err;
       console.log("Squere Table created");

     });
   var sql = "CREATE TABLE vehicle (vehicle_ID int primary key not null  ,vehicle_State boolean ,  traffic_ID int ,Alaem boolean, foreign key (traffic_ID) references traffic(traffic_ID) )";
     con.query(sql, function (err, result) {
       if (err) throw err;
       console.log("Vehicle Table created");

     });

   var sql = "CREATE TABLE Account (vehicle_ID int primary key not null  ,Owner_ID varchar(14)  not null,Owner_name varchar(50) not null ,Password varchar(255) not null, phone_Number varchar(11) not null,Email varchar(50) not null,If_Stolen boolean default false , Last_Seen int  )";
     con.query(sql, function (err, result) {
       if (err) throw err;
       console.log("Account Table created");

     });




};
/*******************************************/
 function Is_Email_Exist(Email) {
    return new Promise(function(resolve, reject) 
    {
      var sql ="SELECT Email FROM Account WHERE Email='"+Email+"'";
      con.query(sql, function (err, rows) {
        if (err) throw err;
        if (rows.length>0) resolve(true);
        else resolve (false);
      });  
    });  
  };

/************************************/
 function Is_Phone_Exist(phone) 
 {
    return new Promise(function(resolve, reject) {
      var sql ="SELECT phone_Number FROM Account WHERE phone_Number ='"+phone+"'";
      con.query(sql, function (err, rows) {
        if (err) throw err;
        if (rows.length>0) resolve(true);
        else resolve (false);
      });
  });
}; 

/********************************/
function Is_plate_Exist(ID) {
  return new Promise(function(resolve, reject) {
      var sql ="SELECT vehicle_ID FROM Account WHERE vehicle_ID ="+ID;
      con.query(sql, function (err, rows) {
          if (err) throw err;
          if (rows.length>0) resolve(true);
          else resolve (false);
      });  
    });
};

/******************************* */
function Is_Owner_ID_Exist(ID_owner) 
{
    return new Promise(function(resolve, reject) {
        var sql ="SELECT Owner_ID FROM Account WHERE Owner_ID ="+ID_owner;
        con.query(sql, function (err, rows) {
            if (err) throw err;
            let c
            if (rows.length > 0) c = true;
            else c = false;
            resolve(c);
        });  
    });  
};

/********************************/
function Insert_New_Account (ownerID, name, Email, phone, password, ID)
{
  connection();
  return new Promise(function(resolve, reject) {
      var sql = "INSERT INTO Account (vehicle_ID,owner_ID,owner_name,password,phone_Number,Email) VALUES ("+ID+",'"+ownerID+"' ,'"+name+"','"+password+"','"+phone+"','"+Email+"')";
      con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
          resolve("done!");
      });
  });
};

/****************************/
async function new_User (ownerID, Email, phone, ID)
{
    let errors = [];
    let OID=await Is_Owner_ID_Exist(ownerID);
    if(OID == true) errors.push("This ID number Is already exist!");
    let plate= await Is_plate_Exist(ID);
    if (plate==true) errors.push("This plate is already exist !");
    let phn=await Is_Phone_Exist(phone);
    if (phn==true) errors.push("This phone number is already exist !");
    let mail=await Is_Email_Exist(Email);
    if(mail==true) errors.push("This Email is already exist !");

    return errors;
};


async function Excute_new_user(ownerID,name,Email,phone,password,ID)
{
  console.log(await new_User(ownerID,name,Email,phone,password,ID));
}
/*************************** */
function Password_Of_Login(mail) {
  // connection();
  return new Promise(function(resolve, reject) {
    var sql ="SELECT Password FROM Account WHERE Email ='"+mail+"'";
    con.query(sql, function (err, rows) {
      if (err) throw err;
      else 
        console.log('row   '+ rows[0].password)
        resolve(rows[0].Password);
    });  
  });  

}

async function Excute_Pass_of_Login(mail)
{

    console.log(await Password_Of_Login(mail));
}

async function createDataBaseAndTables() {
  const test2 = await Create_STMS_DataBase();
  const test = await Create_STMS_tables();
}

/***************************************** */

function User_Information (vehicle_number)
{

  return new Promise(function(resolve, reject) {
    var sql ="SELECT vehicle_ID,owner_name,phone_Number,Email FROM Account WHERE vehicle_ID ="+vehicle_number;
    con.query(sql, function (err, rows) {
      if (err) throw err;
      else 
        
        resolve(rows[0]);
    });  
  });  

}
async function Excute_User_Information(vehicle_number)
{
  let information= await User_Information(vehicle_number);
  console.log(information.vehicle_ID);
  console.log(information.owner_name);
  console.log(information.phone_Number);
  console.log(information.Email);
}
/********************************** */

function report_Stolen_vehicle(vehicle_num)
{
  //connection();
  return new Promise(function(resolve, reject) {
    var sql ="UPDATE Account SET If_Stolen =true where vehicle_ID="+vehicle_num;
    con.query(sql, function (err, rows) {
      if (err) throw err;
      else 
        resolve('report of stolen car is done!');
    });  
  });

}

function report_Stolen_vehicle_founded(vehicle_num)
{
  //connection();
  return new Promise(function(resolve, reject) {
    var sql ="UPDATE Account SET If_Stolen =false where vehicle_ID="+vehicle_num;
    con.query(sql, function (err, rows) {
      if (err) throw err;
      else 
        resolve('report of found car is done!');
    });  
  });

}

function Is_this_vehicle_stolen(vehicle_num)
{
  return new Promise(function(resolve, reject) {
    var sql ="SELECT If_Stolen FROM Account WHERE vehicle_ID ="+vehicle_num;
    con.query(sql, function (err, rows) {
      if (err) throw err;
      else 
        
        resolve(rows[0].If_Stolen);
    });  
  });

}

function Stolen_vehicle_default()
{
 // connection();
  return new Promise(function(resolve, reject) {
    var sql ="UPDATE Account SET If_Stolen =false ";
    con.query(sql, function (err, rows) {
      if (err) throw err;
      else 
        resolve('done!');
    });  
  });

}
async function execute_Stolen_vehicle_dafault()
{
  console.log(await Stolen_vehicle_default());
}


async function execute_report_Stolen_vehicle(vehicle_num)
{
  console.log(await report_Stolen_vehicle(vehicle_num) );

}

async function execute_report_Stolen_vehicle_founded(vehicle_num)
{
  console.log(await report_Stolen_vehicle_founded(vehicle_num) );

}

async function execute_Is_this_vehicle_stolen(vehicle_num)
{
  console.log(await Is_this_vehicle_stolen(vehicle_num) );

}

/**************************************** */


function return_vehicle_number(mail)
{
  
    // connection();
    return new Promise(function(resolve, reject) {
      var sql ="SELECT vehicle_ID FROM Account WHERE Email ='"+mail+"'";
      con.query(sql, function (err, rows) {
        if (err) throw err;
        else 
          resolve(rows[0].vehicle_ID);
      });  
    });  
  
  

}

async function Execute_return_vehicle_num(mail)
{
 console.log( await return_vehicle_number(mail));
}


module.exports.Execute_return_vehicle_num=Execute_return_vehicle_num;
module.exports.return_vehicle_number=return_vehicle_number;

module.exports.execute_Stolen_vehicle_dafault=execute_Stolen_vehicle_dafault;
module.exports.execute_Is_this_vehicle_stolen=execute_Is_this_vehicle_stolen;
module.exports.execute_report_Stolen_vehicle_founded=execute_report_Stolen_vehicle_founded;
module.exports.execute_report_Stolen_vehicle=execute_report_Stolen_vehicle
module.exports.report_Stolen_vehicle=report_Stolen_vehicle;
module.exports.report_Stolen_vehicle_founded=report_Stolen_vehicle_founded;
module.exports.Is_this_vehicle_stolen=Is_this_vehicle_stolen;
module.exports.Stolen_vehicle_default=Stolen_vehicle_default;






module.exports.Excute_User_Information=Excute_User_Information;
module.exports.User_Information=User_Information;


module.exports.excute_Pass_of_Login=Excute_Pass_of_Login;
module.exports.Password_Of_Login=Password_Of_Login;
module.exports.Excute_new_user=Excute_new_user;

module.exports.new_User=new_User;
module.exports.Is_Owner_ID_Exist=Is_Owner_ID_Exist;
module.exports.Is_Email_Exist=Is_Email_Exist;
module.exports.Is_plate_Exist=Is_plate_Exist;
module.exports.Is_Phone_Exist=Is_Phone_Exist;
 module.exports.connection=connection;
 module.exports.Create_STMS_DataBase=Create_STMS_DataBase;
 module.exports.Create_STMS_tables=Create_STMS_tables;
 module.exports.createDataBaseAndTables=createDataBaseAndTables;
 module.exports.Insert_New_Account=Insert_New_Account;
 //module.exports.connection_creation=connection_creation;