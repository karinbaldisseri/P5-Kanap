/********************************************************************************
 * Affichage du PANIER avec détails des produits à commander
 ********************************************************************************/
/*************************************
 * Déclaration des variables globales 
 *************************************/

let apiDataForBasketProducts = [];

/****************************
 * Déclaration des fonctions
 ****************************/

// Mettre à jour le panier dans LS
const updateBasket = (basket) => {
    localStorage.setItem("basket", JSON.stringify(basket));
};

// Récupérer le panier depuis LS
const getBasket = () => {
    const basket = JSON.parse(localStorage.getItem("basket"));
    // regrouper produits par modèle à l'affichage
    if (basket !== null) {
        basket.sort((a, b) => a.id > b.id ? 1 : -1);
    }
    return basket;
};

// Calcul et affichage de la quantité totale
const getTotalQuantity = () => {
    const basket = getBasket();
    const totalQuantity = basket.map(item => item.quantity).reduce((acc, value) => acc + value, 0);
    document.getElementById("totalQuantity").textContent = totalQuantity;
};

// Calcul et affichage du prix total
const getTotalPrice = () => {
    const basket = getBasket();
    let allPrices = [];
    for (let item of basket) {
        const unitPrice = apiDataForBasketProducts.find(element => element._id == item.id).price;
        const totalPrice = unitPrice * item.quantity;
        allPrices.push(totalPrice);
    }
        const totalAmount = allPrices.reduce((acc, value) => acc + value, 0);
        document.getElementById("totalPrice").textContent = totalAmount.toFixed(2);
};

// Mise à jour de la quantité de chaque produit dans le Localstorage
const updateQuantityInLs = () => {
    const basket = getBasket();
    const quantityInputs = document.querySelectorAll(".itemQuantity");
    quantityInputs.forEach((qtyInput) => {
        qtyInput.addEventListener("change", () => {
            const article = qtyInput.closest('article');
            qtyInput.value = (qtyInput.value < 1 || qtyInput.value > 100 || qtyInput.value === null) ? 1 : qtyInput.value;
            for (let product of basket) {
                if (product.id === article.dataset.id && product.color === article.dataset.color) {
                    product.quantity = parseInt(qtyInput.value);
                    updateBasket(basket);
                    getTotalQuantity();
                    getTotalPrice();
                }
            } 
        })
    })
};

// Supprimer un produit du panier dans Ls
function removeFromCart() {
    let basket = getBasket();
    const deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", () => {
            if (basket.length > 1) {
                const article = deleteBtn.closest('article');
                basket = basket.filter((p) => !(p.id === article.dataset.id && p.color === article.dataset.color));
                updateBasket(basket);
                article.remove();
                getTotalQuantity();
                getTotalPrice();
            } else {
                localStorage.clear();
                basketIsEmpty();
            }
        })
    })
};

//Création de l'<article> PRODUIT pourb chacun des produits présents dans le panier LS
const createProduct = (product, data) => {
    const search = data.colors.find(color => color === product.color)
    if (search) {
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
    } else {
        const article = document.getElementsByClassName("cart__item");
        let basket = getBasket();
        basket = basket.filter((p) => !(p.id === product.id && p.color === product.color));
        updateBasket(basket);
    }
};

// si panier vide : adapter la page panier
const basketIsEmpty = () => {
    document.querySelector("h1").innerText += " est vide !"
    const cartSection = document.querySelector("section.cart");
    cartSection.remove();
    const cartContent = document.getElementById("cartAndFormContainer");
    const cartAncre = document.createElement("a");
    cartAncre.style = "color:white; text-align:center; display:block"
    cartAncre.setAttribute("href", "index.html");
    cartAncre.textContent = "Retourner au catalogue des produits";
    cartContent.appendChild(cartAncre);
};

// Récupérer les données de chacun des produits présent dans le panier(LS) depuis l'API
const getProduct = async (productId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Retour du serveur : erreur', response.status)
        }
    } catch (e) {
        alert(e)
    }
};

// Affichage des PRODUITS du Panier depuis LS
const displayBasket = async () => {
    const basket = getBasket();
    if (basket === null || basket === undefined || basket === [] ) {
        basketIsEmpty();
    } else {
        for (let product of basket) {
            const data = await getProduct(product.id);
            apiDataForBasketProducts.push(data);
            createProduct(product, data);
        }
        getTotalQuantity();
        getTotalPrice();
        updateQuantityInLs();
        removeFromCart();
    }
};

/******************************************************************/

displayBasket();


/********************************************************************************
 * VALIDATION DU FORMULAIRE
 ********************************************************************************/
/*************************************
 * Déclaration des variables globales 
 *************************************/

const form = document.querySelector(".cart__order__form");

/****************************
 * Déclaration des fonctions
 ****************************/

