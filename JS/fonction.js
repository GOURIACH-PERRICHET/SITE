function loadHeader() {
    fetch('../html/nav_barre.html')
    .then(res => res.blob())
    .then(data => data.text())
    .then(html => {
      addElement(html,'header');
    })
}

function loadFooter() {
    fetch('../html/bas_de_page.html')
    .then(res => res.blob())
    .then(data => data.text())
    .then(html => {
        template = html;
        //console.log(template);
        addElement(template,'footer');
    })
}

function addElement(html, type) {
    container = document.getElementsByTagName(String(type))[0];
    //console.log('before', container);
    container.innerHTML = html.replace(/{{page}}/g, container.innerHTML);
    //console.log('after', container);
    console.log(`Template: ${type} added`);
}

//---------------------------------------------


template = undefined;
loadFooter();
loadHeader();


    $(function () {
        $(window).scroll(function () { //Fonction appelée quand on descend la page
            if ($(this).scrollTop() > 100 ) {  // Quand on est à 100p ixels du haut de page,
                $('#scrollUp').css('right','10px'); // Replace à 10 pixels de la droite l'image
            } else { 
                $('#scrollUp').removeAttr( 'style' ); // Enlève les attributs CSS affectés par javascript
            }
        });
    });

    let data_base = {}; // creation de la variable base de donne
    fetch('/JS/database.json') // on recupere la base de donnee (copier coller du cours)
    .then(function(response) {
        return response.json();
    })
    
    .then(function(json) {
        data_base = json // on affecte la base de donne a la variable json
        var template=document.getElementById("produit"); // on lui indique sur quel template dans notre html on va travailler
        for (let i=1; i <5 ; i++) { // on a 4 elements ds notre base de donnee
            let clone = document.importNode(template.content, true);  // copier coller du cours
            newContent = clone.firstElementChild.innerHTML // copier coller du cours
                .replace(/{{id-du-produit}}/g,i) // on remplace idée du produit qui est ds html par son id, c'est pr le lien vers la page de personalisation
 // j'ai mis un titre à nos accesoire mais on pourra l'enlever ou mettre un commentaire ou le prix
            clone.firstElementChild.innerHTML = newContent // copier coller du cours
            document.body.appendChild(clone); // copier coller du cours
        
                  
        }
    });