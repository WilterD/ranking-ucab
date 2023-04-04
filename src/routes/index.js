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
  conexion.query(
    "SELECT e.codEquipo,e.nombreEquipo, d.nombreDeporte, e.imagen FROM equipos e JOIN deporte d ON e.codDeporte = d.id",
    (error, equipos) => {
      if (error) {
        console.log(error);
      } else {
        res.render("admin/equipos.ejs", {
          equipos: equipos,
        });
      }
    }
  );
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

router.get("/admin/editarEquipo/:codEquipo", requireLogin, (req, res) => {
  const codEquipo = req.params.codEquipo;
  conexion.query(
    "SELECT e.codEquipo, e.nombreEquipo, e.codDeporte, d.nombreDeporte FROM equipos e JOIN deporte d ON e.codDeporte = d.id WHERE codEquipo=?",
    [codEquipo],
    (error, equipos) => {
      if (error) {
        throw error;
      } else {
        conexion.query("SELECT * FROM deporte", (error, deportes) => {
          if (error) {
            throw error;
          } else {
            res.render("admin/editarEquipo.ejs", {
              equipo: equipos[0],
              deportes: deportes,
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
  conexion.query(
    "SELECT j.codJugador, j.nombreJugador, j.codCarrera, c.id, COALESCE(e.nombreEquipo, 'Sin Equipo') AS nombreEquipo, c.nombreCarrera FROM jugador j JOIN carreras c ON j.codCarrera = c.id LEFT JOIN equipos e ON j.codEquipo = e.codEquipo; ",
    (error, jugadores) => {
      if (error) {
        console.log(error);
      } else {
        res.render("admin/jugadores.ejs", {
          jugadores: jugadores,
        });
      }
    }
  );
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
  // SELECT e1.nombreEquipo AS equipo1, e2.nombreEquipo AS equipo2,
  const sql = `SELECT e1.nombreEquipo AS equipo1, e2.nombreEquipo AS equipo2, p.nombrePartido,p.jornada, p.puntos1,p.codPartido, p.puntos2, p.etapa, p.fecha, e.nombreEstadio, d.nombreDeporte, d.tipoDeporte
  FROM partido p
  INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo
  INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo
  JOIN estadio e ON p.codEstadio = e.codEstadio
  JOIN deporte d ON p.codDeporte = d.id;
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
  const { codPartido } = req.params;

  conexion.query(
    "SELECT p.codPartido, d.id, d.nombreDeporte, p.codEstadio, p.codEquipo1, p.codEquipo2, e1.nombreEquipo AS equipo1, e2.nombreEquipo AS equipo2, p.nombrePartido, es.nombreEstadio, p.jornada, p.fecha, p.etapa, p.puntos1, p.puntos2, p.codDeporte FROM partido p INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo INNER JOIN estadio es ON p.codEstadio = es.codEstadio INNER JOIN deporte d ON p.codDeporte = d.id WHERE p.codPartido = ?",
    [codPartido],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        conexion.query("SELECT * FROM estadio", (error, estadios) => {
          if (error) {
            console.log(error);
          } else {
            conexion.query(
              "SELECT * FROM equipos WHERE codDeporte = ?",
              [results[0].codDeporte],
              (error, equipos) => {
                if (error) {
                  console.log(error);
                } else {
                  conexion.query("SELECT * FROM deporte", (error, deporte) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log(results[0]);
                      res.render("admin/editarPartido.ejs", {
                        partido: results[0],
                        estadios: estadios,
                        equipos: equipos,
                        deporte: deporte,
                      });
                    }
                  });
                }
              }
            );
          }
        });
      }
    }
  );
});

router.get("/admin/crearPartido", requireLogin, (req, res) => {
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

router.get("/admin/usuarios", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM users", (error, usuarios) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/usuarios", { usuarios: usuarios });
    }
  });
});

router.get("/admin/deleteUsuarios/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  conexion.query(
    "DELETE FROM users WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/usuarios");
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
  conexion.query(
    "SELECT r.id,j.nombreJugador,c.nombreCarrera, d.nombreDeporte,r.puntos FROM rankini r JOIN carreras c ON r.codCarrera = c.id JOIN deporte d ON r.codDeporte = d.id JOIN jugador j ON r.codJugador = j.codJugador;",
    (error, rankini) => {
      if (error) {
        console.log(error);
      } else {
        res.render("admin/rankingIndividual.ejs", { rankini: rankini }); //render muestra el archivo ejs
      }
    }
  );
});

router.get("/admin/crearRankingIndividual", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM jugador", (error, jugadores) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query(
        "SELECT * FROM deporte WHERE tipoDeporte='Individual'",
        (error, deportes) => {
          if (error) {
            console.log(error);
          } else {
            res.render("admin/crearRankingIndividual.ejs", {
              jugadores: jugadores,
              deportes: deportes,
            });
          }
        }
      );
    }
  });
});

router.get("/admin/editarRankingRI/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  conexion.query(
    "SELECT r.id, r.codCarrera, c.id as codCarrera, d.id as codDeporte, c.nombreCarrera, r.puntos, j.codJugador, j.nombreJugador, d.nombreDeporte FROM rankini r JOIN deporte d ON r.codDeporte = d.id JOIN jugador j ON r.codJugador = j.codJugador JOIN carreras c ON r.codCarrera = c.id WHERE r.id = ?",
    [id],
    (error, ranking) => {
      if (error) {
        throw error;
      } else {
        conexion.query(
          "SELECT * FROM deporte WHERE tipoDeporte='Individual'",
          (error, deportes) => {
            if (error) {
              console.log(error);
            } else {
              conexion.query("SELECT * FROM jugador", (error, jugadores) => {
                if (error) {
                  console.log(error);
                } else {
                  conexion.query(
                    "SELECT * FROM carreras",
                    (error, carreras) => {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log(ranking);
                        res.render("admin/editarRankingRI", {
                          ranking: ranking[0],
                          deportes: deportes,
                          jugadores: jugadores,
                          carreras: carreras,
                        });
                      }
                    }
                  );
                }
              });
            }
          }
        );
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
  conexion.query(
    "SELECT e.nombreEquipo, d.nombreDeporte, r.puntos, r.id FROM rankinge r JOIN equipos e ON r.codEquipo = e.codEquipo JOIN deporte d ON r.codDeporte = d.id",
    (error, rankinge) => {
      if (error) {
        console.log(error);
      } else {
        res.render("admin/rankingEquipos.ejs", { rankinge: rankinge }); //render muestra el archivo ejs
      }
    }
  );
});

router.get("/admin/crearRankingEquipos", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM equipos", (error, equipos) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query(
        "SELECT * FROM deporte WHERE tipoDeporte='Equipos'",
        (error, deportes) => {
          if (error) {
            console.log(error);
          } else {
            res.render("admin/crearRankingEquipos.ejs", {
              equipos: equipos,
              deportes: deportes,
            });
          }
        }
      );
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
        conexion.query("SELECT * FROM equipos", (error, equipos) => {
          if (error) {
            console.log(error);
          } else {
            conexion.query(
              "SELECT * FROM deporte WHERE tipoDeporte='Equipos'",
              (error, deportes) => {
                if (error) {
                  console.log(error);
                } else {
                  res.render("admin/editarRankingRE", {
                    rankingRE: rankingRE[0],
                    equipos: equipos,
                    deportes: deportes,
                  });
                }
              }
            );
          }
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

router.get(["/", "/home"], (req, res) => {
  conexion.query(
    // proximos partidos
    "SELECT e1.nombreEquipo AS equipo1, e2.nombreEquipo AS equipo2, e1.imagen AS imagen1, e2.imagen AS imagen2, p.nombrePartido, es.nombreEstadio, p.jornada, p.fecha, p.etapa, d.nombreDeporte, p.codPartido FROM partido p INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo INNER JOIN estadio es ON p.codEstadio = es.codEstadio INNER JOIN deporte d ON p.codDeporte = d.id WHERE p.fecha > NOW() ORDER BY p.fecha ASC;",
    (error, partidos) => {
      if (error) {
        console.log(error);
      } else {
        conexion.query(
          // Rankging individual y por equipos
          "SELECT DISTINCT d.nombreDeporte ,d.id FROM deporte d LEFT JOIN rankini r ON d.id = r.codDeporte LEFT JOIN rankinge re ON d.id = re.codDeporte WHERE r.codJugador IS NOT NULL OR re.codEquipo IS NOT NULL;",
          (error, deportes) => {
            if (error) {
              console.log(error);
            } else {
              conexion.query(
                // partidos con Clasificatoria de Cuartos, semifinal, final, tercer lugar
                "SELECT p.fecha, p.jornada, p.etapa, e1.nombreEquipo AS equipo1, e1.imagen AS imagen1, e2.imagen AS imagen2, p.puntos1, e2.nombreEquipo AS equipo2, p.puntos2 FROM partido p INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo WHERE p.etapa = 'TERCER LUGAR' OR p.etapa = 'CUARTOS DE FINAL' OR p.etapa = 'SEMIFINAL' OR p.etapa = 'FINAL' ORDER BY CASE p.etapa WHEN 'CUARTOS DE FINAL' THEN 1 WHEN 'SEMIFINAL' THEN 2 WHEN 'TERCER LUGAR' THEN 3 WHEN 'FINAL' THEN 4 END",
                (error, partidosTorneos) => {
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
                            // Partidos Con Resultados y Clasificatoria
                            "SELECT p.fecha, p.jornada, e1.nombreEquipo AS equipo1, e1.imagen AS imagen1, e2.imagen AS imagen2, p.puntos1, e2.nombreEquipo AS equipo2, p.puntos2 FROM partido p INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo WHERE p.etapa = 'CLASIFICATORIA' AND p.puntos1 IS NOT NULL AND p.puntos2 IS NOT NULL ORDER BY p.jornada ASC;",
                            (error, resultados) => {
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
                                  if (minutos == "0") {
                                    minutos = "00";
                                  }
                                  if (hora > 12) {
                                    hora = hora - 12;
                                    minutos = minutos + " PM";
                                  } else {
                                    minutos = minutos + " AM";
                                  }

                                  if (minutos < 10) {
                                    minutos = "0" + minutos;
                                  }

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

                                // for (
                                //   let i = 0;
                                //   i < partidosTorneos.length;
                                //   i++
                                // ) {
                                // Obtenemos la fecha del partido
                                // const fecha = new Date(
                                //   partidosTorneos[i].fecha
                                // );

                                // Formateamos la fecha
                                //   const dia = fecha
                                //     .getDate()
                                //     .toString()
                                //     .padStart(2, "0");
                                //   const mes = (fecha.getMonth() + 1)
                                //     .toString()
                                //     .padStart(2, "0");
                                //   const anio = fecha.getFullYear().toString();
                                //   const hora = fecha
                                //     .getHours()
                                //     .toString()
                                //     .padStart(2, "0");
                                //   const minutos = fecha
                                //     .getMinutes()
                                //     .toString()
                                //     .padStart(2, "0");

                                //   // Asignamos la fecha formateada al objeto original
                                //   partidosTorneos[
                                //     i
                                //   ].fecha = `${dia}/${mes}/${anio} - ${hora}:${minutos}`;
                                // }

                                res.render("home.ejs", {
                                  deportes: deportes,
                                  eliminatoria: eliminatoria,
                                  resultados: resultados,
                                  partidos: partidos,
                                  fechaPartidos: fechaPartidos,
                                  partidosTorneos: partidosTorneos,
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
});

router.get("/rankingE", (req, res) => {
  conexion.query(
    "SELECT e.nombreEquipo,d.nombreDeporte,r.puntos FROM rankinge r JOIN deporte e ON d.id = r.codDeporte JOIN equipos e ON r.codEquipo = e.codEquipo",
    (error, rankinge) => {
      if (error) {
        console.log(error);
      } else {
        res.render("rankingE.ejs", { rankinge: rankinge }); //render muestra el archivo ejs
      }
    }
  );
});

router.get("/deportes-:id", (req, res) => {
  let id = req.params.id;
  conexion.query(
    "SELECT r.puntos, e.nombreEquipo, d.nombreDeporte FROM rankinge r JOIN equipos e ON r.codEquipo = e.codEquipo JOIN deporte d ON r.codDeporte = d.id WHERE r.codDeporte = ?",
    [id],
    (error, rankinge) => {
      if (error) {
        console.log(error);
      } else {
        conexion.query(
          "SELECT j.nombreJugador, c.nombreCarrera, d.nombreDeporte, r.puntos FROM rankini r JOIN jugador j ON j.codJugador = r.codJugador JOIN carreras c ON c.id = r.codCarrera JOIN deporte d ON d.id = r.codDeporte",
          (error, ranking) => {
            if (error) {
              console.log(error);
            } else {
              conexion.query(
                "SELECT DISTINCT d.nombreDeporte ,d.id FROM deporte d LEFT JOIN rankini r ON d.id = r.codDeporte LEFT JOIN rankinge re ON d.id = re.codDeporte WHERE r.codJugador IS NOT NULL OR re.codEquipo IS NOT NULL", // comprobar que el deporte tenga ranking
                (error, deportes) => {
                  if (error) {
                    console.log(error);
                  } else {
                    conexion.query(
                      "SELECT * FROM deporte WHERE id=?", // obtener deporte para saber si es individual o por equipos
                      [id],
                      (error, deporte) => {
                        if (error) {
                          console.log(error);
                          throw error;
                        } else {
                          if (deporte[0].tipoDeporte == "Individual") {
                            // si el deporte es individual muestra el ranking individual
                            res.render("ranking.ejs", {
                              ranking: ranking,
                              deportes: deportes,
                              deporte: deporte[0],
                            });
                          } else if (deporte[0].tipoDeporte == "Equipos") {
                            // si el deporte es por equipos muestra el ranking por equipos
                            res.render("rankingE.ejs", {
                              rankinge: rankinge,
                              deporte: deporte[0],
                              deportes: deportes,
                            });
                          }
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

router.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Obtener equipos con Ajax
router.get("/actualizarEquipos/:codDeporte", async (req, res) => {
  try {
    const codDeporte = req.params.codDeporte;

    // Consulta SQL para obtener los equipos del deporte seleccionado
    const sql = "SELECT * FROM equipos WHERE codDeporte = ?";
    conexion.query(sql, [codDeporte], (error, equipos) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor" });
      } else {
        // Convertir los resultados de la consulta en un objeto JSON
        const jsonEquipos = JSON.stringify(equipos);
        // Enviar el objeto JSON al cliente
        res.json({ jsonEquipos });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
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
router.post("/saveDeporte", mycrud.saveDeporte);
router.post("/saveRI", mycrud.saveRI);
router.post("/saveRE", mycrud.saveRE);


// actualizar registros
router.post("/updateJugador", mycrud.updateJugador);
router.post("/updateEquipo", uploadImg, mycrud.updateEquipo);
router.post("/updateCarrera", mycrud.updateCarrera);
router.post("/updatePartido", mycrud.updatePartido);
router.post("/updateEliminatoria", mycrud.updateEliminatoria);
router.post("/updateEstadio", mycrud.updateEstadio);
router.post("/updateEstadisticasGenerales", mycrud.updateEstadisticasGenerales);
router.post("/updateDeporte", mycrud.updateDeporte);
router.post("/updateRI", mycrud.updateRI);
router.post("/updateRE", mycrud.updateRE);

export default router;
