const conexion = require("../database/db.cjs");

// Hector estuvo aqui c:
const { getImageUrl } = require("../helpers/get-image-url.cjs");
const moment = require("moment");
const bodyParser = require("body-parser");

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
        res.redirect("/admin/grupos");
      }
    }
  );
};

exports.savePartido = (req, res) => {
  const fecha = req.body.fecha;
  const codEstadio = req.body.codEstadio;
  const codTorneo = req.body.codTorneo;
  const codEquipo1 = req.body.codEquipo1;
  const codEquipo2 = req.body.codEquipo2;
  const codDeporte = req.body.codDeporte;
  const etapa = req.body.etapa;
  const jornada = req.body.jornada;
  const puntos1 = req.body.puntos1;
  const puntos2 = req.body.puntos2;

  conexion.query(
    "INSERT INTO partido SET ?",
    {
      fecha,
      codEstadio,
      codTorneo,
      codEquipo1,
      codEquipo2,
      codDeporte,
      etapa,
      jornada,
      puntos1,
      puntos2,
    },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "Error al insertar los datos" });
      } else {
        res.redirect("/admin/partidos");
      }
    }
  );
};

exports.updatePartido = (req, res) => {
  const bodyEntries = Object.entries(req.body);
  const equiposEntries = bodyEntries.filter(([key, value]) =>
    key.match(/^codEquipo\[[^\]]+\]$/)
  );
  const golesEntries = bodyEntries.filter(([key, value]) =>
    key.startsWith("goles")
  );
  const codJugadorEntries = bodyEntries.filter(([key, value]) =>
    key.startsWith("codJugador")
  );

  const codEquipo = equiposEntries.map(([key, value]) => value);

  const codJugador = codJugadorEntries.map(([key, value]) => value);
  const goles = golesEntries.map(([key, value]) => value);

  const codPartido = req.body.codPartido;
  const codTorneo = req.body.codTorneo;
  const codDeporte = req.body.codDeporte;
  const fecha = req.body.fecha;
  const codEstadio = req.body.codEstadio;
  const codEquipo1 = req.body.codEquipo1;
  const puntos1 = req.body.puntos1;
  const codEquipo2 = req.body.codEquipo2;
  const puntos2 = req.body.puntos2;
  const etapa = req.body.etapa;
  const jornada = req.body.jornada;

  const sql = `
  SELECT * FROM goleadores WHERE codPartido = ? AND codJugador IN (?)
  `;
  conexion.query(sql, [codPartido, codJugador], (error, results) => {
    if (error) {
      console.log(error);
      res.status(400).json({ msg: "Error al consultar goleadores" });
    } else {
      // Si no esta ese goleador en ese partido, se inserta
      if (results && results.length === 0) {
        // Definir la sentencia SQL para insertar los datos
        const sql = "INSERT INTO goleadores (codEquipo, codTorneo, codDeporte, codPartido, codJugador, goles) VALUES (?, ?, ?, ?, ?, ?)";

for (let i = 0; i < codJugador.length; i++) {
  const codEquipoItem = codEquipo[i];
  const codJugadorItem = codJugador[i];
  const golesItem = parseInt(goles[i], 10); // Convertir a número entero

  const valores = [
    codEquipoItem,
    codTorneo,
    codDeporte,
    codPartido,
    codJugadorItem,
    golesItem,
  ];

  conexion.query(sql, valores, (err, result) => {
    if (err) {
      console.log(err);
    }
  });
}

      } else {
        // si hay goleadores, entonces se actualizan


        const sql =
          "UPDATE goleadores SET goles = ? WHERE codDeporte = ? AND codEquipo = ? AND codTorneo = ? AND codPartido = ? AND codJugador = ?";

        for (let [i, gol] of goles.entries()) {
          const codEquipoItem = codEquipo[i];
          const codJugadorItem = codJugador[i];
          const golesInt = parseInt(gol); // convertir a número entero
          console.log(codEquipoItem)
          console.log(codJugadorItem)
          console.log(golesInt)
          const valores = [
            golesInt,
            codDeporte,
            codEquipoItem,
            codTorneo,
            codPartido,
            codJugadorItem,
          ];
          conexion.query(sql, valores, (err, result) => {
            if (err) throw err;
          });
        }

        if (error) {
          console.log(error);
        }
      }
      // actualizar el partido
      conexion.query(
        "UPDATE partido SET ? WHERE codPartido = ?",
        [
          {
            codTorneo,
            fecha,
            codEstadio,
            codDeporte,
            puntos1,
            puntos2,
            etapa,
            jornada,
            codEquipo1,
            codEquipo2,
          },
          codPartido,
        ],
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(400).json({ msg: "Error al actualizar el partido" });
          } else {
            res.redirect("/admin/partidos");
          }
        }
      );
    }
  });
};

// Equipos

