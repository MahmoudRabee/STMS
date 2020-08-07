const joi = require('joi');



function validarUser(data) {
    const schema = joi.object({
      name: joi.string().required().min(5).max(50),
      email: joi.string().required().min(5).max(50).email(),
      password: joi.string().required().min(5).max(50),
      phone_number: joi.string().length(11).pattern(/^[0-9]+$/).required(),
      ssid: joi.string().length(14).pattern(/^[0-9]+$/).required(),
      car_number:joi.string().length(6).pattern(/^[0-9]+$/).required()

    });
  
    return schema.validate(data);
  }



exports.validate = validarUser ; 