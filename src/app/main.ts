import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ExceptionsFilterService } from './exception-filter/exceptions-filter.service.js';
import { NotFoundException } from '@exceptions';
import { runModulesComposer } from './composers/modules.composer.js';
import { runRoutersComposer } from './composers/routers.composer.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

const bootstrap = async () => {
  const { moduleRouters, loggerService, accessTokenGuard } = await runModulesComposer();

  // compose routers
  const rootRouter = runRoutersComposer({ moduleRouters, accessTokenGuard });

  app.use('/api/v1', rootRouter);

  // handle 404
  app.use((_req, _res) => {
    throw new NotFoundException('Route not found');
  });

  // handle all exceptions
  const exceptionsHandlerService = new ExceptionsFilterService(loggerService);
  app.use(exceptionsHandlerService.allExceptionsHandler);

  // start server
  const PORT = process.env.APP_PORT;

  app.listen(PORT, () => {
    loggerService.success(`Server listening at http://localhost:${PORT}`);
  });
};

void bootstrap();
