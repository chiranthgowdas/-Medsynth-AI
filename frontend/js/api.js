/**
 * MediSynth.AI — API Client
 */
const API_BASE = '/api';

const api = {
  async _fetch(url, options = {}) {
    try {
      const res = await fetch(`${API_BASE}${url}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`);
      return data;
    } catch (e) {
      console.error(`API Error [${url}]:`, e);
      throw e;
    }
  },

  // Data
  async uploadFile(file) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API_BASE}/data/upload`, { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Upload failed');
    return data;
  },
  async loadSample() { return this._fetch('/data/sample'); },
  async listDatasets() { return this._fetch('/data/list'); },
  async getDatasetInfo(id) { return this._fetch(`/data/info/${id}`); },

  // Generation (async with polling)
  async generate(params) {
    // Start generation — returns immediately with job_id
    const startRes = await this._fetch('/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    const jobId = startRes.data.job_id;
    if (!jobId) throw new Error('No job ID returned');

    // Poll for completion
    return this._pollJob(jobId);
  },

  async _pollJob(jobId, maxWaitMs = 600000) {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 seconds

    while (Date.now() - startTime < maxWaitMs) {
      await new Promise(r => setTimeout(r, pollInterval));

      try {
        const res = await this._fetch(`/generate/status/${jobId}`);
        const job = res.data;

        // Update progress indicator if available
        if (window._onGenerationProgress) {
          window._onGenerationProgress(job.progress || 0, job.status);
        }

        if (job.status === 'completed' && job.result) {
          return { status: 'success', data: job.result };
        } else if (job.status === 'failed') {
          throw new Error(job.error || 'Generation failed');
        }
        // else still running, continue polling
      } catch (e) {
        if (e.message.includes('Generation failed') || e.message.includes('failed')) {
          throw e;
        }
        // Network error, retry
        console.warn('Poll error, retrying...', e);
      }
    }

    throw new Error('Generation timed out after 10 minutes');
  },

  async listJobs() { return this._fetch('/generate/jobs'); },
  downloadUrl(jobId) { return `${API_BASE}/generate/download/${jobId}`; },

  // Privacy
  async getPrivacyBudget(dsId) { return this._fetch(`/privacy/budget/${dsId}`); },
  async listBudgets() { return this._fetch('/privacy/budgets'); },

  // Validation
  async validateStatistical(params) {
    return this._fetch('/validate/statistical', { method: 'POST', body: JSON.stringify(params) });
  },
  async validateML(params) {
    return this._fetch('/validate/ml', { method: 'POST', body: JSON.stringify(params) });
  },

  // Attacks
  async simulateAttacks(params) {
    return this._fetch('/attacks/simulate', { method: 'POST', body: JSON.stringify(params) });
  },

  // Federated
  async createFederation(params) {
    return this._fetch('/federated/create', { method: 'POST', body: JSON.stringify(params) });
  },
  async addHospital(fedId, name, file) {
    const fd = new FormData();
    fd.append('federation_id', fedId);
    fd.append('hospital_name', name);
    fd.append('file', file);
    const res = await fetch(`${API_BASE}/federated/add-hospital`, { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed');
    return data;
  },
  async federatedTrain(params) {
    return this._fetch('/federated/train', { method: 'POST', body: JSON.stringify(params) });
  },
  async federatedGenerate(params) {
    return this._fetch('/federated/generate', { method: 'POST', body: JSON.stringify(params) });
  },
  async listFederations() { return this._fetch('/federated/list'); },
};
