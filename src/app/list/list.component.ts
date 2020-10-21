import {Component, OnInit} from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {ToDo} from '../to-do';
import {MatDialog} from '@angular/material/dialog';
import {ItemComponent} from '../item/item.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ToDoService} from '../to-do.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  todo: Observable<ToDo[]>;
  done: Observable<ToDo[]>;
  columns = [];

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private service: ToDoService) { }

  ngOnInit(): void {
    this.todo = this.service.items.pipe(
      map(tasks => tasks.filter(task => task.completed === false))
    );
    this.done = this.service.items.pipe(
      map(tasks => tasks.filter(task => task.completed === true))
    );

    this.todo.subscribe(data => {
      this.columns.splice(0, 1, {name: 'To Do', array: data});
    });
    this.done.subscribe(data => {
      this.columns.splice(1, 1, {name: 'Done', array: data});
    });
  }

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      const key = item.key;
      const completed = !item.completed;

      this.service.itemsRef.update(key, { completed }).then(_ => {
        const message = item.completed === true ? item.title + ' is not complete' :
          item.title + ' is complete';
        this.snackBar.open(message, 'X', {
          panelClass: ['snack-bar'],
          horizontalPosition: 'right',
          duration: 5000
        });
      });
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  openDialog(key: string, item: ToDo): void {
    const dialogRef = this.dialog.open(ItemComponent, {
      data: {toDo: item, edit: true}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === '') {
        return;
      }

      this.service.updateItem(key, result.value.title, result.value.details,
        result.value.dueDate.getTime(), result.value.highPriority, false).then(_ => {
          this.snackBar.open(result.value.title + ' has been updated', 'X', {
            panelClass: ['snack-bar'],
            horizontalPosition: 'right',
            duration: 5000
          });
      });
    });
  }

  deleteToDo(key: string): void {
    this.service.deleteItem(key).then(_ => {
      this.snackBar.open('Successfully deleted the item!', 'X', {
        panelClass: ['snack-bar'],
        horizontalPosition: 'right',
        duration: 5000
      });
    });
  }

  addItem(item: ToDo): void {
    this.service.addItem(item.title, item.details, item.dueDate, item.highPriority, item.completed);
    this.snackBar.open(item.title + ' has been added to the list!', 'X', {
      panelClass: ['snack-bar'],
      horizontalPosition: 'right',
      duration: 5000
    });
  }

  clearItems(): void {
    this.service.deleteEverything().then(_ => {
      this.snackBar.open('All items have been cleared!', 'x', {
        panelClass: ['snack-bar'],
        horizontalPosition: 'right',
        duration: 5000
      });
    });
  }
}
