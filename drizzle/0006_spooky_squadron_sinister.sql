ALTER TABLE "localServiceVariants" ALTER COLUMN "day1" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "localServiceVariants" ALTER COLUMN "day2" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "localServiceVariants" ALTER COLUMN "day3" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "localServiceVariants" ALTER COLUMN "day4" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "localServiceVariants" ALTER COLUMN "day5" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "localServices" ALTER COLUMN "day1" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "localServices" ALTER COLUMN "day2" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "localServices" ALTER COLUMN "day3" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "localServices" ALTER COLUMN "day4" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "localServices" ALTER COLUMN "day5" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "serviceVariants" ALTER COLUMN "day1" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "serviceVariants" ALTER COLUMN "day2" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "serviceVariants" ALTER COLUMN "day3" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "serviceVariants" ALTER COLUMN "day4" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "serviceVariants" ALTER COLUMN "day5" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "day1" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "day2" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "day3" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "day4" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "day5" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "orderLocalServices" ADD COLUMN "day2Work" interval;--> statement-breakpoint
ALTER TABLE "orderLocalServices" ADD COLUMN "day3Work" interval;--> statement-breakpoint
ALTER TABLE "orderLocalServices" ADD COLUMN "day4Work" interval;--> statement-breakpoint
ALTER TABLE "orderLocalServices" ADD COLUMN "day5Work" interval;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day2Work" interval;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day3Work" interval;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day4Work" interval;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day5Work" interval;