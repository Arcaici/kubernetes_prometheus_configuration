import time
import random
import requests

web_server_url = "http://localhost:8081"


def main():
    start_time = time.time()
    end_time = start_time + 20 * 60  # Run for 20 minutes

    while time.time() < end_time:
        # Generate a random sleep time between 1 and 5 seconds
        sleep_time = random.uniform(1, 5)
        time.sleep(sleep_time)

        # Simulate requests
        response = requests.get(f"{web_server_url}/simulate-requests")
        print(response.text)

if __name__ == "__main__":
    main()
