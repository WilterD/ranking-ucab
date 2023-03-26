import { Router } from "express";
import { static as estatico } from "express";
const router = Router();
import conexion from "../database/db.cjs";
import * as mycrud from "../controllers/crud.cjs";
// importar moment
import moment from "moment";
import multer from "multer";

import session from "express-session";
import flash from "connect-flash";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import { uploadImg } from "../helpers/imgUploader.cjs";
import { publicDir } from "../helpers/fileManager.cjs";

router.get("/admin/deleteEstadio/:codEstadio", (req, res) => {
  const codEstadio = req.params.codEstadio;
  conexion.query(
    "DELETE FROM estadio WHERE codEstadio = ?",
    [codEstadio],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/estadios");
      }
    }
  );
});

router.get("/admin/equipos", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM equipos", (error, equipos) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM deporte", (error, deporte) => {
        if (error) {
          console.log(error);
        } else {
          res.render("admin/equipos.ejs", {
            equipos: equipos,
            deporte: deporte,
          });
        }
      });
    }
  });
});

router.get("/admin/crearEquipo", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM deporte", (error, deporte) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/crearEquipo", { deporte: deporte });
    }
  });
});

router.get("/admin/editarEquipo/:codEquipo", (req, res) => {
  const codEquipo = req.params.codEquipo;
  conexion.query(
    "SELECT * FROM equipos WHERE codEquipo=?",
    [codEquipo],
    (error, equipos) => {
      if (error) {
        throw error;
      } else {
        conexion.query("SELECT * FROM deporte", (error, deporte) => {
          if (error) {
            throw error;
          } else {
            res.render("admin/editarEquipo.ejs", {
              equipo: equipos[0],
              deporte: deporte,
            });
          }
        });
      }
    }
  );
});

router.get("/admin/deleteEquipo/:codEquipo", (req, res) => {
  const codEquipo = req.params.codEquipo;
  conexion.query(
    "DELETE FROM equipos WHERE codEquipo = ?",
    [codEquipo],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/equipos");
      }
    }
  );
});

router.get("/admin/jugadores", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM jugador", (error, jugadores) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM carreras", (error, carrera) => {
        if (error) {
          console.log(error);
        } else {
          res.render("admin/jugadores.ejs", {
            jugadores: jugadores,
            carrera: carrera,
          });
        }
      });
    }
  });
});

router.get("/admin/crearJugador", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM jugador", (error, jugador) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM carreras", (error, carrera) => {
        if (error) {
          console.log(error);
        } else {
          conexion.query("SELECT * FROM equipos", (error, equipo) => {
            if (error) {
              console.log(error);
            } else {
              res.render("admin/crearJugador.ejs", {
                jugador: jugador,
                carrera: carrera,
                equipo: equipo,
              });
            }
          });
        }
      });
    }
  });
});

router.get("/admin/editarJugador/:codJugador", requireLogin, (req, res) => {
  const codJugador = req.params.codJugador;

  conexion.query(
    "SELECT * FROM jugador WHERE codJugador=?",
    [codJugador],
    (error, jugador) => {
      if (error) {
        throw error;
      } else {
        conexion.query("SELECT * FROM carreras", (error, carrera) => {
          if (error) {
            throw error;
          } else {
            conexion.query("SELECT * FROM equipos", (error, equipo) => {
              if (error) {
                throw error;
              } else {
                res.render("admin/editarJugador.ejs", {
                  jugador: jugador[0],
                  carrera: carrera,
                  equipo: equipo,
                });
              }
            });
          }
        });
      }
    }
  );
});

router.get("/admin/deleteJugador/:codJugador", requireLogin, (req, res) => {
  const codJugador = req.params.codJugador;
  conexion.query(
    "DELETE FROM jugador WHERE codJugador = ?",
    [codJugador],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/jugadores");
      }
    }
  );
});

router.get("/admin/crearGrupo", requireLogin, (req, res) => {
  res.render("admin/crearGrupo.ejs");
});

