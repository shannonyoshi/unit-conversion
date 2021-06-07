// Charts

export type Filter = "All" | "Standard" | "Metric" | "Weight" | "Volume" | "Custom"


export interface IngrInput {
  name:string,
  amount:string,
  currentUnit: string,
  targetUnit:string,
}

export interface Fraction {
  fraction:string,
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
  output:Output,
  type: UnitType,
  singular: string
}