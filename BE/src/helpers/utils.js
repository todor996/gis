const calcCrow =(latitude1, lon1, latitude2, lon2) =>
{
    var R = 6371; // km
    var dLat = toRad(latitude2-latitude1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(latitude1);
    var lat2 = toRad(latitude2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d*1000;
}

// Converts numeric degrees to radians
const toRad = (Value) =>
{
    return Value * Math.PI / 180;
}
module.exports = {
    calcCrow
};
