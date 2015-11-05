var sum = 0;
var niz = [];
var brojac = 0;

var url = "http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json";
var urlCategories = "http://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json";
var urlEmployees = "http://services.odata.org/V3/Northwind/Northwind.svc/Employees?$format=json";

$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
});

 $("#login-button").click(function(event){
		 event.preventDefault();
	 
	 $('form').fadeOut(500);
	 $('.wrapper').addClass('form-success');
});

var nizSlika = [{
    id: 1, path: "images/prva.jpg"},
    {id: 2, path: "images/druga.jpg"},
    {id: 3, path: "images/treca.jpg"},
    {id: 4, path: "images/cetvrta.jpg"},
    {id: 5, path: "images/peta.jpg"},
    {id: 6, path: "images/sesta.jpg"},
    {id: 7, path: "images/sedma.jpg"}];


if (sum != 0) {
    document.getElementById("demo").innerHTML = "<h3>Ukupna suma je "+sum+"</h3>";
  }

  	var products = getServiceData(url).value; //Proizvodi
    var jsonObj = getServiceData(urlCategories).value; //Kategorije
    var employees = getServiceData(urlEmployees).value; //Zaposleni

$(document).ready(function(){
  loadProducts();
});


function loadProducts() {
var pretraga = document.getElementById("pretraga").value;
var selektKategorija = document.getElementById("categoryNavMenu").value;

   clearAllProducts();

   for(var product in products){
   			var idSlike = izaberiIdSlike();
    		var putanjaSlike = nadjiSliku(idSlike);
    		var idKategorije = products[product].CategoryID;
    		var imeKategorije = nadjiKategoriju(idKategorije, jsonObj);

    		if (selektKategorija == "" && pretraga == "") {
    			
    			dodajProizvod(products[product].UnitPrice, putanjaSlike, products[product].ProductName, imeKategorije);
    		}

    		else if (selektKategorija == imeKategorije && pretraga == "") {
    			
    			dodajProizvod(products[product].UnitPrice, putanjaSlike, products[product].ProductName, imeKategorije);
    		}
	
    		else if (selektKategorija !== imeKategorije && pretraga !== "" ) {
    			
    			
    			if (products[product].ProductName.toUpperCase().indexOf(pretraga.toUpperCase()) >= 0 || imeKategorije.toLowerCase().indexOf(pretraga.toLowerCase()) >= 0) {
   					
   					dodajProizvod(products[product].UnitPrice, putanjaSlike, products[product].ProductName, imeKategorije);
   				}
    		}
   		}
		
   		if (document.getElementById("categoryNavMenu").options.length == 1) {
   			dodajKategorije(jsonObj);
   			dodajKategorijeNaFormu(jsonObj);
   		}
}

function logout() {
	sessionStorage.clear();
	window.location.href = "login_page.html";
}

function login() {
	if (checkLogin()) {
		window.location.href = "index.html";
		return true;
	}
	else {
		location.reload();
		return false;
	}
}

function checkLogin() {

	firstName = document.getElementById("firstname").value;
	lastName = document.getElementById("lastname").value;

	for (var empl in employees) {
		if (firstName == employees[empl].FirstName && lastName == employees[empl].LastName) {
			sessionStorage.setItem("lastname", employees[empl].LastName);
			return true;
		}
		else {
			location.reload();
			document.getElementById("news").innerHTML = "Pogresni podaci";
			return false;
		}	
		
	}

}

function clearAllProducts() {

	$("#grid").empty(); 
} 

function dodajKategorijeNaFormu(jsonObj) {
	var myDDL = document.getElementById("categoryForm");

    for (i = 0; i < jsonObj.length; i++) {

    var option = document.createElement("option");

    option.setAttribute("value", jsonObj[i].CategoryName);
	option.innerHTML = jsonObj[i].CategoryName;

    try {
        myDDL.appendChild(option);
    }
    catch (e) {
        alert(e);
    	}
	}
}

