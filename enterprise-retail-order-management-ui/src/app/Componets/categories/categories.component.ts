import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Category,
  CategoryService
} from '../../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  search = '';
  selectedStatus = '';

  currentPage = 1;
  pageSize = 10;
  totalCount = 0;

  showAddModal = false;
  addForm!: FormGroup;

  showEditModal = false;
  selectedCategory: Category | null = null;
  editForm!: FormGroup;

  showDeactivateModal = false;
  selectedCategoryForDeactivate: Category | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.addForm = this.fb.group({
      categoryName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        Validators.maxLength(250)
      ]
    });

    this.loadCategories();

    this.editForm = this.fb.group({
      categoryName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        Validators.maxLength(250)
      ]
    });

  }

  loadCategories(): void {

    this.isLoading = true;
    this.errorMessage = '';

    let isActive: boolean | undefined;

    if (this.selectedStatus === 'active') {
      isActive = true;
    }

    if (this.selectedStatus === 'inactive') {
      isActive = false;
    }

    this.categoryService.getCategories(
      this.currentPage,
      this.pageSize,
      this.search,
      isActive
    ).subscribe({

      next: (response) => {

        console.log(
          'CATEGORIES API RESPONSE:',
          response
        );

        this.categories = response.data;
        this.totalCount = response.totalCount;

        this.isLoading = false;
      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          'Unable to load categories.';

        this.isLoading = false;
      }

    });
  }

  searchCategories(): void {
    this.currentPage = 1;
    this.loadCategories();
  }

  filterCategories(): void {
    this.currentPage = 1;
    this.loadCategories();
  }

  clearFilters(): void {

    this.search = '';
    this.selectedStatus = '';
    this.currentPage = 1;

    this.loadCategories();
  }

  get totalPages(): number {
    return Math.ceil(
      this.totalCount / this.pageSize
    );
  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCategories();
    }
  }

  previousPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCategories();
    }
  }

  goToPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {
      this.currentPage = page;
      this.loadCategories();
    }
  }

  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }

  openAddModal(): void {

    this.addForm.reset();

    this.showAddModal = true;
  }

  closeAddModal(): void {

    this.showAddModal = false;

    this.addForm.reset();
  }

  createCategory(): void {

    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const request = {
      categoryName: this.addForm.value.categoryName,
      description: this.addForm.value.description
    };

    this.categoryService
      .createCategory(request)
      .subscribe({

        next: () => {

          this.closeAddModal();

          this.successMessage =
            'Category created successfully!';

          this.currentPage = 1;

          this.loadCategories();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error.error ||
            'Unable to create category.';

          setTimeout(() => {
            this.errorMessage = '';
          }, 4000);
        }

      });
  }

  openEditModal(category: Category): void {

    this.selectedCategory = category;

    this.editForm.patchValue({
      categoryName: category.categoryName,
      description: category.description || ''
    });

    this.showEditModal = true;
  }

  closeEditModal(): void {

    this.showEditModal = false;
    this.selectedCategory = null;
    this.editForm.reset();
  }

  updateCategory(): void {

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    if (!this.selectedCategory) {
      return;
    }

    const request = {
      categoryName: this.editForm.value.categoryName,
      description: this.editForm.value.description
    };

    this.categoryService
      .updateCategory(
        this.selectedCategory.categoryId,
        request
      )
      .subscribe({

        next: () => {

          this.closeEditModal();

          this.successMessage =
            'Category updated successfully!';

          this.loadCategories();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error.error ||
            'Unable to update category.';

          setTimeout(() => {
            this.errorMessage = '';
          }, 4000);
        }

      });
  }

  openDeactivateModal(category: Category): void {

    this.selectedCategoryForDeactivate = category;
    this.showDeactivateModal = true;
  }

  closeDeactivateModal(): void {

    this.selectedCategoryForDeactivate = null;
    this.showDeactivateModal = false;
  }

  confirmDeactivate(): void {

    if (!this.selectedCategoryForDeactivate) {
      return;
    }

    const categoryId =
      this.selectedCategoryForDeactivate.categoryId;

    this.categoryService
      .deactivateCategory(categoryId)
      .subscribe({

        next: () => {

          this.closeDeactivateModal();

          this.successMessage =
            'Category deactivated successfully!';

          this.loadCategories();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },

        error: (error) => {

          console.error(error);

          this.closeDeactivateModal();

          this.errorMessage =
            error.error ||
            'Unable to deactivate category.';

          setTimeout(() => {
            this.errorMessage = '';
          }, 4000);
        }

      });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
