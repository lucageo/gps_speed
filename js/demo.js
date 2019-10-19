(function ($) {
    'use strict';

    function Demo(mapId, multiOptionsKey, speedId) {
        this.mapId = mapId;
        this.selected = multiOptionsKey || 'speed';
        this.speedId = speedId;
    }

    Demo.prototype = {
        constructor: Demo,

        trackPointFactory: function (data) {

            return data.features.map(function (item) {

                //console.log(item);
                var proj = L.CRS.EPSG3857;
                var trkpt = proj.unproject(new L.Point(item.geometry.coordinates[0], item.geometry.coordinates[1]));

                //console.log(trkpt);
                trkpt.meta = item.properties;
                return trkpt;

            });
        },

        loadData: function (name) {
            var me = this;

            $.getJSON('https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/gpsData/FeatureServer/0/query?where=Source='+name+'&outFields=*&f=geojson', function (data) {
                me.trackPoints = me.trackPointFactory(data);
                me.showMapAndTrack()

            });
        },

        _multiOptions: {

          speed1: {
            optionIdxFn: function (latLng, prevLatLng) {
              //console.log(latLng);
                var i, speed, speedThresholds = [10, 15, 20, 25, 30, 35, 40, 50];

                speed = latLng.distanceTo(prevLatLng); // meters
                speed /= (latLng.meta.time - prevLatLng.meta.time) / 1000; // m/s
                speed *= 3.6; // km/h

                for (i = 0; i < speedThresholds.length; ++i) {
                    if (speed <= speedThresholds[i]) {
                        return i;
                    }
                }
                return speedThresholds.length;
            }
          },


            speed: {
                optionIdxFn: function (latLng, prevLatLng) {
                  //console.log(latLng);
                    var i, speed, speedThresholds = [1, 3, 5, 7, 9, 11, 13, 20];

                    speed = latLng.distanceTo(prevLatLng); // meters
                    speed /= (latLng.meta.time - prevLatLng.meta.time) / 1000; // m/s
                    speed *= 3.6; // km/h

                    for (i = 0; i < speedThresholds.length; ++i) {
                        if (speed <= speedThresholds[i]) {
                            return i;
                        }
                    }
                    return speedThresholds.length;
                },
                options: [
                    {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                    {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                    {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
                ]
            },

        },

        showMapAndTrack: function () {
            var me = this,
                points = me.trackPoints;

            if (!me.map) {
                me.map = L.map(me.mapId, {
                    layers: MQ.mapLayer()
                });

                me.speedId = speed1
                console.log(me.speedId);

            }

            if (me.visibleTrack) {
                me.map.removeLayer(me.visibleTrack);
            }

            me.visibleTrack = L.featureGroup();

            // create a polyline from an arrays of LatLng points
            var polyline = L.multiOptionsPolyline(points, {
                multiOptions: me._multiOptions[me.selected],
                weight: 3,
                lineCap: 'round',
                opacity: 0.7,
                smoothFactor: 10}).addTo(me.visibleTrack);
            // zoom the map to the polyline
            me.map.fitBounds(polyline.getBounds());
            me.visibleTrack.addTo(me.map);
        }

    };



    new Demo('map12', 'speed', 'speed12').loadData('00012');
    new Demo('map11', 'speed', 'speed11').loadData('00011');
    new Demo('map10', 'speed', 'speed10').loadData('00010');
    new Demo('map9',  'speed', 'speed9').loadData('00009');
    new Demo('map8',  'speed', 'speed8').loadData('00008');
    new Demo('map7',  'speed', 'speed7').loadData('00007');
    new Demo('map6',  'speed', 'speed6').loadData('00006');
    new Demo('map5',  'speed', 'speed5').loadData('00005');
    new Demo('map4',  'speed', 'speed4').loadData('00004');
    new Demo('map3',  'speed', 'speed3').loadData('00003');
    new Demo('map2',  'speed', 'speed2').loadData('00002');
    new Demo('map1',  'speed', 'speed1').loadData('00001');


})(Zepto);
