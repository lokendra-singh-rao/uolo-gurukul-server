import cron from "node-cron";
import { rotateLogFiles } from "../utils/logger.js";

export const cronJob = cron.schedule("0 */24 * * *", async () => {
  rotateLogFiles();
});
