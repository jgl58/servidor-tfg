function onload(){
    var urlParams = new URLSearchParams(window.location.search);
    var entries = urlParams.entries();
    var params = []
    for(pair of entries) { 
    console.log(pair[0], pair[1]); 
    params.push(pair[1])
    }
    fetch("https://jonaygilabert.ddns.net:3030/ofertas/" + params[1])
    .then(function (response) {
        return response.json()
    }).then(function(data){
        console.log(data)

        document.getElementById("titulo").innerText = data.oferta.titulo
        document.getElementById("descripcion").innerText = data.oferta.descripcion
        document.getElementById("ubicacion").innerText = data.oferta.direccion + " " + data.oferta.poblacion
        document.getElementById("precio").innerText = data.oferta.precio + "€"
        document.getElementById("fecha").innerText = setDate(new Date(data.oferta.fecha))
        document.getElementById("tiempo").innerText = data.oferta.duracion + " horas"

    })
}

function aceptar(){
    var urlParams = new URLSearchParams(window.location.search);
    var entries = urlParams.entries();
    var params = []
    for(pair of entries) { 
    console.log(pair[0], pair[1]); 
    params.push(pair[1])
    }
    fetch("https://jonaygilabert.ddns.net:3030/aceptar/"+params[0]+"/trabajos/"+params[1], {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            estado: true
        })
    }).then((response) => {
        if (response.ok) {
            alert('Oferta de trabajo aceptada')
        } else {
            alert('No se ha podido aceptar la oferta, revisa tu horario')
        }
    })
}

function setDate(date){
    var monthNames = [
        "enero", "febrero", "marzo",
        "abril", "mayo", "junio", "julio",
        "agosto", "septiembre", "octubre",
        "noviembre", "diciembre"
      ];
    
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
  
      var hour = date.getHours();
      var min = date.getMinutes();
      if(min == 0){min = "00"}
      var d = day + '/' + monthNames[monthIndex] + '/' + year;
      var h = hour+":"+min
  
      return d + " - "+ h
}