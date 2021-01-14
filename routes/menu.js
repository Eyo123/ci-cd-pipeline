var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url= 'mongodb+srv://Mop:REAL123456789@cluster0.xucpe.mongodb.net/test?retryWrites=true&w=majority';


router.get('/', function(req, res, next) {
    
    res.render('menu');
});

router.get('/get-data', function(req, res, next) {
    var resultArray = [];
    mongo.connect(url, function(err, client) {
        if (err)console.log("connexion impossible");
        let db2=client.db('test')
        var cursor = db2.collection('collection_test').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
            client.close();
            res.render('menu', {items: resultArray});
        });
    });
});

router.post('/insert', function(req, res, next) {
    let dateN = new Date().toString();
    var item = {
        name: req.body.name,
        address: req.body.address,
        statue: req.body.statue,
        confinement: req.body.confinement,
        date_doc: dateN
    };

    mongo.connect(url, function(err, client) {
        if (err)console.log("connexion impossible");
        let db2=client.db('test')
        db2.collection('collection_test').insertOne(item, function(err, result) {
            assert.equal(null, err);
            console.log('Item inserted');
            client.close();
        });
    });

    res.redirect('/');
});

router.post('/update', function(req, res, next) {
    let dateN = new Date().toString();
    var item = {
        name: req.body.name,
        address: req.body.address,
        statue: req.body.statue,
        confinement: req.body.confinement,
        date_doc: dateN
    };
    var id = req.body.id;

    mongo.connect(url, function(err, client) {
        if (err)console.log("connexion impossible");
        let db2=client.db('test')
        db2.collection('collection_test').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
            assert.equal(null, err);
            console.log('Item updated');
            client.close();
        });
    });
});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;

    mongo.connect(url, function(err, client) {
        if (err)console.log("connexion impossible");
        let db2=client.db('test')
        db2.collection('collection_test').deleteOne({"_id": objectId(id)}, function(err, result) {
            assert.equal(null, err);
            console.log('Item deleted');
            client.close();
        });
    });
});

module.exports = router;
