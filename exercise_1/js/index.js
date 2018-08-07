var exercise1 = new Vue({
    el: '#app',
    data: {
        map: null,
        tileLayer: null,
        layers: [],
        controls: [],

        acData: {
            pc_no : [],
            status : []
        },
        acShapeLayer: null,

        layerActiveStyle: 0,
        styleBtnText: "Show PC No Map",
        styleBtnTextActive: "Show PC No Map",
        styleBtnTextDefault: "Show General Map"
    },
    mounted() {
        this.initMap();
        this.initLayers();
        this.initControls();
    },
    methods: {
        onLayerStyleClick(){
            var self = this;

            self.layerActiveStyle = (self.layerActiveStyle == 0) ? 1 : 0;
            self.styleBtnText = (self.layerActiveStyle == 0) ? self.styleBtnTextActive : self.styleBtnTextDefault;
            (self.layerActiveStyle == 0) ? self.controls[0].hide() : self.controls[0].show();

            this.acShapeLayer.eachLayer(function (layer) {
                var style = self.getStyle(self.layerActiveStyle, self.acData.pc_no[layer.feature.properties["PC_NO"]]);
                layer.setStyle(style)
            });
        },
        onStatusChange(e){
            var status = e.target.value;

            this.acShapeLayer.eachLayer(function (layer) {
                var opacity = (status == layer.feature.properties["STATUS"] || status == "") ? 0.25 : 0;
                layer.setStyle({
                    "fillOpacity": opacity
                });
            });
        },
        getStyle(styleId, color){
            if (styleId == 0){
                return {
                    "color": "#ff7800",
                    "weight": 1,
                    "opacity": 0.75
                };
            } else {
                return {
                    "color": color,
                    "weight": 1,
                    "opacity": 0.75
                }
            }
        },
        getRandomColor() {
            var o = Math.round, r = Math.random, s = 255;
            return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')';
        },
        initLayers() {
            var self = this;

            this.acShapeLayer = new L.Shapefile('data/AC.zip', {
                onEachFeature: function (feature, layer) {
                    var props = feature.properties;
                    var hasStatus = $.inArray(props["STATUS"], self.acData.status);

                    if (self.acData.pc_no[props["PC_NO"]] == undefined){
                        self.acData.pc_no[props["PC_NO"]] = self.getRandomColor();
                        self.controls[0].updateContent("PC No : " +props["PC_NO"], self.acData.pc_no[props["PC_NO"]]);
                    }
                    if (hasStatus == -1){
                        self.acData.status.push(props["STATUS"]);
                    }
                    if (props) {
                        layer
                            .setStyle(self.getStyle(0))
                            .bindPopup(Object.keys(props).map(function (k) {
                                return k + ": <b>" + props[k] + "</b>";
                            }).join("<br />"), {
                                maxHeight: 200
                            });
                    }
                }
            });

            this.acShapeLayer.addTo(this.map);

        },
        initControls(){
            var self = this;

            var legend = L.control({position: 'bottomright'});

            legend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    labels = [];

                return div;
            };

            legend.updateContent = function (label, color) {
                legend.getContainer().innerHTML += '<i style="background:'
                    + color.replace(/[^,]+(?=\))/, '0.5') + '"></i> ' + label + '<br>';
            };

            legend.hide = function () {
                legend.getContainer().hidden = true;
            };

            legend.show = function () {
                legend.getContainer().hidden = false;
            };

            this.controls.push(legend);
            legend.addTo(this.map);
            legend.hide();
        },
        initMap() {
            var self = this;

            this.map = L.map('map').setView([25.736, 85.699], 8);
            this.tileLayer = L.tileLayer(
                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                {
                    maxZoom: 18,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                }
            );

            this.tileLayer.addTo(this.map);

        }
    }
});