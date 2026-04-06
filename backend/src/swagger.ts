import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

async function generateSwaggerDocument() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('Football Simulator API')
    .setDescription('API documentation for the Football Simulator backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outputPath = join(__dirname, '../swagger.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));

  await app.close();
  console.log(`Swagger document generated at ${outputPath}`);
}

generateSwaggerDocument().catch((error) => {
  console.error('Failed to generate Swagger document:', error);
  process.exit(1);
});
