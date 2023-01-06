/*
*	Brant Robbins
*	ECS 2200
*	Carson's Village: Stripe Payment Integration
*	donate.js
*		Denotes functions specific to donation handling
*		Located under "/donate/"
*/
	
const nanoid = require('nanoid')

require('dotenv').config()
const prisma = require("../database.js")
// Stripe API tokens
const stripePublicKey = process.env.STRIPE_PUBLIC;
const stripeSecretKey = process.env.STRIPE_SECRET;

const express = require('express');					// load express for front-end and routes
const router = express.Router();					// load express router
const stripe = require('stripe')(stripeSecretKey)	// library for handling transactions

/*
*	/donate
*	function:	GET
*	redirect to Stripe payment process init
*/

router.get('/', function(req, res) {
	
	res.render('donate', {
		userAction: '/donate/create-checkout-session',
		stripePublicKey: stripePublicKey
	});
});

/*
*	/donate/create-checkout-session
*	function:	POST
*	endpoint that initiates the payment process
*/
	
router.post('/create-checkout-session/:family_id([0-9]+)/:page_name/',
	async (req, res) => {
	try{
	// convert price to expected cents format
	const family_id = req.params.family_id
	const page_name = req.params.page_name
	const price_in_cents = Math.round(req.body.donation_amount * 100)
	const transaction_id = nanoid.nanoid()
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [
			{
				price_data: {
					currency: 'usd',
					unit_amount: price_in_cents,
					product_data: {
						name: `Donation to ${page_name}`,
					},
				},
				quantity: 1
			},
		],
		metadata: {
			transaction_id: transaction_id,
			amount: price_in_cents,
			target_family_id: family_id,
			target_page_name: page_name,
		},
		success_url: `${process.env.BASEURL}/donate/donation-successful/${transaction_id}`,
		cancel_url: `${process.env.BASEURL}/search/pages/${family_id}/${page_name}`,
	});
		
    await prisma.pageDonation.create({
      data: {
      transaction_id, 
        amount: req.body.donation_amount, 
        familyCuid: family_id, 
        page_name,
    }})
	res.redirect(303, session.url);

	} catch(e){
		console.log(e);
		res.render('failed', {});
	}
});

/*
*	/donate/donation-successful
*	file:		/views/donate-successful.pug
*	function:	GET
*	Page after payment is successfully processed
*/
// TODO: should probably hit stripe API to validate that transaction actually succeeded
// and also make sure a transaction cant be double counted
router.get('/donation-successful/:transaction_id/', async (req, res) => {
	try{
	// get amount donated from transaction
    const transaction = await prisma.pageDonation.findFirst({
      where: {transaction_id: req.params.transaction_id}
    })
	// update success flag in transaction
    await prisma.$transaction([
      prisma.pageDonation.update({
        where: { transaction_id: req.params.transaction_id },
        data: {success: true}
      }),
      prisma.page.update({
        where: {
          familyCuid: transaction.familyCuid,
          page_name: transaction.page_name
        },
        data: {amount_raised: {increment: transaction.amount}}
      }),
    ])

	res.render('donation-successful', {
		back: '/search' + '/pages/' + transaction.family_id + '/'  + transaction.page_name
	})
	} catch(e){
		res.render('failed', {});
	}
	
});

// export modules for user in server.js
module.exports = router;