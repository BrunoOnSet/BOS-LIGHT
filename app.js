// BOS LIGHT V0.11 — assistant de puissance/exposition pour le tournage
// Mesures constructeur Aputure/amaran. Exposition incidente : C = 340 (Lumisphere Sekonic).

const INCIDENT_C = 340;
const STORAGE_KEY = 'bos-light-settings-v1';

const state = {
  fixture: 'halo60x', accessory: 'softbox', cct: 5600,
  intensityPct: 100, iso: 800, shutterDenom: 50, aperture: 2.8,
  testDistance: 2.0
};

const haloFixtures = {
  halo60x: {label:'Halo 60x',family:'halo',defaultAccessory:'softbox',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,2570],[3,295]],3200:[[1,2800],[3,321]],4300:[[1,3070],[3,353]],5600:[[1,3240],[3,372]],6500:[[1,3270],[3,375]]}},
    reflector:{label:'Réflecteur',quality:'measured',data:{2700:[[1,21440],[3,2164]],3200:[[1,23530],[3,2372]],4300:[[1,26000],[3,2622]],5600:[[1,27520],[3,2777]],6500:[[1,27890],[3,2812]]}},
    softbox:{label:'Softbox 60',quality:'measured',data:{2700:[[1,1760],[3,133]],3200:[[1,1927],[3,145]],4300:[[1,2129],[3,160]],5600:[[1,2255],[3,169]],6500:[[1,2285],[3,171]]}}
  }},
  halo100x: {label:'Halo 100x',family:'halo',defaultAccessory:'softbox',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,3670],[3,414]],3200:[[1,4360],[3,492]],4300:[[1,4890],[3,551]],5600:[[1,4860],[3,547]],6500:[[1,4630],[3,521]]}},
    reflector:{label:'Réflecteur',quality:'measured',data:{2700:[[1,27910],[3,2690]],3200:[[1,33500],[3,3230]],4300:[[1,38100],[3,3670]],5600:[[1,38400],[3,3700]],6500:[[1,36700],[3,3540]]}},
    softbox:{label:'Softbox 60',quality:'measured',data:{2700:[[1,2417],[3,182]],3200:[[1,2892],[3,218]],4300:[[1,3280],[3,247]],5600:[[1,3290],[3,248]],6500:[[1,3140],[3,237]]}}
  }},
  halo200x: {label:'Halo 200x',family:'halo',defaultAccessory:'softbox',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,7800],[3,881],[5,358]],3200:[[1,9460],[3,1066],[5,441]],4300:[[1,10500],[3,1184],[5,495]],5600:[[1,10530],[3,1187],[5,503]],6500:[[1,9800],[3,1104],[5,471]]}},
    reflector:{label:'Réflecteur',quality:'measured',data:{2700:[[1,22000],[3,2136],[5,746]],3200:[[1,26730],[3,2594],[5,921]],4300:[[1,29800],[3,2889],[5,1038]],5600:[[1,29980],[3,2901],[5,1054]],6500:[[1,27930],[3,2705],[5,988]]}},
    softbox:{label:'Softbox 90',quality:'measured',data:{2700:[[1,7090],[3,489],[5,175]],3200:[[1,8620],[3,595],[5,216]],4300:[[1,9620],[3,662],[5,244]],5600:[[1,9670],[3,666],[5,248]],6500:[[1,9010],[3,621],[5,233]]}}
  }},
  halo300x: {label:'Halo 300x',family:'halo',defaultAccessory:'softbox',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,11850],[3,1335],[5,554]],3200:[[1,14600],[3,1647],[5,685]],4300:[[1,16200],[3,1827],[5,768]],5600:[[1,16120],[3,1819],[5,763]],6500:[[1,14360],[3,1515],[5,683]]}},
    reflector:{label:'Réflecteur',quality:'measured',data:{2700:[[1,38100],[3,3630],[5,1292]],3200:[[1,47200],[3,4480],[5,1602]],4300:[[1,52600],[3,5000],[5,1803]],5600:[[1,52600],[3,5000],[5,1796]],6500:[[1,46800],[3,4450],[5,1610]]}},
    softbox:{label:'Softbox 90',quality:'measured',data:{2700:[[1,11530],[3,808],[5,293]],3200:[[1,14250],[3,999],[5,364]],4300:[[1,15850],[3,1113],[5,410]],5600:[[1,15890],[3,1111],[5,408]],6500:[[1,14140],[3,989],[5,366]]}}
  }},
  halo600x: {label:'Halo 600x',family:'halo',defaultAccessory:'softbox',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,23600],[3,2627],[5,1094]],3200:[[1,27920],[3,3100],[5,1280]],4300:[[1,32000],[3,3550],[5,1475]],5600:[[1,32500],[3,3610],[5,1494]],6500:[[1,31200],[3,3460],[5,1461]]}},
    reflector:{label:'Réflecteur',quality:'measured',data:{2700:[[1,72500],[3,6900],[5,2519]],3200:[[1,86400],[3,8200],[5,2948]],4300:[[1,99900],[3,9480],[5,3420]],5600:[[1,102100],[3,9680],[5,3480]],6500:[[1,98400],[3,9340],[5,3410]]}},
    softbox:{label:'Softbox 90',quality:'measured',data:{2700:[[1,21590],[3,1485],[5,566]],3200:[[1,25590],[3,1767],[5,662]],4300:[[1,29700],[3,2042],[5,768]],5600:[[1,30300],[3,2087],[5,782]],6500:[[1,29300],[3,2012],[5,766]]}}
  }}
};

const cobFixtures = {
  cob60xs:{label:'amaran COB 60x S',family:'cob',defaultAccessory:'reflector',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[0.5,8270],[1,2087],[3,252]],3200:[[0.5,8300],[1,2100],[3,252]],4300:[[0.5,8890],[1,2248],[3,268]],5600:[[0.5,9560],[1,2427],[3,288]],6500:[[0.5,9560],[1,2545],[3,302]]}},
    reflector:{label:'Mini Hyper Reflector',quality:'measured',data:{2700:[[0.5,96100],[1,27750],[3,2965]],3200:[[0.5,97400],[1,28160],[3,2980]],4300:[[0.5,105400],[1,30500],[3,3230]],5600:[[0.5,114700],[1,33300],[3,3510]],6500:[[0.5,120800],[1,35100],[3,3700]]}}
  }},
  cob100xs:{label:'amaran 100x S',family:'cob',defaultAccessory:'reflector',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,2760],[3,324],[5,126]],3200:[[1,3410],[3,405],[5,157]],4300:[[1,3590],[3,426],[5,164]],5600:[[1,3640],[3,433],[5,166]],6500:[[1,3170],[3,377],[5,166]]}},
    reflector:{label:'Hyper Reflector',quality:'measured',data:{2700:[[1,22470],[3,2422],[5,856]],3200:[[1,28180],[3,2970],[5,1066]],4300:[[1,29670],[3,3160],[5,1137]],5600:[[1,30500],[3,3240],[5,1156]],6500:[[1,26080],[3,2824],[5,1005]]}}
  }},
  cob200xs:{label:'amaran 200x S',family:'cob',defaultAccessory:'reflector',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,4930],[3,577],[5,223]],3200:[[1,5630],[3,675],[5,257]],4300:[[1,5980],[3,715],[5,273]],5600:[[1,6400],[3,764],[5,291]],6500:[[1,6060],[3,723],[5,277]]}},
    reflector:{label:'Hyper Reflector',quality:'measured',data:{2700:[[1,35000],[3,3570],[5,1265]],3200:[[1,40200],[3,4120],[5,1455]],4300:[[1,42600],[3,4350],[5,1538]],5600:[[1,45400],[3,4630],[5,1635]],6500:[[1,42900],[3,4370],[5,1543]]}}
  }}
};

