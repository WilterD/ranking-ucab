const conexion = require("../database/db.cjs");
const Swal = require("sweetalert2");
const bodyParser = require("body-parser");
const moment = require('moment');

exports.saveGrupo = (req, res) => {
  const letraGrupo = req.body.letraGrupo;

  conexion.query(
    "INSERT INTO grupo SET ?",
    { letraGrupo: letraGrupo },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/grupos");
      }
    }
  );
};

exports.savePartido = (req, res) => {
  
  const fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm:ss');
  const codEstadio = req.body.codEstadio;
  const nombreEquipo1 = req.body.nombreEquipo1;
  const nombreEquipo2 = req.body.nombreEquipo2;
  const nombreDeporte = req.body.nombreDeporte;
  
  conexion.query(
    "INSERT INTO partido SET ?",
    { fecha: fecha, codEstadio: codEstadio },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        conexion.query(
          "INSERT INTO juegan SET ?",
          { codPartido: results.insertId, nombreEquipo1, nombreEquipo2 },
          (error, results) => {
            if (error) {
              console.log(error);
              res.status(400).json({ msg: "error" });
            } else {
              conexion.query(
                "INSERT INTO jornadas SET ?",
                { fecha: fecha, nombreDeporte:nombreDeporte },
                (error, results) => {
                  if (error) {
                    console.log(error);
                    res.status(400).json({ msg: "error" });
                  } else {
                    res.redirect("/partidos");
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};



// Equipos

exports.saveEquipo = (req, res) => {
  const nombreEquipo = req.body.nombreEquipo;
  const nombreDT = req.body.nombreDT;
  const nombreDeporte = req.body.nombreDeporte;

  conexion.query(
    "INSERT INTO equipos SET ?",
    {
      nombreEquipo: nombreEquipo,
      nombreDT: nombreDT,
      nombreDeporte: nombreDeporte
    },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/equipos");
      }
    }
  );
};

exports.updateEquipo = (req, res) => {
  const codEquipo = req.body.codEquipo;
  const nombreDT = req.body.nombreDT;
  const nombreEquipo = req.body.nombreEquipo;
  const nombreDeporte = req.body.nombreDeporte;

  conexion.query(
    "UPDATE equipos SET ? WHERE codEquipo = ?",
    [{ nombreDT: nombreDT, nombreEquipo: nombreEquipo, nombreDeporte: nombreDeporte }, codEquipo],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/equipos");
      }
    }
  );
};

// jugadores

exports.saveJugador = (req, res) => {
  const nombreCarrera = req.body.nombreCarrera;
  const nombreJugador = req.body.nombreJugador;
  const nombreEquipo = req.body.nombreEquipo;

  conexion.query(
    "INSERT INTO jugador SET ?",
    {
      nombreJugador: nombreJugador,
      nombreEquipo: nombreEquipo,
      nombreCarrera: nombreCarrera,
    },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/jugadores");
      }
    }
  );
};

exports.updateJugador = (req, res) => {
  const codJugador = req.body.codJugador;
  const nombreJugador = req.body.nombreJugador;
  const nombreEquipo = req.body.nombreEquipo;
  const nombreCarrera = req.body.nombreCarrera;

  conexion.query(
    "UPDATE jugador SET ? WHERE codJugador = ?",
    [
      {
        nombreJugador: nombreJugador,nombreEquipo:nombreEquipo,nombreCarrera:nombreCarrera
      },
      codJugador,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/jugadores");
      }
    }
  );
};

exports.saveCarrera = (req, res) => {
  const nombreCarrera = req.body.nombreCarrera;
  conexion.query(
    "SELECT nombreCarrera FROM carreras WHERE nombreCarrera=?",
    [nombreCarrera],
    (error, carrera) => {
      if (carrera.length == 1) {
        res.status(400).json({ msg: "error" });
      } else {
        conexion.query("INSERT INTO carreras SET ?", {
          nombreCarrera: nombreCarrera,
        });
        res.redirect("/carreras");
      }
    }
  );
};

exports.updateCarrera = (req, res) => {
  const nombreCarrera = req.body.nombreCarrera;
  const id = req.body.id;
  conexion.query(
    "UPDATE carreras SET ? WHERE id = ?",
    [{ nombreCarrera: nombreCarrera }, id],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/carreras");
      }
    }
  );
};

