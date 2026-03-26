---
name: infra-cost-estimate
description: >
  Use when planning cloud infrastructure, estimating costs, right-sizing resources,
  or auditing cloud spend.
  Triggers on: "cloud cost", "AWS cost", "GCP cost", "Azure cost", "right-sizing",
  "infrastructure cost", "EC2 cost", "cost optimization", "cloud waste",
  "spot instances", "reserved instances", "K8s cost", "FinOps", "cloud budget",
  "monthly cloud bill", "kubernetes cost", "compute cost", "data transfer cost",
  "S3 cost", "RDS cost", "cloud pricing", "cost estimate", "cloud saving".
---

# Infrastructure Cost Estimate Skill

## Decision Tree — What Do You Need?

```
Estimating cost for a new project/infrastructure?
  → Go to: NEW_PROJECT_ESTIMATE
Auditing current cloud spend (finding waste)?
  → Go to: COST_AUDIT
Right-sizing over-provisioned resources?
  → Go to: RIGHT_SIZING
Choosing compute type (spot vs on-demand vs reserved)?
  → Go to: COMPUTE_STRATEGY
Setting up cost monitoring/budgeting?
  → Go to: COST_MONITORING
```

---

## NEW_PROJECT_ESTIMATE

### AWS (monthly estimates, us-east-1 baseline, 2024)

```
Compute:
  t3.micro (2 vCPU, 1 GB)     → $8.47/mo on-demand
  t3.small (2 vCPU, 2 GB)     → $16.94/mo
  t3.medium (2 vCPU, 4 GB)   → $33.88/mo
  m5.large (2 vCPU, 8 GB)    → $70.08/mo
  c5.xlarge (4 vCPU, 8 GB)   → $134.00/mo

  Savings: Reserved 1yr (no upfront) → ~40% off
           Reserved 3yr (no upfront) → ~60% off
           Spot instances            → ~60-70% off (interruption risk)

Databases:
  RDS db.t3.micro (Multi-AZ)  → ~$28/mo (single AZ), ~$56/mo (Multi-AZ)
  RDS db.m5.large (Multi-AZ)  → ~$140/mo (single AZ), ~$280/mo (Multi-AZ)
  Aurora Serverless vCPU      → $0.065/hr per vCPU + storage $0.10/GB/mo

Storage:
  S3 Standard                  → $0.023/GB/mo
  S3 Intelligent-Tiering      → $0.0125/GB/mo (small monthly fee + auto-tiering)
  EBS gp3 (1 GB)              → $0.08/GB/mo
  EBS io1/io2 (provisioned IOPS) → $0.065/GB/mo + $0.065/provisioned IOPS

Data Transfer:
  Out to Internet              → $0.09/GB (first 10 TB)
  Between AZs (same region)    → $0.01/GB
  Between regions              → $0.02-0.05/GB (varies)
  CloudFront                   → $0.0085/GB (cheaper than direct S3 for global)

Load Balancer:
  ALB                           → $0.0225/hour + $0.008/GB processed
  NLB                           → $0.0225/hour + $0.006/GB processed
  (ALB recommended: cheaper for most patterns, easier TLS termination)

Serverless equivalents (often cheaper for variable workloads):
  Lambda (1B requests, 128MB, 100ms avg) → ~$0.40/mo + $0.20/GB
  API Gateway (1M calls, REST) → ~$3.50/mo
```

### Quick sizing guide (start here, then monitor):
```
Personal project / MVP:
  1x t3.micro + RDS db.t3.micro (single AZ) + 20GB S3
  → ~$35-50/mo

Small production app (< 1000 DAU):
  2x t3.small (for resilience) + RDS db.t3.small (Multi-AZ) + 100GB S3 + ALB
  → ~$100-150/mo

Medium production app (< 10K DAU):
  3x t3.medium behind ALB + RDS db.m5.large (Multi-AZ) + 500GB S3
  → ~$350-500/mo

Scale: the rule is: if you're consistently above 60% CPU on t3.medium,
       move to m5. Don't overprovision "just in case."
```

---

## COST_AUDIT (find waste)

### Step 1: Identify what's running vs what should be running
```bash
# AWS: list all resources with their costs (Cost Explorer API)
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-03-01 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=RESOURCE,Type=Service

# GCP: list all resources
gcloud compute instances list --format="table(name,zone,machineType,status)"

# Azure: resource costs
az costmanagement query \
  --time-period "2024-01-01/2024-03-01" \
  --dataset-granularity Monthly \
  --metrics "ActualCost"
```

### Step 2: Find idle/waste resources
```
Common waste patterns:
  1. Development databases running 24/7 → STOP them or use dev tier
  2. EBS volumes attached to terminated EC2s → orphaned volumes
     aws ec2 describe-volumes --filters Name=status,Values=available
  3. Snapshots with no AMI reference
     aws ec2 describe-snapshots --owner-ids self --query 'Snapshots[*].[SnapshotId,VolumeId,StartTime]'
  4. Elastic IPs not associated with running instances → charged $0.005/hr
  5. Unused elastic load balancers
  6. Over-provisioned instances (check CPU: kubectl top pods if K8s)
  7. NAT Gateways for private subnets that never reach internet
  8. CloudWatch custom metrics you're not using
```

