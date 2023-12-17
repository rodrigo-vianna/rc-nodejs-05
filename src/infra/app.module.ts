import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { DatabaseModule } from './database/database.module'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { EventsModule } from './events/events.module'
import { HttpModule } from './http/http.module'
import { StorageModule } from './storage/storage.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    StorageModule,
    EnvModule,
    HttpModule,
    DatabaseModule,
    AuthModule,
    CryptographyModule,
    EventsModule,
  ],
})
export class AppModule {}
