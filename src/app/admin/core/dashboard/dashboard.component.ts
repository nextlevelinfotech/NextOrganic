import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CanvasJSAngularChartsModule, NgbAccordionModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements AfterViewInit {
  //employee chart
  employeeChartOptions = {
    animationEnabled: true,
    title: {
      text: 'Employee By Gender',
      fontSize: 13,
      fontFamily: 'Quicksand, serif',
      fontWeight: 600,
      color: '#2B3234',
    },
    data: [
      {
        type: 'doughnut',
        indexLabelFontFamily: 'Quicksand, serif', // ✅ Index labels
        yValueFormatString: "#,###.##'%'",
        legendFontFamily: 'Quicksand, serif', // ✅ Legend font
        indexLabel: '{name}',
        dataPoints: [
          { y: 28, name: 'Male' },
          { y: 10, name: 'Female' },
          { y: 20, name: 'Others' },
        ],
      },
    ],
  };

  //notice chart
  noticeChartOptions = {
    animationEnabled: true,
    title: {
      text: 'Employee By Department',
      paddingTop: 12,
      fontSize: 13,
      fontFamily: 'Quicksand, serif',
      fontWeight: 600,
      color: '#2B3234',
    },
    axisY: {
      title: 'Employee',
      valueFormatString: '#0,,.',
      suffix: 'K',
    },

    data: [
      {
        type: 'splineArea',
        color: 'rgba(246,122,34,.4)',
        indexLabelFontFamily: 'Quicksand, serif',
        legendFontFamily: 'Quicksand, serif',
        xValueFormatString: 'YYYY',
        dataPoints: [
          { x: new Date(2012, 0), y: 7289000, color: '#F58730' },
          { x: new Date(2013, 0), y: 4830000, color: '#F58730' },
          { x: new Date(2014, 0), y: 2009000, color: '#F58730' },
          { x: new Date(2015, 0), y: 2840000, color: '#F58730' },
          { x: new Date(2016, 0), y: 2396000, color: '#F58730' },
          { x: new Date(2017, 0), y: 1613000, color: '#F58730' },
          { x: new Date(2018, 0), y: 2821000, color: '#F58730' },
          { x: new Date(2019, 0), y: 2000000, color: '#F58730' },
          { x: new Date(2020, 0), y: 1397000, color: '#F58730' },
        ],
      },
    ],
  };

  ngAfterViewInit(): void {}
}
