---
name: k8s-troubleshoot
description: >
  Use when debugging Kubernetes pods, deployments, services, ingress, or
  node issues in a Kubernetes cluster.
  Triggers on: "kubernetes", "kubectl", "pod crash", "OOMKilled", "CrashLoopBackOff",
  "ImagePullBackOff", "Pending pod", "pod stuck", "k8s debug", "deployment rollout",
  "kubernetes logs", "kubernetes resource", "namespace", "kubectl exec", "kubectl describe",
  "OOM", "CPU throttling", "Evicted pod", "Terminating", "helm", "ingress", "service mesh".
---

# Kubernetes Troubleshoot Skill

## Decision Tree — What's Wrong?

```
Pod won't start?
  → CrashLoopBackOff → Go to: CRASHLOOP
  → ImagePullBackOff  → Go to: IMAGE_PULL
  → Pending           → Go to: PENDING
  → Terminating forever → Go to: STUCK_TERMINATING

Pod running but not working?
  → Go to: RUNNING_BUT_BROKEN

High resource usage / OOM?
  → Go to: RESOURCE_ISSUES

Networking issues?
  → Go to: NETWORK_DEBUG

Deployment/rollout issues?
  → Go to: DEPLOYMENT_DEBUG

Cluster/node issues?
  → Go to: CLUSTER_DEBUG
```

---

## CRASHLOOP BACKOFF

### Diagnosis flow:
```bash
# 1. Get recent crash logs
kubectl logs -n production deployment/order-service --previous

# 2. Get events (why is it restarting?)
kubectl get events -n production --sort-by='.lastTimestamp' | grep order-service

# 3. Check pod status in detail
kubectl describe pod -n production order-service-7d8f9c6b4-xkq2p

# 4. Common causes — check in this order:
```

### Common causes + fixes:

```
1. OOMKilled (Out of Memory)
   → kubectl describe pod | grep -A5 "Last State"
   → Check: is memory limit too low?
   → Fix: increase memory limit, profile application memory usage

2. Exit code 1 — application error
   → kubectl logs --previous (get the exception/panic)
   → Check: environment variables correct? ConfigMap/secret mounted?
   → Fix: update config, not the container entrypoint

3. Exit code 137 — SIGKILL (OOM or node pressure)
   → kubectl describe node | grep -A10 "Conditions"
   → Check: other pods on node also OOMKilled?
   → Fix: request less resources, add node, evict low-priority pods

4. Exit code 139 — Segmentation fault (native code crash)
   → Rare — usually a library bug or bad binary
   → Fix: rebuild image, check for glibc version mismatch

5. Misconfigured entrypoint / command
   → kubectl exec order-service-xxx -- cat /app/start.sh
   → Check: does the command exist in the image?
   → Fix: fix command in Deployment spec, not in running container
```

---

## IMAGE_PULL BACKOFF

```bash
# 1. Check which image is failing
kubectl describe pod | grep -A5 "Containers"

# 2. Common causes:

# Cause A: Wrong image name or tag (tag "latest" doesn't pull what you think)
kubectl describe pod | grep "Image:"
# Fix: use specific SHA, not :latest

# Cause B: Registry auth issue (private registry)
kubectl get secret -n production
kubectl describe secret reg-secret
# Fix: ensure secret exists and is referenced in service account:
#   serviceAccountName: order-service
#   imagePullSecrets:
#     - name: reg-secret

# Cause C: Image not in registry (typo or deleted)
# Fix: kubectl run test --image=docker.io/library/nginx:1.25

# Cause D: Network policy blocking registry
# Fix: check if egress allows outbound to registry

# Cause E: Rate limiting (Docker Hub anonymous)
# Fix: add auth: docker.io config.json secret
```

---

## PENDING PODS

```bash
# 1. Why is it pending?
kubectl describe pod my-pod -n production | grep -A10 "Events"

# 2. Check resource requests vs cluster capacity
kubectl describe node | grep -A5 "Allocated resources"
# For each pod: check resource requests (CPU/memory requested, not just limits)

# 3. Check if PVC is bound (stuck pending because volume not available)
kubectl get pvc -n production
kubectl describe pvc my-volume-claim

# 4. Common causes:
# A: Insufficient CPU/memory requests → requests exceed cluster capacity
#    Fix: lower requests, or add more nodes
# B: No matching node selector / affinity / tolerations
#    Fix: check node labels and pod tolerations
# C: PVC stuck (storage class not available, provisioner down)
#    Fix: check storage class: kubectl get storageclass
```

---

## STUCK TERMINATING

```bash
# Force delete (after confirming you know why it's stuck)
kubectl delete pod my-pod -n production --grace-period=0 --force

# Or wait longer (some operations need time):
kubectl delete pod my-pod -n production --grace-period=30 --force

# Common causes:
# 1. Finalizers waiting for external resource (e.g., CSI volume detached)
#    → kubectl patch pod my-pod -n production -p '{"metadata":{"finalizers":[]}}'
# 2. Pre-stop hook not completing (app doesn't handle SIGTERM)
#    → Fix: add preStop hook: sleep 5 to Deployment
# 3. NFS/CIFS volume not unmounting
#    → Check NFS server, may need force unmount
```

