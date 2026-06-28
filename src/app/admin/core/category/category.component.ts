import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { error } from 'jquery';

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit, AfterViewInit {
  isLoading: boolean = false;
  categoryList: any[] = [];
  // Track selected category ID for editing
  selectedCategoryId: number | null = null;
  constructor(
    public service: CategoryService,
    private toastr: ToastrService,
    private el: ElementRef
  ) { }
  ngOnInit(): void {
    this.fetchcategoryList();
  }
  ngAfterViewInit(): void {

  }


  // Fetch category List
  fetchcategoryList() {
    this.isLoading = true;
    this.service.getCategories().subscribe({
      next: (res: any) => {
        this.categoryList = res;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }




  //getCategoryId
  getCategoryId(ID: number) {
    this.isLoading = true;
    this.selectedCategoryId = ID;

    this.service.getCategoryById(ID).subscribe({
      next: (res: any) => {

        this.service.categoryModel = {
          id: res.id ?? 0,
          categoryId: res.categoryId ?? 0,
          categoryName: res.categoryName ?? '',
          description: res.description ?? '',
          isActive: res.isActive ?? true,
          createdDate: res.createdDate ? res.createdDate.split('T')[0] : ''
        };


        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }


  // 1. Separate Validation Function
  validateForm(): boolean {
    const model = this.service.categoryModel;

    if (!model.categoryName || model.categoryName.trim() === '') {
      this.toastr.error('Category Name is required.');
      return false;
    }
    if (!model.description || model.description.trim() === '') {
      this.toastr.error('Description is required.');
      return false;
    }
    if (model.isActive === null || model.isActive === undefined || (model.isActive as any) === '') {
      this.toastr.error('Please select if the category is active.');
      return false;
    }

    return true;
  }

  saveCategory() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    let payload = {
      id: this.service.categoryModel.id,
      categoryName: this.service.categoryModel.categoryName,
      description: this.service.categoryModel.description,
      isActive: this.service.categoryModel.isActive,
      createdDate: new Date()
    };

    if (this.service.categoryModel.id === 0) {
      this.service.postCategory(payload).subscribe({
        next: (res: any) => {
          this.toastr.success('Category added successfully');
          this.fetchcategoryList();
          this.reset();
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      if (this.selectedCategoryId) {
        this.service.updateCategory(this.selectedCategoryId, payload).subscribe({
          next: (res: any) => {
            this.toastr.success('update category successfully');
            this.fetchcategoryList();
            this.reset();
            this.isLoading = false;
          },
          error: (err: any) => {
            console.error(err);
            this.isLoading = false;
          }
        });
      }

    }
  }

  //deleteCategory
  deleteCategory(ID: number) {
    if (!confirm('Are you sure you want to delete this Category ?')) return;

    this.isLoading = true;
    this.service.deleteCategory(ID).subscribe({
      next: (res: any) => {
        this.toastr.success('Item removed from Category');
        this.fetchcategoryList();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  reset() {
    this.service.categoryModel = {
      id: 0,
      categoryId: 0,
      categoryName: '',
      description: '',
      isActive: true,
      createdDate: new Date()
    };
  }


}
