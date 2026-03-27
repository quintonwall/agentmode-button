(function () {
  'use strict';

  // Prevent double initialization
  if (window.__POSTMAN_BUTTON_LOADED) return;
  window.__POSTMAN_BUTTON_LOADED = true;

  // ── Constants ──────────────────────────────────────────────────────
  var SELECTOR = '.postman-button';
  var ACTIONS = {
    AGENT_PROMPT: 'agent/prompt',
    COLLECTION_FORK: 'collection/fork'
  };
  var AGENT_BASE_URL = 'https://go.postman.co/redirect/workspace';
  var FORK_BASE_URL = 'https://god.gw.postman.com/run-collection';
  var DEFAULT_UTM_CAMPAIGN = 'postman-button';
  var UTM_MEDIUM = 'agent-mode-button';

  // Postman brand orange
  var POSTMAN_ORANGE = '#FF6C37';

  // ── SVG Icon Paths ─────────────────────────────────────────────────
  // Sparkle icon for Agent Mode (16x16 viewBox)
  var SPARKLE_ICON =
    'M8 0l1.796 5.204L15 7l-5.204 1.796L8 14l-1.796-5.204L1 7l5.204-1.796z' +
    'M13 10l.898 2.602L16 13.5l-2.102.898L13 17l-.898-2.602L10 13.5l2.102-.898z';

  // Fork icon (16x16 viewBox)
  var FORK_ICON =
    'M5 3.25a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zM2.5 5A2.5 2.5 0 0 1 5 2.5 2.5 2.5 0 0 1 7.5 5c0 ' +
    '1.066-.67 1.977-1.612 2.334C5.96 8.348 6.828 9 8 9c1.172 0 2.04-.652 2.112-1.666A2.501 2.501 0 0 1 ' +
    '11 2.5a2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1-1.888 2.424C11.4 9.508 9.86 10.5 8 10.5s-3.4-.992-3.612-3.076A2.501 ' +
    '2.501 0 0 1 2.5 5zm8.5-1.75a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zM8 12a2.5 2.5 0 0 1 2.5 2.5 ' +
    '2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 8 12zm0 1.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z' +
    'M8 10v2.5';

  // ── Utility: Read data attributes ──────────────────────────────────
  function readConfig(el) {
    var config = {};
    var attrs = el.attributes;
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (attr.name.indexOf('data-postman-') === 0) {
        var key = attr.name
          .replace('data-postman-', '')
          .replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
        config[key] = attr.value;
      }
    }
    return config;
  }

  // ── Utility: Get embedding page hostname for utm_source ────────────
  function getUtmSource() {
    try {
      return window.location.hostname || 'unknown';
    } catch (e) {
      return 'unknown';
    }
  }

  // ── Utility: Get full page URL for utm_content ─────────────────────
  function getUtmContent() {
    try {
      return window.location.href || '/';
    } catch (e) {
      return '/';
    }
  }

  // ── Utility: Escape HTML for SVG text content ──────────────────────
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Utility: Encode prompt to match Postman's format ────────────────
  // Postman templates use: btoa(encodeURIComponent(prompt))
  // i.e. URL-encode first, then Base64-encode the result
  function encodePrompt(str) {
    return btoa(encodeURIComponent(str));
  }

  // ── URL Builder: Agent Mode ────────────────────────────────────────
  // Builds the URL to match the exact format used on
  // https://www.postman.com/templates/agent-mode/
  function buildAgentUrl(config) {
    var encodedPrompt = encodePrompt(config.agentPrompt || '');
    var autoSend = config.autoSend === 'true' ? 'true' : 'false';
    var campaign = encodeURIComponent(config.utmCampaign || DEFAULT_UTM_CAMPAIGN);

    // Construct URL manually to avoid searchParams re-encoding the Base64
    return AGENT_BASE_URL +
      '?agentPrompt=' + encodedPrompt +
      '&sideView=agentMode' +
      '&autoSend=' + autoSend +
      '&recentlyVisited=true' +
      '&utm_source=' + encodeURIComponent(getUtmSource()) +
      '&utm_medium=' + UTM_MEDIUM +
      '&utm_campaign=' + campaign +
      (config.utmContent !== 'false' ? '&utm_content=' + encodeURIComponent(getUtmContent()) : '');
  }

  // ── URL Builder: Fork Collection ───────────────────────────────────
  // Opens the standard Run in Postman flow which prompts the user
  // to choose a destination workspace in the Postman app.
  function buildForkUrl(config) {
    var collectionId = config.collectionId || '';
    var campaign = encodeURIComponent(config.utmCampaign || DEFAULT_UTM_CAMPAIGN);

    return FORK_BASE_URL + '/' + collectionId +
      '?action=collection%2Ffork' +
      '&source=rip_html' +
      '&utm_source=' + encodeURIComponent(getUtmSource()) +
      '&utm_medium=' + UTM_MEDIUM +
      '&utm_campaign=' + campaign +
      (config.utmContent !== 'false' ? '&utm_content=' + encodeURIComponent(getUtmContent()) : '');
  }

  // ── SVG Badge Renderer ─────────────────────────────────────────────
  function createBadgeSvg(label, theme, action) {
    var isDark = theme !== 'light';
    var bgColor = isDark ? POSTMAN_ORANGE : '#FFFFFF';
    var textColor = isDark ? '#FFFFFF' : POSTMAN_ORANGE;
    var borderColor = POSTMAN_ORANGE;
    var strokeWidth = isDark ? 0 : 1;

    // Approximate text width (6.5px per char at 11px font)
    var textWidth = label.length * 6.5;
    var iconAreaWidth = 28;
    var paddingRight = 10;
    var totalWidth = Math.ceil(iconAreaWidth + textWidth + paddingRight);
    var height = 30;
    var radius = 5;

    var iconPath = action === ACTIONS.AGENT_PROMPT ? SPARKLE_ICON : FORK_ICON;
    var iconViewBox = action === ACTIONS.AGENT_PROMPT ? '0 0 16 17' : '0 0 16 17';

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + totalWidth + '" height="' + height + '" viewBox="0 0 ' + totalWidth + ' ' + height + '">' +
        '<rect rx="' + radius + '" ry="' + radius + '" width="' + totalWidth + '" height="' + height + '" ' +
          'fill="' + bgColor + '" stroke="' + borderColor + '" stroke-width="' + strokeWidth + '"/>' +
        '<g transform="translate(8, 7)">' +
          '<svg width="16" height="16" viewBox="' + iconViewBox + '">' +
            '<path d="' + iconPath + '" fill="' + textColor + '" fill-rule="evenodd"/>' +
          '</svg>' +
        '</g>' +
        '<text x="' + iconAreaWidth + '" y="' + (height / 2 + 1) + '" ' +
          'fill="' + textColor + '" ' +
          'font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif" ' +
          'font-size="11" font-weight="600" dominant-baseline="middle">' +
          escapeHtml(label) +
        '</text>' +
      '</svg>';

    return svg;
  }

  // ── Render a single button ─────────────────────────────────────────
  function renderButton(container) {
    // Skip if already rendered
    if (container.getAttribute('data-postman-rendered')) return;

    var config = readConfig(container);
    var action = config.action;

    if (!action) {
      console.warn('[PostmanButton] Missing data-postman-action on element:', container);
      return;
    }

    var url, defaultLabel;

    if (action === ACTIONS.AGENT_PROMPT) {
      if (!config.agentPrompt) {
        console.warn('[PostmanButton] Missing data-postman-agent-prompt for agent/prompt action');
        return;
      }
      url = buildAgentUrl(config);
      defaultLabel = 'Try in Agent Mode';
    } else if (action === ACTIONS.COLLECTION_FORK) {
      if (!config.collectionId) {
        console.warn('[PostmanButton] Missing data-postman-collection-id for collection/fork action');
        return;
      }
      url = buildForkUrl(config);
      defaultLabel = 'Run in Postman';
    } else {
      console.warn('[PostmanButton] Unknown action: ' + action);
      return;
    }

    var label = config.buttonLabel || defaultLabel;
    var theme = config.buttonTheme || 'dark';

    // Create anchor element
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.display = 'inline-block';
    anchor.style.textDecoration = 'none';
    anchor.style.cursor = 'pointer';
    anchor.style.transition = 'opacity 0.15s ease';
    anchor.innerHTML = createBadgeSvg(label, theme, action);
    anchor.setAttribute('aria-label', label);

    // Hover effect
    anchor.addEventListener('mouseenter', function () {
      this.style.opacity = '0.85';
    });
    anchor.addEventListener('mouseleave', function () {
      this.style.opacity = '1';
    });

    container.appendChild(anchor);
    container.appendChild(document.createElement('br'));
    container.setAttribute('data-postman-rendered', 'true');
  }

  // ── Initialize ─────────────────────────────────────────────────────
  function init() {
    var containers = document.querySelectorAll(SELECTOR);
    for (var i = 0; i < containers.length; i++) {
      renderButton(containers[i]);
    }
  }

  // Run on DOM ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
