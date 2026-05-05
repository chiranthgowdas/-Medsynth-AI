"""Quick analysis of per-column quality scores."""
import requests
BASE = "http://127.0.0.1:8000/api"

# Load sample
r = requests.get(f"{BASE}/data/sample").json()
ds = r["data"]["dataset_id"]

# Generate
g = requests.post(f"{BASE}/generate", json={
    "dataset_id": ds, "num_rows": 500, "model_type": "statistical",
    "epsilon": 1.0, "apply_dp": True
}).json()
job_id = g["data"]["job_id"]

# Validate
v = requests.post(f"{BASE}/validate/statistical", json={
    "dataset_id": ds, "synthetic_job_id": job_id
}).json()
d = v["data"]

print(f"\nOverall: {d['overall_quality_score']}/100 ({d['quality_grade']})")
print(f"Correlation MAE: {d['correlation']['mean_absolute_error']}\n")

for col, rep in d["column_reports"].items():
    ks = rep.get("ks_test", {})
    mv = rep.get("mean_variance", {})
    print(f"  {col}: quality={rep['quality_score']}, "
          f"ks_stat={ks.get('statistic','N/A')}, "
          f"mean_dev={mv.get('mean_deviation_pct','N/A')}%, "
          f"var_ratio={mv.get('variance_ratio','N/A')}")

# Re-ID details
a = requests.post(f"{BASE}/attacks/simulate", json={
    "dataset_id": ds, "synthetic_job_id": job_id
}).json()
reid = a["data"]["attacks"]["reidentification"]
print(f"\nRe-ID: DCR ratio={reid.get('dcr_ratio','N/A')}, "
      f"at_risk={reid['records_at_risk_pct']}%, "
      f"privacy_gain={reid.get('privacy_gain_pct','N/A')}%, "
      f"risk={reid['risk_level']}")
