import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { StripeService } from "./stripe.service";

@Global()
@Module({
    imports: [HttpModule.register({
        maxRedirects: 5,
        timeout: 5000
    })],
    providers: [StripeService],
    exports: [StripeService]
})
export class HttpApiModule {}