exports.saveEliminatoria = (req, res) => {
  const nombreEquipo = req.body.nombreEquipo;
  const juegos_ganados = req.body.juegos_ganados;
  const juegos_perdidos = req.body.juegos_perdidos;
  const goles_a_favor = req.body.goles_a_favor;
  const goles_en_contra = req.body.goles_en_contra;
  const juegos_empate = req.body.juegos_empate;
  const diferencia_goles = req.body.diferencia_goles;
  const puntos = req.body.puntos;
  const juegos_jugados = req.body.juegos_jugados;

  conexion.query(
    "INSERT INTO eliminatorias SET ?",
    {
      nombreEquipo: nombreEquipo,
      juegos_ganados: juegos_ganados,
      juegos_perdidos: juegos_perdidos,
      goles_a_favor: goles_a_favor,
      goles_en_contra: goles_en_contra,
      juegos_empate: juegos_empate,
      diferencia_goles: diferencia_goles,
      puntos: puntos,
      juegos_jugados: juegos_jugados,
    },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/eliminatorias");
      }
    }
  );
};

exports.updateEliminatoria = (req, res) => {
  const nombreEquipo = req.body.nombreEquipo;
  const juegos_ganados = req.body.juegos_ganados;
  const juegos_perdidos = req.body.juegos_perdidos;
  const goles_a_favor = req.body.goles_a_favor;
  const goles_en_contra = req.body.goles_en_contra;
  const juegos_empate = req.body.juegos_empate;
  const diferencia_goles = req.body.diferencia_goles;
  const puntos = req.body.puntos;
  const juegos_jugados = req.body.juegos_jugados;

  conexion.query(
    "UPDATE eliminatorias SET ? WHERE nombreEquipo = ?",
    [
      {
        juegos_ganados: juegos_ganados,
        juegos_perdidos: juegos_perdidos,
        goles_a_favor: goles_a_favor,
        goles_en_contra: goles_en_contra,
        juegos_empate: juegos_empate,
        diferencia_goles: diferencia_goles,
        puntos: puntos,
        juegos_jugados: juegos_jugados,
      },
      nombreEquipo,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/eliminatorias");
      }
    }
  );
};

exports.saveEIndividuales = (req, res) => {
  const codJugador = req.body.codJugador;
  const codPartido = req.body.codPartido;
  const ataque = req.body.ataque;
  const defensa = req.body.defensa;
  const pases = req.body.pases;
  const golesAnotados = req.body.golesAnotados;
  const asistencias = req.body.asistencias;
  const autogoles = req.body.autogoles;
  const penaltis = req.body.penaltis;
  const tarjetasAmarillas = req.body.tarjetasAmarillas;
  const tarjetasRojas = req.body.tarjetasRojas;

  conexion.query(
    "INSERT INTO estadisticasIndividuales SET ?",
    {
      codJugador: codJugador,
      codPartido: codPartido,
      ataque: ataque,
      defensa: defensa,
      pases: pases,
      golesAnotados: golesAnotados,
      asistencias: asistencias,
      autogoles: autogoles,
      penaltis: penaltis,
      tarjetasAmarillas: tarjetasAmarillas,
      tarjetasRojas: tarjetasRojas,
    },
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/estadisticasIndividuales");
      }
    }
  );
};

exports.saveEGenerales = (req, res) => {
  const codEquipo = req.body.codEquipo;
  console.log(codEquipo);
  console.log("holaa");
  const codPartido = req.body.codPartido;
  const posesionBalon = req.body.posesionBalon;
  const tirosArco = req.body.tirosArco;
  const tirosArcoAcertados = req.body.tirosArcoAcertados;
  const tirosArcoFallados = req.body.tirosArcoFallados;
  const tiroSEsquina = req.body.tiroSEsquina;
  const atajadasPortero = req.body.atajadasPortero;
  const pases = req.body.pases;
  const pasesCortos = req.body.pasesCortos;
  const pasesLargos = req.body.pasesLargos;
  const entradas = req.body.entradas;

  conexion.query(
    "INSERT INTO estadisticasGenerales SET ?",
    {
      codEquipo: codEquipo,
      codPartido: codPartido,
      posesionBalon: posesionBalon,
      tirosArco: tirosArco,
      tirosArcoAcertados: tirosArcoAcertados,
      tirosArcoFallados: tirosArcoFallados,
      tiroSEsquina: tiroSEsquina,
      atajadasPortero: atajadasPortero,
      pases: pases,
      pasesCortos: pasesCortos,
      pasesLargos: pasesLargos,
      entradas: entradas,
    },
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/estadisticasGenerales");
      }
    }
  );
};

