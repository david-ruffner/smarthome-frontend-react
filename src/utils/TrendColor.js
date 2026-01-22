export class TrendColor {
    constructor(color) {
        // color = 'rgba(218, 102, 123)'
        let colorVal = color.split(/\(/)[1].split(/\)/)[0];
        this.frostedGlassColor = `rgba(${colorVal}, 0.35)`;
        this.fullColor = `rgba(${colorVal}, 1)`;
    }
}