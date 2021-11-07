function getItem(){
    const params = new URLSearchParams(window.location.search);
    let item = params.get("item");
    // console.log(typeof(item), item);
    return item;
}


function loadProducts() {
    fetch('../js/items.json')
    .then((res) => {return res.json()})
    .then((data) => {
        Items = data;
        showProducts();
        updatePrice(calculatePrice());
        //console.log(data);
    });
}

function showProducts() {
    let item = getItem()
    document.getElementById("item-name").innerHTML = 'Produit choisi: ' + Items[item].name;
}

function updateItem() {
    
    if (Items != undefined) {
        updatePrice(calculatePrice());
   }
    else {
        loadProducts();
    }
}

function getFormResults() {
    let fields = {};
    for (ele of document.getElementsByTagName('input')) {
        if (ele.id != 'reset' && ele.id != 'buy') {
            if (ele.type == 'radio') {
                if (ele.checked) {fields[ele.name] = ele;}
            }
            else {fields[ele.name] = ele;}
        }
    }
    //console.log(fields);
    return fields
}

function updatePrice(price) {
    document.getElementById("item-price").innerHTML = 'Prix : ' + price + "€";
}


function calculatePrice(unitary=false) {
    let item = getItem()
    let form = getFormResults();
    //console.log(form);

    let p=Items[item].price;

    switch (form['material'].id) {
        case 'ceramic':
            p=p+10;
            break;
        case 'plastic':
            p=p+5;
            break;
        case 'clay':
            p=p+15;
        }
    
    if (form["gift"].checked){
        p=p+3;
    }

    if (!unitary) {
        p=p * form["quantity"].value;

        if ((form["quantity"].value>10)){
            p=p-p/10;
        }
    }

    p = roundNumber(p,2);

    let decimal_part = roundNumber(p - Math.round(p), 2);
    if (decimal_part != 0) {
        let decimal_digits = String(Math.abs(decimal_part)).length - 2;
        if (decimal_digits < 2) {
            p = p + '0'.repeat(2 - decimal_digits);
        }
    }
    else {
        p += '.00';
    }

    //console.log(p, decimal_digits, String(roundNumber(p - Math.round(p), 2)))

    return p;
}

function roundNumber(number, digits) {
    var multiple = Math.pow(10, digits);
    var rndedNum = Math.round(number * multiple) / multiple;
    return rndedNum;
}

function addToCart() {
    let form = getFormResults();
    let price = calculatePrice(unitary=true)
    let item_id = getItem();
    let customization = {
        'name':Items[item_id].name,
        'price': price,
        'image_src': Items[item_id].image_src};
    let quantity = Number(form['quantity'].value);

    for (id in form) {
        let ele = form[id];
        //console.log(ele, id)

        if (ele.id == 'quantity') {continue}

        if (ele.type == 'radio') {
            customization[ele.name] = ele.id;
        }
        else if (ele.type == 'checkbox') {
            customization[ele.name] = ele.checked;
        }
        else {
            customization[ele.name] = ele.value;
        }
    }
    //console.log(customization);
    updateCart(customization, quantity);
    console.log(localStorage.getItem('cart_list'));

    window.location.replace("./cart.html");
}


// todo : refaire cookie cart: {^roduct}:{id:x, number:x} 





function updateCart(new_item, quantity) {
    new_item = JSON.stringify(new_item);

    let old_cookie = localStorage.getItem('cart_list');
    if (old_cookie != undefined) {
        let cart_list = JSON.parse(old_cookie);
        //console.log(cart_list);
        
        if (cart_list[new_item] === undefined) {
            cart_list[new_item] = {number:Number(quantity), id:getNextID()};
        }
        else {
            cart_list[new_item].number = Number(cart_list[new_item].number) + quantity;
        }
        let cookie = JSON.stringify(cart_list);
        localStorage.setItem('cart_list', cookie);
    }
    else {
        const new_cart = {};
        new_cart[new_item] = {number:Number(quantity), id:getNextID()};
        let cookie = JSON.stringify(new_cart);
        localStorage.setItem('cart_list', cookie);
    }
    
}

function getNextID() {
    let cart_cookie = localStorage.getItem('cart_list');

    if (cart_cookie != undefined) {
        const cart_list = JSON.parse(cart_cookie);
        let id_max = 0;
        for (let product of Object.values(cart_list)) {
            if (Number(product.id) > id_max) {
                id_max = Number(product.id);
            }
        }
        return id_max + 1;
    }
    else {
        return 0;
    }
}


// ----------------------------------------------------------------------------------------------

console.log('-=[Page loaded]=-');
loadProducts();

//---------------------------------------------------------------------------------------------

let data_base = {}; 
fetch('/JS/database.json')
.then(function(response) {
    return response.json();
})

.then(function(json) {
    data_base = json
    let produit_id = new URLSearchParams(window.location.search).get("id"); // pour savoir que quel images on a cliqué, chaque images est définit par un nombre
    id_image_change = document.getElementById("image_personnalisation"); // pont entre le js et le html, il contient tt la ligne ou il y a "images personalisation"
    console.log(data_base); // sert a vérifier si il trouve bien la base de donnees (visible ds l'onglet console de la page)
    let image = data_base[produit_id].couleur.bleu; // on stocke le lien de l'image (c'est l'image noir) dans la variable image
    console.log(image)
    id_image_change.setAttribute("src",image); // on lui demande de changer la valeur associée a src par image
    list=Object.keys(data_base[produit_id].couleur); // on recupere une liste avec les couleur liée à notre produit
    for (let i=1; i < list.length; i++){ // on commence à 1 car on a deja créer un bouton pour le noir dans le html et dans notre base de donnée list[0] est la couleur noir et on va jusqu'a la taille de list
      var test=document.getElementById("bleu") // on recupere la ligne ou on à on a l'idée noir c'est à dire la ligne du boutton dans le html
      test.insertAdjacentHTML('afterend','<button onclick="SwitchImage(\''+list[i]+'\')" >'+list[i]+'</button>') // on ajoute derriere la ligne (commande afterend) ou on a récupérer l'id au dessus la ligne <button ....> les antislah en bleu permettre de lui faire comprendre que on veut que il affiche des guillemets et les + permettent de mettre la valeur list[i] et non les caractère list[i]
  }
});



function SwitchImage(element){
  let produit_id = new URLSearchParams(window.location.search).get("id");
  let image=  data_base[produit_id].couleur[element]
  console.log( data_base[produit_id].couleur)
  id_image = document.getElementById("image_personnalisation"); 
  id_image_change.setAttribute("src",image)

}