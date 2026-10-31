-- MySQL dump 10.13  Distrib 8.0.35, for Win64 (x86_64)
--
-- Host: localhost    Database: diabetic_diet
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blacklisted_tokens`
--

DROP TABLE IF EXISTS `blacklisted_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklisted_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklisted_tokens`
--

LOCK TABLES `blacklisted_tokens` WRITE;
/*!40000 ALTER TABLE `blacklisted_tokens` DISABLE KEYS */;
INSERT INTO `blacklisted_tokens` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByaXlhbmthQG1haWxpbmF0b3IuY29tIiwiaWQiOiIxYzA2Yjc2Yi1kYjBmLTRiOGMtOTAwNy1kNmNhOTNjMDU0ODMiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzkzMjUwOTk1LCJleHAiOjE3OTMzMzczOTV9.QlvVjv3c5DEFSCSEAwHEqp8ZVH4jeHpMnBF3jabQ-BE','2026-10-29 05:19:25');
/*!40000 ALTER TABLE `blacklisted_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image_calculation`
--

DROP TABLE IF EXISTS `image_calculation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image_calculation` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `image` varchar(255) NOT NULL,
  `meal_type` varchar(50) NOT NULL,
  `food_name` varchar(255) DEFAULT NULL,
  `grams` varchar(255) DEFAULT NULL,
  `calories` decimal(10,2) DEFAULT NULL,
  `carbs` decimal(10,2) DEFAULT NULL,
  `protein` decimal(10,2) DEFAULT NULL,
  `carbohydrates` decimal(10,2) DEFAULT NULL,
  `fats` decimal(10,2) DEFAULT NULL,
  `fiber` decimal(10,2) DEFAULT NULL,
  `sugar` decimal(10,2) DEFAULT NULL,
  `cholesterol_mg` decimal(10,2) DEFAULT NULL,
  `glucose` decimal(10,2) DEFAULT NULL,
  `calcium_mg` decimal(10,2) DEFAULT NULL,
  `risk_level` varchar(20) NOT NULL,
  `date` date DEFAULT NULL,
  `time` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_image_calculation_user` (`user_id`),
  CONSTRAINT `fk_image_calculation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image_calculation`
--

