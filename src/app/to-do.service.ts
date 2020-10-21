import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ToDo} from './to-do';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  itemsRef: AngularFireList<any>;
  items: Observable<ToDo[]>;

  constructor(private db: AngularFireDatabase) {
    this.itemsRef = db.list('item');
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    );
  }

  addItem(title: string, details: string, dueDate: string, highPriority: boolean, completed: boolean): void {
    this.itemsRef.push({ title, details, dueDate, highPriority, completed });
  }

  updateItem(key: string, title: string, details: string, dueDate: string, highPriority: boolean,
             completed: boolean): Promise<void> {
    return this.itemsRef.update(key, { title, details, dueDate, highPriority, completed });
  }

  deleteItem(key: string): Promise<void> {
    return this.itemsRef.remove(key);
  }

  deleteEverything(): Promise<void> {
    return this.itemsRef.remove();
  }
}