---

## RUNNING_BROKEN (pod running but not responding)

```bash
# 1. Can the pod reach your service from inside?
kubectl exec -it order-service-xxx -n production -- curl localhost:8080/healthz

# 2. Can DNS resolve?
kubectl exec -it order-service-xxx -n production -- nslookup database-service
kubectl exec -it order-service-xxx -n production -- cat /etc/resolv.conf

# 3. Can it reach the database?
kubectl exec -it order-service-xxx -n production -- nc -zv database-host 5432

# 4. Check resource throttling (CPU being throttled)
kubectl top pod -n production order-service-xxx
# If CPU throttling high: increase CPU request/limit ratio

# 5. Check network policies (are you blocking yourself?)
kubectl get networkpolicy -n production
kubectl describe networkpolicy allow-frontend -n production

# 6. Check Service selector matches Pod labels
kubectl describe svc order-service -n production
kubectl get pods -n production --show-labels | grep order
# A trailing space in service selector will match nothing!
```

---

## RESOURCE ISSUES (OOM / CPU throttling)

### OOM: container is killed for exceeding memory limit
```bash
# Find OOMKilled pods across the cluster
kubectl get events -A | grep OOMKilled

# Which pods are using memory close to their limit?
kubectl top pods -A | sort -k3 -h

# Fix: set appropriate memory requests AND limits
resources:
  requests:
    memory: "256Mi"
  limits:
    memory: "512Mi"
    # Always set memory limit (not just request) — without it, pods can use all node memory
```

### CPU Throttling: app is slow because CPU is capped
```bash
# Check CPU throttling %
kubectl exec -it order-service-xxx -n production -- cat /sys/fs/cgroup/cpu/cpu.stat

# or via metrics-server
kubectl top pods -n production

# Fix: CPU throttling happens when CPU usage > CPU limit
# Lower the limit (if you set it wrong), or raise the limit if workload is legitimate
# Generally: set CPU request=limit for latency-sensitive workloads
resources:
  requests:
    cpu: "500m"
  limits:
    cpu: "1000m"  # Increase if throttling under normal load
```

### Right-sizing resources (use VPA for recommendations):
```bash
# Vertical Pod Autoscaler — recommends resource changes based on actual usage
# Install: kubectl apply -f https://github.com/kubernetes/autoscaler/releases/latest
# Get recommendations:
kubectl vpa recompute -n production
```

---

## NETWORK DEBUG

```bash
# 1. Can you reach the service?
kubectl run curl-test --image=curlimages/curl --rm -it -- sh
# Then inside:
curl -v http://order-service:8080/healthz  # Service DNS name

# 2. Is the service DNS correct?
kubectl exec -it order-service-xxx -- nslookup order-service

# 3. Check endpoints (pods backing the service)
kubectl get endpoints order-service -n production
# Should show pod IPs matching kubectl get pods -n production -l app=order-service

# 4. Check iptables rules (advanced)
kubectl exec -it <node> -- iptables -t nat -L -n | grep KUBE | head -30

# 5. Check CoreDNS
kubectl logs -n kube-system -l app=coredns --tail=100

# 6. Common fix: restart the service (clears stale endpoints)
kubectl rollout restart deployment/order-service -n production
```

---

## DEPLOYMENT DEBUG

```bash
# Rollout status (live)
kubectl rollout status deployment/order-service -n production

# Rollout history
kubectl rollout history deployment/order-service -n production

# Rollback to previous
kubectl rollout undo deployment/order-service -n production

# Rollback to specific revision
kubectl rollout undo deployment/order-service -n production --to-revision=3

# Force new deployment (if stuck and won't roll)
kubectl rollout restart deployment/order-service -n production

# Check what's blocking rollout
kubectl get events -n production --field-selector involvedObject.name=order-service
```

---

## CLUSTER DEBUG

```bash
# Node resource summary
kubectl describe nodes | grep -A10 "Allocated resources"
kubectl top nodes

# Node conditions (memory pressure? disk pressure? network unreachable?)
kubectl get nodes -o wide
kubectl describe node <node-name> | grep -A20 "Conditions"

# Pods on each node
kubectl get pods -o wide --all-namespaces | grep <node-name>

# Draining a node (before maintenance)
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --grace-period=300

# If node NotReady:
kubectl get events --sort-by='.lastTimestamp' | grep -i node
# Check: kubelet running? kubelet logs: journalctl -u kubelet -n 100
```

---

## QUICK REFERENCE: kubectl shortcuts

```bash
# Fast context switch
alias k='kubectl'
k ctx production
k ns default

# Watch resources (live updates)
watch -n2 'kubectl get pods -n production'

# Logs with timestamps
kubectl logs -f -n production deployment/order-service --timestamps

# All resources for a label
kubectl get all -n production -l app=order-service

# Shell into container (if container has shell)
kubectl exec -it order-service-xxx -n production -- sh

# Port forward (local debugging)
kubectl port-forward svc/order-service 8080:8080 -n production

# Top (needs metrics-server installed)
kubectl top pod -A | sort -k3 -h | tail -20  # Top 20 memory users
```
