CREATE TABLE `reservation_inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`room` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`guests` integer NOT NULL,
	`message` text NOT NULL,
	`estimate` integer NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reservation_inquiries_reference_unique` ON `reservation_inquiries` (`reference`);