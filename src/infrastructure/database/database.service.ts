import { DataSource, type DataSourceOptions } from 'typeorm';
import type { ConfigService } from '@infrastructure/config-service';

export class DatabaseService {
  private readonly dataSource: DataSource;

  constructor(private readonly configService: ConfigService) {
    const dataSourceConfig = this.getDataSourceConfig();
    this.dataSource = new DataSource(dataSourceConfig);
  }

  async initialize(): Promise<DataSource> {
    try {
      return await this.dataSource.initialize();
    } catch (error) {
      throw new Error('Failed to initialize database', { cause: error });
    }
  }

  private getDataSourceConfig(): DataSourceOptions {
    // env variables
    const host = this.configService.env.DB_HOST;
    const port = this.configService.env.DB_PORT;
    const username = this.configService.env.DB_USERNAME;
    const password = this.configService.env.DB_PASSWORD;
    const database = this.configService.env.DB_DATABASE;
    const appEnv = this.configService.env.APP_ENV;

    // config variables
    const entities = appEnv === 'dev' ? ['**/*.entity.js'] : ['dist/**/*.entity.js'];

    // return config
    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      synchronize: true,
      logging: false,
      entities,
    };
  }
}
