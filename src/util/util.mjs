function leftPadZero(num, padLength) {
    const n = Math.abs(num);
    const zeros = Math.max(0, padLength - Math.floor(n).toString().length);
    let zeroString = (10 ** zeros).toString().substr(1);

    if (num < 0) {
        zeroString = "-" + zeroString;
    }

    return zeroString + n;
}

function generateShipmentDate(){
    const currentDate = new Date();

    if (currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 2)
    }

    if (currentDate.getDay() === 0) {
        currentDate.setDate(currentDate.getDate() + 1)
    }
    const year = currentDate.getFullYear();
    const month = leftPadZero(currentDate.getMonth() + 1, 2);
    const day = leftPadZero(currentDate.getDate(), 2);
    return year + "-" + month + "-" + day;

}

export default {
    leftPadZero,
  generateShipmentDate
};