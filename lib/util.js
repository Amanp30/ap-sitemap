module.exports = { isValidUrl, urlWithoutIndexExtension };

function isValidUrl(url) {
  try {
    new URL(url); // Use the URL constructor to validate the format
    return true;
  } catch (e) {
    return false;
  }
}

function urlWithoutIndexExtension(url) {
  return url.replace(/\/index\.[a-zA-Z0-9]+$/g, "");
}
