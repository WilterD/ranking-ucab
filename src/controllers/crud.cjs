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

  // Actualizar el partido primero
  const partidoValues = {
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
  };

  conexion.query(
    "UPDATE partido SET ? WHERE codPartido = ?",
    [partidoValues, codPartido],
    (errorPartido) => {
      if (errorPartido) {
        console.log(errorPartido);
        return res.status(400).json({ msg: "Error al actualizar el partido" });
      }

      // Función para actualizar o insertar goleadores
      const updateGoleadores = () => {
        const insertOrUpdateGoleadores = (index) => {
          if (index < codJugador.length) {
            const codEquipoItem = codEquipo[index];
            const codJugadorItem = codJugador[index];
            const golesItem = parseInt(goles[index], 10);

            const sql = `
              INSERT INTO goleadores (codEquipo, codTorneo, codDeporte, codPartido, codJugador, goles) 
              VALUES (?, ?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE goles = ?;
            `;
            const valores = [
              codEquipoItem,
              codTorneo,
              codDeporte,
              codPartido,
              codJugadorItem,
              golesItem,
              golesItem,
            ];

            conexion.query(sql, valores, (err, result) => {
              if (err) {
                console.log(err);
              }
              insertOrUpdateGoleadores(index + 1);
            });
          } else {
            res.redirect("/admin/partidos");
          }
        };

        insertOrUpdateGoleadores(0);
      };

      // Verificar si se enviaron datos de goleadores
      if (codJugador && codJugador.length > 0 && goles && goles.length > 0) {
        updateGoleadores();
      } else {
        res.redirect("/admin/partidos");
      }
    }
  );
};

// Equipos

exports.saveEquipo = (req, res) => {
  const { codDeporte, nombreEquipo } = req.body;

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
  const nombreJugador = req.body.nombreJugador;
  const codCarrera = req.body.codCarrera;

  const codEquipos = Object.keys(req.body)
    .filter((key) => key.startsWith("codEquipo"))
    .map((key) => req.body[key]);

  conexion.query(
    "INSERT INTO jugador (nombreJugador, codCarrera) VALUES (?, ?)",
    [nombreJugador, codCarrera],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "Error al guardar el jugador" });
      } else {
        // Obtener el ID del jugador recién insertado
        const jugadorId = results.insertId;
        // Insertar las relaciones entre el jugador y los equipos seleccionados en 'jugadores_equipos'
        codEquipos.forEach((codEquipo) => {
          conexion.query(
            "INSERT INTO jugadores_equipos (codJugador, codEquipo) VALUES (?, ?)",
            [jugadorId, codEquipo],
            (error) => {
              if (error) {
                console.log(error);
                res
                  .status(400)
                  .json({ msg: "Error al guardar la relación jugador-equipo" });
              }
            }
          );
        });

        res.redirect("/admin/jugadores");
      }
    }
  );
};

exports.updateJugador = (req, res) => {
  const codEquipos = Object.keys(req.body)
    .filter((key) => key.startsWith("codEquipo"))
    .map((key) => req.body[key]);

  const codJugador = req.body.codJugador;
  const nombreJugador = req.body.nombreJugador;
  const codCarrera = req.body.codCarrera;

  conexion.query(
    "UPDATE jugador SET ? WHERE codJugador = ?",
    [
      {
        nombreJugador,
        codJugador,
        codCarrera,
      },
      codJugador,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).json({ msg: "error" });
      } else {
        // insertar nuevos equipos del jugador
        codEquipos.forEach((codEquipo) => {
          conexion.query(
            "INSERT INTO jugadores_equipos (codJugador, codEquipo) VALUES (?, ?)",
            [codJugador, codEquipo],
            (error) => {
              if (error) {
                console.log(error);
                res
                  .status(400)
                  .json({ msg: "Error al guardar la relación jugador-equipo" });
              }
            }
          );
        });

        // Redirige a admin/jugadores después de completar la edición
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
  const codUniversidad = 1; // Codigo universidad, puede variar dependiendo del tipo de user

  conexion.query(
    "SELECT codCarrera FROM jugador WHERE codJugador=?",
    [codJugador],
    (error, carreras) => {
      if (error) {
        console.log(error);
        res.status(400).json({
          msg: "Error",
        });
      } else {
        // seleccionar nombre del jugador
        conexion.query(
          "SELECT nombreJugador FROM jugador WHERE codJugador=?",
          [codJugador],
          (error, jugador) => {
            if (error) {
              console.log(error);
              res.status(400).json({
                msg: "Error",
              });
            } else {
              conexion.query(
                "INSERT INTO rankini SET ?",
                {
                  codJugador: codJugador,
                  puntos: puntos,
                  codCarrera: carreras[0].codCarrera,
                  codDeporte: codDeporte,
                  codTorneo: codTorneo,
                  nombreJugador: jugador[0].nombreJugador,
                  codUniversidad: codUniversidad,
                },
                (error) => {
                  if (error) {
                    console.log(error);
                    if (error.code === "ER_DUP_ENTRY") {
                      res.status(400).json({
                        msg: "Error: El Jugador ya se encuenta en el Ranking de este deporte para este torneo",
                      });
                    } else {
                      res
                        .status(400)
                        .json({ msg: "Ha Ocurrido un error inesperado" });
                    }
                  } else {
                    res.redirect(`/admin/ranking/${codDeporte}`);
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

  //nombre del equipo
  conexion.query(
    "SELECT nombreEquipo FROM equipos WHERE codEquipo=?",
    [codEquipo],
    (error, nombreEquipo) => {
      if (error) {
        console.log(error);
        res.status(400).json({
          msg: "Error",
        });
      } else {
        conexion.query(
          "INSERT INTO rankinge SET ?",
          {
            codEquipo,
            puntos,
            codDeporte,
            codTorneo,
            nombreEquipo: nombreEquipo[0].nombreEquipo,
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
    }
  );
};

exports.updateRE = (req, res) => {
  const id = req.body.id;
  const puntos = req.body.puntos;

  conexion.query(
    "UPDATE rankinge SET ? WHERE id = ?",
    [
      {
        puntos: puntos,
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
    WHERE codTorneo = ?`;

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
