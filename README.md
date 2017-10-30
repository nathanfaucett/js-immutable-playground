Immutable Playground
=======

Immutable persistent data structures [playground](http://nathanfaucett.github.io/js-immutable-playground)


[Immutable List](https://github.com/nathanfaucett/immutable-list)
```javascript
var a = ImmutableList.of(0, 1, 2, 3);
var b = a.push(4, 5, 6);
a.toArray(); // -> [0, 1, 2, 3]
b.toArray(); // -> [0, 1, 2, 3, 4, 5, 6]
```

[Immutable Vector](https://github.com/nathanfaucett/immutable-vector)
```javascript
var a = ImmutableVector.of(0, 1, 2, 3);
var b = a.push(4, 5, 6);
a.toArray(); // -> [0, 1, 2, 3]
b.toArray(); // -> [0, 1, 2, 3, 4, 5, 6]
```

[Immutable HashMap](https://github.com/nathanfaucett/immutable-hash_map)
```javascript
var a = ImmutableHashMap.of({a: 0, b: 1});
var b = a.set("c", 2);
a.toObject(); // -> {a: 0, b: 1}
b.toObject(); // -> {a: 0, b: 1, c: 2}
```


[Immutable Set](https://github.com/nathanfaucett/immutable-set)
```javascript
var a = ImmutableSet.of(0, 1, 2, 3);
var b = a.set(2, 3, 4);
a.toArray(); // -> [0, 1, 2, 3]
b.toArray(); // -> [0, 1, 2, 3, 4]
```

[Immutable Record](https://github.com/nathanfaucett/immutable-record)
```javascript
var Person = ImmutableRecord({
name: null
}, "Person");
var a = new Person({name: "Bob"});
var b = a.set("name", "Billy");
a.toObject(); // -> {name: "Bob"}
b.toObject(); // -> {name: "Billy"}
```
