var restify = require('restify');
var builder = require('botbuilder');
var store = require('./products.js');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    // appId: process.env.MicrosoftAppId,
    // appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());



var bot = new builder.UniversalBot(connector, function (session) {
    var formattedMsg = session.message.text.toLowerCase();
    console.log(formattedMsg)
    var result = products.find(product => formattedMsg.indexOf(product.name)>=0);
    //session.send("You said: %s", session.message.text);
    builder.Prompts.choice(
        session,
        'May I offer one of the following options?',
        [result.name, 'Test'],
        {
            maxRetries: 3,
            retryPrompt: "I'm sorry, that's not an option. Please try again!"
        });
});


bot.on('error', function (e) {
    console.log('And error ocurred', e);
});