import { SetMetadata } from "@nestjs/common";

export const SKIP_AUTH = "SKIP_AUTH";
export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);