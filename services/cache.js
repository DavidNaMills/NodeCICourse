const mongoose = require('mongoose');
const redis = require('redis');
const keys = require('../config/keys');


const client = redis.createClient(keys.redisURI);



const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function(){

    const key = Object.assign({}, this.getQuery(), {collection: this.mongooseCollection.name});

    return exec.apply(this, arguments);
}