import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, Input, SimpleChanges, NgZone } from '@angular/core';
import { Color, Project, Path, Point, Layer, Size, Rectangle, Event, Segment, Tool, PointText } from 'paper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ApiService } from './../_services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SharedataService} from "./../_services/sharedata.service";

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
  RoomList:any;
  LastLocations:any = [];
  message:any;

  //subscriptions
  subscriptionToLocations: Subscription;

  constructor(private apiService: ApiService, private _snackBar: MatSnackBar, private elementRef: ElementRef, private data: SharedataService) {
    this.readEmployee();
    this.LastLocations = new Array();
    this.CurrentRoom = null;
    this.CurrentRoomPeopleList = new Array();
    this.RoomList = new Array();
    
  }

  ngOnInit() {
    // subscribers
    this.data.currentMessage.subscribe(message => this.message = message);

  
    //interval task (auto refresh page every 30 secs)
    const source = interval(30000);
    this.subscriptionToLocations = source.subscribe(val => this.refreshMap());
    

    const project1 = new Project('cv1');
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

        // find the room name for that particular nodeID
        this.RoomList.forEach(element => {
          if(element.nodeID == path.data.nodeID) {
            this.Room = element.roomName;
          }
        });
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

  /**
    * Loop through each room and find the totals of each type in the map legends.
    * From here, generate a number and the symbol depending on the type and how many of each in the room.
    */
  drawPeopleOnMap() {

    // create a new layer and make it the active layer
    if(paper.project.layers.length == 1) {

      var layer2 = new Layer();
      layer2.activate();

      this.initForDrawPeopleOnMap();


    } else {

      // clear the 2nd layer and redraw it
      paper.project.layers[1].removeChildren();
      paper.project.layers[1].activate();
      
      this.initForDrawPeopleOnMap();

    }
    
  }

  /**
   * Draws the symbols for Staff and Children onto the Map
   */
  initForDrawPeopleOnMap() {

    for (var room of this.RoomList) {
      var point = room.startPoint;

      // create staff symbols on map
      if (room.numOfStaff > 0) {
        var staffPoint = new Point(point.x + 75, point.y + 50);
        // create a green circle and a pointText number inside
        var staffCircle = new Path.Circle(staffPoint, 15);
        staffCircle.fillColor = new Color('green');
        staffCircle.locked = true;

        // create pointText based on number of staff in room
        var text = new PointText({
          point: [staffPoint.x-5,staffPoint.y+5],
          content: room.numOfStaff.toString(),
          fillColor: 'white',
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          fontSize: 15,
          locked: true
        });
      }

      // create the child symbols on the map
      if (room.numOfChildren > 0) {
        var childPoint = new Point(point.x + 75, point.y + 100);
        // create a blue circle and a pointText number inside
        var childCircle = new Path.Circle(childPoint, 15);
        childCircle.fillColor = new Color('blue');
        childCircle.locked = true;

        // create pointText based on number of staff in room
        var text = new PointText({
          point: [childPoint.x-5,childPoint.y+5],
          content: room.numOfChildren.toString(),
          fillColor: 'white',
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          fontSize: 15,
          locked: true
        });
      }
    }

  }

  clearAndRefreshCountInRooms() {
    for (var room of this.RoomList) {
      // clear count for Staff, Children, Unknowns
      room.numOfStaff = 0;
      room.numOfChildren = 0;
      room.numOfUnknown = 0;
    }
  }

  /**
   * Modify this function whenever there is a new change to the room layout of the Daycare
   */
  createDaycareLayout() {
    var point1 = new Point(450,200);
    var point5 = new Point(600,200);

    var roomSize = new Size(150,150);
    var hallwaySize = new Size(150,400);

    var room;

    var room1 = new Path.Rectangle(point1, roomSize);
    room1.strokeColor = new Color('#3F51B5');
    room1.strokeWidth = 5;
    room1.fillColor = new Color('white');
    room1.data.nodeID = "1";
    room = {nodeID: room1.data.nodeID, startPoint: point1, roomSize: roomSize, numOfStaff: 0, numOfChildren: 0, numOfUnknown: 0, roomName: "Children's Room"};
    this.RoomList.push(room);

    var room5 = new Path.Rectangle(point5, hallwaySize);
    room5.strokeColor = new Color('#3F51B5');
    room5.strokeWidth = 5;
    room5.fillColor = new Color('white');
    room5.data.nodeID = "5";
    room = {nodeID: room5.data.nodeID, startPoint: point5, roomSize: hallwaySize, numOfStaff: 0, numOfChildren: 0, numOfUnknown: 0, roomName: "Hallway"};
    this.RoomList.push(room);

    var text1 = new PointText({
      point: [470,220],
      content: 'Childrens Room',
      fillColor: 'black',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 15,
      locked: true
    });

    var text5 = new PointText({
      point: [650,400],
      content: 'Hallway',
      fillColor: 'black',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 15,
      locked: true
    });

  }

  readEmployee(){
    this.apiService.getEmployees().subscribe((data) => {
      this.Employee = data;
     })
  }

  refreshMap() {
    this.clearAndRefreshCountInRooms()
    this.showRoomCard = false;
    this.LastLocations = new Array();
    this.Employee.forEach(element => {
        this.locatePerson(element.name);
    });
    this.openSnackBar("Refreshing Map", "Dismiss");
    
  }

  /**
   * Increment the room count based on who this person is: Staff, Student, Unknown
   * @param person 
   */
  incrementRoomCount(person) {
    for (var room of this.RoomList) {
      if (person.nodeID == room.nodeID) {
        // check if they are Staff, Children, or Unknown person and increment the value for that room
        if(person.title == "admin") {
          room.numOfStaff++;
        } else if(person.title == "student") {
          room.numOfChildren++;
        } else if(person.title == "None") {
          room.numOfUnknown++;
        }
      }
    }
  }

  /**
   * Check the room counts and see if there are any out of "ratio"
   * If OUT OF RATIO, send alert event to the Database for that particular account.
   * MUST BE CALLED AFTER incrementRoomCount() for accurate data
   * @param None
   */
  checkIfOutOfRatio() {
    for (var room of this.RoomList) {
      
      // for each room, look at the admin to student ratio. MUST BE 1:10 at least.
      if((room.numOfChildren / room.numOfStaff) > 10) {
        // send out an alert
        this.sendOutOfRatioAlert(room);
        return;
      } else {
        this.data.changeMessage("No Alerts");
        return;
      }

    }
  }

  locatePerson(name) {
    this.apiService.locatePerson(name).subscribe((data) => {
      if(data.staff_id != undefined){
        var person = {name: data.staff_id, title: data.staff_title, nodeID: data.node_id, lastSeen: data.timestamp};
        this.LastLocations.push(person);

        // increment the RoomList with knowledge of this person
        this.incrementRoomCount(person);
        this.drawPeopleOnMap();

        // Check if out of ratio
        this.checkIfOutOfRatio();

      }
    })
  }

  // SnackBar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // Send an alert for OUT OF RATIO'
  sendOutOfRatioAlert(room) {
    this.data.changeMessage(room.roomName.toString() + " is out of ratio. Please check on the room and staff.");
  }

  // Change the message in the Shared Message Service
  newMessage() {
    this.data.changeMessage("Hello from Sibling");
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
