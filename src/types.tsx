// Charts

export type Filter = "All" | "Standard" | "Metric" | "Weight" | "Volume" | "Custom"


export interface IngrInput {
  name: string,
  amount: string,
  currentUnit: string,
  targetUnit: string,
}

export interface Fraction {
  fraction: string,
  decimal: number,
  common: boolean
}

type NormUnit = "mL" | "g"
type Output = "fraction" | "decimal"
type UnitType = "US" | "metric"

export interface Unit {
  name: string,
  normUnit: NormUnit,
  //conversion: mL/gram
  conversion: number,
  output: Output,
  type: UnitType,
  singular: string
}
// converted ingredient
export interface ConvIngr {
  amount: string,
  currentUnit: string,
  targetUnit: string
  ingredientName: string,
  convertedString: string,
}

export interface ErrorInt {
  Amount: string,
  "Ingredient Name": string,
  Conversion: string,
  General: string,
}
// used when sending into to backend
export interface ComplexIngr{
  ingredientName: string,
  currentAmount: number,
  currentUnit: string,
  altUnit: string,
  altAmount: number,
  targetUnit: string,
  targetConv: number
}
// get ingredient from backend in this format
export interface NewIngr {
  sourceAmount:number,
  sourceUnit:string,
  targetAmount:number,
  targetUnit:string
}