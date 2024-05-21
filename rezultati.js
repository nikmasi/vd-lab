function citanjeRezultata(){
    let tekstKorisnici = localStorage.getItem("korisnici");
    if (tekstKorisnici == null) {
        localStorage.setItem("korisnici", JSON.stringify(korisnici));
    } else {
        korisnici = JSON.parse(tekstKorisnici);
    }
    
    korisnici.sort((a, b) => b.poeni - a.poeni);
    console.log(korisnici)

    let tbody = $("#tbody");

    korisnici.slice(0, 5).forEach((korisnik, index) => {
       let row = $('<tr><td>' + (index + 1) + '</td><td>' + korisnik.korisnickoIme + '</td><td>' + korisnik.poeni + '</td></tr>');
       tbody.append(row);
    })


    let trenutniKor = localStorage.getItem("trenutniKorisnik");
    if (trenutniKor == null) {
        localStorage.setItem("trenutniKorisnik", JSON.stringify(trenutniKor));
    } else {
        trenutniKorisnik = JSON.parse(trenutniKor);
    }

    let tbodyIgrac=$("#tbodyIgrac");
    let row=$('<tr><td>' + trenutniKorisnik[0].korisnickoIme + '</td><td>' + trenutniKorisnik[0].poeni +'</td></tr>');
    console.log(trenutniKor)
    console.log(trenutniKorisnik)
    tbodyIgrac.append(row)
}