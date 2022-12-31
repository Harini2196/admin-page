import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AdminService } from '../../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApexService } from '../../../services/apex.service';
import {FormControl, Validators, FormBuilder} from '@angular/forms';
@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'startedDate', 'action', 'activate'];
  users = [];
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
  constructor(private adminService: AdminService, private snackBar: MatSnackBar,
              private apexService: ApexService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.allUsers();
  }

  async allUsers() {
    try {
      const users = await this.adminService.allUsers().toPromise();
      if (users['status'] == 200) {
        this.users = [...users['body']];
        this.dataSource.data = this.users;
        this.dataSource.paginator = this.paginator;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // this.apexService.showLoader(false);
    }
  }
  async deleteUser() {
    this.notValidText = false;
    if (this.isConfirm.value === 'DELETE' && this.deleteId) {
      try {
        const done = await this.adminService.deleteUser(this.deleteId).toPromise();
        if (done['status'] == 200) {
          this.showDelete = false;
          this.deleteId = null;
          this.closeDeleteView();
          await this.allUsers();
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
  async edit(isActive, userId) {
    try {
      const user = await this.adminService.updateUser({isActive, userId}).toPromise();
      if (user['status'] == 200) {
        this.snackBar.open('Successfully Updated', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'snackBar',
          duration: 3000
        });
      }
    } catch (error) {
    } finally {
      this.apexService.showLoader(false);
    }
  }
  closeDeleteView() {
    this.isConfirm.reset();
    this.createDeleteView = false;
  }
}
