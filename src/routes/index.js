import { Router } from "express";
const router = Router();
import conexion from "../database/db.cjs";
import mycrud from "../controllers/crud.cjs";
// importar moment
import moment from "moment";

router.get("/deleteEstadio/:codEstadio", (req, res) => {
  const codEstadio = req.params.codEstadio;
  conexion.query(
    "DELETE FROM estadio WHERE codEstadio = ?",
    [codEstadio],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/estadios");
      }
    }
  );
});

router.get("/equipos", (req, res) => {
  conexion.query("SELECT * FROM equipos", (error, equipos) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM deporte", (error, deporte) => {
        if (error) {
          console.log(error);
        } else {
          res.render("equipos.ejs", { equipos: equipos, deporte: deporte });
        }
      });
    }
  });
});

router.get("/crearEquipo", (req, res) => {
  conexion.query("SELECT * FROM deporte", (error, deporte) => {
    if (error) {
      console.log(error);
    } else {
      res.render("crearEquipo.ejs", { deporte: deporte });
    }
  });
});

router.get("/editarEquipo/:codEquipo", (req, res) => {
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
            res.render("editarEquipo.ejs", {
              equipo: equipos[0],
              deporte: deporte,
            });
          }
        });
      }
    }
  );
});

router.get("/deleteEquipo/:codEquipo", (req, res) => {
  const codEquipo = req.params.codEquipo;
  conexion.query(
    "DELETE FROM equipos WHERE codEquipo = ?",
    [codEquipo],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/equipos");
      }
    }
  );
});

router.get("/jugadores", (req, res) => {
  conexion.query("SELECT * FROM jugador", (error, jugadores) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM carreras", (error, carrera) => {
        if (error) {
          console.log(error);
        } else {
          res.render("jugadores.ejs", {
            jugadores: jugadores,
            carrera: carrera,
          });
        }
      });
    }
  });
});

