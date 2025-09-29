// RaiLocate Autocomplete bootstrap (jQuery UI)
// Loads /javascripts/railRef.json, normalizes records, and binds prefix-only autocomplete
(function() {
  // Absolute path avoids /trains prefix issues
  var DATA_URL = "/javascripts/railRef.json";
  var LIMIT = 8;

  // Heuristic normalizer – handles multiple shapes
  function normalize(data) {
    var out = [];

    // If it's an object (e.g., { "PAD": {...}, "KGX": {...} })
    if (data && !Array.isArray(data) && typeof data === "object") {
      Object.keys(data).forEach(function(k) {
        var v = data[k] || {};
        var name = v.station_name || v.name || v.StationName || v.LocationName || v.description || v.title || k;
        var code = v.crs || v.CRS || v.code || v.StationCode || v.CRSCode || k;
        var label = code ? (name + " (" + code + ")") : name;
        out.push({ label: label, value: label, _key: name.toLowerCase(), _code: String(code || "").toLowerCase() });
      });
      return out;
    }

    // If it's an array
    if (Array.isArray(data)) {
      data.forEach(function(item) {
        if (item == null) return;

        if (typeof item === "string") {
          var s = item.trim();
          if (!s) return;
          out.push({ label: s, value: s, _key: s.toLowerCase(), _code: "" });
          return;
        }

        if (typeof item === "object") {
          var name = item.station_name || item.name || item.StationName || item.LocationName || item.label || item.text || item.description || "";
          var code = item.crs || item.CRS || item.code || item.StationCode || item.CRSCode || item.value || "";
          var label = code ? (name + " (" + code + ")") : name;
          var key = (name || label || "").toLowerCase();
          out.push({ label: label, value: label, _key: key, _code: String(code || "").toLowerCase() });
          return;
        }
      });
      return out;
    }

    // Fallback – nothing parsable
    return out;
  }

  function startsWithFilter(source, term) {
    var q = (term || "").trim().toLowerCase();
    if (!q) return [];
    var res = [];
    for (var i = 0; i < source.length; i++) {
      var it = source[i];
      // prefix on name; include prefix on code as a nice-to-have (e.g., "PA" -> "PAD")
      if (it._key.startsWith(q) || (it._code && it._code.startsWith(q))) {
        res.push({ label: it.label, value: it.value });
        if (res.length >= LIMIT) break;
      }
    }
    return res;
  }

  function ensureJqui() {
    if (!window.jQuery) {
      console.error("jQuery not found. Ensure it's included before autocomplete.js");
      return false;
    }
    if (!jQuery.ui || !jQuery.ui.autocomplete) {
      console.error("jQuery UI Autocomplete not found. Include jQuery UI before autocomplete.js");
      return false;
    }
    return true;
  }

  function bindAutocomplete(stations) {
    if (!ensureJqui()) return;

    var $inputs = jQuery("#ajax, #ajax2");
    if (!$inputs.length) return;

    var src = normalize(stations);

    function sourceFn(request, response) {
      response(startsWithFilter(src, request.term));
    }

    $inputs.each(function() {
      var $el = jQuery(this);
      $el.autocomplete({
        minLength: 1,
        delay: 0,
        autoFocus: true,
        source: sourceFn,
        appendTo: $el.parent(),
        select: function(event, ui) {
          if (ui && ui.item) {
            $el.val(ui.item.value);
          }
        },
        focus: function(event) {
          event.preventDefault(); // don't overwrite input on focus
        }
      })
      .on("blur", function() {
        // Allow click on a menu item to register before closing
        var self = this;
        setTimeout(function() {
          try { jQuery(self).autocomplete("close"); } catch(e) {}
        }, 120);
      });

      // Optional: bold the matching prefix
      var inst = $el.autocomplete("instance");
      if (inst && typeof inst._renderItem === "function") {
        inst._renderItem = function(ul, item) {
          var term = (this.term || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          var re = new RegExp("^(" + term + ")", "i");
          var html = String(item.label).replace(re, "<strong>$1</strong>");
          return jQuery("<li>").append("<div>" + html + "</div>").appendTo(ul);
        };
      }
    });
  }

  // Fetch dataset and boot
  function init() {
    try {
      fetch(DATA_URL, { cache: "force-cache" })
        .then(function(r) { return r.ok ? r.json() : []; })
        .then(function(json) { bindAutocomplete(json); })
        .catch(function(err) {
          console.error("Failed to load railRef.json", err);
        });
    } catch (e) {
      console.error("Fetch error", e);
    }
  }

  // DOM ready boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
