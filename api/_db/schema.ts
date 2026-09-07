import { relations } from 'drizzle-orm';
import { boolean, doublePrecision, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const deviceStatus = pgEnum('device_status', ['online', 'offline', 'maintenance']);
export const alertSeverity = pgEnum('alert_severity', ['info', 'warning', 'critical']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 120 }).notNull(),
  phone: varchar('phone', { length: 32 }),
  location: varchar('location', { length: 160 }),
  farmSize: varchar('farm_size', { length: 80 }),
  primaryCrop: varchar('primary_crop', { length: 80 }).default('Rice'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const iotDevices = pgTable('iot_devices', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 120 }).notNull(),
  deviceKey: varchar('device_key', { length: 120 }).notNull().unique(),
  status: deviceStatus('status').default('offline').notNull(),
  location: varchar('location', { length: 160 }),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const sensorReadings = pgTable('sensor_readings', {
  id: uuid('id').defaultRandom().primaryKey(),
  deviceId: uuid('device_id').notNull().references(() => iotDevices.id, { onDelete: 'cascade' }),
  temperature: doublePrecision('temperature'),
  humidity: doublePrecision('humidity'),
  soilMoisture: doublePrecision('soil_moisture'),
  rainfall: doublePrecision('rainfall'),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
});

export const alerts = pgTable('alerts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  deviceId: uuid('device_id').references(() => iotDevices.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 160 }).notNull(),
  message: text('message').notNull(),
  severity: alertSeverity('severity').default('info').notNull(),
  acknowledged: boolean('acknowledged').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({ devices: many(iotDevices), alerts: many(alerts) }));
export const deviceRelations = relations(iotDevices, ({ one, many }) => ({ user: one(users, { fields: [iotDevices.userId], references: [users.id] }), readings: many(sensorReadings) }));
export const readingRelations = relations(sensorReadings, ({ one }) => ({ device: one(iotDevices, { fields: [sensorReadings.deviceId], references: [iotDevices.id] }) }));
export const alertRelations = relations(alerts, ({ one }) => ({ user: one(users, { fields: [alerts.userId], references: [users.id] }), device: one(iotDevices, { fields: [alerts.deviceId], references: [iotDevices.id] }) }));

export type User = typeof users.$inferSelect;
