const DB = require('../Modules/Database');

const breakSignal = "breake traffic signal";
const opisitDirection = "Drive in opisite direction";
const speedLimit = "Speed exceeded the limit";

async function addViolation(type, carID) {
    let date = new Date();
    let date1 = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
    ('00' + date.getUTCHours()).slice(-2) + ':' + 
    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + date.getUTCSeconds()).slice(-2);
    const result = await DB.insert_new_violation(type,date1,carID);
    console.log(result);
}

async function retriveVolationDetails(carID) {
    const details = await DB.select_violation_details(carID);
    console.log(details);
    return details;
}

async function deleteSingleViolation(code, carID) {
    const result = await DB.delete_Specefic_violation(code, carID);
}

async function deleteViolations(carID) {
    const result = await DB.pay_violation_bill(carID);
}

async function addRandomViolations() {
    const cars = await DB.getAllCars();
    // add breakSignal violation to all cars 
    for(let i = 0; i < cars.length; i++){
        addViolation(breakSignal, cars[i].vehicle_ID);
    }

    // add opisitDirection violation to odd cars 
    for(let i = 1; i < cars.length; i+=2){
        addViolation(opisitDirection, cars[i].vehicle_ID);
    }

    // add speedLimit violation to evan cars 
    for(let i = 0; i < cars.length; i+=2){
        addViolation(speedLimit, cars[i].vehicle_ID);
    }

}

module.exports.breakSignal=breakSignal;
module.exports.opisitDirection=opisitDirection;
module.exports.speedLimit=speedLimit;
module.exports.addViolation=addViolation;
module.exports.retriveVolationDetails=retriveVolationDetails;
module.exports.deleteSingleViolation=deleteSingleViolation;
module.exports.deleteViolations=deleteViolations;
module.exports.addRandomViolations=addRandomViolations;


// addViolation(breakSignal, 123454);
// deleteViolations(123454);
// retriveVolationDetails(123454);
// deleteSingleViolation(10, 123454);
// addRandomViolations();