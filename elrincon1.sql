-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-02-2025 a las 12:52:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `elrincon`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

CREATE TABLE `admin` (
  `id` varchar(255) NOT NULL,
  `dni` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `admin`
--

INSERT INTO `admin` (`id`, `dni`, `email`, `password`) VALUES
('1', '78564189F', 'nazaretlinaresferre198@gmail.com', '8cb2237d0679ca88db6464eac60da96345513964');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clase`
--

CREATE TABLE `clase` (
  `id` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `cupo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `clase`
--

INSERT INTO `clase` (`id`, `fecha`, `hora_inicio`, `hora_fin`, `cupo`) VALUES
('aaf216f0-e16a-11ef-8105-ebaf25e16294', '2025-03-03', '15:37:00', '18:41:00', 1),
('b30ab0e0-e16a-11ef-8105-ebaf25e16294', '2025-03-24', '16:37:00', '18:41:00', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clase_cliente`
--

CREATE TABLE `clase_cliente` (
  `id_clase` varchar(255) NOT NULL,
  `id_cliente` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `clase_cliente`
--

INSERT INTO `clase_cliente` (`id_clase`, `id_cliente`) VALUES
('aaf216f0-e16a-11ef-8105-ebaf25e16294', '58d19800-cd0b-11ef-b63e-dfd35794bf67'),
('b30ab0e0-e16a-11ef-8105-ebaf25e16294', '58d19800-cd0b-11ef-b63e-dfd35794bf67');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id` varchar(255) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `telefono` varchar(45) NOT NULL,
  `dni` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id`, `nombre`, `telefono`, `dni`, `email`, `password`, `activo`) VALUES
('58d19800-cd0b-11ef-b63e-dfd35794bf67', 'sergio.ume@hotmail.com', '645558822', '46880116k', 'sergio.ume@hotmail.com', '8cb2237d0679ca88db6464eac60da96345513964', 1),
('7d7a8c70-1848-11ef-a3ce-aded686f276a', 'Alicia gonzalez diaz', '635447726', '52690840w', 'aliciagonzalezasesoria@gmail.com', 'cc7010535c06172ab3e3d2f0426b6bb5fb8aaf93', 0),
('b4c37360-1846-11ef-a3ce-aded686f276a', 'Prueba prueba', '622692454', '78568374Y', 'oliver.cerezuela@gmail.com', '94ccf31a1fdfb1d11e606aad8c1372e2aba2ddbf', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estancia`
--

CREATE TABLE `estancia` (
  `id` varchar(255) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `cupo` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estancia`
--

INSERT INTO `estancia` (`id`, `fecha_inicio`, `fecha_fin`, `cupo`) VALUES
('4c3f0210-e16c-11ef-943a-197b54bdcd5c', '2025-02-14', '2025-02-21', 10);


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fotos`
--

CREATE TABLE `fotos` (
  `id` varchar(512) NOT NULL,
  `contenido` varchar(512) DEFAULT NULL,
  `id_pet` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `fotos`
--

INSERT INTO `fotos` (`id`, `contenido`, `id_pet`) VALUES
('4f4c5596-b059-4277-a175-0484a59bbd3d', 'uploads\\1737886475144-DiseÃ±o sin tÃ­tulo (2).png', 'e2d2b9d0-cd0b-11ef-b63e-dfd35794bf67'),
('a290beaf-d330-49e1-80ee-0e7dd3ef00bd', 'uploads\\1738402765083-a6dfad24-25c6-4775-a096-60f700520ed9.png', 'e2d2b9d0-cd0b-11ef-b63e-dfd35794bf67'),
('e01bc4ba-dbc7-11ef-8c56-d843ae05b217', 'https://example.com/photo_arena.jpg', '51698830-1847-11ef-a3ce-aded686f276a'),
('e01dbb35-dbc7-11ef-8c56-d843ae05b217', 'https://example.com/photo_argos.jpg', 'e2d2b9d0-cd0b-11ef-b63e-dfd35794bf67'),
('e01e8c9e-dbc7-11ef-8c56-d843ae05b217', 'https://example.com/photo_arena2.jpg', 'f6c11100-1846-11ef-a3ce-aded686f276a');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

CREATE TABLE `mascota` (
  `id` varchar(255) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `edad` int(11) NOT NULL,
  `castrado` tinyint(1) NOT NULL,
  `vacunas` tinyint(1) NOT NULL,
  `condicion_especial` tinyint(1) NOT NULL,
  `id_cliente` varchar(255) NOT NULL,
  `sociable` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mascota`
--  

INSERT INTO `mascota` (`id`, `nombre`, `edad`, `castrado`, `vacunas`, `condicion_especial`, `id_cliente`) VALUES
('51698830-1847-11ef-a3ce-aded686f276a', 'Arena', 7, 1, 1, 0, 'b4c37360-1846-11ef-a3ce-aded686f276a'),
('e2d2b9d0-cd0b-11ef-b63e-dfd35794bf67', 'Argos', 15, 1, 1, 1, '58d19800-cd0b-11ef-b63e-dfd35794bf67'),
('f6c11100-1846-11ef-a3ce-aded686f276a', 'Arena', 7, 1, 1, 0, 'b4c37360-1846-11ef-a3ce-aded686f276a');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clase_cliente`
--

CREATE TABLE `estancia_cliente` (
  `id_estancia` varchar(255) NOT NULL,
  `id_cliente` varchar(255) NOT NULL,
  `lista_espera` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clase`
--
ALTER TABLE `clase`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clase_cliente`
--
ALTER TABLE `clase_cliente`
  ADD PRIMARY KEY (`id_clase`,`id_cliente`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `fotos`
--
ALTER TABLE `fotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_id_pet` (`id_pet`);

--
-- Indices de la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `estancia`
--
ALTER TABLE `estancia`
  ADD PRIMARY KEY (`id`);
--
-- Indices de la tabla `estancia_cliente`
--
ALTER TABLE `estancia_cliente`
  ADD PRIMARY KEY (`id_estancia`, `id_cliente`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clase_cliente`
--
ALTER TABLE `clase_cliente`
  ADD CONSTRAINT `clase_cliente_ibfk_1` FOREIGN KEY (`id_clase`) REFERENCES `clase` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `clase_cliente_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;


--
-- Filtros para la tabla `fotos`
--
ALTER TABLE `fotos`
  ADD CONSTRAINT `fk_id_pet` FOREIGN KEY (`id_pet`) REFERENCES `mascota` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD CONSTRAINT `mascota_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

--
-- Filtros para la tabla `estancia_cliente`
--
ALTER TABLE `estancia_cliente`
  ADD CONSTRAINT `estancia_cliente_ibfk_1` FOREIGN KEY (`id_estancia`) REFERENCES `estancia` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estancia_cliente_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