function dodajKategorije(jsonObj) {

	var myDDL = document.getElementById("categoryNavMenu");

    for (i = 0; i < jsonObj.length; i++) {

    var option = document.createElement("option");

    option.setAttribute("value", jsonObj[i].CategoryName);
	option.innerHTML = jsonObj[i].CategoryName;

    try {
        myDDL.appendChild(option);
    }
    catch (e) {
        alert(e);
    }
}

}

function izaberiIdSlike() { //bira random id
    var max = 7;
    var min = 1;
    var z = Math.round(Math.random() * (max-min)) + min;
    return z;
}
 
function nadjiSliku(id) { //nalazimo putanju za taj id
    for (var slika in nizSlika) {
        if (nizSlika[slika].id == id) {
            return nizSlika[slika].path; //Pronalazi putanju bas za tu sliku
        }
    }
}

function nadjiKategoriju(id, jsonObj) { //nalazimo putanju za taj id
    for (var kat in jsonObj) {
        if (jsonObj[kat].CategoryID == id) {
            return jsonObj[kat].CategoryName; //Pronalazi putanju bas za tu sliku
        }
    }
}




function getServiceData(url,username, password) {

    try {
  var result;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    result = JSON.parse(xmlhttp.response);
                }
                else {
                    return false;
                }
            }
        }
        xmlhttp.open("GET", url, false, username, password);
        xmlhttp.send();
    return result;
    }
    catch (err) {       
        return err;
    }
}

function dodaj(x) {
	
	var a = x.id;  
	var b = "cena"+a;
	var c = "kolicina"+a;
	var cena = document.getElementById(b).outerText;
	var cena = Number(cena);
	var kolicina = document.getElementById(c).valueAsNumber;

	if (kolicina <=0) {
		alert("Unesite pozitivan broj");
		document.getElementById(c).value = "1";
		return false;
	}

	else {
		//instanca konstruktora product (a je id (npr. P3), kolicina i cena (promenljive))
	var product1 = new productConstruct(a, kolicina, cena); 
	insertProduct(product1);
	sum = sum + (kolicina*Number(cena));
	
	document.getElementById("demo").innerHTML = "<h3>Ukupna suma je "+sum+"</h3>";
	
	if (kolicina != 1) {
		document.getElementById(c).value = "1";
	}

	}
}

//konstruktor (konstruise elemente koji idu u niz)
function productConstruct(id, kolicina, cena) {
	this.id = id;
	this.kolicina = kolicina;
	this.cena = cena;
}

function insertProduct(product1) {
	for (var i in niz) {
		//ako element u nizu ima isti id kao id novog elementa koji unosimo
		if (niz[i].id == product1.id) {
			//njegovu kolicinu uvecavamo za klicinu unetog proizvoda 
			niz[i].kolicina += product1.kolicina;
			//sve je u redu, mozes da izadjes iz funkcije
			return true;
		}
	}
	//Ukoliko ga nema u nizu ubaciti ga sa sledecim property-ma
	niz.push({
		id: product1.id,
		kolicina: product1.kolicina,
		cena: product1.cena
	});
}

