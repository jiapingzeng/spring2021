import time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(0.5, 1)

    @task
    def read_node(self):
        self.client.get(f"/blog/cs144/{random.randint(1,500)}", name="/blog/cs144")