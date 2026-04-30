import chalk from 'chalk';

/* eslint-disable no-console */
export class LoggerService {
  /**
   * Log when something is initialized.
   */
  init(entityName: string) {
    console.log(`${chalk.green('🚀 [Init]')} ${chalk.cyan(entityName)} initialized`);
  }

  /**
   * Log an error with an optional cause.
   */
  error(error: unknown) {
    console.error(chalk.red('🚨 [Error]:'));
    console.error(error);

    if (error && typeof error === 'object' && 'cause' in error) {
      console.error(chalk.red('🚨❓ Caused by: '));
      console.error(error.cause);
    }
  }

  /**
   * Log success messages.
   * Example: ✅ [Success] User created
   */
  success(message: string) {
    console.log(`${chalk.green('✅  [Success]')} ${message}`);
  }

  /**
   * General info log.
   * Example: ℹ️ [Info] Server started
   */
  info(message: string) {
    console.log(`${chalk.blue('ℹ️ [Info]')} ${message}`);
  }
}