### Step 3: Find cost-reduction opportunities
```
HIGH IMPACT → do immediately:
  ✅ Delete orphaned EBS volumes (find them: aws ec2 describe-volumes --filters Name=status,Values=available)
  ✅ Delete unused EBS snapshots
  ✅ Stop dev/staging environments at night (auto-start/stop with Lambda + EventBridge)
  ✅ Switch dev databases to T3 micro or burstable (save 50%)
  ✅ Review and delete unused IAM roles that have attached policies

MEDIUM IMPACT → planned:
  ✅ Switch production to Reserved (1yr) for stable workloads — 40% savings
  ✅ Migrate batch/background jobs to Spot instances — 60% savings
  ✅ Enable S3 Intelligent-Tiering for infrequent access data
  ✅ Review CloudWatch logs retention — reduce from unlimited to 30d for dev
  ✅ Use CloudFront for static assets instead of ALB → cheaper egress
```

---

## RIGHT_SIZING

### Decision tree for compute right-sizing:
```
Is CPU usage consistently < 30% on average?
  → Your instances are over-provisioned
  → Move down one instance size (t3.medium → t3.small)

Is CPU bursting frequently to 100%?
  → Your instances are correctly sized for burst, but not sustained load
  → Consider: T3 unlimited mode (extra CPU credits) OR
  → Consider: larger instance with sustained baseline

Is memory usage > 85%?
  → You need more memory
  → Don't just increase — profile first: is it a leak or expected?

Is the service experiencing latency?
  → Don't just add more CPU — check if it's:
    - GC pauses (JVM/Node.js) → increase memory, not CPU
    - Connection pool exhaustion → increase DB connection limit
    - Network throttling → check VPC limits
    - Disk I/O throttling → move to io1/io2 or local NVMe

Right-sizing process:
  1. Monitor for 2 weeks (covers weekday/weekend variance)
  2. Use 95th percentile CPU AND memory, not average
  3. Target: 40-60% average utilization (not burst)
  4. Reduce by 1 step, monitor for 1 week, repeat
  5. Set CloudWatch alarms before reducing (warn if > 70% CPU)
```

### Kubernetes cost right-sizing:
```bash
# Find pods with excessive resource requests vs actual usage
kubectl top pods -A | sort -k3 -h  # by memory
kubectl top pods -A | sort -k2 -h  # by CPU

# For pods with requests >> actual usage:
# requests: 2 CPU, actual: 0.3 CPU → 85% waste, reduce request

# Use VPA to auto-recommend (install: Vertical Pod Autoscaler)
kubectl vpa -n production recommend order-service \
  --v=2 \
  --min-replica=2 \
  --max-replica=5 \
  --update-mode=Auto
```

---

## COMPUTE_STRATEGY

### Instance type decision matrix:
```
STABLE WORKLOAD (web servers, APIs — always running):
  → Reserved Instances or Savings Plans
  → 1yr commitment: ~40% savings vs on-demand
  → 3yr commitment: ~60% savings
  → "No upfront" means you pay monthly, "All upfront" means you pay once

VARIABLE WORKLOAD (dev servers, batch jobs):
  → Spot instances (60-70% cheaper)
  → Use with: Kubernetes pod disruption budgets, Spot termination handlers
  → Don't use for: databases, stateful workloads, anything requiring 100% uptime

BURST WORKLOAD (CI/CD runners, periodic processing):
  → T3/T4g burstable instances
  → Enable "unlimited" mode if sustained CPU needed
  → Cost: base price + burst CPU credits
  → Good for: CI runners, dev servers, low-traffic cron jobs

MACHINE LEARNING / GPU:
  → Use spot + GPU instances (g4dn, p3, p4)
  → Spot savings: up to 70% vs on-demand
  → Consider: Kubernetes + Karpenter for GPU node provisioning
```

### Cost comparison example:
```
Processing job running 100 hours/month:
  t3.large on-demand: $50.42/mo
  t3.large spot (60% off): $20.17/mo
  Lambda (4 vCPU equivalent, 400GB-s compute): ~$0.50-2/mo (if truly serverless-appropriate)

RULE: If you need more than 4+ instances always running, Reserved beats on-demand.
      If you need 1-3 instances, t3 burstable on-demand + stop/start cycle.
      If you need more than 20 instances, talk to AWS about Savings Plans + Enterprise Discount Program.
```

---

## COST_MONITORING

### AWS Cost Anomaly Detection:
```
Enable: AWS Cost Explorer → Anomaly Detection
- Set: Daily budget threshold alert (notify at 80% of budget)
- Set: Alert for any single service > $X unexpected spike
```

### Budget setup:
```
/aws/cost/monthly-forecast  → alert when projected cost > $X
/aws/cost/service-spike     → alert when any service > $Y day-over-day increase
/aws/cost/unused-resources  → weekly report on idle resources
```

### Kubernetes cost monitoring (Kubecost):
```
kubectl apply -f https://github.com/kubecost/cost-analyzer-helm-chart/releases/latest/download/kubecost.yaml

# Then:
kubectl port-forward -n kubecost svc/cost-analyzer 9090
# Open: http://localhost:9090

# View: cost by namespace, deployment, service
# Waste: idle resources, over-provisioned pods
# Savings: right-sizing recommendations
```

### Monthly cloud cost review agenda:
```
1. Total spend vs last month (variance)
2. Top 5 cost drivers (service/resource level)
3. Unused resources found (and cleaned up)
4. Rightsizing changes made
5. Reserved/Savings Plan coverage %
6. Cost anomaly alerts (any false positives?)
7. Next month's forecast
```
