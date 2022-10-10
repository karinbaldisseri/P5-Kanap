const params = new URLSearchParams(window.location.search);

//  Récupération de l'Id de commande (orderId) depuis l'URL
if (params.has('id')) {
    orderId = params.get('id');
    // ajout du numéro de commande dans le HTML
    document.getElementById("orderId").textContent = orderId;
} else {
    console.log("Impossible de trouver le numéro de commande")
};