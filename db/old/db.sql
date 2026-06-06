CREATE TABLE `users` (
  `id` integer PRIMARY KEY,
  `nickname` varchar(255) UNIQUE NOT NULL,
  `pfp_id` integer,
  `fav_genre` varchar(255),
  `playlists` integer
);

CREATE TABLE `playlists` (
  `PL_id` integer PRIMARY KEY,
  `name` varchar(255),
  `pfp_id` integer,
  `songs` integer,
  `viewability` varchar(public,unlisted,private)
);

CREATE TABLE `songs` (
  `id` integer PRIMARY KEY,
  `api_call` integer
);

CREATE TABLE `image` (
  `id` integer PRIMARY KEY,
  `img` image
);

ALTER TABLE `image` ADD FOREIGN KEY (`id`) REFERENCES `users` (`pfp_id`);

ALTER TABLE `playlists` ADD FOREIGN KEY (`PL_id`) REFERENCES `users` (`playlists`);

ALTER TABLE `image` ADD FOREIGN KEY (`id`) REFERENCES `playlists` (`pfp_id`);

ALTER TABLE `songs` ADD FOREIGN KEY (`id`) REFERENCES `playlists` (`songs`);
