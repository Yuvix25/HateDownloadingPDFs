/**
 * Convert an ArrayBuffer to a base64 encoded string.
 * @param {ArrayBuffer} buffer
 * @return {string}
 */
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Open a PDF file from URL in a new tab.
 * @param {string} url
 */
async function openPDFInTab(url) {
  console.log(url);

  if (url.startsWith('blob:')) {
    return chrome.tabs.create({url: url});
  }

  const response = await fetch(url);

  const newUrl = 'data:application/pdf;base64,' + arrayBufferToBase64(await response.arrayBuffer());
  chrome.tabs.create({url: newUrl});
}

chrome.downloads.onCreated.addListener((downloadItem) => {
  console.log(downloadItem);
  if (downloadItem.mime === 'application/pdf') {
    chrome.downloads.cancel(downloadItem.id);
  }

  openPDFInTab(downloadItem.finalUrl);
});
