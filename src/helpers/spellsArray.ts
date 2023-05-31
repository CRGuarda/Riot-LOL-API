export const spellsArray = async (championName: string) => {
  try {
    const championRes = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/13.10.1/data/en_US/champion/${championName}.json`,
    )
      .then((res) => res.json())
      .then(({ data }) => {
        const info = [
          ...data[championName].spells,
          { name: data[championName]?.passive.name },
        ]
        return info.map(({ name }) => name)
      })
    return championRes
  } catch (error) {
    return ['Fetch failed']
  }
}
