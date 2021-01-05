import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpCall } from './app.httpCalls';
@Injectable()
export class GetJsonService {
  constructor(private httpCall: HttpCall) {
  }
  public getShapeType(): Observable<any> {
    var url = "./../../jsonData/shapeType.json"; // get different type shape from json
    return this.httpCall.getMethod(url);
  }
  public getShapeParameter(): Observable<any> {
    var url = "./../../jsonData/shapeParameter.json";   // get different type shape parameter from json
    return this.httpCall.getMethod(url);
  }
  public getColorPickerData(): Observable<any> {
    var url = "./../../jsonData/colorPicker.json";   // get different type color from json
    return this.httpCall.getMethod(url);
  }
}