import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { ToastService } from '../../services/toast';
import { Product } from '../../models/product';
import { CurrencyMADPipe } from '../../pipes/currency-mad-pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CurrencyMADPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);

  product = signal<Product | null>(null);
  loading = signal(true);
  selectedQuantity = signal(1);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.router.navigate(['/products']);
      return;
    }
    this.productService.getById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/products']);
      }
    });
  }

  get isInCart(): boolean {
    const p = this.product();
    return p ? this.cartService.isInCart(p.id) : false;
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    for (let i = 0; i < this.selectedQuantity(); i++) {
      this.cartService.addToCart(p);
    }
    this.toast.success(
      `${this.selectedQuantity()}x "${p.title}" ajouté(s) au panier !`
    );
  }

  increment(): void {
    if (this.selectedQuantity() < 10) {
      this.selectedQuantity.update(q => q + 1);
    }
  }

  decrement(): void {
    if (this.selectedQuantity() > 1) {
      this.selectedQuantity.update(q => q - 1);
    }
  }

  getStars(rate: number): string {
    const full = Math.floor(rate);
    const half = rate % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }
}
