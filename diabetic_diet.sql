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
INSERT INTO `patient` VALUES ('ac920fcd-4302-4bbb-9315-2f77bceb98e1','1c06b76b-db0f-4b8c-9007-d6ca93c05483',0,NULL);
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
INSERT INTO `user` VALUES ('0ff3200b-8234-42e3-b2a5-14a1587f663e','vamika','vamika1@mailinator.com','3456789878','pune','$2b$10$rqZ48sw0LYndKiF1795oIObYeMYxK/LQBoycLvzI/8s5Ava325Fq2',0,'patient',NULL,NULL,NULL,'2026-10-29 08:47:11'),('1c06b76b-db0f-4b8c-9007-d6ca93c05483','priyanka','priyanka@mailinator.com','3456789878','pune','$2b$10$my30qUQEPtVkgADH.VsFY.NqrBE1R45Ha0CqtDkfxAGXQL/NncINy',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('2b2d45dc-707e-44b7-8e87-0636b2f8ed3b','geeta','geeta@mailinator.com','3456789878','pune','$2b$10$lqwLLDWy11chFDAwGwEES.BtwGLXUqutGk6KR1xoq5w/vQNt7i3Sy',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('39c57afb-d074-4460-9729-f002f06c6ad1','geeta','geeta@mailinator.com','3456789878','pune','$2b$10$5cfkgKPsLt6kg0GGz5bCRum6Mod6nrrVgAmYksciyIaq4XhJzVdHm',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('56183ebf-a90e-4e0d-b58e-70b93f3f730e','vamika','vamika@mailinator.com','3456789878','pune','$2b$10$UXbzgXxqaM3Nklz.SWr6dO0ZWZ43j7Tb8/KHc6lk7jkqxZvB.dJaq',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('96940e24-0b88-4b77-a7ff-2c6b8e085a73','vamika','vamika@mailinator.com','3456789878','pune','$2b$10$NLB5lJDSvRIZVwq9Urqh3.ITweZ3vpxX5vHpWLY3Gh3ztBS3vnOsm',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('ca330574-c60b-4a52-a967-c3d80276fb08','vamika','vamika@mailinator.com','3456789878','pune','$2b$10$bpm1XrRkwJhxAGOhOcVvZeLGjj6eQQfGZxhRweOCkI4BMj/k3gxcu',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('d7305909-ca1a-4a17-af0d-ebf63db29533','geeta','geeta@mailinator.com','3456789878','pune','$2b$10$EeLSRD08rlqJGYKzrEkefuqXxEUv91qvavBHZjTYYkEEZKaL8GepK',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14'),('f59bbce3-7549-4b8d-a761-4a60ea4171a1','vamika','vamika@mailinator.com','3456789878','pune','$2b$10$GpKaj/Z71UVVpB5Qdozfsusx96UQQrZqH4CTuMqRndxDflrbyi/Uy',0,'doctor',NULL,NULL,NULL,'2026-10-29 07:27:14');
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

-- Dump completed on 2026-10-29 15:12:07
