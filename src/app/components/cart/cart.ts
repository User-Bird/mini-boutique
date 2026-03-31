import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { CartItemComponent } from '../cart-item/cart-item';
import { CurrencyMADPipe } from '../../pipes/currency-mad-pipe';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CartItemComponent, CurrencyMADPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  cartService = inject(CartService);
  private toast = inject(ToastService);

  onClearCart(): void {
    if (confirm('Vider tout le panier ?')) {
      this.cartService.clearCart();
      this.toast.info('Panier vidé');
    }
  }
}
