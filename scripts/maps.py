"""Generate local equirectangular SVG maps from Natural Earth (public domain)."""
import json, html
from pathlib import Path
root=Path(__file__).resolve().parent.parent
features=json.loads((root/'data/countries.geojson').read_text())['features']
# Natural Earth ADM0_A3 labels retain disputed boundary geometry as published.
labels={'MAR': ('Marokko',-7.0,30.8),'NGA':('Nigeria',8.2,9.8),'GHA':('Ghana',-1.6,7.8),'KEN':('Kenia',37.8,0.5),'ZAF':('Südafrika',24,-29)}

def map_svg(bounds, width, height, mode='world', marker=None, highlight=None):
    west,south,east,north=bounds
    def xy(p): return ((p[0]-west)/(east-west)*width,(north-p[1])/(north-south)*height)
    out=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img"><rect width="{width}" height="{height}" fill="#f5f7f7"/>']
    for f in features:
        prop=f['properties']; code=prop['ADM0_A3']; continent=prop['CONTINENT']
        geom=f['geometry']; polygons=geom['coordinates'] if geom['type']=='MultiPolygon' else [geom['coordinates']]
        paths=[]
        for poly in polygons:
            for ring in poly:
                if mode=='africa' and not any(west <= p[0] <= east and south <= p[1] <= north for p in ring): continue
                points=[xy(p) for p in ring]
                paths.append('M'+'L'.join(f'{x:.1f},{y:.1f}' for x,y in points)+'Z')
        if not paths: continue
        fill='#e1e5e4'
        if mode=='africa' and continent=='Africa': fill='#ffffff'
        if mode=='africa' and code in labels: fill='#d6e7e6'
        if highlight==continent: fill='#d17852'
        # Africa includes Madagascar; geographical continents, not a guessed outline.
        out.append(f'<path d="{" ".join(paths)}" fill="{fill}" stroke="#677877" stroke-width="0.65"/>')
    if mode=='africa':
        for code,(label,x,y) in labels.items():
            px,py=xy((x,y))
            # Coast-adjacent Ghana needs an external label and leader line.
            if code=='GHA':
                out.append(f'<path d="M{px},{py} L{px-65},{py+33}" stroke="#163d40" fill="none"/>'); px-=67; py+=47
            if code=='NGA': py-=14
            if code=='MAR': py-=23
            out.append(f'<text x="{px:.1f}" y="{py:.1f}" text-anchor="middle" font-size="26" font-family="Arial,sans-serif" fill="#122f33" stroke="#fff" stroke-width="4" paint-order="stroke">{html.escape(label)}</text>')
        ex,ey=xy((0,0)); ex2,ey2=xy((east,0))
        out.append(f'<path d="M0,{ey} H{width}" stroke="#849799" stroke-dasharray="7 5"/><text x="{width-8}" y="{ey-8}" text-anchor="end" font-size="14" font-family="Arial" fill="#344b4c">Äquator</text>')
        if marker:
            x,y=xy(marker)
            out.append(f'<circle cx="{x}" cy="{y}" r="10" fill="#b93e29" stroke="white" stroke-width="3"/><circle cx="{x}" cy="{y}" r="3" fill="white"/>')
        out.append('<text x="18" y="28" font-size="18" font-family="Arial" fill="#344b4c">N ↑</text>')
    out.append('</svg>')
    return ''.join(out)
world=map_svg((-180,-60,180,85),900,363)
africa_bounds=(-20,-36,56,38)
maps={'world':world,'reveal':map_svg((-180,-60,180,85),900,363,highlight='Africa'),
      'a':map_svg((-180,-60,180,85),900,363,highlight='Africa'),
      'b':map_svg((-180,-60,180,85),900,363,highlight='South America')}
for key,loc in [('atlas',(-7.9,31.1)),('city',(3.38,6.45)),('cocoa',(-1.6,6.3)),('summary',None)]:
    maps[key]=map_svg(africa_bounds,610,594,'africa',marker=loc)
for key,svg in maps.items(): (root/f'assets/maps/{key}.svg').write_text(svg)
(root/'data/maps.js').write_text('export const maps = '+json.dumps(maps,ensure_ascii=False)+';\n')
print('Generated',len(maps),'local maps')
