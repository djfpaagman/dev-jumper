chrome.commands.onCommand.addListener(function(command) {
  switch(command) {
    case "jump-to-from-dev":
      jumpToOrFromDev();
      break;
  }
});

function jumpToOrFromDev(direction) {
  chrome.tabs.query({ active: true }, function(tab) {
    active_tab = tab[0];
    url = parseUrl(active_tab.url);
    id = active_tab.id;

    if (isDevEnv(url.hostname)) {
      // Switch to production
      url.hostname = url.hostname.substring(0, url.hostname.length - 4);
      url.protocol = "https:";
      url.port = "443";
    } else {
      // Switch to development
      url.hostname = url.hostname.concat(".dev");
      url.protocol = "http:";
      url.port = "3000";
    }

    chrome.tabs.update(id, { url: url.href });
  });
}

function parseUrl(url) {
  var parser = document.createElement("a");
  parser.href = url;

  return parser;
}

function isDevEnv(hostname) {
  return (hostname.substr(hostname.length - 4) === ".dev")
}
