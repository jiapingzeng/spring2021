import time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(0.5, 1)

    @task
    def write_node(self):
        self.client.post("/api/posts", name="/api/posts", data={
            "username": "cs144",
            "postid": f"{random.randint(1,500)}",
            "title": "Hello",
            "body": "***World!***"
        })

    def on_start(self):
        self.client.post("/login", json={"username": "cs144", "password": "password"})