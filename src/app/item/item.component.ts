import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  form: FormGroup;
  edit: boolean;

  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: [this.data.toDo.title, Validators.required],
      details: this.data.toDo.details,
      dueDate: [new Date(this.data.toDo.dueDate), Validators.required],
      highPriority: this.data.toDo.highPriority
    });
    this.edit = this.data.edit;
  }

}
