$(document).ready(function () {
  // Configuración genérica de DataTables
  const defaultConfig = {
    language: {
      lengthMenu: "Mostrar _MENU_ registros",
      zeroRecords: "No se encontraron resultados",
      info: "",
      infoEmpty: "",
      infoFiltered: "",
      sSearch: "Buscar:",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
      sProcessing: "Procesando...",
    },
    responsive: true,
    dom: "Bfrtilp",
    buttons: [
      {
        extend: "excelHtml5",
        text: '<i class="fas fa-file-excel"></i>',
        titleAttr: "Exportar a Excel",
        className: "btn btn-success",
      },
      {
        extend: "pdfHtml5",
        text: '<i class="fas fa-file-pdf"></i>',
        titleAttr: "Exportar a PDF",
        className: "btn btn-danger",
        customize: function (doc) {
          // Oculta la columna "Acciones" en la versión PDF
          doc.content[1].table.body.forEach(function (row) {
            row.splice(-1, 1); // Elimina la última celda de cada fila
          });

          // Define el contenido personalizado del encabezado
          var header = {
            columns: [
              {
                text: "https://ucabsport.com", // Puedes reemplazar esto con tu encabezado personalizado
                alignment: "center",
                margin: [0, 20, 0, 0],
                fontSize: 12,
                fontFamily: "Roboto",
                bold: true,
              },
            ],
          };

          // Agregar el encabezado al documento PDF
          doc["header"] = header;

          // image
          // https://i.imgur.com/qfgeBgk.png
        },
      },
    ],
  };

  // Configuraciones específicas para tablas individuales
  const tableConfigurations = {
    tablaEliminatoria: {
      order: [[9, "desc"]],
    },
    tablaEquipos: {
      order: [[1, "desc"]],
    },
    tablaDeportes: {
      order: [[0, "desc"]],
    },
    tablaTorneos: {
      order: [[0, "desc"]],
    },
    tablaPartidos: {
      order: [[0, "desc"]],
    },
    tablaJugadores: {
      order: [[0, "asc"]],
    },
    rankingIndividualTabla: {
      order: [[5, "desc"]],
      columnDefs: [
        {
          orderable: false,
          targets: [0, 1, 2, 3, 4, 5], // deshabilitar ordenamiento en la columna "Acciones"
        },
      ],
      fnRowCallback: function (nRow, aData, iDisplayIndex) {
        var index = iDisplayIndex + 1; // Obtener el índice de la fila después de filtrar y sumar 1
        $("td:eq(0)", nRow).text(index); // Actualizar el número de posición en la primera columna
        return nRow;
      },
    },
    rankingEquiposTabla: {
      order: [[3, "desc"]], // Ordenar por la columna de Puntos en orden descendente
      columnDefs: [
        {
          orderable: false,
          targets: [0, 1, 2, 4], // deshabilitar ordenamiento en la columna "Acciones"
        },
      ],
      fnRowCallback: function (nRow, aData, iDisplayIndex) {
        var index = iDisplayIndex + 1; // Obtener el índice de la fila después de filtrar y sumar 1
        $("td:eq(0)", nRow).text(index); // Actualizar el número de posición en la primera columna
        return nRow;
      },
    },
    usuariosTabla: {
      order: [[0, "desc"]],
    },
  };

  // Función para inicializar una tabla específica
  function initializeTable(tableName) {
    const tableConfig = { ...defaultConfig, ...tableConfigurations[tableName] };

    $(`#${tableName}`).DataTable(tableConfig);
  }

  // Exporta la función para su uso en otros archivos
  window.initializeTable = initializeTable;
});
