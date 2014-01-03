(function() {

DS.CakeRESTSerializer = DS.RESTSerializer.extend({
    init: function() {
        this._super.apply(this, arguments);
    },

    removeCakePayloadKey: function(type, payload) {
        var typeKey = type.typeKey.classify();
        if (payload.hasOwnProperty(typeKey)) {
            return payload[typeKey];
        }
        return payload;
    },

    extractCakePayload: function(store, type, payload) {
        type.eachRelationship(function(key, relationship){
            // TODO should we check if relationship is marked as embedded?
            if (!Ember.isNone(payload[key]) && typeof(payload[key][0]) !== 'number' && relationship.kind ==='hasMany') {
                if (payload[key].constructor.name === 'Array' && payload[key].length > 0) {
                    var ids = payload[key].mapBy('id'); //todo find pk (not always id)
                    this.pushArrayPayload(store, relationship.type, payload[key]);
                    payload[key] = ids;
                }
            }
            else if (!Ember.isNone(payload[key]) && typeof(payload[key]) === 'object' && relationship.kind ==='belongsTo') {
                var id=payload[key].id;
                this.pushSinglePayload(store,relationship.type,payload[key]);
                payload[key]=id;
            }
        }, this);
    },

    removeWrappingCakePayloadKey: function(type, payload, isArray) {
        var typeKey = type.typeKey.underscore();

        if (isArray) {
            typeKey = typeKey.pluralize();
        }
        return payload[typeKey];
    },

    extractSingle: function(store, type, payload) {
        payload = this.removeWrappingCakePayloadKey(type, payload, false);
        payload = this.removeCakePayloadKey(type, payload);
        // using normalize from RESTSerializer applies transforms and allows
        // us to define keyForAttribute and keyForRelationship to handle
        // camelization correctly.
        this.normalize(type, payload);
        this.extractCakePayload(store, type, payload);
        return payload;
    },

    extractArray: function(store, type, payload) {
        var self = this;

        if (Ember.isNone(payload) || Ember.isEmpty(payload)) {
            return payload;
        }
        payload = this.removeWrappingCakePayloadKey(type, payload, true);
        for (var j = 0; j < payload.length; j++) {
            payload[j] = this.removeCakePayloadKey(type, payload[j]);
            // using normalize from RESTSerializer applies transforms and allows
            // us to define keyForAttribute and keyForRelationship to handle
            // camelization correctly.
            this.normalize(type, payload[j]);
            self.extractCakePayload(store, type, payload[j]);
        }
        return payload;
    },

    /**
     This method allows you to push a single object payload.

     It will first normalize the payload, so you can use this to push
     in data streaming in from your server structured the same way
     that fetches and saves are structured.

     @param {DS.Store} store
     @param {String} type
     @param {Object} payload
     */
    pushSinglePayload: function(store, type, payload) {
        type = store.modelFor(type);
        payload = this.extract(store, type, payload, null, "find");
        store.push(type, payload);
    },

    /**
     This method allows you to push an array of object payloads.

     It will first normalize the payload, so you can use this to push
     in data streaming in from your server structured the same way
     that fetches and saves are structured.

     @param {DS.Store} store
     @param {String} type
     @param {Object} payload
     */
    pushArrayPayload: function(store, type, payload) {
        type = store.modelFor(type);
        payload = this.extract(store, type, payload, null, "findAll");
        store.pushMany(type, payload);
    },

    /**
     Converts camelcased attributes to underscored when serializing.

     Stolen from DS.ActiveModelSerializer.

     @method keyForAttribute
     @param {String} attribute
     @returns String
     */
    keyForAttribute: function(attr) {
        return Ember.String.decamelize(attr);
    },

    /**
     Underscores relationship names when serializing relationship keys.

     Stolen from DS.ActiveModelSerializer.

     @method keyForRelationship
     @param {String} key
     @param {String} kind
     @returns String
     */
    keyForRelationship: function(key, kind) {
        return Ember.String.decamelize(key);
    }
});


})();

