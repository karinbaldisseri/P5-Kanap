const itemsSection = document.getElementById("items");

// Récupérer les données des produits depuis l'API
const getProducts = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/products')
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Retour du serveur : erreur', response.status)
        }
    } catch(e) {
        alert(e)
    }
}

// Création de la carte produit
function showProduct(product){
    itemsSection.innerHTML += 
    `<a href="product.html?id=${product._id}"> 
        <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>
    </a>`
}

// Affichage de tous les produits
async function displayProducts() {
    const products = await getProducts();
    for (let product of products) {
        showProduct(product)
    }
}

displayProducts();
  