CREATE DATABASE  IF NOT EXISTS `my_camp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `my_camp`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 10.11.12.68    Database: my_camp
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.20.04.1

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
-- Table structure for table `camps`
--

DROP TABLE IF EXISTS `camps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camps` (
  `camp_id` int NOT NULL AUTO_INCREMENT,
  `camp_name` varchar(100) NOT NULL,
  `camp_date` date NOT NULL,
  `area` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `mandal` varchar(100) NOT NULL,
  `coordinator` varchar(100) NOT NULL,
  `sponsor` varchar(100) NOT NULL,
  `agenda` text NOT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`camp_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_camps_date` (`camp_date`),
  CONSTRAINT `camps_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camps`
--

LOCK TABLES `camps` WRITE;
/*!40000 ALTER TABLE `camps` DISABLE KEYS */;
INSERT INTO `camps` VALUES (1,'sdnfdjnqqq``','2025-10-21','jsndvjnsjkn','kfdsjvncjksn','ofndjvnjksn','jnfsdjncjsn','jnwsdjvnjsn','jfdjvnj',1,'2025-10-17 14:27:23','2025-10-17 17:36:28'),(2,'Test Camp','2025-10-17','Test Area','Test District','Test Mandal','Test Coordinator','Test Sponsor','Test Agenda',1,'2025-10-17 14:27:57','2025-10-17 14:27:57'),(3,'womens','2025-10-28','madhilapalem','vizag','vizag','rishi','madhu','vizag',1,'2025-10-17 14:40:16','2025-10-17 18:25:22');
/*!40000 ALTER TABLE `camps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultation_reasons`
--

DROP TABLE IF EXISTS `consultation_reasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultation_reasons` (
  `reason_id` int NOT NULL AUTO_INCREMENT,
  `reason_name` varchar(100) NOT NULL,
  PRIMARY KEY (`reason_id`),
  UNIQUE KEY `reason_name` (`reason_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultation_reasons`
--

LOCK TABLES `consultation_reasons` WRITE;
/*!40000 ALTER TABLE `consultation_reasons` DISABLE KEYS */;
INSERT INTO `consultation_reasons` VALUES (5,'Abdominal Pain'),(6,'Bleeding After Sex'),(2,'Bleeding While Periods'),(7,'Pain During Intercourse'),(4,'Uber on vagina'),(3,'Vagina tarus'),(1,'Vaginal Discharge');
/*!40000 ALTER TABLE `consultation_reasons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_exams`
--

DROP TABLE IF EXISTS `doctor_exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_exams` (
  `doctor_exam_id` int NOT NULL AUTO_INCREMENT,
  `registration_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `visual_findings` json DEFAULT NULL,
  `via_result` varchar(50) NOT NULL,
  `via_extends_endocervical` varchar(10) DEFAULT NULL,
  `via_quadrant_count` varchar(20) DEFAULT NULL,
  `via_quadrants` json DEFAULT NULL,
  `biopsy_taken` tinyint(1) DEFAULT '0',
  `biopsy_site_notes` text,
  `actions_taken` json DEFAULT NULL,
  `actions_other_text` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`doctor_exam_id`),
  KEY `registration_id` (`registration_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `doctor_exams_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`registration_id`),
  CONSTRAINT `doctor_exams_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_exams`
--

