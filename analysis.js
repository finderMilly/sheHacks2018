'use strict';

let https = require ('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the accessKey string value with your valid access key.
let accessKey = '';

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace 
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.
let uri = 'westcentralus.api.cognitive.microsoft.com';
let path = '/text/analytics/v2.0/sentiment';

let response_handler = function (response, callback) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
        let body_ = JSON.parse (body);
        let body__ = JSON.stringify (body_, null, '  ');
        callback(body_);
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};

let createDocument = function(message) {
    return {
        'documents': [
            {
                'id': 1,
                'language': 'en',
                'text': message
            }
        ]
    }; 
};
 
let get_sentiments = function (message, callback) {
    let documents = createDocument(message);
    let body = JSON.stringify (documents);

    let request_params = {
        method : 'POST',
        hostname : uri,
        path : path,
        headers : {
            'Ocp-Apim-Subscription-Key' : accessKey,
        }
    };

    let req = https.request (request_params, function(response) { response_handler(response, callback);});
    req.write (body);
    req.end ();
}

module.exports = {
    get_sentiments
}