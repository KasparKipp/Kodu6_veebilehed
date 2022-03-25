(function () {
    "use strict";

    //clock

    document.addEventListener("DOMContentLoaded", function () {
        let c = document.getElementById("clock");

        //setTimeout(updateClock, 2000);
        setInterval(updateClock, 1000);

        function updateClock() {
            let tähis = "EL";
            let date = new Date();
            //kuna setInterval uuendab sekundi tagant, siis lisasin hetke ajale 1 sekundi :)
            date.setSeconds(date.getSeconds() + 1);

            if (date.getHours() >= 12) tähis = "PL";
            let h = date.getHours() % 12;
            let m = date.getMinutes();
            let s = date.getSeconds();

            /*
            if (h < 10) {
                h = "0" + h;
            }
            */
            if (h == 0) h = "12";

            if (m < 10) {
                m = "0" + m;
            }

            if (s < 10) {
                s = "0" + s;
            }

            c.innerHTML = h + ":" + m + ":" + s + " " + tähis;
        }
    });

    // forms

    document.getElementById("form").addEventListener("submit", estimateDelivery);

    let e = document.getElementById("delivery");
    e.innerHTML = "0,00 &euro;";
    const present = 5.0;
    const contactless = 1.0;
    const tln = 0.0;
    const trt = 2.5;
    const nrv = 2.5;
    const prn = 3.0;

    function containsNumber(inputString) {
        return !/^[A-Za-z]+$/.test(inputString);
    }

    function estimateDelivery(event) {
        let summa = 0.0;
        event.preventDefault();

        let linn = document.getElementById("linn");
        let eesnimi = document.getElementById("fname").value;
        let perenimi = document.getElementById("lname").value;

        if (
            //Kontrollime, et radiobuttonis oleks valik tehtud
            !(
                document.getElementById("hommik").checked ||
                document.getElementById("õhtu").checked ||
                document.getElementById("päev").checked
            )
        ) {
            alert("Palun valige tarne jaoks sobiv kellaaeg");
            return;
        }
        /*console.log("Eesnimi on " + eesnimi);
        console.log("Perenimi on " + perenimi);

        console.log("Eesnimi sisaldab numbreid: " + containsNumber(eesnimi));
        console.log("Perenimi sisaldab numbreid: " + containsNumber(perenimi));*/
        if (containsNumber(eesnimi) || containsNumber(perenimi)) {
            alert("Nimi ei saa sisaldada numbreid!!!");
            document.getElementById("input-fields").focus();

            return;
        }

        if (linn.value === "") {
            alert("Palun valige linn nimekirjast");

            linn.focus();

            return;
        } else if (eesnimi.value === "" || perenimi.value === "") {
            alert("Oled sa kindel, et lisasid enda kontaktandmed?");
            document.getElementById("input-fields").focus();

            return;
        } else {
            if (document.getElementById("v1").checked) summa += present;
            if (document.getElementById("v2").checked) summa += contactless;
            switch (linn.value) {
                case "tln":
                    summa += tln;
                    break;
                case "trt":
                    summa += trt;
                    break;
                case "nrv":
                    summa += nrv;
                    break;
                case "prn":
                    summa += prn;
                    break;
                default:
                    alert("Sellisesse linna tarnet ei toimu");
                    return;
            }
            e.innerHTML = summa + " &euro;";
        }

        console.log("Tarne hind on arvutatud");
    }
})();

// map

// Abifunktsioon, mis teha kui vajutatakse pushpinile

function pushpinClicked(pin) {
    if (pin.target.metadata) {
        infobox.setOptions({
            location: pin.target.getLocation(),
            title: pin.target.metadata.title,
            description: pin.target.metadata.description,
            visible: true,
        });
    }
}

let mapAPIKey = "ApKlMiOmmU01Z0Jy2oKZf2jRm0iEwKI1Gc5Uq2X3a6BbWI42avYp7kodnh7-uNOD";

let map;
let infobox;

function GetMap() {
    "use strict";

    let uTLat = 58.38104;
    let uTLong = 26.71992;
    let talTechLat = 59.39661;
    let talTechLong = 24.67106;

    let uT = new Microsoft.Maps.Location(uTLat, uTLong);
    let talTech = new Microsoft.Maps.Location(talTechLat, talTechLong);
    let centerPoint = new Microsoft.Maps.Location((uTLat + talTechLat) / 2, (uTLong + talTechLong) / 2);

    let minuStiil = {
        elements: {
            water: { fillColor: "#a1e0ff" },
            waterPoint: { iconColor: "#a1e0ff" },
            transportation: { strokeColor: "#aa6de0" },
            road: { fillColor: "#b892db" },
            railway: { strokeColor: "#a495b2" },
            structure: { fillColor: "#ffffff" },
            runway: { fillColor: "#ff7fed" },
            area: { fillColor: "#f39ebd" },
            political: { borderStrokeColor: "#fe6850", borderOutlineColor: "#55ffff" },
            point: { iconColor: "#ffffff", fillColor: "#FF6FA0", strokeColor: "#DB4680" },
            transit: { fillColor: "#AA6DE0" },
        },
        version: "1.0",
    };

    map = new Microsoft.Maps.Map("#map", {
        credentials: mapAPIKey,
        center: centerPoint,
        zoom: 7,
        mapTypeId: Microsoft.Maps.MapTypeId.cavasDark,
        disablePanning: true,
        customMapStyle: minuStiil,
    });

    infobox = new Microsoft.Maps.Infobox(centerPoint, { visible: false });
    infobox.setMap(map);

    let pushpinUT = new Microsoft.Maps.Pushpin(uT, {
        title: "Tartu Ülikool",
        text: "UT",
    });

    let pushpinTalTech = new Microsoft.Maps.Pushpin(talTech, {
        title: "TalTech",
        text: "TTÜ",
    });

    pushpinUT.metadata = {
        title: "Tartu Ülikool",
        description: "Tartu Ülikool on vaieldamatult parim ülikool Tartus",
    };
    pushpinTalTech.metadata = {
        title: "TalTech - Tallinna Tehnikaülikool",
        description: "TalTech on vaieldavalt parim ülikool Tallinnas",
    };

    Microsoft.Maps.Events.addHandler(pushpinUT, "click", pushpinClicked);
    Microsoft.Maps.Events.addHandler(pushpinTalTech, "click", pushpinClicked);

    map.entities.push(pushpinUT);
    map.entities.push(pushpinTalTech);
}

// https://dev.virtualearth.net/REST/v1/Locations?q=1000 Vin Scully Ave, Los Angeles,CA&key=YOUR_KEY_HERE
