export interface Drink {
  id?: number
  name: string
  price: number
  resourceUrl?: string
  drinkCategoryResourceUrl: string
  drinkCategory?: DrinkCategory
}

export interface DrinkCategory {
  id?: number
  category: string
  alcoholic: boolean
  resourceUrl?: string
}
