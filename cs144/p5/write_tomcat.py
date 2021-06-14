import time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(0.5, 1)

    @task
    def write_tomcat(self):
        self.client.post("/editor/post?action=save", name="/editor/post?action=save", data={
            "username": "cs144",
            "postid": f"{random.randint(1,500)}",
            "title": "Hello",
            "body": "***World!***"
        })