router.get("/admin/crearJugador", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM jugador", (error, jugador) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/crearJugador.ejs", { jugador: jugador });
    }
  });
});

router.get("/admin/carreras", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM carreras", (error, resultados) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/carreras", { resultados: resultados });
    }
  });
});

router.get("/admin/crearCarrera", requireLogin, (req, res) => {
  res.render("admin/crearCarrera.ejs");
});

router.get("/admin/editarCarrera/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  conexion.query(
    "SELECT * FROM carreras WHERE id=?",
    [id],
    (error, carrera) => {
      if (error) {
        throw error;
      } else {
        res.render("admin/editarCarrera.ejs", { carrera: carrera[0] });
      }
    }
  );
});

router.get("/admin/deleteCarrera/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  conexion.query(
    "DELETE FROM carreras WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/carreras");
      }
    }
  );
});

router.get("/admin/", requireLogin, (req, res) => {});

// Ruta para mostrar el enfrentamiento entre dos equipos
router.get("/admin/partidos", requireLogin, (req, res) => {
  // Realizar la consulta SQL
  const sql = `SELECT e1.nombreEquipo AS equipo1, e2.nombreEquipo AS equipo2, p.nombrePartido, p.fecha, p.nombreEstadio, p.nombreDeporte, p.codPartido
               FROM juegan j
               INNER JOIN equipos e1 ON j.codEquipo1 = e1.codEquipo
               INNER JOIN equipos e2 ON j.codEquipo2 = e2.codEquipo
               INNER JOIN partido p ON j.codPartido = p.codPartido
               `;

  conexion.query(sql, (error, partidos) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error al obtener los partidos");
    } else {
      let fecha = partidos.map((partido) => {
        // obtener los dias de la semana
        let fecha = new Date(partido.fecha);
        // dia lunes, martes, miercoles, jueves, viernes, sabado, domingo
        let dia = fecha.getDate();
        let mes = fecha.getMonth() + 1;
        let anio = fecha.getFullYear();
        let hora = fecha.getHours();
        let minutos = fecha.getMinutes();
        return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
      });

      res.render("admin/partidos.ejs", {
        partidos: partidos,
        fecha: fecha,
      });
    }
  });
});

router.get("/admin/editarPartido/:codPartido", (req, res) => {
  const codPartido = req.params.codPartido;
  // Realizar la consulta SQL
  const sql = `SELECT e1.nombreEquipo AS equipo1,e1.codEquipo AS codEquipo1, e2.codEquipo AS codEquipo2, e2.nombreEquipo AS equipo2, p.nombrePartido, p.fecha, p.nombreEstadio, p.nombreDeporte, p.codPartido
                 FROM juegan j
                 INNER JOIN equipos e1 ON j.codEquipo1 = e1.codEquipo
                 INNER JOIN equipos e2 ON j.codEquipo2 = e2.codEquipo
                 INNER JOIN partido p ON j.codPartido = p.codPartido
                  WHERE p.codPartido = ?`;

  conexion.query(sql, [codPartido], (error, partidos) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error al obtener los partidos");
    } else {
      let fecha = partidos.map((partido) => {
        // obtener los dias de la semana

        let fecha = new Date(partido.fecha);
        // dia lunes, martes, miercoles, jueves, viernes, sabado, domingo
        let dia = fecha.getDate();
        let mes = fecha.getMonth() + 1;
        let anio = fecha.getFullYear();
        let hora = fecha.getHours();
        let minutos = fecha.getMinutes();
        return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
      });

      conexion.query("SELECT * FROM equipos", (error, equipos) => {
        if (error) {
          console.log(error);
        } else {
          conexion.query("SELECT * FROM estadio", (error, estadios) => {
            if (error) {
              console.log(error);
            } else {
              res.render("admin/editarPartido.ejs", {
                partidos: partidos,
                fecha: fecha,
                equipos: equipos,
                estadios: estadios,
              });
            }
          });
        }
      });
    }
  });
});

