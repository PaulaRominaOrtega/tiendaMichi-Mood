-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (arm64)
--
-- Host: localhost    Database: michi_mood_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `activa` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
INSERT INTO `administradores` VALUES (1,'pauAdmin','$2b$10$G3a9SUg7IOTkOQgQ4JfJle70adCmeGNvY4E3LVWO7LyPWtUf0dK1u','administrador@gmail.com',1);
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carritos`
--

DROP TABLE IF EXISTS `carritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carritos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT NULL,
  `idCliente` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idCliente` (`idCliente`),
  CONSTRAINT `carritos_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritos`
--

LOCK TABLES `carritos` WRITE;
/*!40000 ALTER TABLE `carritos` DISABLE KEYS */;
/*!40000 ALTER TABLE `carritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carritosproductos`
--

DROP TABLE IF EXISTS `carritosproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carritosproductos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad` int DEFAULT NULL,
  `idProducto` int NOT NULL,
  `idCarrito` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idProducto` (`idProducto`),
  KEY `idCarrito` (`idCarrito`),
  CONSTRAINT `carritosproductos_ibfk_121` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`),
  CONSTRAINT `carritosproductos_ibfk_122` FOREIGN KEY (`idCarrito`) REFERENCES `carritos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritosproductos`
--

LOCK TABLES `carritosproductos` WRITE;
/*!40000 ALTER TABLE `carritosproductos` DISABLE KEYS */;
/*!40000 ALTER TABLE `carritosproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `imagenUrl` text,
  `activa` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Deco Hogar',NULL,1),(2,'Librería',NULL,1),(3,'Cocina',NULL,1),(4,'Accesorios',NULL,1);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `googleId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `googleId` (`googleId`),
  UNIQUE KEY `googleId_2` (`googleId`),
  UNIQUE KEY `googleId_3` (`googleId`),
  UNIQUE KEY `googleId_4` (`googleId`),
  UNIQUE KEY `googleId_5` (`googleId`),
  UNIQUE KEY `googleId_6` (`googleId`),
  UNIQUE KEY `googleId_7` (`googleId`),
  UNIQUE KEY `googleId_8` (`googleId`),
  UNIQUE KEY `googleId_9` (`googleId`),
  UNIQUE KEY `googleId_10` (`googleId`),
  UNIQUE KEY `googleId_11` (`googleId`),
  UNIQUE KEY `googleId_12` (`googleId`),
  UNIQUE KEY `googleId_13` (`googleId`),
  UNIQUE KEY `googleId_14` (`googleId`),
  UNIQUE KEY `googleId_15` (`googleId`),
  UNIQUE KEY `googleId_16` (`googleId`),
  UNIQUE KEY `googleId_17` (`googleId`),
  UNIQUE KEY `googleId_18` (`googleId`),
  UNIQUE KEY `googleId_19` (`googleId`),
  UNIQUE KEY `googleId_20` (`googleId`),
  UNIQUE KEY `googleId_21` (`googleId`),
  UNIQUE KEY `googleId_22` (`googleId`),
  UNIQUE KEY `googleId_23` (`googleId`),
  UNIQUE KEY `googleId_24` (`googleId`),
  UNIQUE KEY `googleId_25` (`googleId`),
  UNIQUE KEY `googleId_26` (`googleId`),
  UNIQUE KEY `googleId_27` (`googleId`),
  UNIQUE KEY `googleId_28` (`googleId`),
  UNIQUE KEY `googleId_29` (`googleId`),
  UNIQUE KEY `googleId_30` (`googleId`),
  UNIQUE KEY `googleId_31` (`googleId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Candela Rodriguez','3452342786','candelarodriguez@gmail.com','$2b$10$hBJku6hR3af65T5Ge5rjtuX5.5NyA0Y1dMtgsc62hAJ20EKAdIru.',NULL),(2,'Matias Leonel Riquelme','2615659078','matiasleonelriquelme@gmail.com','$2b$10$3CT1xPzy5qyKD/OlEN9gnOo0GoDnBtPhOGog6fb844TKqLR01FTQu',NULL),(3,'Paula Ortega','1234567890','paulaortega121@gmail.com',NULL,'118287441810772670539'),(4,'Gimena Tordo','2615789523','gimenatordo@gmail.com','$2b$10$Di3gYqNQvojA6Gn1vz6R6e7WC6912rr4jMv5CVhdgY3Liiddn5FDq',NULL);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cupones`
--

DROP TABLE IF EXISTS `cupones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cupones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreCupon` varchar(255) NOT NULL COMMENT 'Nombre descriptivo para el cupón (ej. ''Descuento Bienvenida'')',
  `codigoCupon` varchar(255) NOT NULL COMMENT 'Código que el usuario ingresará (ej. ''BIENVENIDO10'')',
  `porcentajeDescuento` int NOT NULL COMMENT 'Porcentaje de descuento (0 a 100)',
  `activo` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si el cupón está habilitado para usarse',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cupones`
--

LOCK TABLES `cupones` WRITE;
/*!40000 ALTER TABLE `cupones` DISABLE KEYS */;
/*!40000 ALTER TABLE `cupones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direcciones`
--

DROP TABLE IF EXISTS `direcciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direcciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `calle` varchar(255) NOT NULL,
  `numeracion` int DEFAULT NULL,
  `ciudad` varchar(255) DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `codigo_postal` int DEFAULT NULL,
  `idCliente` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idCliente` (`idCliente`),
  CONSTRAINT `direcciones_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direcciones`
--

LOCK TABLES `direcciones` WRITE;
/*!40000 ALTER TABLE `direcciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `direcciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `envios`
--

DROP TABLE IF EXISTS `envios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `envios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `costo` int DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  `idPedido` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idPedido` (`idPedido`),
  CONSTRAINT `envios_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `envios`
--

LOCK TABLES `envios` WRITE;
/*!40000 ALTER TABLE `envios` DISABLE KEYS */;
/*!40000 ALTER TABLE `envios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `monto` int DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  `fecha` datetime DEFAULT NULL,
  `medio_pago` varchar(255) DEFAULT NULL,
  `idPedido` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idPedido` (`idPedido`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `total` int DEFAULT NULL,
  `estado` enum('Pendiente','En Proceso de Envío','Entregado') NOT NULL DEFAULT 'Pendiente',
  `idCliente` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idCliente` (`idCliente`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,'2025-10-13 20:07:00',9000,'Pendiente',1),(2,'2025-10-15 13:39:45',25000,'Pendiente',3),(3,'2025-10-15 16:50:18',17000,'Pendiente',3),(4,'2025-10-15 16:59:07',27000,'Pendiente',3),(5,'2025-10-15 17:03:51',11000,'Pendiente',3),(6,'2025-10-15 17:05:26',10000,'Pendiente',3),(7,'2025-10-15 17:06:01',10000,'Pendiente',3),(8,'2025-10-15 17:08:49',9000,'Pendiente',3),(9,'2025-10-15 17:12:36',8000,'En Proceso de Envío',3),(10,'2025-10-15 17:16:40',11000,'Pendiente',3),(11,'2025-10-15 17:21:56',8000,'Pendiente',3),(12,'2025-10-15 17:26:46',17000,'Entregado',3),(13,'2025-10-15 17:59:34',17000,'En Proceso de Envío',3),(14,'2025-10-15 18:39:02',11000,'En Proceso de Envío',3),(15,'2025-10-15 18:58:59',13000,'Entregado',3),(16,'2025-10-15 18:59:16',11000,'Pendiente',3),(17,'2025-10-15 23:58:04',35000,'Entregado',3),(18,'2025-10-21 16:29:28',32000,'En Proceso de Envío',3),(19,'2025-10-21 16:29:53',26000,'En Proceso de Envío',3),(20,'2025-10-21 19:04:24',21000,'Entregado',3),(21,'2025-10-23 21:21:04',17000,'Pendiente',1),(22,'2025-10-23 21:21:20',17400,'En Proceso de Envío',1),(23,'2025-10-24 16:44:03',16000,'En Proceso de Envío',1),(24,'2025-10-27 23:00:16',35800,'Pendiente',3),(25,'2025-10-28 00:54:44',31000,'Pendiente',3),(26,'2025-10-28 20:03:28',31200,'Pendiente',3),(27,'2025-10-28 20:06:10',10000,'Pendiente',3),(28,'2025-10-29 16:30:54',29400,'Pendiente',1),(29,'2025-10-29 17:11:46',63200,'Pendiente',3),(30,'2025-10-31 15:31:30',56800,'Pendiente',3),(31,'2025-10-31 15:38:37',38300,'Pendiente',3),(32,'2025-10-31 15:51:14',10000,'Pendiente',3),(33,'2025-10-31 16:01:07',44600,'En Proceso de Envío',3),(34,'2025-10-31 16:16:54',54400,'Pendiente',3),(35,'2025-10-31 16:42:55',49600,'Pendiente',3),(36,'2025-10-31 16:58:17',88000,'Pendiente',3),(37,'2025-10-31 19:27:02',45600,'Pendiente',3),(38,'2025-10-31 19:34:45',19600,'Pendiente',3),(39,'2025-10-31 20:05:12',52000,'Pendiente',3),(40,'2025-10-31 21:51:10',19600,'Pendiente',3),(41,'2025-11-03 12:51:37',18300,'Pendiente',3),(42,'2025-11-03 13:16:51',34000,'Pendiente',3),(43,'2025-11-03 14:57:33',14000,'Pendiente',3),(44,'2025-11-03 18:34:04',14000,'Pendiente',3),(45,'2025-11-03 18:48:30',17000,'Pendiente',3);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidosproductos`
--

DROP TABLE IF EXISTS `pedidosproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidosproductos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `precio_unitario` int DEFAULT NULL,
  `idPedido` int NOT NULL,
  `idProducto` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `pedidosproductos_idProducto_idPedido_unique` (`idPedido`,`idProducto`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `pedidosproductos_ibfk_107` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pedidosproductos_ibfk_108` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidosproductos`
--

LOCK TABLES `pedidosproductos` WRITE;
/*!40000 ALTER TABLE `pedidosproductos` DISABLE KEYS */;
INSERT INTO `pedidosproductos` VALUES (1,1,9000,1,1),(2,1,9000,2,1),(3,1,16000,2,3),(4,1,17000,3,5),(5,1,11000,4,4),(6,1,16000,4,3),(7,1,11000,5,4),(8,1,10000,6,6),(9,1,10000,7,6),(10,1,9000,8,1),(11,1,8000,9,8),(12,1,11000,10,4),(13,1,8000,11,8),(14,1,17000,12,5),(15,1,17000,13,5),(16,1,11000,14,4),(17,1,13000,15,2),(18,1,11000,16,4),(19,1,6000,17,11),(20,1,29000,17,10),(21,1,6000,18,11),(22,1,26000,18,10),(23,1,26000,19,10),(24,1,21000,20,27),(25,1,17000,21,5),(26,1,17400,22,25),(27,1,16000,23,3),(28,1,9800,24,26),(29,1,26000,24,28),(30,1,17000,25,21),(31,1,14000,25,23),(32,2,15600,26,29),(33,1,10000,27,17),(34,2,9800,28,16),(35,1,9800,28,26),(36,2,15600,29,29),(37,2,16000,29,15),(38,1,21000,30,27),(39,1,9800,30,26),(40,1,26000,30,10),(41,2,10000,31,17),(42,1,18300,31,22),(43,1,10000,32,17),(44,1,9800,33,26),(45,2,17400,33,25),(46,2,9800,34,26),(47,2,17400,34,25),(48,2,17000,35,21),(49,1,15600,35,29),(50,2,9800,36,26),(51,1,17400,36,25),(52,3,17000,36,21),(53,2,9800,37,26),(54,1,26000,37,28),(55,2,9800,38,26),(56,2,26000,39,28),(57,2,9800,40,26),(58,1,18300,41,22),(59,2,17000,42,5),(60,2,7000,43,19),(61,1,14000,44,31),(62,1,17000,45,5);
/*!40000 ALTER TABLE `pedidosproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `precio` int DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL COMMENT 'Material principal del producto, ej: cerámica, plástico, tela.',
  `capacidad` varchar(255) DEFAULT NULL COMMENT 'Capacidad o tamaño del producto, ej: 350 ml, 1 litro, S, M, L.',
  `caracteristicas_especiales` varchar(255) DEFAULT NULL COMMENT 'Características adicionales, ej: apto para microondas, antideslizante.',
  `stock` int DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `oferta` tinyint(1) NOT NULL DEFAULT '0',
  `descuento` int NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `idAdministrador` int NOT NULL,
  `idCategoria` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idAdministrador` (`idAdministrador`),
  KEY `idCategoria` (`idCategoria`),
  CONSTRAINT `productos_ibfk_151` FOREIGN KEY (`idAdministrador`) REFERENCES `administradores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productos_ibfk_152` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Lámpara ',9000,'Hermosos diseños gatunos para acompañar tus noches','Silicona. Led','','Con cargador tipo c',1,'imagenes-1760385979127-314901121.jpeg,imagenes-1760385979129-635633747.jpeg,imagenes-1760385979130-858627935.jpeg',1,15,1,1,1),(2,'Jabonera',13000,'Simpáticos diseños que decoran cualquier baño ','Cerámica','200ml','',8,'imagenes-1760386487901-39130741.jpeg,imagenes-1760386487902-536500972.jpeg,imagenes-1760386487904-177211485.jpeg',0,0,1,1,1),(3,'Alfombra',16000,'Suaves y super absorbentes. Lavables ','Algodón y poliéster ','30x25cm ','Lavables ',1,'imagenes-1760386618737-262132633.jpeg,imagenes-1760386618738-136164462.jpeg,imagenes-1760386618740-2562568.jpeg',1,10,1,1,1),(4,'Cartuchera',11000,'Semiduras de alta calidad','Silicona ','22x8 cm ','Lavables ',1,'imagenes-1760386709875-4110710.jpeg,imagenes-1760386709875-276812944.jpeg,imagenes-1760386709875-476288944.jpeg',0,0,1,1,2),(5,'Almohada viaje',17000,'Viajá cómodo y con estilo','Algodón y poliéster ','','Se adaptan al cuello',5,'imagenes-1760386824319-773008702.jpeg,imagenes-1760386824320-81322033.jpeg,imagenes-1760386824322-666027365.jpeg',0,0,1,1,4),(6,'Agenda 2026',19000,'Organiza tu año combinando diseño con detalles felinos que inspiran alegría ','Papel y cartón','23 x16cm','Año 2026',21,'imagenes-1760386930671-176892230.jpeg,imagenes-1760386930673-33188052.jpeg,imagenes-1760386930674-3487366.jpeg',0,0,1,1,2),(7,'Corrector ',6000,'Corrector tinta color blanco','Plástico','15ml','',10,NULL,0,0,0,1,2),(8,'Corrector',8000,'Corrector para tinta color blanco','Plástico ','15ml','',12,'imagenes-1760387200303-511883085.jpeg,imagenes-1760387200304-554358370.jpeg,imagenes-1760387200304-559839190.jpeg',0,0,1,1,2),(9,'Manopla',16000,'Manopla resistente a altas temperaturas','Silicona y algodón ','','Lavables ',5,'imagenes-1760568142615-411276008.jpeg,imagenes-1760568142617-499482866.jpeg,imagenes-1760568142618-265790143.jpeg',0,0,1,1,3),(10,'Manta Gatuna',26000,'Hermosos diseños','Polar','1 1/2 plaza','Lavables ',3,'imagenes-1760568290123-473690898.jpeg,imagenes-1760568290125-890467151.jpeg,imagenes-1760568290126-200511535.jpeg',1,5,1,1,1),(11,'Compotera',6000,'Hermoso diseños. Útiles y decorativos','Cerámica','200ml','Aptas microondas/ Apto lavavajillas',15,'imagenes-1760569038568-317698778.jpeg,imagenes-1760569038568-250124232.jpeg,imagenes-1760569038570-780418019.jpeg',1,5,1,1,3),(12,'Molde cortante ',15000,'Haz galletas originales y divertidas. Incluye receta','Acero inoxidable','','Contiene 6 moldes',6,'imagenes-1760569166491-638962167.jpeg,imagenes-1760569166493-919691868.jpeg,imagenes-1760569166493-913184003.jpeg',0,0,0,1,3),(13,'Molde cortante',14000,'Haz galletas originales y divertidas. Incluye receta','Acero inoxidable','','Contiene 6 unidades',4,'imagenes-1760570727416-738906950.jpeg,imagenes-1760570727417-799745392.jpeg,imagenes-1760570727419-712975595.jpeg',0,0,0,1,3),(14,'Palo amasador',13000,'Para que tus pastas tenga estilo gatuno','Madera','27 cm','Apto lavavajillas',11,'imagenes-1760571034441-423649679.jpeg,imagenes-1760571034442-230156049.jpeg,imagenes-1760571034444-943808753.jpeg',0,0,1,1,3),(15,'Reloj ',16000,'Hermosos diseños','Madera','25x18 cm ','2 Pilas AA. No incluidas',1,'imagenes-1761068251345-591763804.jpeg,imagenes-1761068251348-909609276.jpeg,imagenes-1761068251348-781972732.jpeg',1,15,1,1,1),(16,'Taza',9800,'El mejor acompañamiento para infusiones','Cerámica','350ml','Apto microondas/ Apto lavavajillas',5,'imagenes-1761068359690-858728407.jpeg,imagenes-1761068359691-647987927.jpeg,imagenes-1761068359691-991674723.jpeg',0,0,1,1,3),(17,'Porta Sahumerio',10000,'Para armonizar y decorar el hogar','Cerámica','15cm','',9,'imagenes-1761068438098-231789635.jpeg,imagenes-1761068438098-927795073.jpeg,imagenes-1761068438099-623995934.jpeg',0,0,1,1,1),(18,'Porta Vela',8700,'Dale un toque especial a las velas de noche','Cerámica','','Incluye vela',5,'imagenes-1761068524802-844724138.jpeg,imagenes-1761068524803-812834095.jpeg,imagenes-1761068524803-917615519.jpeg',0,0,1,1,1),(19,'Regla',7000,'Medí con estilo gatuno','Madera','20cm ','Varios modelos sin elección ',19,'imagenes-1761068620009-880269868.jpeg,imagenes-1761068620010-568906617.jpeg,imagenes-1761068620011-852898916.jpeg',1,50,1,1,2),(20,'Maceta',13000,'Agregale estilo gatuno a tus plantas','Cerámica','150ml','Número 25',15,'imagenes-1761068718219-903499922.jpeg,imagenes-1761068718220-947862483.jpeg,imagenes-1761068718221-731865487.jpeg',1,5,1,1,1),(21,'Mate',17000,'Pintados a mano! Originales diseños ','Madera','100ml','Lavables ',0,'imagenes-1761068860215-739235754.jpeg,imagenes-1761068860216-491758046.jpeg,imagenes-1761068860217-405585724.jpeg',1,15,1,1,3),(22,'Delantal',18300,'Originales, para regalar y regalarte!','Algodón ','Talle unico','Lavables ',9,'imagenes-1761068950261-920614117.jpeg,imagenes-1761068950261-828183215.jpeg,imagenes-1761068950262-986339898.jpeg',0,0,1,1,3),(23,'Aros',14000,'Hipolargénicos de alta calidad','Acero quirúrgico ','','Diseños exclusivos',16,'imagenes-1761069081756-265249302.jpeg,imagenes-1761069081756-927011290.jpeg,imagenes-1761069081757-302879082.jpeg',0,0,1,1,4),(24,'Cadenita',21000,'Delicada cadena con dije','Acero quirúrgico ','45cm','Material de alta calidad',19,'imagenes-1761069197679-402079198.jpeg,imagenes-1761069197679-407034190.jpeg,imagenes-1761069197679-280769621.jpeg',0,0,1,1,4),(25,'Porta celular',17400,'Para mantener el celu siempre ordenado','Cerámica','','',4,'imagenes-1761069350275-811625585.jpeg,imagenes-1761069350276-117671202.jpeg,imagenes-1761069350276-206533062.jpeg',0,0,1,1,4),(26,'Llavero',9800,'Perfecto para mantener tus llaves seguras','Resina','','Minimalista, color pastel',3,'imagenes-1761069517365-862354751.jpeg,imagenes-1761069517365-678372296.jpeg',0,0,1,1,4),(27,'Billetera',21000,'Compacta y adorable, perfecta para llevar dinero y tarjetas esenciales','Cuero ecológico ','17x10cm','Compacta y adorable',1,'imagenes-1761069665538-215075168.jpeg,imagenes-1761069665540-284830430.jpeg,imagenes-1761069665541-577480426.jpeg',1,20,1,1,4),(28,'Rollo stickers',26000,'Perfecto para decorar tu agenda, cartas o journaling. 6 diseños diferentes de gatitos en todas sus facetas (jugando, durmiendo, enojados, felices)','Papel Adhesivo','','500 pegatinas con 6 diseños diferentes ',1,'imagenes-1761069932848-136470673.jpeg,imagenes-1761069932849-430907830.jpeg,imagenes-1761069932849-575850829.jpeg',0,0,1,1,2),(29,'Cuaderno',15600,'Tapa dura con un diseño de gato adorable en colores vibrantes. ¡Lleva a tu compañero de escritura felino a todas tus clases o reuniones!','Papel y cartón','','40 hojas lisas con diseños gatunos',8,'imagenes-1761070026949-257866591.jpeg,imagenes-1761070026949-836228374.jpeg,imagenes-1761070026949-288530334.jpeg',1,10,1,1,2),(30,'Pantuflas',2,'prueba','','','',2,'imagenes-1761073706531-52764603.jpeg,imagenes-1761073706533-151788757.jpeg,imagenes-1761073706533-173156146.jpeg',0,0,0,1,2),(31,'Taza',14000,'Hermosos diseños que acompañan cualquier infusion','Cerámica','350ml','Aptas microondas/ Apto lavavajillas',3,'imagenes-1762175127591-290929374.jpeg,imagenes-1762175127592-222686508.jpeg,imagenes-1762175127593-176970049.jpeg',0,0,1,1,3);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Variantes`
--

DROP TABLE IF EXISTS `Variantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Variantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `precio` float NOT NULL,
  `stock` int NOT NULL,
  `productoId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productoId` (`productoId`),
  CONSTRAINT `variantes_ibfk_1` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Variantes`
--

LOCK TABLES `Variantes` WRITE;
/*!40000 ALTER TABLE `Variantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `Variantes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-03 20:40:37
