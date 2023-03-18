// *    *    *    *    *    *
// -    -    -    -    -    -
// |    |    |    |    |    |
// |    |    |    |    |    +----- day of the week (0 - 6) (Sunday = 0)
// |    |    |    |    +------- month (1 - 12)
// |    |    |    +--------- day of the month (1 - 31)
// |    |    +----------- hour (0 - 23)
// |    +------------- min (0 - 59)
// +--------------- second (0 - 59) (optional)

export const CRON_TIME_EVERY_5_SECONDS = '*/5 * * * * *';
export const CRON_TIME_EVERY_10_SECONDS = '*/10 * * * * *';

export const CRON_TIME_EVERY_MINUTE = '*/1 * * * *';
export const CRON_TIME_EVERY_2_MINUTES = '*/2 * * * *';
export const CRON_TIME_EVERY_5_MINUTES = '*/5 * * * *';
export const CRON_RUN_EVERY_10_MINUTES = '*/10 * * * *';
export const CRON_TIME_EVERY_2_HOURS = '0 */2 * * *';
export const CRON_TIME_EVERY_DAY_AT_8AM = '0 8 * * *';
export const CRON_TIME_EVERY_HOUR = '0 * * * *';