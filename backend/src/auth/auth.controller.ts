import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any) {
        try {
            const user = await this.authService.validateUser(body.email, body.password);
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }
            return this.authService.login(user);
        } catch (error) {
            console.error('Login Error:', error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message || 'Internal Server Error',
                details: error
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('register')
    async register(@Body() body: any) {
        try {
            // Updated to use registerClinic which handles the full structure
            return await this.authService.registerClinic(body);
        } catch (e) {
            if (e instanceof UnauthorizedException) throw e;
            console.error(e);
            throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
        }
    }
    @Post('impersonate')
    async impersonate(@Body() body: any) {
        // In a production environment, this endpoint MUST be protected by a Master Guard.
        return this.authService.impersonate(body.clinicId);
    }
}
