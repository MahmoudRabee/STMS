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

   var sql = "CREATE TABLE Account (vehicle_ID int primary key not null  ,Owner_ID varchar(14)  not null,Owner_name varchar(50) not null ,Password varchar(255) not null, phone_Number varchar(11) not null,Email varchar(50) not null,If_Stolen boolean default false , Last_Seen int  ,violation_cost int default 0)";
     con.query(sql, function (err, result) {
       if (err) throw err;
       console.log("Account Table created");

     });

     var sql = "CREATE TABLE Violation_Type (violation_types varchar(50) not null primary key,violation_cost int not null)";
     con.query(sql, function (err, result) {
       if (err) throw err;
       console.log("violation_type created");

     });
     var sql = "CREATE TABLE Violations (violation_ID int AUTO_INCREMENT  not null primary key , violation_types varchar(50) not null ,violation_cost int not null,violation_time datetime,vehicle_ID int not null,Have_accouunt boolean , foreign key (violation_types) references Violation_Type(violation_types))";
     con.query(sql, function (err, result) {
       if (err) throw err;
       console.log("violations created");

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
          if (rows.length>0) resolve(1);
          else resolve (0);
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
    console.log("errors: "+ errors);

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


function return_stolen_vehicles()
{

  return new Promise(function(resolve, reject) {
    var sql ="SELECT  vehicle_ID FROM Account WHERE If_Stolen = true";
    con.query(sql, function (err, rows) {
      if (err) throw err;
      else 
        resolve(rows);
      
    });  
  }); 

}
async function execute_return_stolen_vehicles()
{
  let data=await return_stolen_vehicles();
 
  let i;
  for(i=0;i<data.length;i++)
  {
    console.log(data[i].vehicle_ID);

  }
}


function  insert_violation_types(v_type,v_cost)
{

  return new Promise(function(resolve, reject) {
    var sql = "INSERT INTO Violation_Type (violation_types,violation_cost) VALUES ('"+v_type+"',"+v_cost+" )";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        resolve("done!");
    });
  });

}



 async function insert_new_violation(v_type,v_time,vehicle_num)
{
  let cost;
  let new_const;
  let exist =await Is_plate_Exist(vehicle_num);
  if( await Is_violation_type_Exist(v_type))
  {
    cost =await select_violation_cost(v_type);
    let account =await Is_plate_Exist(vehicle_num);
    
    return new Promise(async function(resolve, reject) {
      var sql = "INSERT INTO violations ( violation_types,violation_cost,violation_time,vehicle_ID,Have_accouunt) VALUES ('"+v_type+"',"+cost+",'"+v_time+"','"+vehicle_num+"','"+account+"' )";
      con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });  
        if(exist)
        {
            new_cost = await select_violation_bill(vehicle_num);
            new_cost+=cost;
          
            sql ="UPDATE Account SET violation_cost ="+new_cost +" WHERE vehicle_ID ="+vehicle_num;
            con.query(sql, function (err, rows) {
            if (err) throw err;
            else 
              resolve('done!');
            });
        }
    });
  }
  else
  {
    return ("this violation type doesn't exist");
  }

}

function select_violation_bill(vehicle_num)
{
  return new Promise(function(resolve, reject) {
    var sql ="SELECT violation_cost FROM Account WHERE vehicle_ID ="+vehicle_num;
    con.query(sql, function (err, rows) {
        if (err) throw err;
        else resolve (rows[0].violation_cost);
    });  
  });

}

function Is_violation_type_Exist(v_type) {
  return new Promise(function(resolve, reject) {
      var sql ="SELECT violation_types FROM Violation_Type WHERE violation_types ='"+v_type+"'";
      con.query(sql, function (err, rows) {
          if (err) throw err;
          if (rows.length>0) resolve(true);
          else resolve (false);
      });  
    });
}

function select_violation_cost(v_type) {
  return new Promise(function(resolve, reject) {
      var sql ="SELECT violation_cost FROM Violation_Type WHERE violation_types ='"+v_type+"'";
      con.query(sql, function (err, rows) {
          if (err) throw err;
         
           resolve (rows[0].violation_cost);
      });  
    });
}

function select_violation_details(vehicle_num)
{

  return new Promise(function(resolve, reject) {
    var sql ="SELECT  violation_ID , violation_types, violation_cost,violation_time FROM violations WHERE vehicle_ID ="+vehicle_num;
    con.query(sql, function (err, rows) {
        if (err) throw err;
       
         resolve (rows);
    });  
  });

}

function delete_Specefic_violation(vio_ID,vehicle_num)
{

    var sql ="DELETE FROM violations WHERE  violation_ID ="+vio_ID;
    con.query(sql, function (err, rows) {
        if (err) throw err;
    });



}

function pay_violation_bill(vehicle_num)
{

  return new Promise(function(resolve, reject) {
    var sql ="DELETE FROM violations WHERE  vehicle_ID ="+vehicle_num;
    con.query(sql, function (err, rows) {
        if (err) throw err;
    });
    sql ="UPDATE Account SET violation_cost ="+0 +" WHERE vehicle_ID ="+vehicle_num;
      con.query(sql, function (err, rows) {
        if (err) throw err;
        else 
          resolve('done!');
      });

  });

}




module.exports.insert_violation_types = insert_violation_types;
module.exports.insert_new_violation = insert_new_violation;
module.exports.select_violation_bill = select_violation_bill;
module.exports.Is_violation_type_Exist = Is_violation_type_Exist;
module.exports.select_violation_cost = select_violation_cost;
module.exports.select_violation_details = select_violation_details;
module.exports.pay_violation_bill = pay_violation_bill;
module.exports.delete_Specefic_violation = delete_Specefic_violation;


module.exports.execute_return_stolen_vehicles=execute_return_stolen_vehicles;
module.exports.return_stolen_vehicles=return_stolen_vehicles;

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