"use strict";

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 - 2017 Franco Cavestri
 *
 * https://github.com/cavestri/themoviedb-javascript-library
 *
 */

var theMovieDb = {};

theMovieDb.common = {
    api_key: "b4a2ddcffbf736c3e738a03f5fcc609c",
    base_uri: "http://api.themoviedb.org/3/",
    images_uri: "http://image.tmdb.org/t/p/",
    timeout: 5000,
    generateQuery: function generateQuery(options) {
        'use strict';

        var myOptions, query, option;

        myOptions = options || {};
        query = "?api_key=" + theMovieDb.common.api_key;

        if (Object.keys(myOptions).length > 0) {
            for (option in myOptions) {
                if (myOptions.hasOwnProperty(option) && option !== "id" && option !== "body") {
                    query = query + "&" + option + "=" + myOptions[option];
                }
            }
        }
        return query;
    },
    validateCallbacks: function validateCallbacks(callbacks) {
        'use strict';

        if (typeof callbacks[0] !== "function" || typeof callbacks[1] !== "function") {
            throw "Success and error parameters must be functions!";
        }
    },
    validateRequired: function validateRequired(args, argsReq, opt, optReq, allOpt) {
        'use strict';

        var i, allOptional;

        allOptional = allOpt || false;

        if (args.length !== argsReq) {
            throw "The method requires  " + argsReq + " arguments and you are sending " + args.length + "!";
        }

        if (allOptional) {
            return;
        }

        if (argsReq > 2) {
            for (i = 0; i < optReq.length; i = i + 1) {
                if (!opt.hasOwnProperty(optReq[i])) {
                    throw optReq[i] + " is a required parameter and is not present in the options!";
                }
            }
        }
    },
    getImage: function getImage(options) {
        'use strict';

        return theMovieDb.common.images_uri + options.size + "/" + options.file;
    },
    client: function client(options, success, error) {
        'use strict';

        var method, status, xhr;

        method = options.method || "GET";
        status = options.status || 200;
        xhr = new XMLHttpRequest();

        xhr.ontimeout = function () {
            error('{"status_code":408,"status_message":"Request timed out"}');
        };

        xhr.open(method, theMovieDb.common.base_uri + options.url, true);

        if (options.method === "POST") {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
        }

        xhr.timeout = theMovieDb.common.timeout;

        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === status) {
                    success(xhr.responseText);
                } else {
                    error(xhr.responseText);
                }
            } else {
                error(xhr.responseText);
            }
        };

        xhr.onerror = function (e) {
            error(xhr.responseText);
        };
        if (options.method === "POST") {
            xhr.send(JSON.stringify(options.body));
        } else {
            xhr.send(null);
        }
    }
};

theMovieDb.configurations = {
    getConfiguration: function getConfiguration(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "configuration" + theMovieDb.common.generateQuery()
        }, success, error);
    }
};

