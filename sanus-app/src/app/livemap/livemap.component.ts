import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, Input, SimpleChanges, NgZone } from '@angular/core';
import { Color, Project, Path, Point, Layer, Size, Rectangle, Event, Segment, Tool, PointText } from 'paper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ApiService } from './../_services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';

import * as paper from 'paper';
import { Tooltip } from 'chart.js';
import { defaultColors } from 'ng2-charts';
import { ThrowStmt } from '@angular/compiler';
import { VirtualTimeScheduler, Observable, interval, Subscription } from 'rxjs';
import { Employee } from '../model/employee';


@Component({
  selector: 'app-livemap',
  templateUrl: './livemap.component.html',
  styleUrls: ['./livemap.component.scss']
})
export class LivemapComponent implements OnInit {

  Room: string = "";
  showRoomCard: boolean = false;

  Employee:any = [];
  CurrentRoom:any;
  CurrentRoomPeopleList: any;
  LastLocations:any = [];

  //subscriptions
  subscriptionToLocations: Subscription;

  constructor(private apiService: ApiService, private _snackBar: MatSnackBar, private elementRef: ElementRef) {
    this.readEmployee();
    this.LastLocations = new Array();
    this.CurrentRoom = null;
    this.CurrentRoomPeopleList = new Array();
    
  }

  ngOnInit() {

    //interval task (auto refresh page every 30 secs)
    const source = interval(30000);
    this.subscriptionToLocations = source.subscribe(val => this.refreshMap());
    

    var project1 = new Project('cv1');
    var tool = new Tool();

    this.createDaycareLayout();

    var hitOptions = {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 5
    }

    // init some vars
    var path;

    tool.onMouseDown = (event) => {
      path = null;
      var hitResult = project1.hitTest(event.point, hitOptions);
      if(!hitResult) {
        return;
      }

      if(hitResult) {
        path = hitResult.item;

        this.Room = "Room " + path.data.nodeID;
        this.CurrentRoom = path.data.nodeID;
        this.CurrentRoomPeopleList = new Array();

        // loop through the last locations array to find anyone with the same node_id
        for (var person of this.LastLocations) {
          if(person.nodeID == this.CurrentRoom) {
            this.CurrentRoomPeopleList.push(person);
          }
        }

        this.showRoomCard = true;
       
      }
      
    }

    tool.onMouseMove = (event) => {
      project1.activeLayer.selected = false;
      if(event.item) {
        event.item.selected = true;
      }
    }


  }

  createDaycareLayout() {
    var point1 = new Point(300,100);
    var point2 = new Point(300,250);
    var point3 = new Point(450,250);
    var point4 = new Point(450,100);

    var point5 = new Point(450,400);

    var point6 = new Point(600,650);
    var point7 = new Point(750,600);

    var roomSize = new Size(150,150);
    var hallwaySize = new Size(150,400);

    var room1 = new Path.Rectangle(point1, roomSize);
    room1.strokeColor = new Color('green');
    room1.fillColor = new Color('white');
    room1.data.nodeID = "1";

    var room2 = new Path.Rectangle(point2, roomSize);
    room2.strokeColor = new Color('green');
    room2.fillColor = new Color('white');
    room2.data.nodeID = "2";

    var room3 = new Path.Rectangle(point3, roomSize);
    room3.strokeColor = new Color('green');
    room3.fillColor = new Color('white');
    room3.data.nodeID = "3";

    var room4 = new Path.Rectangle(point4, roomSize);
    room4.strokeColor = new Color('green');
    room4.fillColor = new Color('white');
    room4.data.nodeID = "4";

    var room5 = new Path.Rectangle(point5, hallwaySize);
    room5.strokeColor = new Color('blue');
    room5.fillColor = new Color('white');
    room5.data.nodeID = "5";

    var room6 = new Path.Rectangle(point6, roomSize);
    room6.strokeColor = new Color('green');
    room6.fillColor = new Color('white');
    room6.data.nodeID = "6";

    var room7 = new Path.Rectangle(point7, roomSize);
    room7.strokeColor = new Color('green');
    room7.fillColor = new Color('white');
    room7.data.nodeID = "7";

    var text1 = new PointText({
      point: [350,120],
      content: 'Room 1',
      fillColor: 'black',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 15
    });

    var text2 = new PointText({
      point: [500,120],
      content: 'Room 2',
      fillColor: 'black',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 15
    });

    var text3 = new PointText({
      point: [500,270],
      content: 'Room 3',
      fillColor: 'black',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 15
    });

    var text3 = new PointText({
      point: [500,270],
      content: 'Room 3',
      fillColor: 'black',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 15
    });

    var text4 = new PointText({
      point: [350,270],
      content: 'Room 4',
      fillColor: 'black',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 15
    });

    var text5 = new PointText({
      point: [490,570],
      content: 'Hallway 1',
      fillColor: 'black',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 15
    });

    var text6 = new PointText({
      point: [650,670],
      content: 'Room 6',
      fillColor: 'black',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 15
    });

    var text7 = new PointText({
      point: [800,620],
      content: 'Room 7',
      fillColor: 'black',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 15
    });

  }

  readEmployee(){
    this.apiService.getEmployees().subscribe((data) => {
      this.Employee = data;
     })
  }

  refreshMap() {
    this.LastLocations = new Array();
    this.Employee.forEach(element => {
        this.locatePerson(element.name);
    });
    this.openSnackBar("Refreshing Map", "Dismiss");
  }

  firstMapRefresh() {
    this.LastLocations = new Array();
    this.Employee.forEach(element => {
        this.locatePerson(element.name);
    });
    this.openSnackBar("Refreshing Map", "Dismiss");
  }

  locatePerson(name) {
    this.apiService.locatePerson(name).subscribe((data) => {
      if(data.staff_id != undefined){
        var person = {name: data.staff_id, title: data.staff_title, nodeID: data.node_id};
        this.LastLocations.push(person);
      }
    })
  }

  // SnackBar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // Reload page since paperjs and angular routing bug when moving back and forth between router
  refresh(): void {
    window.location.reload();
  }


  // On Destroy
  ngOnDestroy() {
    this.subscriptionToLocations.unsubscribe();
    this.elementRef.nativeElement.remove();
  }


}
