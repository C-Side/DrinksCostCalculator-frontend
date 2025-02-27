export interface Drink {
  id?: number
  name: string
  price: number
  resourceUrl?: string
  drinkCategory: string
}

export interface DrinkCategory {
  id?: number
  category: string
  alcoholic: boolean
  resourceUrl?: string
}
