<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import="java.util.ArrayList" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>List</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
</head>
<body>
    <div class="container">
        <h1 class="my-3">All Posts</h1>
        <form class="my-3" action='/editor/post?action=open&username=<%= request.getAttribute("username") %>&postid=0' method="POST">
            <button class="btn btn-primary">Create new</button>
        </form>
        <table class="table table-striped my-3">
            <thead>
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Created</th>
                    <th scope="col">Modified</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <% ArrayList<ArrayList<String>> posts = (ArrayList<ArrayList<String>>)request.getAttribute("posts"); %>
                <% for (int i = 0; i < posts.size(); i++) { %>
                    <tr>
                        <td><%= posts.get(i).get(1) %></td>
                        <td><%= posts.get(i).get(2) %></td>
                        <td><%= posts.get(i).get(3) %></td>
                        <td>
                            <form action='/editor/post?action=open&username=<%= request.getAttribute("username") %>&postid=<%= posts.get(i).get(0) %>' method="POST" style="display: inline;">
                                <button class="btn btn-outline-success">Open</button>     
                            </form>
                            <form action='/editor/post?action=delete&username=<%= request.getAttribute("username") %>&postid=<%= posts.get(i).get(0) %>' method="POST" style="display: inline;">
                                <button class="btn btn-outline-danger">Delete</button>
                            </form>
                        </td>
                    </tr>
                <% } %>
            </tbody>
        </table>
    </div>
</body>
</html>
