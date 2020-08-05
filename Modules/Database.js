

    var mysql = require('mysql');

    var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "STMS"
    
    });
const connection = ()=>
{
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

     })   
        

};


    var con1 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234"
    
    
    });
const connection_creation =()=>
{
    con1.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

     })   
        

};


const Create_STMS_DataBase=() =>
{
    connection_creation();
     con1.query("CREATE DATABASE STMS", function (err, result) {
       if (err) console.log("Database createtion failed");
       console.log("Database created");
     });


};
 const Create_STMS_tables=()=>
 {
     connection();
     var sql = "CREATE TABLE traffic (traffic_ID int primary key not null , street_ID int ,squere_ID int, number_of_vehicles int)";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");

      });
    var sql = "CREATE TABLE squere (squere_ID int primary key not null  ,  n_vehicle_S1 int ,  n_vehicle_S2 int ,  n_vehicle_S3 int ,  n_vehicle_S4 int, foreign key (squere_ID) references traffic(traffic_ID) )";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");

      });
    var sql = "CREATE TABLE vehicle (vehicle_ID int primary key not null  ,vehicle_State boolean ,  traffic_ID int ,Alaem boolean, foreign key (traffic_ID) references traffic(traffic_ID) )";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");

      });

    var sql = "CREATE TABLE Account (vehicle_ID int primary key not null  ,Owner_ID int  not null,Owner_name varchar(15) not null ,Password varchar(15) not null, phone_Number int not null,If_Stolen boolean , Last_Seen int ,foreign key (vehicle_ID) references vehicle(vehicle_ID) )";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");

      });

 };

 
 module.exports.connection=connection;
 module.exports.Create_STMS_DataBase=Create_STMS_DataBase;
 module.exports.Create_STMS_tables=Create_STMS_tables;



 