const rayFixtures = {
  ray60c:{label:'Ray 60c',family:'ray-small',defaultAccessory:'miniReflector',accessories:{
    bare:{label:'Nu',quality:'single',singlePointLabel:'Sortie max publiée',data:{5600:[[1,3910]]}},
    miniReflector:{label:'Mini Reflector',quality:'measured',data:{2300:[[1,16310],[3,1812]],3200:[[1,19130],[3,2126]],4300:[[1,19530],[3,2170]],5600:[[1,18830],[3,2092]],6500:[[1,18500],[3,2056]],10000:[[1,17220],[3,1913]]}}
  }},
  ray120c:{label:'Ray 120c',family:'ray-small',defaultAccessory:'miniReflector',accessories:{
    bare:{label:'Nu',quality:'single',singlePointLabel:'Sortie max publiée',data:{5600:[[1,6850]]}},
    miniReflector:{label:'Mini Reflector',quality:'measured',data:{2300:[[1,24500],[3,2722]],3200:[[1,35600],[3,3956]],4300:[[1,35400],[3,3933]],5600:[[1,34000],[3,3778]],6500:[[1,33300],[3,3700]],10000:[[1,30500],[3,3389]]}}
  }},
  ray360c:{label:'Ray 360c',family:'ray-large',defaultAccessory:'fresnelSpot',accessories:{
    bare:{label:'Nu',quality:'single',singlePointLabel:'Sortie max publiée',data:{5600:[[1,17130]]}},
    fresnelSpot:{label:'Fresnel 15°',quality:'measured',data:{2300:[[3,10570],[5,3750]],3200:[[3,16780],[5,5790]],4300:[[3,18110],[5,6210]],5600:[[3,18000],[5,6400]],6500:[[3,17590],[5,6350]],10000:[[3,16580],[5,6000]]}},
    fresnelFlood:{label:'Fresnel 45°',quality:'measured',data:{2300:[[3,1738],[5,634]],3200:[[3,2750],[5,910]],4300:[[3,2970],[5,968]],5600:[[3,2950],[5,1108]],6500:[[3,2880],[5,1310]],10000:[[3,2730],[5,1014]]}}
  }},
  ray660c:{label:'Ray 660c',family:'ray-large',defaultAccessory:'fresnelSpot',accessories:{
    bare:{label:'Nu',quality:'single',singlePointLabel:'Sortie max publiée',data:{5600:[[1,38500]]}},
    fresnelSpot:{label:'Fresnel 15°',quality:'measured',data:{2300:[[3,20230],[5,7420]],3200:[[3,30990],[5,10998]],4300:[[3,29945],[5,11081]],5600:[[3,30900],[5,11068]],6500:[[3,28871],[5,11310]],10000:[[3,29450],[5,10790]]}},
    fresnelFlood:{label:'Fresnel 45°',quality:'measured',data:{2300:[[3,4250],[5,1327]],3200:[[3,5886],[5,2246]],4300:[[3,6821],[5,2338]],5600:[[3,6613],[5,2357]],6500:[[3,6030],[5,2474]],10000:[[3,6230],[5,2370]]}}
  }}
};

const aceFixtures = {"ace25x":{"label":"amaran Ace 25x","brand":"amaran","group":"ace","defaultAccessory":"bare","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"2700":[[0.5,5010],[1,1301]],"3200":[[0.5,5880],[1,1526]],"4300":[[0.5,6010],[1,1563]],"5600":[[0.5,6320],[1,1636]],"6500":[[0.5,5960],[1,1544]]},"role":"bare"},"dome":{"label":"Dome Diffuser","quality":"measured","data":{"2700":[[0.5,1746],[1,441]],"3200":[[0.5,2077],[1,524]],"4300":[[0.5,2163],[1,547]],"5600":[[0.5,2293],[1,580]],"6500":[[0.5,2183],[1,552]]},"role":"softbox"},"grid":{"label":"Light Control Grid","quality":"measured","data":{"2700":[[0.5,4010],[1,994]],"3200":[[0.5,4860],[1,1170]],"4300":[[0.5,5000],[1,1206]],"5600":[[0.5,5260],[1,1253]],"6500":[[0.5,4650],[1,1188]]},"role":"grid"}},"note":"À 100 %, LIGHT utilise les mesures constructeur du Boost Mode (32 W)."},"ace25c":{"label":"amaran Ace 25c","brand":"amaran","group":"ace","defaultAccessory":"bare","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"2300":[[0.5,3970],[1,1034]],"3200":[[0.5,4110],[1,1077]],"4300":[[0.5,5908],[1,1500]],"5600":[[0.5,4470],[1,1171]],"6500":[[0.5,4330],[1,1136]],"10000":[[0.5,3770],[1,990]]},"role":"bare"},"dome":{"label":"Dome Diffuser","quality":"measured","data":{"2300":[[0.5,1397],[1,358]],"3200":[[0.5,1433],[1,370]],"4300":[[0.5,2001],[1,514]],"5600":[[0.5,1594],[1,412]],"6500":[[0.5,1548],[1,400]],"10000":[[0.5,1369],[1,352]]},"role":"softbox"},"grid":{"label":"Light Control Grid","quality":"measured","data":{"2300":[[0.5,3150],[1,824]],"3200":[[0.5,3250],[1,859]],"4300":[[0.5,4440],[1,1188]],"5600":[[0.5,3560],[1,939]],"6500":[[0.5,3640],[1,902]],"10000":[[0.5,3158],[1,790]]},"role":"grid"}},"note":"À 100 %, LIGHT utilise les mesures constructeur du Boost Mode (32 W)."}};

