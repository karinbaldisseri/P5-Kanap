/********************************************************************************
 * Récupérer et afficher les DONNÉES du PRODUIT sur la page Product
 ********************************************************************************/
/*************************************
 * Déclaration des variables globales 
 *************************************/

const params = new URLSearchParams(window.location.search);
let productId;
const colorSelect = document.querySelector("#colors");

/****************************
 * Déclaration des fonctions
 ****************************/

// Création de l'élément : image du produit
const createImage = (data) => {
    const itemImage = document.createElement("img");
    itemImage.src = data.imageUrl;
    itemImage.setAttribute("alt", `${data.altTxt}`);
    document.querySelector(".item__img").appendChild(itemImage);
};

// Lier les données du produit aux éléments respectifs
const showInfo = (data) => {
    document.title = data.name;
    document.querySelector("#title").textContent = data.name;
    document.querySelector("#price").textContent = data.price;
    document.querySelector("#description").textContent = data.description
};

// Créer les options de couleur à la selection
const createColorOptions = (data) => {
    data.colors.forEach((color) => {
        const option = new Option(`${color}`, `${color}`);
        colorSelect.appendChild(option)
    })
};

// Récupérer les données du produit depuis l'API
async function displayProduct(productId) {
    await fetch(`http://localhost:3000/api/products/${productId}`)
        .then((response) => response.json()
            .then((data) => {
                createImage(data);
                showInfo(data);
                createColorOptions(data)
            })
        )
        .catch((error) => console.error('Erreur : ' + error))
};

/******************************************************************/

//  Paramétrage de l'URL de l'API d'un produit grâce a son "id"
if (params.has('id')) {
    productId = params.get('id');
    displayProduct(productId);
} else {
    console.log("Impossible de trouver l'Id du produit")
};


/********************************************************************************
 * Gestion du PANIER dans LOCALSTORAGE + Choix de la quantité et couleur
 ********************************************************************************/
/****************************
 * Déclaration des fonctions
 ****************************/

// Mettre à jour le panier dans LS
const updateBasket = (basket) => {
    localStorage.setItem("basket", JSON.stringify(basket));
};

// Vérifier validité des input couleur et quantité
const checkValidity = () => {
    const quantity = document.querySelector("#quantity").value;
    if (colorSelect.value === "") {
        alert("Veuillez choisir une couleur dans la liste déroulante")
        return false;
    } else if (quantity === null || quantity <= 0 || quantity > 100) {
        alert("Veuillez choisir une quantité entre 1 et 100")
        return false;
    }
};

// Ajouter un produit au panier ou augmenter la quantité si produit déjà présent 
const addBasket = () => {
    const product = {
        id: productId,
        color: colorSelect.value,
        quantity: parseInt(quantity.value)
    }
    let basket = JSON.parse(localStorage.getItem("basket"));
    if (basket == null) {
        basket = [];
        basket.push(product);
    } else {
        const foundProduct = basket.find(p => p.id === product.id && p.color === product.color);
        if (foundProduct != undefined) {
            // Vérifier que la quantité ajoutée + quantité dans panier ne dépasse pas 100
            let newQuantity = foundProduct.quantity + product.quantity;
            if (newQuantity > 100) {
                alert("Attention : Ce produit se trouve déjà dans votre panier. La quantité totale ne pouvant pas excéder un maximum de 100 par produit, veuillez modifier la quantité à ajouter au panier.")
                return;
            } else {
                foundProduct.quantity += product.quantity;
            }
        } else {
            basket.push(product);
        }
    }
    updateBasket(basket);
    goToCartConfirm();
};

// message de confirmation d'ajout au panier + aller au panier ou page d'accueil
const goToCartConfirm = () => {
    if (window.confirm("Votre produit a bien été ajouté au panier ! Pour consulter votre panier -> cliquez OK. Pour retourner au catalogue des produits -> cliquez ANNULER.")) {
        window.location.href = "./cart.html"
    } else {
        window.location.href = "./index.html"
    }
};

/******************************************************************/

// Actions au click du bouton "Ajouter au panier"
const button = document.querySelector("#addToCart");
button.addEventListener("click", () => {
    if (checkValidity() === false) return;
    addBasket();
});












