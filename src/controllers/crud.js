import mysql from 'mysql2';
import conexion from '../database/db.js';
import Swal from 'sweetalert2';
import bodyParser from 'body-parser';
import moment from 'moment';


export const saveGrupo = (req, res) => {
  const letraGrupo = req.body.letraGrupo;

  conexion.query(
    "INSERT INTO grupo SET ?",
    { letraGrupo: letraGrupo },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/admin/grupos");
      }
    }
  );
};

export const savePartido = (req, res) => {
  
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
                    res.redirect("/admin/partidos");
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

export const saveEquipo = (req, res) => {
  const nombreEquipo = req.body.nombreEquipo;
  const nombreDeporte = req.body.nombreDeporte;

  console.log(nombreEquipo)
  console.log(nombreDeporte)

  // const imagen = req.file.buffer;

  conexion.query(
    "INSERT INTO equipos SET ?",
    {
      nombreEquipo: nombreEquipo,
      nombreDeporte: nombreDeporte,
      // imagen: imagen,
    },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/admin/equipos");
      }
    }
  );
};

export const updateEquipo = (req, res) => {
  const codEquipo = req.body.codEquipo;
  const nombreEquipo = req.body.nombreEquipo;
  const nombreDeporte = req.body.nombreDeporte;

  conexion.query(
    "UPDATE equipos SET ? WHERE codEquipo = ?",
    [{nombreEquipo: nombreEquipo, nombreDeporte: nombreDeporte }, codEquipo],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/admin/equipos");
      }
    }
  );
};

// jugadores

export const saveJugador = (req, res) => {
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
        res.redirect("/admin/jugadores");
      }
    }
  );
};

export const updateJugador = (req, res) => {
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
        res.redirect("/admin/jugadores");
      }
    }
  );
};

export const saveCarrera = (req, res) => {
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
        res.redirect("/admin/carreras");
      }
    }
  );
};

export const updateCarrera = (req, res) => {
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
        res.redirect("/admin/carreras");
      }
    }
  );
};

export const saveEliminatoria = (req, res) => {
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
        res.redirect("/admin/eliminatorias");
      }
    }
  );
};

export const updateEliminatoria = (req, res) => {
  const nombreEquipo = req.body.nombreEquipo;
  const juegos_jugados = req.body.juegos_jugados;
  const juegos_ganados = req.body.juegos_ganados;
  const juegos_empate = req.body.juegos_empate;
  const juegos_perdidos = req.body.juegos_perdidos;
  const goles_a_favor = req.body.goles_a_favor;
  const goles_en_contra = req.body.goles_en_contra;
  const diferencia_goles = req.body.diferencia_goles;
  const puntos = req.body.puntos;

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
        res.redirect("/admin/eliminatorias");
      }
    }
  );
};

export const saveEIndividuales = (req, res) => {
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
        res.redirect("/admin/estadisticasIndividuales");
      }
    }
  );
};

export const saveEGenerales = (req, res) => {
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
        res.redirect("/admin/estadisticasGenerales");
      }
    }
  );
};

export const updateEstadisticasGenerales = (req, res) => {
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
        res.redirect("/admin/estadisticasGenerales");
      }
    }
  );
};

export const saveEstadios = (req, res) => {
  const nombreEstadio = req.body.nombreEstadio;

  conexion.query(
    "INSERT INTO estadio SET ?",
    {
      nombreEstadio: nombreEstadio
    },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/admin/estadios");
      }
    }
  );
};

export const updateEstadio = (req, res) => {
  const codEstadio = req.body.codEstadio;
  const nombreEstadio = req.body.nombreEstadio;
  conexion.query(
    "UPDATE estadio SET ? WHERE codEstadio = ?",
    [
      {
        nombreEstadio: nombreEstadio
      },
      codEstadio,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/admin/estadios");
      }
    }
  );
};

export const saveJornada = (req, res) => {
  const fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm:ss');
  

  conexion.query(
    "INSERT INTO jornadas SET ?",
    { fecha: fecha },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/admin/jornadas");
      }
    }
  );
};


export const saveDeporte = (req, res) => {
  const nombreDeporte = req.body.nombreDeporte;
  const tipoDeporte = req.body.tipoDeporte;

  conexion.query(
    "INSERT INTO deporte SET ?",
    { nombreDeporte: nombreDeporte,tipoDeporte:tipoDeporte },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/admin/deportes");
      }
    }
  );
};

export const updateDeporte = (req, res) => {
  const nombreDeporte = req.body.nombreDeporte;
  const tipoDeporte = req.body.tipoDeporte;
  const id = req.body.id;
  
  conexion.query(
    "UPDATE deporte SET ? WHERE id = ?",
    [
      {
        nombreDeporte: nombreDeporte,
        tipoDeporte: tipoDeporte
      },
      id,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        res.redirect("/admin/deportes");
      }
    }
  );
};

export const saveRI = (req, res) => {
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
          res.redirect("/admin/rankingIndividual");
        }
      }
    );

  })};
  export const updateRI = (req, res) => {
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
          res.redirect("/admin/rankingIndividual");
        }
      }
    );
  };

  export const saveRE = (req, res) => {
    const nombreEquipo = req.body.nombreEquipo;
    const puntos = req.body.puntos;
    const nombreDeporte = req.body.nombreDeporte;
    
    conexion.query(
        "INSERT INTO rankinge SET ?",
        {
          nombreEquipo: nombreEquipo,
          puntos: puntos,
          nombreDeporte:nombreDeporte
        },
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(400).json({ msg: "error" });
          } else {
            res.redirect("/admin/rankingEquipos");
          }
        }
      );
  }
  
  
  
    export const updateRE = (req, res) => {
      const id = req.body.id;
      const puntos = req.body.puntos;
    
      conexion.query(
        "UPDATE rankinge SET ? WHERE id = ?",
        [{ puntos: puntos }, id],
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(400).json({ msg: "error" });
          } else {
            res.redirect("/admin/rankingEquipos");
          }
        }
      );
    };
  


    export const saveResultados = (req, res) => {
      const nombreDeporte = req.body.nombreDeporte;
      const fecha = moment(req.body.fecha).format('YYYY-MM-DD');
      const jornada = req.body.jornada;
      const nombreEquipo1 = req.body.nombreEquipo1;
      const puntos1 = req.body.puntos1;
      const nombreEquipo2 = req.body.nombreEquipo2;
      const puntos2 = req.body.puntos2;
      
      conexion.query(
          "INSERT INTO resultados SET ?",
          {
            nombreDeporte: nombreDeporte,
            fecha: fecha,
            jornada:jornada,
            nombreEquipo1:nombreEquipo1,
            puntos1:puntos1,
            nombreEquipo2:nombreEquipo2,
            puntos2:puntos2,
          },
          (error, results) => {
            if (error) {
              console.log(error);
              res.status(400).json({ msg: "error" });
            } else {
              res.redirect("/admin/resultados");
            }
          }
        );
    }
