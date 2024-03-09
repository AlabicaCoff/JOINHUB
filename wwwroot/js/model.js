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


// const s = '01-01-1970 00:03:44';
// const d = new Date(s);
// console.log(d); // ---> Thu Jan 01 1970 00:03:44 GMT-0500 (Eastern Standard Time