import { Router } from "express";
import { static as estatico } from "express";
const router = Router();
import conexion from "../database/db.cjs";
import * as mycrud from "../controllers/crud.cjs";
// importar moment
import moment from "moment";
import multer from "multer";
import util from "util";

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
              conexion.query("SELECT * FROM deporte", (error, deporte) => {
                if (error) {
                  console.log(error);
                } else {
                  res.render("admin/crearJugador.ejs", {
                    jugador,
                    carrera,
                    equipo,
                    deporte
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
  const sql = `SELECT t.nombreTorneo,e1.nombreEquipo AS equipo1, e2.nombreEquipo AS equipo2,p.jornada, p.puntos1,p.codPartido, p.puntos2, p.etapa, p.fecha, e.nombreEstadio, d.nombreDeporte
  FROM partido p
  JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo
  JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo
  JOIN estadio e ON p.codEstadio = e.codEstadio
  JOIN deporte d ON p.codDeporte = d.id
  JOIN torneos t ON p.codTorneo = t.codTorneo
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

  const sql = `SELECT p.codPartido, d.id, d.nombreDeporte, p.codEstadio, p.codEquipo1, p.codEquipo2, e1.nombreEquipo AS equipo1, e2.nombreEquipo AS equipo2, t.nombreTorneo,t.codTorneo, es.nombreEstadio, p.jornada, p.fecha, p.etapa, p.puntos1, p.puntos2, p.codDeporte 
  FROM partido p 
  INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo 
  INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo 
  INNER JOIN estadio es ON p.codEstadio = es.codEstadio 
  INNER JOIN deporte d ON p.codDeporte = d.id 
  JOIN torneos t ON p.codTorneo = t.codTorneo 
  WHERE p.codPartido = ?`;

  conexion.query(sql, [codPartido], (error, results) => {
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
                    conexion.query(
                      "SELECT * FROM torneos",
                      (error, torneos) => {
                        if (error) {
                          console.log(error);
                        } else {
                          const sql = `SELECT * FROM jugador`;
                          conexion.query(sql, (error, jugadores) => {
                            if (error) {
                              console.log(error);
                            } else {
                              const sql = `SELECT j.nombreJugador, g.goles, g.codPartido
                               FROM goleadores g
                               INNER JOIN jugador j ON j.codJugador = g.codJugador
                               INNER JOIN partido p ON p.codPartido = g.codPartido
                               WHERE p.codPartido = ?`;
                              conexion.query(
                                sql,
                                [codPartido],
                                (error, goleadores) => {
                                  if (error) {
                                    console.log(error);
                                  } else {
                                    console.log(goleadores);
                                    res.render("admin/editarPartido.ejs", {
                                      partido: results[0],
                                      estadios,
                                      equipos,
                                      deporte,
                                      torneos,
                                      jugadores,
                                      goleadores,
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
                });
              }
            }
          );
        }
      });
    }
  });
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
          conexion.query("SELECT * FROM torneos", (error, torneos) => {
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
                          deporte: deporte,
                          jugadores: jugadores,
                          torneos: torneos,
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
  conexion.query("DELETE FROM users WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/admin/usuarios");
    }
  });
});

router.get("/admin/eliminatorias", requireLogin, (req, res) => {
  const sql = `SELECT e.nombreEquipo, eli.*, t.nombreTorneo, d.nombreDeporte
   FROM eliminatorias eli 
   JOIN equipos e ON eli.codEquipo = e.codEquipo 
   JOIN torneos t ON eli.codTorneo = t.codTorneo
   JOIN deporte d ON eli.codDeporte = d.id;`;
  conexion.query(sql, (error, eliminatoria) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/eliminatorias.ejs", { eliminatoria: eliminatoria });
    }
  });
});

router.get("/admin/crearEliminatoria", requireLogin, (req, res) => {
  const sql = `SELECT * FROM equipos`;
  conexion.query(sql, (error, equipos) => {
    // seleccionar solo equipos de futbol
    if (error) {
      console.log(error);
    } else {
      const sql2 = `SELECT * FROM torneos`;
      conexion.query(sql2, (error, torneos) => {
        // seleccionar solo equipos de futbol
        if (error) {
          console.log(error);
        } else {
          const sql3 = `SELECT * FROM deporte`;
          conexion.query(sql3, (error, deportes) => {
            if (error) {
              console.log(error);
            } else {
              res.render("admin/crearEliminatoria.ejs", {
                equipos,
                torneos,
                deportes,
              });
            }
          });
        }
      });
    }
  });
});

router.get("/admin/deleteEliminatoria/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  conexion.query(
    "DELETE FROM eliminatorias WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/eliminatorias");
      }
    }
  );
});

router.get("/admin/editarEliminatoria/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  const sql = `SELECT eli.*,e.nombreEquipo, e.codEquipo, t.nombreTorneo, t.codTorneo FROM eliminatorias eli
  JOIN equipos e ON eli.codEquipo = e.codEquipo
  JOIN torneos t ON eli.codTorneo = t.codTorneo 
  WHERE id=?`;
  conexion.query(sql, [id], (error, eliminatoria) => {
    if (error) {
      throw error;
    } else {
      conexion.query("SELECT * FROM equipos", (error, equipos) => {
        if (error) {
          console.log(error);
        } else {
          conexion.query("SELECT * FROM torneos", (error, torneos) => {
            if (error) {
              console.log(error);
            } else {
              res.render("admin/editarEliminatoria.ejs", {
                eliminatoria: eliminatoria[0],
                equipos: equipos,
                torneos: torneos,
              });
            }
          });
        }
      });
    }
  });
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
  const sql = `SELECT t.nombreTorneo,r.id,j.nombreJugador,c.nombreCarrera, d.nombreDeporte,r.puntos 
  FROM rankini r 
  JOIN carreras c ON r.codCarrera = c.id 
  JOIN deporte d ON r.codDeporte = d.id 
  JOIN jugador j ON r.codJugador = j.codJugador
  JOIN torneos t ON r.codTorneo = t.codTorneo
  `;
  conexion.query(sql, (error, rankini) => {
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
      conexion.query(
        "SELECT * FROM deporte WHERE tipoDeporte='Individual'",
        (error, deportes) => {
          if (error) {
            console.log(error);
          } else {
            conexion.query("SELECT * FROM torneos", (error, torneos) => {
              if (error) {
                console.log(error);
              } else {
                res.render("admin/crearRankingIndividual.ejs", {
                  jugadores: jugadores,
                  deportes: deportes,
                  torneos: torneos,
                });
              }
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
    "SELECT t.nombreTorneo,e.nombreEquipo, d.nombreDeporte, r.puntos, r.id FROM rankinge r JOIN equipos e ON r.codEquipo = e.codEquipo JOIN deporte d ON r.codDeporte = d.id JOIN torneos t ON r.codTorneo = t.codTorneo",
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
            conexion.query("SELECT * FROM torneos", (error, torneos) => {
              if (error) {
                console.log(error);
              } else {
                res.render("admin/crearRankingEquipos.ejs", {
                  equipos: equipos,
                  deportes: deportes,
                  torneos: torneos,
                });
              }
            });
          }
        }
      );
    }
  });
});

router.get("/admin/editarRankingRE/:id", requireLogin, (req, res) => {
  const id = req.params.id;
  const sql = `
  SELECT re.*, e.nombreEquipo, e.codEquipo, d.nombreDeporte, d.id 
  FROM rankinge re 
  JOIN deporte d ON re.codDeporte = d.id
  JOIN equipos e ON re.codEquipo = e.codEquipo
  WHERE id = ?  
  `;
  conexion.query(sql, [id], (error, rankingRE) => {
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
  });
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

router.get("/admin/dashboard", requireLogin, async (req, res) => {
  try {
    const [
      deportes,
      equipos,
      jugadores,
      estadios,
      partidos,
      carreras,
      users,
      torneos,
    ] = await Promise.all([
      util.promisify(conexion.query).bind(conexion)(
        "SELECT COUNT(*) AS cantidadDeportes FROM deporte"
      ),
      util.promisify(conexion.query).bind(conexion)(
        "SELECT COUNT(*) AS cantidadEquipos FROM equipos"
      ),
      util.promisify(conexion.query).bind(conexion)(
        "SELECT COUNT(*) AS cantidadJugadores FROM jugador"
      ),
      util.promisify(conexion.query).bind(conexion)(
        "SELECT COUNT(*) AS cantidadEstadios FROM estadio"
      ),
      util.promisify(conexion.query).bind(conexion)(
        "SELECT COUNT(*) AS cantidadPartidos FROM partido"
      ),
      util.promisify(conexion.query).bind(conexion)(
        "SELECT COUNT(*) AS cantidadCarreras FROM carreras"
      ),
      util.promisify(conexion.query).bind(conexion)(
        "SELECT COUNT(*) AS cantidadUsers FROM users"
      ),
      util.promisify(conexion.query).bind(conexion)(
        "SELECT COUNT(*) AS cantidadTorneos FROM torneos"
      ),
    ]);

    res.render("admin/dashboard", {
      cantidadDeportes: deportes[0].cantidadDeportes,
      cantidadEquipos: equipos[0].cantidadEquipos,
      cantidadJugadores: jugadores[0].cantidadJugadores,
      cantidadEstadios: estadios[0].cantidadEstadios,
      cantidadPartidos: partidos[0].cantidadPartidos,
      cantidadCarreras: carreras[0].cantidadCarreras,
      cantidadUsers: users[0].cantidadUsers,
      cantidadTorneos: torneos[0].cantidadTorneos,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get(["/", "/home"], (req, res) => {
  const sql = `SELECT e1.nombreEquipo AS equipo1, e2.nombreEquipo AS equipo2, e1.imagen AS imagen1, e2.imagen AS imagen2, t.nombreTorneo, t.codTorneo, es.nombreEstadio, p.jornada, p.fecha, p.etapa, d.nombreDeporte, p.codPartido 
  FROM partido p 
  INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo 
  INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo 
  INNER JOIN estadio es ON p.codEstadio = es.codEstadio 
  INNER JOIN deporte d ON p.codDeporte = d.id 
  INNER JOIN torneos t ON p.codTorneo = t.codTorneo 
  WHERE p.fecha >= NOW() AND t.status=1 
  ORDER BY p.fecha ASC;`;

  conexion.query(sql, (error, partidos) => {
    // proximos partidos
    if (error) {
      console.log(error);
    } else {
      // completar llave foranea de codTorneo de rankinge a torneos
      const sql = ` 
      SELECT DISTINCT d.nombreDeporte, t.nombreTorneo, d.id, t.codTorneo
    FROM ((rankini r INNER JOIN torneos t ON r.codTorneo = t.codTorneo) 
     INNER JOIN deporte d ON r.codDeporte = d.id) 
    WHERE t.status = 1 
      UNION 
      SELECT DISTINCT d.nombreDeporte, t.nombreTorneo, d.id, t.codTorneo 
        FROM (rankinge r INNER JOIN torneos t ON r.codTorneo = t.codTorneo) 
        INNER JOIN deporte d ON r.codDeporte = d.id 
      WHERE t.status = 1;`;
      conexion.query(
        // Rankging individual y por equipos
        sql,
        (error, deportes) => {
          if (error) {
            console.log(error);
          } else {
            const sql = `SELECT p.fecha, p.jornada, p.etapa, e1.nombreEquipo AS equipo1, e1.imagen AS imagen1, e2.imagen AS imagen2, p.puntos1, e2.nombreEquipo AS equipo2, p.puntos2 
            FROM partido p 
            INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo
            INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo 
            INNER JOIN torneos t ON p.codTorneo = t.codTorneo 
            WHERE (p.etapa = 'TERCER LUGAR' OR p.etapa = 'CUARTOS DE FINAL' OR p.etapa = 'SEMIFINAL' OR p.etapa = 'FINAL') 
              AND t.status = 1 
            ORDER BY CASE p.etapa 
              WHEN 'CUARTOS DE FINAL' THEN 1 
              WHEN 'SEMIFINAL' THEN 2 
              WHEN 'TERCER LUGAR' THEN 3 
              WHEN 'FINAL' THEN 4 
            END
            `;
            conexion.query(
              // partidos con Clasificatoria de Cuartos, semifinal, final, tercer lugar
              sql,
              (error, partidosTorneos) => {
                if (error) {
                  console.log(error);
                } else {
                  const sql = `SELECT t.nombreTorneo,eq.nombreEquipo,d.nombreDeporte, e.*
                  FROM eliminatorias e
                  JOIN equipos eq ON e.codEquipo = eq.codEquipo
                  JOIN deporte d ON eq.codDeporte = d.id
                  JOIN torneos t ON e.codTorneo = t.codTorneo
                  WHERE t.status = 1 
                  ORDER BY e.puntos DESC;`;

                  conexion.query(sql, (error, eliminatorias) => {
                    if (error) {
                      console.log(error);
                    } else {
                      const sql2 = `SELECT 
                      j1.nombreJugador AS goleadores_equipo1, 
                      j2.nombreJugador AS goleadores_equipo2, 
                      t.nombreTorneo, 
                      p.fecha, 
                      p.jornada, 
                      p.etapa, 
                      e1.nombreEquipo AS equipo1, 
                      e1.imagen AS imagen1, 
                      e2.imagen AS imagen2, 
                      p.puntos1, 
                      e2.nombreEquipo AS equipo2, 
                      p.puntos2, 
                      e1.codEquipo AS codEquipo1, 
                      e2.codEquipo AS codEquipo2, 
                      p.codPartido 
                    FROM partido p 
                    INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo 
                    INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo 
                    INNER JOIN torneos t ON p.codTorneo = t.codTorneo 
                    LEFT JOIN (
                      SELECT 
                        g.codPartido, 
                        g.codEquipo, 
                        GROUP_CONCAT(CONCAT(j.nombreJugador, ' (', g.goles, ')') ORDER BY g.goles DESC SEPARATOR ', ') AS nombreJugador
                      FROM goleadores g 
                      INNER JOIN jugador j ON g.codJugador = j.codJugador 
                      GROUP BY g.codPartido, g.codEquipo
                    ) j1 ON p.codPartido = j1.codPartido AND e1.codEquipo = j1.codEquipo 
                    LEFT JOIN (
                      SELECT 
                        g.codPartido, 
                        g.codEquipo, 
                        GROUP_CONCAT(CONCAT(j.nombreJugador, ' (', g.goles, ')') ORDER BY g.goles DESC SEPARATOR ', ') AS nombreJugador
                      FROM goleadores g 
                      INNER JOIN jugador j ON g.codJugador = j.codJugador 
                      GROUP BY g.codPartido, g.codEquipo
                    ) j2 ON p.codPartido = j2.codPartido AND e2.codEquipo = j2.codEquipo 
                    WHERE p.codTorneo = 1 AND t.status = 1 
                    GROUP BY p.codPartido, e1.codEquipo, e2.codEquipo 
                    ORDER BY p.jornada ASC, p.etapa ASC;`;

                      conexion.query(sql2, (error, resultados) => {
                        // resultados de partidos
                        if (error) {
                          console.log(error);
                        } else {
                          const sql3 = `SELECT * FROM torneos`;
                          conexion.query(sql3, (error, torneos) => {
                            // torneos
                            if (error) {
                              console.log(error);
                            } else {
                              const sql4 = `SELECT DISTINCT j.nombreJugador,c.nombreCarrera,d.nombreDeporte, SUM(r.puntos) AS total_puntos
                              FROM rankini r
                              JOIN jugador j ON j.codJugador = r.codJugador
                              JOIN carreras c ON c.id = r.codCarrera
                              JOIN deporte d ON d.id = r.codDeporte
                              WHERE r.codUniversidad = 1
                              GROUP BY j.nombreJugador, c.nombreCarrera,d.nombreDeporte
                              ORDER BY d.nombredeporte DESC,total_puntos DESC`;
                              conexion.query(sql4, (error, rankingGeneral) => {
                                // torneos
                                if (error) {
                                  console.log(error);
                                } else {
                                  const sql5 = `SELECT DISTINCT d.nombreDeporte, e.nombreEquipo, SUM(r.puntos) AS total_puntos
                              FROM rankinge r
                              JOIN deporte d ON d.id = r.codDeporte
                              JOIN equipos e ON e.codEquipo = r.codEquipo
                              WHERE r.codUniversidad = 1
                              GROUP BY d.nombreDeporte, e.nombreEquipo
                              ORDER BY d.nombredeporte DESC,total_puntos DESC`;
                                  conexion.query(
                                    sql5,
                                    (error, rankingGeneralEquipos) => {
                                      // torneos
                                      if (error) {
                                        console.log(error);
                                      } else {
                                        const sql6 = `SELECT j.nombreJugador, e.nombreEquipo, d.nombreDeporte, SUM(g.goles) AS goles_totales
                                        FROM goleadores g
                                        INNER JOIN jugador j ON g.codJugador = j.codJugador
                                        INNER JOIN equipos e ON e.codEquipo = g.codEquipo
                                        INNER JOIN deporte d ON d.id = g.codDeporte
                                        WHERE g.codTorneo = 1
                                        GROUP BY j.codJugador, j.nombreJugador, e.nombreEquipo, d.nombreDeporte
                                        ORDER BY goles_totales DESC
                                        `;
                                        conexion.query(
                                          sql6,
                                          (error, goleadores) => {
                                            // torneos
                                            if (error) {
                                              console.log(error);
                                            } else {
                                              res.render("home.ejs", {
                                                goleadores,
                                                partidos,
                                                deportes,
                                                partidosTorneos,
                                                eliminatorias,
                                                resultados,
                                                torneos,
                                                rankingGeneral,
                                                rankingGeneralEquipos,
                                              });
                                            }
                                          }
                                        );
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
              }
            );
          }
        }
      );
    }
  });
});

router.get("/torneos:codTorneo", (req, res) => {
  let codTorneo = req.params.codTorneo;
  // partidos proximos de torneo especifico
  const sql = `SELECT e1.nombreEquipo AS equipo1, e2.nombreEquipo AS equipo2, e1.imagen AS imagen1, e2.imagen AS imagen2, t.nombreTorneo, t.codTorneo, es.nombreEstadio, p.jornada, p.fecha, p.etapa, d.nombreDeporte, p.codPartido 
  FROM partido p 
  INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo 
  INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo 
  INNER JOIN estadio es ON p.codEstadio = es.codEstadio 
  INNER JOIN deporte d ON p.codDeporte = d.id 
  INNER JOIN torneos t ON p.codTorneo = t.codTorneo 
  WHERE p.fecha >= NOW() AND t.codTorneo=? 
  ORDER BY p.fecha ASC;`;
  conexion.query(sql, [codTorneo], (error, partidos) => {
    if (error) {
      console.log(error);
    } else {
      //  deportes con rankings del torneo especifico
      const sql2 = `SELECT DISTINCT d.nombreDeporte, t.nombreTorneo, d.id, t.codTorneo
      FROM ((rankini r INNER JOIN torneos t ON r.codTorneo = t.codTorneo) 
       INNER JOIN deporte d ON r.codDeporte = d.id) 
      WHERE t.codTorneo = ?
        UNION 
        SELECT DISTINCT d.nombreDeporte, t.nombreTorneo, d.id, t.codTorneo 
          FROM (rankinge r INNER JOIN torneos t ON r.codTorneo = t.codTorneo) 
          INNER JOIN deporte d ON r.codDeporte = d.id 
        WHERE t.codTorneo = ?;`;
      conexion.query(sql2, [codTorneo, codTorneo], (error, deportes) => {
        if (error) {
          console.log(error);
        } else {
          // partidos de clasificatoria del torneo especifivo
          const sql3 = `SELECT t.nombreTorneo,p.fecha, p.jornada, e1.nombreEquipo AS equipo1, e1.imagen AS imagen1, e2.imagen AS imagen2, p.puntos1, e2.nombreEquipo AS equipo2, p.puntos2 
          FROM partido p 
          INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo 
          INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo 
          INNER JOIN torneos t ON p.codTorneo = t.codTorneo
          WHERE p.etapa = 'CLASIFICATORIA' AND p.fecha <= CURDATE() AND t.codTorneo=?
          ORDER BY p.jornada ASC;`;
          conexion.query(sql3, [codTorneo], (error, resultados) => {
            if (error) {
              console.log(error);
            } else {
              const sql4 = `SELECT p.fecha, p.jornada, p.etapa, e1.nombreEquipo AS equipo1, e1.imagen AS imagen1, e2.imagen AS imagen2, p.puntos1, e2.nombreEquipo AS equipo2, p.puntos2 
              FROM partido p 
              INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo
              INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo 
              INNER JOIN torneos t ON p.codTorneo = t.codTorneo 
              WHERE (p.etapa = 'TERCER LUGAR' OR p.etapa = 'CUARTOS DE FINAL' OR p.etapa = 'SEMIFINAL' OR p.etapa = 'FINAL') 
                AND t.codTorneo = ?
              ORDER BY CASE p.etapa 
                WHEN 'CUARTOS DE FINAL' THEN 1 
                WHEN 'SEMIFINAL' THEN 2 
                WHEN 'TERCER LUGAR' THEN 3 
                WHEN 'FINAL' THEN 4 
              END
              `;
              conexion.query(sql4, [codTorneo], (error, partidosTorneos) => {
                if (error) {
                  console.log(error);
                } else {
                  // eliminatorias de torneo especifico
                  const sql5 = `SELECT t.nombreTorneo,eq.nombreEquipo,d.nombreDeporte, e.*
                  FROM eliminatorias e
                  JOIN equipos eq ON e.codEquipo = eq.codEquipo
                  JOIN deporte d ON eq.codDeporte = d.id
                  JOIN torneos t ON e.codTorneo = t.codTorneo
                  WHERE t.codTorneo = ?
                  ORDER BY d.nombreDeporte`;
                  conexion.query(sql5, [codTorneo], (error, eliminatoria) => {
                    if (error) {
                      console.log(error);
                    } else {
                      const sql6 = `SELECT * FROM torneos`; // mas torneos para el menu
                      conexion.query(sql6, (error, torneos) => {
                        if (error) {
                          console.log(error);
                        } else {
                          res.render("home.ejs", {
                            partidos,
                            resultados,
                            partidosTorneos,
                            eliminatorias,
                            torneos,
                            deportes,
                          });
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
    }
  });
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

router.get("/ranking:id:codTorneo", (req, res) => {
  let codTorneo = req.params.codTorneo;
  let id = req.params.id; // id Deporte

  const sql1 = `SELECT * FROM torneos`; // mas torneos para el menu

  conexion.query(sql1, (error, torneos) => {
    // Deporte Seleccionado
    const sql2 = `SELECT DISTINCT d.id,d.nombreDeporte,d.tipoDeporte
        FROM deporte d 
        WHERE d.id = ?`;

    conexion.query(sql2, [id], (error, deporte) => {
      if (error) {
        console.log(error);
      } else {
        const sql5 = `SELECT DISTINCT d.nombreDeporte, t.nombreTorneo, d.id, t.codTorneo
            FROM ((rankini r INNER JOIN torneos t ON r.codTorneo = t.codTorneo) 
             INNER JOIN deporte d ON r.codDeporte = d.id) 
            WHERE t.codTorneo = ?
              UNION 
              SELECT DISTINCT d.nombreDeporte, t.nombreTorneo, d.id, t.codTorneo 
                FROM (rankinge r INNER JOIN torneos t ON r.codTorneo = t.codTorneo) 
                INNER JOIN deporte d ON r.codDeporte = d.id 
              WHERE t.codTorneo = ?;`;
        conexion.query(sql5, [codTorneo, codTorneo], (error, deportes) => {
          if (error) {
            console.log(error);
          } else {
            if (deporte[0].tipoDeporte == "Individual") {
              // datos Ranking Individual
              const sql3 = `SELECT 
                            ri.puntos, 
                            d.nombreDeporte,
                            d.tipoDeporte,
                            j.nombreJugador,
                            t.nombreTorneo, 
                            t.codTorneo,
                            c.nombreCarrera 
                          FROM 
                            rankini ri 
                            INNER JOIN deporte d ON ri.codDeporte = d.id 
                            INNER JOIN torneos t ON ri.codTorneo = t.codTorneo 
                            INNER JOIN carreras c ON ri.codCarrera = c.id 
                            INNER JOIN jugador j ON ri.codJugador = j.codJugador
                          WHERE 
                            d.id = ?
                            AND t.codTorneo = ?
                          ORDER BY 
                            ri.puntos DESC`;
              conexion.query(sql3, [id, codTorneo], (error, ranking) => {
                if (error) {
                  console.log(error);
                } else {
                  res.render("ranking.ejs", {
                    ranking,
                    deportes,
                    torneos,
                  });
                }
              });
            } else if (deporte[0].tipoDeporte == "Equipos") {
              // datos Ranking Equipo
              const sql4 = `SELECT
                          re.puntos,d.nombreDeporte,d.tipoDeporte,e.nombreEquipo,t.nombreTorneo,t.codTorneo
                        FROM
                          rankinge re
                          INNER JOIN deporte d ON re.codDeporte = d.id
                          INNER JOIN torneos t ON re.codTorneo = t.codTorneo
                          INNER JOIN equipos e ON re.codEquipo = e.codEquipo
                        WHERE
                          d.id = ?
                          AND t.codTorneo = ?
                        ORDER BY
                          re.puntos DESC`;
              conexion.query(sql4, [id, codTorneo], (error, rankinge) => {
                if (error) {
                  console.log(error);
                } else {
                  res.render("rankingE.ejs", {
                    rankinge,
                    deportes,
                    torneos,
                  });
                }
              });
            }
          }
        });
      }
    });
  });
});

// IMAGEN
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware para restringir el acceso a páginas que requieren inicio de sesión
function requireLogin(req, res, next) {
  if (process.env.NODE_ENV === "local") {
    // Si estás en desarrollo, permitir el acceso sin iniciar sesión
    return next();
  }

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

//torneos vista
router.get("/admin/torneos", requireLogin, (req, res) => {
  conexion.query("SELECT * FROM torneos", (error, torneos) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query(
        "SELECT * FROM torneos WHERE status=1",
        (error, torneosPublicados) => {
          if (error) {
            console.log(error);
          } else {
            res.render("admin/torneos.ejs", {
              torneos,
              torneosPublicados: torneosPublicados[0],
            });
          }
        }
      );
    }
  });
});

//torneos vista
router.get("/admin/crearTorneo", requireLogin, (req, res) => {
  res.render("admin/crearTorneo.ejs");
});

router.get("/admin/editarTorneo/:codTorneo", requireLogin, (req, res) => {
  const codTorneo = req.params.codTorneo;
  conexion.query(
    "SELECT * FROM torneos WHERE codTorneo",
    [codTorneo],
    (error, torneos) => {
      if (error) {
        console.log(error);
      } else {
        res.render("admin/editarTorneo.ejs", { torneos: torneos[0] }); //render muestra el archivo ejs
      }
    }
  );
});

router.get("/admin/deleteTorneo/:codTorneo", (req, res) => {
  const codTorneo = req.params.codTorneo;
  conexion.query(
    "DELETE FROM torneos WHERE codTorneo = ?",
    [codTorneo],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/admin/torneos");
      }
    }
  );
});

// Obtener jugadores de un equipo con ajax con Ajax
router.get("/actualizarJugadores/:codEquipo", async (req, res) => {
  const codEquipo = req.params.codEquipo;
  try {
    const sql = `SELECT j.codJugador, j.nombreJugador
    FROM jugador j
    INNER JOIN equipos e ON j.codEquipo = e.codEquipo
    INNER JOIN deporte d ON e.codDeporte = d.id
    WHERE UPPER(d.nombreDeporte) LIKE 'F%' AND e.codEquipo = ?;`;
    conexion.query(sql, [codEquipo], (error, jsonJugadores) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor" });
      } else {
        res.json(jsonJugadores);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// login y registro

router.get("/login", (req, res) => {
  res.render("login", { message: req.flash("message") });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario en la base de datos y comparar la contraseña cifrada
    conexion.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (error, results) => {
        if (results.length > 0) {
          conexion.query(
            "SELECT * FROM users WHERE password = ?",
            [password],
            (error, results) => {
              if (results.length > 0) {
                const user = results[0];
                const validPassword = bcrypt.compare(password, user.password);
                if (validPassword) {
                  req.session.user = user; // almacenar información del usuario en la sesión
                  req.session.userId = user.id;
                  req.session.email = user.email;
                  req.session.password = user.password;
                  req.session.loggedin = true;
                  res.redirect("/admin/dashboard");
                } else {
                  req.flash("message", "La contraseña es incorrecta.");
                  res.redirect("/login");
                }
              } else {
                req.flash("message", "La contraseña es incorrecta.");
                res.redirect("/login");
              }
            }
          );
        } else {
          req.flash("message", "El correo electrónico no está registrado.");
          res.redirect("/login");
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.render("login");
  }
});

router.get("/register", (req, res) => {
  res.render("register", { message: req.flash("message") });
});

router.post(
  "/register",
  [check("email", "El correo electrónico no es válido").isEmail()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = [];
      errors.array().forEach((error) => messages.push(error.msg));
      req.flash("message", messages);
      res.redirect("/register");
    } else {
      const { email, password } = req.body;
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hash) => {
        // Guardar el usuario en la base de datos
        try {
          // Verificar si el usuario ya existe en la base de datos
          conexion.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (error, results) => {
              if (results.length > 0) {
                req.flash("message", "no se puede registrar");
              } else {
                // Si el usuario no existe, se registra en la base de datos
                const hashedPassword = bcrypt.hash(password, 10);

                const status = {
                  status: "disabled",
                };

                conexion.query(
                  "INSERT INTO users SET ?",
                  {
                    email: email,
                    password: password,
                    status: status.status,
                  },
                  (error, results) => {
                    if (error) {
                      console.log(error);
                      req.flash("message", "no se puede registrar");
                      res.status(400).json({ msg: "error" });
                    } else {
                      res.redirect("/login");
                    }
                  }
                );
              }
            }
          );
        } catch (error) {
          console.error(error);
          res.render("register");
        }
      });
    }
  }
);

// borrar goleador

router.get("/admin/deleteGoleador/:codPartido", (req, res) => {
  const codPartido = req.params.codPartido;
  conexion.query(
    "DELETE FROM goleadores WHERE codPartido = ?",
    [codPartido],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        // admin partidos
        res.redirect("/admin/partidos");
      }
    }
  );
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
router.post("/saveTorneo", mycrud.saveTorneo);

router.post("/saveTorneoStatus", mycrud.saveTorneoStatus);

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
router.post("/updateTorneo", mycrud.updateTorneo);

export default router;