router.get("/admin/crearPartido", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM jornadas", (error, jornadas) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM estadio", (error, estadios) => {
        if (error) {
          console.log(error);
        } else {
          conexion.query("SELECT * FROM equipos", (error, equipos) => {
            if (error) {
              console.log(error);
            } else {
              conexion.query("SELECT * FROM carreras", (error, carrera) => {
                if (error) {
                  console.log(error);
                } else {
                  conexion.query("SELECT * FROM deporte", (error, deporte) => {
                    if (error) {
                      console.log(error);
                    } else {
                      conexion.query(
                        "SELECT * FROM jugador",
                        (error, jugadores) => {
                          if (error) {
                            console.log(error);
                          } else {
                            res.render("admin/crearPartido.ejs", {
                              jornadas: jornadas,
                              estadios: estadios,
                              equipos: equipos,
                              carrera: carrera,
                              deporte: deporte,
                              jugadores: jugadores,
                            });
                          }
                        }
                      );
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

router.get("/admin/deletePartido/:codPartido", requireLogin, (req, res) => {
  const codPartido = req.params.codPartido;
  conexion.query(
    "DELETE FROM partido WHERE codPartido = ?",
    [codPartido],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/partidos");
      }
    }
  );
});

router.get("/admin/crearGrupo", requireLogin, (req, res) => {
  res.render("admin/crearGrupo.ejs");
});

router.get("/admin/grupos", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM grupo", (error, grupos) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/grupos", { grupos: grupos });
    }
  });
});

router.get("/admin/deleteGrupo/:letraGrupo", requireLogin, (req, res) => {
  const letraGrupo = req.params.letraGrupo;
  conexion.query(
    "DELETE FROM grupo WHERE letraGrupo = ?",
    [letraGrupo],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/grupos");
      }
    }
  );
});

router.get("/admin/eliminatorias", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM eliminatorias", (error, eliminatoria) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/eliminatorias.ejs", { eliminatoria: eliminatoria });
    }
  });
});

router.get("/admin/crearEliminatoria", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM equipos", (error, equipos) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/crearEliminatoria.ejs", { equipos: equipos });
    }
  });
});

router.get("/admin/deleteEliminatoria/:codEquipo", requireLogin, (req, res) => {
  const codEquipo = req.params.codEquipo;
  console.log(codEquipo);
  conexion.query(
    "DELETE FROM eliminatorias WHERE codEquipo = ?",
    [codEquipo],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/eliminatorias");
      }
    }
  );
});

router.get("/admin/editarEliminatoria/:codEquipo", requireLogin, (req, res) => {
  const codEquipo = req.params.codEquipo;
  conexion.query(
    "SELECT * FROM eliminatorias WHERE codEquipo=?",
    [codEquipo],
    (error, eliminatoria) => {
      if (error) {
        throw error;
      } else {
        res.render("admin/editarEliminatoria.ejs", {
          eliminatoria: eliminatoria[0],
        });
      }
    }
  );
});

router.get("/admin/crearEIndividuales", requireLogin, (req, res) => {
  conexion.query(
    "SELECT * FROM estadisticasIndividuales",
    (error, individuales) => {
      if (error) {
        console.log(error);
      } else {
        conexion.query("SELECT * FROM jugador", (error, jugadores) => {
          if (error) {
            console.log(error);
          } else {
            conexion.query("SELECT * FROM partido", (error, partida) => {
              if (error) {
                console.log(error);
              } else {
                res.render("admin/crearEIndividuales.ejs", {
                  individuales: individuales,
                  jugadores: jugadores,
                  partida: partida,
                });
              }
            });
          }
        });
      }
    }
  );
});

router.get(
  "/admin/editarEIndividuales/:CodJugador+CodPartida",
  requireLogin,
  (req, res) => {
    const codJugador = req.params.codJugador;
    conexion.query(
      "SELECT * FROM estadisticasIndividuales WHERE codJugador=?",
      [codJugador],
      (error, CJugador) => {
        if (error) {
          throw error;
        } else {
          conexion.query("SELECT codJugador FROM jugador", (error, estI) => {
            if (error) {
              console.log(error);
            } else {
              res.render("admin/editarEIndividuales.ejs", {
                CJugador: CJugador[0],
                estI: estI,
              });
            }
          });
        }
      }
    );
  }
);

