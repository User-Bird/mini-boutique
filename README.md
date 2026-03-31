# Mini Boutique

### 0. Changes to the tp code
all these changes happened in "product.ts"

------------------------------------------- 1/7 :
  <br>this :
```typescript
import { Observable, tap, catchError, throwError } from 'rxjs';
```
changed to:
```typescript
import { Observable, tap, catchError, throwError, map } from 'rxjs';
```


------------------------------------------- 2/7 :
  <br>this :
```typescript
private apiUrl = '[https://fakestoreapi.com](https://fakestoreapi.com)';
```
  changed to:
```typescript
private apiUrl = '[https://dummyjson.com](https://dummyjson.com)';
```


------------------------------------------- 3/7 : (Fetching All Products (getAll))
  <br>this :
```typescript
return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(...)
```
  changed to :
```typescript
return this.http.get<{ products: any[] }>(`${this.apiUrl}/products?limit=0`).pipe(
  map(res => res.products.map(p => this.normalize(p))),
  ...
```
              

------------------------------------------- 4/7 : (Fetching by Category (getByCategory)) "THIS IS NEVER USED BTW??"
  <br>this :
```typescript
return this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}`).pipe(...)
```
  changed to :
```typescript
return this.http.get<{ products: any[] }>(`${this.apiUrl}/products/category/${category}`).pipe(
  map(res => res.products.map(p => this.normalize(p))),
  ...
```


------------------------------------------- 5/7 : (Fetching Categories (getCategories))
  <br>this :
```typescript
return this.http.get<string[]>(`${this.apiUrl}/products/categories`);
```
  changed to :
```typescript
return this.http.get<any[]>(`${this.apiUrl}/products/categories`).pipe(
  map(cats => cats.map(c => typeof c === 'string' ? c : c.slug))
);
```
          

------------------------------------------- 6/7 : (Added Normalizer to dummyjson)
  <br>at the buttom :
```typescript
private normalize(p: any): Product {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.thumbnail, // DummyJSON uses 'thumbnail' instead of 'image'
    rating: {
      rate: p.rating,   // DummyJSON rating is just a number
      count: p.stock ?? 0 // DummyJSON doesn't have review counts, so we use stock
    }
  };
}
```


------------------------------------------- 7/7 : (Fetching a Single Product (getById))
  <br>add this line :
```typescript
map(p => this.normalize(p)),
```
  here :
```typescript
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
```


### 1. Prérequis
- Node.js & npm installés.
- Angular CLI installé globalement (`npm install -g @angular/cli`).

### 2. Installation
```bash
# Clone projet
git clone [https://github.com/User-Bird/Mini-Boutique.git](https://github.com/User-Bird/Mini-Boutique.git)
cd Mini-Boutique

# Installer les dépendances (node_modules)
npm install
```
