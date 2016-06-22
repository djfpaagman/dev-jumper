chrome.commands.onCommand.addListener(function(command) {
  if (command === "jump-to-from-dev") {
    jumpToOrFromDev();
  }
});

function jumpToOrFromDev() {
  chrome.tabs.query({ active: true }, function(tab) {
    active_tab = tab[0];
    url = parseUrl(active_tab.url);

    if (isDevEnv(url.hostname)) {
      // Switch to production
      url.hostname = url.hostname.slice(0, -4);
      url.protocol = "https:";
      url.port = "443";
    } else {
      // Switch to development
      url.hostname = url.hostname.concat(".dev");
      url.protocol = "http:";
      url.port = "3000";
    }

    // Change the URL of the active tab to other environment
    chrome.tabs.update(active_tab.id, { url: url.href });
  });
}

function parseUrl(url) {
  // Parses the URL so we can access each element (hostname, protocol, port)
  // individually without using stuff like regex magic.
  var parser = document.createElement("a");
  parser.href = url;

  return parser;
}

function isDevEnv(hostname) {
  // A hostname is consider the dev environment when it ends with .dev
  return (hostname.slice(-4) === ".dev")
}
