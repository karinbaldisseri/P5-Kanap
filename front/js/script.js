/*******************************************************
 * Déclaration et initialisation des VARIABLES globales 
 *******************************************************/

const itemsSection = document.getElementById("items");
const apiUrl = "http://localhost:3000/api/products";
let productId;

/****************************
 * Déclaration des FONCTIONS
 ****************************/

// Récupérer les données des produits depuis l'API
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

// Rajouter Id du produit (paramètre) à URL
function setParamId(product) {
    const params = new URLSearchParams(window.location.search);
    params.set('id', `${product._id}`);
    productId = params.toString();
};
    
// Création de la carte produit
function createProduct(product) {
    setParamId(product);
    itemsSection.innerHTML += 
    `<a href="./product.html?${productId}"> 
        <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>
    </a>`
};

// Affichage de tous les produits
async function displayProducts() {
    const products = await getProducts();
    for (let product of products) {
        createProduct(product)
    }
};

/********************************************************************************/

displayProducts();
  