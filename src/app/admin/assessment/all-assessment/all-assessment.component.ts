import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormControl, Validators, FormBuilder} from '@angular/forms';
import { ApexService } from '../../../services/apex.service';

@Component({
  selector: 'app-all-assessment',
  templateUrl: './all-assessment.component.html',
  styleUrls: ['./all-assessment.component.scss']
})
export class AllAssessmentComponent implements OnInit {

  displayedColumns: string[] = ['name', 'createdDate', 'action'];
  assessments = [];
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
  constructor(private adminService: AdminService, private snackBar: MatSnackBar, private fb: FormBuilder,
              private apexService: ApexService) { }

  ngOnInit() {
    this.allAssessments();
  }

  async allAssessments() {
    try {
      const assessments = await this.adminService.allAssessments().toPromise();
      if (assessments['status'] == 200) {
        this.assessments = [...assessments['body']];
        this.dataSource.data = this.assessments;
        this.dataSource.paginator = this.paginator;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // this.apexService.showLoader(false);
    }
  }

  async deleteAssessment() {
    this.notValidText = false;
    if (this.isConfirm.value === 'DELETE' && this.deleteId) {
      try {
        const done = await this.adminService.deleteAssessment(this.deleteId).toPromise();
        if (done['status'] == 200) {
          this.showDelete = false;
          this.deleteId = null;
          this.closeDeleteView();
          await this.allAssessments();
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