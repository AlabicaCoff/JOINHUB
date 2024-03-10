const dt_f = '';


class Post {
    constructor(id) {
        this.id = id;
        this.get();
        this.info = this.poll();
    }

    get() {
        this.ctime = new Date(CreatedTime);
        this.user = new Author();
        this.info = info;
    }

    poll() {
        fetch(
            `/post/${this.id}`
        )
        this.editable = '';
    }
}

class Timely {
    constructor({
        Status,
        Post_Participants,
    }) {
        this.status = Status;
        this.member = Post_Participants;
    }
}

class Editable {
    constructor({
        Title, 
        Description, 
        ExpireTime,
        Tag,
        NumberOfParticipants,
        Location,
    }) {
        this.title = Title;
        this.text = Description;
        this.etime = new Date(ExpireTime);
        this.tag = Tag;
        this.cap = NumberOfParticipants;
        this.loc = Location;
    }
}

class Participant {

}

class Author {
    constructor({
        Username,
        FullName
    }) {
        this.username = Username;
        this.name = FullName
    }
}

class Notification {
    
}

class El {
    static tagname = 'div';
    static attr = {};

    /**
     * @param {HTMLElement} root
     */
    constructor(root, ...arg) {
        this.root = root;
        this.init(...arg);
        this.el = this.build();
        this.finish();
    }
    init(...arg) {}

    finish() {}

    build() {
        /** @type {typeof El} */ // @ts-ignore
        const cls = this.constructor;
        const el = document.createElement(cls.tagname);

        for (const key in cls.attr)
            el.setAttribute(key, cls.attr[key]);

        this.root.appendChild(el);
        return el;
    }

    /**
     * @param {HTMLElement} root
     */
    static preview(root) {
        const el = new this(root);
        /* ... */
        return el;
    }
}

// const s = '01-01-1970 00:03:44';
// const d = new Date(s);
// console.log(d); // ---> Thu Jan 01 1970 00:03:44 GMT-0500 (Eastern Standard Time