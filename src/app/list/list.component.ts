import {Component} from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {ToDo} from '../to-do';
import {MatDialog} from '@angular/material/dialog';
import {ItemComponent} from '../item/item.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent {
  todo = [];
  done = [];

  constructor(public dialog: MatDialog) { }

  drop(event: CdkDragDrop<ToDo[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }

  openDialog(item: ToDo): void {
    const dialogRef = this.dialog.open(ItemComponent, {
      data: {toDo: item, edit: true}
    });

    dialogRef.afterClosed().subscribe(result => {
      item.title = result.value.title;
      item.details = result.value.title;
      item.dueDate = result.value.dueDate;
      item.highPriority = result.value.highPriority;
    });
  }

  deleteToDo(item: ToDo, list: ToDo[]): void {
    list.splice(list.indexOf(item), 1);
  }

  addItem(item: ToDo): void {
    this.todo.push(item);
  }

  clearItems(): void {
    this.todo = [];
    this.done = [];
  }
}
