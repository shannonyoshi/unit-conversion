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

export interface Unit {
  name: string,
  normalizedU: string,
  conversion: number,
  output:string,
  type: string,
  singular: string
}