import { Component, ChangeDetectorRef } from '@angular/core';
import { ApexService } from './services/apex.service';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ad';
  showLoader: any = true;
  constructor(private apexService: ApexService,
              private router: Router,
    private cdRef: ChangeDetectorRef) {
    this.apexService.showLoader(false);
  }
  ngOnInit() {
    this.apexService.loaderEventValue.subscribe(data => {
      if (data !== this.showLoader) {
        this.showLoader = data;
      }
    });
    this.cdRef.detectChanges();
    this.onDetectRoute();
  }
  onDetectRoute() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof RouteConfigLoadStart) {
        this.showLoader = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.showLoader = false;
      }
      window.scrollTo(0, 0);
    });
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
