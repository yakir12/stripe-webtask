# stripe-webtask
How not to use webtask and stripe to charge a set amount

There are many tutorials about [webtask](https://webtask.io) and [stripe](https://stripe.com), a few show how to use these two services in order to charge a credit card with a set amount from a static server (see [this one](https://tomasz.janczuk.org/2016/01/accept-stripe-payments-without-backend-using-webtasks.html) for example). Here, I will outline a bare-bone-example that does not work. 

## Back-end
The `js` part can look like this:
```js
var stripe = require('stripe');
module.exports = function (ctx, cb) {
    console.log('Token: ', ctx.body.stripeToken);
    stripe(ctx.secrets.stripeSecretKey).charges.create({
amount: the_amount_of_money_you_want_to_charge,
currency: 'the_currency',
source: ctx.body.stripeToken,
description: 'a_description_for_the_expense'
}, function (error, charge) {
console.log("Error: ", JSON.stringify(error));
console.log("Charge: ", JSON.stringify(charge));
cb(null, 'Thank you for your business!');
});
};
```
You'll have to replace `the_amount_of_money_you_want_to_charge`, `a_description_for_the_expense`, and `the_currency` in the code above with actual values. 

Put that into some `js` file (say, `file.js`). You'll need to create a webtask from that file and provide the private stripe-key. Using webtask's API you can:
```bash
wt create file.js --secret STRIPE_PRIVATE_KEY=your_private_key_from_stripe
```
Replace `your_private_key_from_stripe` with your actual private stripe-key. 

This will return a `url` for that specific webtask. Save that url, you'll need it for the front-end.

## Front-end
The `html` part can look like this:
```HTML
<!DOCTYPE html>
<html lang="en">
    <body>
        <form action="the_url_you_got_from_the_previous_step" method="POST">
          <script
            src="https://checkout.stripe.com/checkout.js" class="stripe-button"
            data-key="your_public_key_from_stripe"
            data-amount="the_amount_of_money_you_want_to_charge"
            data-description="a_description_for_the_expense"
            data-locale="auto"
            data-zip-code="true"
            data-currency="the_currency"
            >
          </script>
        </form>
    </body>
</html>
```
You'll have to replace `the_url_you_got_from_the_previous_step` with the url you got by creating the webtask, and `your_public_key_from_stripe`, `the_amount_of_money_you_want_to_charge`, `a_description_for_the_expense`, and `the_currency` with actual values. 

Put that into some `html` file (say `index.html`). You can host that file on a static server (e.g. S3).


## All done
Now when someone will go to your `index.html` page, they'll be able to charge their own credit card with `the_amount_of_money_you_want_to_charge`, moving the money to your stripe account. All without any dynamic server.
