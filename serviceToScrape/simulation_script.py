import time
import random
import concurrent.futures
import requests

web_server_url = "http://localhost:8081"

def instruction():
    # This is the function representing the instruction you want to execute
            # Simulate requests
    time.sleep(random.uniform(0.5 , 1))
    response = requests.get(f"{web_server_url}/simulate-requests")
    print(response.text)

def main():
    start_time = time.time()
    end_time = start_time + (2 * 60)  # Run for 20 minutes
    print((end_time - start_time)/60)
    # Using ThreadPoolExecutor to parallelize the execution
    with concurrent.futures.ThreadPoolExecutor() as executor:
        while end_time - time.time() > 0:
            # Submit the instruction function to the executor
            executor.submit(instruction)
    print("COMPLETE!!!")
if __name__ == "__main__":
    main()
