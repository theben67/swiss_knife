import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  todos:any[];
  todo:string;

  constructor(){
    this.todos = [];
    this.todo = "";
  }

  addTodo(){
    this.todos.push(this.todo);
    this.todo = "";
  }

  deleteTodo(index){
    this.todos.splice(index,1);
  }

}
