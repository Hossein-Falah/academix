import { ApiBearerAuth } from "@nestjs/swagger"
import { applyDecorators, UseGuards } from "@nestjs/common"
import { AuthGuard } from "src/modules/auth/guard/auth.guard"
import { RoleGuard } from "src/modules/auth/guard/role.guard"

export const AuthDecorator = () => {
    return applyDecorators(
        ApiBearerAuth("Authorization"),
        UseGuards(AuthGuard, RoleGuard)
    )
}