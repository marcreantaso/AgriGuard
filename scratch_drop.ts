import 'dotenv/config';
import { sql } from './lib/db.js';

(async () => {
    try {
        await sql`DROP TABLE IF EXISTS alerts, sensor_readings, iot_devices, users CASCADE`;
        await sql`DROP TYPE IF EXISTS alert_severity, device_status CASCADE`;
        console.log('Dropped successfully');
    } catch (e) {
        console.error(e)
    }
})()
