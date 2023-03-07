function create_icon(char = "a", color = "black", back_color = "black") {
    const canvas = new OffscreenCanvas(128, 128), ctx = canvas.getContext("2d");
    ctx.fillStyle = back_color;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = color;
    ctx.font = "128px sans-serif";
    ctx.fillText(char, 0, 100);
    return ctx.getImageData(0, 0, 128, 128);
}
function change_icon(tab) {
    try {
        const url = new URL(tab.url);
        const tld_list = {
            gov: {
                tlds: [".go.jp", ".lg.jp", ".gov"],
                char: "g",
                color: "black",
                back_color: "green"
            },
            edu: {
                tlds: [".ac.jp"],
                char: "e",
                color: "black",
                back_color: "red"
            },
            com: {
                tlds: [".co.jp"],
                char: "c",
                color: "black",
                back_color: "gold"
            }
        }
        let char, color, back_color;
        Object.values(tld_list).forEach((value) => {
            value.tlds.forEach((tld) => {
                if (url.hostname.endsWith(tld)) {
                    char = value.char, color = value.color, back_color = value.back_color;
                }
            });
        });
        chrome.action.setIcon({
            imageData: create_icon(char, color, back_color)
        });
        chrome.action.setTitle({ title: url.origin });
    }
    catch (e) {
        chrome.action.setIcon({
            imageData: create_icon()
        });
        chrome.action.setTitle({ title: "error" });
    }
}
chrome.windows.onFocusChanged.addListener((windowId) => {
    chrome.tabs.query({ windowId: windowId, active: true }, (tabs) => { change_icon(tabs[0]) });
});
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => { change_icon(tab); });
});
chrome.tabs.onUpdated.addListener((tabid, changeInfo, tab) => {
    change_icon(tab);
});