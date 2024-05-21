let karAct=0;
$(document).ready(function() {
    $("#sakrij").click(function() {
        if(karAct==0){
            $(".kartica").toggle(1000);
        }
        else{
            $('.kar').hide(); 
            $(".kartica").show(1000);
            karAct=0
        }
        $(".kartica2").hide(1000);
    });
    $("#podesavanja").click(function() {
        $(".kartica").hide(1000);
        $(".karticaNext").hide(1000);
        $(".karticaNext2").hide(1000);
        $(".kartica2").toggle(1000);
    });
});

function sakriveno(){
    $(".card-body").hide();
}

function sledecaKarta(cardNumber) {
    $('.kar').hide();
    $('#card' + cardNumber).show(); 
    if (cardNumber == 2) {
        karAct=2
        $(".karticaNext").show();
    } else if (cardNumber == 3) {
        karAct=3
        $(".karticaNext2").show();
    }else{
        karAct=0;
    }
}

function tezinaLocalStorage(){
    let tezina = document.getElementById('tezinaSelect22');
    let izabranaVrednost = tezina.value;
    localStorage.setItem("tezina", JSON.stringify(izabranaVrednost));
}

function checkboxLocalStorage(){
    let checkboxes = document.querySelectorAll('input[type=checkbox]')
    let odabraniElementi = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            odabraniElementi.push(checkbox.value);
        }
    });
    localStorage.setItem("elementi",JSON.stringify(odabraniElementi))
}

function igraj(){
    tezinaLocalStorage();
    checkboxLocalStorage();
    window.location.href = 'tetris-igra.html';
}