function dodajProizvodSaForme() {

	var imenaMeseci = ["Januar", "Februar", "Mart","April", "Maj", "Jun", "Juli","Avgust", "Septembar", "Oktobar","Novembar", "Decembar"];
	var datum = new Date();
	var dan = datum.getDate();
	var mesecIndex = datum.getMonth();
	var godina = datum.getFullYear();
	var brojac = document.getElementsByClassName("broj").length; //brojac proizvoda
	brojac++;

	var putanjaSlike = document.getElementById("putanjaV1").value;
	var nazivProizvoda = document.getElementById("nazivProizvoda").value;
	var opis = document.getElementById("opisV1").value;
	var cena = document.getElementById("cenaV1").valueAsNumber;
	var nazivKategorije = document.getElementById("categoryForm").value;
	
	if (putanjaSlike.indexOf("images") < 0) {
		alert ("Greška. Morate kucati images/slika.jpg");
		return false;
	}
	
	if (cena != "1" || putanja != "" || nazivProizvoda != "" || opis != "") {
		document.getElementById("putanjaV1").value = "";
		document.getElementById("nazivProizvoda").value = "";
		document.getElementById("opisV1").value = "";
		document.getElementById("cenaV1").value = "1";
	}

	var row = document.getElementById("grid");

	
	var col1 = document.createElement("div");
	col1.setAttribute("class", "col-xs-6 col-md-3");
	var client = document.createElement("div");
	client.setAttribute("class", "cliente");
	
	
	var img = document.createElement("img");
	img.setAttribute("src", putanjaSlike);
	img.setAttribute("width", "150");
	img.setAttribute("height", "150");
	img.setAttribute("class", "img-thumbnail");
	
	h6Opis = document.createElement("H6");
	h6Opis.innerHTML = opis.toUpperCase();

	var naziv = document.createElement("H5");
	naziv.innerHTML = "<br><br> Naziv: <b>" + nazivProizvoda.toUpperCase() + "</b>";
	naziv.innerHTML +="<br>Kategorija: <b>" + nazivKategorije + "</b>";
	naziv.innerHTML += "<br> <br>  Datum postavljanja:";
	naziv.innerHTML += "<br> <b>" + dan + '. ' + imenaMeseci[mesecIndex] + ' ' + godina + ". god.</b>";
	naziv.innerHTML += "<br><br> Količina: ";

	var inputKolicina = document.createElement("input");
	inputKolicina.setAttribute("type", "number");
	inputKolicina.setAttribute("value", "1");
	inputKolicina.setAttribute("id", "kolicinaP"+brojac);

	h4Cena = document.createElement("H4");
	h4Cena.setAttribute("id", "cenaP"+brojac);
	h4Cena.setAttribute("class", "broj");  
	
	h4Cena.innerHTML = "<b>" + Math.floor(cena) + "</b>";
	
	var buttonDodaj = document.createElement("button");
	buttonDodaj.setAttribute("class", "btn btn-primary");
	buttonDodaj.setAttribute("id", "P"+brojac); 
	buttonDodaj.setAttribute("onclick", "dodaj(this)");
	buttonDodaj.innerHTML = "Dodaj";
	
	var buttonOduzmi = document.createElement("button");
	buttonOduzmi.setAttribute("class", "btn btn-danger");
	buttonOduzmi.setAttribute("id", "P"+brojac); 
	buttonOduzmi.setAttribute("onclick", "ukloni(this)");
	buttonOduzmi.innerHTML = "Ukloni";	

	client.appendChild(img);
	client.appendChild(h6Opis);
	client.appendChild(naziv);
	client.appendChild(inputKolicina);
	client.appendChild(h4Cena);
	client.appendChild(buttonDodaj);
	client.appendChild(buttonOduzmi);
	col1.appendChild(client);
	row.appendChild(col1);
}

function getData(url, filter) {

} 