theMovieDb.account = {
    getInformation: function getInformation(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "account" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getLists: function getLists(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "account/" + options.id + "/lists" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getFavoritesMovies: function getFavoritesMovies(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "account/" + options.id + "/favorite_movies" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    addFavorite: function addFavorite(options, success, error) {
        'use strict';

        var body;

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id", "movie_id", "favorite"]);

        theMovieDb.common.validateCallbacks([success, error]);

        body = {
            "movie_id": options.movie_id,
            "favorite": options.favorite
        };

        theMovieDb.common.client({
            url: "account/" + options.id + "/favorite" + theMovieDb.common.generateQuery(options),
            status: 201,
            method: "POST",
            body: body
        }, success, error);
    },
    getRatedMovies: function getRatedMovies(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "account/" + options.id + "/rated_movies" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getWatchlist: function getWatchlist(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "account/" + options.id + "/movie_watchlist" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    addMovieToWatchlist: function addMovieToWatchlist(options, success, error) {
        'use strict';

        var body;

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id", "movie_id", "movie_watchlist"]);

        theMovieDb.common.validateCallbacks([success, error]);

        body = {
            "movie_id": options.movie_id,
            "movie_watchlist": options.movie_watchlist
        };

        theMovieDb.common.client({
            url: "account/" + options.id + "/movie_watchlist" + theMovieDb.common.generateQuery(options),
            method: "POST",
            status: 201,
            body: body
        }, success, error);
    }
};

theMovieDb.authentication = {
    generateToken: function generateToken(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "authentication/token/new" + theMovieDb.common.generateQuery()
        }, success, error);
    },
    askPermissions: function askPermissions(options) {
        'use strict';

        window.open("https://www.themoviedb.org/authenticate/" + options.token + "?redirect_to=" + options.redirect_to);
    },
    validateUser: function validateUser(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["request_token", "username", "password"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "authentication/token/validate_with_login" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    generateSession: function generateSession(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["request_token"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "authentication/session/new" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    generateGuestSession: function generateGuestSession(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "authentication/guest_session/new" + theMovieDb.common.generateQuery()
        }, success, error);
    }
};

theMovieDb.certifications = {
    getList: function getList(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "certification/movie/list" + theMovieDb.common.generateQuery()
        }, success, error);
    }
};

theMovieDb.changes = {
    getMovieChanges: function getMovieChanges(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/changes" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getPersonChanges: function getPersonChanges(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "person/changes" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }
};

theMovieDb.collections = {
    getCollection: function getCollection(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "collection/" + options.id + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getCollectionImages: function getCollectionImages(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "collection/" + options.id + "/images" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }

};

theMovieDb.companies = {
    getCompany: function getCompany(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "company/" + options.id + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getCompanyMovies: function getCompanyMovies(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "company/" + options.id + "/movies" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }

};

theMovieDb.credits = {
    getCredit: function getCredit(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/credits" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }
};

theMovieDb.discover = {
    getMovies: function getMovies(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "discover/movie" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getTvShows: function getTvShows(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "discover/tv" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }

};

theMovieDb.find = {
    getById: function getById(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id", "external_source"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "find/" + options.id + theMovieDb.common.generateQuery(options)
        }, success, error);
    }
};

theMovieDb.genres = {
    getList: function getList(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "genre/movie/list" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getMovies: function getMovies(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "genre/" + options.id + "/movies" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getTVList: function getTVList(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "genre/tv/list" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }

};

theMovieDb.jobs = {
    getList: function getList(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "job/list" + theMovieDb.common.generateQuery()
        }, success, error);
    }
};

theMovieDb.keywords = {
    getById: function getById(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "keyword/" + options.id + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getMovies: function getMovies(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "keyword/" + options.id + "/movies" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }
};

theMovieDb.lists = {
    getById: function getById(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "list/" + options.id + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getStatusById: function getStatusById(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id", "movie_id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "list/" + options.id + "/item_status" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    addList: function addList(options, success, error) {
        'use strict';

        var body;

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "name", "description"]);

        theMovieDb.common.validateCallbacks([success, error]);

        body = {
            "name": options.name,
            "description": options.description
        };

        delete options.name;
        delete options.description;

        if (options.hasOwnProperty("language")) {
            body["language"] = options.language;

            delete options.language;
        }

        theMovieDb.common.client({
            method: "POST",
            status: 201,
            url: "list" + theMovieDb.common.generateQuery(options),
            body: body
        }, success, error);
    },
    addItem: function addItem(options, success, error) {
        'use strict';

        var body;

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id", "media_id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        body = {
            "media_id": options.media_id
        };

        theMovieDb.common.client({
            method: "POST",
            status: 201,
            url: "list/" + options.id + "/add_item" + theMovieDb.common.generateQuery(options),
            body: body
        }, success, error);
    },
    removeItem: function removeItem(options, success, error) {
        'use strict';

        var body;

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id", "media_id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        body = {
            "media_id": options.media_id
        };

        theMovieDb.common.client({
            method: "POST",
            status: 201,
            url: "list/" + options.id + "/remove_item" + theMovieDb.common.generateQuery(options),
            body: body
        }, success, error);
    },
    removeList: function removeList(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            method: "DELETE",
            status: 204,
            url: "list/" + options.id + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    clearList: function clearList(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id", "confirm"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            method: "POST",
            status: 204,
            body: {},
            url: "list/" + options.id + "/clear" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }
};

theMovieDb.movies = {
    getById: function getById(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getAlternativeTitles: function getAlternativeTitles(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/alternative_titles" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getCredits: function getCredits(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/credits" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getImages: function getImages(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/images" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getKeywords: function getKeywords(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/keywords" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getReleases: function getReleases(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/releases" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getTrailers: function getTrailers(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/trailers" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getVideos: function getVideos(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/videos" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getTranslations: function getTranslations(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/translations" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getRecommendations: function getRecommendations(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/recommendations" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getSimilarMovies: function getSimilarMovies(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/similar_movies" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getReviews: function getReviews(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/reviews" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getLists: function getLists(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/lists" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getChanges: function getChanges(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/changes" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getLatest: function getLatest(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/latest" + theMovieDb.common.generateQuery()
        }, success, error);
    },
    getUpcoming: function getUpcoming(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/upcoming" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getNowPlaying: function getNowPlaying(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/now_playing" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getPopular: function getPopular(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/popular" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getTopRated: function getTopRated(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/top_rated" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getStatus: function getStatus(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "movie/" + options.id + "/account_states" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    rate: function rate(options, _rate, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 4, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            method: "POST",
            status: 201,
            url: "movie/" + options.id + "/rating" + theMovieDb.common.generateQuery(options),
            body: { "value": _rate }
        }, success, error);
    },
    rateGuest: function rateGuest(options, rate, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 4, options, ["guest_session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            method: "POST",
            status: 201,
            url: "movie/" + options.id + "/rating" + theMovieDb.common.generateQuery(options),
            body: { "value": rate }
        }, success, error);
    }
};

theMovieDb.networks = {
    getById: function getById(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "network/" + options.id + theMovieDb.common.generateQuery(options)
        }, success, error);
    }
};

theMovieDb.people = {
    getById: function getById(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "person/" + options.id + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getMovieCredits: function getMovieCredits(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "person/" + options.id + "/movie_credits" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getTvCredits: function getTvCredits(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "person/" + options.id + "/tv_credits" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getCredits: function getCredits(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "person/" + options.id + "/combined_credits" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getExternalIds: function getExternalIds(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "person/" + options.id + "/external_ids" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getImages: function getImages(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "person/" + options.id + "/images" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getTaggedImages: function getTaggedImages(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "person/" + options.id + "/tagged_images" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getChanges: function getChanges(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "person/" + options.id + "/changes" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getPopular: function getPopular(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "person/popular" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getLatest: function getLatest(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "person/latest" + theMovieDb.common.generateQuery()
        }, success, error);
    }
};

theMovieDb.reviews = {
    getById: function getById(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "review/" + options.id + theMovieDb.common.generateQuery(options)
        }, success, error);
    }
};

theMovieDb.search = {
    getMovie: function getMovie(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "search/movie" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getCollection: function getCollection(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "search/collection" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getTv: function getTv(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "search/tv" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getPerson: function getPerson(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "search/person" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getList: function getList(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "search/list" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getCompany: function getCompany(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "search/company" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getKeyword: function getKeyword(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "search/keyword" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getMulti: function getMulti(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "search/multi" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }
};

theMovieDb.timezones = {
    getList: function getList(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "timezones/list" + theMovieDb.common.generateQuery()
        }, success, error);
    }
};

theMovieDb.tv = {
    getById: function getById(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getAlternativeTitles: function getAlternativeTitles(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/alternative_titles" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getContentRatings: function getContentRatings(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/content_ratings" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getCredits: function getCredits(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/credits" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getExternalIds: function getExternalIds(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/external_ids" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getImages: function getImages(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/images" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getKeywords: function getKeywords(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/keywords" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getRecommendations: function getRecommendations(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/recommendations" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getSimilar: function getSimilar(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/similar" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getTranslations: function getTranslations(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/translations" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getVideos: function getVideos(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/videos" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getAiringToday: function getAiringToday(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/airing_today" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getLatest: function getLatest(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/latest" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getOnTheAir: function getOnTheAir(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/on_the_air" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getPopular: function getPopular(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/popular" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getTopRated: function getTopRated(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/top_rated" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }
};

theMovieDb.tvSeasons = {
    getById: function getById(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/season/" + options.season_number + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getCredits: function getCredits(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/season/" + options.season_number + "/credits" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getExternalIds: function getExternalIds(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/season/" + options.season_number + "/external_ids" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getImages: function getImages(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/season/" + options.season_number + "/images" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getVideos: function getVideos(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/season/" + options.season_number + "/videos" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }
};

theMovieDb.tvEpisodes = {
    getById: function getById(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["episode_number", "season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/season/" + options.season_number + "/episode/" + options.episode_number + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getCredits: function getCredits(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["episode_number", "season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/season/" + options.season_number + "/episode/" + options.episode_number + "/credits" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getExternalIds: function getExternalIds(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["episode_number", "season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/season/" + options.season_number + "/episode/" + options.episode_number + "/external_ids" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getImages: function getImages(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["episode_number", "season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/season/" + options.season_number + "/episode/" + options.episode_number + "/images" + theMovieDb.common.generateQuery(options)
        }, success, error);
    },
    getVideos: function getVideos(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["episode_number", "season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client({
            url: "tv/" + options.id + "/season/" + options.season_number + "/episode/" + options.episode_number + "/videos" + theMovieDb.common.generateQuery(options)
        }, success, error);
    }
};
/*jshint esversion: 6 */

//находтим и подготавливаем шаблон карточки фильма для дальнейшей работы
var card = document.getElementById('movie-card').textContent.trim();

//компилируем наш шаблон в метод с помощью Lodash для дальгейшего использования, где либо
var compiledCard = _.template(card);

//Находим место, куда мы будет вставлять карточки фильмов.
var colectionWrapper = document.getElementById('searchMovie');

// метод, который будет выполнен в случае удачного обращения к API MovieDB
var successGetUpcomming = function successGetUpcomming(res) {

    // парсим JSON в объект
    var data = JSON.parse(res);

    // выводим его в консоль что бы было наглядно
    console.log('get movie list on search');
    console.log(data);
    console.log('////////////////////');

    //проходимся по коллекции фильмов из ответа и обьект каждого из фильмов 
    //передаем в ранее "скомпилированный" метод
    data.results.forEach(function (item) {
        console.log(item);
        colectionWrapper.insertAdjacentHTML('beforeend', compiledCard({ item: item }));
    });
};

// Метод, который будет вызван в случае ошибки при обращении к API MovieDB 

var errorGetUpcomming = function errorGetUpcomming() {
    console.log(arguments);
};

//обращение к методу библиотеки для получения списка предстоящих премьер
//данный метод приведен в качестве примера использования шаблона карточки фильма.
//За более детальной информацией обратитесь к документации библиотеки
theMovieDb.movies.getUpcoming({ "language": "ru-RUS" }, successGetUpcomming, errorGetUpcomming);

var movie_collection = document.getElementById('black_background_wrapper');
var search_blcok = document.getElementsByClassName('search');

//место, куда пользователь вводит запрос
var searchInput_onFocus = function searchInput_onFocus() {
    document.getElementById('search-form_input_search').style.border = 'none';
};

var onClick = function onClick(event) {
    //TODO put future button className in first if
    if (event.target.className === "Some Future Class") {
        debugger;
        search_blcok.classList.remove('search_hidden');
        movie_collection.classList.add('black-background');
    }
    if (event.target.className !== "search") {
        debugger;
        search_blcok.classList.add('search_hidden');
        movie_collection.classList.remove('black-background');
    }
};

document.addEventListener("click", onClick);