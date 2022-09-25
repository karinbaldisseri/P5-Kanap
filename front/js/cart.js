/********************************************************************************
 * Affichage du PANIER
 ********************************************************************************/
/*************************************
 * Déclaration des variables globales 
 *************************************/

const cartItems = document.getElementById("cart__items");

/****************************
 * Déclaration des fonctions
 ****************************/

// si panier vide : ajouter "est vide" dans h1 
function estVide() {
    document.querySelector("h1").innerText += " est vide !"
    let cartSection = document.querySelector("section.cart");
    cartSection.style.display = "none";
    let cartContent = document.getElementById("cartAndFormContainer");
    let cartAncre = document.createElement("a");
    cartAncre.style = "color:white; text-align:center; display:block"
    cartAncre.setAttribute("href", "index.html");
    cartAncre.textContent = "Retourner au catalogue des produits";
    cartContent.insertBefore(cartAncre,cartSection);
}


//Création de l'<article> PRODUIT
function createProduct(product, data) {
    cartItems.innerHTML +=
        `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                    <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                 <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${data.name}</h2>
                        <p>${product.color}</p>
                        <p>${data.price} €</p>
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
}

// Récupérer les données des produits depuis l'API
const getProducts = async () => {
    try {
        const response = await fetch(apiUrl)
        console.log(apiUrl)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Retour du serveur : erreur', response.status)
        }
    } catch (e) {
        alert(e)
    }
}

// Affichage des PRODUITS du Panier
async function displayBasket() {
    let basket = JSON.parse(localStorage.getItem("basket"));
    console.log(basket);
    if (basket == null) {
        estVide();
    } else {
        for (let product of basket) {
            apiUrl = `http://localhost:3000/api/products/${product.id}`;
            const data = await getProducts();
            createProduct(product, data);
        }
    }
}

/******************************************************************/

displayBasket();




// Récupérer les données du produit depuis l'API
/*async function getProduct(apiUrl) {
    console.log(apiUrl);
    await fetch(apiUrl)
        .then((response) => response.json()
            .then((data) => {
                return data;
                //addProduct(data);
            })
        )
        .catch((error) => console.log('Erreur : ' + error))
};*/



