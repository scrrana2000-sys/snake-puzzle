document.addEventListener('DOMContentLoaded',()=>{const b=document.querySelector('.menu'),n=document.querySelector('.nav');if(b&&n)b.onclick=()=>{const o=n.dataset.open==='1';n.dataset.open=o?'0':'1';n.style.display=o?'none':'flex';n.style.flexDirection='column';n.style.position='absolute';n.style.right='12px';n.style.top='62px';n.style.background='#07110a';n.style.padding='10px';n.style.borderRadius='14px';b.setAttribute('aria-expanded',String(!o))}
const pw=document.getElementById('phoneTilt');
if(pw&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  pw.addEventListener('mousemove',(e)=>{
    const r=pw.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-0.5;
    const py=(e.clientY-r.top)/r.height-0.5;
    pw.style.transform=`rotateY(${px*22}deg) rotateX(${py*-22}deg)`;
  });
  pw.addEventListener('mouseleave',()=>{pw.style.transform='rotateY(0deg) rotateX(0deg)'});
}
const trail=document.getElementById('trailPath');
if(trail){
  const len=trail.getTotalLength();
  trail.style.strokeDasharray=String(len);
  trail.style.strokeDashoffset=String(len);
  trail.style.transition='stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)';
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){trail.style.strokeDashoffset='0';}
  else{
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(en=>{if(en.isIntersecting){trail.style.strokeDashoffset='0';io.unobserve(trail)}});
    },{threshold:.4});
    io.observe(trail);
  }
}
});