const lightStormFixtures = {"ls60x":{"label":"Aputure LS 60x","brand":"aputure","group":"lightstorm","defaultAccessory":"flood45","accessories":{"spot15":{"label":"Spot 15°","quality":"measured","data":{"2700":[[1,25110],[3,3125],[5,1116]],"3200":[[1,30132],[3,3794],[5,1339]],"4300":[[1,31248],[3,3683],[5,1395]],"5600":[[1,33480],[3,4241],[5,1451]],"6500":[[1,32364],[3,4018],[5,1395]]},"role":"fresnelSpot"},"flood45":{"label":"Flood 45°","quality":"measured","data":{"2700":[[1,4464],[3,525],[5,201]],"3200":[[1,5357],[3,647],[5,234]],"4300":[[1,5245],[3,625],[5,234]],"5600":[[1,5803],[3,703],[5,268]],"6500":[[1,5580],[3,670],[5,246]]},"role":"fresnelFlood"}}},"ls300x":{"label":"Aputure LS 300x","brand":"aputure","group":"lightstorm","defaultAccessory":"reflector","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"3200":[[1,5100],[3,580],[5,220]],"4300":[[1,7500],[3,800],[5,350]],"5500":[[1,6300],[3,700],[5,250]]},"role":"bare"},"reflector":{"label":"Hyper Reflector","quality":"measured","data":{"3200":[[1,16200],[3,1300],[5,450]],"4300":[[1,24300],[3,2100],[5,700]],"5500":[[1,20500],[3,1700],[5,550]]},"role":"reflector"}}},"ls300d2":{"label":"Aputure LS 300d II","brand":"aputure","group":"lightstorm","defaultAccessory":"reflector","accessories":{"reflector":{"label":"Réflecteur standard","quality":"measured","data":{"5600":[[1,45000],[3,3500],[5,1200]]},"role":"reflector","note":"La table constructeur publiée pour le LS 300d II donne cette série de mesures comme sortie de référence."}}},"ls600dpro":{"label":"Aputure LS 600d Pro","brand":"aputure","group":"lightstorm","defaultAccessory":"reflector","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"5600":[[1,22150],[3,2600],[5,1020]]},"role":"bare"},"reflector":{"label":"600 Series Hyper Reflector","quality":"measured","data":{"5600":[[1,98500],[3,8500],[5,3000]]},"role":"reflector"}}},"ls600xpro":{"label":"Aputure LS 600x Pro","brand":"aputure","group":"lightstorm","defaultAccessory":"reflector","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"2700":[[1,9420],[2,2427],[3,1104],[5,423],[7,230]],"3200":[[1,11630],[2,2995],[3,1364],[5,524],[7,285]],"4300":[[1,16040],[2,4130],[3,1874],[5,724],[7,391]],"5600":[[1,16060],[2,4150],[3,1880],[5,728],[7,393]],"6500":[[1,13890],[2,3590],[3,1628],[5,629],[7,340]]},"role":"bare"},"reflector":{"label":"Hyper Reflector","quality":"measured","data":{"2700":[[1,36500],[2,7760],[3,3220],[5,1150],[7,583]],"3200":[[1,45300],[2,9650],[3,4010],[5,1426],[7,722]],"4300":[[1,62900],[2,13390],[3,5560],[5,1978],[7,1002]],"5600":[[1,63900],[2,13530],[3,5610],[5,1996],[7,1012]],"6500":[[1,55300],[2,11750],[3,4880],[5,1731],[7,878]]},"role":"reflector"}},"note":"Photométries Aputure en mode Max Output."},"ls600cpro2":{"label":"Aputure LS 600c Pro II","brand":"aputure","group":"lightstorm","defaultAccessory":"reflector","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"2300":[[1,17130],[3,1903],[5,685]],"3200":[[1,18950],[3,2106],[5,758]],"4300":[[1,20190],[3,2243],[5,808]],"5600":[[1,21610],[3,2401],[5,864]],"6500":[[1,21600],[3,2400],[5,864]]},"role":"bare"},"reflector":{"label":"Standard Hyper Reflector","quality":"measured","data":{"2300":[[1,70900],[3,7878],[5,2836]],"3200":[[1,78700],[3,8744],[5,3148]],"4300":[[1,84600],[3,9400],[5,3384]],"5600":[[1,91500],[3,10167],[5,3660]],"6500":[[1,91100],[3,10122],[5,3644]]},"role":"reflector"}}},"ls1200dpro":{"label":"Aputure LS 1200d Pro","brand":"aputure","group":"lightstorm","defaultAccessory":"medium","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"5600":[[3,6380],[5,2802],[7,1538],[9,964]]},"role":"bare"},"narrow":{"label":"Hyper Reflector Narrow","quality":"measured","data":{"5600":[[3,83100],[5,28340],[7,15200],[9,8580]]},"role":"reflector"},"medium":{"label":"Hyper Reflector Medium","quality":"measured","data":{"5600":[[3,22400],[5,8200],[7,4660],[9,2880]]},"role":"reflector"},"wide":{"label":"Hyper Reflector Wide","quality":"measured","data":{"5600":[[3,13010],[5,4800],[7,2706],[9,1775]]},"role":"reflector"}}}};

const stormFixtures = {"storm80c":{"label":"Aputure STORM 80c","brand":"aputure","group":"storm","defaultAccessory":"reflector","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"3200":[[1,6300],[2,1619],[3,696]],"4300":[[1,6540],[2,1687],[3,722]],"5600":[[1,6500],[2,1681],[3,725]],"6500":[[1,6404],[2,1653],[3,713]],"8000":[[1,6197],[2,1583],[3,684]],"10000":[[1,5981],[2,1541],[3,666]]},"role":"bare"},"reflector":{"label":"Hyper Reflector","quality":"measured","data":{"3200":[[1,19090],[2,4682],[3,1911]],"4300":[[1,19930],[2,4889],[3,2001]],"5600":[[1,19850],[2,4859],[3,1987]],"6500":[[1,19650],[2,4781],[3,1956]],"8000":[[1,18560],[2,4584],[3,1874]],"10000":[[1,17720],[2,4466],[3,1830]]},"role":"reflector"}}},"storm400x":{"label":"Aputure STORM 400x","brand":"aputure","group":"storm","defaultAccessory":"refl35","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"2500":[[1,20590],[3,2361],[5,880]],"3200":[[1,25600],[3,2964],[5,1105]],"4300":[[1,27350],[3,3140],[5,1170]],"5600":[[1,27100],[3,3110],[5,1161]],"6500":[[1,26500],[3,3040],[5,1134]],"7500":[[1,25700],[3,2960],[5,1105]],"10000":[[1,24160],[3,2790],[5,1038]]},"role":"bare"},"refl35":{"label":"Hyper Reflector 35°","quality":"measured","data":{"2500":[[1,49200],[3,3850],[5,1334]],"3200":[[1,61600],[3,4850],[5,1677]],"4300":[[1,65400],[3,5120],[5,1780]],"5600":[[1,64600],[3,5090],[5,1769]],"6500":[[1,63300],[3,4970],[5,1729]],"7500":[[1,61600],[3,4840],[5,1685]],"10000":[[1,57800],[3,4550],[5,1585]]},"role":"reflector"},"refl30":{"label":"Hyper Reflector 30°","quality":"measured","data":{"2500":[[1,70800],[3,7180],[5,2510]],"3200":[[1,89000],[3,8990],[5,3150]],"4300":[[1,93600],[3,9510],[5,3340]],"5600":[[1,93000],[3,9430],[5,3310]],"6500":[[1,90800],[3,9200],[5,3230]],"7500":[[1,88400],[3,8970],[5,3140]],"10000":[[1,83100],[3,8420],[5,2950]]},"role":"reflector"}}},"storm700x":{"label":"Aputure STORM 700x","brand":"aputure","group":"storm","defaultAccessory":"refl35","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"2500":[[1,36700],[3,4200],[5,1588]],"3200":[[1,42400],[3,4870],[5,1839]],"4300":[[1,53700],[3,6210],[5,2330]],"5600":[[1,54900],[3,6370],[5,2394]],"6500":[[1,53600],[3,6190],[5,2333]],"7500":[[1,49200],[3,5660],[5,2136]],"10000":[[1,40900],[3,4720],[5,1778]]},"role":"bare"},"refl35":{"label":"Hyper Reflector 35°","quality":"measured","data":{"2500":[[3,12480],[5,4100]],"3200":[[3,14430],[5,3930]],"4300":[[3,18120],[5,5040]],"5600":[[3,18670],[5,5320]],"6500":[[3,18250],[5,5380]],"7500":[[3,16760],[5,5240]],"10000":[[3,13930],[5,4650]]},"role":"reflector"},"refl25":{"label":"Hyper Reflector 25°","quality":"measured","data":{"2500":[[3,18120],[5,6040]],"3200":[[3,20950],[5,5880]],"4300":[[3,26430],[5,7560]],"5600":[[3,27190],[5,7950]],"6500":[[3,26520],[5,8060]],"7500":[[3,24300],[5,7810]],"10000":[[3,20200],[5,6960]]},"role":"reflector"}}},"storm1000c":{"label":"Aputure STORM 1000c","brand":"aputure","group":"storm","defaultAccessory":"bm7830","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"2500":[[2,12500],[3,5600],[5,2150],[7,1100]],"3200":[[2,14500],[3,6500],[5,2500],[7,1300]],"4300":[[2,14700],[3,6600],[5,2550],[7,1350]],"5600":[[2,14000],[3,6300],[5,2450],[7,1300]],"6500":[[2,13700],[3,6200],[5,2350],[7,1250]]},"role":"bare"},"bm7815":{"label":"Reflector BM7815","quality":"measured","data":{"2500":[[2,140000],[3,62000],[5,21000],[7,10500]],"3200":[[2,160000],[3,72000],[5,24500],[7,12200]],"4300":[[2,164000],[3,73000],[5,25000],[7,12500]],"5600":[[2,158000],[3,70000],[5,24000],[7,12000]],"6500":[[2,152000],[3,68000],[5,23500],[7,11700]]},"role":"reflector"},"bm7830":{"label":"Reflector BM7830","quality":"measured","data":{"2500":[[2,70000],[3,27000],[5,8800],[7,4400]],"3200":[[2,80000],[3,31000],[5,10000],[7,5100]],"4300":[[2,82000],[3,31000],[5,10500],[7,5200]],"5600":[[2,79000],[3,31000],[5,10000],[7,5000]],"6500":[[2,75000],[3,30000],[5,9800],[7,4900]]},"role":"reflector"},"bm7845":{"label":"Reflector BM7845","quality":"measured","data":{"2500":[[2,30000],[3,12500],[5,4400],[7,2350]],"3200":[[2,34000],[3,14500],[5,5100],[7,2700]],"4300":[[2,35000],[3,14700],[5,5200],[7,2700]],"5600":[[2,33500],[3,14200],[5,5000],[7,2600]],"6500":[[2,32500],[3,14000],[5,4900],[7,2550]]},"role":"reflector"}}},"storm1200x":{"label":"Aputure STORM 1200x","brand":"aputure","group":"storm","defaultAccessory":"bm7830","accessories":{"bare":{"label":"Nu","quality":"measured","data":{"2500":[[2,14600],[3,6570],[5,2510],[7,1270]],"3200":[[2,18700],[3,8370],[5,3170],[7,1610]],"4300":[[2,19000],[3,8620],[5,3280],[7,1670]],"5600":[[2,18900],[3,8490],[5,3230],[7,1640]],"6500":[[2,18600],[3,8370],[5,3180],[7,1620]]},"role":"bare"},"bm7815":{"label":"Reflector BM7815","quality":"measured","data":{"2500":[[2,162000],[3,74000],[5,25600],[7,12800]],"3200":[[2,206000],[3,94600],[5,30900],[7,16300]],"4300":[[2,212000],[3,97400],[5,33600],[7,16800]],"5600":[[2,209000],[3,96100],[5,33300],[7,16600]],"6500":[[2,162000],[3,94700],[5,32700],[7,16300]]},"role":"reflector"},"bm7830":{"label":"Reflector BM7830","quality":"measured","data":{"2500":[[2,80000],[3,32200],[5,10900],[7,5430]],"3200":[[2,102000],[3,41100],[5,13800],[7,6920]],"4300":[[2,105000],[3,42400],[5,14300],[7,7150]],"5600":[[2,104000],[3,41800],[5,14100],[7,7050]],"6500":[[2,102000],[3,41200],[5,13900],[7,6950]]},"role":"reflector"},"bm7845":{"label":"Reflector BM7845","quality":"measured","data":{"2500":[[2,35500],[3,15300],[5,5420],[7,2770]],"3200":[[2,45400],[3,19500],[5,6910],[7,3510]],"4300":[[2,47000],[3,20100],[5,7130],[7,3630]],"5600":[[2,46000],[3,19800],[5,7070],[7,3580]],"6500":[[2,45400],[3,19500],[5,6910],[7,3530]]},"role":"reflector"}}}};