LOCK TABLES `image_calculation` WRITE;
/*!40000 ALTER TABLE `image_calculation` DISABLE KEYS */;
INSERT INTO `image_calculation` VALUES ('025c7623-f64b-48d1-8cbe-126e59b4cbec','1c06b76b-db0f-4b8c-9007-d6ca93c05483','/image_calculation/edbdd6cb-2ed1-4e27-b284-f027b7164f8f_meal.jpg','snack','Egg, Tomato, Chili pepper, Onion, Herb, Flatbread','565',1382.04,90.20,22.82,90.20,101.95,3.99,25.25,158.50,NULL,291.21,'🟢 Low (Safe)','2026-10-31','11:33:27','2026-10-31 05:48:27'),('488e8abc-f5e5-442f-9a1a-ca99aac5cc88','1c06b76b-db0f-4b8c-9007-d6ca93c05483','/image_calculation/de1b8cf1-0aa9-4267-8687-ef559dbc8db9_meal.jpg','snack','Egg, Tomato, Chili pepper, Onion, Herb, Flatbread','250, 150, 10, 50, 5, 100',1382.04,90.20,22.82,90.20,101.95,3.99,25.25,158.50,NULL,291.21,'🟢 Low (Safe)','2026-10-31','11:50:48','2026-10-31 06:05:48'),('48de4486-9e9e-439e-adbd-11a90589b10b','1c06b76b-db0f-4b8c-9007-d6ca93c05483','/image_calculation/903e15ee-363e-4ecd-87f4-379040572277_meal.jpg','dinner','Egg, Tomato, Jalapeño, Onion, Cheese, Flatbread','250, 150, 10, 50, 50, 100',1582.04,105.20,28.82,105.20,114.45,4.99,26.25,183.50,NULL,391.01,'🟢 Low (Safe)','2026-10-31','12:11:59','2026-10-31 06:26:59'),('50b79148-c2cb-4566-a893-10bbbb1d3988','1c06b76b-db0f-4b8c-9007-d6ca93c05483','/image_calculation/57fb800c-1ba5-43c5-aedb-d777c55ee1cf_meal.jpg','snack','Egg, Tomato, Chili pepper, Onion, Herb, Bread','250, 150, 10, 50, 5, 100',1317.04,66.00,21.12,66.00,108.15,3.29,25.85,168.50,NULL,311.21,'🟢 Low (Safe)','2026-10-31','11:45:23','2026-10-31 06:00:23'),('72b83ce4-5a1e-4bbe-a79e-d89524d472cd','1c06b76b-db0f-4b8c-9007-d6ca93c05483','/image_calculation/cda65dc8-fddc-44f9-81ea-0e44aa9a6a13_meal.jpg','snack','Egg, Tomato, Chili pepper, Onion, Herb, Flatbread',NULL,1382.04,90.20,22.82,90.20,101.95,3.99,25.25,158.50,NULL,291.21,'🟢 Low (Safe)','2026-10-31','11:40:22','2026-10-31 05:55:22'),('7ee5cba7-1b19-4e35-921f-15f8ae31d1dc','1c06b76b-db0f-4b8c-9007-d6ca93c05483','/image_calculation/61cae282-59de-4d23-8f8f-6a6c2ba80df9_meal.jpg','lunch','Egg, Tomato, Jalapeño, Onion, Cheese, Flatbread','250, 150, 10, 50, 50, 100',1582.04,105.20,28.82,105.20,114.45,4.99,26.25,183.50,NULL,391.01,'🟢 Low (Safe)','2026-10-31','12:12:41','2026-10-31 06:27:41'),('b21475aa-05fe-43c2-91d8-c8c41d6fd433','1c06b76b-db0f-4b8c-9007-d6ca93c05483','/image_calculation/bb400125-a410-4742-a012-c11084ad9d5a_meal.jpg','breakfast','Egg, Tomato, Tomato, Tomato, Tomato, Chili pepper, Onion, Bread','250, 150, 150, 150, 150, 10, 50, 100',3521.09,80.31,31.88,80.31,341.75,6.53,31.92,191.77,NULL,340.28,'🟢 Low (Safe)','2026-10-31','13:07:42','2026-10-31 07:22:42');
/*!40000 ALTER TABLE `image_calculation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `id` varchar(36) NOT NULL,
  `doctor_id` varchar(36) DEFAULT NULL,
  `status` int DEFAULT '0',
  `patient_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES ('28edb61f-0959-402b-920d-74feaac7520b','1c06b76b-db0f-4b8c-9007-d6ca93c05483',0,'84604ebe-c18f-4e49-bd41-24fb7edbaa61'),('ac920fcd-4302-4bbb-9315-2f77bceb98e1','1c06b76b-db0f-4b8c-9007-d6ca93c05483',0,NULL),('f46e632c-52fc-49f5-af4a-ed3c6f39f186','1c06b76b-db0f-4b8c-9007-d6ca93c05483',0,'4b048071-faba-4216-b142-80bed7031b0c');
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` int DEFAULT '0',
  `role` varchar(25) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expire` datetime DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('0ff3200b-8234-42e3-b2a5-14a1587f663e','vamika','vamika1@mailinator.com','3456789878','pune','$2b$10$rqZ48sw0LYndKiF1795oIObYeMYxK/LQBoycLvzI/8s5Ava325Fq2',0,'patient',NULL,NULL,NULL,'2026-10-29 08:47:11'),('1c06b76b-db0f-4b8c-9007-d6ca93c05483','priyanka','priyanka@mailinator.com','3456789878','pune','$2b$10$my30qUQEPtVkgADH.VsFY.NqrBE1R45Ha0CqtDkfxAGXQL/NncINy',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('2b2d45dc-707e-44b7-8e87-0636b2f8ed3b','geeta','geeta@mailinator.com','3456789878','pune','$2b$10$lqwLLDWy11chFDAwGwEES.BtwGLXUqutGk6KR1xoq5w/vQNt7i3Sy',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('39c57afb-d074-4460-9729-f002f06c6ad1','geeta','geeta@mailinator.com','3456789878','pune','$2b$10$5cfkgKPsLt6kg0GGz5bCRum6Mod6nrrVgAmYksciyIaq4XhJzVdHm',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('4b048071-faba-4216-b142-80bed7031b0c','sayadhri','sayadhri@mailinator.com','3456789878','pune',NULL,0,'patient',NULL,NULL,NULL,'2026-10-29 12:40:19'),('56183ebf-a90e-4e0d-b58e-70b93f3f730e','vamika','vamika@mailinator.com','3456789878','pune','$2b$10$UXbzgXxqaM3Nklz.SWr6dO0ZWZ43j7Tb8/KHc6lk7jkqxZvB.dJaq',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('84604ebe-c18f-4e49-bd41-24fb7edbaa61','Prisha','prisha@mailinator.com','1234343432','pune',NULL,0,'patient',NULL,NULL,'2026-10-29','2026-10-29 13:02:42'),('96940e24-0b88-4b77-a7ff-2c6b8e085a73','vamika','vamika@mailinator.com','3456789878','pune','$2b$10$NLB5lJDSvRIZVwq9Urqh3.ITweZ3vpxX5vHpWLY3Gh3ztBS3vnOsm',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('ca330574-c60b-4a52-a967-c3d80276fb08','vamika','vamika@mailinator.com','3456789878','pune','$2b$10$bpm1XrRkwJhxAGOhOcVvZeLGjj6eQQfGZxhRweOCkI4BMj/k3gxcu',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('d7305909-ca1a-4a17-af0d-ebf63db29533','geeta','geeta@mailinator.com','3456789878','pune','$2b$10$EeLSRD08rlqJGYKzrEkefuqXxEUv91qvavBHZjTYYkEEZKaL8GepK',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('f59bbce3-7549-4b8d-a761-4a60ea4171a1','vamika','vamika@mailinator.com','3456789878','pune','$2b$10$GpKaj/Z71UVVpB5Qdozfsusx96UQQrZqH4CTuMqRndxDflrbyi/Uy',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-31 14:42:08
