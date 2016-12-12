var http = require('http');
var https = require('https');
var url = require('url');

var EasyHttp = function(){

    this.get = function(host, params, callback){
        var options = this.urlSplit(host);

        options.path += "?" + this.stringifyParams(params);

        var request = (options.port == 443 ? https : http).get(options, function(res){
            
            var response = new String();

            res.setEncoding("UTF8");

            res.on('data', function(chunk){
                response += chunk;
            });

            res.on('end', function(){
                if(callback) callback(response);
            });

        });

    };

    this.promiseGet = function(host, params){
        return new Promise((resolve, reject) => {
            this.get(host, params, resolve);
        });
    };

    this.post = function(host, path, params, callback){
        var sParams = this.stringifyParams(params);

        var options = this.urlSplit(host);

        options.method = "POST";
        options.headers = { "Content-Length": Buffer.byteLength(sParams) };

        var request = (options.port == 443 ? https : http).request(options, function(res){
            
            var response = new String();

            res.setEncoding("UTF8");

            reps.on('data', function(chunk){
                response += chunk;
            });

            res.on('end', function(){
                if(callback) callback(response);
            });

        });

        request.write(this.stringifyParams(sParams));
        request.end();
    };

    this.urlSplit = function(_url){
        var u = url.parse(_url);
        return {
            'host': u.hostname,
            'port': (!u.port ? (u.protocol == "https:" ? 443 : 80) : u.port),
            'path': u.path
        };
    };

    this.stringifyParams = function(params){
        var result = new String();

        for(key in params) result += key + "=" + encodeURIComponent(params[key]) + '&';

        return result;
    };

};

module.exports = EasyHttp;