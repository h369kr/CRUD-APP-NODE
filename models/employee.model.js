const mongoose = require('mongoose');
var validator = require("email-validator");

var employeeSchema = new mongoose.Schema({
    Id:{
        type:Number,
    },
    EmployeeCode:{
        type:String
    },
    EmployeeName:{
        type:String,
        required: 'This field is required'
    },
    EmployeeEmail:{
        type:String
    },
    IsActive:{
        type:String
    }
})

// custom validation for email

employeeSchema.path('EmployeeEmail').validate((val) => {
    return validator.validate(val);
},'Invalid Email');

mongoose.model('Employee',employeeSchema);