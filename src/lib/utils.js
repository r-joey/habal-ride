
export function calculateBounds(lat, lng, radiusInKm) {
  if (!lat || !lng || !radiusInKm) {
      return null;
  }
  const earthRadiusKm = 6371;
  const dLat = radiusInKm / earthRadiusKm;
  const dLng = radiusInKm / (earthRadiusKm * Math.cos((Math.PI * lat) / 180));

  return {
      minLat: lat - dLat * (180 / Math.PI),
      maxLat: lat + dLat * (180 / Math.PI),
      minLng: lng - dLng * (180 / Math.PI),
      maxLng: lng + dLng * (180 / Math.PI),
  };
}


















export const motorcycle_brands = [
    {
      "brand": "Honda",
      "models": [
        "Click 125i",
        "ADV160",
        "CBR150R",
        "TMX125 Alpha",
        "X-ADV"
      ]
    },
    {
      "brand": "Yamaha",
      "models": [
        "Aerox 155",
        "Nmax",
        "Mio i 125",
        "YZF-R15",
        "XSR155"
      ]
    },
    {
      "brand": "Suzuki",
      "models": [
        "Raider R150 Fi",
        "GSX-R150",
        "Burgman Street 125",
        "Address 110",
        "Skydrive Sport"
      ]
    },
    {
      "brand": "Kawasaki",
      "models": [
        "Dominar 400",
        "Rouser NS160",
        "KLX150BF",
        "Z400",
        "Ninja 400"
      ]
    },
    {
      "brand": "KTM",
      "models": [
        "Duke 200",
        "RC 390",
        "790 Adventure",
        "250 Adventure",
        "1290 Super Duke R"
      ]
    },
    {
      "brand": "Harley-Davidson",
      "models": [
        "Iron 883",
        "Street Glide",
        "Fat Boy",
        "Road King",
        "Sportster S"
      ]
    },
    {
      "brand": "Royal Enfield",
      "models": [
        "Classic 350",
        "Meteor 350",
        "Himalayan",
        "Bullet 500",
        "Interceptor 650"
      ]
    },
    {
      "brand": "CFMoto",
      "models": [
        "300NK",
        "650GT",
        "700CL-X",
        "150NK",
        "MT800"
      ]
    },
    {
      "brand": "Rusi",
      "models": [
        "Classic 250",
        "KR150",
        "Chariot",
        "Sigma 250",
        "Flash 125"
      ]
    },
    {
      "brand": "TVS",
      "models": [
        "Apache RTR 200",
        "Neo XR",
        "Dazz",
        "XL 100",
        "Max 125"
      ]
    },
    {
      "brand": "Bajaj",
      "models": [
        "CT100",
        "Pulsar 150",
        "Dominar 250",
        "Avenger Street 160",
        "Discover 125"
      ]
    },
    {
      "brand": "SYM",
      "models": [
        "Jet X 150",
        "Maxsym 400i",
        "Crox 125",
        "RV1-2",
        "Fiddle 125"
      ]
    },
    {
      "brand": "Piaggio",
      "models": [
        "Vespa S 125",
        "Vespa Primavera 150",
        "Vespa GTS 300",
        "MP3 500",
        "Liberty 150"
      ]
    },
    {
      "brand": "Benelli",
      "models": [
        "TRK 502",
        "Leoncino 500",
        "302S",
        "TNT 135",
        "Imperiale 400"
      ]
    },
    {
      "brand": "MotorStar",
      "models": [
        "Xplorer Z150",
        "Cafe 400",
        "MSX 150X",
        "Nicess 110",
        "Moto X155"
      ]
    },
    {
      "brand": "Kymco",
      "models": [
        "Like 125 Italia",
        "X-Town 300i",
        "AK550",
        "Super Z 150",
        "KRV 180i"
      ]
    }
  ] 