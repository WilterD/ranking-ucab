-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-03-2023 a las 05:39:15
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
(6, 'Administración y Contaduría'),
(4, 'Comunicación Social'),
(9, 'Deporte'),
(8, 'Derecho'),
(5, 'Educación'),
(1, 'Ing Informática'),
(3, 'Ing. Civil'),
(2, 'Ing. Industrial'),
(10, 'Relaciones Industriales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deporte`
--

CREATE TABLE `deporte` (
  `id` int(11) NOT NULL,
  `nombreDeporte` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `tipoDeporte` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `deporte`
--

INSERT INTO `deporte` (`id`, `nombreDeporte`, `tipoDeporte`) VALUES
(7, 'Ajedrez', 'Individual'),
(9, 'Tenis de mesa', 'Individual'),
(11, 'Fútbol 11', 'Equipos'),
(12, 'Voley Playa', 'Equipos'),
(13, 'Baloncesto', 'Equipos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eliminatorias`
--

CREATE TABLE `eliminatorias` (
  `codEquipo` int(11) NOT NULL,
  `nombreEquipo` varchar(255) NOT NULL,
  `juegos_ganados` int(11) NOT NULL,
  `juegos_perdidos` int(11) NOT NULL,
  `goles_a_favor` int(11) NOT NULL,
  `goles_en_contra` int(11) NOT NULL,
  `juegos_jugados` int(11) NOT NULL,
  `juegos_empate` int(11) NOT NULL,
  `diferencia_goles` int(11) NOT NULL,
  `puntos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `eliminatorias`
--

INSERT INTO `eliminatorias` (`codEquipo`, `nombreEquipo`, `juegos_ganados`, `juegos_perdidos`, `goles_a_favor`, `goles_en_contra`, `juegos_jugados`, `juegos_empate`, `diferencia_goles`, `puntos`) VALUES
(13, 'LegalPool', 1, 1, 1, 1, 3, 1, 1, 3),
(14, 'Manscheter Civil', 2, 2, 1, 1, 3, 2, 2, 1),
(15, 'Atlético Industrial', 2, 1, 1, 1, 2, 1, 1, 1),
(16, 'Comunicación Social FC', 3, 0, 3, 0, 3, 0, 1, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `codEquipo` int(11) NOT NULL,
  `nombreEquipo` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombreDeporte` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `imagen` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`codEquipo`, `nombreEquipo`, `nombreDeporte`, `imagen`) VALUES
(15, 'LegalPool', 'Fútbol 11', ''),
(16, 'Manscheter Civil', 'Fútbol 11', ''),
(17, 'Atlético Industrial', 'Fútbol 11', ''),
(18, 'Comunicación Social FC', 'Fútbol 11', ''),
(19, 'Wilter y Sofia', 'Voley Playa', ''),
(20, 'Néstor y Christian', 'Voley Playa', ''),
(21, 'qweq', 'Fútbol 11', ''),
(23, 'Anthony y Julio', 'Voley Playa', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadio`
--

CREATE TABLE `estadio` (
  `codEstadio` int(11) NOT NULL,
  `nombreEstadio` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `estadio`
--

INSERT INTO `estadio` (`codEstadio`, `nombreEstadio`) VALUES
(2, 'Cancha Fútbol 11'),
(3, 'Cancha de Volley Playa');

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

--
-- Volcado de datos para la tabla `grupo`
--

INSERT INTO `grupo` (`letraGrupo`) VALUES
('A'),
('B');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jornadas`
--

CREATE TABLE `jornadas` (
  `fecha` datetime NOT NULL,
  `nombreDeporte` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `jornadas`
--

INSERT INTO `jornadas` (`fecha`, `nombreDeporte`) VALUES
('2023-02-12 22:14:00', 'Fútbol 11'),
('2023-02-16 03:41:00', 'Ajedrez'),
('2023-02-16 16:00:00', 'Fútbol 11'),
('2023-02-27 14:00:00', 'Ajedrez'),
('2023-02-28 14:38:00', 'Fútbol'),
('2023-03-03 14:04:00', 'Fútbol'),
('2023-03-03 15:29:00', 'Fútbol'),
('2023-03-03 16:42:00', 'Baloncesto'),
('2023-03-03 23:40:00', 'Ajedrez'),
('2023-03-04 20:43:00', 'Ajedrez'),
('2023-03-08 14:20:00', 'Fútbol'),
('2023-03-08 21:14:00', 'Ajedrez'),
('2023-03-08 23:11:00', 'Fútbol 11'),
('2023-03-16 11:24:00', 'Ajedrez'),
('2023-03-16 16:00:00', 'Fútbol 11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juegan`
--

CREATE TABLE `juegan` (
  `id` int(11) NOT NULL,
  `codPartido` int(11) NOT NULL,
  `codEquipo1` int(11) NOT NULL,
  `codEquipo2` int(11) NOT NULL,
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `juegan`
--

INSERT INTO `juegan` (`id`, `codPartido`, `codEquipo1`, `codEquipo2`, `fecha`) VALUES
(1, 40, 15, 16, '2023-03-08 23:18:00'),
(2, 41, 15, 16, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugador`
--

CREATE TABLE `jugador` (
  `codJugador` int(11) NOT NULL,
  `nombreJugador` varchar(50) NOT NULL,
  `nombreEquipo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `nombreCarrera` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `jugador`
--

INSERT INTO `jugador` (`codJugador`, `nombreJugador`, `nombreEquipo`, `nombreCarrera`) VALUES
(15, 'Wilter Díaz', 'Individual', 'Ing Informática'),
(16, 'Roberson Garcia', 'Individual', 'Ing Informática'),
(18, 'Manuel Arteaga', 'Individual', 'Ing Informática'),
(19, 'Giovanni Acosta', 'Individual', 'Comunicación Social'),
(20, 'Osfran Chacón', 'Individual', 'Derecho'),
(21, 'Angie Ordoñez', 'Individual', 'Ing. Industrial'),
(22, 'Anthony Barrios', 'Ceinf', 'Ing Informática');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partido`
--

CREATE TABLE `partido` (
  `codPartido` int(11) NOT NULL,
  `nombrePartido` varchar(255) NOT NULL,
  `fecha` datetime NOT NULL,
  `nombreEstadio` varchar(255) NOT NULL,
  `nombreDeporte` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `partido`
--

INSERT INTO `partido` (`codPartido`, `nombrePartido`, `fecha`, `nombreEstadio`, `nombreDeporte`) VALUES
(41, 'Amistoso', '2023-03-13 10:49:00', 'Cancha Fútbol 11', 'Fútbol 11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rankinge`
--

CREATE TABLE `rankinge` (
  `id` int(11) NOT NULL,
  `nombreEquipo` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombreDeporte` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `puntos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `rankinge`
--

INSERT INTO `rankinge` (`id`, `nombreEquipo`, `nombreDeporte`, `puntos`) VALUES
(5, 'LegalPool', 'Fútbol 11', 10),
(8, 'Alvaro y Felix', 'Voley Playa', 20),
(10, 'Wilter y Sofia', 'Voley Playa', 12),
(11, 'Néstor y Christian', 'Voley Playa', 1),
(12, 'Manscheter Civil', 'Fútbol 11', 3),
(13, 'Comunicación Social FC', 'Fútbol 11', 7),
(14, 'Atlético Industrial', 'Fútbol 11', 2),
(16, 'Comunicación Social FC', 'Baloncesto', 12),
(17, 'LegalPool', 'Baloncesto', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rankini`
--

CREATE TABLE `rankini` (
  `id` int(11) NOT NULL,
  `nombreJugador` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombreCarrera` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombreDeporte` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `puntos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `rankini`
--

INSERT INTO `rankini` (`id`, `nombreJugador`, `nombreCarrera`, `nombreDeporte`, `puntos`) VALUES
(23, 'Wilter Díaz', 'Ing Informática', 'Ajedrez', 20),
(24, 'Roberson Garcia', 'Ing Informática', 'Ajedrez', 14),
(25, 'Roberson Garcia', 'Ing Informática', 'Tenis de mesa (Ping Pong)', 20),
(26, 'Wilter Díaz', 'Ing Informática', 'Tenis de mesa (Ping Pong)', 1),
(27, 'Sara Perez', 'Ing Informática', 'Tenis de mesa (Ping Pong)', 33),
(28, 'Giovanni Acosta', 'Comunicación Social', 'Tenis de mesa (Ping Pong)', 12),
(29, 'Wilter Díaz', 'Ing Informática', 'Baloncesto', 20),
(30, 'Roberson Garcia', 'Ing Informática', 'Baloncesto', 12),
(31, 'Osfran Chacón', 'Derecho', 'Baloncesto', 33),
(32, 'Osfran Chacón', 'Derecho', 'Ajedrez', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados`
--

CREATE TABLE `resultados` (
  `id` int(11) NOT NULL,
  `nombreDeporte` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha` date NOT NULL,
  `jornada` int(11) NOT NULL,
  `nombreEquipo1` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `puntos1` int(11) NOT NULL,
  `nombreEquipo2` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `puntos2` int(11) NOT NULL,
  `imagen1` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `imagen2` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `resultados`
--

INSERT INTO `resultados` (`id`, `nombreDeporte`, `fecha`, `jornada`, `nombreEquipo1`, `puntos1`, `nombreEquipo2`, `puntos2`, `imagen1`, `imagen2`) VALUES
(30, 'Fútbol 11', '2023-03-06', 1, 'LegalPool', 2, 'Atlético Industrial', 3, 'https://i.imgur.com/wuSxLo5.png', 'https://i.imgur.com/UqtvTYI.png'),
(31, 'Fútbol 11', '2023-03-05', 2, 'Atlético Industrial', 2, 'Comunicación Social FC', 5, 'https://i.imgur.com/UqtvTYI.png', 'https://i.imgur.com/GdONBro.png'),
(33, 'Fútbol 11', '2023-03-05', 2, 'Comunicación Social FC', 3, 'Atlético Industrial', 1, 'https://i.imgur.com/GdONBro.png', 'https://i.imgur.com/UqtvTYI.png'),
(34, 'Fútbol 11', '2023-03-06', 3, 'Manscheter Civil', 2, 'Comunicación Social FC', 5, NULL, 'https://i.imgur.com/GdONBro.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `data` text COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `expires` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `password` char(60) COLLATE utf8mb4_spanish_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `status`) VALUES
(1, 'wilter@gmail.com', 'hola1234', 'disabled'),
(2, 'pupus@gmail.com', '12345678', 'active'),
(4, 'loko@gmail.com', '123', 'active'),
(5, 'perra@gmail.com', 'perra', 'disabled');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carreras`
--
ALTER TABLE `carreras`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombreCarrera` (`nombreCarrera`);

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
  ADD PRIMARY KEY (`codEquipo`,`nombreEquipo`);

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
  ADD PRIMARY KEY (`codEstadio`);

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
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `jugador`
--
ALTER TABLE `jugador`
  ADD PRIMARY KEY (`codJugador`,`nombreCarrera`);

--
-- Indices de la tabla `partido`
--
ALTER TABLE `partido`
  ADD PRIMARY KEY (`codPartido`),
  ADD KEY `codEstadio` (`nombreEstadio`),
  ADD KEY `partido_cascade` (`fecha`);

--
-- Indices de la tabla `rankinge`
--
ALTER TABLE `rankinge`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `rankini`
--
ALTER TABLE `rankini`
  ADD PRIMARY KEY (`id`,`nombreCarrera`);

--
-- Indices de la tabla `resultados`
--
ALTER TABLE `resultados`
  ADD PRIMARY KEY (`id`,`nombreDeporte`),
  ADD KEY `fk_resultados_deporte` (`nombreDeporte`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carreras`
--
ALTER TABLE `carreras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `deporte`
--
ALTER TABLE `deporte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `eliminatorias`
--
ALTER TABLE `eliminatorias`
  MODIFY `codEquipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `codEquipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `estadio`
--
ALTER TABLE `estadio`
  MODIFY `codEstadio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `juegan`
--
ALTER TABLE `juegan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `jugador`
--
ALTER TABLE `jugador`
  MODIFY `codJugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `partido`
--
ALTER TABLE `partido`
  MODIFY `codPartido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `rankinge`
--
ALTER TABLE `rankinge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `rankini`
--
ALTER TABLE `rankini`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `resultados`
--
ALTER TABLE `resultados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

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
-- Filtros para la tabla `resultados`
--
ALTER TABLE `resultados`
  ADD CONSTRAINT `fk_resultados_deporte` FOREIGN KEY (`nombreDeporte`) REFERENCES `deporte` (`nombreDeporte`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
