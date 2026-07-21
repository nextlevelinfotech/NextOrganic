import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var $: any;
import 'select2';
import Swal from 'sweetalert2';
export class categoryModel {
  id: number = 0;
  categoryId: number = 0;
  categoryName: string = '';
  description: string = '';
  isActive: boolean = true;
  createdDate: any;
}

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
    const selectEl = $('#isActive');

    // Select2 Initialize गर्ने
    selectEl.select2();

    // Select2 मा भ्यालु चेन्ज हुँदा Angular Model अपडेट गर्ने
    // selectEl.on('change', (e: any) => {
    //   const val = $(e.target).val();


    //   if (val === 'true') this.service.categoryModel.isActive = true;
    //   else if (val === 'false') this.service.categoryModel.isActive = false;
    //   else this.service.categoryModel.isActive = null as any;
    // });
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

  // getCategoryId
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
          isActive: res.isActive,
          createdDate: res.createdDate ? res.createdDate.split('T')[0] : ''
        };

        // Select2 लाई String भ्यालु दिएर UI अपडेट गर्ने
        setTimeout(() => {
          const activeStatus = String(res.isActive); // 'true' or 'false'
          $('#isActive').val(activeStatus).trigger('change');
        }, 50);

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
    if ($('#isActive').val() === null || $('#isActive').val() === undefined || ($('#isActive').val() as any) === '') {
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
      isActive: $('#isActive').val() === 'true' ? true : false,
      createdDate: new Date().toISOString()
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

  // deleteCategory
  // deleteCategory(ID: number) {
  //   if (!confirm('Are you sure you want to delete this Category ?')) return;

  //   this.isLoading = true;
  //   this.service.deleteCategory(ID).subscribe({
  //     next: (res: any) => {
  //       this.toastr.success('Item removed from Category');
  //       this.fetchcategoryList();
  //       this.isLoading = false;
  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //       this.isLoading = false;
  //     }
  //   });
  // }


  deleteCategory(ID: number) {
    Swal.fire({
      title: 'Delete Product?',
      text: 'Are you sure you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {

      if (result.isConfirmed) {
        this.isLoading = true;

        this.service.deleteCategory(ID).subscribe({
          next: (res: any) => {
            this.toastr.success('Item removed from Product');
            this.fetchcategoryList();
            this.isLoading = false;
          },
          error: (err: any) => {
            console.error(err);
            this.toastr.error('Failed to delete product');
            this.isLoading = false;
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.error('Delete cancelled');
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
    // Reset गरेपछि Select2 UI लाई पनि 'true' (Default) मा फर्काउने
    setTimeout(() => {
      $('#isActive').val(' ').trigger('change.select2');
    }, 50);
  }
}