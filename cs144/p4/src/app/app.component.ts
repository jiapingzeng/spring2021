import { Component, HostListener } from '@angular/core';
import { Post } from './post';
import { BlogService } from './blog.service';
import * as cookie from 'cookie';

enum AppState { List, Edit, Preview };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-blog';
  username = "";
  posts: Post[];
  currentPost: Post;
  appState: AppState;
  AppState = AppState;

  constructor(private blogService: BlogService) {

    if (cookie.parse(document.cookie)["jwt"]) {
      this.username = this.parseJWT(cookie.parse(document.cookie)["jwt"]).usr
    }

    (async () => {
      this.posts = await this.blogService.fetchPosts(this.username)
    })()

    this.onHashChange()
    window.addEventListener("hashchange", () => this.onHashChange())
  }

  openPost(post: Post) {
    window.location.hash = `#/edit/${post.postid}`
  }
  newPost() {
    window.location.hash = "#/edit/0"
  }
  previewPost(post: Post) {
    this.currentPost = post
    window.location.hash = `#/preview/${post.postid}`
  }
  savePost(post: Post) {
    (async () => {
      this.currentPost = await this.blogService.setPost(this.username, post)
      this.posts = await this.blogService.fetchPosts(this.username)
    })()
    window.location.hash = "#/"
  }
  deletePost(post: Post) {
    (async () => {
      await this.blogService.deletePost(this.username, post.postid)
      this.posts = await this.blogService.fetchPosts(this.username)
    })()
    window.location.hash = "#/"
  }
  editPost(post: Post) {
    window.location.hash = `#/edit/${post.postid}`
  }

  @HostListener('window:hashchange')
  async onHashChange() {
    console.log(`hash change: ${window.location.hash}`)
    let hasharr = window.location.hash.split("/")
    if (hasharr.length < 3) {
      this.appState = AppState.List
    } else if (hasharr[1].toLowerCase() == "edit") {
      this.appState = AppState.Edit
      this.currentPost = Number(hasharr[2]) ? await this.blogService.getPost(this.username, Number(hasharr[2])) : new Post()
    } else if (hasharr[1].toLowerCase() == 'preview') {
      this.appState = AppState.Preview
      if (Number(hasharr[2])) this.currentPost = await this.blogService.getPost(this.username, Number(hasharr[2]))
    } else {
      this.appState = AppState.List
    }
  }

  parseJWT(token: string) {
    let base64Url = token.split('.')[1]
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  }
}
