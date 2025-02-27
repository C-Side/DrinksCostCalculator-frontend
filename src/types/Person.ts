import type { Drink } from '@/types/Drink.ts'

export interface Person {
  id?: number
  name: string
  age: number
  role: string
  resourceUrl?: string
  drinksConsumedByPersonResourceUrl: string
  drinksConsumedByPerson?: Drink[]
}
