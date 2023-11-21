const socket = io()

const sendTicket = document.querySelector(".sendTicket")
const id = document.querySelector(".sendTicket").id

sendTicket.addEventListener("click", ()=>{

socket.emit( "sendTicket" , id )


})
socket.on("ticketProcessed", (data) => {
    alert(data.message + '\n' + JSON.stringify(data.ticketInfo)); 
    window.location.href = '/api/products';  // Redirige a la página de productos
});