exports.updateEstadisticasGenerales = (req, res) => {
  const codEquipo = req.body.codEquipo;
  const codPartido = req.body.codPartido;
  const posesionBalon = req.body.posesionBalon;
  const tirosArco = req.body.tirosArco;
  const tirosArcoAcertados = req.body.tirosArcoAcertados;
  const tirosArcoFallados = req.body.tirosArcoFallados;
  const tiroSEsquina = req.body.tiroSEsquina;
  const atajadasPortero = req.body.atajadasPortero;
  const pases = req.body.pases;
  const pasesCortos = req.body.pasesCortos;
  const pasesLargos = req.body.pasesLargos;
  const entradas = req.body.entradas;

  console.log(codEquipo);
  console.log(codPartido);
  console.log(posesionBalon);
  console.log(tirosArco);
  console.log(tirosArcoAcertados);
  console.log(tirosArcoFallados);
  console.log(tiroSEsquina);
  console.log(atajadasPortero);
  console.log(pases);
  console.log(pasesCortos);
  console.log(pasesLargos);
  console.log(entradas);

  conexion.query(
    "UPDATE estadisticasgenerales SET ? WHERE codEquipo = ? AND codPartido = ?",
    [
      {
        posesionBalon: posesionBalon,
        tirosArco: tirosArco,
        tirosArcoAcertados: tirosArcoAcertados,
        tirosArcoFallados: tirosArcoFallados,
        tiroSEsquina: tiroSEsquina,
        atajadasPortero: atajadasPortero,
        pases: pases,
        pasesCortos: pasesCortos,
        pasesLargos: pasesLargos,
        entradas: entradas,
      },
      codEquipo,
      codPartido,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/estadisticasGenerales");
      }
    }
  );
};

exports.saveEstadios = (req, res) => {
  const ubicacion = req.body.ubicacion;
  const nombreEstadio = req.body.nombreEstadio;
  const capacidad = req.body.capacidad;
  const nombreCiudad = req.body.nombreCiudad;

  conexion.query(
    "INSERT INTO estadio SET ?",
    {
      ubicacion: ubicacion,
      nombreEstadio: nombreEstadio,
      capacidad: capacidad,
      nombreCiudad: nombreCiudad,
    },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/estadios");
      }
    }
  );
};

exports.updateEstadio = (req, res) => {
  const codEstadio = req.body.codEstadio;
  const nombreEstadio = req.body.nombreEstadio;
  const ubicacion = req.body.ubicacion;
  const capacidad = req.body.capacidad;
  const nombreCiudad = req.body.nombreCiudad;
  conexion.query(
    "UPDATE estadio SET ? WHERE codEstadio = ?",
    [
      {
        nombreEstadio: nombreEstadio,
        ubicacion: ubicacion,
        capacidad: capacidad,
        nombreCiudad: nombreCiudad,
      },
      codEstadio,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/estadios");
      }
    }
  );
};

exports.saveJornada = (req, res) => {
  const fecha = req.body.fecha;
  console.log(fecha);

  conexion.query(
    "INSERT INTO jornadas SET ?",
    { fecha: fecha },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/jornadas");
      }
    }
  );
};


exports.saveDeporte = (req, res) => {
  const nombreDeporte = req.body.nombreDeporte;

  conexion.query(
    "INSERT INTO deporte SET ?",
    { nombreDeporte: nombreDeporte },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/deportes");
      }
    }
  );
};

exports.updateDeporte = (req, res) => {
  const nombreDeporte = req.body.nombreDeporte;
  const id = req.body.id;
  
  conexion.query(
    "UPDATE deporte SET ? WHERE id = ?",
    [
      {
        nombreDeporte: nombreDeporte
      },
      id,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/deportes");
      }
    }
  );
};

exports.saveRI = (req, res) => {
  const nombreJugador = req.body.nombreJugador;
  const puntos = req.body.puntos;
  const nombreDeporte = req.body.nombreDeporte;
  conexion.query('SELECT nombreCarrera FROM jugador WHERE nombreJugador=?',[nombreJugador] , (error, carreras) => {

    conexion.query(
      "INSERT INTO rankini SET ?",
      {
        nombreJugador: nombreJugador,
        puntos: puntos,
        nombreCarrera: carreras[0].nombreCarrera,
        nombreDeporte:nombreDeporte
      },
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(400).json({ msg: "error" });
        } else {
          res.redirect("/rankingIndividual");
        }
      }
    );

  })};


  exports.updateRI = (req, res) => {
    const id = req.body.id;
    const puntos = req.body.puntos;
  
    conexion.query(
      "UPDATE rankini SET ? WHERE id = ?",
      [{ puntos: puntos }, id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(400).json({ msg: "error" });
        } else {
          res.redirect("/rankingIndividual");
        }
      }
    );
  };
  
