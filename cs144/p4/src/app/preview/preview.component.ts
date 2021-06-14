import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';
import { Post } from '../post';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  @Input() post : Post
  reader : Parser
  writer : HtmlRenderer

  constructor() {
    this.reader = new Parser()
    this.writer = new HtmlRenderer()
  }

  ngOnInit(): void {
    this.post = new Post()
  }

  @Output() editPost = new EventEmitter()

  editPostTrigger(event: Event): void {
    this.editPost.emit(this.post)
  }
}
