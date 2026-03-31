import { Component, input, inject } from '@angular/core';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/cart';
import { CurrencyMADPipe } from '../../pipes/currency-mad-pipe';
import { TruncatePipe } from '../../pipes/truncate-pipe';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyMADPipe, TruncatePipe],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css'
})
export class CartItemComponent {
  item = input.required<CartItem>();
  private cartService = inject(CartService);

  onIncrement(): void {
    this.cartService.incrementQuantity(this.item().product.id);
  }

  onDecrement(): void {
    this.cartService.decrementQuantity(this.item().product.id);
  }

  onRemove(): void {
    this.cartService.removeFromCart(this.item().product.id);
  }

  get subtotal(): number {
    return this.item().product.price * this.item().quantity;
  }
}
