import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameController } from './controllers/game.controller';
import { GameSchema, GAME_NAME_SCHEMA } from './schemas/game.schemas';
import { GameService } from './services/game.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GAME_NAME_SCHEMA, schema: GameSchema }]),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
