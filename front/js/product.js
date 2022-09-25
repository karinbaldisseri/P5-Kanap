/********************************************************************************
 * Récupérer et afficher les DONNÉES du PRODUIT sur la page Product
 ********************************************************************************/
/*************************************
 * Déclaration des variables globales 
 *************************************/

const params = new URLSearchParams(window.location.search);
let productId;
let apiUrl;
const colorSelect = document.querySelector("#colors");

/****************************
 * Déclaration des fonctions
 ****************************/

// Création de l'image du produit
function showImage(data) {
    const itemImage = document.createElement("img");
    itemImage.src = data.imageUrl;
    itemImage.setAttribute("alt", `${data.altTxt}`);
    document.querySelector(".item__img").appendChild(itemImage);
};

// Lier les données des produits aux éléments et sélecteurs respectifs
function showInfo(data) {
    document.title = data.name;
    document.querySelector("#title").textContent = data.name;
    document.querySelector("#price").textContent = data.price;
    document.querySelector("#description").textContent = data.description
}

// Créer les options de couleur à la selection
function colorOptions(data) {
    data.colors.forEach((color) => {
        const option = new Option(`${color}`, `${color}`.toLowerCase());
        colorSelect.appendChild(option)
    })
};

// Récupérer les données du produit depuis l'API
async function getProduct() {
    await fetch(apiUrl)
        .then((response) => response.json()
            .then((data) => {
                showImage(data);
                showInfo(data);
                colorOptions(data)
            })
        )
        .catch((error) => console.log('Erreur : ' + error))
};

/******************************************************************/

//  Paramétrage de l'URL de l'API d'un produit (apès vérification) {= displayProduct()}
if (params.has('id')) {
    productId = params.get('id');
    apiUrl = `http://localhost:3000/api/products/${productId}`;
    getProduct();
} else {
    console.log("Impossible de trouver l'Id du produit")
};


/********************************************************************************
 * Gestion du PANIER dans LOCALSTORAGE
 ********************************************************************************/
/*************************************
 * Déclaration des variables globales 
 *************************************/

let product;

/****************************
 * Déclaration des fonctions
 ****************************/

// Mettre à jour le panier dans LS
function updateBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

// Récupérer le panier depuis LS
function getBasket() {
    basket = JSON.parse(localStorage.getItem("basket"));
    return basket;
}

// Vérifier validité des input couleur et quantité
function checkValidity() {
    let quantity = document.querySelector("#quantity").value;
    if (colorSelect.value == "") {
        alert("Veuillez choisir une couleur dans la liste déroulante")
        return false;
    } else if (quantity == null || quantity <= 0 || quantity > 100) {
        alert("Veuillez choisir une quantité entre 1 et 100")
        return false;
    }
}

// Ajouter un produit au panier
function addBasket(product) {
    let basket = getBasket();
    product = {
            id: productId,
            color: colorSelect.value,
            quantity: parseInt(quantity.value)
        };
    if (basket == null) {
        basket = [];
        basket.push(product);
    } else {
        let foundProduct = basket.find(p => p.id == product.id && p.color == product.color);
        if (foundProduct != undefined) {
            foundProduct.quantity += product.quantity;
        } else {
            basket.push(product);
        }
    }
    updateBasket(basket);
}

// message de confirmation : aller au panier
function goToBasketConfirm() {
    if (window.confirm("Votre produit a bien été ajouté au panier ! Pour consulter votre panier -> cliquez OK. Pour retourner au catalogue des produits -> cliquez ANNULER.")) {
        window.location.href = "cart.html"
    } else {
        window.location.href = "index.html"
    }
}

/******************************************************************/


// Actions au click du bouton "Commander"
const button = document.querySelector("#addToCart");
button.addEventListener("click", (e) => {
    if (checkValidity() == false) return;
    addBasket();
    goToBasketConfirm();
})












