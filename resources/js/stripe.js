import { loadStripe} from '@stripe/stripe-js'
import { placeOrder } from './apiService'
import { CardWidget } from './CardWidget'

export async function initStripe() {
    const stripe = await loadStripe('pk_test_51Hsk3RBZucs78X1xYClNorS4Xwd9gwwrVAmUQ99sZdilyrH6LUAsH4gcO3Qkc0DrWy1sOTcTYIYyLtq0OswKoDOY00ck9YqBbS');
    let card = null;
    /*function mountWidget() {
        
    }*/
    
    const paymentType = document.querySelector('#paymentType')
    if(!paymentType){
        return;
    }
    paymentType.addEventListener('change', (e) => {
        if(e.target.value === 'card'){
            //Display widget
            //mountWidget();
            card = new CardWidget(stripe)
            card.mount()
        } else {
            card.destroy();
        }
    })


    //Ajax call
    const paymentForm = document.querySelector('#payment-form')

    if(paymentForm){
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let formData = new FormData(paymentForm);
            let formObject = {}
            for(let [key, value] of formData.entries()) {
                formObject[key] = value
            }

            if(!card){
                //Ajax
                placeOrder(formObject);
                return;
            }

            const token = await card.createToken()
            formObject.stripeToken = token.id;
            placeOrder(formObject);
        
         })
    }
}