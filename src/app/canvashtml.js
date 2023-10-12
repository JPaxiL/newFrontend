<script>
    HTMLCanvasElement.prototype.getContext = function(origFn) {
    return function(type, attribs) {
        attribs = attribs || {};
        attribs.preserveDrawingBuffer = true;
        return origFn.call(this, type, attribs);
    };
    }(HTMLCanvasElement.prototype.getContext);
</script>