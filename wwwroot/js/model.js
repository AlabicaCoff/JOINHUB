// @ts-check
/**
 * @typedef {Object} Author
 * @prop {string} Id
 * @prop {string} Username
 * @prop {string} FullName
 */
/**
 * @typedef {Object} Post_Participants
 * @prop {string} UserId
 */
/**
 * @typedef {Object} RawPost
 * @prop {number} Id
 * @prop {string} Title
 * @prop {string} Description
 * @prop {string} CreatedTime
 * @prop {string} ExpireTime
 * @prop {number} Status // enum: 0 Active, 1 Closed
 * @prop {number?} Tag // enum:
 * @prop {number?} NumberOfParticipants
 * @prop {string?} Location
 * @prop {Post_Participants[]} Post_Participants
 * @prop {Author} Author
 */
/**
 * @typedef {Object} Post
 * @prop {number} Id
 * @prop {string} Title // c
 * @prop {string} Description // c
 * @prop {Date} CreatedTime // <- string
 * @prop {Date} ExpireTime // c <- string
 * @prop {number} Status // c
 * @prop {number?} Tag // c
 * @prop {number?} NumberOfParticipants // c max members
 * @prop {string?} Location // c
 * @prop {number} current_number // c <- Post_Participants
 * @prop {Author} Author
 */


/** @return {HTMLElement} */
function createIcon(icon) {
    // @ts-ignore
    return lucide.createElement(lucide[icon]);
}

function Tag({tagName='div', ...obj}) {
    const ele = document.createElement(tagName);
    return setAttr(ele, obj);
}

/** @param {HTMLElement} ele */
function setAttr(ele, obj) {
    for (const key in obj) {
        ele.setAttribute(key, obj[key]);
    }
    return ele
}

/** @param {string[]} ls */
function lastchain(obj, ls) {
    const last = ls.pop();
    ls.forEach(
        next => obj = obj[next]
    );
    return [obj, last];
}

/** @param {Date} dt */
function time_str(dt) {
    // @ts-ignore
    const diff = new Date() - dt;
    const normalize = new Date(diff);
    const time = [
        ['d', normalize.getDate() - 1],
        ['h', normalize.getHours() - 7],
        ['m', normalize.getMinutes()],
        ['s', normalize.getSeconds()]
    ];
    for (const [chr, n] of time) {
        if (n) {
            let str = n.toString() + chr;
            return diff > 0 ? `${str} ago` : `in ${str}`;
        }
    }
}

class Component {
    static tagName = 'div';
    static className = '';

    constructor(root, ...arg) {
        this.root = root;
        this.init(...arg);
        this.ele = this.build();
        this.finish();
    }

    init(userid) {
        this.userid = userid;
    }

    finish() {}

    /** @returns {string} */
    html() {
        return `<p>\${this.constructor.name}</p>`;
    }

    /** @returns {HTMLElement} */
    find(sel) {
        // @ts-ignore
        return this.ele.querySelector(sel);
    }

    /** @returns {HTMLElement} */
    build() {
        /** @type {typeof Component} */
        // @ts-ignore
        const { tagName, className } = this.constructor;
        
        return this.root.appendChild(Tag(
            { tagName, className }
        ));
    }

    tag(cls, tag='div') {
        const ele = document.createElement(tag);
        ele.className = cls;

        return ele.outerHTML;
    }

    ico(icon, cls='') {
        const ele = createIcon(icon);
        ele.className = cls;

        return ele.outerHTML;
    }

    /** @param {HTMLElement} root */
    static preview(root) {
        const instance = new this(root);
        instance.ele.innerHTML = instance.html();
    }
    
    // render and map
    render() {
        this.ele.innerHTML = eval(this.html());
    }

    async get(url) {
        const resp = await fetch(url, {cache: "no-cache"});
        return await resp.json();
    }
}

class Row extends Component {
    static className = 'row';
    
    /** @type {Card[]} */
    cards = [];

    async get(manifest_url) {
        /** @type {string[]} */
        this.manifest = await super.get(manifest_url);
    }

    generate_cards() {
        this.manifest?.map(
            url => this.add(url)
        );
    }

    add(post_url) {
        const card = new Card(this.ele, post_url);

        this.cards.push(card);
        this.ele.appendChild(card.ele);
    }

    update() {
        this.cards.forEach(c => c.update());
    }
}

class Card extends Component{
    static className = 'crd';

    /** @param {string} url */
    init(url) {
        this.url = url;
    }

    async finish() {
        const post = await this.get();

        this.my = post.Id == this.root.userid;
        this.render();
        this.setattr(post);
        this.#refresh(post);
    }

