import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);

        const options = new DocumentBuilder()
            .setTitle('genese-angular demo')
            .setDescription('The genese-angular demo API description')
            .setVersion('1.0')
            .addTag('genese-angular')
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api', app, document);
        app.enableCors();
        await app.listen(3000);
    } catch (err) {
        console.log(err);
    }
}
bootstrap();
