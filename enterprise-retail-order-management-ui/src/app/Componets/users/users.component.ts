import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  User,
  UserService
} from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Search and filters
  search = '';
  selectedRole = '';
  selectedStatus = '';

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalCount = 0;

  // Edit modal
  showEditModal = false;
  selectedUser: User | null = null;

  showDeactivateModal = false;
  selectedUserForDeactivate: User | null = null;

  editForm!: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.editForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      phoneNumber: [
        '',
        Validators.maxLength(20)
      ],

      address: [
        '',
        Validators.maxLength(250)
      ]
    });

    this.loadUsers();
  }

  // GET USERS
  loadUsers(): void {

    this.isLoading = true;
    this.errorMessage = '';

    let isActive: boolean | undefined;

    if (this.selectedStatus === 'active') {
      isActive = true;
    }

    if (this.selectedStatus === 'inactive') {
      isActive = false;
    }

    this.userService.getUsers(
      this.currentPage,
      this.pageSize,
      this.search,
      this.selectedRole,
      isActive
    ).subscribe({

      next: (response) => {

        console.log('USERS API RESPONSE:', response);

        this.users = response.data;
        this.totalCount = response.totalCount;

        this.isLoading = false;
      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          'Unable to load users.';

        this.isLoading = false;
      }

    });
  }

  // SEARCH
  searchUsers(): void {

    this.currentPage = 1;

    this.loadUsers();
  }

  // FILTER
  filterUsers(): void {

    this.currentPage = 1;

    this.loadUsers();
  }

  // CLEAR FILTERS
  clearFilters(): void {

    this.search = '';
    this.selectedRole = '';
    this.selectedStatus = '';

    this.currentPage = 1;

    this.loadUsers();
  }

  // OPEN EDIT
  editUser(user: User): void {

    this.selectedUser = user;

    this.editForm.patchValue({
      fullName: user.fullName,
      phoneNumber: user.phoneNumber || '',
      address: user.address || ''
    });

    this.showEditModal = true;
  }

  // CLOSE EDIT
  closeEditModal(): void {

    this.showEditModal = false;
    this.selectedUser = null;
  }

  // UPDATE USER
  updateUser(): void {

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    if (!this.selectedUser) {
      return;
    }

    const request = {
      fullName: this.editForm.value.fullName,
      phoneNumber: this.editForm.value.phoneNumber,
      address: this.editForm.value.address
    };

    this.userService.updateUser(
      this.selectedUser.userId,
      request
    ).subscribe({

      next: () => {

        this.closeEditModal();

        this.successMessage = 'User updated successfully!';

        this.loadUsers();

        setTimeout(() => {
          this.successMessage = '';
        }, 4000);
      },

      error: (error) => {

        console.error(error);

        this.errorMessage = 'Unable to update user.';
      }

    });
  }

  // DEACTIVATE USER
  // OPEN DEACTIVATE MODAL
  openDeactivateModal(user: User): void {

    this.selectedUserForDeactivate = user;
    this.showDeactivateModal = true;
  }

  // CLOSE DEACTIVATE MODAL
  closeDeactivateModal(): void {

    this.selectedUserForDeactivate = null;
    this.showDeactivateModal = false;
  }

  // CONFIRM DEACTIVATE
  confirmDeactivate(): void {

    if (!this.selectedUserForDeactivate) {
      return;
    }

    const userId =
      this.selectedUserForDeactivate.userId;

    this.userService
      .deactivateUser(userId)
      .subscribe({

        next: () => {

          this.closeDeactivateModal();

          this.successMessage =
            'User deactivated successfully!';

          this.loadUsers();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },

        error: (error) => {

          console.error(error);

          this.closeDeactivateModal();

          this.errorMessage =
            'Unable to deactivate user.';
        }

      });
  }

  // PAGINATION
  get totalPages(): number {

    return Math.ceil(
      this.totalCount / this.pageSize
    );
  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.loadUsers();
    }
  }

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.loadUsers();
    }
  }

  goToPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {

      this.currentPage = page;

      this.loadUsers();
    }
  }

  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
