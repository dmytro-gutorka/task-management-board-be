import { runEmailWorkerComposer } from './email-worker.composer.js';

const bootstrap = async () => {
  const { emailWorkerService, emailQueue, dataSource, loggerService } =
    await runEmailWorkerComposer();

  await emailWorkerService.start();
  loggerService.success('Email worker started');

  const close = async () => {
    await emailWorkerService.close();
    await emailQueue.close();
    await dataSource.destroy();

    process.exit(0);
  };

  process.on('SIGINT', () => void close());
  process.on('SIGTERM', () => void close());
};

void bootstrap();
