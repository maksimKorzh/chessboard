function Drag (subject) {
    var dative = this,
        handle,
        dragClickOffsetX,
        dragClickOffsetY,
        lastDragX,
        lastDragY;

    subject.draggable = true;

    dative.styleHandle(subject);

    subject.addEventListener('dragstart', function (e) {    
        handle = dative.makeHandle(subject);

        dragClickOffsetX = e.layerX;
        dragClickOffsetY = e.layerY;

        this.style.opacity = 0;
    });

    subject.addEventListener('drag', function (e) {
        var useX = e.x,
            useY = e.y;

        // Odd glitch
        if (useX === 0 && useY === 0) {
            useX = lastDragX;
            useY = lastDragY;
        }

        if (useX === lastDragX && useY === lastDragY) {
            return;
        }

        dative.translate(useX - dragClickOffsetX, useY - dragClickOffsetY, handle, subject);

        lastDragX = useX;
        lastDragY = useY;
    });

    subject.addEventListener('dragend', function (e) {
        this.style.opacity = 1;

        handle.parentNode.removeChild(handle);
    });
};

/**
 * Prevent the text contents of the handle element from being selected.
 */
Drag.prototype.styleHandle = function (node) {
    node.style['userSelect'] = 'none';
};

/**
 * @param {HTMLElement} subject
 * @return {HTMLElement}
 */
Drag.prototype.makeHandle = function (subject) {
    return this.makeClone(subject);
};

/**
 * Clone node.
 * 
 * @param {HTMLElement} node
 * @return {HTMLElement}
 */
Drag.prototype.makeClone = function (node) {
    var clone;

    clone = node.cloneNode(true);

    this.styleClone(clone, node.offsetWidth, node.offsetHeight);

    node.parentNode.insertBefore(clone, node);

    return clone;
};

/**
 * Make clone width and height static.
 * Take clone out of the element flow.
 *
 * @param {HTMLElement} node
 * @param {Number} width
 * @param {Nubmer} height
 */
Drag.prototype.styleClone = function (node, width, height) {
    node.style.position = 'fixed';
    node.style.zIndex = 9999;
    node.style.width = width + 'px';
    node.style.height = height + 'px';
    node.style.left = '
