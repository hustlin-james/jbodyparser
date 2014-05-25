var qs = require('qs');
var is = require('type-is');
var getRawBody = require('raw-body');

exports = module.exports = jbodyparser;

function jbodyparser(){
    return bodyParser;
}

function bodyParser(req,res,next){
    var parseFunction
    , hasRequestBody = 'content-type' in req.headers 
    || 'transfer-encoding' in req.headers;

    if(!hasRequestBody)
        return next();

    switch(is(req, ['urlencoded','json'])){
        case 'urlencoded':
            parseFunction = parseUrlEncoded;
        break;
        case 'json':
            parseFunction = parseJSON;
        break;
        default:
            req.body = {};
            next();
        break;
    }

    var opts = {
        length: req.headers['content-length'],
        limit: '1mb',
        encoding: 'utf8'
    };

    getRawBody(req,opts,function(err,str){
        if(err)
            return next(err);
        console.log(str);
        req.body = parseFunction(str);
        next();
    });
}

function parseJSON(str){
    return JSON.parse(str);
}

function parseUrlEncoded(str){
    return qs.parse(str);
}