const conexion = require("../database/db.cjs");

exports.getHomePage = (req, res) => {
  const eliminatoriasSQL = `
    SELECT t.nombreTorneo, eq.nombreEquipo, d.nombreDeporte, e.*
    FROM eliminatorias e
    JOIN equipos eq ON e.codEquipo = eq.codEquipo
    JOIN deporte d ON eq.codDeporte = d.id
    JOIN torneos t ON e.codTorneo = t.codTorneo
    WHERE t.status = 1 
    ORDER BY e.puntos DESC;
  `;

  conexion.query(eliminatoriasSQL, (error, eliminatorias) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error de servidor");
    }

    const proximosPartidosSQL = `
      SELECT e1.nombreEquipo AS equipo1, e2.nombreEquipo AS equipo2, e1.imagen AS imagen1, e2.imagen AS imagen2, t.nombreTorneo, t.codTorneo, es.nombreEstadio, p.jornada, p.fecha, p.etapa, d.nombreDeporte, p.codPartido 
      FROM partido p 
      INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo 
      INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo 
      INNER JOIN estadio es ON p.codEstadio = es.codEstadio 
      INNER JOIN deporte d ON p.codDeporte = d.id 
      INNER JOIN torneos t ON p.codTorneo = t.codTorneo 
      WHERE p.fecha >= NOW() AND t.status = 1 
      ORDER BY p.fecha ASC;
    `;

    conexion.query(proximosPartidosSQL, (error, partidos) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Error de servidor");
      }

      const deportesSQL = `
      SELECT DISTINCT d.nombreDeporte, t.nombreTorneo, d.id, t.codTorneo
        FROM deporte d
        INNER JOIN torneos t ON t.codTorneo IN (
            SELECT DISTINCT codTorneo FROM rankini WHERE codDeporte = d.id
            UNION
            SELECT DISTINCT codTorneo FROM rankinge WHERE codDeporte = d.id
        )
        WHERE t.status = 1`;

      conexion.query(deportesSQL, (error, deportes) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Error de servidor");
        }

        const partidosTorneosSQL = `
        SELECT p.fecha, p.jornada, p.etapa, e1.nombreEquipo AS equipo1, e1.imagen AS imagen1, e2.imagen AS imagen2, p.puntos1, e2.nombreEquipo AS equipo2, p.puntos2 
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
            END`;

        conexion.query(partidosTorneosSQL, (error, partidosTorneos) => {
          if (error) {
            console.log(error);
            return res.status(500).send("Error de servidor");
          }

          const resultadosSQL = `SELECT 
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
      FROM 
          partido p 
          INNER JOIN equipos e1 ON p.codEquipo1 = e1.codEquipo 
          INNER JOIN equipos e2 ON p.codEquipo2 = e2.codEquipo 
          INNER JOIN torneos t ON p.codTorneo = t.codTorneo 
          LEFT JOIN (
              SELECT 
                  g.codPartido, 
                  g.codEquipo, 
                  GROUP_CONCAT(CONCAT(j.nombreJugador, ' (', g.goles, ')') ORDER BY g.goles DESC SEPARATOR ', ') AS nombreJugador
              FROM 
                  goleadores g 
                  INNER JOIN jugador j ON g.codJugador = j.codJugador 
              GROUP BY g.codPartido, g.codEquipo
          ) j1 ON p.codPartido = j1.codPartido AND e1.codEquipo = j1.codEquipo 
          LEFT JOIN (
              SELECT 
                  g.codPartido, 
                  g.codEquipo, 
                  GROUP_CONCAT(CONCAT(j.nombreJugador, ' (', g.goles, ')') ORDER BY g.goles DESC SEPARATOR ', ') AS nombreJugador
              FROM 
                  goleadores g 
                  INNER JOIN jugador j ON g.codJugador = j.codJugador 
              GROUP BY g.codPartido, g.codEquipo
          ) j2 ON p.codPartido = j2.codPartido AND e2.codEquipo = j2.codEquipo 
      WHERE 
          t.status = 1 
          AND DATE(p.fecha) <= CURDATE()  -- Filtrar por fechas menores o iguales a la fecha actual
      GROUP BY 
          t.nombreTorneo,
          p.codPartido, 
          e1.codEquipo, 
          e2.codEquipo 
      ORDER BY 
          p.jornada ASC, 
          CASE p.etapa 
              WHEN 'CUARTOS DE FINAL' THEN 1 
              WHEN 'SEMIFINAL' THEN 2 
              WHEN 'TERCER LUGAR' THEN 3 
              WHEN 'FINAL SELECT' THEN 4 
              ELSE 5 
          END
      `;

          conexion.query(resultadosSQL, (error, resultados) => {
            if (error) {
              console.log(error);
              return res.status(500).send("Error de servidor");
            }

            const torneosSQL = `
            SELECT * FROM torneos`;
            conexion.query(torneosSQL, (error, torneos) => {
              if (error) {
                console.log(error);
                return res.status(500).send("Error de servidor");
              }

              const rankingGeneralSQL = 
              `SELECT DISTINCT r.nombreJugador,c.nombreCarrera,d.nombreDeporte, SUM(r.puntos) AS total_puntos
              FROM rankini r
              LEFT JOIN jugador j ON j.codJugador = r.codJugador
              JOIN carreras c ON c.id = r.codCarrera
              JOIN deporte d ON d.id = r.codDeporte
              WHERE r.codUniversidad = 1
              GROUP BY r.nombreJugador, c.nombreCarrera,d.nombreDeporte
              ORDER BY d.nombredeporte DESC,total_puntos DESC`;

              conexion.query(rankingGeneralSQL, (error, rankingGeneral) => {
                if (error) {
                  console.log(error);
                  return res.status(500).send("Error de servidor");
                }

                const rankingGeneralEquiposSQL = `SELECT DISTINCT d.nombreDeporte, r.nombreEquipo, SUM(r.puntos) AS total_puntos
                FROM rankinge r
                JOIN deporte d ON d.id = r.codDeporte
                LEFT JOIN equipos e ON e.codEquipo = r.codEquipo
                WHERE r.codUniversidad = 1
                GROUP BY d.nombreDeporte, r.nombreEquipo
                ORDER BY d.nombredeporte DESC,total_puntos DESC`;

                conexion.query(
                  rankingGeneralEquiposSQL,
                  (error, rankingGeneralEquipos) => {
                    if (error) {
                      console.log(error);
                      return res.status(500).send("Error de servidor");
                    }

                    const goleadoresSQL = `SELECT j.nombreJugador, e.nombreEquipo, d.nombreDeporte, SUM(g.goles) AS goles_totales
                    FROM goleadores g
                    INNER JOIN jugador j ON g.codJugador = j.codJugador
                    INNER JOIN equipos e ON e.codEquipo = g.codEquipo
                    INNER JOIN deporte d ON d.id = g.codDeporte
                    INNER JOIN torneos t ON t.codTorneo = g.codTorneo
                    WHERE t.status = 1
                    GROUP BY j.codJugador, j.nombreJugador, e.nombreEquipo, d.nombreDeporte
                    ORDER BY goles_totales DESC`;

                    conexion.query(goleadoresSQL, (error, goleadores) => {
                      if (error) {
                        console.log(error);
                        return res.status(500).send("Error de servidor");
                      }

                      const deportesConEquiposSQL = `
                      SELECT DISTINCT d.nombreDeporte, d.id
                      FROM deporte d
                      WHERE d.id IN (
                        SELECT DISTINCT e.codDeporte
                        FROM equipos e
                        INNER JOIN jugadores_equipos je ON e.codEquipo = je.codEquipo
                      );`;

                      conexion.query(
                        deportesConEquiposSQL,
                        (error, deportesConEquipos) => {
                          if (error) {
                            console.log(error);
                            return res.status(500).send("Error de servidor");
                          }

                          console.log(resultados)

                          res.render("home.ejs", {
                            eliminatorias,
                            partidos,
                            deportes,
                            partidosTorneos,
                            resultados,
                            torneos,
                            rankingGeneral,
                            rankingGeneralEquipos,
                            goleadores,
                            deportesConEquipos,
                          });
                        }
                      );
                    });
                  }
                );
              });
            }); // cierre de conexion.query
          });
        });
      });
    });
  });
};
