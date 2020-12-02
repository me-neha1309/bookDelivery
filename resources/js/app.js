//client side works will be done here
//First we are trying to get the buttons so that eventListener can be added onto it
import axios from 'axios' 
import Noty from 'noty'
import { initAdmin } from './admin'
//moment library for time
import moment from 'moment'
import { initStripe } from './stripe'
let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
//This addToCart will be of array type and all the buttons will come here

function updateCart(book) {
    //we have to give a post request on the server and book to our cart
    //axios is  a library
    axios.post('/update-cart', book).then(res =>{
        console.log(res)
        cartCounter.innerText = res.data.totalQty

        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Added to cart',
            progressBar: false
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
        }).show();
    })
}
addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let book = JSON.parse(btn.dataset.book) //here we are receiving the data of whose button was clicked. Since we have received the string form of the data. So we are again converting it into JSON form
       //Now update the cart with the data
       updateCart(book)
        console.log(book)
    })
})

//Remove alert message after x seconds
const alertMsg = document.querySelector('success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 1000)
}



//Change Order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    //logic
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }

        if(dataProp === order.status){
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:m A')
            status.appendChild(time)
            if(status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })

}

updateStatus(order);

initStripe()




//socket client side work
let socket = io()

if(order){
    //join
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    //console.log(data)
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})
