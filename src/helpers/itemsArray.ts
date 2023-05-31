import { itemsJSON } from 'src/consts/items_v_13_10_1'

export const itemsArray = (itemArray) => {
  return itemArray.map((item: number) => {
    return {
      name: itemsJSON.data[item]?.name || 'NO ITEM',
      asset:
        item !== 0
          ? `https://ddragon.leagueoflegends.com/cdn/13.10.1/img/item/${item}.png`
          : 'NO ASSET',
    }
  })
}