// Vérification du PRÉNOM au changement de l'input(RegExp)
form.firstName.addEventListener('change', function() {
    validFirstName(this);
});
const validFirstName = (inputFirstName) => {
    const firstNameRegExp = new RegExp("^[a-zçéèêëàâîïôùû' -]{2,20}$", 'gi'); 
    const message = inputFirstName.nextElementSibling;
    if (firstNameRegExp.test(inputFirstName.value)) {
        message.textContent = "Prénom valide";
        message.style.color = "#9BE700";
        return true;
    } else {
        message.textContent = "Veuillez entrer un prénom valide : entre 2 et 20 caractères (sans chiffres ni caractères spéciaux)";
        message.removeAttribute("style");
        return false;
    }
};

// Vérification du NOM au changement de l'input(RegExp)
form.lastName.addEventListener('change', function() {
    validFirstName(this);
});
const validLastName = (inputLastName) => {
    const lastNameRegExp = new RegExp("^[a-zçéèêëàâîïôùû' -]{2,25}$", 'gi');
    const message = inputLastName.nextElementSibling;
    if (lastNameRegExp.test(inputLastName.value)) {
        message.textContent = "Nom valide";
        message.style.color = "#9BE700";
        return true;
    } else {
        message.textContent = "Veuillez entrer un Nom valide : entre 2 et 25 caractères (sans chiffres)"
        message.removeAttribute("style");
        return false;
    }
};

// Vérification de l'ADRESSE au changement de l'input(RegExp)
form.address.addEventListener('change', function() {
    validAddress(this);
});
const validAddress = (inputAddress) => {
    const addressRegExp = new RegExp(`^[a-z0-9çéèêëàâîïôùû',"() -]{5,75}$`, 'gi');
    const message = inputAddress.nextElementSibling;
    if (addressRegExp.test(inputAddress.value)) {
        message.textContent = "Adresse valide";
        message.style.color = "#9BE700";
        return true;
    } else {
        message.textContent = "Veuillez entrer une adresse valide : entre 5 et 100 caractères"
        message.removeAttribute("style");
        return false;
    }
};

// Vérification de la VILLE au changement de l'input(RegExp)
form.city.addEventListener('change', function() {
    validCity(this);
});
const validCity = (inputCity) => {
    const cityRegExp = new RegExp(`^[a-z0-9çéèêëàâîïôùû',"() -]{5,50}$`, 'gi');
    const message = inputCity.nextElementSibling;
    if (cityRegExp.test(inputCity.value)) {
        message.textContent = "Ville valide";
        message.style.color = "#9BE700";
        return true;
    } else {
        message.textContent = "Veuillez entrer une ville valide : entre 5 et 50 caractères"
        message.removeAttribute("style");
        return false;
    }
};

// Vérification de l'EMAIL au changement de l'input(RegExp)
form.email.addEventListener('change', function() {
    validEmail(this);
});
const validEmail = (inputEmail) => {
    const emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
    const message = inputEmail.nextElementSibling;
    if (emailRegExp.test(inputEmail.value)) {
        message.textContent = "Adresse email valide";
        message.style.color = "#9BE700";
        return true;
    } else {
        message.textContent = "Veuillez entrer une adresse email valide"
        message.removeAttribute("style");
        return false;
    }
};

/********************************************************************************
 * CRÉATION et vérification des DONNÉES pour commande
 ********************************************************************************/
/****************************
 * Déclaration des fonctions
 ****************************/

// Création de l'objet Contact
const createContact = () => {
    const contactInfos = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value,
    }
    return contactInfos
};

// création du tableau Products
const createProductIds = () => {
    const basket = getBasket();
    const productIds = basket.map(product => product.id);
    return productIds;
};

// creation de l'objet de commande incluant contact + products
const createOrder = () => {
    const contact = createContact();
    const products = createProductIds();
    if (products.length !== 0) {
        const order = { contact, products };
        return order;
    } else {
        alert("Veuillez sélectionner des produits à commander");
    }
};

// Envoi des données à l'API
const sendOrder = () => {
    const apiUrlPost = "http://localhost:3000/api/products/order";
    const order = createOrder();
    fetch(apiUrlPost, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
        .then((response) => response.json()
            .then((data) => {
                localStorage.clear();
                window.location.href = `./confirmation.html?id=${data.orderId}`;
            }))
        .catch((error) => {
            console.error('Erreur fetch : ' + error);
            alert("Votre commande n'a PAS pu aboutir. Merci de vérifier votre commande et les données saisies.")
        })
};

/***************************************************************************************************/

// Soumission du formulaire après vérification de la validité des données saisies
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validFirstName(form.firstName) && validLastName(form.lastName) && validAddress(form.address)
        && validCity(form.city) && validEmail(form.email) && form.reportValidity()) {
        sendOrder();
    } else {
        alert("Votre commande n'a PAS pu aboutir. Merci de vérifier les données du formulaire.")
    }
});