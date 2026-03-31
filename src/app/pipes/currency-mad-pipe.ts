// src/app/pipes/currency-mad.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyMAD', standalone: true })
export class CurrencyMADPipe implements PipeTransform {
  transform(value: number | undefined | null, rate: number = 10): string {
    if (value === null || value === undefined) return '0,00 MAD';
    const converted = value * rate;
    const formatted = converted.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${formatted} MAD`;
  }
}
