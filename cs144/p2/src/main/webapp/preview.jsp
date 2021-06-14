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
        <h1 class="my-3">Preview</h1>
        <div class="my-3">
            <button class="btn btn-outline-secondary"><a href='<%= request.getAttribute("returnUrl")%>' style="text-decoration: none; color: inherit;">Close</a></button>
        </div>
        <div class="my-3">
            <h3><%= request.getAttribute("title") %></h3>
            <%= request.getAttribute("body") %>
        </div>
    </div>
</body>
</html>