// V0.11 — premiers catalogues Nanlite et Godox.
// Pour les nouveaux modèles ci-dessous, LIGHT n'utilise que les photométries
// explicitement publiées par le fabricant. Quand un seul point est disponible,
// la qualité est marquée "single" et la distance reste une estimation par carré inverse.
const nanliteFixtures = {
  nanFc60b:{label:'Nanlite FC-60B',brand:'nanlite',group:'nanfc',defaultAccessory:'reflector',accessories:{
    reflector:{label:'Réflecteur 45°',quality:'single',role:'reflector',singlePointLabel:'Mesure constructeur @ 1 m',data:{5600:[[1,12510]]}}
  },note:'Nanlite publie 12 510 lux à 1 m avec réflecteur 45° à 5600 K.'},
  nanFc120b:{label:'Nanlite FC-120B',brand:'nanlite',group:'nanfc',defaultAccessory:'reflector',accessories:{
    reflector:{label:'Réflecteur 45°',quality:'single',role:'reflector',singlePointLabel:'Mesure constructeur @ 1 m',data:{5600:[[1,17450]]}}
  },note:'Nanlite publie 17 450 lux à 1 m avec réflecteur 45° à 5600 K.'},
  nanFc720b:{label:'Nanlite FC-720B',brand:'nanlite',group:'nanfc',defaultAccessory:'reflector',accessories:{
    bare:{label:'Nu',quality:'measured',role:'bare',data:{5600:[[1,50700],[3,5680],[5,2135]]}},
    reflector:{label:'Réflecteur',quality:'measured',role:'reflector',data:{5600:[[1,133800],[3,12690],[5,4580]]}}
  },note:'Photométries Nanlite publiées à 1 m, 3 m et 5 m à 5600 K.'},
  nanForza60b2:{label:'Nanlite Forza 60B II',brand:'nanlite',group:'nanforza',defaultAccessory:'bare',accessories:{
    bare:{label:'Nu',quality:'measured',role:'bare',data:{5600:[[1,2577],[2,649],[3,308]]}}
  },note:'Photométries Nanlite publiées nu à 1 m, 2 m et 3 m à 5600 K.'},
  nanForza150b:{label:'Nanlite Forza 150B',brand:'nanlite',group:'nanforza',defaultAccessory:'reflector',accessories:{
    reflector:{label:'Réflecteur',quality:'single',role:'reflector',singlePointLabel:'Mesure constructeur @ 1 m',data:{5600:[[1,23130]]}}
  },note:'Nanlite publie 23 130 lux à 1 m avec réflecteur à 5600 K.'}
};

const godoxFixtures = {
  godoxSl60iibi:{label:'Godox SL60IIBi',brand:'godox',group:'godoxsl',defaultAccessory:'reflector',accessories:{
    reflector:{label:'Réflecteur standard',quality:'single',role:'reflector',singlePointLabel:'Mesure constructeur @ 1 m',data:{5600:[[1,25100]]}}
  },note:'Godox publie 25 100 lux à 1 m avec réflecteur standard.'},
  godoxMl80bi:{label:'Godox ML80Bi',brand:'godox',group:'godoxml',defaultAccessory:'zoom',accessories:{
    zoom:{label:'ML-Z Zoom Reflector',quality:'single',role:'reflector',singlePointLabel:'Mesure constructeur @ 1 m',data:{5600:[[1,29600]]}}
  },note:'Godox publie 29 600 lux à 1 m à 5600 K avec le ML-Z Zoom Reflector.'},
  godoxMl150bi:{label:'Godox ML150Bi',brand:'godox',group:'godoxml',defaultAccessory:'zoom',accessories:{
    zoom:{label:'ML-Z Zoom Reflector',quality:'single',role:'reflector',singlePointLabel:'Mesure constructeur @ 1 m',data:{5600:[[1,61054]]}}
  },note:'Godox publie 61 054 lux à 1 m à 5600 K avec le ML-Z Zoom Reflector.'},
  godoxLa600bi:{label:'Godox LA600Bi',brand:'godox',group:'godoxlitemons',defaultAccessory:'reflector',accessories:{
    reflector:{label:'BR30 Reflector',quality:'single',role:'reflector',singlePointLabel:'Mesure constructeur @ 1 m',data:{5600:[[1,212500]]}}
  },note:'Godox publie 212 500 lux à 1 m à 5600 K avec le BR30 Reflector.'}
};


