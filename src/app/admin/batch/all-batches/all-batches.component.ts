import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AdminService } from '../../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-all-batches',
  templateUrl: './all-batches.component.html',
  styleUrls: ['./all-batches.component.scss']
})
export class AllBatchesComponent implements OnInit {
  displayedColumns: string[] = ['title','createdDate', 'startedDate', 'studentsCount', 'timing', 'status', 'endDate', 'action'];
  courses = [];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(private adminService: AdminService, private snackBar: MatSnackBar, private fb: FormBuilder) { }

  ngOnInit() {
    this.allCourses();
  }

  async allCourses() {
    try {
      const courses = await this.adminService.allCourseBatches().toPromise();
      if (courses['status'] == 200) {
        this.courses = [...courses['body']];
        const newArray = this.courses.map(({title, ...course}) => course);
        this.dataSource.data = newArray;
        this.dataSource.paginator = this.paginator;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // this.apexService.showLoader(false);
    }
  }
}
