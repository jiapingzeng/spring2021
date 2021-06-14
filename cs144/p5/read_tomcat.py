import time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(0.5, 1)

    @task
    def read_tomcat(self):
        self.client.get(f"/editor/post?action=open&username=cs144&postid={random.randint(1,500)}", name="/editor/post?action=open")