router.get("/admin/estadisticasGenerales", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM estadisticasGenerales", (error, generales) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/estadisticasGenerales.ejs", { generales: generales });
    }
  });
});

router.get("/admin/crearEGenerales", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM estadisticasGenerales", (error, generales) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM equipos", (error, equipo) => {
        if (error) {
          console.log(error);
        } else {
          conexion.query("SELECT * FROM partido", (error, partida) => {
            if (error) {
              console.log(error);
            } else {
              res.render("admin/crearEGenerales.ejs", {
                generales: generales,
                equipo: equipo,
                partida: partida,
              });
            }
          });
        }
      });
    }
  });
});

router.get(
  "/deleteEstadisticasGenerales/:codEquipo-:codPartido",
  requireLogin,
  (req, res) => {
    const codEquipo = req.params.codEquipo;
    const codPartido = req.params.codPartido;
    conexion.query(
      "DELETE FROM estadisticasgenerales WHERE codEquipo = ? AND codPartido = ?",
      [codEquipo, codPartido],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.redirect("/admin/estadisticasGenerales");
        }
      }
    );
  }
);

router.get("/admin/estadisticasIndividuales", requireLogin, (req, res) => {
  conexion.query(
    "SELECT * FROM estadisticasIndividuales",
    (error, individuales) => {
      if (error) {
        console.log(error);
      } else {
        res.render("admin/estadisticasIndividuales.ejs", {
          individuales: individuales,
        }); //render muestra el archivo ejs
      }
    }
  );
});

router.get(
  "/admin/editarEstadisticasGenerales/:codEquipo-:codPartido",
  requireLogin,
  (req, res) => {
    const codEquipo = req.params.codEquipo;
    const codPartido = req.params.codPartido;

    conexion.query(
      "SELECT * FROM estadisticasgenerales WHERE codEquipo=? AND codPartido=?",
      [codEquipo, codPartido],
      (error, generales) => {
        if (error) {
          throw error;
        } else {
          res.render("admin/editarEstadisticasGenerales.ejs", {
            generales: generales[0],
          });
        }
      }
    );
  }
);

router.get("/admin/estadios", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM estadio", (error, estadios) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/estadios.ejs", { estadios: estadios }); //render muestra el archivo ejs
    }
  });
});

router.get("/admin/crearEstadio", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM estadio", (error, estadios) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/crearEstadio.ejs", {
        estadios: estadios,
      });
    }
  });
});

router.get("/admin/editarEstadio/:codEstadio", requireLogin, (req, res) => {
  const codEstadio = req.params.codEstadio;
  conexion.query(
    "SELECT * FROM estadio WHERE codEstadio=?",
    [codEstadio],
    (error, estadio) => {
      if (error) {
        throw error;
      } else {
        res.render("admin/editarEstadio.ejs", {
          estadio: estadio[0],
        });
      }
    }
  );
});

router.get("/admin/jornadas", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM jornadas", (error, jornadas) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM deporte", (error, deporte) => {
        if (error) {
          console.log(error);
        } else {
          // formatear fecha del objeto partidos
          let fecha = jornadas.map((jornadas) => {
            // obtener los dias de la semana
            let fecha = new Date(jornadas.fecha);
            let dia = fecha.getDate();
            let mes = fecha.getMonth() + 1;
            let anio = fecha.getFullYear();
            let hora = fecha.getHours();
            let minutos = fecha.getMinutes();
            return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
          });
          res.render("admin/jornadas.ejs", {
            jornadas: jornadas,
            fecha: fecha,
            deporte: deporte,
          }); //render muestra el archivo ejs
        }
      });
    }
  });
});

router.get("/admin/crearJornada", requireLogin, (req, res) => {
  res.render("admin/crearJornada.ejs");
});

