// Charts

export type Filter = "All" | "Standard" | "Metric" | "Weight" | "Volume" | "Custom"

// name here is a honeypot to catch bots, and should not be used for actual information
export interface IngrInput {
  name: string,
  currentAmount: string,
  currentUnit: string,
  targetUnit: string,
  ingredientName: string
}

export interface Fraction {
  string: string,
  decimal: number,
  common: boolean
}

type NormUnit = "mL" | "g"
type Output = "fraction" | "decimal"
type UnitType = "US" | "metric"

export type unitProperty = "name" | "normUnit" | "conversion" | "output" | "type" | "singular"

export interface Unit {
  name: string,
  normUnit: NormUnit,
  //conversion: mL/gram
  conversion: number,
  output: Output,
  type: UnitType,
  singular: string
  aka:string[]
}
// converted ingredient
export interface ConvIngr {
  currAmtStr: string,
  currentAmount: number,
  currentUnit: string,
  targetAmount?: number,
  targetUnit: string,
  ingredientName: string,
  convertedString: string,
}

// used when sending ingredient to backend 
// alt means normalized
export interface ComplexIngr {
  ingredientName: string,
  currentAmount: number,
  currentUnit: string,
  altUnit: string,
  altAmount: number,
  targetUnit: string,
  targetConv: number
}
// get ingredient from backend in this format
export interface AddedIngr {
  sourceAmount: number,
  sourceUnit: string,
  targetAmount: number,
  targetUnit: string
}

export interface Suggestion {
  id?: number,
  name: string,
  message: string,
  email: string,
  isError: boolean,
  createdAt?: Date
  viewedAt?: Date

}
// for sending to backend only on POST requests
export interface SugSubmit {
  name: string,
  message: string,
  email: string,
  isError: boolean
}

export type ErrorTypes = "Amount" | "Ingredient Name" | "Conversion" | "General" | "Server" | "Tolerance"
export interface Error {
  name: ErrorTypes,
  message: string
}

export interface Set {
  tolerance: number,
  toleranceType: string
}

export interface InputsList{
  name:string,
  string:string,
  valList: IngrInput[] //validated list
}

export type FormOptions = "individual" | "list";