// V0.10 — modificateurs estimés.
// Quand une softbox n'a pas de photométrie publiée, LIGHT fabrique une courbe indicative
// à partir de la photométrie "nu" (ou d'une sortie de référence disponible) et de profils
// de pertes observés sur les Halo avec softbox. Ces points ne sont JAMAIS présentés comme
// des mesures constructeur.
const ESTIMATE_PROFILES = {
  bare60:  [[0.5,0.78],[1,0.69],[3,0.45],[5,0.40],[7,0.38]],
  bare90:  [[0.5,1.05],[1,0.945],[3,0.583],[5,0.517],[7,0.48]],
  bare120: [[0.5,0.92],[1,0.80],[3,0.50],[5,0.44],[7,0.41],[9,0.39]],
  refl60:  [[0.5,0.12],[1,0.09],[3,0.065],[5,0.06]],
  refl90:  [[0.5,0.38],[1,0.31],[3,0.22],[5,0.22],[7,0.20]],
  refl120: [[0.5,0.31],[1,0.25],[3,0.18],[5,0.18],[7,0.17],[9,0.17]]
};
function estimateFactor(distance, profile){
  const pts=ESTIMATE_PROFILES[profile];
  if(!pts) return 0.5;
  if(pts.length===1) return pts[0][1];
  let a,b;
  if(distance<=pts[0][0]) [a,b]=[pts[0],pts[1]];
  else if(distance>=pts[pts.length-1][0]) [a,b]=[pts[pts.length-2],pts[pts.length-1]];
  else { for(let i=0;i<pts.length-1;i++){ if(distance>=pts[i][0]&&distance<=pts[i+1][0]){a=pts[i];b=pts[i+1];break;} } }
  const [d1,f1]=a,[d2,f2]=b;
  const t=(Math.log(distance)-Math.log(d1))/(Math.log(d2)-Math.log(d1));
  return Math.exp(Math.log(f1)+(Math.log(f2)-Math.log(f1))*t);
}
function scaledEstimatedData(sourceData, profile, extraFactor=1){
  const out={};
  Object.entries(sourceData).forEach(([cct,points])=>{
    out[cct]=points.map(([d,lux])=>[d, Math.round(lux*estimateFactor(d,profile)*extraFactor)]);
  });
  return out;
}
function addEstimatedSoftbox(fixtureObj, size, options={}){
  if(!fixtureObj || fixtureObj.accessories[`softbox${size}est`] || Object.values(fixtureObj.accessories).some(a=>a.role==='softbox')) return;
  const sourceKey=options.sourceKey || (fixtureObj.accessories.bare ? 'bare' : fixtureObj.defaultAccessory);
  const source=fixtureObj.accessories[sourceKey];
  if(!source) return;
  const isReflector=(source.role==='reflector' || /reflector/i.test(source.label));
  const profile=`${isReflector?'refl':'bare'}${size}`;
  fixtureObj.accessories[`softbox${size}est`]={
    label:`Softbox ${size} ≈`, role:'softbox', quality:'estimated',
    data:scaledEstimatedData(source.data,profile),
    estimateBasis:`Estimation à partir de ${source.label.toLowerCase()} et de profils mesurés sur des COB comparables avec softbox ${size} cm.`,
    estimateWarning:'La toile, la profondeur, le double diffuseur et la marque de la softbox peuvent modifier sensiblement le résultat réel.'
  };
}
function addEstimatedUmbrella(fixtureObj){
  if(!fixtureObj || fixtureObj.accessories.umbrellaEst) return;
  const source=fixtureObj.accessories.dome || fixtureObj.accessories.bare;
  if(!source) return;
  fixtureObj.accessories.umbrellaEst={
    label:'Parapluie / diffuseur ≈', role:'softbox', quality:'estimated',
    data:Object.fromEntries(Object.entries(source.data).map(([cct,points])=>[cct,points.map(([d,lux])=>[d,Math.round(lux*0.65)])])),
    estimateBasis:`Estimation à partir du ${source.label.toLowerCase()} mesuré, avec une perte supplémentaire indicative de 0,6 stop.`,
    estimateWarning:'Très approximatif : un parapluie argenté, blanc, shoot-through ou un cadre diffusant peuvent donner des valeurs très différentes.'
  };
}

// amaran COB S
addEstimatedSoftbox(cobFixtures.cob60xs,60);
addEstimatedSoftbox(cobFixtures.cob100xs,60);
addEstimatedSoftbox(cobFixtures.cob200xs,90);
// amaran RAY — souvent utilisés avec diffusion / softbox en pratique.
addEstimatedSoftbox(rayFixtures.ray60c,60);
addEstimatedSoftbox(rayFixtures.ray120c,60);
addEstimatedSoftbox(rayFixtures.ray360c,90);
addEstimatedSoftbox(rayFixtures.ray660c,120);
// Aputure Light Storm
addEstimatedSoftbox(lightStormFixtures.ls60x,60,{sourceKey:'flood45'});
addEstimatedSoftbox(lightStormFixtures.ls300x,90);
addEstimatedSoftbox(lightStormFixtures.ls300d2,90,{sourceKey:'reflector'});
addEstimatedSoftbox(lightStormFixtures.ls600dpro,120);
addEstimatedSoftbox(lightStormFixtures.ls600xpro,120);
addEstimatedSoftbox(lightStormFixtures.ls600cpro2,120);
addEstimatedSoftbox(lightStormFixtures.ls1200dpro,120,{sourceKey:'bare'});
// Aputure STORM
addEstimatedSoftbox(stormFixtures.storm80c,60);
addEstimatedSoftbox(stormFixtures.storm400x,90);
addEstimatedSoftbox(stormFixtures.storm700x,120);
addEstimatedSoftbox(stormFixtures.storm1000c,120);
addEstimatedSoftbox(stormFixtures.storm1200x,120);
// ACE : on reste volontairement plus vague qu'une softbox dédiée.
addEstimatedUmbrella(aceFixtures.ace25x);
addEstimatedUmbrella(aceFixtures.ace25c);

// Nanlite — softbox estimée lorsqu'aucune photométrie directe n'est publiée ici.
addEstimatedSoftbox(nanliteFixtures.nanFc60b,60,{sourceKey:'reflector'});
addEstimatedSoftbox(nanliteFixtures.nanFc120b,60,{sourceKey:'reflector'});
addEstimatedSoftbox(nanliteFixtures.nanFc720b,120,{sourceKey:'bare'});
addEstimatedSoftbox(nanliteFixtures.nanForza60b2,60,{sourceKey:'bare'});
addEstimatedSoftbox(nanliteFixtures.nanForza150b,90,{sourceKey:'reflector'});
// Godox
addEstimatedSoftbox(godoxFixtures.godoxSl60iibi,60,{sourceKey:'reflector'});
addEstimatedSoftbox(godoxFixtures.godoxMl80bi,60,{sourceKey:'zoom'});
addEstimatedSoftbox(godoxFixtures.godoxMl150bi,90,{sourceKey:'zoom'});
addEstimatedSoftbox(godoxFixtures.godoxLa600bi,120,{sourceKey:'reflector'});

const fixtures = {...haloFixtures, ...rayFixtures, ...cobFixtures, ...aceFixtures, ...lightStormFixtures, ...stormFixtures, ...nanliteFixtures, ...godoxFixtures};
const UI_GROUPS = {
  halo:['halo60x','halo100x','halo200x','halo300x','halo600x'],
  ray:['ray60c','ray120c','ray360c','ray660c'],
  cob:['cob60xs','cob100xs','cob200xs'],
  ace:['ace25x','ace25c'],
  lightstorm:['ls60x','ls300x','ls300d2','ls600dpro','ls600xpro','ls600cpro2','ls1200dpro'],
  storm:['storm80c','storm400x','storm700x','storm1000c','storm1200x'],
  nanfc:['nanFc60b','nanFc120b','nanFc720b'],
  nanforza:['nanForza60b2','nanForza150b'],
  godoxsl:['godoxSl60iibi'],
  godoxml:['godoxMl80bi','godoxMl150bi'],
  godoxlitemons:['godoxLa600bi']
};
const BRAND_GROUPS = {amaran:['halo','ray','cob','ace'],aputure:['lightstorm','storm'],nanlite:['nanfc','nanforza'],godox:['godoxsl','godoxml','godoxlitemons']};
const BRAND_LABELS = {amaran:'amaran',aputure:'Aputure',nanlite:'Nanlite',godox:'Godox'};
const GROUP_LABELS = {halo:'HALO',ray:'RAY',cob:'COB S',ace:'ACE',lightstorm:'LIGHT STORM',storm:'STORM',nanfc:'FC',nanforza:'FORZA',godoxsl:'SL',godoxml:'ML',godoxlitemons:'LITEMONS'};
const POWER_LABELS = {
  halo60x:'60X',halo100x:'100X',halo200x:'200X',halo300x:'300X',halo600x:'600X',
  ray60c:'60C',ray120c:'120C',ray360c:'360C',ray660c:'660C',
  cob60xs:'60X S',cob100xs:'100X S',cob200xs:'200X S',
  ace25x:'25X',ace25c:'25C',
  ls60x:'LS 60X',ls300x:'LS 300X',ls300d2:'300D II',ls600dpro:'600D PRO',ls600xpro:'600X PRO',ls600cpro2:'600C PRO II',ls1200dpro:'1200D PRO',
  storm80c:'80C',storm400x:'400X',storm700x:'700X',storm1000c:'1000C',storm1200x:'1200X',
  nanFc60b:'FC-60B',nanFc120b:'FC-120B',nanFc720b:'FC-720B',nanForza60b2:'60B II',nanForza150b:'150B',
  godoxSl60iibi:'SL60IIBi',godoxMl80bi:'ML80Bi',godoxMl150bi:'ML150Bi',godoxLa600bi:'LA600Bi'
};
function uiGroupForFixture(key=state.fixture){for(const [group,keys] of Object.entries(UI_GROUPS)){if(keys.includes(key))return group;}return'halo';}
function brandForFixture(key=state.fixture){const group=uiGroupForFixture(key);return Object.entries(BRAND_GROUPS).find(([,groups])=>groups.includes(group))?.[0]||'amaran';}


