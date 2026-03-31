import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart';
import { ToastService } from '../../services/toast';
import { CurrencyMADPipe } from '../../pipes/currency-mad-pipe';
import { TruncatePipe } from '../../pipes/truncate-pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyMADPipe, TruncatePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent {
  product = input.required<Product>();

  private cartService = inject(CartService);
  private toast = inject(ToastService);

  get isInCart(): boolean {
    return this.cartService.isInCart(this.product().id);
  }

  onAddToCart(): void {
    this.cartService.addToCart(this.product());
    this.toast.success(`"${this.product().title}" ajouté au panier !`);
  }

  getStars(rate: number): string {
    const full = Math.floor(rate);
    const half = rate % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }
}
