(function () {
  const KUMA_BASE = 'https://status.ndhansen.com';
  const STATUS_PAGE_SLUG = 'home';

  const FALLBACK_IDS = {
    sso: 5,
    wiki: 8,
    core: 7,
  };

  const statusEls = {
    public: document.querySelector('[data-kuma-key="public"]'),
    sso: document.querySelector('[data-kuma-key="sso"]'),
    wiki: document.querySelector('[data-kuma-key="wiki"]'),
    core: document.querySelector('[data-kuma-key="core"]'),
  };

  if (!statusEls.public && !statusEls.sso && !statusEls.wiki && !statusEls.core) {
    return;
  }

  function parseBadgeStatus(svgText) {
    const labelMatch = svgText.match(/aria-label="[^"]*:\s*([^"]+)"/i);
    return labelMatch ? labelMatch[1].trim() : 'Unknown';
  }

  function toTone(statusText) {
    const lowered = String(statusText).toLowerCase();
    if (lowered.includes('up')) return 'ok';
    if (lowered.includes('down')) return 'down';
    if (lowered.includes('maintenance') || lowered.includes('paused')) return 'warn';
    return 'unknown';
  }

  function setPill(el, label) {
    if (!el) return;
    const dot = el.querySelector('.dot');
    const value = el.querySelector('.status-value');
    const tone = toTone(label);

    if (dot) {
      dot.className = `dot ${tone}`;
    }
    if (value) {
      value.textContent = label;
    }
  }

  async function fetchMonitorStatus(monitorId) {
    const badgeUrl = `${KUMA_BASE}/api/badge/${monitorId}/status`;
    const res = await fetch(badgeUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Badge fetch failed (${res.status})`);
    }
    const svg = await res.text();
    return parseBadgeStatus(svg);
  }

  function resolveMonitorId(monitors, matcher, fallbackId) {
    const match = monitors.find((m) => matcher.test(String(m.name || '')));
    return match ? match.id : fallbackId;
  }

  async function resolveMonitorIds() {
    try {
      const res = await fetch(`${KUMA_BASE}/api/status-page/${STATUS_PAGE_SLUG}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Status-page fetch failed (${res.status})`);

      const data = await res.json();
      const monitors = (data.publicGroupList || []).flatMap((g) => g.monitorList || []);

      return {
        sso: resolveMonitorId(monitors, /authentik|sso/i, FALLBACK_IDS.sso),
        wiki: resolveMonitorId(monitors, /wiki|website/i, FALLBACK_IDS.wiki),
        core: resolveMonitorId(monitors, /homelab|systems|dc0\d/i, FALLBACK_IDS.core),
      };
    } catch (error) {
      console.warn('Could not resolve monitor IDs from status page API, using fallback IDs.', error);
      return FALLBACK_IDS;
    }
  }

  function aggregatePublicStatus(statuses) {
    const tones = statuses.map(toTone);
    if (tones.includes('down')) return 'Major Outage';
    if (tones.includes('warn')) return 'Maintenance';
    if (tones.includes('unknown')) return 'Unknown';
    return 'Operational';
  }

  async function refreshStatuses() {
    try {
      const ids = await resolveMonitorIds();
      const [ssoStatus, wikiStatus, coreStatus] = await Promise.all([
        fetchMonitorStatus(ids.sso),
        fetchMonitorStatus(ids.wiki),
        fetchMonitorStatus(ids.core),
      ]);

      setPill(statusEls.sso, ssoStatus);
      setPill(statusEls.wiki, wikiStatus);
      setPill(statusEls.core, coreStatus);
      setPill(statusEls.public, aggregatePublicStatus([ssoStatus, wikiStatus, coreStatus]));
    } catch (error) {
      console.error('Unable to load Uptime Kuma statuses.', error);
      setPill(statusEls.sso, 'Unavailable');
      setPill(statusEls.wiki, 'Unavailable');
      setPill(statusEls.core, 'Unavailable');
      setPill(statusEls.public, 'Unavailable');
    }
  }

  refreshStatuses();
  setInterval(refreshStatuses, 60000);
})();
