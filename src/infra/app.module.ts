import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { DatabaseModule } from './database/database.module'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    EnvModule,
    HttpModule,
    DatabaseModule,
    AuthModule,
    CryptographyModule,
  ],
})
export class AppModule {}
