module.exports = function (ctx, req, res) {
  //create the stripe objct
  //webtask won't persist objects between requests
  //so we need to create this again each time
  var stripe = require('stripe')(ctx.secrets.STRIPE_PRIVATE_KEY);

  //charge the card
  //this will do a single charge of 1GBP
  //to charge different amounts, we'll need to pass the
  //amount in to our webtask as a parameter, possibly
  //via a hidden form field
  stripe.charges.create({
    amount: 100,
    currency: 'gbp',
    source: ctx.body.stripeToken,
    description: 'Hello world'
  }, function (error, charge) {
    //this function will be called asynchronously
    //after stripe has charged the card
    //we need to add logic in here to check for
    //all of the various possible errors outlied in
    //the Stripe documentation
    console.log("Error: " + JSON.stringify(error));
    console.log("Charge: " + JSON.stringify(charge));
    //we also need to decide what to do in case of an
    //error or on success
    //this example simply prints the hellow world message
    //but we might want to redirect to a thank you page
    //or display appropriate error messaging in case of an error
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end('<h1>Hello world!</h1>');
  });
};
