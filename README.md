#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> Automatic RESTful API enabler for KeystoneJS

This module allows you to easily expose your keystone models through a REST API.
It allows for very granular control of editable fields, population, filters and more through configuration.

**At the moment it's only tested with keystone v0.2.x. It will soon be updated to allow use in v0.3.x!**

## Install

```sh
$ npm install --save restful-keystone
```

## Usage

### Example

#### Setup

```js
// file: routes/index.js
var restful = require('restful-keystone');

// ...

exports = module.exports = function( app ){
  // Views
  app.get( "/", routes.views.index );
  app.get( "/blog/:category?", routes.views.blog );
  app.get( "/blog/post/:post", routes.views.post );
  app.all( "/contact", routes.views.contact );

  app.use( restful( keystone, {
  	root: "/api",
  	resources : {
  		Post : true
  	}
  } ) );
}
```

#### Request

```sh
GET /api/posts
```

#### Response

```sh
Status: 200 OK
{
    "posts": [
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

### Configuration

A number of restful-keystone specific options can be passed to the module to configure how it functions:

#### `root`

**{String}** default: `"/api"`

Configures the REST API root.

#### `resources`

(At the moment) all other configuration options are bundled under `resources` to allow model-specific configuration and enabling of exposing the model through the REST API.
You should add a key/configuration pair for each model you want to configure, or you can simply pass a boolean `true` for a model to expose it with all default settings:

E.g.

```js
{
	resources : {
		Post : true
	}
}
```

##### `methods`

**{Boolean|String|String[]}** default: `true`

Allows you to configure which methods are allowed to be used on the resource, by default it's the full range.
You can supply the methods as a single string, e.g. `"retrieve list"` or as an array of strings, e.g. `["retrieve", "list"]`. When provided with a boolean value it sets all methods on or off.

```js
Post : {
	methods: ["retrieve", "update", "remove"]
}
```

```js
Post : {
	methods: false // no methods allowed
}
```

Possible values:

* `"create"`: allows a `POST` on a collection of resources, e.g. `POST /api/posts`. Creates a resource in the collection.
* `"list"`: allows a `GET` on a collection of resources, e.g. `GET /api/posts`. Retrieves a list of resources from a collection.
* `"retrieve"`: allows a `GET` on a specific resource, e.g. `GET /api/posts/54e2f3d7a21780d7a097ce8d`. Retrieves a specific resource from a collection.
* `"update"`: allows a `PATCH` on a specific resource, e.g. `PATCH /api/posts/54e2f3d7a21780d7a097ce8d`. Updates the state of a specific resource in a collection.
* `"remove"`: allows a `DELETE` on a specific resource, e.g. `DELETE /api/posts/54e2f3d7a21780d7a097ce8d`. Removes a specific resource from a collection.

#### `show`

**{Boolean|String|String[]}** default: `true`

Configures which fields of the resource will be shown, by default all fields declared in the schema (except virtuals) are shown. Again, provide them as a single space-delimited string, an array of strings or toggle them all on or off with a boolean.

```js
Post: {
	show : "title content"
}
```

```js
Post: {
	show : ["title", "author", "publishedDate", "content.brief"]
}
```

#### `edit`

**{Boolean|String|String[]}** default: `"true"`

Idem to `show`, except it configures which fields are editable. All fields passed to a request that are not listed in `edit` will simply be ignored, even if they exist in the schema.

#### `envelop`

**{Boolean|String}** default: `"<%=name%>"`

Used for enveloping the results (which is definitely best practice, _especially_ when multiple resources are returned).
**By default this will be the singular or plural version of the list name**, e.g. `"posts"` or `"post"`.

```sh
GET /api/posts

Status: 200 OK
{
    "posts": []
}
```
```sh
GET /api/posts/54e2f411a21780d7a097ce8e

Status: 200 OK
{
	"post": {
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
Post : {
	envelop: "results"
}
```

Will envelop all request results in `"results"`:

```sh
GET /api/posts

Status: 200 OK
{
    results: []
}
```

If however, you pass it an ERB-style interpolate delimiter string it will be substituted with whatever list or configuration value you want. E.g.

```js
Post : {
	envelop: "<%=path%>"
}
```

Will envelop all results (even those of requests on single resources) in a field with the same name as the `path` value of the list, e.g. `"posts"`:

```sh
GET /api/posts/54e2f411a21780d7a097ce8e

Status: 200 OK
{
	"posts": {
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



You can turn enveloping off altogether by passing it a boolean `false`.

#### `filter`

**{Object}**

You can set permanent filtering on a collection with `filter`. Pass it any key/value pair to automatically restrict all operations to documents that pass the condition.

```js
Post : {
	filter : {
		state: "published"
	}
}
```

Will only operate on Post documents that have a `"published"` value in `"state"`.

#### `populate`

**{Boolean|String|String[]}** default: `false`

Allows automatic population of relationship fields.

```js
Post : {
	populate : "author"
}
```

```sh
GET /api/posts/54e2f411a21780d7a097ce8e

Status: 200 OK
{
    "post": {
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

### Requests

All values can be passed with requests as `json` bodies or as url encoded json over the query string.

```sh
PATCH /api/posts/54e2f411a21780d7a097ce8e
{
	"title": "Changed my title!"
}

Status: 200 OK
{
    "post": {
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
PATCH /api/posts/54e2f411a21780d7a097ce8e?%7B%0D%0A%09%22title%22%3A+%22Changed+my+title%21%22%0D%0A%7D

Status: 200 OK
{
    "post": {
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
You need to set up any restrictions you want to see applied to routes yourself. (Probably this will change in the near future)

## Roadmap

* Configuration through `json` files
* Hooks for `pre` and `post` middleware
* Promise processing
* Optional full adherence to jsonapi.org spec
* Pagination

## License

MIT © [d-pac](http://www.d-pac.be)


[npm-url]: https://npmjs.org/package/restful-keystone
[npm-image]: https://badge.fury.io/js/restful-keystone.svg
[travis-url]: https://travis-ci.org/d-pac/restful-keystone
[travis-image]: https://travis-ci.org/d-pac/restful-keystone.svg?branch=master
[daviddm-url]: https://david-dm.org/d-pac/restful-keystone.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/d-pac/restful-keystone