router.get("/admin/deleteJornadas/:fecha", requireLogin, (req, res) => {
  const fecha = req.params.fecha;
  conexion.query(
    "DELETE FROM jornadas WHERE fecha = ?",
    [fecha],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/jornadas");
      }
    }
  );
});

router.get("/admin/deportes", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM deporte", (error, deporte) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/deportes.ejs", { deporte: deporte }); //render muestra el archivo ejs
    }
  });
});

router.get("/admin/crearDeporte", requireLogin, (req, res) => {
  res.render("admin/crearDeporte.ejs");
});

router.get("/admin/editarDeporte/:id", requireLogin, (req, res) => {
  const id = req.params.id;

  conexion.query("SELECT * FROM deporte WHERE id=?", [id], (error, deporte) => {
    if (error) {
      throw error;
    } else {
      res.render("admin/editarDeporte.ejs", { deporte: deporte[0] });
    }
  });
});

router.get("/admin/deleteDeporte/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  conexion.query("DELETE FROM deporte WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/admin/deportes");
    }
  });
});

router.get("/admin/rankingIndividual", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM rankini", (error, rankini) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/rankingIndividual.ejs", { rankini: rankini }); //render muestra el archivo ejs
    }
  });
});

router.get("/admin/crearRankingIndividual", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM jugador", (error, jugadores) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM deporte", (error, deportes) => {
        if (error) {
          console.log(error);
        } else {
          res.render("admin/crearRankingIndividual.ejs", {
            jugadores: jugadores,
            deportes: deportes,
          });
        }
      });
    }
  });
});

router.get("/admin/editarRankingRI/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  conexion.query(
    "SELECT * FROM rankini WHERE id=?",
    [id],
    (error, rankingRI) => {
      if (error) {
        throw error;
      } else {
        res.render("admin/editarRankingRI.ejs", {
          rankingRI: rankingRI[0],
        });
      }
    }
  );
});

router.get("/admin/deleteRI/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  conexion.query("DELETE FROM rankini WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/admin/rankingIndividual");
    }
  });
});

// Ranking Equipos

router.get("/admin/rankingEquipos", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM rankinge", (error, rankinge) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/rankingEquipos.ejs", { rankinge: rankinge }); //render muestra el archivo ejs
    }
  });
});

router.get("/admin/crearRankingEquipos", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM equipos", (error, equipos) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM deporte", (error, deportes) => {
        if (error) {
          console.log(error);
        } else {
          res.render("admin/crearRankingEquipos.ejs", {
            equipos: equipos,
            deportes: deportes,
          });
        }
      });
    }
  });
});

router.get("/admin/editarRankingRE/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  conexion.query(
    "SELECT * FROM rankinge WHERE id=?",
    [id],
    (error, rankingRE) => {
      if (error) {
        throw error;
      } else {
        res.render("admin/editarRankingRE.ejs", {
          rankingRE: rankingRE[0],
        });
      }
    }
  );
});

router.get("/admin/deleteRE/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  conexion.query(
    "DELETE FROM rankinge WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/rankingEquipos");
      }
    }
  );
});

function queryDatabase(sql) {
  return new Promise((resolve, reject) => {
    conexion.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

//WHERE (e1.nombreEquipo = 'NombreEquipo1' AND e2.nombreEquipo = 'NombreEquipo2') OR (e1.nombreEquipo = 'NombreEquipo2' AND e2.nombreEquipo = 'NombreEquipo1')
router.get("/admin/resultados", requireLogin,(req, res) => {
  conexion.query("SELECT r.fecha, r.jornada, r.id, e1.nombreEquipo AS equipo1, r.puntos1, e2.nombreEquipo AS equipo2, r.puntos2  FROM resultados r INNER JOIN equipos e1 ON r.codEquipo1 = e1.codEquipo INNER JOIN equipos e2 ON r.codEquipo2 = e2.codEquipo",
    (error, resultados) => {
      if (error) {
        console.log(error);
      } else {
        let fechaResultados = resultados.map((resultados) => {
          // obtener los dias de la semana
          let fechaResultados = new Date(resultados.fecha);

          let dia = fechaResultados.getDate();
          let mes = fechaResultados.getMonth() + 1;
          let anio = fechaResultados.getFullYear();

          fechaResultados = `${dia}/${mes}/${anio}`;

          return fechaResultados;
        });
        res.render("admin/resultados.ejs", {
          resultados: resultados,
          fechaResultados: fechaResultados,
        });
      }
    }
  );
});

router.get("/admin/deleteResultados/:id", (req, res) => {
  const id = req.params.id;
  conexion.query(
    "DELETE FROM resultados WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/resultados");
      }
    }
  );
});

