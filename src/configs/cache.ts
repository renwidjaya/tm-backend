import NodeCache from "node-cache";

// Konfigurasi cache (TTL = 60 detik)
const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 60,
  useClones: false,
});

export default cache;
