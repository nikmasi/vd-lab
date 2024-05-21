let blokovi;
let boje;
let keys;
let vreme=500;

function dohvOsnovneElemente(){
    let canvas = document.getElementById('tetris');
    let score = document.getElementById("score");
    let ctx = canvas.getContext('2d');
    let linije=document.getElementById("linije")
    ctx.scale(30,30);
    return { canvas, score, linije,ctx};
}
function dohvOsnovneElementeNaredni(){
    let can2 = document.getElementById('naredni');
    let ctx2 = can2.getContext('2d');
    ctx2.scale(30,30);
    return { can2, ctx2 };
}

function postaviNivoLocalStorage(){
    let nivoPostavljen = localStorage.getItem("tezina");
    document.getElementById("nivoTezina").innerHTML="Nivo: "+nivoPostavljen;
    
    if (document.getElementById("nivoTezina").innerText=='Nivo: "lako"') {
        vreme=655;
    }else if(document.getElementById("nivoTezina").innerText=='Nivo: "srednje"'){
        vreme=555;
    }
    else if(document.getElementById("nivoTezina").innerText=='Nivo: "tesko"'){
        vreme=455;
    }
}

blokovi = [
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    [
        [1,0,0],
        [1,1,1],
        [0,0,0]   
    ],
    [
        [0,0,1],
        [1,1,1],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1],
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [0,1,0],
        [1,1,1],
        [0,0,0]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ]
]

boje = [
    "#fff",
    "#00FFFF",
    "#0000FF",
    "#F5B041",
    "#F4D03F",
    "#2ECC71",
    "#884EA0",
    "#E74C3C",
]

keys={
    'levo':37,'desno':39,'gore':38,'dole':40,'space':32
}

let vrste = 20;
let kolone = 10;
let tabla;
let rucka=null;
let pauza=false;
let ostvareniPoeni=0;

let trenutniOblik=null;
let naredniOblik=null;

function popuniJedanRed(){
    let niz=[]
    for(let j=0;j<kolone;j++)niz.push(0)
    return niz;
}

function popunjavanjeTable(){
    let tabla=[]
    for(let i=0;i<vrste;i++){
        let niz = popuniJedanRed()
        tabla.push(niz)
    }
    return tabla;
}

function proveraPopunjenRed(){
    let poeni=0;
    for(let i=0;i<tabla.length;i++){
        let popunjenRed=true;
        for(let j=0;j<tabla[0].length;j++){
            if(tabla[i][j]==0){
                popunjenRed=false;
                break;
            }
        }
        if(popunjenRed){
            let niz=popuniJedanRed();
            for(let k=i;k>0;k--){
                tabla[k]=tabla[k-1]
            }
            tabla[0]=niz;
            poeni+=10;
        }
    }
    return poeni;
}

function sracunajSredinu(broj){
    let x;
    switch(broj){
        case 0:
            x=3;
            break;
        default:
            x=4;
            break;
    }
    return x;
}

function brojZaOblikBloka(){
    let el=localStorage.getItem("elementi");
    el=JSON.parse(el);
    let pn=[]
    for(let i=0;i<7;i++){
        if(!(el.includes(i.toString()))){
            pn.push(i)
        }
    }
    let br = Math.floor(Math.random() * pn.length);
    return pn[br];
}

function generisiOblikBloka(){
    let broj=brojZaOblikBloka();
    let blok=blokovi[broj];
    let bojaBloka=boje[broj+1];

    let x= sracunajSredinu(broj)
    let xk=blok[0].length+x
    let y=0;
    let yk=blok.length
    let dx=blok[0].length
    let dy=blok.length
    broj++
    return {blok,bojaBloka,x,y,xk,yk,dx,dy,broj}
}