exports.saveEquipo = (req, res) => {
  const { codDeporte, nombreEquipo } = req.body;

  console.log(req.headers);

  if (!req.file?.path) {
    conexion.query(
      "INSERT INTO equipos SET ?",
      {
        nombreEquipo,
        codDeporte,
      },
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(400).json({
            msg: "Este equipo, ya existe, crea otro con un nombre diferente",
          });
        } else {
          res.redirect("/admin/equipos");
        }
      }
    );
  } else {
    const filePath = getImageUrl(req.file.filename);
    conexion.query(
      "INSERT INTO equipos SET ?",
      {
        nombreEquipo,
        codDeporte,
        imagen: filePath,
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
  }
};

exports.updateEquipo = (req, res) => {
  const { codEquipo, nombreEquipo, codDeporte } = req.body;

  if (!req.file?.path) {
    // si imagen no existe
    conexion.query(
      "UPDATE equipos SET ? WHERE codEquipo = ?",
      [{ nombreEquipo: nombreEquipo, codDeporte: codDeporte }, codEquipo],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(400).json({ msg: "error" });
        } else {
          res.redirect("/admin/equipos");
        }
      }
    );
  } else {
    // si imagen existe
    const filePath = getImageUrl(req.file.filename);
    conexion.query(
      "UPDATE equipos SET ? WHERE codEquipo = ?",
      [
        {
          nombreEquipo: nombreEquipo,
          codDeporte: codDeporte,
          imagen: filePath,
        },
        codEquipo,
      ],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(400).json({ msg: "error" });
        } else {
          res.redirect("/admin/equipos");
        }
      }
    );
  }
};

// jugadores

exports.saveJugador = (req, res) => {
  const codCarrera = req.body.codCarrera;
  const nombreJugador = req.body.nombreJugador;
  const codEquipo = req.body.codEquipo;

  conexion.query(
    "INSERT INTO jugador SET ?",
    {
      codCarrera,
      nombreJugador,
      codEquipo,
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

exports.updateJugador = (req, res) => {
  const codJugador = req.body.codJugador;
  const nombreJugador = req.body.nombreJugador;
  const codEquipo = req.body.codEquipo;
  const codCarrera = req.body.codCarrera;

  conexion.query(
    "UPDATE jugador SET ? WHERE codJugador = ?",
    [
      {
        nombreJugador,
        codJugador,
        codEquipo,
        codCarrera,
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
        res.redirect("/admin/carreras");
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
        res.redirect("/admin/carreras");
      }
    }
  );
};

exports.saveEliminatoria = (req, res) => {
  const codEquipo = req.body.codEquipo;
  const codDeporte = req.body.codDeporte;
  const juegos_ganados = req.body.juegos_ganados;
  const juegos_perdidos = req.body.juegos_perdidos;
  const goles_a_favor = req.body.goles_a_favor;
  const goles_en_contra = req.body.goles_en_contra;
  const juegos_empate = req.body.juegos_empate;
  const diferencia_goles = req.body.diferencia_goles;
  const puntos = req.body.puntos;
  const juegos_jugados = req.body.juegos_jugados;
  const codTorneo = req.body.codTorneo;

  conexion.query(
    "INSERT INTO eliminatorias SET ?",
    {
      codEquipo,
      codDeporte,
      codTorneo,
      juegos_ganados,
      juegos_perdidos,
      goles_a_favor,
      goles_en_contra,
      juegos_empate,
      diferencia_goles,
      puntos,
      juegos_jugados,
    },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "Error al insertar los datos" });
      } else {
        res.redirect("/admin/eliminatorias");
      }
    }
  );
};

exports.updateEliminatoria = (req, res) => {
  const id = req.body.id;
  const codEquipo = req.body.codEquipo;
  const codTorneo = req.body.codTorneo;
  const juegos_jugados = req.body.juegos_jugados;
  const juegos_ganados = req.body.juegos_ganados;
  const juegos_empate = req.body.juegos_empate;
  const juegos_perdidos = req.body.juegos_perdidos;
  const goles_a_favor = req.body.goles_a_favor;
  const goles_en_contra = req.body.goles_en_contra;
  const diferencia_goles = req.body.diferencia_goles;
  const puntos = req.body.puntos;

  console.log(req.body);

  conexion.query(
    "UPDATE eliminatorias SET ? WHERE id = ?",
    [
      {
        juegos_ganados,
        juegos_perdidos,
        goles_a_favor,
        goles_en_contra,
        juegos_empate,
        diferencia_goles,
        puntos,
        juegos_jugados,
        codEquipo,
        codTorneo,
      },
      id,
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
        res.redirect("/admin/estadisticasIndividuales");
      }
    }
  );
};

