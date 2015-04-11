#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> Automatic RESTful API enabler for KeystoneJS

This module allows you to easily expose your keystone models through a REST API.
It allows for very granular control of editable fields, population, filters and more through configuration.

#### Features

* Extremely easy setup
* Granular control/configuration
* Route configuration by keystone list, instead of path
* Versatile API

## Install

```sh
$ npm install --save restful-keystone
```

## Usage

### Basic Example

Let's assume we've got an `Article` list set up in `models`. We only need a few lines to expose it in a REST API.

#### Setup

```js
// file: routes/index.js
var keystone = require('keystone');

// Pass your keystone instance to the module
var restful = require('restful-keystone')(keystone);

// ...

exports = module.exports = function( app ){
  //Explicitly define which lists we want exposed
  restful.expose({
    Article : true
  }).start();
}
```

Yep. That's it.

#### Request

```sh
GET /api/articles
```

#### Response

```sh
Status: 200 OK
{
    "articles": [
        {
            "_id": "54e2f3d7a21780d7a097ce8d",
            "title": "Lorem Ipsum",
            "author": null,
            "categories": [],
            "content": {
                "brief": "<p>Lorem Ipsum</p>",
                "extended": "<p>Dolor sit amet</p>"
            },
            "state": "draft"
        },
        {
            "_id": "54e2f411a21780d7a097ce8e",
            "title": "Just a small Test",
            "publishedDate": "2015-02-16T23:00:00.000Z",
            "author": null,
            "categories": [],
            "content": {
                "brief": "<p>This is a test</p>",
                "extended": "<p>To make sure restful-keystone is functioning correctly</p>"
            },
            "state": "published"
        }
    ]
}
```

By default it will setup these routes:

* `GET /api/<collection>`: a **`list`** operation; returns all of the resources
* `POST /api/<collection>`: a **`create`** operation; creates a new resource in the collection
* `GET /api/<collection>/:id`: a **`retrieve`** operation; retrieves a single resource from the collection
* `PATCH /api/<collection>/:id`: an **`update`** operation; updates the state of the resource with the values from the payload
* `DELETE /api/<collection>/:id`: a **`remove`** operation; removes the resource from the collection

### API


#### module

The module itself requires a `keystone` instance to be passed to it:

```js
var restful = require("restful-keystone")(keystone);
```

However, you can declare the `root` of your api here as well:

```js
var restful = require("restful-keystone")(keystone, {
    root: "/api/v1"
});
```

Will host your REST API at `/api/v1`. Default value is a plain `/api`.

#### `expose`

Allows you to fully configure your exposed lists. You **have** to pass a truthy entry for each list you want exposed:

```js
restful.expose({
    Article: true,
    User: true
});
```

By default lists aren't exposed for security reasons, which is why you need to tell restful-keystone explicitly you want a list enabled in the REST API.
You have to use the list name as the identifier, i.e. it's the value you passed to `keystone.list`, e.g.

```js
// file: models/articles.js
// ...
var Article = new keystone.list("Article", {
    //...
});
```

There's a number of options you can pass to `expose` for further configuration:

##### `methods`

**{Boolean|String|String[]}** default: `true`

Allows you to configure which methods are allowed to be used on the resource, by default it's the full range.
You can supply the methods as a single string, e.g. `"retrieve list"` or as an array of strings, e.g. `["retrieve", "list"]`. When provided with a boolean value it sets all methods on or off.

```js
restful.expose({
    Article : {
    	methods: ["retrieve", "update", "remove"]
    }
});
```

```js
restful.expose({
    Article : {
    	methods: false // no methods allowed
    }
});
```

Possible values:

* `"create"`: allows a `POST` on a collection of resources, e.g. `POST /api/posts`. Creates a resource in the collection.
* `"list"`: allows a `GET` on a collection of resources, e.g. `GET /api/posts`. Retrieves a list of resources from a collection.
* `"retrieve"`: allows a `GET` on a specific resource, e.g. `GET /api/posts/54e2f3d7a21780d7a097ce8d`. Retrieves a specific resource from a collection.
* `"update"`: allows a `PATCH` on a specific resource, e.g. `PATCH /api/posts/54e2f3d7a21780d7a097ce8d`. Updates the state of a specific resource in a collection.
* `"remove"`: allows a `DELETE` on a specific resource, e.g. `DELETE /api/posts/54e2f3d7a21780d7a097ce8d`. Removes a specific resource from a collection.

##### `show`

**{Boolean|String|String[]}** default: `true`

Configures which fields of the resource will be shown, by default all fields declared in the schema (except virtuals) are shown. Again, provide them as a single space-delimited string, an array of strings or toggle them all on or off with a boolean.

