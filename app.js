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
      'Sure thing Joyce. Sounds like you could do with some TLC. Did you want to treat yourself with one of the following?',
      options,
      {
          maxRetries: 3,
          retryPrompt: "I'm sorry, that's not an option. Please try again!",
          listStyle:builder.ListStyle.button
      });
};

var summary = function (session, results) {
  console.log(results.response);
  var index = results.response.index;
  var result = store.products.find(product => results.response.entity.indexOf(product.name)>=0);
  console.log(result);
  builder.Prompts.choice(
    session,
    `OK, cool, I'll grab some ${results.response.entity} for you which will cost $${result.price}. We can get it to you within 30 minutes. What do you think?`,
    ['Yes please', 'No - cancel'],
    {
        maxRetries: 3,
        retryPrompt: "I'm sorry, that's not an option. Please try again!",
        listStyle:builder.ListStyle.button
    });
};

var confirmation = function (session, results) {
  console.log('in getPin'+results.response.index);
  var index = results.response.index;
  if (index==1) { //response is cancel
    session.endDialog(`OK, we've cancelled your order. Just message us again if you need anything else! We support your decisions! You do you!`);
  }
  if (index == 0) { //response is yes
    session.send(`Great! Glad to be there for you Joyce. We'll be there for you within 30 minutes.`);
    // followup(session, results);
  }
};

// var followup = function (session, results) {
//   {console.log(results)};
//   builder.Prompts.choice(
//     session,
//      `We know waiting is one of the hardest things to do, so here's something from us in the meantime to keep you going... which would you prefer?`,
//      ['Ryan Gosling', 'Empowering song', 'Sad girl poetry'],
//      {
//          maxRetries: 3,
//         retryPrompt: "I'm sorry, that's not an option. Please try again!",
//         listStyle:builder.ListStyle.button
//     });
//     gift(session, results);
//   };

// var gift = function (session, results) {
//   {console.log(results)};
//   var index = results.response.index;
//   if (index==0) { //response is ryan gosling
//     session.endDialog(`You're going to like this! Just follow this link: https://i.imgflip.com/a6znr.jpg`);
//   }
//   if (index == 1) { //response is song
//     session.endDialog(`You're going to like this! Just follow this link: https://i.imgflip.com/a6znr.jpg`);
//   }
//   if (index == 2) { //response is poetry
//     session.endDialog(`You're going to like this! Just follow this link: https://assets.rbl.ms/10463908/980x.png`);
//   }
// };

var bot = new builder.UniversalBot(connector, [
  itemSelection,
  summary,
  confirmation,

]);



// var respond = async function (session, results, next) {
//   session.dialogData.destination = results.response;
//   session.send('Looking for hotels in %s', results.response);
//   next();
// }


bot.on('error', function (e) {
    console.log('And error ocurred', e);
});