/**
 * Utilidades de validación general
 */
export class ValidatorUtil {
  static isNotEmpty(val: string): boolean {
    return val !== null && val !== undefined && val.trim() !== "";
  }

  static isValidEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
