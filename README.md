# Mini Boutique

### 0. Changes to the tp code


-- 1/7 :
  in : product.ts
  this :"```import { Observable, tap, catchError, throwError } from 'rxjs';```"
  changed to:"```import { Observable, tap, catchError, throwError, map } from 'rxjs';```"

-- 2/7 :
  in : product.ts
  this :"```private apiUrl = 'https://fakestoreapi.com';```"
  changed to:"```private apiUrl = 'https://dummyjson.com';```"

--3/7 : (Fetching All Products (getAll))
  in : product.ts
  this :"```return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(...)```"
  changed to :"```
            return this.http.get<{ products: any[] }>(`${this.apiUrl}/products?limit=0`).pipe(
              map(res => res.products.map(p => this.normalize(p))),
              ...```"
              
--4/7 : (Fetching by Category (getByCategory)) "THIS IS NEVER USED BTW??"
  in : product.ts
  this :"```return this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}`).pipe(...)```"
  changed to :"```
            return this.http.get<{ products: any[] }>(`${this.apiUrl}/products/category/${category}`).pipe(
            map(res => res.products.map(p => this.normalize(p))),
            ...```"

--5/7 : (Fetching Categories (getCategories))
  in : product.ts
  this :"```return this.http.get<string[]>(`${this.apiUrl}/products/categories`);```"
  changed to :"```
            return this.http.get<any[]>(`${this.apiUrl}/products/categories`).pipe(
            map(cats => cats.map(c => typeof c === 'string' ? c : c.slug))
          );```"
          
--6/7 : (Added Normalizer to dummyjson)
  in : product.ts
  at the buttom :"```
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
          }```"

--7/7 : (Fetching a Single Product (getById))
  in : product.ts
  add this line :"```map(p => this.normalize(p)),```"
  here :"```
        getById(id: number): Observable<Product> {
        // ...
        return this.http.get<any>(`${this.apiUrl}/products/${id}`).pipe(
          map(p => this.normalize(p)), // <-- ADDED HERE
          tap(() => this.loading.set(false)),
          // ...
        );
      }```"


- 
### 1. Prérequis
- Node.js & npm installés.
- Angular CLI installé globalement (`npm install -g @angular/cli`).

### 2. Installation
```bash
# Clone projet
git clone https://github.com/User-Bird/Mini-Boutique.git
cd Mini-Boutique

# Installer les dépendances (node_modules)
npm install

# to run it 
ng serve --host 127.0.0.1 --open