exports.saveEGenerales = (req, res) => {
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

exports.saveEstadios = (req, res) => {
  const nombreEstadio = req.body.nombreEstadio;

  conexion.query(
    "INSERT INTO estadio SET ?",
    {
      nombreEstadio: nombreEstadio,
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

exports.updateEstadio = (req, res) => {
  const codEstadio = req.body.codEstadio;
  const nombreEstadio = req.body.nombreEstadio;
  conexion.query(
    "UPDATE estadio SET ? WHERE codEstadio = ?",
    [
      {
        nombreEstadio: nombreEstadio,
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

exports.saveDeporte = (req, res) => {
  const nombreDeporte = req.body.nombreDeporte;
  const tipoDeporte = req.body.tipoDeporte;

  conexion.query(
    "INSERT INTO deporte SET ?",
    { nombreDeporte: nombreDeporte, tipoDeporte: tipoDeporte },
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

exports.updateDeporte = (req, res) => {
  const nombreDeporte = req.body.nombreDeporte;
  const tipoDeporte = req.body.tipoDeporte;
  const id = req.body.id;

  conexion.query(
    "UPDATE deporte SET ? WHERE id = ?",
    [
      {
        nombreDeporte: nombreDeporte,
        tipoDeporte: tipoDeporte,
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

exports.saveRI = (req, res) => {
  const codJugador = req.body.codJugador;
  const puntos = req.body.puntos;
  const codDeporte = req.body.codDeporte;
  const codTorneo = req.body.codTorneo;

  conexion.query(
    "SELECT codCarrera FROM jugador WHERE codJugador=?",
    [codJugador],
    (error, carreras) => {
      if (error) {
        console.log(error);
        res.status(400).json({
          msg: "Error: El Jugador ya se encuenta en el Ranking de este deporte en este torneo",
        });
        return;
      }
      conexion.query(
        "INSERT INTO rankini SET ?",
        {
          codJugador: codJugador,
          puntos: puntos,
          codCarrera: carreras[0].codCarrera,
          codDeporte: codDeporte,
          codTorneo: codTorneo,
        },
        (error) => {
          if (error) {
            console.log(error);
            if (error.code === "ER_DUP_ENTRY") {
              res.status(400).json({
                msg: "Error: El Jugador ya se encuenta en el Ranking de este deporte para este torneo",
              });
            } else {
              res.status(400).json({ msg: "Ha Ocurrido un error inesperado" });
            }
          } else {
            res.redirect("admin/rankingIndividual");
          }
        }
      );
    }
  );
};

exports.updateRI = (req, res) => {
  const id = req.body.id;
  const puntos = req.body.puntos;
  const codCarrera = req.body.codCarrera;
  const codDeporte = req.body.codDeporte;
  const codJugador = req.body.codJugador;

  conexion.query(
    "UPDATE rankini SET ? WHERE id = ?",
    [{ puntos, codCarrera, codDeporte, codJugador }, id],
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

exports.saveRE = (req, res) => {
  const codEquipo = req.body.codEquipo;
  const puntos = req.body.puntos;
  const codDeporte = req.body.codDeporte;
  const codTorneo = req.body.codTorneo;

  conexion.query(
    "INSERT INTO rankinge SET ?",
    {
      codEquipo: codEquipo,
      puntos: puntos,
      codDeporte: codDeporte,
      codTorneo: codTorneo,
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
};

exports.updateRE = (req, res) => {
  const id = req.body.id;
  const puntos = req.body.puntos;
  const codDeporte = req.body.codDeporte;
  const codEquipo = req.body.codEquipo;
  const codTorneo = req.body.codTorneo;

  conexion.query(
    "UPDATE rankinge SET ? WHERE id = ?",
    [
      {
        puntos: puntos,
        codDeporte: codDeporte,
        codEquipo: codEquipo,
        codTorneo: codTorneo,
      },
      id,
    ],
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

// torneos crud

exports.saveTorneo = (req, res) => {
  const { nombreTorneo, fecha_inicio, fecha_fin } = req.body;

  conexion.query(
    "INSERT INTO torneos SET ?",
    {
      nombreTorneo,
      fecha_inicio,
      fecha_fin,
    },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "Error: Torneo Duplicado" });
      } else {
        res.redirect("/admin/torneos");
      }
    }
  );
};

exports.updateTorneo = (req, res) => {
  const { codTorneo, nombreTorneo, fecha_inicio, fecha_fin } = req.body;

  conexion.query(
    "UPDATE torneos SET ? WHERE codTorneo = ?",
    [{ codTorneo, nombreTorneo, fecha_inicio, fecha_fin }, codTorneo],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "Error: Fallo al actualizar torneo" });
      } else {
        res.redirect("/admin/torneos");
      }
    }
  );
};

exports.saveTorneoStatus = (req, res) => {
  const { codTorneo } = req.body;
  const sql = `
    UPDATE torneos
    SET status = 1
    WHERE codTorneo = ?;
  `;

  conexion.query(sql, [codTorneo, codTorneo], (error, results) => {
    if (error) {
      console.log(error);
      res.status(400).json({ msg: "Error: Fallo al actualizar torneo" });
    } else {
      const sql2 = `UPDATE torneos
      SET status = 0
      WHERE codTorneo != ? AND status != 0`;

      conexion.query(sql2, [codTorneo], (error, results) => {
        if (error) {
          console.log(error);
          res.status(400).json({ msg: "Error: Fallo al actualizar torneo" });
        } else {
          res.redirect("/admin/torneos");
        }
      });
    }
  });
};
