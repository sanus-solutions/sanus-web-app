import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Color, Project, Path, Point, Layer, Size, Rectangle, Event, Segment, Tool, PointText } from 'paper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import * as paper from 'paper';
import { Tooltip } from 'chart.js';
import { defaultColors } from 'ng2-charts';


@Component({
  selector: 'app-livemap',
  templateUrl: './livemap.component.html',
  styleUrls: ['./livemap.component.scss']
})
export class LivemapComponent implements OnInit {

  project1: any;
  tool: any;
  route: string;

  constructor() { }

  ngOnInit() {

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
    var segment;
    var path;
    var movePath = false;

    tool.onMouseDown = function(event) {
      segment = null;
      path = null;
      var hitResult = project1.hitTest(event.point, hitOptions);
      if(!hitResult) {
        return;
      }

      if(hitResult) {
        path = hitResult.item;
        if(hitResult.type = 'segment') {
          segment = hitResult.segment;
        } else if (hitResult.type == 'stroke') {
          var location = hitResult.location;
			    segment = path.insert(location.index + 1, event.point);
			    path.smooth();
        }
      }

      movePath = hitResult.type == 'fill';
      if(movePath) {
        project1.activeLayer.addChild(hitResult.item);
      }
      
    }

    tool.onMouseMove = function(event) {
      project1.activeLayer.selected = false;
      if(event.item) {
        event.item.selected = true;
      }
    }


  }

  createDaycareLayout() {
    var point1 = new Point(400,400);
    var point2 = new Point(500,400);
    var point3 = new Point(400,500);
    var roomSize = new Size(100,100);

    var path1 = new Path.Rectangle(point1, roomSize);
    path1.strokeColor = new Color('red');
    path1.fillColor = new Color('white');

    var path2 = new Path.Rectangle(point2, roomSize);
    path2.strokeColor = new Color('black');
    path2.fillColor = new Color('white');

    var path3 = new Path.Rectangle(point3, roomSize);
    path3.strokeColor = new Color('green');
    path3.fillColor = new Color('white');
  }

}
