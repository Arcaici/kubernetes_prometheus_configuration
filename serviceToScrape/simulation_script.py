import time
import random
import concurrent.futures
import requests

web_server_url = "http://localhost:8081"

def instruction():
    # This is the function representing the instruction you want to execute
            # Simulate requests
    time.sleep(random.uniform(0.5 , 1))
    if round(random.random()) == 0:
        response = requests.get(f"{web_server_url}/error")
    else:
        response = requests.get(f"{web_server_url}/simulation-requests")
    print(response.text)

def main():
    i = 100000
    # Using ThreadPoolExecutor to parallelize the execution
    with concurrent.futures.ThreadPoolExecutor() as executor:
        while (i > 0):
            # Submit the instruction function to the executor
            executor.submit(instruction)
            i = i-1
    print("COMPLETE!!!")
if __name__ == "__main__":
    main()
