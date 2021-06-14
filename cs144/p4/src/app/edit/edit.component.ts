import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../post';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @Input() post : Post

  constructor() {
  }

  ngOnInit(): void {
    this.post = new Post()
  }

  @Output() savePost = new EventEmitter()

  @Output() deletePost = new EventEmitter()

  @Output() previewPost = new EventEmitter()

  savePostTrigger(event: Event): void {
    event.preventDefault()
    this.savePost.emit(this.post)
  }

  deletePostTrigger(event: Event): void {
    event.preventDefault()
    this.deletePost.emit(this.post)
  }

  previewPostTrigger(event: Event): void {
    event.preventDefault()
    this.previewPost.emit(this.post)
  }

  titleChange(event: Event): void {
    this.post.title = (event.target as HTMLInputElement).value
  }

  bodyChange(event: Event): void {
    this.post.body = (event.target as HTMLTextAreaElement).value
  }
}
