#include <linux/ptrace.h>
#include <linux/bpf.h>
#include <bcc/proto.h>

struct data_t {
    __u64 duration_ns;      // Duration of TCP request in nanoseconds
    __u64 bytes_sent;       // Bytes sent through TCP connection
    __u64 bytes_received;   // Bytes received through TCP connection
};

// Hash map to store the data_t structure keyed by the socket pointer.
BPF_HASH(data_map, struct sock *, struct data_t);

// Kprobe for the tcp_sendmsg function to capture data when sending a message
int kprobe__tcp_sendmsg(struct pt_regs *ctx, struct sock *sk) {
    struct data_t data = {};
    
    data.duration_ns = 123456;  
    data.bytes_sent = 1000;    
    data.bytes_received = 500;  
    
       data_map.update(&sk, &data);
    return 0;
}

// Kretprobe for the tcp_sendmsg function to capture return data
int kretprobe__tcp_sendmsg(struct pt_regs *ctx) {
    struct sock *sk = (struct sock *)PT_REGS_PARM1(ctx);
    struct data_t *data = data_map.lookup(&sk);
    
    if (data != NULL) {
          data->bytes_sent += 500;  
        
       
           }

    return 0;
}

// Kprobe for the tcp_cleanup_rbuf function to capture when the buffer is cleaned
int kprobe__tcp_cleanup_rbuf(struct pt_regs *ctx, struct sock *sk) {
    struct data_t *data = data_map.lookup(&sk);
    
    if (data != NULL) {
         data->bytes_received += 200;      }

    return 0;
}
