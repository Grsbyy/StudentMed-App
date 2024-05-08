export async function loadNewsFromWeb(goodCallback, badCallback) {
    fetch('https://doppio-320.github.io/studentmed/news.json')
        .then((response) => {
            if(response.ok) {
                return response.text();
            }

            badCallback();
            throw new Error('Something went wrong while fetching news!');
        })
        .then((data) => {
            goodCallback(JSON.parse(data));
        });
}

export async function loadHospitalsFromWeb(goodCallback, badCallback) {
    fetch('https://doppio-320.github.io/studentmed/hospitals.json')
        .then((response) => {
            if(response.ok) {
                return response.text();
            }

            badCallback();
            throw new Error('Something went wrong while fetching news!');
        })
        .then((data) => {
            goodCallback(JSON.parse(data));
        });
}