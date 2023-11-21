const socket = io()

const addToCar = document.getElementsByClassName("productbutton")
const email = document.querySelector(".email")

    
for( let i = 0 ; i < addToCar.length ; i++ ){

addToCar[i].addEventListener("click", async ()=>{
    
    const idButton = addToCar[i].id
    
    const data = {
       idProduct : idButton,
       email : email.id,

    }
    console.log(data)
    
    socket.emit("addToCart", data)
    
    socket.on("productAdded", () => {
        alert("Producto añadido con éxito");
      });
      socket.on("productError", (errorMessage) => {
        alert(`Error: ${errorMessage}`);
      });

})}

