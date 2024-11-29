from bcc import BPF
from prometheus_client import start_http_server, Counter, Histogram
import time
import os
import signal

# Prometheus metrics
REQUEST_LATENCY = Histogram("tcp_request_duration_seconds", "Duration of TCP requests", ["namespace", "pod"])
BYTES_SENT = Counter("tcp_bytes_sent", "Bytes sent", ["namespace", "pod"])
BYTES_RECEIVED = Counter("tcp_bytes_received", "Bytes received", ["namespace", "pod"])

# Load BPF program
try:
    print("Loading BPF program...")
    bpf = BPF(src_file="prober.c")
    print("BPF program loaded successfully.")
except Exception as e:
    print(f"Error loading BPF program: {e}")
    exit(1)

# Function to attach probes with error handling
def attach_probe(event, fn_name):
    try:
        bpf.attach_kprobe(event=event, fn_name=fn_name)
        print(f"Successfully attached probe to {event}")
    except Exception as e:
        print(f"Failed to attach probe to {event}: {e}")

# Attach probes for TCP events (adjust these events according to available probes)
probe_events = [
    ("tcp_send", "kprobe__tcp_send"),  # Update with correct event
    ("tcp_receive", "kprobe__tcp_receive")  # Update with correct event
]

# Attach probes
for event, fn_name in probe_events:
    attach_probe(event, fn_name)

# Define the structure of the data
class EventData:
    def __init__(self, duration_ns, bytes_sent, bytes_received):
        self.duration_ns = duration_ns
        self.bytes_sent = bytes_sent
        self.bytes_received = bytes_received

# Start Prometheus server
start_http_server(8000)
print("Prometheus server started on port 8000")

# Polling interval (can be adjusted)
POLLING_INTERVAL = int(os.getenv("POLLING_INTERVAL", 1))  # Default to 1 second

# Graceful shutdown handler
def signal_handler(sig, frame):
    print("Shutting down...")
    exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# Poll BPF data map and update Prometheus metrics
def process_event():
    try:
        for key, value in bpf["data_map"].items():
            # Use environment variables for namespace and pod names
            namespace = os.getenv("NAMESPACE", "monitoring")
            pod = os.getenv("POD_NAME", "prometheus-55c5c978d-6jt88")

            # Ensure the value has the attributes you're expecting
            if hasattr(value, "duration_ns") and hasattr(value, "bytes_sent") and hasattr(value, "bytes_received"):
                duration_ns = value.duration_ns
                bytes_sent = value.bytes_sent
                bytes_received = value.bytes_received

                REQUEST_LATENCY.labels(namespace, pod).observe(duration_ns / 1e9)  # Convert ns to seconds
                BYTES_SENT.labels(namespace, pod).inc(bytes_sent)
                BYTES_RECEIVED.labels(namespace, pod).inc(bytes_received)

                print(f"Updated metrics for namespace={namespace}, pod={pod}: "
                      f"latency={duration_ns/1e9}s, bytes_sent={bytes_sent}, bytes_received={bytes_received}")
            else:
                print(f"Missing expected data fields in event: {key}")

    except Exception as e:
        print(f"Error processing events: {e}")

# Main loop
while True:
    try:
        process_event()
        time.sleep(POLLING_INTERVAL)  # Use configurable polling interval
    except Exception as e:
        print(f"Error in main loop: {e}")
