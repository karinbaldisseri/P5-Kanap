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

// Création de l'élément : image du produit
const showImage = (data) => {
    const itemImage = document.createElement("img");
    itemImage.src = data.imageUrl;
    itemImage.setAttribute("alt", `${data.altTxt}`);
    document.querySelector(".item__img").appendChild(itemImage);
};

// Lier les données des produits aux éléments et sélecteurs respectifs
const showInfo = (data) => {
    document.title = data.name;
    document.querySelector("#title").textContent = data.name;
    document.querySelector("#price").textContent = data.price;
    document.querySelector("#description").textContent = data.description
}

// Créer les options de couleur à la selection
const colorOptions = (data) => {
    data.colors.forEach((color) => {
        const option = new Option(`${color}`, `${color}`);
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
const updateBasket = (basket) => {
    localStorage.setItem("basket", JSON.stringify(basket));
}

// Récupérer le panier depuis LS
const getBasket = () => {
    basket = JSON.parse(localStorage.getItem("basket"));
    return basket;
}

// Vérifier validité des input couleur et quantité
const checkValidity = (data) => {
    let quantity = document.querySelector("#quantity").value;
    //let search = data.colors.find((x) => x.color !== colorSelect.value);
    if (colorSelect.value === "" /*|| colorSelect.value !== data.colors -> find ?*/) {
        alert("Veuillez choisir une couleur dans la liste déroulante")
        return false;
    } else if (quantity === null || quantity <= 0 || quantity > 100) {
        alert("Veuillez choisir une quantité entre 1 et 100")
        return false;
    }
}

// Ajouter un produit au panier ou augmenter la quantité si produit déjà présent 
const addBasket = (product) => {
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
        const foundProduct = basket.find(p => p.id == product.id && p.color == product.color);
        if (foundProduct != undefined) {
            foundProduct.quantity += product.quantity;
        } else {
            basket.push(product);
        }
    }
    updateBasket(basket);
}

// message de confirmation d'ajout au panier + aller au panier ou page d'accueil
const goToBasketConfirm = () => {
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












