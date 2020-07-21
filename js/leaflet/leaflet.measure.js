L.Control.Measure = L.Control.extend({
    options: {
        position: 'topleft',
        metric: 'm',//m->meters,mi->miles,km->kilimeters,ft->feet
        mode:'length'
    },

    onAdd: function (map) {
        var className = 'leaflet-control-zoom leaflet-bar leaflet-control hide',
		    container = L.DomUtil.create('div', className);

        this._createButton('&#8674;', 'Measure', 'leaflet-control-measure leaflet-bar-part leaflet-bar-part-top-and-bottom', container, this._toggleMeasure, this);

        return  container;
    },

    _enableLength:function()
    {
        this.options.mode = 'length';
    },

    _enableArea: function () {
        this.options.mode = 'area';
    },

    _createButton: function (html, title, className, container, fn, context) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent
			.on(link, 'click', L.DomEvent.stopPropagation)
			.on(link, 'click', L.DomEvent.preventDefault)
			.on(link, 'click', fn, context)
			.on(link, 'dblclick', L.DomEvent.stopPropagation);

        return link;
    },

    _toggleMeasure: function () {
        this._measuring = !this._measuring;

        if (this._measuring) {
            L.DomUtil.addClass(this._container, 'leaflet-control-measure-on');
            this._startMeasuring();
        } else {
            L.DomUtil.removeClass(this._container, 'leaflet-control-measure-on');
            this._stopMeasuring();
        }
    },

    _startMeasuring: function () {
       // this._oldCursor = this._map._container.style.cursor;
        // this._map._container.style.cursor = 'crosshair';
       // $('.leaflet-container').css('cursor', 'crosshair');

         this._oldCursor = map._container.style.cursor;
         map._container.style.cursor = 'crosshair';


        this._doubleClickZoom = this._map.doubleClickZoom.enabled();
        this._map.doubleClickZoom.disable();

        L.DomEvent
			.on(this._map, 'mousemove', this._mouseMove, this)
			.on(this._map, 'click', this._mouseClick, this)
			.on(this._map, 'dblclick', this._finishPath, this)
			.on(document, 'keydown', this._onKeyDown, this);

        if (!this._layerPaint) {
            this._layerPaint = L.layerGroup().addTo(this._map);
        }

        /*
        var self = this;

        if (this._historicalPaths != null) {
            $.each(this._historicalPaths, function (index, value) {
                value.addTo(self._layerPaint);
            });
            this._historicalPaths = null;
        }
        */
       

        if (!this._points) {
            this._points = [];
        }
    },

    
    _stopMeasuring: function () {
        this._map._container.style.cursor = this._oldCursor;

        L.DomEvent
			.off(document, 'keydown', this._onKeyDown, this)
			.off(this._map, 'mousemove', this._mouseMove, this)
			.off(this._map, 'click', this._mouseClick, this)
			.off(this._map, 'dblclick', this._mouseClick, this);

        if (this._doubleClickZoom) {
            this._map.doubleClickZoom.enable();
        }

        if (this._layerPaint) {
            this._layerPaint.clearLayers();
        }

        this._restartPath();
    },

    _mouseMove: function (e) {
        if (!e.latlng || !this._lastPoint) {
            return;
        }

        if (!this._layerPaintPathTemp) {

           

            var shapeOptions={
                color: 'yellow',
                weight: 1.5,
                clickable: false,
                dashArray: '6,3'
            };

            if (this.options.mode == 'length') {
                this._layerPaintPathTemp = L.polyline([this._lastPoint, e.latlng], shapeOptions).addTo(this._layerPaint);
            }
            else {
                this._layerPaintPathTemp = L.polygon([this._lastPoint, e.latlng], shapeOptions).addTo(this._layerPaint);
            }
            
        } else {
            this._layerPaintPathTemp.spliceLatLngs(0, 2, this._lastPoint, e.latlng);
        }

        if (this._tooltip) {
            if (!this._distance) {
                this._distance = 0;
            }

            this._updateTooltipPosition(e.latlng);

            var distance = e.latlng.distanceTo(this._lastPoint);
            this._updateTooltipDistance(this._distance + distance, distance);
        }
    },

    _mouseClick: function (e) {
        // Skip if no coordinates
        if (!e.latlng) {
            return;
        }

        // If we have a tooltip, update the distance and create a new tooltip, leaving the old one exactly where it is (i.e. where the user has clicked)
        if (this._lastPoint && this._tooltip) {
            if (!this._distance) {
                this._distance = 0;
            }

            this._updateTooltipPosition(e.latlng);

            var distance = e.latlng.distanceTo(this._lastPoint);
            this._updateTooltipDistance(this._distance + distance, distance);

            this._distance += distance;
        }
        this._createTooltip(e.latlng);


        // If this is already the second click, add the location to the fix path (create one first if we don't have one)
        if (this._lastPoint && !this._layerPaintPath) {
            var shapeOptions = {
                color: 'yellow',
                weight: 2,
                clickable: false
            };
            if (this.options.mode == 'length') {
                this._layerPaintPath = L.polyline([this._lastPoint], shapeOptions).addTo(this._layerPaint);
            }
            else {
                this._layerPaintPath = L.polygon([this._lastPoint], shapeOptions).addTo(this._layerPaint);
            }
            
        }

        if (this._layerPaintPath) {
            this._layerPaintPath.addLatLng(e.latlng);
        }

        // Upate the end marker to the current location
        if (this._lastCircle) {
            this._layerPaint.removeLayer(this._lastCircle);
        }

        this._lastCircle = new L.CircleMarker(e.latlng, {
            color: 'black',
            opacity: 1,
            weight: 1,
            fill: true,
            fillOpacity: 1,
            radius: 2,
            clickable: this._lastCircle ? true : false
        }).addTo(this._layerPaint);

        this._lastCircle.on('click', function () { this._finishPath(); }, this);

        // Save current location as last location
        this._lastPoint = e.latlng;
    },

    _finishPath: function () {
        // Remove the last end marker as well as the last (moving tooltip)
        if (this._lastCircle) {
            this._layerPaint.removeLayer(this._lastCircle);
        }
        if (this._tooltip) {
            this._layerPaint.removeLayer(this._tooltip);
        }
        if (this._layerPaint && this._layerPaintPathTemp) {
            this._layerPaint.removeLayer(this._layerPaintPathTemp);
        }

        if (this._layerPaintPath != null) {
            if (this.options.mode != 'length' && this._layerPaintPath.getLatLngs().length > 2) {
                var area = L.GeometryUtil.geodesicArea(this._layerPaintPath.getLatLngs());
                var lastPointPolygon = this._layerPaintPath.getLatLngs()[0];
                this._createTooltip(lastPointPolygon);
                var lastSegmentDist = this._lastPoint.distanceTo(lastPointPolygon);
                this._updateTooltipDistance(lastSegmentDist + this._distance, lastSegmentDist);
                this._createTooltip(this._layerPaintPath.getBounds().getCenter());
                this._updateTooltipArea(area);
            }
        }
        //calculate area
       
        

        // Reset everything
        this._restartPath();
    },

    _restartPath: function () {
        this._distance = 0;
        this._tooltip = undefined;
        this._lastCircle = undefined;
        this._lastPoint = undefined;
        this._layerPaintPath = undefined;
        this._layerPaintPathTemp = undefined;
    },

    _createTooltip: function (position) {
        var icon = L.divIcon({
            className: 'leaflet-measure-tooltip',
            iconAnchor: [-5, -5]
        });
        this._tooltip = L.marker(position, {
            icon: icon,
            clickable: false
        }).addTo(this._layerPaint);
    },

    _updateTooltipPosition: function (position) {
        this._tooltip.setLatLng(position);
    },

    _updateTooltipDistance: function (total, difference) {
        var totalRound = this._round(total),
			differenceRound = this._round(difference);

        var text = '<div class="leaflet-measure-tooltip-total">' + totalRound + ' ' + this.options.metric + '</div>';
        if (differenceRound > 0 && totalRound != differenceRound) {
            text += '<div class="leaflet-measure-tooltip-difference">(+' + differenceRound +' ' + this.options.metric + ')</div>';
        }

        if (this._tooltip != null && this._tooltip._icon != null) {
            this._tooltip._icon.innerHTML = text;
        }
    },

    _updateTooltipArea: function (total) {
        var totalRound = this._round(total);
        if (this.options.mode == 'area')
            totalRound = (totalRound * .01).toFixed(2);
        var text = '<div class="leaflet-measure-tooltip-total">' + totalRound + ' Sq ' + this.options.metric + '</div>';
        this._tooltip._icon.innerHTML = text;
    },

    _round: function (val) {
        var res;
        if (this.options.metric == 'm') {
            res= val.toFixed(1);
        }
        else if (this.options.metric == 'mi') {
            res=(.00062137 * val).toFixed(1);
        }
        else if (this.options.metric == 'km') {
            res=(.001 * val).toFixed(1);
        }
        else if (this.options.metric == 'ft') {
            res=(3.2804 * val).toFixed(1);
        }
        
        return res;
    },

    _onKeyDown: function (e) {
        if (e.keyCode == 27) {
            // If not in path exit measuring mode, else just finish path
            if (!this._lastPoint) {
                this._toggleMeasure();
            } else {
                this._finishPath();
            }
        }
    }
});

L.Map.mergeOptions({
    measureControl: false
});

L.Map.addInitHook(function () {
    if (this.options.measureControl) {
        this.measureControl = new L.Control.Measure();
        this.addControl(this.measureControl);
    }
});

L.control.measure = function (options) {
    return new L.Control.Measure(options);
};
