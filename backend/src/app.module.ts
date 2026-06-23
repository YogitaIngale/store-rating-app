import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { User } from './users/user.entity';
import { Store } from './stores/store.entity';
import { Rating } from './stores/rating.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',  
      password: '0987654',
      database: 'store_rating_db',
      entities: [User, Store, Rating],
      synchronize: true,     
    }),
    AuthModule,
    UsersModule,
    StoresModule,
  ],
})
export class AppModule {}