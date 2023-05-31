import { RUNES } from 'src/consts/runes'

export const runesArray = (styles) => {
  return styles.map(({ description, selections, style }) => {
    const [{ name, slots }] = RUNES.filter(({ id }) => id === style)
    // const test = slots.map(({ runes }) =>
    //   runes.map(({ id, name }) => {
    //     return {
    //       id,
    //       name,
    //     }
    //   }),
    // )

    const test = selections.map(({ perk }, index) => {
      const hola = slots[index].runes.find(({ id }) => id === perk)
      console.log(hola)
      return { description, name: hola?.name }
    })
    // console.log(test)
    // const ya = selections.map(({ perk }) => {
    //   return test.find((test1) => {
    //     return test1.map(({ id }) => id === perk)
    //   })
    // })

    // console.log(test)

    const runeName = slots.find(({ runes }) => {
      runes.map(({ id }) => {})
    })

    // console.log(runeName)
    return {
      description,
      style: name,
      selection: selections.map(({ perk }) => {
        return { name: 'a' }
      }),
    }
  })
}
