// @ts-check
/**
 * @typedef {Object} Author
 * @prop {string} id
 * @prop {string} username
 * @prop {string} fullName
 */
/**
 * @typedef {Object} Post_Participants
 * @prop {string} userId
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
 * @prop {number} id
 * @prop {string} title // c
 * @prop {string} description // c
 * @prop {Date} createdTime // 
 * @prop {Date} expireTime // c 
 * @prop {number} status // c
 * @prop {number?} tag // c
 * @prop {number?} numberOfParticipants // c max members
 * @prop {string?} location // c
 * @prop {number} current_number // c <- Post_Participants
 * @prop {Author} author
 */


/** @return {SVGElement} */
function createIcon(icon) {
    // @ts-ignore
    return lucide.createElement(lucide[icon]);
}

function createElement({tagName='div', ...obj}) {
    const ele = document.createElement(tagName);
    return setAttr(ele, obj);
}

/** @param {HTMLElement} ele */
function setAttr(ele, {text='', ...obj}) {
    ele.textContent = text;
    
    for (const key in obj) {
        ele.setAttribute(key, obj[key]);
    }
    return ele
}

/** @param {string[]} ls */
function lastchain(obj, ls) {
    const newls = [...ls];
    const last = newls.pop();

    newls.forEach(
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
        if (n > 0) {
            let str = n.toString() + chr;
            return diff > 0 ? `${str} ago` : `Expire in ${str}`;
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

    init(...arg) {}

    finish() {}

    /** @returns {string} */
    html() {
        return `<p>${this.constructor.name}</p>`;
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
        
        return this.root.appendChild(createElement(
            { tagName, class: className }
        ));
    }

    tag(cls, tag='div') {
        const ele = document.createElement(tag);
        ele.className = cls;

        return ele.outerHTML;
    }

    ico(icon, cls='') {
        const ele = createIcon(icon);
        ele.setAttribute('class', cls);

        return ele.outerHTML;
    }
    
    // render and map
    render() {
        this.ele.innerHTML = this.html();
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

    init(userid) {
        this.userid = userid;
        setInterval(() => this.update(), 3000);
        setInterval(() => this.generate_cards(), 6000);
    }

    async get(manifest_url) {
        /** @type {string[]} */
        this.m_url = manifest_url;
        console.log('Row manifest', manifest_url, this.m_url);
        this.manifest = await super.get(manifest_url);
    }
    
    generate_cards() {
        if (this.manifest == undefined) {
            return null;
        }
        if (this.m_url != undefined) {
            this.get(this.m_url);
        }

        // rm expire url
        var temp = [...this.cards];

        this.cards
            .filter(card => !this.manifest.includes(card.url))
            .forEach(rm_card => {
                temp = temp.filter(card => card != rm_card);
                this.ele.removeChild(rm_card.ele);
            });

        this.cards = temp;
        

        // add new url
        const current = this.cards.map(card => card.url);
        this.manifest
            .filter(url => !current.includes(url))
            .forEach(url => this.add(url));
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

        this.ismy = post.author.id == this.root.userid;
        this.render();
        this.setattr(post);
        this.#refresh(post);
    }

    async update() {
        const post = await this.get();
        this.#refresh(post);
        console.log('update', this.url);
    }
    
    /** @return {Promise<Post>} */
    async get() {
        let raw = await super.get(this.url);

        // // ensure first uppercase
        // let raw = Object.fromEntries(
        //     Object.entries(raw).map(
        //         ([k, v]) => [capital(k), v]
        //     )
        // );
        return {
            ...raw, ...{
                createdTime: new Date(raw.createdTime),
                expireTime: new Date(raw.expireTime),
                current_number: raw.post_Participants.length
            }
        };
    }

    /** @param {Post} post */
    #refresh(post) {
        for (const [sel, keys, now] of this.changemap(post)) {
            const eleobj = this.find(sel);
            const [ lastobj, lastkey ] = lastchain(eleobj, keys);

            if (lastobj != null && lastobj[lastkey] != now) {
                console.log('change', this.url, lastobj[lastkey], now)
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
            user = this.find('.username'),
            ctime = this.find('.ctime');
        var 
            p_toggle = 1;

        // append .list element to .prop
        [[
            'loc', 'MapPin', post.location
        ],[
            'etime', 'TimerOff', post.expireTime.toLocaleString()
        ]]
        .forEach(([cls, ico, text]) => {
            if (text != null) {
                prop.appendChild(createElement({
                    class: 'list'
                }))
                .append(
                    createIcon(ico),
                    createElement({
                        class: `prop-text ${cls}`,
                        text: text.toString()
                    })
                );
            }
        });

        // set non-dynamic attr
        ctime.textContent = time_str(post.createdTime)

        setAttr(title, {
            href: `/Post/Detail/${post.id}`,
        });
        setAttr(user, {
            text: post.author.fullName + ' @ ' + post.author.username
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

        header.onclick = () => this.update();

        // window.matchMedia(
        //     '(max-width: 768px)'
        // ).onchange = e => {
        //     let i = Number(e.matches);
        //     header.style['flex-direction'] = ['row', 'column'][i];
        // };
    }

    /** 
     * @param {Post} post
     * @returns {any[][]} 
     */
    changemap(post) {
        const txt = ['textContent'];
        return [[
            'a.title', txt, post.title
        ],[
            '.content', txt, post.description
        ],[
            '.prop .loc', txt, post.location
        ],[
            '.foot .tag', txt, post.tag // convert enum
        ],[
            '.prop .etime', txt, post.expireTime.toLocaleString()
        ], [
            '.ctime', txt, time_str(post.createdTime)
        ],[
            '.people .cap', txt, `${post.current_number}/${post.numberOfParticipants}`
       // ],[
       //     '.header', ['style', 'background-color'], post.status // convert enum, combine post.id 
        ],[
            '.frame .bar', ['style', 'width'], (() => {
                let width = 0;
                if (post.numberOfParticipants) {
                    width = post.current_number/post.numberOfParticipants * 100;
                }
                return `${width}%`;
            })()
        ]];
    }

    html() {
        return /*html*/`
            <div class="header">
                <div class="list people">
                    ${this.ico('UsersRound')}
                    ${this.tag('cap')}
                </div>
                ${this.tag('prop')}
            </div>
            <div class="frame">
                ${this.tag('bar')}
                <div class="top">
                    <div class="left" onmouseover="Card.show_copy(this)" onmouseleave="Card.hide_copy(this)">
                        ${this.tag('title', 'a')}
                        <div class="copy" onclick="Card.copylink(this)">
                            ${this.ico('ClipboardCopy')}
                        </div>
                    </div>
                    ${this.ico('PanelTopClose', 'toggle-panel')} 
                </div>
                ${this.tag('content')}
                <div class="foot">
                    <div class="left">
                        ${this.tag('tag')} · ${this.tag('ctime')}
                    </div>
                    ${this.tag('username')}
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

