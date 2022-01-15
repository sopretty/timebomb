import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameModule } from './game/game.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://0.0.0.0:27888'), GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
