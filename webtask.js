var stripe = require('stripe');

module.exports = function (ctx, req, res) {
  console.log('ctx: ' + JSON.stringify(ctx));
  console.log('req: ' + JSON.stringify(req));
  console.log('Token: ', ctx.body.stripeToken);

  stripe.charges.create(ctx.secrets.STRIPE_PRIVATE_KEY, {
    amount: 100,
    currency: 'gbp',
    source: ctx.body.stripeToken,
    description: 'Hello world'
  }, function (error, charge) {
    console.log("Error: " + JSON.stringify(error));
    console.log("Charge: " + JSON.stringify(charge));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end('<h1>Hello world!</h1>');
  });
};
