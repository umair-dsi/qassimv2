var baseMapProp = [
        { 'layerName': "No Basemap", 'image': "", 'id': 1, 'url': '', 'wkid': 0, 'baseMaptype': 'nomap' },
        {
            'layerName': "Imagery",
            'image': "tempimagery.jpg",
            'id': 2,
            'url': 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
            'wkid': 3857,
            'baseMaptype': 'arcgis'
        },
        {
            'layerName': "Streets",
            'image': "world_street_map.jpg",
            'id': 4,
            'url': 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
            'wkid': 3857,
            'baseMaptype': 'arcgis'
        },
        {
            'layerName': "Topographic",
            'image': "topo_map_2.jpg",
            'id': 5,
            'url': 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
            'wkid': 3857,
            'baseMaptype': 'arcgis'
        },
        {
            'layerName': "Dark Gray Canvas",
            'image': "DGCanvasBase.png",
            'id': 6,
            'url': 'http://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
            'wkid': 3857,
            'baseMaptype': 'arcgis'
        },
        {
            'layerName': "Light Gray Canvas",
            'image': "light_gray_canvas.jpg",
            'id': 7,
            'url': 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer',
            'wkid': 3857,
            'baseMaptype': 'arcgis'
        },
        {
            'layerName': "National Geographic",
            'image': "natgeo.jpg",
            'id': 8,
            'url': 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer',
            'wkid': 3857,
            'baseMaptype': 'arcgis'
        },
        {
            'layerName': "Oceans",
            'image': "tempoceans.jpg",
            'id': 9,
            'url': 'http://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer',
            'wkid': 3857,
            'baseMaptype': 'arcgis'
        },
        {
            'layerName': "Terrain with Labels",
            'image': "terrain_labels.jpg",
            'id': 10,
            'url': 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer',
            'wkid': 3857,
            'baseMaptype': 'arcgis'
        },
        {
            'layerName': "Google",
            'image': "google.png",
            'id': 11,
            'url': '',
            'wkid': 3857,
            'type': 'google'
        }
       
];

function showSuccessMessage(title, content) {
    $.smallBox({
        title: title,
        content: content,
        color: "#659265",
        iconSmall: "fa fa-thumbs-up bounce animated",
        timeout: 4000
    });
}

function showErrorMessage(title, content) {
    $.smallBox({
        title: title,
        content: content,
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 4000
    });
}

extendObject = function (destination, source) {
    destination = destination || {};
    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }

        /**
         * IE doesn't include the toString property when iterating over an object's
         * properties with the for(property in object) syntax.  Explicitly check if
         * the source has its own toString property.
         */

        /*
         * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
         * prototype object" when calling hawOwnProperty if the source object
         * is an instance of window.Event.
         */

        var sourceIsEvt = typeof window.Event == "function"
                          && source instanceof window.Event;

        if (!sourceIsEvt
           && source.hasOwnProperty && source.hasOwnProperty('toString')) {
            destination.toString = source.toString;
        }
    }
    return destination;
};
/**
 
 * Constant: INCHES_PER_UNIT
 * {Object} Constant inches per unit -- borrowed from MapServer mapscale.c
 * derivation of nautical miles from http://en.wikipedia.org/wiki/Nautical_mile
 * Includes the full set of units supported by CS-MAP (http://trac.osgeo.org/csmap/)
 * and PROJ.4 (http://trac.osgeo.org/proj/)
 * The hardcoded table is maintain in a CS-MAP source code module named CSdataU.c
 * The hardcoded table of PROJ.4 units are in pj_units.c.
 */
var INCHES_PER_UNIT = {
    'inches': 1.0,
    'ft': 12.0,
    'mi': 63360.0,
    'm': 39.3701,
    'km': 39370.1,
    'dd': 4374754,
    'yd': 36
};
INCHES_PER_UNIT["in"] = INCHES_PER_UNIT.inches;
INCHES_PER_UNIT["degrees"] = INCHES_PER_UNIT.dd;
INCHES_PER_UNIT["nmi"] = 1852 * INCHES_PER_UNIT.m;

// Units from CS-Map
METERS_PER_INCH = 0.02540005080010160020;

