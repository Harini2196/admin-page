import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexService } from '../../../services/apex.service';
import { AdminService } from '../../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {FormControl, Validators, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-all-instructors',
  templateUrl: './all-instructors.component.html',
  styleUrls: ['./all-instructors.component.scss']
})
export class AllInstructorsComponent implements OnInit {

  constructor(private apexService: ApexService, private adminService: AdminService, private snackBar: MatSnackBar, 
              private fb: FormBuilder) { }
  instructors = [];
  displayedColumns: string[] = ['username', 'email', 'action'];
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
  }
  ngOnInit() {
    this.allInstructors();
  }
  async allInstructors() {
    try {
      const instructors = await this.adminService.allInstructors().toPromise();
      if (instructors['status'] == 200) {
        this.instructors = [...instructors['body']];
        this.dataSource.data = this.instructors;
        this.dataSource.paginator = this.paginator;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // this.apexService.showLoader(false);
    }
  }

  async deleteInstructor() {
    this.notValidText = false;
    if (this.isConfirm.value === 'DELETE' && this.deleteId) {
      try {
        const done = await this.adminService.deleteInstructor(this.deleteId).toPromise();
        if(done['status'] == 200) {
          this.showDelete = false;
          this.deleteId = null;
          this.closeDeleteView();
          await this.allInstructors();
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