router.get("/crearJugador", (req, res) => {
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
              res.render("crearJugador.ejs", {
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

router.get("/editarJugador/:codJugador", (req, res) => {
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
                res.render("editarJugador.ejs", {
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

router.get("/deleteJugador/:codJugador", (req, res) => {
  const codJugador = req.params.codJugador;
  conexion.query(
    "DELETE FROM jugador WHERE codJugador = ?",
    [codJugador],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/jugadores");
      }
    }
  );
});

router.get("/confederaciones", (req, res) => {
  conexion.query("SELECT * FROM confederacion", (error, conf) => {
    if (error) {
      console.log(error);
    } else {
      res.render("confederaciones.ejs", { conf: conf });
    }
  });
});

router.get("/crearConfederacion", (req, res) => {
  conexion.query("SELECT * FROM confederacion", (error, conf) => {
    if (error) {
      console.log(error);
    } else {
      res.render("crearConfederacion.ejs", { conf: conf });
    }
  });
});

router.get("/crearGrupo", (req, res) => {
  res.render("crearGrupo.ejs");
});

router.get("/crearJugador", (req, res) => {
  conexion.query("SELECT * FROM jugador", (error, jugador) => {
    if (error) {
      console.log(error);
    } else {
      res.render("crearJugador.ejs", { jugador: jugador });
    }
  });
});

// Editar un registro
router.get("/editarConfederacion/:siglasConf", (req, res) => {
  const siglasConf = req.params.siglasConf;
  conexion.query(
    "SELECT * FROM confederacion WHERE siglasConf=?",
    [siglasConf],
    (error, conf) => {
      if (error) {
        throw error;
      } else {
        res.render("editarConfederacion.ejs", { conf: conf[0] });
      }
    }
  );
});

router.get("/deleteConfederacion/:nombreConf", (req, res) => {
  const nombreConf = req.params.nombreConf;
  conexion.query(
    "DELETE FROM confederacion WHERE nombreConf = ?",
    [nombreConf],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/confederaciones");
      }
    }
  );
});

router.get("/carreras", (req, res) => {
  conexion.query("SELECT * FROM carreras", (error, resultados) => {
    if (error) {
      console.log(error);
    } else {
      res.render("carreras.ejs", { resultados: resultados });
    }
  });
});

router.get("/crearCarrera", (req, res) => {
  res.render("crearCarrera.ejs");
});

router.get("/editarCarrera/:id", (req, res) => {
  const id = req.params.id;
  conexion.query(
    "SELECT * FROM carreras WHERE id=?",
    [id],
    (error, carrera) => {
      if (error) {
        throw error;
      } else {
        res.render("editarCarrera.ejs", { carrera: carrera[0] });
      }
    }
  );
});

router.get("/deleteCarrera/:id", (req, res) => {
  const id = req.params.id;
  conexion.query(
    "DELETE FROM carreras WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/carreras");
      }
    }
  );
});

router.get("/", (req, res) => {
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
                                      res.render("dashboard.ejs", {
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

router.get("/partidos", (req, res) => {
  conexion.query("SELECT * FROM partido", (error, partidos) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM juegan", (error, juegan) => {
        if (error) {
          console.log(error);
        } else {
          // formatear fecha del objeto partidos

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
          res.render("partidos.ejs", {
            partidos: partidos,
            juegan: juegan,
            fecha: fecha,
          });
        }
      });
    }
  });
});

router.get("/crearPartido", (req, res) => {
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
                            res.render("crearPartido.ejs", {
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

router.get("/editarPartido/:codPartido", (req, res) => {
  const codPartido = req.params.codPartido;
  conexion.query(
    "SELECT * FROM partido WHERE codPartido=?",
    [codPartido],
    (error, partidos) => {
      if (error) {
        throw error;
      } else {
        conexion.query("SELECT * FROM equipo", (error, equipos) => {
          if (error) {
            console.log(error);
          } else {
            conexion.query("SELECT * FROM pais", (error, paises) => {
              if (error) {
                console.log(error);
              } else {
                conexion.query("SELECT * FROM estadio", (error, estadios) => {
                  if (error) {
                    console.log(error);
                  } else {
                    res.render("editarPartido.ejs", {
                      partidos: partidos[0],
                      equipos: equipos,
                      paises: paises,
                      estadios: estadios,
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
});

router.get("/deletePartido/:codPartido", (req, res) => {
  const codPartido = req.params.codPartido;
  conexion.query(
    "DELETE FROM partido WHERE codPartido = ?",
    [codPartido],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/partidos");
      }
    }
  );
});

router.get("/crearGrupo", (req, res) => {
  res.render("crearGrupo.ejs");
});

router.get("/grupos", (req, res) => {
  conexion.query("SELECT * FROM grupo", (error, grupos) => {
    if (error) {
      console.log(error);
    } else {
      res.render("grupos.ejs", { grupos: grupos });
    }
  });
});

router.get("/deleteGrupo/:letraGrupo", (req, res) => {
  const letraGrupo = req.params.letraGrupo;
  conexion.query(
    "DELETE FROM grupo WHERE letraGrupo = ?",
    [letraGrupo],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/grupos");
      }
    }
  );
});

router.get("/eliminatorias", (req, res) => {
  conexion.query("SELECT * FROM eliminatorias", (error, eliminatoria) => {
    if (error) {
      console.log(error);
    } else {
      res.render("eliminatorias.ejs", { eliminatoria: eliminatoria });
    }
  });
});

router.get("/crearEliminatoria", (req, res) => {
  conexion.query("SELECT * FROM equipos", (error, equipos) => {
    if (error) {
      console.log(error);
    } else {
      res.render("crearEliminatoria.ejs", { equipos: equipos });
    }
  });
});

router.get("/deleteEliminatoria/:codEquipo", (req, res) => {
  const codEquipo = req.params.codEquipo;
  console.log(codEquipo);
  conexion.query(
    "DELETE FROM eliminatorias WHERE codEquipo = ?",
    [codEquipo],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/eliminatorias");
      }
    }
  );
});

router.get("/editarEliminatoria/:codEquipo", (req, res) => {
  const codEquipo = req.params.codEquipo;
  conexion.query(
    "SELECT * FROM eliminatorias WHERE codEquipo=?",
    [codEquipo],
    (error, eliminatoria) => {
      if (error) {
        throw error;
      } else {
        res.render("editarEliminatoria.ejs", {
          eliminatoria: eliminatoria[0],
        });
      }
    }
  );
});

router.get("/crearEIndividuales", (req, res) => {
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
                res.render("crearEIndividuales.ejs", {
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

router.get("/editarEIndividuales/:CodJugador+CodPartida", (req, res) => {
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
            res.render("editarEIndividuales.ejs", {
              CJugador: CJugador[0],
              estI: estI,
            });
          }
        });
      }
    }
  );
});

router.get("/estadisticasGenerales", (req, res) => {
  conexion.query("SELECT * FROM estadisticasGenerales", (error, generales) => {
    if (error) {
      console.log(error);
    } else {
      res.render("estadisticasGenerales.ejs", { generales: generales });
    }
  });
});

router.get("/crearEGenerales", (req, res) => {
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
              res.render("crearEGenerales.ejs", {
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
          res.redirect("/estadisticasGenerales");
        }
      }
    );
  }
);

router.get("/estadisticasIndividuales", (req, res) => {
  conexion.query(
    "SELECT * FROM estadisticasIndividuales",
    (error, individuales) => {
      if (error) {
        console.log(error);
      } else {
        res.render("estadisticasIndividuales.ejs", {
          individuales: individuales,
        }); //render muestra el archivo ejs
      }
    }
  );
});

router.get(
  "/editarEstadisticasGenerales/:codEquipo-:codPartido",
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
          res.render("editarEstadisticasGenerales.ejs", {
            generales: generales[0],
          });
        }
      }
    );
  }
);

router.get("/estadios", (req, res) => {
  conexion.query("SELECT * FROM estadio", (error, estadios) => {
    if (error) {
      console.log(error);
    } else {
      res.render("estadios.ejs", { estadios: estadios }); //render muestra el archivo ejs
    }
  });
});

router.get("/crearEstadio", (req, res) => {
  conexion.query("SELECT * FROM estadio", (error, estadios) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM ciudad", (error, ciudades) => {
        if (error) {
          console.log(error);
        } else {
          res.render("crearEstadio.ejs", {
            estadios: estadios,
            ciudades: ciudades,
          });
        }
      });
    }
  });
});

router.get("/editarEstadio/:codEstadio", (req, res) => {
  const codEstadio = req.params.codEstadio;
  conexion.query(
    "SELECT * FROM estadio WHERE codEstadio=?",
    [codEstadio],
    (error, estadio) => {
      if (error) {
        throw error;
      } else {
        conexion.query("SELECT * FROM ciudad", (error, ciudad) => {
          if (error) {
            console.log(error);
          } else {
            res.render("editarEstadio.ejs", {
              estadio: estadio[0],
              ciudad: ciudad,
            });
          }
        });
      }
    }
  );
});

router.get("/jornadas", (req, res) => {
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
          res.render("jornadas.ejs", {
            jornadas: jornadas,
            fecha: fecha,
            deporte: deporte,
          }); //render muestra el archivo ejs
        }
      });
    }
  });
});