```js
restful.expose({
    Article : {
    	show : "title content"
    }
});
```

```js
restful.expose({
    Article : {
    	show : ["title", "author", "publishedDate", "content.brief"]
    }
});
```

##### `edit`

**{Boolean|String|String[]}** default: `"true"`

Idem to `show`, except it configures which fields are editable. All fields passed to a request that are not listed in `edit` will simply be ignored, even if they exist in the schema.

##### `envelop`

**{Boolean|String}** default: `"<%=name%>"`

Used for enveloping the results (which is definitely best practice, _especially_ when multiple resources are returned).
**By default this will be the singular or plural version of the list name**, e.g. `"articles"` or `"article"`.

```sh
GET /api/articles

Status: 200 OK
{
    "articles": []
}
```
```sh
GET /api/articles/54e2f411a21780d7a097ce8e

Status: 200 OK
{
	"article": {
	    "_id": "54e2f411a21780d7a097ce8e",
	    "title": "Just a small Test",
	    "publishedDate": "2015-02-16T23:00:00.000Z",
	    "author": null,
	    "categories": [],
	    "content": {
	        "brief": "<p>This is a test</p>",
	        "extended": "<p>To make sure restful-keystone is functioning correctly</p>"
	    },
	    "state": "published"
	}
}
```

When you pass it a **plain string** it will be used as-is:

```js
restful.expose({
    Article : {
    	envelop: "results"
    }
});
```

Will envelop all request results in `"results"`:

```sh
GET /api/articles

Status: 200 OK
{
    results: [
        // articles
    ]
}
```

If however, you pass it an ERB-style interpolate delimiter string it will be substituted with whatever list or configuration value you want. E.g.

```js
restful.expose({
    Article : {
    	envelop: "<%=path%>"
    }
});
```

Will envelop all results (even those of requests on single resources) in a field with the same name as the `path` value of the list, e.g. `"articles"`:

```sh
GET /api/articles/54e2f411a21780d7a097ce8e

Status: 200 OK
{
	"articles": {
	    "_id": "54e2f411a21780d7a097ce8e",
	    "title": "Just a small Test",
	    "publishedDate": "2015-02-16T23:00:00.000Z",
	    "author": null,
	    "categories": [],
	    "content": {
	        "brief": "<p>This is a test</p>",
	        "extended": "<p>To make sure restful-keystone is functioning correctly</p>"
	    },
	    "state": "published"
	}
}
```

**You can turn enveloping off altogether by passing it a boolean `false`.**

##### `filter`

**{Object}**

You can set permanent filtering on a collection with `filter`. Pass it any key/value pair to automatically restrict all operations to documents that pass the condition.

```js
restful.expose({
    Article : {
    	filter : {
    		state: "published"
    	}
    }
});
```

Will only operate on Article documents that have a `"published"` value in `"state"`.

##### `populate`

**{Boolean|String|String[]}** default: `false`

Allows automatic population of relationship fields.

```js
restful.expose({
    Article : {
    	populate : "author"
    }
});
```
```sh
GET /api/articles/54e2f411a21780d7a097ce8e

Status: 200 OK
{
    "article": {
        "_id": "54e2f3d7a21780d7a097ce8d",
        "title": "Lorem Ipsum",
        "author": {
            "_id": "543f8abd6f0a6bb721653954",
            "name": {
                "last": "User",
                "first": "Admin",
                "full": "Admin User"
            },
            "email": "admin@d-pac.be"
        },
        "content": {
            "brief": "<p>Lorem Ipsum</p>",
            "extended": "<p>Dolor sit amet</p>"
        }
    }
}
```

##### `path`

**{String}** default: the plural name of the list

Allows you to configure the path at which the resources will be expose.

```js
restful.expose({
    Article : {
        path : "news"
    }
});
```
```sh
GET /api/news/54e2f411a21780d7a097ce8e

Status: 200 OK
{
    "article": {
        "_id": "54e2f3d7a21780d7a097ce8d",
        "title": "Lorem Ipsum",
        "author": {
            "_id": "543f8abd6f0a6bb721653954",
            "name": {
                "last": "User",
                "first": "Admin",
                "full": "Admin User"
            },
            "email": "admin@d-pac.be"
        },
        "content": {
            "brief": "<p>Lorem Ipsum</p>",
            "extended": "<p>Dolor sit amet</p>"
        }
    }
}
```

#### `before` and `after`

`before` and `after` allow you to register middleware functions that are executed ... umm ... before and after the response creation.
Obviously this could be achieved by using the usual `app.get("/api/articles", someMiddleware)` as well, but these methods allow you to configure it by list name instead of path.

```js
restful.expose({
    Article: true
}).before({
    Article: requireAdmin
});
```

