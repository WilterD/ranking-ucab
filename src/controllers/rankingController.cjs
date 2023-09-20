const conexion = require("../database/db.cjs");

exports.getRankingPage = (req, res) => {
  const id = req.params.id;
  const tipoDeporteSQL = "SELECT tipoDeporte FROM deporte WHERE id = ?";
  const rankiniSQL = `SELECT r.id, t.nombreTorneo, d.nombreDeporte, r.puntos, c.nombreCarrera, r.nombreJugador
    FROM rankini r
    LEFT JOIN torneos t ON r.codTorneo = t.codTorneo
    LEFT JOIN deporte d ON r.codDeporte = d.id
    LEFT JOIN carreras c ON r.codCarrera = c.id
    WHERE r.codDeporte = ?`;

  const rangingeSQL = `SELECT t.nombreTorneo, d.nombreDeporte, r.puntos, r.id, r.nombreEquipo 
 FROM rankinge r 
 JOIN deporte d ON r.codDeporte = d.id 
 LEFT JOIN torneos t ON r.codTorneo = t.codTorneo
 WHERE r.codDeporte = ?`;

  const deportesSQL = "SELECT * FROM deporte";

  // verificar si el deporte es individual o por equipos y mostrar la tabla correspondiente con sus datos
  conexion.query(tipoDeporteSQL, [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result[0].tipoDeporte == "Individual") {
        conexion.query(rankiniSQL, [id], (err, rankini) => {
          if (err) {
            console.log(err);
          } else {
            conexion.query(deportesSQL, (err, deportes) => {
              if (err) {
                console.log(err);
              } else {
                res.render("admin/rankingIndividual.ejs", {
                  rankini: rankini,
                  deportes: deportes,
                });
              }
            });
          }
        });
      } else {
        conexion.query(rangingeSQL,[id], (err, rankinge) => {
          if (err) {
            console.log(err);
          } else {
            conexion.query(deportesSQL, (err, deportes) => {
              if (err) {
                console.log(err);
              } else {
                res.render("admin/rankingEquipos.ejs", {
                  rankinge: rankinge,
                  deportes: deportes,
                });
              }
            });
          }
        });
      }
    }
  });
};
