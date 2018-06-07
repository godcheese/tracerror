
// function getScriptQueryString(scriptIndex, queryString) {
//     var uri = document.scripts[scriptIndex].src;
//     if(uri) {
//         if(uri.indexOf('?')>0) {
//             var arr = uri.split('?');
//             if(arr) {
//                 var params = arr[1];
//                 var p = [];
//                 if(params.indexOf('&')>0) {
//                     p = params.split('&');
//                 } else {
//                     p.push(params);
//                 }
//
//                 for(var i=0; i<p.length; i++) {
//                     p = p[i].split("=");
//                     if(p[0] === queryString) {
//                         return p[1]
//                     }
//                 }
//
//             }
//         }
//     }
// }

// window.traceId = getScriptQueryString(0,'tracid');

function traceConfig(options) {
    if(options) {
        options.enable = true;
    }
    window._traceConfig = options;
}

var userAgent = navigator.userAgent;
var browser = function(ua){
    var isEdge = ua.match(/edge\/(\d+\.\d+)/i);
    if (isEdge) {
        return 'Edge/'+ isEdge[1];
    }
    var isChrome = ua.match(/chrome\/(\d+\.\d+)/i);
    if (isChrome) {
        return 'Chrome/' + isChrome[1];
    }
        var isFirefox = ua.match(/firefox\/(\d+\.\d+)/i);
    if (isFirefox) {
        return 'Firefox/' + isFirefox[1];
    }
    var isSafari = ua.match(/\w+\/([\d.]+)\ssafari/i);
    if (isSafari) {
        return 'Safari/'+isSafari[1];
    }
    var isIE = ua.match(/msie\s(\d+\.\d+)/i);
    if (isIE) {
        return 'IE/'+isIE[1];
    }
    var isIE11 = ua.match(/rv:(\d+\.\d+)\)\slike\sgecko/i);
    if(isIE11) {
        return 'IE/' + isIE11[1];
    }
    var isOpera = ua.match(/opera\/\d+.+\w+\/(\d+\.\d+)$/i);
    if (isOpera) {
        return 'Opera/'+isOpera[1];
    }

    return 'Unknown/0/0';
}(userAgent);

var operatingSystem = function(ua) {
    var isWindows = ua.match(/windows nt (\d+)+.+\d\;\s+win(\d+)/i);
    if (isWindows) {
        return 'Windows/'+ isWindows[1] + '/' + isWindows[2];
    }
    // var isLinux = ua.match(/linux nt (\d+)+.+\d\;\s+win(\d+)/i);
    // console.log(isLinux);
    // if (isLinux) {
    //     return 'Linux/'+ isLinux[1] + '/' + isLinux[2];
    // }
    return 'Unknown/0/0';
}(userAgent);

window.onerror = function (errorMessage, errorUrl, errorLine, errorColumn, error) {
    if(_traceConfig.enable) {
       tracError({
           traceId: _traceConfig.traceId,
           userAgent: userAgent,
           operatingSystem: operatingSystem,
           browser: browser,
           errorMessage: errorMessage,
           errorUrl: errorUrl,
           errorLine: errorLine,
           errorColumn: errorColumn,
           timestamp: new Date().getTime()
       }, _traceConfig.traceUrl || '/tracError');


    function tracError(error, traceUrl) {
        _ajax({url: traceUrl, data: error});
    }

    function _ajax(options) {
        options.type = options.type || 'POST';
        options.url = options.url || '';
        options.async = options.async || true;
        options.data = options.data || {};
        options.success = options.success || function () {};
        options.error = options.error || function () {};

        var xhr;
        if (XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        var params = [];
        for (var key in options.data) {
            params.push(key + '=' + options.data[key]);
        }

        var postData = params.join('&');
        if (options.type.toUpperCase() === 'POST') {
            xhr.open(options.type, options.url, options.async);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            xhr.send(postData);
        } else if (options.method.toUpperCase() === 'GET') {
            xhr.open(options.method, options.url + '?' + postData, options.async);
            xhr.send(null);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                options.success(xhr.responseText);
            } else if (xhr.readyState === 4 && xhr.status === 404) {
                options.error(xhr);
            }

        };

    }

   }
};
