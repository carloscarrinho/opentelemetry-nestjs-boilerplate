import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initOpenTelemetry } from './open-telemetry/instrumentation';

async function bootstrap() {
  initOpenTelemetry();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
