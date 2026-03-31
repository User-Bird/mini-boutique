import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product';    // ← fix
import { CartItem } from '../models/cart-item'; // ← fix

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly itemCount = computed(() =>
    this._items().reduce((total, item) => total + item.quantity, 0)
  );
  readonly totalPrice = computed(() =>
    this._items().reduce(
      (total, item) => total + item.product.price * item.quantity, 0
    )
  );
  readonly isEmpty = computed(() => this._items().length === 0);
  readonly uniqueProductCount = computed(() => this._items().length);

  constructor() {
    this.loadFromStorage();
    effect(() => {
      const items = this._items();
      localStorage.setItem('shop-cart', JSON.stringify(items));
    });
  }

  addToCart(product: Product): void {
    this._items.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(productId: number): void {
    this._items.update(items =>
      items.filter(i => i.product.id !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this._items.update(items =>
      items.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }

  incrementQuantity(productId: number): void {
    this._items.update(items =>
      items.map(i =>
        i.product.id === productId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  }

  decrementQuantity(productId: number): void {
    const item = this._items().find(i => i.product.id === productId);
    if (item && item.quantity <= 1) {
      this.removeFromCart(productId);
    } else {
      this._items.update(items =>
        items.map(i =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
      );
    }
  }

  clearCart(): void {
    this._items.set([]);
  }

  isInCart(productId: number): boolean {
    return this._items().some(i => i.product.id === productId);
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('shop-cart');
      if (data) {
        this._items.set(JSON.parse(data));
      }
    } catch {
      this._items.set([]);
    }
  }
}
