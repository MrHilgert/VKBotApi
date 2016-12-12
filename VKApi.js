var ehttp = new (require('../../EasyHttp'))();

var VK = function() {
    var self = this;

    var token = 'abcdefg';

    self.setToken = function(param) {
        self.token = param;
    };

    self.getToken = function() {
        return self.token;
    };
    
    self.request = function(_method, _params) {
        return new Promise((resolve, reject) => {
            if(!_params) _params = {};
            _params.access_token = self.token;
            _params.v = 5.60;
            ehttp.promiseGet('https://api.vk.com/method/' + _method, _params).then((resp) => resolve(JSON.parse(resp)));
        });
    };

};

module.exports = VK;