(function() {

var get = Ember.get;

DS.CakeRESTAdapter = DS.RESTAdapter.extend({
    defaultSerializer: 'DS/cakeREST',

    pathForType: function(type) {
        var decamelized = Ember.String.decamelize(type);
        return Ember.String.pluralize(decamelized);
    },

    createRecord: function(store, type, record) {
        var url = this.getCorrectPostUrl(record, this.buildURL(type.typeKey));
        var data = store.serializerFor(type.typeKey).serialize(record);
        return this.ajax(url, "POST", { data: data });
    },

    updateRecord: function(store, type, record) {
        var data = store.serializerFor(type.typeKey).serialize(record);
        var id = get(record, 'id'); //todo find pk (not always id)
        return this.ajax(this.buildURL(type.typeKey, id), "PUT", { data: data });
    },

    findMany: function(store, type, ids, parent) {
        var adapter, root, url, endpoint, attribute;
        adapter = this;

        if (parent) {
            attribute = this.getHasManyAttributeName(type, parent, ids);
            endpoint = store.serializerFor(type.typeKey).keyForAttribute(attribute);
            url = this.buildFindManyUrlWithParent(type, parent, endpoint);
        } else {
            Ember.assert("You need to add belongsTo for type (" + type.typeKey + "). No Parent for this record was found");
        }
        return this.ajax(url, "GET");
    },

    buildURL: function(type, id) {
        return this._super(type, id) + '.json';
    },

    getBelongsTo: function(record) {
        var totalParents = [];
        record.eachRelationship(function(name, relationship) {
            if (relationship.kind === 'belongsTo') {
                totalParents.push(name);
            }
        }, this);
        return totalParents;
    },

    getNonEmptyRelationships: function(record, totalParents) {
        var totalHydrated = [];
        totalParents.forEach(function(item) {
            if (record.get(item) !== null) {
                totalHydrated.push(item);
            }
        }, this);
        return totalHydrated;
    },

    getCorrectPostUrl: function(record, url) {
        var totalParents = this.getBelongsTo(record);
        var totalHydrated = this.getNonEmptyRelationships(record, totalParents);
        if (totalParents.length > 1 && totalHydrated.length <= 1) {
            return this.buildUrlWithParentWhenAvailable(record, url, totalHydrated);
        }

        if (totalParents.length === 1 && totalHydrated.length === 1) {
            var parent_value = record.get(totalParents[0]).get('id'); //todo find pk (not always id)
            var parent_plural = Ember.String.pluralize(totalParents[0]);
            var endpoint = url.split('/').reverse()[1];
            return url.replace(endpoint, parent_plural + "/" + parent_value + "/" + endpoint);
        }

        return url;
    },

    buildUrlWithParentWhenAvailable: function(record, url, totalHydrated) {
        if (record && url && totalHydrated && totalHydrated.length > 0) {
            var parent_type = totalHydrated[0];
            var parent_pk = record.get(parent_type).get('id'); //todo find pk (not always id)
            var parent_plural = Ember.String.pluralize(parent_type);
            var endpoint = url.split('/').reverse()[1];
            url = url.replace(endpoint, endpoint + '/' + parent_plural + "/" + parent_pk);
        }

        return url;
    },

    buildFindManyUrlWithParent: function(type, parent, endpoint) {
        var root, url, parentValue;

        parentValue = parent.get('id'); //todo find pk (not always id)
        root = parent.constructor.typeKey;
        url = this.buildURL(root, parentValue);
        url = url.substr(0, url.length - 5);
        return url + '/' + endpoint + '.json';
    },

    /**
     Extract the attribute name given the parent record, the ids of the referenced model, and the type of
     the referenced model.

     Given the model definition

     ````
     App.User = DS.Model.extend({
          username: DS.attr('string'),
          aliases: DS.hasMany('speaker', { async: true})
          favorites: DS.hasMany('speaker', { async: true})
      });
     ````

     with a model object

     ````
     user1 = {
          id: 1,
          name: 'name',
          aliases: [2,3],
          favorites: [4,5]
      }

     type = App.Speaker;
     parent = user1;
     ids = [4,5]
     name = getHasManyAttributeName(type, parent, ids) // name === "favorites"
     ````

     @method getHasManyAttributeName
     @param {subclass of DS.Model} type
     @param {DS.Model} parent
     @param {Array} ids
     @returns String
     */
    getHasManyAttributeName: function(type, parent, ids) {
        var attributeName;
        parent.eachRelationship(function(name, relationship){
            var relationshipIds;
            if (relationship.kind === "hasMany" && relationship.type.typeKey === type.typeKey) {
                relationshipIds = parent._data[name].mapBy('id');
                // check if all of the requested ids are covered by this attribute
                if (Ember.EnumerableUtils.intersection(ids, relationshipIds).length === ids.length) {
                    attributeName = name;
                }
            }
        });

        return attributeName;
    }
});


})();