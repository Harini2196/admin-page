import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../../services/admin.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormControl, Validators, FormBuilder} from '@angular/forms';
import { ApexService } from '../../../services/apex.service';

@Component({
  selector: 'app-all-course',
  templateUrl: './all-course.component.html',
  styleUrls: ['./all-course.component.scss']
})
export class AllCourseComponent implements OnInit {

  displayedColumns: string[] = ['title', 'price', 'action'];
  courses = [];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  notValidText: boolean;
  showDelete: boolean;
  createDeleteView: boolean;
  isConfirm: FormControl = this.fb.control(null, Validators.required);
  deleteId: any;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }
  constructor(private adminService: AdminService, private snackBar: MatSnackBar, private fb: FormBuilder, 
              private apexService: ApexService) { }

  ngOnInit() {
    this.allCourses();
  }

  async allCourses() {
    try {
      const courses = await this.adminService.allCourses().toPromise();
      if (courses['status'] == 200) {
        this.courses = [...courses['body']];
        this.dataSource.data = this.courses;
        this.dataSource.paginator = this.paginator;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // this.apexService.showLoader(false);
    }
  }

  async deleteCourse() {
    this.notValidText = false;
    if (this.isConfirm.value === 'DELETE' && this.deleteId) {
      try {
        const done = await this.adminService.deleteCourse(this.deleteId).toPromise();
        if (done['status'] == 200) {
          this.showDelete = false;
          this.deleteId = null;
          this.closeDeleteView();
          await this.allCourses();
          this.snackBar.open('Successfully deleted', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'snackBar',
            duration: 3000
          });
        }
      } catch (error) {
        console.log(error);
        this.apexService.showLoader(false);
        this.snackBar.open('Failed to delete', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'snackBar',
          duration: 3000
        });
      }
    } else {
      this.isConfirm.markAsTouched();
      this.notValidText = true;
    }
  }
  closeDeleteView() {
    this.isConfirm.reset();
    this.createDeleteView = false;
  }
}