const ISO_VALUES=[100,125,160,200,250,320,400,500,640,800,1000,1250,1600,2000,2500,3200,4000,5000,6400,8000,10000,12800];
const SHUTTER_DENOMS=[24,25,30,40,48,50,60,80,100,120,125,160,200,250,320,400,500,640,800,1000];
const APERTURES=[1.4,1.6,1.8,2,2.2,2.5,2.8,3.2,3.5,4,4.5,5,5.6,6.3,7.1,8,9,10,11,13,14,16,18,20,22];

const $=sel=>document.querySelector(sel);
const els={
  brandGrid:$('#brandGrid'),familyGrid:$('#familyGrid'),powerGrid:$('#powerGrid'),accessoryGrid:$('#accessoryGrid'),accessoryNote:$('#accessoryNote'),
  cctGrid:$('#cctGrid'),cctSection:$('#cctSection'),cctValue:$('#cctValue'),cctNote:$('#cctNote'),
  intensitySlider:$('#intensitySlider'),intensityValue:$('#intensityValue'),isoSelect:$('#isoSelect'),shutterSelect:$('#shutterSelect'),apertureSelect:$('#apertureSelect'),cameraSummary:$('#cameraSummary'),lightSummary:$('#lightSummary'),
  maxDistance:$('#maxDistance'),heroSummary:$('#heroSummary'),testDistanceSlider:$('#testDistanceSlider'),testDistanceValue:$('#testDistanceValue'),statusBox:$('#statusBox'),statusTitle:$('#statusTitle'),statusText:$('#statusText'),solutionIntro:$('#solutionIntro'),solutions:$('#solutions'),
  testLux:$('#testLux'),stopMargin:$('#stopMargin'),requiredIso:$('#requiredIso'),possibleAperture:$('#possibleAperture'),sourceDescriptor:$('#sourceDescriptor'),measurementRow:$('#measurementRow'),dataNote:$('#dataNote'),dimmerNote:$('#dimmerNote'),labBadge:$('#labBadge'),resetBtn:$('#resetBtn')
};

init();

function init(){
  loadSavedState();
  populateSelect(els.isoSelect,ISO_VALUES,v=>`ISO ${v}`,state.iso);
  populateSelect(els.apertureSelect,APERTURES,v=>`f/${formatAperture(v)}`,state.aperture);
  populateSelect(els.shutterSelect,SHUTTER_DENOMS,v=>`1/${v}`,state.shutterDenom);
  els.intensitySlider.value=state.intensityPct;
  els.testDistanceSlider.value=state.testDistance;
  bindUI(); update();
}
function loadSavedState(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(!saved||typeof saved!=='object')return;
    const allowed=['fixture','accessory','cct','intensityPct','iso','shutterDenom','aperture','testDistance'];
    allowed.forEach(k=>{if(saved[k]!==undefined)state[k]=saved[k];});
    if(!fixtures[state.fixture]) state.fixture='halo60x';
    if(!ISO_VALUES.includes(Number(state.iso))) state.iso=800;
    if(!SHUTTER_DENOMS.includes(Number(state.shutterDenom))) state.shutterDenom=50;
    if(!APERTURES.includes(Number(state.aperture))) state.aperture=2.8;
    state.intensityPct=Math.max(0,Math.min(100,Number(state.intensityPct)||0));
    state.testDistance=Math.max(1,Math.min(10,Number(state.testDistance)||2));
    state.cct=Number(state.cct)||5600;
  }catch(_){ /* stockage indisponible : on garde les valeurs par défaut */ }
}
function persistState(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(_){}
}
function populateSelect(select,values,labelFn,selected){select.innerHTML='';values.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=labelFn(v);if(Number(v)===Number(selected))o.selected=true;select.appendChild(o);});}
function bindUI(){
  els.brandGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-brand]');if(!b)return;const brand=b.dataset.brand;if(brand===brandForFixture())return;const group=BRAND_GROUPS[brand][0];state.fixture=UI_GROUPS[group][0];state.accessory=fixtures[state.fixture].defaultAccessory;ensureAccessoryAndCct();update();});
  els.familyGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-family]');if(!b)return;const group=b.dataset.family;if(group===uiGroupForFixture())return;state.fixture=UI_GROUPS[group][0];state.accessory=fixtures[state.fixture].defaultAccessory;ensureAccessoryAndCct();update();});
  els.powerGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-fixture]');if(!b)return;state.fixture=b.dataset.fixture;ensureAccessoryAndCct();update();});
  els.accessoryGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-accessory]');if(!b)return;state.accessory=b.dataset.accessory;ensureAccessoryAndCct();update();});
  els.cctGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-cct]');if(!b)return;state.cct=Number(b.dataset.cct);update();});
  els.intensitySlider.addEventListener('input',()=>{state.intensityPct=Number(els.intensitySlider.value);update();});
  els.isoSelect.addEventListener('change',()=>{state.iso=Number(els.isoSelect.value);update();});
  els.apertureSelect.addEventListener('change',()=>{state.aperture=Number(els.apertureSelect.value);update();});
  els.shutterSelect.addEventListener('change',()=>{state.shutterDenom=Number(els.shutterSelect.value);update();});
  els.testDistanceSlider.addEventListener('input',()=>{state.testDistance=Number(els.testDistanceSlider.value);update();});
  els.resetBtn.addEventListener('click',reset);
}
function reset(){Object.assign(state,{fixture:'halo60x',accessory:'softbox',cct:5600,intensityPct:100,iso:800,shutterDenom:50,aperture:2.8,testDistance:2});try{localStorage.removeItem(STORAGE_KEY);}catch(_){}els.intensitySlider.value=100;els.isoSelect.value=800;els.apertureSelect.value=2.8;els.shutterSelect.value=50;els.testDistanceSlider.value=2;update();}

