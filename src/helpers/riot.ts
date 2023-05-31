import { ROUTING } from '../consts/regionZones'
import { itemsArray } from './itemsArray'
import { runesArray } from './runesArray'
import { spellsArray } from './spellsArray'

export const getSummoner = async ({ region, summoner, RIOT_TOKEN, query }) => {
  const { page, size, queue } = query

  const start = () => {
    if (!page) return 0
    if (+page <= 1) return 0
    return (+page - 1) * +size
  }

  const count = () => {
    if (!size) return 20
    if (+size < 0) return 20
    return +size
  }

  const queueParam = queue ? `&queue=${queue}` : ''
  const summonerRes = await fetch(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`,
    {
      headers: {
        'X-Riot-Token': RIOT_TOKEN,
      },
    },
  )
  const summonerResponse = await summonerRes.json()

  if (!summonerRes.ok) {
    throw summonerResponse.status
  }

  const regionZone = Object.keys(ROUTING).find((item) =>
    ROUTING[item].find((a: string) => a === region.toLowerCase()),
  )

  const matchesRes = await fetch(
    `https://${regionZone}.api.riotgames.com/lol/match/v5/matches/by-puuid/${
      summonerResponse.puuid
    }/ids?start=${start()}&count=${count()}${queueParam}`,
    {
      headers: {
        'X-Riot-Token': RIOT_TOKEN,
      },
    },
  )

  const matchesResponse = await matchesRes.json()
  // console.log(matchesResponse)

  if (!matchesRes.ok) {
    throw matchesResponse.status
  }
  const matchesInfo = await Promise.all(
    matchesResponse.map((match: string) => {
      return fetch(
        `https://${regionZone}.api.riotgames.com/lol/match/v5/matches/${match}`,
        {
          headers: {
            'X-Riot-Token': RIOT_TOKEN,
          },
        },
      ).then(async (res) => {
        const { status, info } = await res.json()
        if (!res.ok) {
          throw status
        }
        return info
      })
    }),
  )
  const finalResponse = await Promise.all(
    matchesInfo.map(async ({ participants }) => {
      const playerIndex = participants.findIndex(
        ({ puuid }) => puuid === summonerResponse.puuid,
      )
      if (!participants[playerIndex]) return { error: 'Game info not found.' }
      return {
        champion: participants[playerIndex].championName,
        win: participants[playerIndex].win ? 'WIN' : 'LOSS',
        kda: participants[playerIndex].kda,
        kills: participants[playerIndex].kills,
        assists: participants[playerIndex].assists,
        cs_per_minute: +(
          (participants[playerIndex]?.totalMinionsKilled +
            participants[playerIndex].challenges?.alliedJungleMonsterKills +
            participants[playerIndex].challenges?.enemyJungleMonsterKills) /
          (participants[playerIndex].timePlayed / 60)
        ).toFixed(1),
        //TODO: runes,
        control_ward: participants[playerIndex].visionWardsBoughtInGame,
        wards_placed: participants[playerIndex].wardsPlaced,
        wards_killed: participants[playerIndex].wardsKilled,
        items: itemsArray([
          participants[playerIndex].item0,
          participants[playerIndex].item1,
          participants[playerIndex].item2,
          participants[playerIndex].item3,
          participants[playerIndex].item4,
          participants[playerIndex].item5,
          participants[playerIndex].item6,
        ]),
        spells: await spellsArray(participants[playerIndex].championName),
        runes: runesArray(participants[playerIndex].perks.styles),
      }
    }),
  )

  return finalResponse
}
