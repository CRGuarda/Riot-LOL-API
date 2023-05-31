import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { QueryParams } from 'src/dto/query-param.dto'
import { SummonerParam } from 'src/dto/summoner-param.dto'
import { getSummoner } from 'src/helpers/riot'

@Injectable()
export class SummonerService {
  constructor(private configService: ConfigService) {}
  async getSummoner(player: SummonerParam, query: QueryParams) {
    try {
      const RIOT_TOKEN = this.configService.get<string>('RIOT_TOKEN')
      const { summoner, region } = player

      const summonerRes = await getSummoner({
        region,
        summoner,
        RIOT_TOKEN,
        query,
      })

      return summonerRes
    } catch (error) {
      if (error.status_code) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(
        `Please check the summoner name and the region choosed.`,
        { cause: new Error(), description: error.message },
      )
    }
  }
}
