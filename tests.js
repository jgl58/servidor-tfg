var supertest = require("supertest");
var should = require("should");
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZFVzZXIiOjM5LCJuaWNrIjoiZXF1aXBvcG9jaGlua2lAZ21haWwuY29tIiwicGFzcyI6ImU4M2U4NTM1ZDZmNjg5NDkzZTU4MTliZDYwYWEzZTVmZGNiYTk0MGU2ZDExMWFiNmZiNWMzNGYyNGY4NjQ5NmJmMzcyNmUyYmY0ZWM1OWQ2ZDJmNWEyYWViMWU0ZjEwMzI4M2U3ZDY0ZTRmNDljMDNiNGM0NzI1Y2IzNjFlNzczIiwicHJvdmluY2lhIjozOCwicHJvZmVzaW9uYWwiOnRydWV9.wjLkQzGq-H3bDTvRiyn2PnBMz_uk3QnPu5gAtaBZHG8"

// This agent refers to PORT where program is runninng.

var knex = require('knex')({
  client: 'mysql',
  connection: {
      host: 'localhost',
    user : 'tfg',
    password: "tfg",
    database : 'tfg'
  }
});

var server = supertest.agent("http://localhost:3030");

// UNIT test begin

describe("Tests TFG", function () {

  var TOKEN_PROFESIONAL = ""
  var TOKEN_CLIENTE = ""
  it("Registro profesional OK", function (done) {
    var pet = {
      isProfesional: true, email: "prueba@prueba.com", pass: "e83e8535d6f689493e5819bd60aa3e5fdcba940e6d111ab6fb5c34f24f86496bf3726e2bf4ec59d6d2f5a2aeb1e4f103283e7d64e4f49c03b4c4725cb361e773", 
      nombre: "Prueba", apellidos: "Prueba",
      provincia: 2, poblacion: "Prueba", pais: "Prueba", direccion: "Prueba"
    };
    // calling home page api
    server
      .post("/registro")
      .send(pet)
      .expect("Content-type", /json/)
      .expect(401) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(401);
        done();
      });
  });

  it("Registro profesional MAL", function (done) {
    var pet = {
      isProfesional: true, email: "prueba@prueba.com", pass: "e83e8535d6f689493e5819bd60aa3e5fdcba940e6d111ab6fb5c34f24f86496bf3726e2bf4ec59d6d2f5a2aeb1e4f103283e7d64e4f49c03b4c4725cb361e773", 
      nombre: "Prueba", apellidos: "Prueba",
      provincia: 2, poblacion: "Prueba", pais: "Prueba", direccion: "Prueba"
    };
    // calling home page api
    server
      .post("/registro")
      .send(pet)
      .expect("Content-type", /json/)
      .expect(401) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(401);
        done();
      });
  });

  it("Login profesional OK", function (done) {
    var pet = {
      profesional: true, 
      email: "prueba@prueba.com", 
      pass: "e83e8535d6f689493e5819bd60aa3e5fdcba940e6d111ab6fb5c34f24f86496bf3726e2bf4ec59d6d2f5a2aeb1e4f103283e7d64e4f49c03b4c4725cb361e773"
    };
    // calling home page api
    server
      .post("/login")
      .send(pet)
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        var json = JSON.parse(res.text)
        TOKEN_PROFESIONAL = json.token;
        // HTTP status should be 200
        res.status.should.equal(200);
        done();
      });
  });

  it("Editar profesional", function (done) {
    var pet = {
      isProfesional: true, email: "prueba@prueba.com", pass: "e83e8535d6f689493e5819bd60aa3e5fdcba940e6d111ab6fb5c34f24f86496bf3726e2bf4ec59d6d2f5a2aeb1e4f103283e7d64e4f49c03b4c4725cb361e773", 
      nombre: "Prueba cambio", apellidos: "Prueba",
      provincia: 2, poblacion: "Prueba", pais: "Prueba", direccion: "Prueba"
    };
    // calling home page api
    server
      .put("/profesionales/45")
      .send(pet)
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(200);
        done();
      });
  });



  it("Registro cliente OK", function (done) {
    var pet = {
      isProfesional: false, email: "prueba@prueba.com", pass: "e83e8535d6f689493e5819bd60aa3e5fdcba940e6d111ab6fb5c34f24f86496bf3726e2bf4ec59d6d2f5a2aeb1e4f103283e7d64e4f49c03b4c4725cb361e773", 
      nombre: "Prueba", apellidos: "Prueba",
      provincia: 2, poblacion: "Prueba", pais: "Prueba", direccion: "Prueba"
    };
    // calling home page api
    server
      .post("/registro")
      .send(pet)
      .expect("Content-type", /json/)
      .expect(401) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(401);
        done();
      });
  });

  it("Registro cliente MAL", function (done) {
    var pet = {
      isProfesional: false, email: "prueba@prueba.com", pass: "e83e8535d6f689493e5819bd60aa3e5fdcba940e6d111ab6fb5c34f24f86496bf3726e2bf4ec59d6d2f5a2aeb1e4f103283e7d64e4f49c03b4c4725cb361e773", 
      nombre: "Prueba", apellidos: "Prueba",
      provincia: 2, poblacion: "Prueba", pais: "Prueba", direccion: "Prueba"
    };
    // calling home page api
    server
      .post("/registro")
      .send(pet)
      .expect("Content-type", /json/)
      .expect(401) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(401);
        done();
      });
  });

  it("Login cliente OK", function (done) {
    var pet = {
      profesional: false, 
      email: "prueba@prueba.com", 
      pass: "e83e8535d6f689493e5819bd60aa3e5fdcba940e6d111ab6fb5c34f24f86496bf3726e2bf4ec59d6d2f5a2aeb1e4f103283e7d64e4f49c03b4c4725cb361e773"
    };
    // calling home page api
    server
      .post("/login")
      .send(pet)
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        var json = JSON.parse(res.text)
        TOKEN_CLIENTE = json.token;
        // HTTP status should be 200
        res.status.should.equal(200);
        done();
      });
  });

  it("Editar cliente", function (done) {
    var pet = {
      isProfesional: false, email: "prueba@prueba.com", pass: "e83e8535d6f689493e5819bd60aa3e5fdcba940e6d111ab6fb5c34f24f86496bf3726e2bf4ec59d6d2f5a2aeb1e4f103283e7d64e4f49c03b4c4725cb361e773", 
      nombre: "Prueba cambio", apellidos: "Prueba",
      provincia: 2, poblacion: "Prueba", pais: "Prueba", direccion: "Prueba"
    };
    // calling home page api
    server
      .put("/users/14")
      .send(pet)
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(200);
        done();
      });
  });


  it("Crear oferta", function (done) {
    var oferta = {
      titulo: "Titulo",
      descripcion: "Descripcion",
      provincia: 2,
      fecha: "2019-08-31T16:50:11.030Z",
      direccion: "Calle falsa",
      poblacion: "Pueblo falso",
      precio: 100,
      duracion: 2
  }
    // calling home page api
    server
      .post("/users/15/ofertas")
      .send(oferta)
      .set({ Authorization: TOKEN_CLIENTE })
      .expect("Content-type", /json/)
      .expect(201) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(201);
        done();
      });
  });

  it("Editar oferta", function (done) {
    var oferta = {
      titulo: "Titulo 2",
      descripcion: "Descripcion 2",
      provincia: 2,
      fecha: "2019-08-31T16:50:11.030Z",
      direccion: "Calle falsa",
      poblacion: "Pueblo falso",
      precio: 1000,
      duracion: 2
  }
    // calling home page api
    server
      .put("/users/15/ofertas/136")
      .send(oferta)
      .set({ Authorization: TOKEN_CLIENTE })
      .expect("Content-type", /json/)
      .expect(204) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(204);
        done();
      });
  });

  it("Consultar ofertas usuario", function (done) {
    // calling home page api
    server
      .get("/users/15/ofertas")
      .set({ Authorization: TOKEN_CLIENTE })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        var json = JSON.parse(res.text)

        if(json.ofertas.length == 0){
          done()
        }else{
          done(false)
        }
      });
  });

  it("Aceptar oferta", function (done) {
    // calling home page api
    server
      .put("/profesionales/45/trabajos/136")
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(204) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(204);
        done();
      });
  });

  it("Consultar ofertas usuario", function (done) {
    // calling home page api
    server
      .get("/users/15/ofertas")
      .set({ Authorization: TOKEN_CLIENTE })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        var json = JSON.parse(res.text)

        if(json.ofertas.length > 0){
          done()
        }else{
          done(false)
        }
      });
  });

  it("Consultar ofertas profesional", function (done) {
    // calling home page api
    server
      .get("/profesionales/45/trabajos")
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        var json = JSON.parse(res.text)

        if(json.ofertas.length > 0){
          done()
        }else{
          done(false)
        }
      });
  });

  it("Consultar cliente oferta", function (done) {
    // calling home page api
    server
      .get("/profesionales/45/trabajos/136/user")
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        var json = JSON.parse(res.text)

        if(json.cliente.id == 15){
          done()
        }else{
          done(false)
        }
      });
  });

  it("Consultar profesional oferta", function (done) {
    // calling home page api
    server
      .get("/users/15/ofertas/136/profesional")
      .set({ Authorization: TOKEN_CLIENTE })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        var json = JSON.parse(res.text)

        if(json.profesional.id == 45){
          done()
        }else{
          done(false)
        }
      });
  });

  it("Consultar horario profesional", function (done) {
    // calling home page api
    server
      .get("/profesionales/45/horario")
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        var json = JSON.parse(res.text)

        if(json.horario.length > 0){
          done()
        }else{
          done(false)
        }
      });
  });

  it("Consultar notificaciones profesional", function (done) {
    // calling home page api
    server
      .get("/profesionales/45/notificaciones")
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        var json = JSON.parse(res.text)

        if(json.notificaciones.length > 0){
          done()
        }else{
          done(false)
        }
      });
  });

  it("Valorar profesional", function (done) {
    // calling home page api
    var valoracion = {
      id: 45,
      user_id: 15,
      oferta_id: 136,
      valoracion: 4
  }
    server
      .post("/profesionales/45")
      .set({ Authorization: TOKEN_CLIENTE })
      .send(valoracion)
      .expect("Content-type", /json/)
      .expect(201) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(201);
        done();
        
      });
  });


  it("Consultar valoracion profesional", function (done) {
    // calling home page api
    server
      .get("/profesionales/45/valoracion")
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        var json = JSON.parse(res.text)

        if(json.valoracion.length > 0){
          done()
        }else{
          done(false)
        }
      });
  });



  it("Cancelar oferta", function (done) {
    // calling home page api
    server
      .put("/profesionales/45/trabajos/136/cancelar")
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(204) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(204);
        done();
      });
  });

  it("Consultar ofertas profesional despues de cancelar", function (done) {
    // calling home page api
    server
      .get("/profesionales/45/trabajos")
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        var json = JSON.parse(res.text)

        if(json.ofertas.length == 0){
          done()
        }else{
          done(false)
        }
      });
  });

  it("Consultar horario profesional despues de cancelar", function (done) {
    // calling home page api
    server
      .get("/profesionales/45/horario")
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        var json = JSON.parse(res.text)

        if(json.horario.length == 0){
          done()
        }else{
          done(false)
        }
      });
  });

  it("Consultar notificaciones profesional despues de cancelar", function (done) {
    // calling home page api
    server
      .get("/profesionales/45/notificaciones")
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        var json = JSON.parse(res.text)

        if(json.notificaciones.length == 0){
          done()
        }else{
          done(false)
        }
      });
  });

  it("Borrar oferta", function (done) {
    // calling home page api
    server
      .delete("/users/15/ofertas/136")
      .set({ Authorization: TOKEN_PROFESIONAL })
      .expect("Content-type", /json/)
      .expect(204) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(204);
        done();
      });
  });

});