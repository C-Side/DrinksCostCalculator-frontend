export interface Drink {
  id?: number
  name: string
  price: number
  drinkKind: DrinkKind
}

export interface DrinkKind {
  id?: number
  kind: string
  isAlcoholic: boolean
}
