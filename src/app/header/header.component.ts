import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ItemComponent} from '../item/item.component';
import {ToDo} from '../to-do';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() clearItemEvent = new EventEmitter<null>();
  @Output() addItemEvent = new EventEmitter<ToDo>();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ItemComponent, {
      data: {toDo: new ToDo(), edit: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === '') {
        return;
      }

      this.addItemEvent.emit({
        title: result.value.title,
        details: result.value.details,
        dueDate: result.value.dueDate.getTime(),
        highPriority: result.value.highPriority,
        completed: false
      });
    });
  }

  clearAllItems(): void {
    this.clearItemEvent.emit();
  }

}
