<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Editor</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
</head>
<body>
    <div class="container">
        <h1 class="my-3">Edit</h1>
        <div class="my-3">
            <form action='<%= request.getAttribute("saveUrl") %>' method="POST" id="buttonForm">
                <button id="save" class="btn btn-outline-success">Save</button>
                <button id="close" class="btn btn-outline-warning">Close</button>
                <button id="preview" class="btn btn-outline-primary">Preview</button>
                <button id="delete" class="btn btn-outline-danger">Delete</button>
            </form>            
        </div>
        <form>
            <div class="my-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" id="title" value='<%= request.getAttribute("title") %>'>
            </div>
            <div class="my-3">
                <label for="body" class="form-label">Body</label>
                <textarea class="form-control" style="height: 20rem;" id="body"><%= request.getAttribute("body") %></textarea>
            </div>
        </form>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>

        var username, postid, title, body

        var updateVars = () => {
            username = '<%= request.getAttribute("username") %>'
            postid = '<%= request.getAttribute("postid") %>'
            title = encodeURIComponent($("#title").val())
            body = encodeURIComponent($("#body").val())
        }

        $("#save").on("click", e => {
            e.preventDefault()

            updateVars()

            var formAction = "/editor/post?action=save" + "&username=" + username + "&postid=" + postid + "&title=" + title + "&body=" + body

            $("#buttonForm").attr("action", formAction)
            $("#buttonForm").submit()
        })

        $("#close").on("click", e => {
            e.preventDefault()

            updateVars()

            var formAction = "/editor/post?action=list" + "&username=" + username

            $("#buttonForm").attr("action", formAction)
            $("#buttonForm").submit()
        })

        $("#preview").on("click", e => {
            e.preventDefault()

            updateVars()

            var formAction = "/editor/post?action=preview" + "&username=" + username + "&postid=" + postid + "&title=" + title + "&body=" + body

            $("#buttonForm").attr("action", formAction)
            $("#buttonForm").submit()
        })

        $("#delete").on("click", e => {
            e.preventDefault()

            updateVars()

            var formAction = "/editor/post?action=delete" + "&username=" + username + "&postid=" + postid

            $("#buttonForm").attr("action", formAction)
            $("#buttonForm").submit()
        })
    </script>
</body>
</html>
