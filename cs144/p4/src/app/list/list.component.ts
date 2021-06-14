import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../post';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input() posts: any

  constructor() {
  }

  ngOnInit(): void {
  }

  @Output() openPost = new EventEmitter();

  @Output() newPost = new EventEmitter();

  openPostTrigger(post: Post): void {
    this.openPost.emit(post)
  }

  newPostTrigger(): void {
    this.newPost.emit()
  }
}
