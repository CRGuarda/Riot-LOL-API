import { Controller, Get, Param, Query } from '@nestjs/common'
import { SummonerService } from './summoner.service'
import { SummonerParam } from 'src/dto/summoner-param.dto'
import { QueryParams } from 'src/dto/query-param.dto'

@Controller('summoner')
export class SummonerController {
  constructor(private summonerService: SummonerService) {}

  @Get(':summoner/:region')
  getSummoner(@Param() player: SummonerParam, @Query() query: QueryParams) {
    return this.summonerService.getSummoner(player, query)
  }
}
