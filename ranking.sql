-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-02-2023 a las 02:23:03
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
-- Base de datos: `ranking`
--

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
-- Estructura de tabla para la tabla `carreras`
--

CREATE TABLE `carreras` (
  `id` int(11) NOT NULL,
  `nombreCarrera` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `carreras`
--

INSERT INTO `carreras` (`id`, `nombreCarrera`) VALUES
(1, 'Ing Informática'),
(2, 'Ing. Industrial');

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
-- Estructura de tabla para la tabla `deporte`
--

CREATE TABLE `deporte` (
  `id` int(11) NOT NULL,
  `nombreDeporte` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `deporte`
--

INSERT INTO `deporte` (`id`, `nombreDeporte`) VALUES
(2, 'Baloncesto'),
(3, 'Tenis de mesa (Ping Pong)');

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
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `codEquipo` int(11) NOT NULL,
  `nombreEquipo` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombreDT` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombreDeporte` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`codEquipo`, `nombreEquipo`, `nombreDT`, `nombreDeporte`) VALUES
(5, 'Lokitos', 'Cesar', 'Baloncesto'),
(6, 'Wilter Díaz', 'Cesar Farías', 'Tenis de mesa (Ping Pong)');

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
  `codEquipo` int(11) NOT NULL,
  `codPartido` int(11) NOT NULL,
  `posesionBalon` int(10) UNSIGNED DEFAULT NULL,
  `tirosArco` int(10) UNSIGNED DEFAULT NULL,
  `tirosArcoAcertados` int(10) UNSIGNED DEFAULT NULL,
  `tirosArcoFallados` int(10) UNSIGNED DEFAULT NULL,
  `tiroSEsquina` int(10) UNSIGNED DEFAULT NULL,
  `atajadasPortero` int(10) UNSIGNED DEFAULT NULL,
  `pases` int(10) UNSIGNED DEFAULT NULL,
  `pasesCortos` int(10) UNSIGNED DEFAULT NULL,
  `pasesLargos` int(10) UNSIGNED DEFAULT NULL,
  `entradas` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `estadisticasgenerales`
--

INSERT INTO `estadisticasgenerales` (`codEquipo`, `codPartido`, `posesionBalon`, `tirosArco`, `tirosArcoAcertados`, `tirosArcoFallados`, `tiroSEsquina`, `atajadasPortero`, `pases`, `pasesCortos`, `pasesLargos`, `entradas`) VALUES
(1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
(3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1);

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
-- Estructura de tabla para la tabla `jornadas`
--

CREATE TABLE `jornadas` (
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `jornadas`
--

INSERT INTO `jornadas` (`fecha`) VALUES
('0000-00-00 00:00:00'),
('2023-02-08 20:08:00'),
('2023-02-11 19:02:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juegan`
--

CREATE TABLE `juegan` (
  `codPartido` int(11) NOT NULL,
  `nombreEquipo1` varchar(255) NOT NULL,
  `nombreEquipo2` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `juegan`
--

INSERT INTO `juegan` (`codPartido`, `nombreEquipo1`, `nombreEquipo2`) VALUES
(13, 'legalpo', 'loka'),
(14, 'legalpo', 'loka');

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
(7, 'Wilter Diaz', 'el mono', 'Delantero Extremo Lateral', 1, '2023-02-11', '6');

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
(13, '2023-02-11 23:38:00', 1),
(14, '2023-02-11 20:38:00', 1);

--
-- Índices para tablas volcadas
--

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
-- Indices de la tabla `carreras`
--
ALTER TABLE `carreras`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombreCarrera` (`nombreCarrera`);

--
-- Indices de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`nombre`);

--
-- Indices de la tabla `deporte`
--
ALTER TABLE `deporte`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombreDeporte` (`nombreDeporte`);

--
-- Indices de la tabla `eliminatorias`
--
ALTER TABLE `eliminatorias`
  ADD PRIMARY KEY (`codPais`);

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`codEquipo`),
  ADD UNIQUE KEY `nombreEquipo` (`nombreEquipo`),
  ADD UNIQUE KEY `nombreEquipo_2` (`nombreEquipo`,`nombreDeporte`);

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
  ADD PRIMARY KEY (`codEquipo`,`codPartido`);

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
-- Indices de la tabla `jornadas`
--
ALTER TABLE `jornadas`
  ADD PRIMARY KEY (`fecha`);

--
-- Indices de la tabla `juegan`
--
ALTER TABLE `juegan`
  ADD PRIMARY KEY (`codPartido`),
  ADD KEY `codEquipo1` (`nombreEquipo1`),
  ADD KEY `codEquipo2` (`nombreEquipo2`);

--
-- Indices de la tabla `jugador`
--
ALTER TABLE `jugador`
  ADD PRIMARY KEY (`codJugador`),
  ADD KEY `jugador_cascade` (`codEquipo`);

--
-- Indices de la tabla `partido`
--
ALTER TABLE `partido`
  ADD PRIMARY KEY (`codPartido`),
  ADD KEY `codEstadio` (`codEstadio`),
  ADD KEY `partido_cascade` (`fecha`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `arbitro`
--
ALTER TABLE `arbitro`
  MODIFY `codArbitro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `carreras`
--
ALTER TABLE `carreras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `deporte`
--
ALTER TABLE `deporte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `codEquipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `estadio`
--
ALTER TABLE `estadio`
  MODIFY `codEstadio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4322;

--
-- AUTO_INCREMENT de la tabla `jugador`
--
ALTER TABLE `jugador`
  MODIFY `codJugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `partido`
--
ALTER TABLE `partido`
  MODIFY `codPartido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `arbitran`
--
ALTER TABLE `arbitran`
  ADD CONSTRAINT `arbitran_ibfk_1` FOREIGN KEY (`codArbitro`) REFERENCES `arbitro` (`codArbitro`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `arbitran_ibfk_2` FOREIGN KEY (`codPartido`) REFERENCES `partido` (`codPartido`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `arbitro`
--
ALTER TABLE `arbitro`
  ADD CONSTRAINT `arbitro_ibfk_1` FOREIGN KEY (`codPais`) REFERENCES `pais` (`codPais`);

--
-- Filtros para la tabla `estadio`
--
ALTER TABLE `estadio`
  ADD CONSTRAINT `estadio_cascade` FOREIGN KEY (`nombreCiudad`) REFERENCES `ciudad` (`nombre`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estadio_ibfk_1` FOREIGN KEY (`nombreCiudad`) REFERENCES `ciudad` (`nombre`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estadisticasindividuales`
--
ALTER TABLE `estadisticasindividuales`
  ADD CONSTRAINT `estadisticasindividuales_ibfk_1` FOREIGN KEY (`codJugador`) REFERENCES `jugador` (`codJugador`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estadisticasindividuales_ibfk_2` FOREIGN KEY (`codPartido`) REFERENCES `partido` (`codPartido`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estadisticasportero`
--
ALTER TABLE `estadisticasportero`
  ADD CONSTRAINT `estadisticasportero_ibfk_1` FOREIGN KEY (`codJugador`) REFERENCES `jugador` (`codJugador`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estadisticasportero_ibfk_2` FOREIGN KEY (`codPartido`) REFERENCES `partido` (`codPartido`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `juegan`
--
ALTER TABLE `juegan`
  ADD CONSTRAINT `juegan_cascade` FOREIGN KEY (`codPartido`) REFERENCES `partido` (`codPartido`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `partido`
--
ALTER TABLE `partido`
  ADD CONSTRAINT `partido_ibfk_2` FOREIGN KEY (`codEstadio`) REFERENCES `estadio` (`codEstadio`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
