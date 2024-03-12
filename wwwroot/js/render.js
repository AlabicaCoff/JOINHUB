// @ts-check

const icon = {
    'panel-top-close': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBhbmVsLXRvcC1jbG9zZSI+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSIzIiByeD0iMiIvPjxwYXRoIGQ9Ik0zIDloMTgiLz48cGF0aCBkPSJtOSAxNiAzLTMgMyAzIi8+PC9zdmc+',
    'panel-top-open': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBhbmVsLXRvcC1vcGVuIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIi8+PHBhdGggZD0iTTMgOWgxOCIvPjxwYXRoIGQ9Im0xNSAxNC0zIDMtMy0zIi8+PC9zdmc+',

};
const collapse_target = [
    '.prop',
    '.content',
    '.foot',
];


function time() {
    dt = new Date();
    tag = document.getElementsByClassName("time");
}    
setInterval(time, 30000);


// const collapse_display = {};

function get_collapse(crd) {
    return collapse_target.map(t => crd.querySelector(t).style);
}
// let sample = get_collapse(
//     document.querySelector('.crd')
// );

// for (let i = 0; i < collapse_target.length; i++) {
//     let t = collapse_target[i];
//     console.log()
//     collapse_display[t] = sample[i].display;
// }

function show_copy(top_left) {
    top_left.querySelector('.copy').style.opacity = 1;
}

function hide_copy(top_left) {
    top_left.querySelector('.copy').style.opacity = 0;
}

function copylink(tag) {
    navigator.clipboard.writeText(
        tag.parentNode.querySelector('a').href
    );
}
function collapse(tag) {
    const panel_toggle = ['panel-top-close', 'panel-top-open'];

    let crd = tag.parentNode.parentNode.parentNode;
    let index = (tag.alt == panel_toggle[0]) | 0;

    tag.alt = panel_toggle[index];
    tag.src = icon[tag.alt];

    // const header = {
    //     'flex-direction': ['column', 'row'][index],
    // }
    // window.matchMedia('(max-width: 768px)').addEventListener(type, listener)
    if (window.matchMedia('(max-width: 768px)').matches) {
        crd.querySelector('.header').style['flex-direction'] = ['column', 'row'][index];
    }

    get_collapse(crd).forEach(
        target => target.display = index ? 'none' : ''
    );
}


function setbar(crd) {
    let cap = crd.querySelector('.people .list');

    crd.querySelector('.bar').style.width = '' 
}

// const polling = new Worker('/js/my-web-worker.js');
// !important
// word-wrap: break-word;