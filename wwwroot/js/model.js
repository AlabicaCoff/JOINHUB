const dt_f = '';
const PATH = {
    detail: '',

};

class Info {
    constructor({
        Title, 
        Description, 
        ExpireTime,
        Status,
        Tag,
        NumberOfParticipants,
        Location,
        Post_Participants,
    }) {
        this.title = Title;
        this.text = Description;
        this.etime = ExpireTime;
        this.status = Status;
        this.tag = Tag;
        this.cap = NumberOfParticipants;
        this.loc = Location;
        this.member = Post_Participants;
        q = new Date()
    }
}

class Post {
    constructor(id) {
        this.id = id;

        this.info = this.poll();

        this.ctime = CreatedTime;
        this.user = AuthorId;
        this.info = info;
    }
    poll() {
        fetch(
            `${this.id}`
        )
    }
    establish () {
        
    }
}