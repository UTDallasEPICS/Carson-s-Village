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

// Stripe API tokens
const stripePublicKey = process.env.STRIPE_PUBLIC;
const stripeSecretKey = process.env.STRIPE_SECRET;

const { query } = require('express');
const express = require('express');					// load express for front-end and routes
const router = express.Router();					// load express router
const client = require('../database.js');			// load database connection
const stripe = require('stripe')(stripeSecretKey)	// library for handling transactions
const queryErr = 'An error has occurred';

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
			transaction_amount: price_in_cents,
			target_family_id: family_id,
			target_page_name: page_name,
		},
		success_url: `${process.env.BASEURL}/donate/donation-successful/${transaction_id}`,
		cancel_url: `${process.env.BASEURL}/search/pages/${family_id}/${page_name}`,
	});
		
    var insertStatement = "INSERT INTO Transactions (transaction_id, transaction_amount, family_id, page_name, success) VALUES ($1, $2, $3, $4, $5)"
    var insertValues = [transaction_id, req.body.donation_amount, family_id, page_name, false]

    await client.query(insertStatement, insertValues)
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

router.get('/donation-successful/:transaction_id/', async (req, res) => {
	try{
	// get amount donated from transaction
	const text = 'SELECT * FROM Transactions WHERE transaction_id = $1';
	const values = [req.params.transaction_id]
	const queryRes = await client.query(text, values);
	const transaction_amount = queryRes.rows[0].transaction_amount

	// update success flag in transaction
	
	
	const family_id = queryRes.rows[0].family_id
	const page_name = queryRes.rows[0].page_name

	const update_status = 'UPDATE Transactions SET success = $1 WHERE transaction_id = $2'
	const update_status_vals = [true, req.params.transaction_id]
	await client.query(update_status, update_status_vals)
	
	const update_amt = 'UPDATE Page_Details SET amount_raised = amount_raised + $1 WHERE family_id = $2'
	const update_amt_vals = [transaction_amount, family_id]
	await client.query(update_amt, update_amt_vals)
	res.render('donation-successful', {
		back: '/search' + '/pages/' + family_id + '/'  + page_name
	})
	} catch(e){
		res.render('failed', {});
	}
	
});

// export modules for user in server.js
module.exports = router;