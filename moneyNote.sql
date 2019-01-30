-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 11, 2018 at 12:58 AM
-- Server version: 5.7.24-0ubuntu0.16.04.1
-- PHP Version: 7.2.12-1+ubuntu16.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moneyNote`
--

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` smallint(6) NOT NULL DEFAULT '1' COMMENT '1 = MMK, 2 = USD, 3 = SGD',
  `type` smallint(6) NOT NULL COMMENT '1 = Expense, 2 = Income, 3 = Receivable',
  `date` date NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `user_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `title`, `amount`, `currency`, `type`, `date`, `attachment`, `createdAt`, `updatedAt`, `user_id`) VALUES
(2, 'Dinner', '600.00', 1, 2, '2018-12-09', '72a62751731d09b606459d005154b726', '2018-12-09 08:53:34', '2018-12-09 09:42:05', 5),
(4, 'Lunch', '100.00', 2, 1, '2018-12-09', '3d6cefd0192c0b06630ad667c9f0989d', '2018-12-09 08:55:20', '2018-12-09 08:55:20', 6),
(5, 'Dinner', '200.00', 2, 2, '2018-12-09', 'f31e6db4bca146f9ab3c9744e8df1d24', '2018-12-09 08:55:40', '2018-12-09 08:55:40', 6),
(6, 'Salary', '300.00', 2, 3, '2018-12-09', '33bf010f86eba7b164a337d1a304a31b', '2018-12-09 08:56:01', '2018-12-09 08:56:01', 6),
(7, 'Salary', '0.04', 2, 2, '2018-12-09', '3864fa5b0d73d10b30d19a08ebb90b48', '2018-12-09 09:50:41', '2018-12-09 09:50:41', 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(5, 'google', 'google@mail.com', '$2b$10$DuiTukoCv7aMt10Aakl.2u8wIe2eRKkyngG.S7.VlWZboZdpDyl72', '2018-12-02 10:20:14', '2018-12-02 10:20:14'),
(6, 'Tester', 'test@gmail.com', '$2b$10$cdgWIeUP1Rx4J8sl18P50u6K0KH2BW3Lgl9CEY21TIRseSP3tcRES', '2018-12-09 08:54:36', '2018-12-09 08:54:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
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
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
