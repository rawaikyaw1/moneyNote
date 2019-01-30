var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
var config = require('../config/options');
var models = require('../models');
var Sequelize = require('sequelize');
var multer  = require('multer');
var fileUpload = multer({ dest: 'public/uploads/notes' });
var Op = Sequelize.Op;
const PER_PAGE = 5;
var auth = require('connect-ensure-login').ensureLoggedIn;

/* GET home page. */
router.get('/', auth('/auth/login'), async function(req, res, next) {
  // to use await mustt use async.
  var totalExpense = await models.Transaction.sum('amount',{where:{type:1}}) || 0; //wait until finish.
  var totalIncome = await models.Transaction.sum('amount',{where:{type:2}}) || 0;
  var totalReceivable = await models.Transaction.sum('amount',{where:{type:3}}) || 0;


  var type = req.query.type ? req.query.type : 0;
  var key_word = req.query.key_word ? req.query.key_word : null ;
  var from_date = req.query.from_date ? req.query.from_date : null;
  var to_date = req.query.to_date ? req.query.to_date : null;

  var condition = {where:{}, order: [['createdAt', 'DESC']]};
  if(type>0){
    condition.where.type = type;
  }
  if(key_word){
    condition.where.title = {[Op.like]: '%'+key_word+'%'};
  }

  if (from_date && to_date){
      condition.where.date = {[Op.between] : [from_date, to_date]};
  }
  else
  {
    let dateCon = {};
    if (from_date || to_date) {
      
      if (from_date) {
        dateCon = Object.assign({ [Op.gte] : from_date }, dateCon);
      }
      if (to_date) {
        dateCon = Object.assign({ [Op.lte] : to_date }, dateCon);
      }

      condition.where.date = dateCon;
    }

    
  }

    condition.where.user_id = req.user.id;

  let currentPage = req.query.page ? parseInt(req.query.page) : 1;

    condition.limit = PER_PAGE;
    condition.offset = (currentPage - 1 ) * PER_PAGE;

    let result = await models.Transaction.findAndCountAll(condition);
    let pagination = {
      totalRecords :result.count,
      currentPage : currentPage
    };
    
    pagination.totalPages = Math.ceil(pagination.totalRecords/PER_PAGE); //get decimal point to full number. Eg. If currentPage result : 1.2, this will change to 2.
    pagination.hasNextPage = (pagination.totalPages > 1 && pagination.currentPage < pagination.totalPages) ? (pagination.currentPage + 1 ) : false;
    pagination.hasPrevPage = (pagination.totalPages > 1 && pagination.currentPage > 1 ) ? (pagination.currentPage - 1) : false;

    // console.log(pagination)

  // models.Transaction.findAll(condition).then((result)=>{
  //   // console.log(result);

    res.render('notes/index', { title: 'moneyNotes', 
                          transaction : result.rows,
                          pagination: pagination, 
                          type:type, 
                          from_date: from_date,
                          to_date: to_date,
                          key_word:key_word,
                          totalExpense : totalExpense,
                          totalIncome:totalIncome,
                          totalReceivable:totalReceivable,
                          currentBalance: totalIncome-totalExpense
                        });
  // })
  // .catch((err)=>{
  //   console.log(err);
  // });
  
  // console.log(rows);

  // res.render('index', { title: 'moneyNotes' });

});

/* GET create page. */
router.get('/create',auth('/auth/login'), function(req, res, next) {
  let types = config.TRANSACTION_TYPES;
  let currencies = config.CURRENCY;
  res.render('notes/create', { title: 'moneyNotes', types: types, currencies:currencies });
});

var keys = [];
for(var i = 1; i > config.TRANSACTION_TYPES.length; i++){
  keys.push[i];
}
// console.log(keys);
/* POST store a note. */
router.post('/store', auth('/auth/login'), fileUpload.single('attachment'), [

  check('title').isLength({ min: 3 }).withMessage('Title must be at least 3 chars long'),
  check('amount').isNumeric().withMessage('Amount must be number'),
  check('type').isIn([1,2,3]).withMessage('Types must be number')


],  function(req, res, next) {

  
  backURL=req.header('Referer') || '/';
  
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    req.flash("infos" , errors.array());
    return res.redirect(backURL);

  }

  let formData = req.body;
  // console.log(formData);
//save upload file info.
  let photo = req.file;
  if(photo){
    formData.attachment = photo.filename;
  }

    formData.user_id = req.user.id;
// console.log(photo.destination);
  models.Transaction.create(formData).then((err, result)=>{
    req.flash("success" , "Successfully Created");

    return res.redirect('/notes');
    
  });
 

});

/* GET detail page. */
router.get('/transaction/:id', auth('/auth/login'), function(req, res, next) {
  var id = req.params.id;
  models.Transaction.findOne({
    where:{
      id: id
    }
  }).then((result)=>{
    // console.log(result);
    let types = config.TRANSACTION_TYPES;
    let currencies = config.CURRENCY;
    res.render('notes/detail', { title: 'moneyNotes Detail', transaction : result, types: types, currencies:currencies });
  })
  .catch((err)=>{
    console.log(err);
  });

  // res.render('notes/detail', { title: 'moneyNotes Deatil' });
});

/* POST store a note. */
router.post('/transaction/:id/update', auth('/auth/login'), fileUpload.single('attachment'), [

  check('title').isLength({ min: 3 }).withMessage('Title must be at least 3 chars long'),
  check('amount').isNumeric().withMessage('must be number')

], async function(req, res, next) {  

  backURL=req.header('Referer') || '/';
  
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    
    req.flash("infos" , errors.array());
    return res.redirect(backURL);
  }

  let formData = req.body;
  var id = req.params.id;

  // console.log(formData);
  //file upload.

  //check user its own record.

  var recordId = await models.Transaction.findOne({where:{id:id}});

  if(!recordId || recordId.user_id != req.user.id){
    req.flash("error" , {"msg":"You have no permission to edit this record"});
    res.redirect('/notes'); 
  }


  let photo = req.file;
  if(photo){
    formData.attachment = photo.filename;
  }

  models.Transaction.update(formData,{
    where:{
      id: id
    }
  }).then((err, result)=>{
    
    req.flash("success" , "Successfully Update");
    return res.redirect('/notes');

  });

  // req.flash("success" , {"msg" : "Successfully Created"});  

});

/* GET delete row. */
router.get('/transaction/:id/delete', auth('/auth/login'), async function(req, res, next) {
  var id = req.params.id;

  var recordId = await models.Transaction.findOne({where:{id:id}});

    if(!recordId || recordId.user_id != req.user.id){
      req.flash("error" , {"msg":"You have no permission to delete this record"});
      res.redirect('/notes'); 
    }

  models.Transaction.destroy({
    where:{
      id: id
    }
  }).then((result)=>{
    // console.log(result);

    req.flash("infos" , {"msg":"Successfully Deleted"});
    res.redirect('/notes');
    
  })
  .catch((err)=>{
    console.log(err);
  });
  
});


module.exports = router;
