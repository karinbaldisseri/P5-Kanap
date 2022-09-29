/********************************************************************************
 * Affichage du PANIER
 ********************************************************************************/
/*************************************
 * Déclaration des variables globales 
 *************************************/

let basket = JSON.parse(localStorage.getItem("basket"));
let totalPrice = [];
/****************************
 * Déclaration des fonctions
 ****************************/

// dupliquée de product.js
const updateBasket = (basket) => {
    localStorage.setItem("basket", JSON.stringify(basket));
};

// Calcul et affichage de la quantité totale
const getTotalQuantity = () => {
    //const totalQuantity = basket.reduce((acc, item) => acc + item.quantity, 0);
    const totalQuantity = basket.map(item => item.quantity).reduce((acc, value) => acc + value, 0);
    // MAIS sortir la fonction de la boucle ?
    document.getElementById("totalQuantity").textContent = totalQuantity;
};
    
const getTotalPrice = (product, data) => {
    const price = data.price * product.quantity;
    //console.log(price);
    totalPrice.push(price);
    //console.log(totalPrice);
    totalAmount = totalPrice.reduce((acc, value) => acc + value, 0);
    //console.log(totalAmount);
    //const totalPrice = basket.reduce((totalPrice, product) => totalPrice + (itemPrice * product.quantity), 0);
    document.getElementById("totalPrice").textContent = totalAmount.toFixed(2);
};

const updateQuantityInLs = (product, data) => {
    const quantityInputs = document.querySelectorAll(".itemQuantity");
    //console.log(quantityInputs);
    quantityInputs.forEach((qtyInput) => {
        qtyInput.addEventListener("change", () => {
            let article = qtyInput.closest('article');
            for (let item of basket) {
                if (item.id === article.dataset.id && item.color === article.dataset.color) {
                    item.quantity = parseInt(qtyInput.value);
                    updateBasket(basket);
                    location.reload();
                }
            } 
        })
    })
};


// Supprimer un produit du panier dans Ls
function removeFromBasket(product, data) {
    const deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", () => {
            if (basket.length > 1) {
                let article = deleteBtn.closest('article');
                basket = basket.filter((p) => !(p.id === article.dataset.id && p.color === article.dataset.color));
                updateBasket(basket);
                article.style.display = "none";
                location.reload();
            } else {
                localStorage.clear();
                estVide();
            }
        })
    });
};

// Récupérer les données des produits depuis l'API
// Duplication de code : idem script.js
const getProducts = async () => {
    try {
        const response = await fetch(apiUrl)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Retour du serveur : erreur', response.status)
        }
    } catch (e) {
        alert(e)
    }
};

//Création de l'<article> PRODUIT
const createProduct = (product, data) => {
    document.getElementById("cart__items").innerHTML +=
        `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                    <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                 <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${data.name}</h2>
                        <p>${product.color}</p>
                        <p>${(data.price).toFixed(2)} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;
    getTotalQuantity();
    getTotalPrice(product, data);
};

// si panier vide : ajouter "est vide" dans h1 
const estVide = () => {
    document.querySelector("h1").innerText += " est vide !"
    const cartSection = document.querySelector("section.cart");
    cartSection.style.display = "none";
    const cartContent = document.getElementById("cartAndFormContainer");
    const cartAncre = document.createElement("a");
    cartAncre.style = "color:white; text-align:center; display:block"
    cartAncre.setAttribute("href", "index.html");
    cartAncre.textContent = "Retourner au catalogue des produits";
    cartContent.insertBefore(cartAncre, cartSection);
};

// Affichage des PRODUITS du Panier
const displayBasket = async () => {
    if (basket == null || basket === undefined || basket === []) {
        estVide();
    } else {
        for (let product of basket) {
            apiUrl = `http://localhost:3000/api/products/${product.id}`;
            const data = await getProducts();
            createProduct(product, data);
            updateQuantityInLs(product, data);
            removeFromBasket(product, data);
        }
    }
};

/******************************************************************/

displayBasket();

