CREATE TYPE "public"."device_status" AS ENUM('online', 'offline', 'maintenance');
CREATE TYPE "public"."alert_severity" AS ENUM('info', 'warning', 'critical');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(320) NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "name" varchar(120) NOT NULL,
  "phone" varchar(32),
  "location" varchar(160),
  "farm_size" varchar(80),
  "primary_crop" varchar(80) DEFAULT 'Rice',
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "iot_devices" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" varchar(120) NOT NULL,
  "device_key" varchar(120) NOT NULL UNIQUE,
  "status" "device_status" DEFAULT 'offline' NOT NULL,
  "location" varchar(160),
  "last_seen_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "sensor_readings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "device_id" uuid NOT NULL REFERENCES "iot_devices"("id") ON DELETE CASCADE,
  "temperature" double precision,
  "humidity" double precision,
  "soil_moisture" double precision,
  "rainfall" double precision,
  "recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "alerts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "device_id" uuid REFERENCES "iot_devices"("id") ON DELETE SET NULL,
  "title" varchar(160) NOT NULL,
  "message" text NOT NULL,
  "severity" "alert_severity" DEFAULT 'info' NOT NULL,
  "acknowledged" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX "sensor_readings_device_recorded_idx" ON "sensor_readings" ("device_id", "recorded_at");
CREATE INDEX "alerts_user_created_idx" ON "alerts" ("user_id", "created_at");
