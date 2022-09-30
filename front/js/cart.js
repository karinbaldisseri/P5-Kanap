/********************************************************************************
 * Affichage du PANIER
 ********************************************************************************/
/*************************************
 * Déclaration des variables globales 
 *************************************/

let basket = JSON.parse(localStorage.getItem("basket"));
let totalPrice = [];
let apiUrl;
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
    let totalAmount = totalPrice.reduce((acc, value) => acc + value, 0);
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
}

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


/********************************************************************************
 * VALIDATION DU FORMULAIRE
 ********************************************************************************/

const form = document.querySelector(".cart__order__form");

// Vérification du PRÉNOM au changement de l'input(RegExp)
form.firstName.addEventListener('change', function() {
    validFirstName(this);
});
const validFirstName = (inputFirstName) => {
    let firstNameRegExp = new RegExp("^[a-zçéèêëàâîïôùû' -]{2,25}$", 'gi'); 
    // ou setatrribut pattern ?
    let message = inputFirstName.nextElementSibling;
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
    validLastName(this);
});
const validLastName = (inputLastName) => {
    let lastNameRegExp = new RegExp("^[a-zçéèêëàâîïôùû' -]{2,25}$", 'gi');
    let message = inputLastName.nextElementSibling;
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
    let addressRegExp = new RegExp(`^[a-z0-9çéèêëàâîïôùû',"() -]{5,75}$`, 'gi');
    let message = inputAddress.nextElementSibling;
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
    let cityRegExp = new RegExp(`^[a-z0-9çéèêëàâîïôùû',"() -]{5,50}$`, 'gi');
    let message = inputCity.nextElementSibling;
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
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
    let message = inputEmail.nextElementSibling;
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

// Soumission du formulaire après vérification de la validité des données saisies
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validFirstName(form.firstName) && validLastName(form.lastName) && validAddress(form.address)
        && validCity(form.city) && validEmail(form.email) && form.reportValidity()) {
        sendOrder();
        console.log("envoyé");
    } else {
        alert("Votre commande n'a pas pu aboutir. Merci de vérifier les données du formulaire.")
    }
});

/********************************************************************************
 * CRÉATION et vérification des DONNÉES pour commande
 ********************************************************************************/

// Création de l'objet Contact
const createContact = () => {
    const contactInfos = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value,
    };
    console.log(contactInfos);
    return contactInfos
}

// création du tableau Products
const createProductIdsArray = () => {
    const productIds = basket.map(product => product.id);
    return productIds;
}

// creation de l'objet de commande incluant contact + products
const createOrder = () => {
    const contact = createContact();
    const products = createProductIdsArray();
    console.log(products);
    if (products.length !== 0) {
        const order = { contact, products };
        console.log(order);
        return order;
    } else {
        alert("Veuillez sélectionner des produits à commander");
    }
}

// Envoi de données à l'API
//const apiUrlPost = "http://localhost:3000/api/products/order";
const sendOrder = () => {
    let order = createOrder();
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            //'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
        .then((response) => response.json()
            .then((data) => {
                console.log(data);
                localStorage.clear();
                window.location.href = `./confirmation.html?id=${data.orderId}`;
            }))
        .catch((error) => {
            console.log('Erreur fetch : ' + error);
            alert("Votre commande n'a PAS pu aboutir. Merci de vérifier votre commande et les données saisies.")
        })
}

