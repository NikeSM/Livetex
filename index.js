$(document).ready(function () {
    var $name = $('#name');
    var $content = $('#content');
    var $search = $('#search');
    var $create = $('#create');
    var $left_block = $('#left_block');



    var noteList = new Model.List($('#list'));
    noteList.refresh(init, noteList);
    noteList.refresh(filter, noteList.filter);
    noteList.setCurrentItem(noteList.currentItem, changeSelectNote);

    $create.click(function() {
        var note = new Model.Note("New note", "");
        note.pushNote();
        $name.show().val("New note");
        $content.show().val("");
        noteList.add(note, new_note, noteList);
        noteList.setCurrentItem(note, changeSelectNote);
        noteList.setFilter("");
        noteList.refresh(filter, noteList.filter)
    });

    $name.change(function() {
        noteList.currentItem.refresh(change_title, $name.val());
        noteList.refreshOne(noteList.currentItem, rename);
    });

    $content.change(function() {
        noteList.currentItem.refresh(change_content, $content.val());
    });

    $left_block.click(function(e){
        var target = $(e.target);
        if (target.is("li")) {

            var note = noteList.getNoteById(target.val());
            noteList.setCurrentItem(note, changeSelectNote);

        }
    });

    $search.change(function() {
        noteList.setFilter($search.val());
        noteList.refresh(filter, noteList.filter)
    });

    $(window).bind('storage', function (e) {
        var key = e.originalEvent.key;
        var value = e.originalEvent.newValue;
        var id = +key;
        var note;
        if (id) {
            note = noteList.getNoteById(id);
            if (!note) {
                note = new Model.Note("New note", "", id);
                noteList.add(note, new_note, noteList);
            }
            note.pullNote(rename);
            noteList.setCurrentItem(note, changeSelectNote)
        }

        if (key == 'currentItem' && key != null) {
            note = noteList.getNoteById(JSON.parse(value).id);
            noteList.setCurrentItem(note, changeSelectNote)
        }

        if (key == 'filter') {
            noteList.setFilter(value);
            noteList.refresh(filter, noteList.filter)
        }

        console.log("key", e.originalEvent.key);
        console.log("value", e.originalEvent.newValue);
    });


    function new_note(item, noteList) {
        this.$container.append(item.$container.text(item.title));
        noteList.refreshOne(item, filter, noteList.filter)
    }

    function change_title(title) {
        this.title = title;
    }

    function change_content(content) {
        this.content = content;
    }

    function rename() {
        this.$container.text(this.title)
    }

    function init(noteList) {
        noteList.$container.append(this.$container.text(this.title));
    }

    function filter(string) {
        if (string == "" || this.title.indexOf(string) != -1) {
            this.$container.show()
        } else {
            this.$container.hide()
        }
        $search.val(string);
    }

    function changeSelectNote() {

        $name.show();
        $content.show();
        $name.val(this.title);
        $content.val(this.content);
        $('li').removeClass('selected');
        this.$container.addClass("selected");
    }
});

