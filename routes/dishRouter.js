const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

var dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//get all dishes
dishRouter.get('/', async function(req,res){
    var dishes =  await Dishes.find({});
    res.statusCode =  200;
    res.set('content-type', 'application/json');
    res.json(dishes);
});

//post dishes
dishRouter.post('/', async function(req,res){
    var dish = await Dishes.create(req.body);
    res.statusCode = 200;
    console.log("Dish create", dish);
    res.set('content-type', 'application/json');
    res.json({'message' : 'insert berhasil'});
})

//delete dishes
dishRouter.delete('/', async function(req,res){
    await Dishes.remove({});
    res.statusCode = 200;
    res.json({'message' : 'delete all dishes berhasil'});
})

//get dishes by id
dishRouter.get('/:id', async function(req,res){
    var dishes =  await Dishes.findById(req.params.id);
    res.statusCode = 200;
    res.set('content-type', 'application/json');
    res.json(dishes);
});

//put dishes by id
dishRouter.put('/:id', async function(req,res){
    console.log(req.params.id);
    var dish = await Dishes.findByIdAndUpdate(req.params.id,{$set: req.body}, {new: true});
    res.statusCode = 200;
    console.log("Dish create", dish);
    res.set('content-type', 'application/json');
    res.json({'message' : 'update berhasil'});
})

//delete dishes by id
dishRouter.delete('/:id', async function (req, res){
    await Dishes.findByIdAndRemove(req.params.id);
    res.statusCode = 200;
    res.json({'message' : 'delete berhasil'});
})

//get all comments in dishes
dishRouter.get('/:id/comments', async function(req,res){
    var dishes =  await Dishes.findById(req.params.id,(err,result) =>{
        if(err){
            res.statusCode = 404;
            res.end('Comment tidak ada')
        }
    });
    res.statusCode = 200;
    res.set('content-type', 'application/json');
    res.json(dishes.comments);    
});

//post comment
dishRouter.post('/:id/comments/', async function(req,res){
    await Dishes.findById(req.params.id,(err,result) =>{
        if(err){
            res.statusCode = 404;
            res.end('Comment tidak ada')
        }
    });
    await Dishes.findByIdAndUpdate(req.params.id,{ $push : {comments : req.body}}, {new: true});
    res.statusCode = 200;
    res.set('content-type', 'application/json');
    res.json({'message' : 'insert comment berhasil'});
});

//delete comment
dishRouter.delete('/:id/comments/', async (req, res) => {
    var dish = await Dishes.findById(req.params.id,(err,result) =>{
        if(err){
            res.statusCode = 404;
            res.end('Dishes tidak ada')
        }
    });
    for (var i = (dish.comments.length -1 ); i >= 0; i--) {
        dish.comments.id(dish.comments[i]._id).remove();
    }
    dish.save(function (err, resp) {
        if(err) {
            throw err
        };
        res.statusCode = 200;
        res.json({'message' : 'delete comment berhasil'});
    });
})

//get comments by id
dishRouter.get('/:id/comments/:idComment', async function(req,res){
    var dish = await Dishes.findById(req.params.id,(err,result) =>{
        if(err){
            res.statusCode = 404;
            res.end('Comment tidak ada')
        }
    });
    res.json(dish.comments.id(req.params.idComment)); 
});

//delete by id
dishRouter.delete('/:id/comments/:idComment', async function(req, res){
    var dish = await Dishes.findById(req.params.id,(err,result) =>{
        if(err){
            res.statusCode = 404;
            res.end('Dishes tidak ada')
        }
    });
    var result = dish.comments.id(req.params.idComment);
    if(result != null){
        result.remove();
        dish.save(function (err, resp) {
            if(err) {
                throw err
            };
            res.statusCode = 200;
            res.json({'message' : 'delete comment berhasil'});
          });
    }else{
        res.statusCode = 404;
            res.end('comments tidak ada')
    }
});

//put
dishRouter.put('/:id/comments/:idComment', async function(req, res){
    var dish = await Dishes.findById(req.params.id,(err,result) =>{
        if(err){
            res.statusCode = 404;
            res.end('Dishes tidak ada')
        }
    });
    await Dishes.findByIdAndUpdate(req.params.id,{ $push : {comments : req.body}}, {new: true});
    var result = dish.comments.id(req.params.idComment);
    if(result != null){
        result.remove();
        dish.save(function (err, resp) {
            if(err) {
                throw err
            };
            res.statusCode = 200;
            res.json({'message' : 'update comment berhasil'});
          });
    }else{
        res.statusCode = 404;
        res.end('comments tidak ada')
    }
});

module.exports = dishRouter;