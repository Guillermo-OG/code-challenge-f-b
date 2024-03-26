export interface DataValidator {
  validateRow(row: any): { isValid: boolean; reasons?: string[] };
}
