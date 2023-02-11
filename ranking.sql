-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-02-2023 a las 19:40:01
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `fifa4`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alojan`
--

CREATE TABLE `alojan` (
  `codHotel` int(11) NOT NULL,
  `codEquipo` varchar(3) NOT NULL,
  `codPartido` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `arbitran`
--

CREATE TABLE `arbitran` (
  `codArbitro` int(11) NOT NULL,
  `codPartido` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `arbitro`
--

CREATE TABLE `arbitro` (
  `codArbitro` int(11) NOT NULL,
  `nombreArbitro` varchar(50) NOT NULL,
  `codPais` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `arbitro`
--

INSERT INTO `arbitro` (`codArbitro`, `nombreArbitro`, `codPais`) VALUES
(1, 'JOSE', 'COL'),
(2, 'MARIA', 'ESP'),
(3, 'JESUS', 'VEN');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudad`
--

CREATE TABLE `ciudad` (
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ciudad`
--

INSERT INTO `ciudad` (`nombre`) VALUES
('Buenos Aires'),
('Londres');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coloresuniforme`
--

CREATE TABLE `coloresuniforme` (
  `codEquipo` varchar(3) NOT NULL,
  `clocal` varchar(10) NOT NULL,
  `cvisitante` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `coloresuniforme`
--

INSERT INTO `coloresuniforme` (`codEquipo`, `clocal`, `cvisitante`) VALUES
('COL', '#e8af11', '#451f6b'),
('VEN', '#ad142e', '#7fa47f'),
('FRA', '#cbcf07', '#ff0000'),
('ESP', '#100dce', '#dae2da');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `confederacion`
--

CREATE TABLE `confederacion` (
  `nombreConf` varchar(50) NOT NULL,
  `continente` varchar(50) NOT NULL,
  `siglasConf` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `confederacion`
--

INSERT INTO `confederacion` (`nombreConf`, `continente`, `siglasConf`) VALUES
('CONMEBOL SUDAMERICA', 'América', 'CON'),
('EURO', 'Europa', 'EUF'),
('Ing. Informática', 'América', 'INF');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eliminatorias`
--

CREATE TABLE `eliminatorias` (
  `codPais` varchar(3) NOT NULL,
  `juegos_ganados` int(11) NOT NULL,
  `juegos_perdidos` int(11) NOT NULL,
  `goles_a_favor` int(11) NOT NULL,
  `goles_en_contra` int(11) NOT NULL,
  `clasificacion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo`
--

CREATE TABLE `equipo` (
  `codEquipo` varchar(3) NOT NULL,
  `esloganEquipo` varchar(50) NOT NULL,
  `nombreDT` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `equipo`
--

INSERT INTO `equipo` (`codEquipo`, `esloganEquipo`, `nombreDT`) VALUES
('COL', 'Colombia bonita', 'Pekerman'),
('ESP', 'VIVA EL TIGRE', 'SAMUEL ROJAS'),
('FRA', 'DAMA', 'FRANCE'),
('VEN', 'vinotinto', 'Cesar farias');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadio`
--

CREATE TABLE `estadio` (
  `codEstadio` int(11) NOT NULL,
  `ubicacion` varchar(50) NOT NULL,
  `nombreEstadio` varchar(50) NOT NULL,
  `capacidad` int(11) NOT NULL,
  `nombreCiudad` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estadio`
--

INSERT INTO `estadio` (`codEstadio`, `ubicacion`, `nombreEstadio`, `capacidad`, `nombreCiudad`) VALUES
(1, 'dubai', 'Esradio', 100, 'Buenos Aires'),
(123, 'qatar', 'Hotel Dubai', 99999, 'Buenos Aires'),
(4321, 'xxx', 'carabobo', 30000, 'Buenos Aires');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticasgenerales`
--

CREATE TABLE `estadisticasgenerales` (
  `codEquipo` varchar(3) NOT NULL,
  `codPartido` int(11) NOT NULL,
  `posesionBalon` int(11) NOT NULL,
  `tirosArco` int(11) NOT NULL,
  `tirosArcoAcertados` int(11) NOT NULL,
  `tirosArcoFallados` int(11) NOT NULL,
  `tiroSEsquina` int(11) NOT NULL,
  `atajadasPortero` int(11) NOT NULL,
  `pases` int(11) NOT NULL,
  `pasesCortos` int(11) NOT NULL,
  `pasesLargos` int(11) NOT NULL,
  `entradas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estadisticasgenerales`
--

INSERT INTO `estadisticasgenerales` (`codEquipo`, `codPartido`, `posesionBalon`, `tirosArco`, `tirosArcoAcertados`, `tirosArcoFallados`, `tiroSEsquina`, `atajadasPortero`, `pases`, `pasesCortos`, `pasesLargos`, `entradas`) VALUES
('COL', 2, 67, 6, 8, 9, 9, 9, 45, 44, 23, 2),
('ESP', 2, 88, 7, 78, 8, 8, 8, 8, 8, 8, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticasindividuales`
--

CREATE TABLE `estadisticasindividuales` (
  `codJugador` int(11) NOT NULL,
  `codPartido` int(11) NOT NULL,
  `ataque` int(11) NOT NULL,
  `defensa` int(11) NOT NULL,
  `pases` int(11) NOT NULL,
  `golesAnotados` int(11) NOT NULL,
  `asistencias` int(11) NOT NULL,
  `autogoles` int(11) NOT NULL,
  `penaltis` int(11) NOT NULL,
  `tarjetasAmarillas` int(11) NOT NULL,
  `tarjetasRojas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estadisticasindividuales`
--

INSERT INTO `estadisticasindividuales` (`codJugador`, `codPartido`, `ataque`, `defensa`, `pases`, `golesAnotados`, `asistencias`, `autogoles`, `penaltis`, `tarjetasAmarillas`, `tarjetasRojas`) VALUES
(1, 2, 12, 12, 12, 12, 12, 12, 2, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticasportero`
--

CREATE TABLE `estadisticasportero` (
  `codJugador` int(11) NOT NULL,
  `codPartido` int(11) NOT NULL,
  `disparosAtajados` int(11) NOT NULL,
  `disparosDesviados` int(11) NOT NULL,
  `golesRecibidos` int(11) NOT NULL,
  `penaltisAtajados` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo`
--

CREATE TABLE `grupo` (
  `letraGrupo` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hotel`
--

CREATE TABLE `hotel` (
  `codHotel` int(11) NOT NULL,
  `nombreHotel` varchar(50) NOT NULL,
  `direccion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `hotel`
--

INSERT INTO `hotel` (`codHotel`, `nombreHotel`, `direccion`) VALUES
(123, 'hola1', 'direicon'),
(12333, '3', 'asd');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jornadas`
--

CREATE TABLE `jornadas` (
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `jornadas`
--

INSERT INTO `jornadas` (`fecha`) VALUES
('0000-00-00 00:00:00'),
('2022-02-02 14:02:00'),
('2023-01-20 13:33:00'),
('2023-01-21 15:35:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juegan`
--

CREATE TABLE `juegan` (
  `codPartido` int(11) NOT NULL,
  `codEquipo1` varchar(3) NOT NULL,
  `codEquipo2` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `juegan`
--

INSERT INTO `juegan` (`codPartido`, `codEquipo1`, `codEquipo2`) VALUES
(2, 'COL', 'VEN'),
(3, 'ESP', 'FRA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugador`
--

CREATE TABLE `jugador` (
  `codJugador` int(11) NOT NULL,
  `nombreJugador` varchar(50) NOT NULL,
  `aliasJugador` varchar(50) DEFAULT NULL,
  `posicionJugador` varchar(50) NOT NULL,
  `nroCamisa` int(11) NOT NULL,
  `fechaNac` date NOT NULL,
  `codEquipo` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `jugador`
--

INSERT INTO `jugador` (`codJugador`, `nombreJugador`, `aliasJugador`, `posicionJugador`, `nroCamisa`, `fechaNac`, `codEquipo`) VALUES
(1, 'JESUS RODRIGUEZ', 'EL DORMILON', 'Delantero', 10, '2023-01-20', 'ESP'),
(2, 'CARLOS LOPEZ', 'CASAC', 'Portero', 1, '2023-01-03', 'ESP'),
(3, 'EMBAPE', 'TORTUGA', 'Delantero Extremo Lateral', 12, '2023-01-11', 'FRA'),
(5, 'EMBAPE', 'TORTUGA NINJA', 'Delantero Extremo Lateral', 10, '0000-00-00', 'FRA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pais`
--

CREATE TABLE `pais` (
  `codPais` varchar(3) NOT NULL,
  `nombrePais` varchar(50) NOT NULL,
  `nombreConf` varchar(50) NOT NULL,
  `letraGrupo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pais`
--

INSERT INTO `pais` (`codPais`, `nombrePais`, `nombreConf`, `letraGrupo`) VALUES
('COL', 'Colombia', 'CONMEBOL SUDAMERICA', NULL),
('ESP', 'ESPAÑA', 'EURO', NULL),
('FRA', 'FRANCIA', 'EURO', NULL),
('VEN', 'Venezuela', 'CONMEBOL SUDAMERICA', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partido`
--

CREATE TABLE `partido` (
  `codPartido` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `codEstadio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `partido`
--

INSERT INTO `partido` (`codPartido`, `fecha`, `codEstadio`) VALUES
(2, '0000-00-00 00:00:00', 1),
(3, '2022-02-02 14:02:00', 4321);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `telefonos`
--

CREATE TABLE `telefonos` (
  `numTelefono` int(11) NOT NULL,
  `codHotel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alojan`
--
ALTER TABLE `alojan`
  ADD PRIMARY KEY (`codHotel`,`codEquipo`,`codPartido`),
  ADD KEY `codEquipo` (`codEquipo`),
  ADD KEY `codPartido` (`codPartido`);

--
-- Indices de la tabla `arbitran`
--
ALTER TABLE `arbitran`
  ADD PRIMARY KEY (`codArbitro`,`codPartido`),
  ADD KEY `codPartido` (`codPartido`);

--
-- Indices de la tabla `arbitro`
--
ALTER TABLE `arbitro`
  ADD PRIMARY KEY (`codArbitro`),
  ADD KEY `codPais` (`codPais`);

--
-- Indices de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`nombre`);

--
-- Indices de la tabla `coloresuniforme`
--
ALTER TABLE `coloresuniforme`
  ADD KEY `colores_cascade` (`codEquipo`);

--
-- Indices de la tabla `confederacion`
--
ALTER TABLE `confederacion`
  ADD PRIMARY KEY (`nombreConf`),
  ADD UNIQUE KEY `siglasConf` (`siglasConf`);

--
-- Indices de la tabla `eliminatorias`
--
ALTER TABLE `eliminatorias`
  ADD PRIMARY KEY (`codPais`);

--
-- Indices de la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD PRIMARY KEY (`codEquipo`);

--
-- Indices de la tabla `estadio`
--
ALTER TABLE `estadio`
  ADD PRIMARY KEY (`codEstadio`),
  ADD KEY `estadio_cascade` (`nombreCiudad`);

--
-- Indices de la tabla `estadisticasgenerales`
--
ALTER TABLE `estadisticasgenerales`
  ADD PRIMARY KEY (`codEquipo`,`codPartido`),
  ADD KEY `codPartido` (`codPartido`);

--
-- Indices de la tabla `estadisticasindividuales`
--
ALTER TABLE `estadisticasindividuales`
  ADD PRIMARY KEY (`codJugador`,`codPartido`),
  ADD KEY `codPartido` (`codPartido`);

--
-- Indices de la tabla `estadisticasportero`
--
ALTER TABLE `estadisticasportero`
  ADD PRIMARY KEY (`codJugador`,`codPartido`),
  ADD KEY `codPartido` (`codPartido`);

--
-- Indices de la tabla `grupo`
--
ALTER TABLE `grupo`
  ADD PRIMARY KEY (`letraGrupo`);

--
-- Indices de la tabla `hotel`
--
ALTER TABLE `hotel`
  ADD PRIMARY KEY (`codHotel`);

--
-- Indices de la tabla `jornadas`
--
ALTER TABLE `jornadas`
  ADD PRIMARY KEY (`fecha`);

--
-- Indices de la tabla `juegan`
--
ALTER TABLE `juegan`
  ADD PRIMARY KEY (`codPartido`),
  ADD KEY `codEquipo1` (`codEquipo1`),
  ADD KEY `codEquipo2` (`codEquipo2`);

--
-- Indices de la tabla `jugador`
--
ALTER TABLE `jugador`
  ADD PRIMARY KEY (`codJugador`),
  ADD KEY `jugador_cascade` (`codEquipo`);

--
-- Indices de la tabla `pais`
--
ALTER TABLE `pais`
  ADD PRIMARY KEY (`codPais`),
  ADD UNIQUE KEY `nombrePais` (`nombrePais`),
  ADD KEY `pais_cascade_confederacion` (`nombreConf`),
  ADD KEY `pais_cascade_grupo` (`letraGrupo`);

--
-- Indices de la tabla `partido`
--
ALTER TABLE `partido`
  ADD PRIMARY KEY (`codPartido`),
  ADD KEY `codEstadio` (`codEstadio`),
  ADD KEY `partido_cascade` (`fecha`);

--
-- Indices de la tabla `telefonos`
--
ALTER TABLE `telefonos`
  ADD PRIMARY KEY (`numTelefono`,`codHotel`),
  ADD KEY `telefonos_cascade` (`codHotel`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `arbitro`
--
ALTER TABLE `arbitro`
  MODIFY `codArbitro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estadio`
--
ALTER TABLE `estadio`
  MODIFY `codEstadio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4322;

--
-- AUTO_INCREMENT de la tabla `hotel`
--
ALTER TABLE `hotel`
  MODIFY `codHotel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12334;

--
-- AUTO_INCREMENT de la tabla `jugador`
--
ALTER TABLE `jugador`
  MODIFY `codJugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `partido`
--
ALTER TABLE `partido`
  MODIFY `codPartido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alojan`
--
ALTER TABLE `alojan`
  ADD CONSTRAINT `alojan_ibfk_1` FOREIGN KEY (`codHotel`) REFERENCES `hotel` (`codHotel`),
  ADD CONSTRAINT `alojan_ibfk_2` FOREIGN KEY (`codEquipo`) REFERENCES `equipo` (`codEquipo`),
  ADD CONSTRAINT `alojan_ibfk_3` FOREIGN KEY (`codPartido`) REFERENCES `partido` (`codPartido`);

--
-- Filtros para la tabla `arbitran`
--
ALTER TABLE `arbitran`
  ADD CONSTRAINT `arbitran_ibfk_1` FOREIGN KEY (`codArbitro`) REFERENCES `arbitro` (`codArbitro`),
  ADD CONSTRAINT `arbitran_ibfk_2` FOREIGN KEY (`codPartido`) REFERENCES `partido` (`codPartido`);

--
-- Filtros para la tabla `arbitro`
--
ALTER TABLE `arbitro`
  ADD CONSTRAINT `arbitro_ibfk_1` FOREIGN KEY (`codPais`) REFERENCES `pais` (`codPais`);

--
-- Filtros para la tabla `coloresuniforme`
--
ALTER TABLE `coloresuniforme`
  ADD CONSTRAINT `colores_cascade` FOREIGN KEY (`codEquipo`) REFERENCES `equipo` (`codEquipo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coloresuniforme_ibfk_1` FOREIGN KEY (`codEquipo`) REFERENCES `equipo` (`codEquipo`);

--
-- Filtros para la tabla `eliminatorias`
--
ALTER TABLE `eliminatorias`
  ADD CONSTRAINT `eliminatorias_ibfk_1` FOREIGN KEY (`codPais`) REFERENCES `pais` (`codPais`);

--
-- Filtros para la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD CONSTRAINT `equipo_cascade` FOREIGN KEY (`codEquipo`) REFERENCES `pais` (`codPais`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `equipo_ibfk_1` FOREIGN KEY (`codEquipo`) REFERENCES `pais` (`codPais`);

--
-- Filtros para la tabla `estadio`
--
ALTER TABLE `estadio`
  ADD CONSTRAINT `estadio_cascade` FOREIGN KEY (`nombreCiudad`) REFERENCES `ciudad` (`nombre`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estadio_ibfk_1` FOREIGN KEY (`nombreCiudad`) REFERENCES `ciudad` (`nombre`);

--
-- Filtros para la tabla `estadisticasgenerales`
--
ALTER TABLE `estadisticasgenerales`
  ADD CONSTRAINT `estadisticasgenerales_ibfk_1` FOREIGN KEY (`codEquipo`) REFERENCES `equipo` (`codEquipo`),
  ADD CONSTRAINT `estadisticasgenerales_ibfk_2` FOREIGN KEY (`codPartido`) REFERENCES `partido` (`codPartido`);

--
-- Filtros para la tabla `estadisticasindividuales`
--
ALTER TABLE `estadisticasindividuales`
  ADD CONSTRAINT `estadisticasindividuales_ibfk_1` FOREIGN KEY (`codJugador`) REFERENCES `jugador` (`codJugador`),
  ADD CONSTRAINT `estadisticasindividuales_ibfk_2` FOREIGN KEY (`codPartido`) REFERENCES `partido` (`codPartido`);

--
-- Filtros para la tabla `estadisticasportero`
--
ALTER TABLE `estadisticasportero`
  ADD CONSTRAINT `estadisticasportero_ibfk_1` FOREIGN KEY (`codJugador`) REFERENCES `jugador` (`codJugador`),
  ADD CONSTRAINT `estadisticasportero_ibfk_2` FOREIGN KEY (`codPartido`) REFERENCES `partido` (`codPartido`);

--
-- Filtros para la tabla `juegan`
--
ALTER TABLE `juegan`
  ADD CONSTRAINT `juegan_cascade` FOREIGN KEY (`codPartido`) REFERENCES `partido` (`codPartido`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `juegan_ibfk_1` FOREIGN KEY (`codPartido`) REFERENCES `partido` (`codPartido`),
  ADD CONSTRAINT `juegan_ibfk_2` FOREIGN KEY (`codEquipo1`) REFERENCES `equipo` (`codEquipo`),
  ADD CONSTRAINT `juegan_ibfk_3` FOREIGN KEY (`codEquipo2`) REFERENCES `equipo` (`codEquipo`);

--
-- Filtros para la tabla `jugador`
--
ALTER TABLE `jugador`
  ADD CONSTRAINT `jugador_cascade` FOREIGN KEY (`codEquipo`) REFERENCES `equipo` (`codEquipo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `jugador_ibfk_1` FOREIGN KEY (`codEquipo`) REFERENCES `equipo` (`codEquipo`);

--
-- Filtros para la tabla `pais`
--
ALTER TABLE `pais`
  ADD CONSTRAINT `pais_cascade_confederacion` FOREIGN KEY (`nombreConf`) REFERENCES `confederacion` (`nombreConf`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pais_cascade_grupo` FOREIGN KEY (`letraGrupo`) REFERENCES `grupo` (`letraGrupo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pais_ibfk_1` FOREIGN KEY (`nombreConf`) REFERENCES `confederacion` (`nombreConf`),
  ADD CONSTRAINT `pais_ibfk_2` FOREIGN KEY (`letraGrupo`) REFERENCES `grupo` (`letraGrupo`);

--
-- Filtros para la tabla `partido`
--
ALTER TABLE `partido`
  ADD CONSTRAINT `partido_cascade` FOREIGN KEY (`fecha`) REFERENCES `jornadas` (`fecha`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `partido_ibfk_1` FOREIGN KEY (`fecha`) REFERENCES `jornadas` (`fecha`),
  ADD CONSTRAINT `partido_ibfk_2` FOREIGN KEY (`codEstadio`) REFERENCES `estadio` (`codEstadio`);

--
-- Filtros para la tabla `telefonos`
--
ALTER TABLE `telefonos`
  ADD CONSTRAINT `telefonos_cascade` FOREIGN KEY (`codHotel`) REFERENCES `hotel` (`codHotel`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `telefonos_ibfk_1` FOREIGN KEY (`codHotel`) REFERENCES `hotel` (`codHotel`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
