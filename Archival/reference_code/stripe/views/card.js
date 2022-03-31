//Import for stripe payment processing
//Replace "public key" with public key found in Stripe profile under development tools
const stripe = Stripe('insert public key here'); // Your Publishable Key
//Import for stripe payment processing
const elements = stripe.elements();

// Create our card inputs
var style = {
	base: {
		color: "#fff"											//Set color to white
	}
};

const card = elements.create('card', { style });				//create card with set CSS elements
card.mount('#card-element');

const form = document.querySelector('form');					//card information comes from HTML form
const errorEl = document.querySelector('#card-errors');			//list card errors

// Give our token to our form
const stripeTokenHandler = token => {							//Create token
	const hiddenInput = document.createElement('input');			//Set invisible input
	hiddenInput.setAttribute('type', 'hidden');							//Denote type as hidden
	hiddenInput.setAttribute('name', 'stripeToken');					//Denote name as stripe token
	hiddenInput.setAttribute('value', token.id);						//Give token some id
	form.appendChild(hiddenInput);										//Add hidden input to form
	
	form.submit();												//Only submit form if token exists
}

// Create token from card data
form.addEventListener('submit', e => {							//wait for submit action to occur
	e.preventDefault();											//prevents browser's payment interface from being shown
	
	stripe.createToken(card).then(res => {
    	if (res.error) errorEl.textContent = res.error.message;	//generate error message
		else stripeTokenHandler(res.token);						//create token with given credentials
	})
})