router.get("/crearJornada", (req, res) => {
  res.render("crearJornada.ejs");
});

router.get("/deleteJornadas/:fecha", (req, res) => {
  const fecha = req.params.fecha;
  conexion.query(
    "DELETE FROM jornadas WHERE fecha = ?",
    [fecha],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/jornadas");
      }
    }
  );
});

router.get("/deportes", (req, res) => {
  conexion.query("SELECT * FROM deporte", (error, deporte) => {
    if (error) {
      console.log(error);
    } else {
      res.render("deportes.ejs", { deporte: deporte }); //render muestra el archivo ejs
    }
  });
});

router.get("/crearDeporte", (req, res) => {
  res.render("crearDeporte.ejs");
});

router.get("/editarDeporte/:id", (req, res) => {
  const id = req.params.id;

  conexion.query("SELECT * FROM deporte WHERE id=?", [id], (error, deporte) => {
    if (error) {
      throw error;
    } else {
      res.render("editarDeporte.ejs", { deporte: deporte[0] });
    }
  });
});

router.get("/deleteDeporte/:id", (req, res) => {
  const id = req.params.id;
  conexion.query("DELETE FROM deporte WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/deportes");
    }
  });
});

router.get("/rankingIndividual", (req, res) => {
  conexion.query("SELECT * FROM rankini", (error, rankini) => {
    if (error) {
      console.log(error);
    } else {
      res.render("rankingIndividual.ejs", { rankini: rankini }); //render muestra el archivo ejs
    }
  });
});

router.get("/crearRankingIndividual", (req, res) => {
  conexion.query("SELECT * FROM jugador", (error, jugadores) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM deporte", (error, deportes) => {
        if (error) {
          console.log(error);
        } else {
          res.render("crearRankingIndividual.ejs", {
            jugadores: jugadores,
            deportes: deportes,
          });
        }
      });
    }
  });
});