function fixture(){return fixtures[state.fixture];}
function accessory(fixtureKey=state.fixture,accessoryKey=state.accessory){return fixtures[fixtureKey].accessories[accessoryKey];}
function ensureAccessoryAndCct(){
  const f=fixture(); if(!f.accessories[state.accessory]) state.accessory=f.defaultAccessory;
  const keys=Object.keys(accessory().data).map(Number); if(!keys.includes(state.cct)) state.cct=keys.includes(5600)?5600:keys[0];
}
function getPoints(fixtureKey=state.fixture,accessoryKey=state.accessory,cct=state.cct){
  const a=accessory(fixtureKey,accessoryKey); const keys=Object.keys(a.data).map(Number); const use=keys.includes(Number(cct))?Number(cct):(keys.includes(5600)?5600:keys[0]); return a.data[use];
}
function update(){
  ensureAccessoryAndCct(); renderFixtureHierarchy(); renderAccessoryButtons(); renderCctButtons(); syncActiveButtons();
  const reqLux=requiredLux(state.iso,state.shutterDenom,state.aperture); const maxD=state.intensityPct<=0?0:solveDistanceForLux(reqLux);
  els.intensityValue.textContent=`${state.intensityPct} %`; els.testDistanceValue.textContent=`${formatDistance(state.testDistance)} m`; els.maxDistance.textContent=maxD>0?formatDistance(maxD):'0,0';
  els.cameraSummary.textContent=`ISO ${state.iso} · f/${formatAperture(state.aperture)} · 1/${state.shutterDenom}`;
  if(els.lightSummary) els.lightSummary.textContent=`${BRAND_LABELS[brandForFixture()]} · ${fixture().label.replace(/^(amaran |Aputure |Nanlite |Godox )/,'')} · ${accessory().label}`;
  els.labBadge.textContent=accessory().quality==='estimated'?'ESTIMATION':BRAND_LABELS[brandForFixture()].toUpperCase(); els.labBadge.classList.toggle('estimate-badge',accessory().quality==='estimated');
  els.heroSummary.textContent=`${fixture().label} · ${accessory().label} · ${state.intensityPct} % · ISO max ${state.iso} · f/${formatAperture(state.aperture)} · 1/${state.shutterDenom}`;
  updateDistanceStatus(reqLux,maxD); updateAdvanced(reqLux,maxD,getPoints()); persistState();
}
function renderFixtureHierarchy(){
  const brand=brandForFixture(), group=uiGroupForFixture();
  els.brandGrid.style.gridTemplateColumns=`repeat(${Object.keys(BRAND_GROUPS).length},minmax(0,1fr))`;
  els.brandGrid.innerHTML=Object.keys(BRAND_GROUPS).map(key=>`<button data-brand="${key}" class="brand-choice ${key===brand?'active':''}" type="button">${BRAND_LABELS[key]}</button>`).join('');
  const groups=BRAND_GROUPS[brand];
  els.familyGrid.style.gridTemplateColumns=`repeat(${Math.min(groups.length,4)},minmax(0,1fr))`;
  els.familyGrid.innerHTML=groups.map(key=>`<button data-family="${key}" class="${key===group?'active':''}" type="button">${GROUP_LABELS[key]}</button>`).join('');
  const keys=UI_GROUPS[group];
  els.powerGrid.style.gridTemplateColumns=`repeat(${Math.min(keys.length,5)},minmax(0,1fr))`;
  els.powerGrid.innerHTML=keys.map(key=>`<button data-fixture="${key}" class="${key===state.fixture?'active':''}" type="button">${POWER_LABELS[key]}</button>`).join('');
}

function renderAccessoryButtons(){
  const entries=Object.entries(fixture().accessories); els.accessoryGrid.style.gridTemplateColumns=`repeat(${Math.min(entries.length,3)},minmax(0,1fr))`;
  els.accessoryGrid.innerHTML=entries.map(([key,a])=>`<button data-accessory="${key}" class="${key===state.accessory?'active':''}" type="button">${a.label.toUpperCase()}</button>`).join('');
  const a=accessory(); const notes=[]; if(a.quality==='single')notes.push('Ce mode repose sur un seul point constructeur : la distance est donc une estimation plus large.'); if(a.quality==='estimated')notes.push(`≈ ${a.estimateBasis || 'Valeur extrapolée : aucune photométrie constructeur n’est publiée pour ce modificateur.'}`); if(a.note)notes.push(a.note); if(fixture().note)notes.push(fixture().note); els.accessoryNote.textContent=notes.join(' ');
}
function renderCctButtons(){
  const keys=Object.keys(accessory().data).map(Number).sort((a,b)=>a-b); const isSingle=keys.length===1;
  els.cctSection.hidden=false; els.cctValue.textContent=`${state.cct} K`;
  els.cctGrid.style.gridTemplateColumns=`repeat(${Math.min(keys.length,6)},minmax(0,1fr))`;
  els.cctGrid.innerHTML=keys.map(k=>`<button data-cct="${k}" class="${k===state.cct?'active':''}" type="button">${k}</button>`).join('');
  els.cctNote.textContent=isSingle?'Une seule température de référence est disponible dans les données publiées pour cette configuration.':'';
}
function syncActiveButtons(){document.querySelectorAll('[data-fixture]').forEach(b=>b.classList.toggle('active',b.dataset.fixture===state.fixture));}
function requiredLux(iso,shutterDenom,aperture){const t=1/shutterDenom;return INCIDENT_C*aperture*aperture/(iso*t);}
function estimatedLuxAtDistance(distance,fixtureKey=state.fixture,intensityPct=state.intensityPct,accessoryKey=null){if(intensityPct<=0)return 0;const aKey=accessoryKey||state.accessory;const points=getPoints(fixtureKey,aKey,state.cct);return curveLux(distance,points)*(intensityPct/100);}
function curveLux(distance,points){
  const d=Math.max(.05,distance); if(points.length===1){const [d1,e1]=points[0];return e1*Math.pow(d1/d,2);}
  let a,b;if(d<=points[0][0])[a,b]=[points[0],points[1]];else if(d>=points[points.length-1][0])[a,b]=[points[points.length-2],points[points.length-1]];else{for(let i=0;i<points.length-1;i++){if(d>=points[i][0]&&d<=points[i+1][0]){a=points[i];b=points[i+1];break;}}}
  const [d1,e1]=a,[d2,e2]=b;const exponent=Math.log(e2/e1)/Math.log(d2/d1);return e1*Math.pow(d/d1,exponent);
}
function solveDistanceForLux(targetLux){if(state.intensityPct<=0)return 0;if(estimatedLuxAtDistance(.1)<targetLux)return 0;let lo=.1,hi=1;while(estimatedLuxAtDistance(hi)>targetLux&&hi<200)hi*=2;if(hi>=200&&estimatedLuxAtDistance(hi)>targetLux)return 200;for(let i=0;i<80;i++){const mid=(lo+hi)/2;if(estimatedLuxAtDistance(mid)>=targetLux)lo=mid;else hi=mid;}return(lo+hi)/2;}

