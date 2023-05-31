import { Module } from '@nestjs/common'
import { SummonerService } from './summoner.service'
import { SummonerController } from './summoner.controller'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  providers: [SummonerService],
  controllers: [SummonerController],
})
export class SummonerModule {}
