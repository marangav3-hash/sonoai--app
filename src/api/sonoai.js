import { API_BASE } from "../config";
const h = (token) => ({ "Authorization": "Bearer "+token, "Content-Type": "application/json" });
export const api = {
  async health() { return (await fetch(API_BASE+"/health")).json(); },
  async uploadScan(token, fileUri, scanMode, indication) {
    const form = new FormData();
    form.append("file", { uri: fileUri, name: "scan.dcm", type: "application/dicom" });
    form.append("scan_mode", scanMode || "B-mode");
    form.append("indication", indication || "OB-biometry");
    const res = await fetch(API_BASE+"/scans/upload", { method: "POST", headers: { "Authorization": "Bearer "+token }, body: form });
    return res.json();
  },
  async getScan(token, scanId) { return (await fetch(API_BASE+"/scans/"+scanId, { headers: h(token) })).json(); },
  async getResult(token, scanId) { const res = await fetch(API_BASE+"/scans/"+scanId+"/result", { headers: h(token) }); if (res.status === 404) return null; return res.json(); },
  async listScans(token) { return (await fetch(API_BASE+"/scans", { headers: h(token) })).json(); },
  async pollResult(token, scanId, maxWait) {
    const start = Date.now();
    while (Date.now() - start < (maxWait || 60000)) {
      const scan = await this.getScan(token, scanId);
      if (scan.status === "done") return await this.getResult(token, scanId);
      if (scan.status === "error") throw new Error("Inference failed");
      await new Promise(r => setTimeout(r, 2000));
    }
    throw new Error("Timed out");
  },
};
