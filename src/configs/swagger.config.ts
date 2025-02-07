import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const SwaggerConfigInit = (app: INestApplication) => {
    const document = new DocumentBuilder()
        .setTitle("Academix Api")
        .setDescription("Backend service api")
        .setVersion("v0.0.1")
        .addBasicAuth(SwaggerAuthConfig(), "Authorization")
        .build()

    const swaggerDocument = SwaggerModule.createDocument(app, document);
    SwaggerModule.setup("/swagger", app, swaggerDocument);
}

const SwaggerAuthConfig = (): SecuritySchemeObject => {
    return {
        type: "http",
        bearerFormat: "JWT",
        in: "header",
        scheme: "bearer"
    }
}