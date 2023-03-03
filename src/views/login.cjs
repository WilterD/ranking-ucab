<html lang="es">
<head>
    <%- include('partials/head.ejs') %>
    <link rel="stylesheet" href="/css/main.css">
    <title>Admin Iniciar Sesión</title>
</head>
<body>
    <%- include('partials/navigation.ejs') %>
    <section class="home-section">
        <div class="home-content">
          <i class='bx bx-menu' ></i>
        </div>
      <div class="container mt-4">     
            <div class="card border-secondary">  
                <div class="card-header">Iniciar Sesión</div>
                <div class="card-body">
                    <form id="miForm" action="/login" method="post">
                        <div class="mb-3">
                            <label for="name" class="form-label">Usuario</label>
                            <input type="text" autocomplete="off" class="form-control" name="usuario" tabindex="1" required value="wilterd">
                        </div>  
                        <div class="mb-3">
                            <label for="name" class="form-label">Clave</label>
                            <input type="text" autocomplete="off" class="form-control" value="12345" name="clave" tabindex="1" required>
                        </div> 
                        <button id="submit-btn" type="submit" class="btn btn-primary" tabindex="5">Guardar</button>
                        <a href="/carreras" class="btn btn-secondary">Cancelar</a>
                    </form>
                </div>
            </div>        
      </div>
    </section>
    <section class="home-section">
      <div class="container">
          <div class="row">
              <div class="col-xs-12 mx-auto">
                  <div id="mensajes">
                      <p id="mensaje"></p>
                      <img class="rounded" src="images/medioAmbiente.png" width="330" height="230" />
                  </div>
              </div>
          </div>
      </div>
  </section>
 
</body>
</html>