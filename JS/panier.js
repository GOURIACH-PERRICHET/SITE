function recupadress() {
    adress = document.getElementById("adresse").value;
    console.log("1")
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(adress)}.json?access_token=sk.eyJ1IjoicGVycmljaGV0dCIsImEiOiJja3Ywa3pnaHEzMWVwMnZsbmxnOGJzcThwIn0.C3FZETBub_1tqd_p7SkCqg`)
        .then(res => res.json())
        .then(data => {
            coord = data.features[0].center;
            long=coord[0];
            lat=coord[1];
            fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${encodeURIComponent(long)}%2C${encodeURIComponent(lat)}%3B4.8593999%2C45.7611438?alternatives=true&geometries=geojson&steps=true&access_token=sk.eyJ1IjoicGVycmljaGV0dCIsImEiOiJja3Ywa3pnaHEzMWVwMnZsbmxnOGJzcThwIn0.C3FZETBub_1tqd_p7SkCqg`)
                .then(res2 => res2.json())
                .then(data2 => {
                    dist = data2.routes[0].distance;
                    calculfdl(dist)
        });
    });
    
};

function calculfdl(dist) {
    fdl = 0;
    if (dist>20000) {
        fdl = 5 + 0.07*dist/1000
        fdl = Math.round(fdl)
    }
    document.getElementById("somme_livraison").innerHTML=fdl + "€" ;
}

function livraisonexpress(date){
    fd2 = 0;
    const d = new Date();
    const hnow = d.getHours();
    const hlivr= date.getHours();
    const duree= hlivr*60 - hnow*60;
    if (duree<=(72*60)) {
        fd2= 8;
    }
    document.getElementById("livraison_express").innerHTML=fd2 + "€" ;

}


function remise() {
    
}

function getCartItems() {
    cart_list = JSON.parse(localStorage.getItem('cart_list'));
    return cart_list
}


function setCartItems(cart_list) {
    localStorage.setItem('cart_list', JSON.stringify(cart_list));
}


function over10Items(item_price, number) {
    let multiplier = (number >= 10) ? 0.90 : 1;
    let price = item_price * number * multiplier;

    price = roundNumber(price,2);

    let decimal_part = roundNumber(price - Math.round(price), 2);
    if (decimal_part != 0) {
        let decimal_digits = String(Math.abs(decimal_part)).length - 2;
        if (decimal_digits < 2) {
            price = price + '0'.repeat(2 - decimal_digits);
        }
    }
    else {
        price += '.00';
    }
    return price
}

function roundNumber(number, digits) {
    var multiple = Math.pow(10, digits);
    var rndedNum = Math.round(number * multiple) / multiple;
    return rndedNum;
}


function loadProducts() {
    fetch('../js/items.json')
    .then((res) => {return res.json()})
    .then((data) => {
        Items = data;
        addItems()
        //console.log(data);
    });
}

function addItems() {
    let template = document.getElementById('cart_item_template').innerHTML;
    let container = document.getElementById('cart-content');
    container.innerHTML = "";
    cart_list = getCartItems();
    //console.log(cart_list)
    if (Object.keys(cart_list).length === 0) {
        container.innerHTML = " Vous n'avez rien dans votre panier ";
        return
    }
    let prixtot = 0;
    let new_price = document.getElementById('total_price');;
    let item;
    let new_item;
    for (product in cart_list) {

        item = JSON.parse(product);
        new_item = template
        .replace(/{{item-id}}/g, cart_list[product].id)
        .replace(/{{image_src}}/g, '../resources/products/' + item.image_src)
        .replace(/{{name}}/g, item.name)
        .replace(/{{quantity}}/g, cart_list[product].number)
        .replace(/{{price}}/g, over10Items(item.price, cart_list[product].number));

        prixtot = prixtot + Number(over10Items(item.price, cart_list[product].number));
        
        container.innerHTML = container.innerHTML + new_item;
    }
    distance=(geocod());
    if (distance<20){
        new_price.innerHTML = "Pix total : " + prixtot + "€";
    }
    else{
        new_price.innerHTML = "Pix total : " + Number(prixtot +5+0.07*distance) + "€";
    }
    
}

function addOne(id) {
    const item_number = document.querySelector(`#item-${id} #item-number`);
    cart_list[getItemFromID(id)].number += 1;
    item_number.innerHTML = cart_list[getItemFromID(id)].number;
    setCartItems(cart_list);
    addItems();
}

function removeOne(id) {
    const item_number_display = document.querySelector(`#item-${id} #item-number`);
    let item_number = cart_list[getItemFromID(id)].number;
    if (item_number > 1) {
        cart_list[getItemFromID(id)].number = item_number - 1;
        item_number_display.innerHTML = cart_list[getItemFromID(id)].number;
    }
    else if (item_number === 1){
        removeItem(id);
    }
    setCartItems(cart_list);
    addItems();
}

function removeItem(id) {
    let item = document.getElementById(`item-${id}`);
    item.parentNode.removeChild(item);
    delete cart_list[getItemFromID(id)];
    setCartItems(cart_list);
    addItems();
}

function getItemFromID(id) {
    for (let product in cart_list) {
        if (id === Number(cart_list[product].id)) {
            return product
        }
    }
    return undefined
}

async function geocod() {
    const ville = document.getElementById("adresse").value;
    const query = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${ville}.json?access_token=pk.eyJ1Ijoic2ViMTIwMSIsImEiOiJja3ZjMWJheWQwaGI5MnVxbjY0NHdqMGNwIn0.cjn8lNKqfwXGemuNv160uQ`,
        { method: 'GET' })
    const json = await query.json()  //json.features[0].center
    const x = json.features[0].center[0];
    const y = json.features[0].center[1];
    const query2 = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/45.761071,4.853570;${y},${x}?steps=true&geometries=geojson&access_token=pk.eyJ1Ijoic2ViMTIwMSIsImEiOiJja3YxejV3eXMxb2lqMnVxdzJ2bnlyanZxIn0.ySy7y7Sd28J_2bmKGVt3CQ`,
        { method: 'GET' })
    const json2 = await query2.json(); //pour avoir la distance : json2.routes[0].distance
    let d=json2.routes[0].distance;
    d = Math.round(d)/1000;
    return(d);
}
//---------------------------------
console.log('Loading cart...')
loadProducts();