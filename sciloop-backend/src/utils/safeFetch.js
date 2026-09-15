const DEFAULT_TIMEOUT_MS = Number(process.env.DEFAULT_TIMEOUT_MS || 12000);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status) {
  return status >= 500 && status <= 599;
}

function isQuotaStatus(status) {
  return [402, 403, 429].includes(status);
}

function looksLikeQuotaMessage(text = "") {
  return /quota|rate.?limit|too many requests|billing|payment|required|exceeded/i.test(text);
}

export async function safeFetch(providerId, url, options = {}, config = {}) {
  const timeoutMs = Number(config.timeoutMs || DEFAULT_TIMEOUT_MS);
  const retries = Number(config.retries ?? 1);
  let lastResult = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timer);

      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      const providerMessage = data?.error?.message || data?.message || text.slice(0, 280);
      const reason = response.ok ? "" : providerMessage;
      const result = {
        ok: response.ok,
        providerId,
        status: response.status,
        data,
        text,
        reason,
        quotaError: isQuotaStatus(response.status) || looksLikeQuotaMessage(providerMessage),
        retryable: isRetryableStatus(response.status)
      };

      console.log(`[safeFetch] ${providerId} status=${response.status}${reason ? ` reason=${reason}` : " ok"}`);

      if (result.ok || result.quotaError || !result.retryable || attempt === retries) {
        return result;
      }

      lastResult = result;
      await sleep(250 * (attempt + 1));
    } catch (error) {
      clearTimeout(timer);
      const timedOut = error?.name === "AbortError";
      lastResult = {
        ok: false,
        providerId,
        status: 0,
        data: null,
        text: "",
        reason: timedOut ? `Timed out after ${timeoutMs}ms` : (error?.message || String(error)),
        quotaError: false,
        retryable: true,
        timedOut
      };

      console.warn(`[safeFetch] ${providerId} network=${lastResult.reason}`);

      if (attempt === retries) {
        return lastResult;
      }

      await sleep(250 * (attempt + 1));
    }
  }

  return lastResult || {
    ok: false,
    providerId,
    status: 0,
    data: null,
    text: "",
    reason: "Unknown fetch failure",
    quotaError: false,
    retryable: false
  };
}
