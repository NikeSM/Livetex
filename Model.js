window.Model = (function(){


    function Note(title, content, id) {
        console.log(id);
        var counter = localStorage.getItem('counter') || 1;
        this.id = id || counter++;
        localStorage.setItem('counter', counter);
        this.title = title;
        this.content = content;
        this.$container = $('<li>').val(this.id);
    }
    Note.prototype.pullNote = function(callback, args) {
        var newNote = JSON.parse(localStorage.getItem(this.id));
        this.title = newNote.title;
        this.content = newNote.content;
        if (callback) {
            callback.call(this, args);
        }
    };
    Note.prototype.toString = function() {
        var note = {
            title: this.title,
            content: this.content,
            id: this.id
        };
        return JSON.stringify(note);
    };
    Note.prototype.pushNote = function() {
        localStorage.setItem(this.id, this + "")
    };

    Note.prototype.refresh = function(callback, args) {
        callback.call(this, args);
        this.pushNote();
    };


    function List($container) {
        this.$container = $container;
        this.idList = [];
        this.items = [];
        this.filter = localStorage.getItem("filter") || "";
        this.idList = JSON.parse(localStorage.getItem("idList")) || [];

        for (var i = 0; i < this.idList.length; i++) {
            var note = JSON.parse(localStorage.getItem(this.idList[i]));
            note = new Model.Note(note.title, note.content, note.id);
            this.items.push(note);
        }

        if (JSON.parse(localStorage.getItem("currentItem"))) {
            this.currentItem = this.getNoteById(JSON.parse(localStorage.getItem("currentItem")).id);
        } else {
            this.currentItem = null
        }
    }

    List.prototype.setFilter = function(filter, callback, args) {
        this.filter = filter;
        localStorage.setItem("filter", filter);
        if (callback) {
            callback.apply(this, args);
        }
    };

    List.prototype.setCurrentItem = function(item, callback, args) {
        if (item) {
            this.currentItem = item;
            localStorage.setItem("currentItem", item + "");
            if (callback) {
                callback.apply(item, args);
            }
        }
    };

    List.prototype.add = function(item, callback, args) {
        callback.call(this, item, args);
        this.items.push(item);
        this.idList.push(item.id);
        localStorage.setItem("idList", JSON.stringify(this.idList));
        this.setCurrentItem(item);
    };

    List.prototype.getNoteById = function(id) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == id) {
                return this.items[i];
            }
        }

        return null;
    };

    List.prototype.refresh = function(callback, args) {
        for(var i = 0; i < this.items.length; i++) {
            callback.call(this.items[i], args)
        }
    };

    List.prototype.refreshOne = function(item, callback, args) {
        callback.call(item, args)
    };

    return {
        Note: Note,
        List: List
    }
})();
