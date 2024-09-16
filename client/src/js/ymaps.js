import { getBanks } from './api.js';

let ymaps;

export const createMap = async (container, center, zoom) => {
  let coordArr = [];
  getBanks().then((res) => {
    res.payload.forEach((responce) => {
      const placeArr = [responce.lat, responce.lon];
      coordArr.push(placeArr);
    });
  });

  ymaps = (await import('ymaps')).default;

  return new Promise((res) => {
    ymaps.ready(async () => {
      const map = new ymaps.Map(
        container,
        {
          center: center,
          zoom: zoom,
        },
        zoom,
      );

      for (let i = 0; i < coordArr.length; i++) {
        let placemark = new ymaps.Placemark(coordArr[i], {}, []);
        map.geoObjects.add(placemark);
      }

      map.controls.remove('geolocationControl');
      map.controls.remove('zoomControl');
      map.controls.remove('fullscreenControl');
    });
  });
};
