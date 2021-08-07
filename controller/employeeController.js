const express = require('express');

const mongoose = require('mongoose');

const Employee = mongoose.model('Employee');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("employee/addOrEdit",{
        viewTitle:"Insert Employee"
    })
})

router.post("/",(req,res) => {
    if(req.body._id == "")
    {
    insertRecord(req,res);
    }
    else{
        updateRecord(req,res);
    }
})

function insertRecord(req,res)
{
   var employee = new Employee();

   employee.Id = req.body.Id;

   employee.EmployeeCode = req.body.EmployeeCode;

   employee.EmployeeName = req.body.EmployeeName;

   employee.EmployeeEmail = req.body.EmployeeEmail;

   employee.IsActive = req.body.IsActive;

   employee.save((err,doc) => {
       if(!err){
        res.redirect('employee/list');
       }
       else{
           
          if(err.name == "ValidationError"){
              handleValidationError(err,req.body);
              res.render("employee/addOrEdit",{
                  viewTitle:"Insert Employee",
                  employee:req.body
              })
          }

          console.log("Error occured during record insertion" + err);
       }
   })
}

function updateRecord(req,res)
{
    Employee.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('employee/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("employee/addOrEdit",{
                    viewTitle:'Update Employee',
                    employee:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    Employee.find((err,docs) => {
        if(!err) {
            res.render("employee/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    Employee.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("employee/addOrEdit",{
                viewTitle: "Update Employee",
                employee: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    Employee.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/employee/list');
        }
        else{
            console.log("An error occured during the Delete Process" + err);
        }
    })
})

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
        case 'EmployeeName':
              body['EmployeeNameError'] = err.errors[field].message;
              break;
        
        case 'EmployeeEmail':
              body['EmployeeEmailError'] = err.errors[field].message;
              break;

        default:
           break;
        }
    }
}

module.exports = router;