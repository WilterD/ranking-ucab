const conexion = require("../database/db.cjs");

exports.getEquiposPage = (req, res) => {
  const id = req.params.id;
  const jugadoresEquiposSQL = `SELECT
  e.nombreEquipo AS NombreEquipo,
  j.nombreJugador AS NombreJugador
FROM
  equipos e
  INNER JOIN jugadores_equipos je ON e.codEquipo = je.codEquipo
  INNER JOIN jugador j ON je.codJugador = j.codJugador
  INNER JOIN deporte d ON e.codDeporte = d.id
WHERE
  d.id = ?
ORDER BY
  e.nombreEquipo, j.nombreJugador;`;

  conexion.query(jugadoresEquiposSQL, [id], (error, jugadoresEquipos) => {
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

      const torneosSQL = `
            SELECT * FROM torneos`;
      conexion.query(torneosSQL, (error, torneos) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Error de servidor");
        }

        const deportesConEquiposSQL = `
        SELECT DISTINCT d.nombreDeporte, d.id
        FROM deporte d
        INNER JOIN equipos e ON d.id = e.codDeporte
        INNER JOIN jugadores_equipos je ON e.codEquipo = je.codEquipo
        `;

        

        conexion.query(deportesConEquiposSQL, (error, deportesConEquipos) => {
          if (error) {
            console.log(error);
            return res.status(500).send("Error de servidor");
          }
          // deporte seleccionado vista
          const deporteSeleccionadoSQL = `
            SELECT DISTINCT d.nombreDeporte
            FROM deporte d
            WHERE d.id = ?`;

          conexion.query(
            deporteSeleccionadoSQL,
            [id],
            (error, deporteSeleccionado) => {
              if (error) {
                console.log(error);
                return res.status(500).send("Error de servidor");
              }

              res.render("equipos.ejs", {
                jugadoresEquipos,
                deportes,
                torneos,
                deportesConEquipos,
                deporteSeleccionado,
              });
            }
          );
        });
      });
    });
  });
};
