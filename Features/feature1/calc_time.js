function getTimes (){
    const roadA1 = getRandomInt(0, 100);
    const roadA2 = getRandomInt(0, 100);
    const roadB1 = getRandomInt(0, 100);
    const roadB2 = getRandomInt(0, 100);

    // number of cars in lines A&B
    const carsInLineA = roadA1 + roadA2;
    const carsInLineB = roadB1 + roadB2;

    // calculate flow period (time in every traffic)
    const LineATime = parseInt(((carsInLineA / (carsInLineA + carsInLineB)) * 40) + 10, 10);
    const LineBTime = 60 - LineATime;

    return { LineATime, LineBTime };
}

function getRandomInt(min, max) {
    const newMin = Math.ceil(min);
    const newMax = Math.floor(max);
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (newMax - newMin)) + newMin;
}

module.exports = getTimes;