    async update() {
        const post = await this.get();
        this.#refresh(post);
    }
    
    /** @return {Promise<Post>} */
    async get() {
        const raw = await super.get(this.url);
        return {
            ...raw, ...{
                CreatedTime: new Date(raw.CreatedTime),
                ExpireTime: new Date(raw.ExpireTime),
                current_number: raw.Post_Participants.length
            }
        };
    }

    /** @param {Post} post */
    #refresh(post) {
        for (const [sel, keys, now] of this.changemap(post)) {
            const eleobj = this.find(sel);
            const [ lastobj, lastkey ] = lastchain(eleobj, keys);
            
            if (lastobj[lastkey] != now) {
                lastobj[lastkey] = now;
            }
        }
    }

    /** @param {Post} post */
    setattr(post) {
        const 
            prop = this.find('.prop'),
            title = this.find('a.title'),
            panel = this.find('.toggle-panel'),
            header = this.find('.header'),
            content = this.find('.content'),
            foot = this.find('.foot'),
            user = this.find('.user'),
            ctime = this.find('.ctime');
        var 
            p_toggle = 0;

        // append .list element to .prop
        [[
            'loc', 'MapPin', post.Location
        ],[
            'etime', 'TimerOff', time_str(post.ExpireTime)
        ]]
        .forEach(([cls, ico, text]) => {
            if (text != null) {
                prop.appendChild(Tag({
                    className: 'list'
                }))
                .append(
                    createIcon(ico),
                    Tag({
                        className: `prop-text ${cls}`,
                        textContent: text.toString()
                    })
                );
            }
        });

        // set non-dynamic attr
        setAttr(ctime, {
            textContent: time_str(post.CreatedTime),
        });
        setAttr(title, {
            href: `/Post/Detail/${post.Author.Id}`,
            target: '_blank',
        });
        setAttr(user, {
            textContent: post.Author.FullName + ' · ' + post.Author.Username
        });

        // handle event
        panel.onclick = () => {
            let mode = ['PanelTopClose', 'PanelTopOpen'][p_toggle];

            panel.innerHTML = createIcon(mode).innerHTML;
            [ // hiding element
                prop, 
                content, 
                foot,
            ]
                .map(el => el.style)
                .forEach(
                    style => style.display = p_toggle ? 'none' : ''
                );
                p_toggle = Number(!p_toggle);
        }

        window.matchMedia('(max-width: 768px)').onchange = e => {
            let i = Number(e.matches);
            header.style['flex-direction'] = ['row', 'column'][i];
        };
    }

    /** 
     * @param {Post} post
     * @returns {any[][]} 
     */
    changemap(post) {
        const txt = ['textContent'];
        return [[
            'a.title', txt, post.Title
        ],[
            '.content', txt, post.Description
        ],[
            '.prop .loc', txt, post.Location
        ],[
            '.foot .tag', txt, post.Tag // convert enum
        ],[
            '.prop .etime', txt, time_str(post.ExpireTime)
        ],[
            '.people .cap', txt, `${post.current_number}/${post.NumberOfParticipants}`
       // ],[
       //     '.header', ['style', 'background-color'], post.Status // convert enum, combine post.Id 
        ],[
            '.frame .bar', ['style', 'width'], (() => {
                let width = 0;
                if (post.NumberOfParticipants) {
                    width = post.current_number/post.NumberOfParticipants * 100 + 5;
                }
                return `${width}%`;
            })()
        ]];
    }

    html() {
        return /*html*/`
            <div class="header">
                <div class="list people">
                    \${this.ico('UsersRound')}
                    \${this.tag('cap')}
                </div>
                \${this.tag('prop')}
            </div>
            <div class="frame">
                \${this.tag('bar')}
                <div class="top">
                    <div class="left" onmouseover="Card.show_copy(this)" onmouseleave="Card.hide_copy(this)">
                        \${this.tag('title', 'a')}
                        <div class="copy" onclick="Card.copylink(this)">
                            \${this.ico('ClipboardCopy')}
                        </div>
                    </div>
                    \${this.ico('PanelTopClose', 'toggle-panel')} 
                </div>
                \${this.tag('content')}
                <div class="foot">
                    <div class="left">
                        \${this.tag('tag')} · \${this.tag('ctime')}
                    </div>
                    \${this.tag('user')}
                </div>
            </div>
        `;
    }

    static show_copy(self) {
        self.querySelector('.copy').style.opacity = 1;
    }

    static hide_copy(self) {
        self.querySelector('.copy').style.opacity = 0;
    }

    static copylink(tag) {
        navigator.clipboard.writeText(
            tag.parentNode.querySelector('a').href
        );
    }
}