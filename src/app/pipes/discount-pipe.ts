// src/app/pipes/discount.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'discount', standalone: true })
export class DiscountPipe implements PipeTransform {
  transform(price: number, percentage: number): number {
    if (!price || !percentage) return price;
    return price * (1 - percentage / 100);
  }
}
