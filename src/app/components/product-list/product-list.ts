import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { ProductCardComponent } from '../product-card/product-card';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('all');
  searchTerm = signal('');
  loading = this.productService.loading;
  error = this.productService.error;

  filteredProducts = computed(() => {
    let result = this.products();

    const cat = this.selectedCategory();
    if (cat !== 'all') {
      result = result.filter(p => p.category === cat);
    }

    const term = this.searchTerm().toLowerCase().trim();
    if (term) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    return result;
  });

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => this.products.set(data)
    });
    this.productService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats)
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }
}