function dodajProizvod(cena, putanjaSlike, nazivProizvoda, nazivKategorije) {

	
  //var cntProduct = document.getElementsByClassName('priceTag').length;
  var numberOfProducts = document.getElementsByClassName('broj').length;

  if(numberOfProducts == undefined || numberOfProducts == 0)  {
    brojac = brojac;
  }
  else {
    brojac = numberOfProducts;
  }


var imenaMeseci = ["Januar", "Februar", "Mart","April", "Maj", "Jun", "Juli","Avgust", "Septembar", "Oktobar","Novembar", "Decembar"];

var datum = new Date();
var dan = datum.getDate();
var mesecIndex = datum.getMonth();
var godina = datum.getFullYear();


	//var brojac = document.getElementsByClassName("broj").length; //brojac proizvoda
	//brojac++;

	var row = document.getElementById("grid");

	
	var col1 = document.createElement("div");
	col1.setAttribute("class", "col-xs-6 col-md-3");
	col1.setAttribute("id", "proizvodi");
	var client = document.createElement("div");
	client.setAttribute("class", "cliente");
	
	
	var img = document.createElement("img");
	img.setAttribute("src", putanjaSlike);
	img.setAttribute("width", "150");
	img.setAttribute("height", "150");
	img.setAttribute("class", "img-thumbnail");
	
	h6Opis = document.createElement("H6");
	h6Opis.innerHTML = "OPIS PROIZVODA";

	var naziv = document.createElement("H5");
	naziv.innerHTML = "<br><br> Naziv: <b>" + nazivProizvoda.toUpperCase() + "</b>";
	naziv.innerHTML +="<br>Kategorija: <b>" + nazivKategorije + "</b>";
	naziv.innerHTML += "<br> <br>  Datum postavljanja:";
	naziv.innerHTML += "<br> <b>" + dan + '. ' + imenaMeseci[mesecIndex] + ' ' + godina + ". god.</b>";
	naziv.innerHTML += "<br><br> Količina: ";

	var inputKolicina = document.createElement("input");
	inputKolicina.setAttribute("type", "number");
	inputKolicina.setAttribute("value", "1");
	inputKolicina.setAttribute("id", "kolicinaP"+brojac);

	h4Cena = document.createElement("H4");
	h4Cena.setAttribute("id", "cenaP"+brojac);
	h4Cena.setAttribute("class", "broj");  
	
	h4Cena.innerHTML = "<b>" + Math.floor(cena) + "</b>";
	
	var buttonDodaj = document.createElement("button");
	buttonDodaj.setAttribute("class", "btn btn-primary");
	buttonDodaj.setAttribute("id", "P"+brojac); 
	buttonDodaj.setAttribute("onclick", "dodaj(this)");
	buttonDodaj.innerHTML = "Dodaj";
	
	var buttonOduzmi = document.createElement("button");
	buttonOduzmi.setAttribute("class", "btn btn-danger");
	buttonOduzmi.setAttribute("id", "P"+brojac); 
	buttonOduzmi.setAttribute("onclick", "ukloni(this)");
	buttonOduzmi.innerHTML = "Ukloni";	

	client.appendChild(img);
	client.appendChild(h6Opis);
	client.appendChild(naziv);
	client.appendChild(inputKolicina);
	client.appendChild(h4Cena);
	client.appendChild(buttonDodaj);
	client.appendChild(buttonOduzmi);
	col1.appendChild(client);
	row.appendChild(col1);
}

function ukloni(x) {
	var a = x.id; //npr. P3
	var b = "cena"+a;
	var c = "kolicina"+a;
	var cena = document.getElementById(b).outerText;
	var kolicina = document.getElementById(c).valueAsNumber;

	if (kolicina <=0) { //Ukolio je uneta kolicina <=0
		alert("Unesite pozitivan broj");
		document.getElementById(c).value = "1";
		return false;
	}

	else {
	
	var product1 = new productConstruct(a, kolicina, cena); //Instanca konstruktora product
	
	removeProduct(product1);
	
	document.getElementById("demo").innerHTML = "<h3>Ukupna suma je "+sum+"</h3>";
	
	if (kolicina != 1) {
		document.getElementById(c).value = "1";
	}
	}
}

function removeProduct(product1) {

	var a = product1.id;
	var b = "cena"+a;
	var c = "kolicina"+a;
	var cena = document.getElementById(b).outerText;
	var kolicina = document.getElementById(c).valueAsNumber;
	for (var i in niz) {

		if (niz[i].id == product1.id) {
			if (niz[i].kolicina >= product1.kolicina) {
				niz[i].kolicina -= product1.kolicina;
				sum = sum - (kolicina*Number(cena));
				if (niz[i].kolicina == 0) { //Ako je kolicina jednaka 0 prilikom uklanjanja elemenata
					niz.splice(i, 1); //Izbrisi element iz
				}
			}
			else {
				for (var j in niz) {
					if (niz[j].id == product1.id) {
						alert("Uneta kolicina je veca od postojece. Vas broj elementa u korpi je: " + niz[j].kolicina);
						return false;
					}
					
				}
			}
		}
		
	}
	//Uspesno uradjeno, izadji iz funkcije
	return true;
}