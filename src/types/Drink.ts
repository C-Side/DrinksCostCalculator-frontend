export interface Drink {
  id?: number
  name: string
  price: number
  drinkCategory: DrinkCategory
}

export interface DrinkCategory {
  id?: number
  category: string
  alcoholic: boolean
  _links: {
    self: {
      href: string
    }
  }
}
