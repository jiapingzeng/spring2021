import java.io.IOException;
import java.sql.* ;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Date;
import java.net.URLEncoder;
import java.net.URLDecoder;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

public class Editor extends HttpServlet {

    Connection conn;
    PreparedStatement ps;
    ResultSet rs;
    ArrayList<ArrayList<String>> posts;

    public Editor() {
        posts = new ArrayList<ArrayList<String>>();
    }

    public void init() throws ServletException
    {
        try {
            conn = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", "");
        } catch (SQLException ex) {
            System.out.println("Unable to establish connection");
        }
    }
    
    public void destroy()
    {
        try { rs.close(); } catch (Exception ex) {}
        try { ps.close(); } catch (Exception ex) {}
        try { conn.close(); } catch (Exception ex) {}
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {        
        String action = request.getParameter("action");
        String username = request.getParameter("username");
        String postid = request.getParameter("postid");
        String title = request.getParameter("title");
        String body = request.getParameter("body");

        if (action.equals("open")) {
            open(request, response, username, postid, title, body);
        } else if (action.equals("preview")) {
            preview(request, response, username, postid, title, body);
        } else if (action.equals("list")) {
            list(request, response, username);
        } else {
            response.sendError(400, "Invalid action");
        }        
    }
    
    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
        String action = request.getParameter("action");
        String username = request.getParameter("username");
        String postid = request.getParameter("postid");
        String title = request.getParameter("title");
        String body = request.getParameter("body");

        if (action.equals("open")) {
            open(request, response, username, postid, title, body);
        } else if (action.equals("save")) {
            save(request, response, username, postid, title, body);
        } else if (action.equals("delete")) {
            delete(request, response, username, postid);
        } else if (action.equals("preview")) {
            preview(request, response, username, postid, title, body);
        } else if (action.equals("list")) {
            list(request, response, username);
        } else {
            response.sendError(400, "Invalid action");
        }
    }

    private boolean isNullOrEmpty(String s) {
        return s == null || s == "";
    }
    
    private void open(HttpServletRequest request, HttpServletResponse response, String username, String postid, String title, String body)
        throws ServletException, IOException
    {
        if (username != null && postid != null) {
            // decode title and body
            if (title != null) title = URLDecoder.decode(title, "UTF-8");
            if (body != null) body = URLDecoder.decode(body, "UTF-8");

            // check if postid is valid
            int pid = 0;
            try {
                pid = Integer.parseInt(postid);
            } catch (NumberFormatException ex) {
                response.sendError(400, "Invalid post ID");
            }

            if (pid == 0) {
                if (title == null) title = "";
                if (body == null) body = "";
                
                request.setAttribute("title", title);
                request.setAttribute("body", body);
            } else if (pid > 0) {

                // check if title and body are both passed in
                if (title != null && body != null) {
                    request.setAttribute("title", title);
                    request.setAttribute("body", body);
                } else {

                    try {
                        ps = conn.prepareStatement("SELECT * FROM Posts WHERE username = ? AND postid = ?");
                        ps.setString(1, username);
                        ps.setString(2, postid);
                        rs = ps.executeQuery();

                        // check if rs is empty
                        if (!rs.isBeforeFirst()) {
                            response.sendError(404, "Not found");
                            return;
                        }

                        // retrieve post title and body
                        while (rs.next()) {
                            title = rs.getString("title") == null ? "" : rs.getString("title");
                            body = rs.getString("body") == null ? "" : rs.getString("body");
                            request.setAttribute("title", title);
                            request.setAttribute("body", body);
                        }
                    } catch (SQLException ex) {
                        System.out.println("SQL error in open");
                    }
                }
            } else {
                response.sendError(400, "Invalid post ID");
                return;
            }

            String saveUrl = generateUrl("save", username, postid, title, body);
            String listUrl = generateUrl("list", username, null, null, null);
            String previewUrl = generateUrl("preview", username, postid, title, body);
            String deleteUrl = generateUrl("delete", username, postid, null, null);
            request.setAttribute("saveUrl", saveUrl);
            request.setAttribute("listUrl", listUrl);
            request.setAttribute("previewUrl", previewUrl);
            request.setAttribute("deleteUrl", deleteUrl);
            request.setAttribute("username", username);
            request.setAttribute("postid", postid);
            response.setStatus(200);
            request.getRequestDispatcher("/edit.jsp").forward(request, response);
        } else {
            response.sendError(400, "Missing parameters");
        }
    }

