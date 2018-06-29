var restify = require('restify');
var builder = require('botbuilder');

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

var products = [{
    name: 'Hot chocolate',
    price: '14.50'
}];

var bot = new builder.UniversalBot(connector, function (session) {
    var result = products.find(product => session.message.text == product.name);
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