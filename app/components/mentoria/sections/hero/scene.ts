/* eslint-disable @typescript-eslint/no-explicit-any */
// Local Three.js r180, distributed under MIT. This is an illustration, not a product interface.
export type SceneController={setMode:(connected:boolean)=>void;setVisible:(visible:boolean)=>void;setPaused:(paused:boolean)=>void;setScrollProgress:(progress:number)=>void;dispose:()=>void};

export async function createScene(host:HTMLElement):Promise<SceneController>{
  const T:any=await import("./vendor/three.module.min.js");
  await document.fonts.ready;
  const scene=new T.Scene();
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
  renderer.setClearColor(0x141419,0);
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.05;
  renderer.domElement.setAttribute("aria-hidden","true");
  host.appendChild(renderer.domElement);
  const camera=new T.PerspectiveCamera(38,1,.1,70);
  const root=new T.Group();scene.add(root);
  const geometries:any[]=[],materials:any[]=[],textures:any[]=[];
  const geo=(g:any)=>{geometries.push(g);return g;};
  const mat=(m:any)=>{materials.push(m);return m;};
  const environmentCanvas=document.createElement("canvas");environmentCanvas.width=512;environmentCanvas.height=256;
  const ctx=environmentCanvas.getContext("2d");
  let environment:any;
  if(ctx){
    ctx.fillStyle="#141419";ctx.fillRect(0,0,512,256);
    const wash=ctx.createLinearGradient(0,0,512,256);wash.addColorStop(0,"#141419");wash.addColorStop(.35,"#59525e");wash.addColorStop(.52,"#15141b");wash.addColorStop(.82,"#633044");wash.addColorStop(1,"#141419");ctx.fillStyle=wash;ctx.fillRect(0,0,512,256);
    ctx.fillStyle="#f7f7f8";ctx.fillRect(66,10,12,218);ctx.fillRect(285,18,6,180);ctx.fillStyle="#DA3C6D";ctx.fillRect(400,70,18,130);
    environment=new T.CanvasTexture(environmentCanvas);environment.mapping=T.EquirectangularReflectionMapping;environment.colorSpace=T.SRGBColorSpace;textures.push(environment);scene.environment=environment;
  }
  scene.add(new T.AmbientLight(0xc9c4d2,.65));
  const key=new T.DirectionalLight(0xf7f7f8,3.1);key.position.set(-3,6,7);scene.add(key);
  const rim=new T.DirectionalLight(0xda3c6d,3.5);rim.position.set(6,2,-4);scene.add(rim);
  const front=new T.PointLight(0xf26b92,14,20);front.position.set(3,-2,6);scene.add(front);
  const silver=mat(new T.MeshPhysicalMaterial({color:0x9d909e,metalness:.86,roughness:.19,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:.8}));
  const glass=mat(new T.MeshPhysicalMaterial({color:0xcfc7d1,metalness:.12,roughness:.1,transparent:true,opacity:.075,side:T.DoubleSide,depthWrite:false,clearcoat:1,clearcoatRoughness:.03,envMapIntensity:.75}));
  const pinkEdge=mat(new T.MeshBasicMaterial({color:0xf26b92,transparent:true,opacity:.52}));
  const whiteEdge=mat(new T.MeshBasicMaterial({color:0xf7f7f8,transparent:true,opacity:.32}));
  function rectangle(w:number,h:number,r:number){
    const s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
  }
  const outer=rectangle(2.9,4.3,.08);
  const inner=rectangle(2.86,4.26,.065);
  outer.holes.push(new T.Path(inner.getPoints(8).reverse()));
  const frameGeo=geo(new T.ExtrudeGeometry(outer,{depth:.045,bevelEnabled:true,bevelSegments:2,bevelSize:.01,bevelThickness:.01,steps:1,curveSegments:10}));
  const paneGeo=geo(new T.ShapeGeometry(rectangle(2.86,4.26,.065),10));
  const borderPoints=rectangle(2.9,4.3,.08).getPoints(40).map((p:any)=>new T.Vector3(p.x,p.y,.065));
  const borderCurve=new T.CatmullRomCurve3(borderPoints,true);
  const borderGeo=geo(new T.TubeGeometry(borderCurve,170,.008,4,true));
  const layers:any[]=[];
  const positions=[[-1.7,-.42,1.5],[-.55,-.12,.65],[.6,.18,-.2],[1.75,.48,-1.05]];
  const stageLabels=[
    {title:"Demanda",detail:"Contexto",lines:[245,310,180]},
    {title:"IA",detail:"Rascunho",lines:[280,180,315]},
    {title:"Conferência",detail:"Decisão humana",lines:[305,225,165]},
    {title:"Entrega",detail:"Equipe",lines:[210,315,265]},
  ];
  positions.forEach((p,i)=>{
    const group=new T.Group();group.position.set(...p);group.rotation.y=-.42;group.rotation.z=-.06;
    group.add(new T.Mesh(frameGeo,silver));
    const pane=new T.Mesh(paneGeo,glass);pane.position.z=.035;group.add(pane);
    group.add(new T.Mesh(borderGeo,i===1||i===3?pinkEdge:whiteEdge));
    const labelCanvas=document.createElement("canvas");labelCanvas.width=512;labelCanvas.height=720;
    const labelContext=labelCanvas.getContext("2d");
    if(labelContext){
      const stage=stageLabels[i];
      labelContext.font="400 27px 'Mentoria IBM Plex Sans', sans-serif";
      labelContext.fillStyle="#F26B92";labelContext.fillText(`0${i+1}`,32,58);
      labelContext.font=`600 ${i===2?45:50}px 'Mentoria Sora', sans-serif`;
      labelContext.fillStyle="#FFFFFF";labelContext.fillText(stage.title,32,142);
      labelContext.font="400 36px 'Mentoria IBM Plex Sans', sans-serif";
      labelContext.fillStyle="#E9E4ED";labelContext.fillText(stage.detail,32,190);
      labelContext.strokeStyle="rgba(218,60,109,.55)";labelContext.lineWidth=2;
      labelContext.beginPath();labelContext.moveTo(32,236);labelContext.lineTo(126,236);labelContext.stroke();
      labelContext.strokeStyle="rgba(247,247,248,.18)";labelContext.lineWidth=2;
      stage.lines.forEach((length,n)=>{labelContext.beginPath();labelContext.moveTo(32,430+n*38);labelContext.lineTo(32+length,430+n*38);labelContext.stroke();});
      const labelTexture=new T.CanvasTexture(labelCanvas);labelTexture.colorSpace=T.SRGBColorSpace;textures.push(labelTexture);
      const labelMaterial=mat(new T.MeshBasicMaterial({map:labelTexture,transparent:true,opacity:1,depthWrite:false,depthTest:false,toneMapped:false,side:T.DoubleSide}));
      const label=new T.Mesh(geo(new T.PlaneGeometry(2.32,3.26)),labelMaterial);
      label.position.set(0,i===3?.45:.1,.14);label.renderOrder=100+i;group.add(label);
    }
    root.add(group);layers.push({group,base:new T.Vector3(...p),phase:i});
  });
  const curves:any[]=[],tracks:any[]=[];
  const trackMat=mat(new T.MeshBasicMaterial({color:0xda3c6d,transparent:true,opacity:.48}));
  const faintTrack=mat(new T.MeshBasicMaterial({color:0xf26b92,transparent:true,opacity:.12}));
  for(let n=0;n<3;n++){
    const y=(n-1)*.22,z=(n-1)*.08;
    const curve=new T.CatmullRomCurve3([new T.Vector3(-8,-2.5+y,2.7+z),new T.Vector3(-3,-1.3+y,2.05+z),new T.Vector3(-1.7,-.3+y,1.5+z),new T.Vector3(.4,.1+y,.1+z),new T.Vector3(2.3,.8+y,-1.5+z),new T.Vector3(5,2.6+y,-2+z),new T.Vector3(8,2.8+y,-1+z)]);
    curves.push(curve);
    const line=new T.Mesh(geo(new T.TubeGeometry(curve,100,n===1?.012:.005,4,false)),n===1?trackMat:faintTrack);root.add(line);tracks.push(line);
  }
  const packetMat=mat(new T.MeshBasicMaterial({color:0xf26b92}));
  const packetGeo=geo(new T.SphereGeometry(.028,8,6));
  const packets=Array.from({length:24},(_,i)=>{const mesh=new T.Mesh(packetGeo,packetMat);root.add(mesh);return{mesh,curve:curves[i%3],offset:i/24};});
  const dust=new Float32Array(120*3);
  for(let i=0;i<120;i++){dust[i*3]=((i*1.618)%1-.5)*12;dust[i*3+1]=((i*2.414)%1-.5)*8;dust[i*3+2]=-3-((i*.732)%1)*3;}
  const dustGeo=geo(new T.BufferGeometry());dustGeo.setAttribute("position",new T.BufferAttribute(dust,3));
  const dustMat=mat(new T.PointsMaterial({color:0xa29aa8,size:.017,transparent:true,opacity:.32}));root.add(new T.Points(dustGeo,dustMat));
  let connected=true,target=1,progress=1,visible=true,paused=false,disposed=false,frame=0,elapsed=0,last=0;
  let pointerX=0,pointerY=0,baseX=3.1,baseScale=1,baseCameraZ=12.5,isMobile=false,scrollTarget=0,scrollProgress=0;
  const pointer=(e:PointerEvent)=>{if(e.pointerType!=="mouse")return;const b=host.getBoundingClientRect();pointerX=((e.clientX-b.left)/b.width-.5)*.12;pointerY=((e.clientY-b.top)/b.height-.5)*.06;};
  const leave=()=>{pointerX=0;pointerY=0;};host.addEventListener("pointermove",pointer);host.addEventListener("pointerleave",leave);
  const render=(time=0)=>{
    frame=0;if(disposed)return;const delta=Math.max(0,Math.min((time-last)/1000||0,.05));last=time;if(!paused){elapsed+=delta;scrollProgress+=(scrollTarget-scrollProgress)*.09;}progress+=(target-progress)*.06;
    const entrance=1-Math.pow(1-Math.min(elapsed/1.55,1),3);
    const spread=scrollProgress*(isMobile?.75:1);
    root.rotation.y+=(-.08+pointerX-spread*.2-root.rotation.y)*.055;
    root.rotation.x+=(pointerY+spread*.055-root.rotation.x)*.055;
    root.rotation.z=-spread*.045;
    root.position.x=baseX+spread*(isMobile?.08:.25);
    root.scale.setScalar(baseScale*(1+spread*.04));
    camera.position.x=spread*.65;
    camera.position.y=.45+spread*.38;
    camera.position.z=baseCameraZ-spread*(isMobile?.65:1.05);
    camera.lookAt(isMobile?0:.25*spread,.15+.15*spread,0);
    layers.forEach(({group,base,phase})=>{
      group.position.copy(base);
      group.position.x=base.x*(.45+.55*entrance)+(phase-1.5)*.26*spread+(1-progress)*(phase%2===0?-.24:.23);
      group.position.y+=(paused?0:Math.sin(elapsed*.36+phase*.45)*.055)+(1-progress)*(phase%2===0?.35:-.3)+(phase-1.5)*.22*spread;
      group.position.z+=(1.5-phase)*.7*spread+(1-entrance)*(phase-1.5)*.3;
      group.rotation.z=-.06+(1-progress)*(phase%2===0?.12:-.13)+(phase-1.5)*.035*spread;
      group.rotation.y=-.7+.28*entrance+(1-progress)*phase*.1+.2*spread+(phase-1.5)*.12*spread;
    });
    trackMat.opacity=.12+progress*.38+spread*.12;faintTrack.opacity=.04+progress*.12+spread*.07;pinkEdge.opacity=.2+progress*.35+spread*.16;packetMat.color.set(connected?0xf26b92:0xa29aa8);
    packets.forEach(({mesh,curve,offset},i)=>{const t=connected?(elapsed*.035+offset)%1:.21+(i%8)*.008;mesh.position.copy(curve.getPoint(t));mesh.visible=connected||i<8;});
    renderer.render(scene,camera);if(visible&&!document.hidden&&(!paused||Math.abs(target-progress)>.001))frame=requestAnimationFrame(render);
  };
  const schedule=()=>{if(!frame&&!disposed&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(render);}};
  const resize=()=>{const width=host.clientWidth,height=host.clientHeight;isMobile=width<=800;renderer.setSize(width,height,false);camera.aspect=width/Math.max(height,1);camera.fov=isMobile?38:37;baseCameraZ=isMobile?11.1:12.5;camera.position.set(0,.45,baseCameraZ);camera.lookAt(0,.15,0);camera.updateProjectionMatrix();baseX=isMobile?0:3.15;baseScale=isMobile?.94:1;root.position.x=baseX;root.position.y=isMobile?-.05:.2;root.scale.setScalar(baseScale);renderer.render(scene,camera);};
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const visibilityChange=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();};document.addEventListener("visibilitychange",visibilityChange);resize();schedule();
  return{setMode:value=>{connected=value;target=value?1:0;schedule();},setScrollProgress:value=>{scrollTarget=Math.max(0,Math.min(1,value));if(!paused)schedule();},setVisible:value=>{visible=value;if(value)schedule();else{cancelAnimationFrame(frame);frame=0;}},setPaused:value=>{paused=value;if(value){cancelAnimationFrame(frame);frame=0;renderer.render(scene,camera);}else schedule();},dispose:()=>{disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();document.removeEventListener("visibilitychange",visibilityChange);host.removeEventListener("pointermove",pointer);host.removeEventListener("pointerleave",leave);materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();}};
}
