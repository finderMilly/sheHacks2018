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


var itemSelection = function (session) {
  var formattedMsg = session.message.text.toLowerCase();
  var options = [];
  store.products.forEach( function(element) {
    options.push(element.name)
  });
  console.log(formattedMsg)
  var result = store.products.find(product => formattedMsg.indexOf(product.name)>=0);
  //session.send("You said: %s", session.message.text);
  builder.Prompts.choice(
      session,
      'May I offer one of the following options?',
      options,
      {
          maxRetries: 3,
          retryPrompt: "I'm sorry, that's not an option. Please try again!",
          listStyle:builder.ListStyle.button
      });
}

var summary = function (session, results) {
  console.log(results.response);
  var index = results.response.index;
  var result = store.products.find(product => results.response.entity.indexOf(product.name)>=0);
  console.log(result);
  builder.Prompts.choice(
    session,
    `You have selected ${results.response.entity} which costs $${result.price}. We estimate this will be delivered within 30 minutes. Would you like to continue?`,
    ['Yes', 'No - cancel'],
    {
        maxRetries: 3,
        retryPrompt: "I'm sorry, that's not an option. Please try again!",
        listStyle:builder.ListStyle.button
    });
};

var bot = new builder.UniversalBot(connector, [
  itemSelection,
  summary
]);



// var respond = async function (session, results, next) {
//   session.dialogData.destination = results.response;
//   session.send('Looking for hotels in %s', results.response);
//   next();
// }


bot.on('error', function (e) {
    console.log('And error ocurred', e);
});