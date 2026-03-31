import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://dummyjson.com';

  loading = signal(false);
  error = signal<string | null>(null);

  getAll(): Observable<Product[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<{ products: any[] }>(`${this.apiUrl}/products?limit=0`).pipe(
      map(res => res.products.map(p => this.normalize(p))),
      tap(() => this.loading.set(false)),
      catchError(err => {
        this.loading.set(false);
        this.error.set('Impossible de charger les produits');
        return throwError(() => err);
      })
    );
  }

  getById(id: number): Observable<Product> {
    this.loading.set(true);
    return this.http.get<any>(`${this.apiUrl}/products/${id}`).pipe(
      map(p => this.normalize(p)),
      tap(() => this.loading.set(false)),
      catchError(err => {
        this.loading.set(false);
        this.error.set('Produit introuvable');
        return throwError(() => err);
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/products/categories`)
      .pipe(map((cats) => cats.map((c) => (typeof c === 'string' ? c : c.slug))));
  }

  getByCategory(category: string): Observable<Product[]> {
    this.loading.set(true);
    return this.http.get<{ products: any[] }>(
      `${this.apiUrl}/products/category/${category}`
    ).pipe(
      map(res => res.products.map(p => this.normalize(p))),
      tap(() => this.loading.set(false)),
      catchError(err => {
        this.loading.set(false);
        this.error.set('Erreur de chargement');
        return throwError(() => err);
      })
    );
  }

  private normalize(p: any): Product {
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category,
      image: p.thumbnail,
      rating: {
        rate: p.rating,      // dummyjson rating is a number → goes into rate
        count: p.stock ?? 0  // dummyjson stock → goes into count
      }
    };
  }
}