    private void save(HttpServletRequest request, HttpServletResponse response, String username, String postid, String title, String body)
        throws ServletException, IOException
    {
        if (username != null && postid != null && title != null && body != null) {
            title = URLDecoder.decode(title, "UTF-8");
            body = URLDecoder.decode(body, "UTF-8");

            // check if postid is valid
            int pid = 0;
            try {
                pid = Integer.parseInt(postid);
            } catch (NumberFormatException ex) {
                response.sendError(400, "Invalid post ID");
            }

            if (pid == 0) {
                try {
                    // get next availabe postid
                    ps = conn.prepareStatement("SELECT Max(postid) as maxpid FROM Posts WHERE username = ?");
                    ps.setString(1, username);
                    rs = ps.executeQuery();
                    int newpid = 0;
                    while (rs.next()) {
                        newpid = rs.getInt("maxpid") + 1;
                    }

                    // insert new post
                    ps = conn.prepareStatement("INSERT INTO Posts (username, postid, title, body, modified, created) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)");
                    ps.setString(1, username);
                    ps.setInt(2, newpid);
                    ps.setString(3, title);
                    ps.setString(4, body);
                    ps.executeQuery();
                } catch (Exception ex) {
                    System.out.println("SQL error in save");
                }
            } else if (pid > 0) {
                try {
                    ps = conn.prepareStatement("SELECT * FROM Posts WHERE username = ? AND postid = ?");
                    ps.setString(1, username);
                    ps.setString(2, postid);
                    rs = ps.executeQuery();

                    // check if rs is empty
                    if (!rs.isBeforeFirst()) {
                        response.sendError(404, "Not found");
                        return;
                    }

                    // update post
                    ps = conn.prepareStatement("UPDATE Posts SET title = ?, body = ?, modified = CURRENT_TIMESTAMP WHERE username = ? AND postid = ?");
                    ps.setString(1, title);
                    ps.setString(2, body);
                    ps.setString(3, username);
                    ps.setString(4, postid);
                    ps.executeQuery();
                } catch (Exception ex) {
                    System.out.println("SQL error in save");
                }
            } else {
                response.sendError(400, "Invalid post ID");
                return;
            }
            
            String listUrl = generateUrl("list", username, null, null, null);
            request.setAttribute("listUrl", listUrl);
            response.setStatus(200);
            request.getRequestDispatcher("/redirect.jsp").forward(request, response);
        } else {
            response.sendError(400, "Missing parameters");
        }
    }

    private void delete(HttpServletRequest request, HttpServletResponse response, String username, String postid)
        throws ServletException, IOException
    {
        if (!isNullOrEmpty(username) && !isNullOrEmpty(postid)) {
            try {
                ps = conn.prepareStatement("SELECT * FROM Posts WHERE username = ? AND postid = ?");
                ps.setString(1, username);
                ps.setString(2, postid);
                rs = ps.executeQuery();
                
                // check if rs is empty
                if (!rs.isBeforeFirst()) {
                    response.sendError(404, "Not found");
                    return;
                }

                ps = conn.prepareStatement("DELETE FROM Posts WHERE username = ? AND postid = ?");
                ps.setString(1, username);
                ps.setString(2, postid);
                ps.executeUpdate();
            } catch (SQLException ex) {
                System.out.println("SQL error in delete");
            }

            String listUrl = generateUrl("list", username, null, null, null);
            request.setAttribute("listUrl", listUrl);
            response.setStatus(200);
            request.getRequestDispatcher("/redirect.jsp").forward(request, response);
        } else {
            response.sendError(400, "Missing parameters");
        }
    }

    private void preview(HttpServletRequest request, HttpServletResponse response, String username, String postid, String title, String body)
        throws ServletException, IOException
    {
        if (username != null && postid != null && title != null && body != null) {
            // decode title and body
            title = URLDecoder.decode(title, "UTF-8");
            body = URLDecoder.decode(body, "UTF-8");

            Parser parser = Parser.builder().build();
            HtmlRenderer renderer = HtmlRenderer.builder().build();
            request.setAttribute("title", renderer.render(parser.parse(title)));
            request.setAttribute("body", renderer.render(parser.parse(body)));

            String returnUrl = generateUrl("open", username, postid, title, body);
            request.setAttribute("returnUrl", returnUrl);
            response.setStatus(200);
            request.getRequestDispatcher("/preview.jsp").forward(request, response);
        } else {
            response.sendError(400, "Missing parameters");
        }
    }

    private void list(HttpServletRequest request, HttpServletResponse response, String username) 
        throws ServletException, IOException
    {
        if (username != null) {
            try {
                ps = conn.prepareStatement("SELECT * FROM Posts WHERE username = ?");
                ps.setString(1, username);
                rs = ps.executeQuery();

                // check if rs is empty
                if (!rs.isBeforeFirst()) {
                    response.sendError(404, "Not found");
                    return;
                }

                // add posts to list
                while (rs.next()) {
                    ArrayList<String> post = new ArrayList<String>();
                    post.add(rs.getString("postid"));
                    post.add(rs.getString("title"));
                    post.add(rs.getString("created"));
                    post.add(rs.getString("modified"));
                    posts.add(post);
                }

                request.setAttribute("username", username);
                request.setAttribute("posts", posts);
                response.setStatus(200);
                request.getRequestDispatcher("/list.jsp").forward(request, response);
                posts.clear();
            } catch (SQLException ex) {
                System.out.println("SQL error in list");
            }
        } else {
            response.sendError(400, "Missing parameters");
        }
    }

    private String generateUrl(String action, String username, String postid, String title, String body) {
        try {
            String url = "/editor/post?action=" + action;
            url += username == null ? "" : "&username=" + URLEncoder.encode(username, "UTF-8");
            url += postid == null ? "" : "&postid=" + URLEncoder.encode(postid, "UTF-8");
            url += title == null ? "" : "&title=" + URLEncoder.encode(title, "UTF-8");
            url += body == null ? "" : "&body=" + URLEncoder.encode(body, "UTF-8");
            return url;
        } catch (Exception ex) {
            return null;
        }
    }

}