LOCK TABLES `doctor_exams` WRITE;
/*!40000 ALTER TABLE `doctor_exams` DISABLE KEYS */;
INSERT INTO `doctor_exams` VALUES (3,NULL,NULL,'[\"Nabothian\", \"Leukoplakia\", \"Polyp\"]','Negative',NULL,NULL,'[]',0,NULL,'[\"Follow5Years\", \"ImmediateTreatment\"]',NULL,'2025-10-17 18:35:43'),(4,2,1,'[\"Nabothian\", \"Leukoplakia\", \"AnyGrowth\"]','Negative',NULL,NULL,'[]',0,NULL,'[\"Follow5Years\", \"MedCervicitis\", \"StagingTreatment\"]',NULL,'2025-10-17 18:39:48'),(5,2,1,'[\"Nabothian\"]','Negative',NULL,NULL,'[]',0,NULL,'[\"Follow5Years\", \"ImmediateTreatment\", \"Others\"]',NULL,'2025-10-17 18:40:20'),(6,3,1,'[]','Negative',NULL,NULL,'[]',0,NULL,'[\"MedCervicitis\", \"StagingTreatment\"]',NULL,'2025-10-17 18:40:40'),(7,1,1,'[]','Negative',NULL,NULL,'[]',0,NULL,'[\"ImmediateTreatment\"]',NULL,'2025-10-17 18:40:59');
/*!40000 ALTER TABLE `doctor_exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guardian_types`
--

DROP TABLE IF EXISTS `guardian_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guardian_types` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) NOT NULL,
  PRIMARY KEY (`type_id`),
  UNIQUE KEY `type_name` (`type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guardian_types`
--

LOCK TABLES `guardian_types` WRITE;
/*!40000 ALTER TABLE `guardian_types` DISABLE KEYS */;
INSERT INTO `guardian_types` VALUES (1,'Father'),(2,'Husband'),(3,'Other');
/*!40000 ALTER TABLE `guardian_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marital_status`
--

DROP TABLE IF EXISTS `marital_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marital_status` (
  `status_id` int NOT NULL AUTO_INCREMENT,
  `status_name` varchar(50) NOT NULL,
  PRIMARY KEY (`status_id`),
  UNIQUE KEY `status_name` (`status_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marital_status`
--

LOCK TABLES `marital_status` WRITE;
/*!40000 ALTER TABLE `marital_status` DISABLE KEYS */;
INSERT INTO `marital_status` VALUES (4,'Divorced'),(2,'Married'),(1,'Single'),(3,'Widowed');
/*!40000 ALTER TABLE `marital_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `registration_list_view`
--

DROP TABLE IF EXISTS `registration_list_view`;
/*!50001 DROP VIEW IF EXISTS `registration_list_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `registration_list_view` AS SELECT 
 1 AS `registration_id`,
 1 AS `opd_number`,
 1 AS `first_name`,
 1 AS `guardian_name`,
 1 AS `guardian_type`,
 1 AS `age`,
 1 AS `mobile`,
 1 AS `aadhar`,
 1 AS `camp_name`,
 1 AS `camp_date`,
 1 AS `marital_status`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `registration_reasons`
--

DROP TABLE IF EXISTS `registration_reasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registration_reasons` (
  `registration_id` int NOT NULL,
  `reason_id` int NOT NULL,
  PRIMARY KEY (`registration_id`,`reason_id`),
  KEY `reason_id` (`reason_id`),
  CONSTRAINT `registration_reasons_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`registration_id`),
  CONSTRAINT `registration_reasons_ibfk_2` FOREIGN KEY (`reason_id`) REFERENCES `consultation_reasons` (`reason_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration_reasons`
--

LOCK TABLES `registration_reasons` WRITE;
/*!40000 ALTER TABLE `registration_reasons` DISABLE KEYS */;
INSERT INTO `registration_reasons` VALUES (1,2),(3,3),(1,5),(2,5),(3,5),(1,7),(3,7);
/*!40000 ALTER TABLE `registration_reasons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrations` (
  `registration_id` int NOT NULL AUTO_INCREMENT,
  `opd_number` varchar(25) NOT NULL,
  `camp_id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `guardian_name` varchar(100) NOT NULL,
  `guardian_type_id` int NOT NULL,
  `age` int NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `aadhar` varchar(12) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `last_period_date` date DEFAULT NULL,
  `marital_status_id` int DEFAULT NULL,
  `marriage_date` date DEFAULT NULL,
  `children_count` int DEFAULT '0',
  `abortion_count` int DEFAULT '0',
  `highest_education` varchar(100) DEFAULT NULL,
  `employment` varchar(100) DEFAULT NULL,
  `vaccination_awareness` tinyint(1) DEFAULT '0',
  `previously_screened` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`registration_id`),
  UNIQUE KEY `opd_number` (`opd_number`),
  UNIQUE KEY `aadhar` (`aadhar`),
  KEY `guardian_type_id` (`guardian_type_id`),
  KEY `marital_status_id` (`marital_status_id`),
  KEY `idx_registrations_camp` (`camp_id`),
  KEY `idx_registrations_aadhar` (`aadhar`),
  KEY `idx_registrations_mobile` (`mobile`),
  CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`camp_id`) REFERENCES `camps` (`camp_id`),
  CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`guardian_type_id`) REFERENCES `guardian_types` (`type_id`),
  CONSTRAINT `registrations_ibfk_3` FOREIGN KEY (`marital_status_id`) REFERENCES `marital_status` (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrations`
--

LOCK TABLES `registrations` WRITE;
/*!40000 ALTER TABLE `registrations` DISABLE KEYS */;
INSERT INTO `registrations` VALUES (1,'OPD-20251017-0001',1,'M.DFNVBJN','KJDNSDJKVN',2,34,'836483637','567876556787','ABC@AV.COM',NULL,2,NULL,1,0,'Intermediate','NO',1,0,'2025-10-17 15:30:33'),(2,'OPD-20251017-0002',3,'sdkjfuioshq','jk',1,34,'9876567909','987655678909','a@A.com','2025-10-07',1,'2025-09-16',1,1,'Intermediate','na',0,1,'2025-10-17 17:52:35'),(3,'OPD-20251017-0003',3,'ksamfkn','kdsfn',1,29,'2345653234','456543234567','abc@a.com','2025-09-30',2,'2025-10-13',1,1,'Intermediate','na',1,0,'2025-10-17 18:02:55');
/*!40000 ALTER TABLE `registrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_registration_insert` BEFORE INSERT ON `registrations` FOR EACH ROW BEGIN
    DECLARE next_seq INT;
    SET next_seq = (
        SELECT IFNULL(MAX(SUBSTRING_INDEX(opd_number, '-', -1)), 0) + 1
        FROM registrations
        WHERE opd_number LIKE CONCAT('OPD-', DATE_FORMAT(CURRENT_DATE, '%Y%m%d'), '-%')
    );
    SET NEW.opd_number = CONCAT(
        'OPD-',
        DATE_FORMAT(CURRENT_DATE, '%Y%m%d'),
        '-',
        LPAD(next_seq, 4, '0')
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'doctor'),(3,'user');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','+919876543210','$2b$10$CneVoLYUMcfC8g864X6yjejW3KSub6J2jjEwkl1/ho.WyDBuIv0kK',1,'admin@camp.com','2025-10-16 08:21:21','2025-10-17 10:01:21'),(2,'rahul','8919332356','$2b$10$sAWR5zAwd5qxCXdH2YmcQOGqo.A3Uf8r4yn8tbPefpUINO4.RWXJ6',2,'rahul@rahul.com','2025-10-17 10:30:26','2025-10-17 10:30:26'),(3,'raju','8787878787','$2b$10$ONJgaM6KC8dWHBmJ9ObjJeS29Y5pWtL1UJBYUPN9MLVp9lpBHxdFS',3,'dhfbhsdh@hkbfh.com','2025-10-17 15:10:06','2025-10-17 15:10:06');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'my_camp'
--

--
-- Dumping routines for database 'my_camp'
--

--
-- Final view structure for view `registration_list_view`
--

/*!50001 DROP VIEW IF EXISTS `registration_list_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `registration_list_view` AS select `r`.`registration_id` AS `registration_id`,`r`.`opd_number` AS `opd_number`,`r`.`first_name` AS `first_name`,`r`.`guardian_name` AS `guardian_name`,`gt`.`type_name` AS `guardian_type`,`r`.`age` AS `age`,`r`.`mobile` AS `mobile`,`r`.`aadhar` AS `aadhar`,`c`.`camp_name` AS `camp_name`,`c`.`camp_date` AS `camp_date`,`ms`.`status_name` AS `marital_status` from (((`registrations` `r` join `camps` `c` on((`r`.`camp_id` = `c`.`camp_id`))) join `guardian_types` `gt` on((`r`.`guardian_type_id` = `gt`.`type_id`))) left join `marital_status` `ms` on((`r`.`marital_status_id` = `ms`.`status_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-18  1:28:26