router.get("/admin/CrearResultados", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM equipos", (error, equipos) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM deporte", (error, deportes) => {
        if (error) {
          console.log(error);
        } else {
          res.render("admin/crearResultados.ejs", {
            deportes: deportes,
            equipos: equipos,
          });
        }
      });
    }
  });
});

router.get("/admin/deleteResultados/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  conexion.query(
    "DELETE FROM resultados WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/resultados");
      }
    }
  );
});

// login y registro

// Ruta de dashboard protegida
router.get("/admin/dashboard", requireLogin, (req, res) => {
  // Verificar que el usuario haya iniciado sesión
  conexion.query(
    "SELECT COUNT(*) AS cantidadDeportes FROM deporte",
    (error, deportes) => {
      if (error) {
        console.log(error);
      } else {
        conexion.query(
          "SELECT COUNT(*) AS cantidadEquipos FROM equipos",
          (error, resultadosEquipos) => {
            if (error) {
              console.log(error);
            } else {
              conexion.query(
                "SELECT COUNT(*) AS cantidadJugadores FROM jugador",
                (error, resultadosJugadores) => {
                  if (error) {
                    console.log(error);
                  } else {
                    conexion.query(
                      "SELECT COUNT(*) AS cantidadEstadios FROM estadio",
                      (error, resultadosEstadios) => {
                        if (error) {
                          console.log(error);
                        } else {
                          conexion.query(
                            "SELECT COUNT(*) AS cantidadPartidos FROM partido",
                            (error, resultadosPartidos) => {
                              if (error) {
                                console.log(error);
                              } else {
                                conexion.query(
                                  "SELECT COUNT(*) AS cantidadCarreras FROM carreras",
                                  (error, resultadosCarreras) => {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      res.render("admin/dashboard", {
                                        cantidadDeportes:
                                          deportes[0].cantidadDeportes,
                                        cantidadEquipos:
                                          resultadosEquipos[0].cantidadEquipos,
                                        cantidadJugadores:
                                          resultadosJugadores[0]
                                            .cantidadJugadores,
                                        cantidadEstadios:
                                          resultadosEstadios[0]
                                            .cantidadEstadios,
                                        cantidadPartidos:
                                          resultadosPartidos[0]
                                            .cantidadPartidos,
                                        cantidadCarreras:
                                          resultadosCarreras[0]
                                            .cantidadCarreras,
                                      });
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});


router.get(['/', '/home'], (req, res) => {
  conexion.query(
    "SELECT e1.nombreEquipo AS equipo1, e2.nombreEquipo AS equipo2,e1.imagen AS imagen1, e2.imagen AS imagen2, p.nombrePartido, p.fecha, p.nombreEstadio, p.nombreDeporte, p.codPartido FROM juegan j INNER JOIN equipos e1 ON j.codEquipo1 = e1.codEquipo INNER JOIN equipos e2 ON j.codEquipo2 = e2.codEquipo INNER JOIN partido p ON j.codPartido = p.codPartido",
    (error, partidos) => {
      if (error) {
        console.log(error);
      } else {
        conexion.query("SELECT DISTINCT d.nombreDeporte ,d.id FROM deporte d LEFT JOIN rankini r ON d.nombreDeporte = r.nombreDeporte LEFT JOIN rankinge re ON d.nombreDeporte = re.nombreDeporte WHERE r.nombreJugador IS NOT NULL OR re.nombreEquipo IS NOT NULL;", (error, deportes) => {
          if (error) {
            console.log(error);
          } else {
            conexion.query(
              "SELECT * FROM eliminatorias",
              (error, eliminatoria) => {
                if (error) {
                  console.log(error);
                } else {
                  conexion.query(
                    "SELECT r.fecha, r.jornada, e1.nombreEquipo AS equipo1, e1.imagen AS imagen1, e2.imagen AS imagen2, r.puntos1, e2.nombreEquipo AS equipo2, r.puntos2  FROM resultados r INNER JOIN equipos e1 ON r.codEquipo1 = e1.codEquipo INNER JOIN equipos e2 ON r.codEquipo2 = e2.codEquipo",
                    (error, resultados) => {
                      if (error) {
                        console.log(error);
                      } else {
                        conexion.query(
                          "SELECT * FROM juegan",
                          (error, juegan) => {
                            if (error) {
                              console.log(error);
                            } else {
                              let fechaPartidos = partidos.map((partido) => {
                                // obtener los dias de la semana
                                let fechaPartidos = new Date(partido.fecha);

                                let dia = fechaPartidos.getDate();
                                let mes = fechaPartidos.getMonth() + 1;
                                let hora = fechaPartidos.getHours();
                                let minutos = fechaPartidos.getMinutes();
                                let nombreMes = " ";

                                switch (mes) {
                                  case 1:
                                    nombreMes = "Enero";
                                    break;
                                  case 2:
                                    nombreMes = "Febrero";
                                    break;
                                  case 3:
                                    nombreMes = "Marzo";
                                    break;
                                  case 4:
                                    nombreMes = "Abril";
                                    break;
                                  case 5:
                                    nombreMes = "Mayo";
                                    break;
                                  case 6:
                                    nombreMes = "Junio";
                                    break;
                                  case 7:
                                    nombreMes = "Julio";
                                    break;
                                  case 8:
                                    nombreMes = "Agosto";
                                    break;
                                  case 9:
                                    nombreMes = "Septiembre";
                                    break;
                                  case 10:
                                    nombreMes = "Octubre";
                                    break;
                                  case 11:
                                    nombreMes = "Noviembre";
                                    break;
                                  case 12:
                                    nombreMes = "Diciembre";
                                    break;
                                }

                                fechaPartidos = `${dia} de ${nombreMes} - ${hora}:${minutos}`;

                                return fechaPartidos;
                              });
                              let fechaResultados = resultados.map(
                                (resultados) => {
                                  // obtener los dias de la semana
                                  let fechaResultados = new Date(
                                    resultados.fecha
                                  );

                                  let dia = fechaResultados.getDate();
                                  let mes = fechaResultados.getMonth() + 1;
                                  let nombreMes = " ";

                                  switch (mes) {
                                    case 1:
                                      nombreMes = "Enero";
                                      break;
                                    case 2:
                                      nombreMes = "Febrero";
                                      break;
                                    case 3:
                                      nombreMes = "Marzo";
                                      break;
                                    case 4:
                                      nombreMes = "Abril";
                                      break;
                                    case 5:
                                      nombreMes = "Mayo";
                                      break;
                                    case 6:
                                      nombreMes = "Junio";
                                      break;
                                    case 7:
                                      nombreMes = "Julio";
                                      break;
                                    case 8:
                                      nombreMes = "Agosto";
                                      break;
                                    case 9:
                                      nombreMes = "Septiembre";
                                      break;
                                    case 10:
                                      nombreMes = "Octubre";
                                      break;
                                    case 11:
                                      nombreMes = "Noviembre";
                                      break;
                                    case 12:
                                      nombreMes = "Diciembre";
                                      break;
                                  }

                                  fechaResultados = `${dia} de ${nombreMes}`;

                                  return fechaResultados;
                                }
                              );
                              res.render("home.ejs", {
                                deportes: deportes,
                                eliminatoria: eliminatoria,
                                resultados: resultados,
                                partidos: partidos,
                                juegan: juegan,
                                fechaPartidos: fechaPartidos,
                                fechaResultados: fechaResultados,
                              }); //render muestra el archivo ejs
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    }
  );
});

router.get("/rankingE", (req, res) => {
  conexion.query("SELECT * FROM rankinge", (error, rankinge) => {
    if (error) {
      console.log(error);
    } else {
      res.render("rankingE.ejs", { rankinge: rankinge }); //render muestra el archivo ejs
    }
  });
});

router.get("/deportes-:id", (req, res) => {
  let id = req.params.id;
  conexion.query("SELECT * FROM rankinge", (error, rankinge) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM rankini", (error, ranking) => {
        if (error) {
          console.log(error);
        } else {
          conexion.query("SELECT * FROM deporte", (error, deportes) => {
            if (error) {
              console.log(error);
            } else {
              conexion.query(
                "SELECT * FROM deporte WHERE id=?",
                [id],
                (error, deporte) => {
                  if (error) {
                    console.log(error);
                    throw error;
                  } else {
                    if (deporte[0].tipoDeporte == "Individual") {
                      res.render("ranking.ejs", {
                        ranking: ranking,
                        deportes: deportes,
                        deporte: deporte[0],
                      }); //render muestra el archivo ejs
                    } else if (deporte[0].tipoDeporte == "Equipos") {
                      res.render("rankingE.ejs", {
                        rankinge: rankinge,
                        deportes: deportes,
                        deporte: deporte[0],
                      });
                    }
                  }
                }
              );
            }
          });
        }
      });
    }
  });
});

// IMAGEN

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// login



//registro

// Middleware para restringir el acceso a páginas que requieren inicio de sesión
function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    // Obtener el usuario de la base de datos
    conexion.query(
      "SELECT * FROM users WHERE id = ?",
      [req.session.userId],
      (error, results) => {
        if (results.length > 0) {
          const user = results[0];
          if (user.status === "active") {
            // El usuario está activo, continuar con la lógica de autenticación
            return next();
          } else {
            // El usuario no está activo, redirigir a una página de error o mostrar un mensaje de error
            req.flash("message", "Tu cuenta no está activa.");
            res.redirect("/login");
          }
        } else {
          // No se encontró el usuario en la base de datos, redirigir a una página de error o mostrar un mensaje de error
          req.flash("Ha ocurrido un error");
        }
      }
    );
  } else {
    // El usuario no ha iniciado sesión, redirigir a la página de inicio de sesión
    res.redirect("/login");
  }
}

router.use("/admin", requireLogin);

router.post("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/home");
    }
  });
});

// Guardar registros
router.post("/saveGrupo", mycrud.saveGrupo);
router.post("/saveJugador", mycrud.saveJugador);

router.post("/saveEquipo", uploadImg, mycrud.saveEquipo);

router.post("/saveCarrera", mycrud.saveCarrera);
router.post("/savePartido", mycrud.savePartido);
router.post("/saveEliminatoria", mycrud.saveEliminatoria);
router.post("/saveEIndividuales", mycrud.saveEIndividuales);
router.post("/saveEGenerales", mycrud.saveEGenerales);
router.post("/saveEstadios", mycrud.saveEstadios);
router.post("/saveJornada", mycrud.saveJornada);
router.post("/saveDeporte", mycrud.saveDeporte);
router.post("/saveRI", mycrud.saveRI);
router.post("/saveRE", mycrud.saveRE);
router.post("/saveResultados", mycrud.saveResultados);

// actualizar registros
router.post("/updateJugador", mycrud.updateJugador);
router.post("/updateEquipo", mycrud.updateEquipo);
router.post("/updateCarrera", mycrud.updateCarrera);
router.post("/updatePartido", mycrud.updatePartido);
router.post("/updateEliminatoria", mycrud.updateEliminatoria);
router.post("/updateEstadio", mycrud.updateEstadio);
router.post("/updateEstadisticasGenerales", mycrud.updateEstadisticasGenerales);
router.post("/updateDeporte", mycrud.updateDeporte);
router.post("/updateRI", mycrud.updateRI);
router.post("/updateRE", mycrud.updateRE);

export default router;
