/********************************************************************
 * Affichage de tous les PRODUITS du catalogue (présents dans l'API)
 ********************************************************************/
/****************************
 * Déclaration des FONCTIONS
 ****************************/

// Récupérer les données de tous les produits depuis l'API
const getProducts = async () => {
    const apiUrl = "http://localhost:3000/api/products";
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
    
// Création de la carte produit 
const createProduct = (product) => {
    const itemsSection = document.getElementById("items");
    itemsSection.innerHTML += 
        `<a href="./product.html?id=${product._id}"> 
            <article>
                <img src="${product.imageUrl}" alt="${product.altTxt}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>`
};

// Affichage de tous les produits
const displayProducts = async () => {
    const products = await getProducts();
    for (let product of products) {
        createProduct(product)
    }
};

/********************************************************************************/

displayProducts();
  