import { Injectable } from '@angular/core';
import { Post } from './post';

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    constructor() { }

    fetchPosts(username: string): Promise<Post[]> {
        return new Promise((resolve, reject) => {
            fetch(`/api/posts?username=${username}`)
                .then(response => response.json())
                .then(data => {
                    let posts: Post[] = []
                    for (var post of data) {
                        posts.push({
                            postid: post.postid,
                            created: post.created,
                            modified: post.modified,
                            title: post.title,
                            body: post.body
                        })
                    }
                    resolve(posts)
                })
                .catch((error) => {
                    reject(new Error(String(error.status)))
                })
        })
    }

    getPost(username: string, postid: number): Promise<Post> {
        return new Promise((resolve, reject) => {
            fetch(`/api/posts?username=${username}&postid=${postid}`)
                .then(response => response.json())
                .then(data => {
                    resolve({
                        postid: data.postid,
                        created: data.created,
                        modified: data.modified,
                        title: data.title,
                        body: data.body
                    })
                })
                .catch((error) => {
                    reject(new Error(String(error.status)))
                })
        })
    }

    setPost(username: string, post: Post): Promise<Post> {
        return new Promise((resolve, reject) => {
            fetch(`/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    postid: post.postid,
                    title: post.title,
                    body: post.body
                })
            })
                .then(response => response.json())
                .then(data => {
                    resolve({
                        postid: data.postid,
                        created: data.created,
                        modified: data.modified,
                        title: data.title,
                        body: data.body
                    })
                })
                .catch((error) => {
                    reject(new Error(String(error.status)))
                })
        })
    }

    deletePost(username: string, postid: number): Promise<void> {
        return new Promise((resolve, reject) => {
            fetch(`/api/posts?username=${username}&postid=${postid}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .catch((error) => {
                    reject(new Error(String(error.status)))
                })
        })
    }
}