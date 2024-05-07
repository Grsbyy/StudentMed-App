export function loadNewsFromJSON(callback) {
    fetch('https://doppio-320.github.io/studentmed/news.json')
        .then(response => response.text())
        .then((data) => {
            callback(JSON.parse(data));
        });
}