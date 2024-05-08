export class HospitalObject {
    constructor(_name, _loc, _landline, _dist, _icon, _image, _hours, _svc = []) {
        this.name = _name;
        this.location = _loc;

        this.landline = _landline;
        this.distance = _dist;

        this.icon = _icon;
        this.image = _image;

        this.hours = _hours;
        this.services = _svc;
    }
}