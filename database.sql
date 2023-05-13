-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2023 at 05:57 PM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `habib`
--

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `about` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `automated_email` int(3) DEFAULT NULL,
  `category` int(5) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `company` int(5) DEFAULT NULL,
  `country_state` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `facebook_id` varchar(255) DEFAULT NULL,
  `house` varchar(255) DEFAULT NULL,
  `postcode` varchar(255) DEFAULT NULL,
  `landline` varchar(255) DEFAULT NULL,
  `linkedin_id` varchar(255) DEFAULT NULL,
  `other_contact` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `skype_name` varchar(255) DEFAULT NULL,
  `subcategory` int(5) DEFAULT NULL,
  `twitter_username` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `where_find` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `about`, `address`, `automated_email`, `category`, `city`, `company`, `country_state`, `customer_name`, `email`, `facebook_id`, `house`, `postcode`, `landline`, `linkedin_id`, `other_contact`, `phone`, `skype_name`, `subcategory`, `twitter_username`, `website`, `where_find`, `createdAt`, `updatedAt`) VALUES
(5, NULL, NULL, 0, 1, NULL, 2, NULL, NULL, 'astjin2@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, '2023-02-05 09:30:11', '2023-02-05 09:30:11');

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

CREATE TABLE `emails` (
  `id` int(11) NOT NULL,
  `fromName` varchar(255) DEFAULT NULL,
  `fromEmail` varchar(255) DEFAULT NULL,
  `toName` varchar(255) DEFAULT NULL,
  `toEmail` varchar(255) DEFAULT NULL,
  `subject` text DEFAULT NULL,
  `isImportant` int(11) DEFAULT 0,
  `isStarred` int(11) DEFAULT 0,
  `isUnread` int(11) DEFAULT 0,
  `labelIds` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `files` text DEFAULT NULL,
  `category` int(11) DEFAULT NULL COMMENT '0:inbox,1:sent',
  `parentID` int(11) DEFAULT 0,
  `accept` varchar(255) NOT NULL,
  `acceptDate` datetime DEFAULT NULL,
  `reply` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `inReplyTo` varchar(255) DEFAULT NULL,
  `messageId` varchar(255) DEFAULT NULL,
  `mainId` varchar(255) DEFAULT NULL,
  `hostname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `emails`
--

INSERT INTO `emails` (`id`, `fromName`, `fromEmail`, `toName`, `toEmail`, `subject`, `isImportant`, `isStarred`, `isUnread`, `labelIds`, `message`, `files`, `category`, `parentID`, `accept`, `acceptDate`, `reply`, `createdAt`, `updatedAt`, `inReplyTo`, `messageId`, `mainId`, `hostname`) VALUES
(1014, 'James Baker', 'jameswadebaker@gmail.com', NULL, 'administrator@meta-labs.space', 'admin', 0, 0, 0, NULL, '<p>admin test email</p>', NULL, 0, 0, '', NULL, NULL, '2023-04-02 00:12:42', '2023-04-02 00:12:42', NULL, '<CALzZ0ZqJ9KZqQi5hCKhkOW31ntqm2Yh7E41ZWYchu+OX4-xBUQ@mail.gmail.com>', '<CALzZ0ZqJ9KZqQi5hCKhkOW31ntqm2Yh7E41ZWYchu+OX4-xBUQ@mail.gmail.com>', 'administrator@meta-labs.space'),
(1015, 'James Baker', 'jameswadebaker@gmail.com', NULL, 'administrator@meta-labs.space', 'okay', 0, 0, 0, NULL, '<p>test 002 message</p>', NULL, 0, 0, 'admin@gmail.com', '2023-04-02 00:41:16', '2023-04-02 00:41:24', '2023-04-02 00:22:28', '2023-04-02 00:41:24', NULL, '<CALzZ0Zp53KVutv-DwOvuuvxCN8rxoY9SvXt0bENX_SBezdEprA@mail.gmail.com>', '<CALzZ0Zp53KVutv-DwOvuuvxCN8rxoY9SvXt0bENX_SBezdEprA@mail.gmail.com>', 'administrator@meta-labs.space'),
(1017, 'Hiring management Team of LCT', 'administrator@meta-labs.space', 'James Baker', 'jameswadebaker@gmail.com', 'okay', 0, 0, 0, NULL, 'Test 002', NULL, 1, 1015, 'admin@gmail.com', NULL, NULL, '2023-04-02 00:41:24', '2023-04-02 00:41:24', '<CALzZ0Zp53KVutv-DwOvuuvxCN8rxoY9SvXt0bENX_SBezdEprA@mail.gmail.com>', '<a1d90ea8-52ce-6243-a9c0-be46dffdbfb3@meta-labs.space>', '<CALzZ0Zp53KVutv-DwOvuuvxCN8rxoY9SvXt0bENX_SBezdEprA@mail.gmail.com>', 'administrator@meta-labs.space');

-- --------------------------------------------------------

--
-- Table structure for table `email_teams`
--

CREATE TABLE `email_teams` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `email_teams`
--

INSERT INTO `email_teams` (`id`, `name`, `email`, `createdAt`, `updatedAt`) VALUES
(2, 'Sale', 2, '2023-04-01 21:55:47', '2023-04-01 21:55:47'),
(3, 'Technical', 5, '2023-04-01 21:56:27', '2023-04-01 23:11:56');

-- --------------------------------------------------------

--
-- Table structure for table `esettings`
--

CREATE TABLE `esettings` (
  `id` int(11) NOT NULL,
  `host` varchar(255) NOT NULL,
  `imap` int(11) NOT NULL,
  `smpt` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` varchar(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `esettings`
--

INSERT INTO `esettings` (`id`, `host`, `imap`, `smpt`, `email`, `password`, `createdAt`, `updatedAt`, `status`) VALUES
(5, 'mail.meta-labs.space', 993, 465, 'administrator@meta-labs.space', '6Gw2ksxVf_;s', '2023-03-30 21:26:19', '2023-04-02 11:51:15', '1');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `emailScan` datetime DEFAULT '2022-01-01 00:00:00',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `emailScan`, `createdAt`, `updatedAt`) VALUES
(1, '2023-03-25 20:17:08', NULL, '2023-03-25 20:17:08');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `team_name` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `team_name`, `color`, `createdAt`, `updatedAt`) VALUES
(1, 'team1', '#6300FF', NULL, NULL),
(2, 'team2', '#A500BE', NULL, NULL),
(3, 'FB', '#61C6B8', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'public/avatar/user_default.gif',
  `accountype` varchar(255) NOT NULL,
  `colourCode` varchar(255) NOT NULL,
  `staff` varchar(255) NOT NULL,
  `dateAdded` varchar(255) NOT NULL,
  `permissions` varchar(255) NOT NULL,
  `team` int(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `gender`, `phone`, `role`, `createdAt`, `updatedAt`, `image`, `accountype`, `colourCode`, `staff`, `dateAdded`, `permissions`, `team`, `firstname`, `lastname`) VALUES
(44, 'Sitely Pro', 'admin@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', '', '', 'admin', '2023-03-27 00:12:33', '2023-04-04 11:41:28', 'public/avatar/user_default.gif', '', '#03a9f4', '', '2023-03-30', 'Admin', 2, 'admin', '001'),
(45, 'Kayden Davis', 'netprince1210@gmail.com', 'd38eb4289cfc1814e18572bcf9cf988e', '', '', 'admin', '2023-03-27 18:32:48', '2023-04-01 22:21:55', 'public/avatar/user_default.gif', '', '#795548', '', '2023-03-30', '', 3, '', ''),
(48, 'Support Team of Email Service', 'test001@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', '', '', 'user', '2023-03-30 15:50:32', '2023-04-10 13:08:21', 'public/avatar/user_default.gif', '', '#4caf50', '', '2023-01-01', '', 3, '001', '001'),
(49, 'Sale admin', 'admin111@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', '', '', 'admin', '2023-04-01 22:07:53', '2023-04-02 02:19:04', 'public/avatar/user_default.gif', '', '#e91e63', '', '2023-04-02', '', 2, '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emails`
--
ALTER TABLE `emails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_teams`
--
ALTER TABLE `email_teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `esettings`
--
ALTER TABLE `esettings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `emails`
--
ALTER TABLE `emails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1044;

--
-- AUTO_INCREMENT for table `email_teams`
--
ALTER TABLE `email_teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `esettings`
--
ALTER TABLE `esettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
