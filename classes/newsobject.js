export class NewsObject {
    constructor(_title, _date, _uploader, _teaser, _body, _pImgSrc = null, _images = []) {
        this.title = _title;
        this.date = _date;
        this.uploader = _uploader;

        this.previewImgSrc = _pImgSrc;        

        this.teaserText = _teaser;
        this.body = _body;

        this.images = _images;
    }

    getTitle() {
        return this.title;
    }

    getDate() {
        return this.date;
    }

    getTeaser() {
        return this.teaserText;
    }

    getBody() {
        return this.body;
    }

    getImages() {
        return this.images;
    }
}