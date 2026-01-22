// export class CustomStyle {
//     constructor(propName, propValue, isImportant) {
//         this.propName = propName;
//         this.propValue = propValue;
//         this.isImportant = isImportant;
//     }
//
//     getStyleObj() {
//         let propVal = (this.isImportant) ? `${this.propValue} !important` : this.propValue;
//
//         return {
//             [this.propName]: propVal
//         }
//     }
// }
//
// export function reduceCustomStyles(customStyles) {
//     return customStyles.reduce((acc, style) => {
//         const value = style.isImportant
//             ? `${style.propValue} !important`
//             : style.propValue;
//
//         acc[style.propName] = value;
//         return acc;
//     }, {});
// }