This will call the `requireAdmin` middleware function before the response is generated, for any of the methods: "retrieve", "list", ...
Obviously you can configure it to be executed for specific methods only:

```js
restful.expose({
    Article: true
}).before({
    Article: {
        update: requireAdmin,
        remove: [requireAdmin, resourceExists],
        create: [requireAdmin, limitNotReached]
    }
});
```

Either provide the middleware by method as in the above example, but if you want to execute the same middleware on several methods at once you can pass them separately:

```js
restful.expose({
    Article: true
}).before("update remove create", {
    Article:  requireAdmin
});
```

This will execute `requireAdmin` only for the "update", "remove" and "create" methods (i.e. not for "list" and "retrieve")

As you saw in the above examples you can pass a function or an array of functions in all occasions.

Multiple calls to `before` (or `after`) will merge the configurations:

```js
restful.expose({
    Article: true
}).before("update remove create", {
    Article:  requireAdmin
}).before("update", {
    Article: requireAllFields
});
```

Will execute `requireAdmin` and `requireAllFields` for the "update" method.

**`after` behaves identical to `before` except for one thing:**

By default restful-keystone will send the response, but any method that receives `after` middleware will have to have additional middleware to send the response. This is to allow maximum flexibility, otherwise you wouldn't be able to manipulate the results before they're sent.

```js
restful.expose({
    Article: true
}).after("create", {
    Article:  function(req, res, next){
        console.log("CREATED:", res.locals.body);
        res.send(res.locals.status, res.locals.body);
    }
});
```

As you can see the response and status code are stored in `res.locals`

#### start

This signals to restful-keystone that it should set up the routes et cetera. I.e. you're finished configuring.

```js
restful.expose({
    Article: true
}).after("create", {
    Article:  function(req, res, next){
        console.log("CREATED:", res.locals.body);
        res.send(res.locals.status, res.locals.body);
    }
}).start(); // DO NOT FORGET TO START restful-keystone
```

A `start` method was added to allow you to configure restful in any order you see fit, i.e. this is all possible:

```
restful.before( /* config */ )
    .expose( /* config */ )
    .after( /* config */ )
    .start();
```

Or

```
restful
    .after( /* config */ )
    .expose( /* config */ )
    .before( /* config */ )
    .start();
```

Just make sure `start` is the last method to be called.


### Requests

All values can be passed with requests as `json` bodies or as url encoded json over the query string.

```sh
PATCH /api/articles/54e2f411a21780d7a097ce8e
{
	"title": "Changed my title!"
}

Status: 200 OK
{
    "article": {
        "_id": "54e2f3d7a21780d7a097ce8d",
        "title": "Changed my title!",
        "author": "543f8abd6f0a6bb721653954",
        "content": {
            "brief": "<p>Lorem Ipsum</p>",
            "extended": "<p>Dolor sit amet</p>"
        }
    }
}
```

Is equivalent to:

```sh
PATCH /api/articles/54e2f411a21780d7a097ce8e?%7B%0D%0A%09%22title%22%3A+%22Changed+my+title%21%22%0D%0A%7D

Status: 200 OK
{
    "article": {
        "_id": "54e2f3d7a21780d7a097ce8d",
        "title": "Changed my title!",
        "author": "543f8abd6f0a6bb721653954",
        "content": {
            "brief": "<p>Lorem Ipsum</p>",
            "extended": "<p>Dolor sit amet</p>"
        }
    }
}
```

`list` requests allow the passing of a `filter` value in order to do on-the-fly filtering, see above for an explanation.

### Responses

All requests respond with a `200 OK` status if the request was succesful, except for `remove` requests which will return `204 No Content`.

When something goes wrong appropriate errors are thrown, however restful-keystone does not provide any error handling out of the box, i.e. you need to make sure you have some kind of error handling middleware in place.

### Permissions

restful-keystone does **NOT** provide any security checks, i.e. if you expose a resource it is available to anonymous requests !!
You need to set up any restrictions you want to see applied to routes yourself.

## Roadmap

* Configuration through `json` files
* Optional full adherence to jsonapi.org spec
* Pagination

## Changelog

* **v0.3** make compatible with Keystone v0.3 (i.e. express 4)
* **v0.2**
    * API improvements
    * added `before` and `after` hooks
* **v0.1** initial API

## License

MIT © [d-pac](http://www.d-pac.be)


[npm-url]: https://npmjs.org/package/restful-keystone
[npm-image]: https://badge.fury.io/js/restful-keystone.svg
[travis-url]: https://travis-ci.org/d-pac/restful-keystone
[travis-image]: https://travis-ci.org/d-pac/restful-keystone.svg?branch=master
[daviddm-url]: https://david-dm.org/d-pac/restful-keystone.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/d-pac/restful-keystone
