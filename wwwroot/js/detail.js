function obsoleteHover(obj, event) {
    let hover_msg = obj.children[1];
    let hover_msg_width = hover_msg.offsetWidth;

    let posX, posY;
    posX = event.pageX + 8;
    posY = event.pageY + 14;

    let right_bound = posX + hover_msg_width + 2;

    if (right_bound > (window.innerWidth || document.documentElement.clientWidth)) { // out of bound
        posX = event.pageX - hover_msg_width;
    }

    hover_msg.style.left = posX + 'px';
    hover_msg.style.top = posY + 'px';
}