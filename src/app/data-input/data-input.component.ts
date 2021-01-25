import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-data-input',
  templateUrl: './data-input.component.html',
  styleUrls: ['./data-input.component.css']
})


export class DataInputComponent  {

  constructor(private http: HttpClient) { }

  inputValue: any;
  public output: any;

get_raw_input(){
  //const headers = { 'Content-type': 'application/json' };
 // const body = JSON.stringify(this.inputValue);
  console.log(JSON.stringify(this.inputValue));
 const headers =  {'content-type': 'text/plain'};
 
  this.http.post<any>('http://localhost:3000/api/raw_input', this.inputValue,
  { headers, responseType: 'json'}).subscribe(data => {
    console.log(data);
    this.output = data;
  });

}

}
