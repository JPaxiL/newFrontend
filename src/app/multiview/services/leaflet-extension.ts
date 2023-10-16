import * as L from 'leaflet';

declare module 'leaflet' {
  interface Canvas {
    _updateMarker6Point(layer: L.Canvas): void;
  }
}

L.Canvas.include({
  _updateMarker6Point(layer: any) {
    if (!this._drawing || !layer) {
      return;
    }

    const p = layer._point;
    const ctx = this._ctx;
    const r = Math.max(Math.round(layer._radius), 1);

    this._drawnLayers[layer._leaflet_id] = layer;

    ctx.beginPath();
    ctx.moveTo(p.x + r, p.y);
    ctx.lineTo(p.x + 0.43 * r, p.y + 0.25 * r);
    ctx.lineTo(p.x + 0.50 * r, p.y + 0.87 * r);
    ctx.lineTo(p.x, p.y + 0.50 * r);
    ctx.lineTo(p.x - 0.50 * r, p.y + 0.87 * r);
    ctx.lineTo(p.x - 0.43 * r, p.y + 0.25 * r);
    ctx.lineTo(p.x - r, p.y);
    ctx.lineTo(p.x - 0.43 * r, p.y - 0.25 * r);
    ctx.lineTo(p.x - 0.50 * r, p.y - 0.87 * r);
    ctx.lineTo(p.x, p.y - 0.50 * r);
    ctx.lineTo(p.x + 0.50 * r, p.y - 0.87 * r);
    ctx.lineTo(p.x + 0.43 * r, p.y - 0.25 * r);
    ctx.closePath();
    this._fillStroke(ctx, layer);
  },
});

class Marker6Point extends L.Map {
  _updatePath() {
    
  }
}
