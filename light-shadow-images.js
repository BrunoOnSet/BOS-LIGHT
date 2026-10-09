(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  function applyShadowImages(){
    let doc;
    try{doc=frame.contentDocument||null;}catch(_){doc=null;}
    if(!doc)return false;

    const panel=doc.getElementById('bosShadowHardnessPanel');
    if(!panel)return false;

    const images=panel.querySelectorAll('.bft-reference-images img');
    if(images[0]){
      images[0].src='/BOS-LIGHT/assets/lighting/shadow-hardness/01-durete-des-ombres.jpg?v=20261009-2';
      images[0].alt='Dureté des ombres — schéma 1';
    }
    if(images[1]){
      images[1].src='/BOS-LIGHT/assets/lighting/shadow-hardness/02-durete-des-ombres.jpg?v=20261009-2';
      images[1].alt='Dureté des ombres — schéma 2';
    }
    return images.length>=2;
  }

  function refresh(){
    applyShadowImages();
    [60,180,500,1000,1800].forEach(ms=>setTimeout(applyShadowImages,ms));
  }

  frame.addEventListener('load',refresh);
  refresh();
})();