router.get("/editarRankingRI/:id", (req, res) => {
  const id = req.params.id;
  conexion.query(
    "SELECT * FROM rankini WHERE id=?",
    [id],
    (error, rankingRI) => {
      if (error) {
        throw error;
      } else {
        res.render("editarRankingRI.ejs", {
          rankingRI: rankingRI[0],
        });
      }
    }
  );
});

router.get("/deleteRI/:id", (req, res) => {
  const id = req.params.id;
  conexion.query("DELETE FROM rankini WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/rankingIndividual");
    }
  });
});

// Ranking Equipos

router.get("/rankingEquipos", (req, res) => {
  conexion.query("SELECT * FROM rankinge", (error, rankinge) => {
    if (error) {
      console.log(error);
    } else {
      res.render("rankingEquipos.ejs", { rankinge: rankinge }); //render muestra el archivo ejs
    }
  });
});

router.get("/crearRankingEquipos", (req, res) => {
  conexion.query("SELECT * FROM equipos", (error, equipos) => {
    if (error) {
      console.log(error);
    } else {
      conexion.query("SELECT * FROM deporte", (error, deportes) => {
        if (error) {
          console.log(error);
        } else {
          res.render("crearRankingEquipos.ejs", {
            equipos: equipos,
            deportes: deportes,
          });
        }
      });
    }
  });
});

router.get("/editarRankingRE/:id", (req, res) => {
  const id = req.params.id;
  conexion.query(
    "SELECT * FROM rankinge WHERE id=?",
    [id],
    (error, rankingRE) => {
      if (error) {
        throw error;
      } else {
        res.render("editarRankingRE.ejs", {
          rankingRE: rankingRE[0],
        });
      }
    }
  );
});

router.get("/deleteRE/:id", (req, res) => {
  const id = req.params.id;
  conexion.query(
    "DELETE FROM rankinge WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/rankingEquipos");
      }
    }
  );
});

router.get("/home", (req, res) => {
  conexion.query("SELECT * FROM deporte", (error, deportes) => {
    if (error) {
      console.log(error);
    } else {
      res.render("home.ejs", { deportes: deportes}); //render muestra el archivo ejs
    }
  });
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
        if(error){
          console.log(error);
        }else{
          conexion.query("SELECT * FROM deporte", (error, deportes) => {
            if (error) {
              console.log(error);
            } else {
              conexion.query("SELECT * FROM deporte WHERE id=?",[id],(error, deporte) => {
                if (error) {
                  console.log(error);
                  throw error;
                } else {
                   if(deporte[0].tipoDeporte == "Individual"){
                    res.render("ranking.ejs", { ranking:ranking,deportes: deportes,deporte:deporte[0]}); //render muestra el archivo ejs
                  }else if(deporte[0].tipoDeporte == "Equipos"){
                    res.render("rankingE.ejs", { rankinge:rankinge,deportes: deportes,deporte:deporte[0]});
                  }
                }
              });
            }
          });
        }
      })
    }
  });
});



// Guardar registros
router.post("/saveJugador", mycrud.saveJugador);
router.post("/saveEquipo", mycrud.saveEquipo);
router.post("/saveCarrera", mycrud.saveCarrera);
router.post("/saveGrupo", mycrud.saveGrupo);
router.post("/savePartido", mycrud.savePartido);
router.post("/saveEliminatoria", mycrud.saveEliminatoria);
router.post("/saveEIndividuales", mycrud.saveEIndividuales);
router.post("/saveEGenerales", mycrud.saveEGenerales);
router.post("/saveEstadios", mycrud.saveEstadios);
router.post("/saveJornada", mycrud.saveJornada);
router.post("/saveDeporte", mycrud.saveDeporte);
router.post("/saveRI", mycrud.saveRI);
router.post("/saveRE", mycrud.saveRE);

// actualizar registros
router.post("/updateJugador", mycrud.updateJugador);
router.post("/updateEquipo", mycrud.updateEquipo);
router.post("/updateCarrera", mycrud.updateCarrera);
router.post("/updateEliminatoria", mycrud.updateEliminatoria);
router.post("/updateEstadio", mycrud.updateEstadio);
router.post("/updateEstadisticasGenerales", mycrud.updateEstadisticasGenerales);
router.post("/updateDeporte", mycrud.updateDeporte);
router.post("/updateRI", mycrud.updateRI);
router.post("/updateRE", mycrud.updateRE);

export default router;