extendObject(INCHES_PER_UNIT, {
    "Inch": INCHES_PER_UNIT.inches,
    "Meter": 1.0 / METERS_PER_INCH,   //EPSG:9001
    "Foot": 0.30480060960121920243 / METERS_PER_INCH,   //EPSG:9003
    "IFoot": 0.30480000000000000000 / METERS_PER_INCH,   //EPSG:9002
    "ClarkeFoot": 0.3047972651151 / METERS_PER_INCH,   //EPSG:9005
    "SearsFoot": 0.30479947153867624624 / METERS_PER_INCH,   //EPSG:9041
    "GoldCoastFoot": 0.30479971018150881758 / METERS_PER_INCH,   //EPSG:9094
    "IInch": 0.02540000000000000000 / METERS_PER_INCH,
    "MicroInch": 0.00002540000000000000 / METERS_PER_INCH,
    "Mil": 0.00000002540000000000 / METERS_PER_INCH,
    "Centimeter": 0.01000000000000000000 / METERS_PER_INCH,
    "Kilometer": 1000.00000000000000000000 / METERS_PER_INCH,   //EPSG:9036
    "Yard": 0.91440182880365760731 / METERS_PER_INCH,
    "SearsYard": 0.914398414616029 / METERS_PER_INCH,   //EPSG:9040
    "IndianYard": 0.91439853074444079983 / METERS_PER_INCH,   //EPSG:9084
    "IndianYd37": 0.91439523 / METERS_PER_INCH,   //EPSG:9085
    "IndianYd62": 0.9143988 / METERS_PER_INCH,   //EPSG:9086
    "IndianYd75": 0.9143985 / METERS_PER_INCH,   //EPSG:9087
    "IndianFoot": 0.30479951 / METERS_PER_INCH,   //EPSG:9080
    "IndianFt37": 0.30479841 / METERS_PER_INCH,   //EPSG:9081
    "IndianFt62": 0.3047996 / METERS_PER_INCH,   //EPSG:9082
    "IndianFt75": 0.3047995 / METERS_PER_INCH,   //EPSG:9083
    "Mile": 1609.34721869443738887477 / METERS_PER_INCH,
    "IYard": 0.91440000000000000000 / METERS_PER_INCH,   //EPSG:9096
    "IMile": 1609.34400000000000000000 / METERS_PER_INCH,   //EPSG:9093
    "NautM": 1852.00000000000000000000 / METERS_PER_INCH,   //EPSG:9030
    "Lat-66": 110943.316488932731 / METERS_PER_INCH,
    "Lat-83": 110946.25736872234125 / METERS_PER_INCH,
    "Decimeter": 0.10000000000000000000 / METERS_PER_INCH,
    "Millimeter": 0.00100000000000000000 / METERS_PER_INCH,
    "Dekameter": 10.00000000000000000000 / METERS_PER_INCH,
    "Decameter": 10.00000000000000000000 / METERS_PER_INCH,
    "Hectometer": 100.00000000000000000000 / METERS_PER_INCH,
    "GermanMeter": 1.0000135965 / METERS_PER_INCH,   //EPSG:9031
    "CaGrid": 0.999738 / METERS_PER_INCH,
    "ClarkeChain": 20.1166194976 / METERS_PER_INCH,   //EPSG:9038
    "GunterChain": 20.11684023368047 / METERS_PER_INCH,   //EPSG:9033
    "BenoitChain": 20.116782494375872 / METERS_PER_INCH,   //EPSG:9062
    "SearsChain": 20.11676512155 / METERS_PER_INCH,   //EPSG:9042
    "ClarkeLink": 0.201166194976 / METERS_PER_INCH,   //EPSG:9039
    "GunterLink": 0.2011684023368047 / METERS_PER_INCH,   //EPSG:9034
    "BenoitLink": 0.20116782494375872 / METERS_PER_INCH,   //EPSG:9063
    "SearsLink": 0.2011676512155 / METERS_PER_INCH,   //EPSG:9043
    "Rod": 5.02921005842012 / METERS_PER_INCH,
    "IntnlChain": 20.1168 / METERS_PER_INCH,   //EPSG:9097
    "IntnlLink": 0.201168 / METERS_PER_INCH,   //EPSG:9098
    "Perch": 5.02921005842012 / METERS_PER_INCH,
    "Pole": 5.02921005842012 / METERS_PER_INCH,
    "Furlong": 201.1684023368046 / METERS_PER_INCH,
    "Rood": 3.778266898 / METERS_PER_INCH,
    "CapeFoot": 0.3047972615 / METERS_PER_INCH,
    "Brealey": 375.00000000000000000000 / METERS_PER_INCH,
    "ModAmFt": 0.304812252984505969011938 / METERS_PER_INCH,
    "Fathom": 1.8288 / METERS_PER_INCH,
    "NautM-UK": 1853.184 / METERS_PER_INCH,
    "50kilometers": 50000.0 / METERS_PER_INCH,
    "150kilometers": 150000.0 / METERS_PER_INCH
});

//unit abbreviations supported by PROJ.4
extendObject(INCHES_PER_UNIT, {
    "mm": INCHES_PER_UNIT["Meter"] / 1000.0,
    "cm": INCHES_PER_UNIT["Meter"] / 100.0,
    "dm": INCHES_PER_UNIT["Meter"] * 100.0,
    "km": INCHES_PER_UNIT["Meter"] * 1000.0,
    "kmi": INCHES_PER_UNIT["nmi"],    //International Nautical Mile
    "fath": INCHES_PER_UNIT["Fathom"], //International Fathom
    "ch": INCHES_PER_UNIT["IntnlChain"],  //International Chain
    "link": INCHES_PER_UNIT["IntnlLink"], //International Link
    "us-in": INCHES_PER_UNIT["inches"], //U.S. Surveyor's Inch
    "us-ft": INCHES_PER_UNIT["Foot"],	//U.S. Surveyor's Foot
    "us-yd": INCHES_PER_UNIT["Yard"],	//U.S. Surveyor's Yard
    "us-ch": INCHES_PER_UNIT["GunterChain"], //U.S. Surveyor's Chain
    "us-mi": INCHES_PER_UNIT["Mile"],   //U.S. Surveyor's Statute Mile
    "ind-yd": INCHES_PER_UNIT["IndianYd37"],  //Indian Yard
    "ind-ft": INCHES_PER_UNIT["IndianFt37"],  //Indian Foot
    "ind-ch": 20.11669506 / METERS_PER_INCH  //Indian Chain
});