function updateDistanceStatus(reqLux,maxD){
  const d=state.testDistance,lux=estimatedLuxAtDistance(d),margin=lux>0?Math.log2(lux/reqLux):-Infinity,reqIso=lux>0?INCIDENT_C*state.aperture*state.aperture/(lux*(1/state.shutterDenom)):Infinity,possibleF=lux>0?Math.sqrt(lux*state.iso*(1/state.shutterDenom)/INCIDENT_C):0;
  els.statusBox.classList.remove('comfortable','just','insufficient');let title,text,cls;
  if(state.intensityPct<=0||lux<=0){cls='insufficient';title='SOURCE ÉTEINTE';text='Le projecteur est à 0 %. Monte sa puissance pour commencer le calcul.';}
  else if(margin>=.7){cls='comfortable';title='CONFORTABLE';text=`À ${formatDistance(d)} m, la lumière reçue au niveau du sujet suffit pour tes réglages caméra, avec encore de la marge.`;}
  else if(margin>=0){cls='just';title='ÇA PASSE';text=`À ${formatDistance(d)} m, tu atteins l’exposition de référence avec tes réglages caméra, mais avec peu de marge.`;}
  else{cls='insufficient';title='PAS ASSEZ DE LUMIÈRE';text=`À ${formatDistance(d)} m, la lumière reçue au niveau du sujet est insuffisante pour tes réglages caméra.`;}
  els.statusBox.classList.add(cls);els.statusTitle.textContent=title;els.statusText.textContent=text;
  const solutions=[];
  if(state.intensityPct<=0){els.solutionIntro.textContent='Pour obtenir une exposition de référence, commence par :';solutions.push(['MONTE LA PUISSANCE','au-dessus de 0 %']);}
  else if(margin>=0){els.solutionIntro.textContent='Tu es dans la bonne zone. Si tu veux modifier ton installation :';if(maxD>d+.1)solutions.push(['TU PEUX RECULER',`jusqu’à ${formatDistance(maxD)} m`]);const targetPct=state.intensityPct*reqLux/lux;if(targetPct<state.intensityPct-3&&targetPct>=1)solutions.push(['TU PEUX DIMMER',`vers ${Math.max(1,Math.round(targetPct))} %`]);const closeF=snapApertureForClosing(possibleF,state.aperture);if(closeF)solutions.push(['TU PEUX FERMER',`jusqu’à environ f/${formatAperture(closeF)}`]);}
  else{
    els.solutionIntro.textContent=`Pour obtenir une bonne exposition à ${formatDistance(d)} m, change au moins un de ces réglages :`;
    if(maxD>0)solutions.push(['RAPPROCHE TA SOURCE',maxD>=1?`place-la à ${formatDistance(maxD)} m ou moins`:'il faudrait moins de 1 m']);
    const neededPct=lux>0?state.intensityPct*reqLux/lux:Infinity;if(state.intensityPct<100&&neededPct<=100)solutions.push(['MONTE LA PUISSANCE',`vers ${Math.ceil(neededPct)} %`]);
    const openF=snapApertureForOpening(possibleF,state.aperture);if(openF)solutions.push(['OUVRE TON DIAPH',`passe à f/${formatAperture(openF)} ou plus ouvert`]);
    if(Number.isFinite(reqIso)&&reqIso>state.iso){const isoStep=snapIsoUp(reqIso);solutions.push(['MONTE TON ISO',isoStep?`passe à environ ISO ${isoStep}`:`il faudrait environ ISO ${formatIso(reqIso)}`]);}
    const stronger=findStrongerFixture(reqLux,d);if(stronger)solutions.push(['PRENDS PLUS PUISSANT',`passe au ${fixtures[stronger].label}`]);
  }
  els.solutions.innerHTML=solutions.slice(0,4).map(([l,v])=>`<div class="solution"><span>${l}</span><strong>${v}</strong></div>`).join('');
}
function snapApertureForOpening(maxF,currentF){if(!Number.isFinite(maxF)||maxF<=0||maxF>=currentF)return null;const valid=APERTURES.filter(f=>f<=maxF&&f<currentF);return valid.length?valid[valid.length-1]:null;}
function snapApertureForClosing(maxF,currentF){if(!Number.isFinite(maxF)||maxF<=currentF)return null;const valid=APERTURES.filter(f=>f<=maxF&&f>currentF);return valid.length?valid[valid.length-1]:null;}
function snapIsoUp(requiredIso){return ISO_VALUES.find(v=>v>=requiredIso)||null;}
function findStrongerFixture(reqLux,distance){
  const group=uiGroupForFixture(),order=UI_GROUPS[group]||[],idx=order.indexOf(state.fixture),role=currentAccessoryRole();
  for(let i=idx+1;i<order.length;i++){const key=order[i],candidateAccessory=findAccessoryByRole(key,role);if(candidateAccessory&&estimatedLuxAtDistance(distance,key,100,candidateAccessory)>=reqLux)return key;}return null;
}
function accessoryRole(key,a){if(a?.role)return a.role;if(key==='bare')return'bare';if(key.toLowerCase().includes('reflector'))return'reflector';if(['reflector','miniReflector'].includes(key))return'reflector';if(key.includes('softbox')||key.includes('dome'))return'softbox';if(key.toLowerCase().includes('spot'))return'fresnelSpot';if(key.toLowerCase().includes('flood'))return'fresnelFlood';return key;}
function currentAccessoryRole(){return accessoryRole(state.accessory,accessory());}
function findAccessoryByRole(fixtureKey,role){const entries=Object.entries(fixtures[fixtureKey].accessories);return entries.find(([k,a])=>accessoryRole(k,a)===role)?.[0]||null;}

function updateAdvanced(reqLux,maxD,points){
  const d=state.testDistance,lux=estimatedLuxAtDistance(d),margin=lux>0?Math.log2(lux/reqLux):-Infinity,reqIso=lux>0?INCIDENT_C*state.aperture*state.aperture/(lux*(1/state.shutterDenom)):Infinity,possibleF=lux>0?Math.sqrt(lux*state.iso*(1/state.shutterDenom)/INCIDENT_C):0;
  els.testLux.textContent=`${formatLux(lux)} lux`;els.stopMargin.textContent=Number.isFinite(margin)?`${margin>=0?'+':''}${margin.toFixed(1).replace('.',',')} stop${Math.abs(margin)>=1.5?'s':''}`:'—';els.requiredIso.textContent=Number.isFinite(reqIso)?`ISO ${formatIso(reqIso)}`:'—';els.possibleAperture.textContent=possibleF>0?`f/${formatAperture(possibleF)}`:'—';
  const cctLabel=accessory().quality==='single'?'sortie max publiée':`${state.cct} K`;els.sourceDescriptor.textContent=`${fixture().label} · ${accessory().label} · ${cctLabel} · à 100 %`;
  els.measurementRow.innerHTML=points.map(([md,mlux])=>`<div class="measure-chip"><span>${md} m</span><strong>${formatLux(mlux)} lux</strong></div>`).join('');
  const rangeAtTest=classifyDistance(d,points,accessory().quality),rangeAtMax=classifyDistance(maxD,points,accessory().quality);const warning=rangeAtTest.warning||rangeAtMax.warning;
  if(accessory().quality==='estimated') els.dataNote.textContent=`ESTIMATION MODIFICATEUR — ${accessory().estimateBasis || 'Aucune mesure constructeur directe pour cette configuration.'} ${accessory().estimateWarning || ''}`;
  else if(accessory().quality==='single')els.dataNote.textContent='Un seul point constructeur est publié pour ce mode. LIGHT applique une décroissance en carré inverse : considère la distance comme une estimation, pas comme une mesure constructeur complète.';
  else els.dataNote.textContent=warning?`Une partie du calcul sort de la plage mesurée (${rangeAtTest.label.toLowerCase()} / distance max : ${rangeAtMax.label.toLowerCase()}).`:'La distance testée et la distance max restent dans la plage de mesures constructeur ; LIGHT interpole entre les points publiés.';
  els.dataNote.classList.toggle('warning',warning||accessory().quality==='single'||accessory().quality==='estimated');
  if(state.intensityPct===100){els.dimmerNote.textContent=fixture().note?`Puissance 100 % : ${fixture().note}`:'Puissance 100 % : les points de départ sont les mesures publiées par le constructeur.';els.dimmerNote.classList.remove('warning');}
  else{els.dimmerNote.textContent='Sous 100 %, LIGHT estime les lux proportionnellement au dimmer. Cette partie est moins fiable faute de courbe constructeur détaillée par pourcentage.';els.dimmerNote.classList.add('warning');}
}
function classifyDistance(distance,points,quality){if(!Number.isFinite(distance)||distance<=0)return{label:'source éteinte',warning:true};if(quality==='estimated')return{label:'estimation modificateur',warning:true};if(quality==='single')return{label:'estimation depuis 1 point',warning:true};const min=points[0][0],max=points[points.length-1][0];if(distance<min)return{label:`extrapolation < ${min} m`,warning:true};if(distance>max)return{label:`extrapolation > ${max} m`,warning:true};return{label:'interpolation constructeur',warning:false};}
function formatLux(v){if(!Number.isFinite(v))return'—';if(v>=100)return Math.round(v).toLocaleString('fr-FR');if(v>=10)return v.toFixed(1).replace('.',',');return v.toFixed(2).replace('.',',');}
function formatDistance(v){if(!Number.isFinite(v))return'—';if(v>=20)return v.toFixed(0).replace('.',',');return v.toFixed(1).replace('.',',');}
function formatAperture(v){if(!Number.isFinite(v))return'—';return v.toFixed(1).replace(/\.0$/,'').replace('.',',');}
function formatIso(v){if(!Number.isFinite(v))return'—';if(v>=1000)return Math.round(v/10)*10;return Math.max(1,Math.round(v));}