//----------------main--------------------
$(document).ready(function(){
    let {canvas, score,linije, ctx} = dohvOsnovneElemente()
    let {can2,ctx2} = dohvOsnovneElementeNaredni()
    postaviNivoLocalStorage();
    tabla = popunjavanjeTable();
    
    rucka=setInterval(novoStanje,vreme);

    function novoStanje(){
        let p = proveraPopunjenRed();
        ostvareniPoeni+=p
        score.innerHTML="Score: "+ostvareniPoeni;
        linije.innerHTML="Linije: "+ostvareniPoeni/10
        if(trenutniOblik==null){
            if(naredniOblik==null){
                trenutniOblik=generisiOblikBloka();
                postaviOblikBloka();
            }else{
                trenutniOblik=naredniOblik
                naredniOblik=null
            }
        }
        if(naredniOblik==null){
            ctx2.fillStyle = 'white'; 
            ctx2.fillRect(0, 0, can2.width, can2.height);
            naredniOblik=generisiOblikBloka();
            naredniOblik.x=0
            postaviOblikBlokaNaredni();
            smanjiVreme()
        }
        pomeriKaDole();
    }

    function postaviOblikBlokaNaredni(){
        let blok = naredniOblik.blok;
        for(let i=0;i<naredniOblik.dy;i++){
            for(let j=0;j<naredniOblik.dx;j++){
                if(blok[i][j] == 1){
                ctx2.fillStyle = naredniOblik.bojaBloka;
                ctx2.fillRect(naredniOblik.x+j+1,naredniOblik.y+i+1,1-0.1,1-0.1);
            }
            }
        }
    }

    function postaviOblikBloka(){
        let blok = trenutniOblik.blok;
        for(let i=0;i<trenutniOblik.dy;i++){
            for(let j=0;j<trenutniOblik.dx;j++){
                if(blok[i][j] == 1){
                ctx.fillStyle = trenutniOblik.bojaBloka;
                ctx.fillRect(trenutniOblik.x+j,trenutniOblik.y+i,1-0.1,1-0.1);
            }
            }
        }
    }

    function sudarKaDole(){
        let blok= trenutniOblik.blok
        let x=trenutniOblik.x
        let y=trenutniOblik.y+1

        for(let i=0;i<trenutniOblik.dy;i++){
            for(let j=0;j<trenutniOblik.dx;j++){
                if(blok[i][j]==1){
                    let p = x+j;
                    let q = y+i;
                    if(q>=0 && q<vrste){
                        if(tabla[q][p]>0){
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function pomeriKaDole(){
        let sudar=sudarKaDole()
        if(!sudar){
            trenutniOblik.y+=1;
        }else{
            let blok=trenutniOblik.blok;
            for(let i=0;i<trenutniOblik.dy;i++){
                for(let j=0;j<trenutniOblik.dx;j++){
                    if(blok[i][j] == 1){
                        let p = trenutniOblik.x+j;
                        let q = trenutniOblik.y+i;
                        tabla[q][p] = trenutniOblik.broj;
                    }
                }
            }
            if(trenutniOblik.y == 0){
                clearInterval(rucka)
                rezultati()
            }
            trenutniOblik = null;
        }
        postaviIgru();
    }

    function postaviIgru(){
        for(let i=0;i<tabla.length;i++){
            for(let j=0;j<tabla[i].length;j++){
                ctx.fillStyle = boje[tabla[i][j]];
                ctx.fillRect(j,i,1-0.1,1-0.1)
            }
        }
        postaviOblikBloka();
    }

    function pomeriKaLevo(){
        let sudar=sudarLevo()
        if(!sudar){
            trenutniOblik.x-=1
        }
        postaviIgru()
    }
    function pomeriKaDesno(){
        let sudar=sudarDesno()
        if(!sudar){
            trenutniOblik.x+=1
        }
        postaviIgru()
    }

    function sudarLevo(){
        let blok= trenutniOblik.blok
        let x=trenutniOblik.x-1
        let y=trenutniOblik.y

        for(let i=0;i<trenutniOblik.dy;i++){
            for(let j=0;j<trenutniOblik.dx;j++){
                if(blok[i][j]==1){
                    let p = x+j;
                    let q = y+i;
                    if(p>=0 && p<kolone){
                        if(tabla[q][p]>0){
                            return true;
                        }
                    }else{
                        return true;
                    } 
                }
            }
        }
        return false;
    }

    function sudarDesno(){
        let blok= trenutniOblik.blok
        let x=trenutniOblik.x+1
        let y=trenutniOblik.y

        for(let i=0;i<trenutniOblik.dy;i++){
            for(let j=0;j<trenutniOblik.dx;j++){
                if(blok[i][j]==1){
                    let p = x+j;
                    let q = y+i;
                    if(p>=0 && p<kolone){
                        if(tabla[q][p]>0){
                            return true;
                        }
                    }else{
                        return true;
                    }
                    
                }
            }
        }
        return false;
    }

    function sudarRotacija(blok){
        let x=trenutniOblik.x
        let y=trenutniOblik.y
        for(let i=0;i<trenutniOblik.dy;i++){
            for(let j=0;j<trenutniOblik.dx;j++){
                if(blok[i][j]==1){
                    let p = x+j;
                    let q = y+i;
                    if(p>=0 && p<kolone && q>=0 && q<vrste){
                        if(tabla[q][p]>0){
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function rotacija(){
        let blok=trenutniOblik.blok;
        let nova=rotirajMatricu(blok)
        let sudar=sudarRotacija(nova);
        if(!sudar){
            trenutniOblik.blok=nova
        }
        postaviIgru()
    }

    function smanjiVreme(){
        vreme-=5;
        clearInterval(rucka)
        rucka=setInterval(novoStanje,vreme)
    }

    function pauziraj(){
        clearInterval(rucka);
    }
    function aktiviraj(){
        rucka=setInterval(novoStanje,vreme)
    }

    function rotirajMatricu(matrica) {
        const brRedova = matrica.length;
        const brKolona = matrica[0].length;
        const novaMatrica = [];
    
        for (let i = 0; i < brKolona; i++) {
            novaMatrica[i] = [];
            for (let j = 0; j < brRedova; j++) {
                novaMatrica[i][j] = matrica[brRedova - 1 - j][i];
            }
        }    
        return novaMatrica;
    }

$(document).on("keydown", function(event){
    switch(event.which){
        case keys['levo']: 
            console.log("Leva strelica je pritisnuta");
            pomeriKaLevo();
            break;
        case keys['gore']:
            console.log("Gornja strelica je pritisnuta");
            rotacija();
            break;
        case keys['desno']:
            console.log("Desna strelica je pritisnuta");
            pomeriKaDesno();
            break;
        case keys['dole']: 
            console.log("Doljnja strelica je pritisnuta");
            pomeriKaDole()
            break;
        case keys['space']:
            console.log("Pauza")
            if(!pauza){
                pauziraj()
                pauza=true
            }else{
                aktiviraj()
                pauza=false
            }
            break;

    }
});

//rezultati
korisnici=[
]
trenutniKorisnik=[
]

function rezultati(){
    let ime= prompt("Igra je zavrsena!\nUnesite ime pod kojima zelite da cuvate svoj rezultat:")
    if(ime==null)window.location.href = 'tetris-rezultati.html'
    
    let tekstKorisnici = localStorage.getItem("korisnici");
    if (tekstKorisnici == null) {
        localStorage.setItem("korisnici", JSON.stringify(korisnici));
    } else {
        korisnici = JSON.parse(tekstKorisnici);
    }
    korisnici.push({
        korisnickoIme : ime,
        poeni:ostvareniPoeni
    });
    tekstKorisnici = JSON.stringify(korisnici);
    localStorage.setItem("korisnici", tekstKorisnici);
    window.location.href = 'tetris-rezultati.html'

    let trenutniKor=localStorage.getItem("trenutniKorisnik")
    if(trenutniKor==null){
        localStorage.setItem("trenutniKorisnik",JSON.stringify(trenutniKor))
    }else{
        trenutniKorisnik.push({
                korisnickoIme:ime,
                poeni:ostvareniPoeni
        });
        localStorage.setItem("trenutniKorisnik",JSON.stringify(trenutniKorisnik))
    }
}
});