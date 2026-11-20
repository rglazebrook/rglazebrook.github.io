// Generates the pixel-art favicon set from the 16x16 grid below.
// Usage: node scripts/make-favicon.cjs  ->  public/favicon.svg, favicon.ico, apple-touch-icon.png
// Grid key: ' ' transparent, '.' background, H hair/beard, g grey, S skin, s skin shadow, B eye, M mouth.
const fs=require('fs');
const grid=[
"  ............  ",
" .....HHHH..... ",
"....HHHHHHHH....",
"...HHHHHHHHHH...",
"..HHHHHHHHHHHH..",
"..HHHHSSSSSSHH..",
"..gHSSSSSSSSSg..",
"..HSHHSSSSHHSH..",
"..sSSBSSSSBSSs..",
"..sSSSSssSSSSs..",
"..HSSSSSSSSSSH..",
"..HHSHHHHHHSHH..",
"..HgHHHMMHHHgH..",
"..HHgHHHHHHgHH..",
"...HHHHggHHHH...",
"  ...HHHHHH...  ",
];
const pal={'.':'#6366f1',H:'#2b2421',g:'#8c837d',S:'#eeb594',s:'#cf8f70',B:'#4f8ff7',M:"#a3584d"};
let rects=[];
grid.forEach((row,y)=>{let x=0;while(x<16){const c=row[x];let w=1;while(x+w<16&&row[x+w]===c)w++;if(pal[c])rects.push(`<rect x="${x}" y="${y}" width="${w}" height="1" fill="${pal[c]}"/>`);x+=w;}});
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">\n<!-- 16x16 pixel-art portrait. Generated from a character grid; edit the grid, not the rects. -->\n${rects.join('\n')}\n</svg>\n`;
fs.writeFileSync('public/favicon.svg',svg);

const sharp = require('sharp');
(async()=>{
  const svg='public/favicon.svg';
  const base=await sharp(svg,{density:72}).resize(16,16).png().toBuffer();
  const up=s=>sharp(base).resize(s,s,{kernel:'nearest'}).png().toBuffer();
  const sizes=[16,32,48];
  const pngs=await Promise.all(sizes.map(up));
  const head=Buffer.alloc(6); head.writeUInt16LE(1,2); head.writeUInt16LE(sizes.length,4);
  let off=6+16*sizes.length; const dirs=[];
  pngs.forEach((p,i)=>{const d=Buffer.alloc(16); d[0]=sizes[i]; d[1]=sizes[i]; d.writeUInt16LE(1,4); d.writeUInt16LE(32,6); d.writeUInt32LE(p.length,8); d.writeUInt32LE(off,12); off+=p.length; dirs.push(d);});
  fs.writeFileSync('public/favicon.ico',Buffer.concat([head,...dirs,...pngs]));
  // Apple touch icon: 10x pixels on a full-bleed indigo square (iOS rounds corners itself)
  const big=await sharp(base).resize(160,160,{kernel:'nearest'}).png().toBuffer();
  await sharp({create:{width:180,height:180,channels:4,background:'#6366f1'}}).composite([{input:big,left:10,top:10}]).png().toFile('public/apple-touch-icon.png');
})();
