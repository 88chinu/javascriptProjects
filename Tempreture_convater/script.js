let celcious = document.getElementById('cel');
let fahrenhit = document.getElementById('fahr');
let kelvine = document.getElementById('kel');

celcious.oninput = function () {
    let fahr = (parseFloat(celcious.value)*9)/5 + 32;
    fahrenhit.value = parseFloat(fahr.toFixed(2))

    let kel = (parseFloat(celcious.value)+273.15)
    kelvine.value = parseFloat(kel.toFixed(2))
}

fahrenhit.oninput = function () {
    let cel = ((parseFloat(fahrenhit.value)-32)*5)/9
    celcious.value = parseFloat(cel.toFixed(2))

    let kel = (((parseFloat(fahrenhit.value)-32)*5)/9)+273.15
    kelvine.value = parseFloat(kel.toFixed(2))
}

kelvine.oninput = function () {
    let fahr = ((parseFloat(kelvine.value)-273.15)*9)/5+32
    fahrenhit.value = parseFloat(fahr.toFixed(2))

    let cel = (parseFloat(kelvine.value)-273.15)
    celcious.value = parseFloat(cel.toFixed(2))
}