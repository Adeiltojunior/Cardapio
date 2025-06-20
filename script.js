const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
  updateCartMordal();
});
//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
    // Adiciona o item ao carrinho
  }
});

//função para adiconar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    //se o item já existe, apenas atualiza a quantidade
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updateCartMordal();
}

//Atualiza o carrinho
function updateCartMordal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "mb-4", "flex-col");

    cartItemElement.innerHTML = ` 
      <div class="flex items-center justify-between">

        <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd:${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        
          <button class="remove-from-cart-btn" data-name="${item.name}">
              remover
          </button>
        
      </div>

      `;

      total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.innerHTML = cart.length;
}

//Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
   
    removeItemCart(name);
  }
})

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1){
    const item = cart[index];
    
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartMordal();
      return;
    } 

    cart.splice(index, 1);
    updateCartMordal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
    
  }
});
//finalizar o pedido
checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    alert("O restaurante está fechado. Tente novamente mais tarde.");
    return;
  }

  if(cart.length === 0) {
    return;
  }
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }
  //Enviar o pedido para o whatsapp
  const cartItems= cart.map((item) => {
    return `${item.name} Quantidade: ${item.quantity} Preço R$ ${item.price.toFixed(2)} | `;
  }).join("")

  const massage = encodeURIComponent(cartItems);
  const phome = "984361554"

  window.open(
    `https://api.whatsapp.com/send?phone=${phome}&text=Olá, gostaria de fazer um pedido: ${massage} Total: R$ ${cartTotal.textContent} Endereço: ${addressInput.value}`
  );
  cart = [];
  updateCartMordal();
});

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 8 && hora < 22;
}
  //true restaurante está aberto
const spanItem = document.getElementById("date-span");
 const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
}else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}