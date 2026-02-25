import { useState, useEffect, useRef } from "react";

/*
 * MINH SƯ AI v3 — MoonRow Visual Language
 * 
 * COLOR SYSTEM (cloned from MoonRow):
 *   bg-deep:    #0A0F1C (navy black)
 *   bg-card:    rgba(255,255,255,0.03)
 *   border:     rgba(255,255,255,0.06)
 *   border-hov: rgba(255,255,255,0.12)
 *   text-head:  #E8E4F0 (warm white)
 *   text-body:  rgba(255,255,255,0.55)
 *   text-muted: rgba(255,255,255,0.3)
 *   accent:     #00D4AA (neon teal)
 *   accent2:    #C9A84C (gold — brand)
 *   neon-glow:  0 0 24px rgba(0,212,170,0.35)
 *   aurora:     #00D4AA + #7C3AED + #0066FF (hero bg)
 *   tag-bg:     rgba(0,212,170,0.08)
 *   tag-border: rgba(0,212,170,0.2)
 */

// ========== THEME ==========
const T = {
  bg: "#0A0F1C",
  bg2: "#0D1225",
  card: "rgba(255,255,255,0.03)",
  cardHov: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.06)",
  borderHov: "rgba(255,255,255,0.12)",
  head: "#E8E4F0",
  body: "rgba(255,255,255,0.55)",
  muted: "rgba(255,255,255,0.3)",
  dim: "rgba(255,255,255,0.15)",
  accent: "#00D4AA",
  gold: "#C9A84C",
  purple: "#7C3AED",
  blue: "#0066FF",
  red: "#FF4757",
  orange: "#FF9F43",
  glow: "0 0 24px rgba(0,212,170,0.35)",
  glowSoft: "0 0 40px rgba(0,212,170,0.15)",
  serif: "'Libre Baskerville','Playfair Display',serif",
  sans: "'DM Sans','Outfit',sans-serif",
};

// ========== ENGINE ==========
const N = {
  lv:{A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8},
  vw:new Set(["A","E","I","O","U"]),
  r(n){if(n===11||n===22||n===33)return n;while(n>9)n=String(n).split("").reduce((a,b)=>a+ +b,0);return n},
  lp(d,m,y){return this.r(this.r(d)+this.r(m)+this.r(y))},
  nm(s){return this.r(s.toUpperCase().replace(/[^A-Z]/g,"").split("").reduce((a,c)=>a+(this.lv[c]||0),0))},
  su(s){return this.r(s.toUpperCase().replace(/[^A-Z]/g,"").split("").filter(c=>this.vw.has(c)).reduce((a,c)=>a+(this.lv[c]||0),0))},
  pe(s){return this.r(s.toUpperCase().replace(/[^A-Z]/g,"").split("").filter(c=>!this.vw.has(c)).reduce((a,c)=>a+(this.lv[c]||0),0))},
  bd(d){return this.r(d)},
  py(d,m,cy){return this.r(d+m+this.r(cy))},
};
const LP={
  1:{t:"Người Tiên Phong",s:"Độc lập, sáng tạo, lãnh đạo bẩm sinh",c:"Cô đơn, bướng bỉnh",w:"CEO, Khởi nghiệp, Freelancer",f:"Kiếm tiền từ ý tưởng độc đáo",d:"D"},
  2:{t:"Người Hòa Giải",s:"Nhạy cảm, hợp tác, kiên nhẫn",c:"Thiếu quyết đoán",w:"Tư vấn, Ngoại giao, HR",f:"Thu nhập ổn định từ hợp tác",d:"S"},
  3:{t:"Người Biểu Đạt",s:"Sáng tạo, giao tiếp, lạc quan",c:"Phân tán, hời hợt",w:"Marketing, Nghệ thuật, MC",f:"Kiếm tiền từ sáng tạo",d:"I"},
  4:{t:"Người Xây Dựng",s:"Kỷ luật, thực tế, đáng tin cậy",c:"Cứng nhắc, bảo thủ",w:"Kỹ sư, Quản lý, Kế toán",f:"Tích lũy chậm nhưng bền",d:"C"},
  5:{t:"Người Tự Do",s:"Linh hoạt, phiêu lưu, đa tài",c:"Bốc đồng, thiếu kiên nhẫn",w:"Sales, Du lịch, Truyền thông",f:"Đa dạng hóa thu nhập",d:"I"},
  6:{t:"Người Chăm Sóc",s:"Trách nhiệm, yêu thương, nghệ thuật",c:"Lo lắng, kiểm soát",w:"Giáo dục, Y tế, Thiết kế",f:"Kiếm tiền từ phục vụ",d:"S"},
  7:{t:"Người Tìm Kiếm",s:"Trí tuệ sâu, phân tích, trực giác",c:"Cô lập, hoài nghi",w:"Nghiên cứu, Công nghệ, Tâm linh",f:"Chuyên môn sâu",d:"C"},
  8:{t:"Người Quyền Lực",s:"Tham vọng, tổ chức, tài chính",c:"Vật chất, kiểm soát",w:"Doanh nhân, Tài chính, BĐS",f:"Tiềm năng giàu lớn",d:"D"},
  9:{t:"Người Nhân Ái",s:"Vị tha, tầm nhìn rộng",c:"Lý tưởng hóa",w:"NGO, Giáo dục, Nghệ thuật",f:"Giá trị & cống hiến",d:"I"},
  11:{t:"Bậc Thầy Trực Giác",s:"Trực giác siêu việt, truyền cảm hứng",c:"Căng thẳng nội tâm",w:"Coaching, Tâm linh",f:"Tầm ảnh hưởng",d:"I/S"},
  22:{t:"Bậc Thầy Xây Dựng",s:"Tầm nhìn vĩ đại, thực thi phi thường",c:"Kỳ vọng quá cao",w:"Kiến trúc, CEO tập đoàn",f:"Tiềm năng đế chế",d:"D/C"},
  33:{t:"Bậc Thầy Chữa Lành",s:"Yêu thương vô điều kiện",c:"Hy sinh bản thân",w:"Y tế, Tâm linh, Giáo dục",f:"Sứ mệnh phục vụ",d:"S/I"},
};

// ========== COMPONENTS ==========
const AnimNum=({target,suffix="",dur=2000})=>{const[v,setV]=useState(0);const ref=useRef(null);const[vis,setVis]=useState(false);
useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold:0.3});if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[]);
useEffect(()=>{if(!vis)return;let s=0;const step=target/(dur/16);const t=setInterval(()=>{s+=step;if(s>=target){setV(target);clearInterval(t)}else setV(Math.floor(s))},16);return()=>clearInterval(t)},[vis,target,dur]);
return <span ref={ref}>{typeof target==="number"&&target%1!==0?v.toFixed(1):v.toLocaleString()}{suffix}</span>};

const Sec=({children,style={}})=>{const ref=useRef(null);const[v,setV]=useState(false);
useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:0.08});if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[]);
return <section ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(30px)",transition:"all 0.7s cubic-bezier(0.16,1,0.3,1)",...style}}>{children}</section>};

// Pill button — MoonRow style
const Pill=({children,onClick,glow,ghost,small,style={}})=>(
  <button onClick={onClick} style={{
    background:ghost?"transparent":T.accent,
    color:ghost?T.accent:"#0A0F1C",
    border:ghost?`1px solid ${T.accent}44`:"none",
    borderRadius:40,padding:small?"8px 20px":"14px 32px",cursor:"pointer",
    fontSize:small?12:14,fontWeight:700,fontFamily:T.sans,letterSpacing:0.3,
    boxShadow:glow?T.glow:"none",
    display:"inline-flex",alignItems:"center",gap:8,...style
  }}>{children}</button>
);

// Tag — MoonRow style
const Tag=({children,color=T.accent})=>(
  <span style={{display:"inline-block",fontSize:11,fontWeight:600,color,letterSpacing:2,textTransform:"uppercase",
    background:`${color}12`,border:`1px solid ${color}22`,borderRadius:20,padding:"5px 16px"}}>{children}</span>
);

// Line separator
const Line=({w=60})=>(<div style={{width:w,height:1,background:`linear-gradient(90deg,transparent,${T.accent}44,transparent)`,margin:"0 auto"}} />);

// Card — MoonRow style
const Card=({children,hover=true,glow,style={}})=>{
  const[h,setH]=useState(false);
  return <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
    background:h&&hover?T.cardHov:T.card,
    border:`1px solid ${h&&hover?T.borderHov:T.border}`,
    borderRadius:16,transition:"all 0.35s",
    boxShadow:h&&glow?`0 0 20px ${glow}22, inset 0 0 20px ${glow}05`:"none",
    ...style
  }}>{children}</div>
};

// ========== NAV ==========
const Nav=({go,page})=>(
  <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:60,display:"flex",alignItems:"center",padding:"0 clamp(20px,4vw,48px)",
    background:"rgba(10,15,28,0.88)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`}}>
    <div onClick={()=>go("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold},#8B6914)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:400,color:T.bg,fontFamily:"'Ma Shan Zheng','Noto Serif TC','KaiTi',cursive",letterSpacing:-1}}>黃</div>
      <span style={{fontFamily:T.serif,fontSize:15,fontWeight:700,color:T.gold,letterSpacing:0.5}}>Minh Sư</span>
    </div>
    <div style={{flex:1}} />
    <div style={{display:"flex",gap:4}}>
      {[["home","Trang Chủ"],["thanso","Bản Thể"],["dichvu","Dịch Vụ"],["pricing","Bảng Giá"]].map(([k,l])=>(
        <button key={k} onClick={()=>go(k)} style={{background:"transparent",border:"none",borderRadius:8,padding:"7px 14px",cursor:"pointer",
          color:page===k?T.accent:T.muted,fontSize:13,fontWeight:page===k?600:400,fontFamily:T.sans,transition:"all 0.3s"}}>{l}</button>
      ))}
    </div>
    <Pill onClick={()=>go("thanso")} small style={{marginLeft:16}}>Bắt Đầu Khám Phá</Pill>
  </nav>
);

// ========== GOOGLE SHEETS WEBHOOK ==========
const SHEET_URL="https://script.google.com/macros/s/AKfycbwETccUg7FWT3pNc6UhsauSN-qr-rRxlUtPvJmLEpw6VCIJIPoUUxiDlGMKtlEZ20O1/exec";
const getDISC=(lp)=>[1,8,22].includes(lp)?"D":[3,5,9,11,33].includes(lp)?"I":[2,6].includes(lp)?"S":"C";
const discFull={D:"Dominance — Người Chủ Đạo",I:"Influence — Người Ảnh Hưởng",S:"Steadiness — Người Ổn Định",C:"Conscientiousness — Người Tận Tâm"};
const discDesc={D:"Quyết đoán, thẳng thắn, lãnh đạo bẩm sinh. Luôn hướng đến kết quả. Thích kiểm soát và ra quyết định nhanh.",I:"Sáng tạo, thu hút, truyền cảm hứng. Giao tiếp xuất sắc, networking giỏi. Yêu sự mới mẻ và kích thích.",S:"Kiên nhẫn, trung thành, đáng tin cậy. Lắng nghe tốt, giữ hòa khí. Ổn định và chăm sóc người xung quanh.",C:"Phân tích sâu, chi tiết, kỷ luật. Tiêu chuẩn cao, logic mạnh. Nghiên cứu kỹ trước khi quyết định."};
const getNapAm=(y)=>{const a=[["Hải Trung Kim","Kim"],["Lô Trung Hỏa","Hỏa"],["Đại Lâm Mộc","Mộc"],["Lộ Bàng Thổ","Thổ"],["Kiếm Phong Kim","Kim"],["Sơn Đầu Hỏa","Hỏa"],["Giản Hạ Thủy","Thủy"],["Thành Đầu Thổ","Thổ"],["Bạch Lạp Kim","Kim"],["Dương Liễu Mộc","Mộc"],["Tuyền Trung Thủy","Thủy"],["Ốc Thượng Thổ","Thổ"],["Tích Lịch Hỏa","Hỏa"],["Tùng Bách Mộc","Mộc"],["Trường Lưu Thủy","Thủy"],["Sa Trung Kim","Kim"],["Sơn Hạ Hỏa","Hỏa"],["Bình Địa Mộc","Mộc"],["Bích Thượng Thổ","Thổ"],["Kim Bạch Kim","Kim"],["Phú Đăng Hỏa","Hỏa"],["Thiên Hà Thủy","Thủy"],["Đại Trạch Thổ","Thổ"],["Thoa Xuyến Kim","Kim"],["Tang Đố Mộc","Mộc"],["Đại Khê Thủy","Thủy"],["Sa Trung Thổ","Thổ"],["Thiên Thượng Hỏa","Hỏa"],["Thạch Lựu Mộc","Mộc"],["Đại Hải Thủy","Thủy"]];return a[Math.floor(((y-4)%60)/2)%30]||a[21]};
const saveToSheet=async(data)=>{try{await fetch(SHEET_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})}catch(e){console.log("sheet save error",e)}};

// ========== LEAD FORM — inline Tài Lộc result ==========
const LeadForm=({go})=>{
  const[ln,setLn]=useState("");const[lp2,setLp2]=useState("");const[ld,setLd]=useState("");const[lm,setLm]=useState("");const[ly,setLy]=useState("");const[le,setLe]=useState("");const[res,setRes]=useState(null);
  const submit=()=>{
    if(!ln||!ld||!lm||!ly)return;
    const d=parseInt(ld),m=parseInt(lm),y=parseInt(ly);
    if(d<1||d>31||m<1||m>12||y<1900||y>2025)return;
    const lp=N.lp(d,m,y),py=N.py(d,m,2026),expr=N.nm(ln),soul=N.su(ln),pers=N.pe(ln),bday=N.bd(d);
    const data=LP[lp]||LP[9],disc=getDISC(lp),napAm=getNapAm(y);
    const bizScore=lp===8?92:lp===22?90:lp===1?85:lp===5?80:65+lp*2;
    const investScore=py===8?95:py===1?85:py===5?82:60+py*3;
    const riskScore=Math.max(15,90-lp*5);
    const goldenM=[1+(lp+py)%4, 4+(lp%3), 8+(py%2)].map(v=>Math.min(v,12));
    const badM=[(7+lp%3),(11+py%2)].map(v=>v>12?v-12:v);
    saveToSheet({
      name:ln.trim(),phone:lp2,email:le,dob:`${ld}/${lm}/${ly}`,
      method:"Tài Lộc 2026",source:"home-lead",
      lifePath:lp,lifePath_name:data.t,expression:expr,soul:soul,personality:pers,birthday:bday,personalYear:py,
      disc:disc,disc_name:discFull[disc],disc_desc:discDesc[disc],
      napAm:napAm[0],element:napAm[1],
      strengths:data.s,challenges:data.c,career:data.w,finance:data.f,
      bizScore,investScore,riskScore,goldenMonths:goldenM.join(","),cautionMonths:badM.join(",")
    });
    setRes({lp,py,expr,soul,pers,bday,data,name:ln.trim(),bizScore,investScore,riskScore,goldenM,badM,disc,napAm});
  };
  const fi={background:"rgba(255,255,255,0.06)",border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 14px",color:T.head,fontSize:14,fontFamily:T.sans,outline:"none",textAlign:"center"};

  if(res) return <div style={{position:"relative",maxWidth:540,margin:"0 auto"}}>
    {/* Profile */}
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
      <div style={{width:50,height:50,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold}44,${T.accent}22)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>💰</div>
      <div style={{flex:1}}>
        <h3 style={{fontFamily:T.serif,fontSize:18,color:T.head}}>{res.name}</h3>
        <p style={{color:T.muted,fontSize:11}}>{ld}/{lm}/{ly} • Số chủ đạo {res.lp} — {res.data.t}</p>
      </div>
      <div style={{textAlign:"center",background:`${T.gold}12`,border:`1px solid ${T.gold}33`,borderRadius:14,padding:"8px 14px"}}>
        <div style={{fontFamily:T.serif,fontSize:28,fontWeight:800,color:T.gold,lineHeight:1}}>{res.bizScore}</div>
        <div style={{fontSize:7,color:T.gold,letterSpacing:1,marginTop:2}}>ĐIỂM TÀI LỘC</div>
      </div>
    </div>

    {/* Score bars — business focused */}
    {[
      {l:"Tiềm năng kinh doanh",v:res.bizScore,c:T.gold},
      {l:"Cơ hội đầu tư 2026",v:res.investScore,c:T.accent},
      {l:"Mức độ rủi ro",v:res.riskScore,c:T.red},
    ].map((s,i)=>(
      <div key={i} style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
          <span style={{fontSize:11,color:T.body}}>{s.l}</span>
          <span style={{fontSize:11,color:s.c,fontWeight:700}}>{Math.min(s.v,98)}%</span>
        </div>
        <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${Math.min(s.v,98)}%`,background:`linear-gradient(90deg,${s.c},${s.c}88)`,borderRadius:3,transition:"width 1s ease"}} />
        </div>
      </div>
    ))}

    {/* Tháng hoàng đạo & tháng kỵ */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"16px 0"}}>
      <div style={{background:`${T.gold}08`,border:`1px solid ${T.gold}22`,borderRadius:12,padding:"12px 14px"}}>
        <div style={{color:T.gold,fontSize:9,fontWeight:700,letterSpacing:1.5,marginBottom:8}}>🔥 THÁNG HOÀNG ĐẠO</div>
        <div style={{display:"flex",gap:6}}>
          {res.goldenM.map((m,i)=><div key={i} style={{flex:1,background:`${T.gold}15`,borderRadius:8,padding:"8px 4px",textAlign:"center"}}>
            <div style={{fontFamily:T.serif,fontSize:18,fontWeight:800,color:T.gold}}>T{m}</div>
            <div style={{fontSize:7,color:T.muted}}>Thuận lợi</div>
          </div>)}
        </div>
      </div>
      <div style={{background:`${T.red}08`,border:`1px solid ${T.red}22`,borderRadius:12,padding:"12px 14px"}}>
        <div style={{color:T.red,fontSize:9,fontWeight:700,letterSpacing:1.5,marginBottom:8}}>⚠️ THÁNG KỴ</div>
        <div style={{display:"flex",gap:6}}>
          {res.badM.map((m,i)=><div key={i} style={{flex:1,background:`${T.red}10`,borderRadius:8,padding:"8px 4px",textAlign:"center"}}>
            <div style={{fontFamily:T.serif,fontSize:18,fontWeight:800,color:T.red}}>T{m}</div>
            <div style={{fontSize:7,color:T.muted}}>Cẩn thận</div>
          </div>)}
        </div>
      </div>
    </div>

    {/* ===== THẦN SỐ HỌC — Ý NGHĨA CÁC SỐ ===== */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"18px 16px",marginBottom:14}}>
      <div style={{color:T.gold,fontSize:9,fontWeight:700,letterSpacing:1.5,marginBottom:14}}>🔢 BẢN ĐỒ THẦN SỐ HỌC</div>
      {/* Number grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
        {[
          {l:"Số Chủ Đạo",v:res.lp,c:T.gold,desc:"Con số quan trọng nhất — định hình sứ mệnh cuộc đời và con đường bạn đi"},
          {l:"Số Sứ Mệnh",v:res.expr,c:T.purple,desc:"Tài năng bẩm sinh và cách bạn thể hiện ra thế giới bên ngoài"},
          {l:"Số Linh Hồn",v:res.soul,c:T.blue,desc:"Khao khát sâu thẳm bên trong — điều thực sự khiến bạn hạnh phúc"},
          {l:"Số Nhân Cách",v:res.pers,c:T.orange,desc:"Ấn tượng đầu tiên bạn tạo cho người khác — mặt nạ xã hội"},
          {l:"Số Ngày Sinh",v:res.bday,c:T.accent,desc:"Tài năng đặc biệt được ban tặng — thế mạnh tự nhiên"},
          {l:"Năm CÁ Nhân",v:res.py,c:T.red,desc:"Năng lượng chủ đạo năm 2026 — chu kỳ bạn đang ở"},
        ].map((n,i)=><div key={i} style={{background:`${n.c}08`,border:`1px solid ${n.c}18`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
          <div style={{fontSize:8,color:T.muted,letterSpacing:1,marginBottom:4}}>{n.l}</div>
          <div style={{fontFamily:T.serif,fontSize:26,fontWeight:800,color:n.c,lineHeight:1}}>{n.v}</div>
        </div>)}
      </div>

      {/* Ý nghĩa Số Chủ Đạo */}
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <div style={{fontFamily:T.serif,fontSize:28,fontWeight:800,color:T.gold}}>{res.lp}</div>
          <div><div style={{color:T.gold,fontSize:11,fontWeight:700}}>SỐ CHỦ ĐẠO — {res.data.t}</div>
          <div style={{color:T.muted,fontSize:10}}>Con đường định mệnh của bạn</div></div>
        </div>
        <p style={{color:T.body,fontSize:12,lineHeight:1.7,marginBottom:8}}>
          {res.lp===1?"Bạn sinh ra để DẪN ĐẦU. Số 1 mang năng lượng khai phá — là người đi đầu, dám nghĩ dám làm. Có khả năng tự lập từ sớm, sức mạnh ý chí rất lớn. Phù hợp khởi nghiệp, lãnh đạo, sáng tạo.":
          res.lp===2?"Bạn là bậc thầy ngoại giao — biết cách làm trung gian, hòa giải mâu thuẫn. Trực giác gần như siêu nhiên, cảm nhận được điều sắp xảy ra. Phát huy tối đa trong vai trò cộng sự, đối tác.":
          res.lp===3?"Bạn là nghệ sĩ bẩm sinh — có khả năng biến ý tưởng thành sản phẩm thu hút. Duyên dáng, truyền cảm hứng cho mọi người. Tiềm năng lớn trong personal branding và content.":
          res.lp===4?"Bạn là kiến trúc sư cuộc đời — xây dựng nền tảng vững chắc cho mọi thứ. Cực kỳ đáng tin cậy, nói là làm. Kiên trì phi thường, rất giỏi scale hệ thống.":
          res.lp===5?"Bạn là linh hồn tự do — thích ứng cực nhanh, đa tài, học gì cũng nhanh. Cuốn hút tự nhiên vì mang năng lượng sôi động. Portfolio career phù hợp nhất.":
          res.lp===6?"Bạn là trái tim gia đình — sẵn sàng hy sinh vì người thân, có mắt thẩm mỹ tốt, chữa lành người khác bằng sự hiện diện. Kinh doanh dịch vụ, chăm sóc rất thuận lợi.":
          res.lp===7?"Bạn là triết gia — tìm kiếm ý nghĩa sâu xa trong mọi thứ. Phân tích phi thường, trực giác gần siêu nhiên. Phù hợp vai trò chuyên gia, thought leader.":
          res.lp===8?"Bạn là vua tài chính — hiểu tiền bạc và quyền lực một cách bản năng. Tham vọng lớn VÀ có khả năng đạt được. Sinh ra để xây dựng đế chế.":
          res.lp===9?"Bạn là linh hồn già — mang tầm nhìn toàn cầu, vì nhân loại. Vị tha không tính toán. Khi tìm được meaning, tiền sẽ tự đến.":
          res.lp===11?"Bạn mang rung động cao nhất — gần như 'download' thông tin từ vũ trụ. Truyền cảm hứng chỉ bằng sự hiện diện. Sứ mệnh là khai sáng và dẫn đường.":
          res.lp===22?"Bạn kết hợp trực giác với thực tế — biến giấc mơ lớn nhất thành hiện thực. Xây dựng những thứ tồn tại qua nhiều thế hệ. Think in decades.":
          "Bạn mang tình yêu vô điều kiện ở mức cosmic — chữa lành chỉ bằng sự hiện diện. Share wisdom through whatever medium resonates."}
        </p>
      </div>

      {/* Ý nghĩa Số Sứ Mệnh + Linh Hồn */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{background:`${T.purple}06`,border:`1px solid ${T.purple}12`,borderRadius:8,padding:"12px 10px"}}>
          <div style={{color:T.purple,fontSize:9,fontWeight:700,letterSpacing:1,marginBottom:4}}>SỐ SỨ MỆNH: {res.expr}</div>
          <p style={{color:T.body,fontSize:11,lineHeight:1.6}}>
            {res.expr<=3?"Sứ mệnh biểu đạt và sáng tạo — bạn sinh ra để truyền đạt ý tưởng, truyền cảm hứng. Nghệ thuật, viết lách, giảng dạy là sân chơi.":
            res.expr<=6?"Sứ mệnh xây dựng và phục vụ — bạn tạo ra giá trị thông qua hệ thống, tổ chức, chăm sóc. Kinh doanh bền vững là thế mạnh.":
            res.expr<=9?"Sứ mệnh phân tích và dẫn dắt — bạn thấy bức tranh lớn mà người khác bỏ qua. Chiến lược gia, nhà đầu tư, mentor.":
            "Sứ mệnh Master — năng lượng đặc biệt, tầm ảnh hưởng vượt xa cá nhân."}
          </p>
        </div>
        <div style={{background:`${T.blue}06`,border:`1px solid ${T.blue}12`,borderRadius:8,padding:"12px 10px"}}>
          <div style={{color:T.blue,fontSize:9,fontWeight:700,letterSpacing:1,marginBottom:4}}>SỐ LINH HỒN: {res.soul}</div>
          <p style={{color:T.body,fontSize:11,lineHeight:1.6}}>
            {res.soul<=3?"Linh hồn khao khát tự do và biểu đạt — bạn cần không gian sáng tạo, cần được lắng nghe, cần cảm giác đang SỐNG thật sự.":
            res.soul<=6?"Linh hồn khao khát ổn định và kết nối — bạn cần mái ấm, cần người thân bên cạnh, cần biết mình thuộc về đâu.":
            res.soul<=9?"Linh hồn khao khát ý nghĩa và sự sâu sắc — bạn cần hiểu WHY, cần mục đích lớn hơn bản thân, cần sự thật.":
            "Linh hồn Master — khao khát khai sáng, chữa lành, để lại di sản cho nhân loại."}
          </p>
        </div>
      </div>
    </div>

    {/* ===== DỰ ĐOÁN TÀI LỘC 2026 CHI TIẾT ===== */}
    <div style={{background:`${T.gold}04`,border:`1px solid ${T.gold}18`,borderRadius:12,padding:"18px 16px",marginBottom:14}}>
      <div style={{color:T.gold,fontSize:9,fontWeight:700,letterSpacing:1.5,marginBottom:12}}>🔥 DỰ ĐOÁN TÀI LỘC 2026 — NĂM BÍNH NGỌ (THIÊN HÀ THỦY)</div>
      <p style={{color:T.body,fontSize:12,lineHeight:1.7,marginBottom:12}}>
        Năm 2026 là Universal Year {1+0} = 1 — năm KHỞI TẠO. Mọi hành động năm nay sẽ define cả thập kỷ tới. Với Năm Cá Nhân <strong style={{color:T.accent}}>{res.py}</strong>, năng lượng tài lộc của bạn tập trung vào:
      </p>
      <p style={{color:T.body,fontSize:12,lineHeight:1.7,marginBottom:12}}>
        {res.py===1?"KHỞI ĐẦU MỚI — Gieo hạt cho cả năm. Tháng 1-3 là window vàng để bắt đầu dự án mới, thay đổi career, hoặc launch sản phẩm.":
        res.py===2?"HỢP TÁC — Tài lộc đến từ partnership. Đừng làm một mình. Tìm đối tác bổ trợ, ký kết liên doanh, merge resources.":
        res.py===3?"SÁNG TẠO & BIỂU ĐẠT — Content, marketing, personal brand = gold mine. Launch channel, viết sách, ra course. Monetize tài năng.":
        res.py===4?"XÂY NỀN TẢNG — Không phải năm bùng nổ nhưng là năm quyết định. Xây hệ thống, quy trình, automation. Thu nhập passive.":
        res.py===5?"THAY ĐỔI & CƠ HỘI — Cơ hội bất ngờ từ nguồn không ngờ. Linh hoạt, đa dạng hóa. Diversify income, đừng all-in.":
        res.py===6?"DỊCH VỤ & GIA ĐÌNH — Kinh doanh F&B, wellness, giáo dục cực thuận. Đầu tư cho gia đình, BĐS cho thuê.":
        res.py===7?"NGHIÊN CỨU & CHUYÊN MÔN — Consulting, teaching, IP. Monetize expertise. Đầu tư dựa trên research + intuition.":
        res.py===8?"NĂM VÀNG TÀI LỘC! Ký kết deal lớn, mở rộng quy mô, đầu tư mạnh tay. Cho đi 8% thu nhập để kích karma.":
        res.py===9?"HOÀN THÀNH CHU KỲ — Buông bỏ cái cũ để nhận mới. Close nợ, bán tài sản không dùng, launch social enterprise.":
        "Master Year — năng lượng đặc biệt, follow intuition, manifest abundance."}
      </p>
      {/* Q1-Q4 roadmap */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[
          {q:"Q1 (T1-3)",icon:"🌱",text:res.py<=3?"Khởi động mạnh — launch, khai trương, ký kết":"Chuẩn bị & lên kế hoạch — research, networking"},
          {q:"Q2 (T4-6)",icon:"☀️",text:res.py<=5?"Mở rộng & scale — recruit, invest, grow":"Ổn định hóa — tối ưu hệ thống, tăng hiệu suất"},
          {q:"Q3 (T7-9)",icon:"🍂",text:"Thu hoạch đợt 1 — close deal, collect revenue, review ROI"},
          {q:"Q4 (T10-12)",icon:"❄️",text:res.py>=7?"Thu hoạch lớn & chuẩn bị năm mới":"Tổng kết, tối ưu, đặt mục tiêu 2027"},
        ].map((q,i)=><div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 10px"}}>
          <div style={{fontSize:10,color:T.gold,fontWeight:700,marginBottom:4}}>{q.icon} {q.q}</div>
          <p style={{color:T.body,fontSize:11,lineHeight:1.5}}>{q.text}</p>
        </div>)}
      </div>
    </div>

    {/* Quick business insight */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginBottom:14}}>
      <div style={{color:T.accent,fontSize:9,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>💼 NHẬN ĐỊNH KINH DOANH 2026</div>
      <p style={{color:T.body,fontSize:12,lineHeight:1.6}}>{res.lp===8||res.lp===22?"Năm 2026 là năm VÀNG để mở rộng quy mô. Ký kết hợp đồng lớn, M&A, đầu tư mạnh tay.":res.lp===1||res.lp===5?"Năm khởi tạo — dự án mới, thị trường mới. Dám bước ra khỏi vùng an toàn sẽ được thưởng lớn.":res.lp===3||res.lp===9?"Kinh doanh từ sáng tạo & thương hiệu cá nhân. Content, IP, branding mang lại doanh thu lớn nhất.":"Xây dựng nền tảng vững chắc. Tối ưu hệ thống hiện tại trước khi mở rộng. Thu nhập passive là chìa khóa."}</p>
    </div>

    {/* ===== DISC PERSONALITY ===== */}
    {(()=>{
      const disc=[1,8,22].includes(res.lp)?"D":[3,5,9,11,33].includes(res.lp)?"I":[2,6].includes(res.lp)?"S":"C";
      const discData={
        D:{name:"Dominance — Người Chủ Đạo",color:T.red,icon:"🦁",bars:[{l:"Quyết đoán",v:88},{l:"Kiên nhẫn",v:35},{l:"Cảm xúc",v:40},{l:"Kỷ luật",v:78}],
          personality:"Bạn thuộc nhóm người có năng lượng DẪN DẮT rất mạnh. Trong bất kỳ nhóm nào, bạn là người đầu tiên đưa ra ý kiến, dám đưa quyết định khi ai cũng còn do dự. Bạn không thích vòng vo — thẳng thắn, trực tiếp, và luôn hướng đến KẾT QUẢ.",
          habits:"Thói quen nổi bật: thích kiểm soát lịch trình, hay tự đặt deadline cho bản thân, mở miệng là nói về mục tiêu và kế hoạch. Trong cuộc họp, bạn là người kết thúc sớm nhất vì ghét lãng phí thời gian. Khi stress, bạn có xu hướng trở nên cộc cằn và ra lệnh — đây là điểm cần tự nhận biết.",
          hobby:"Sở thích thường nghiêng về các hoạt động có tính cạnh tranh: thể thao, đầu tư, game chiến thuật, kinh doanh. Bạn tìm thấy niềm vui trong việc CHINH PHỤC — dù là một đỉnh núi hay một mục tiêu doanh số.",
          advice:"Lời khuyên: Học cách lắng nghe 3 giây trước khi phản hồi. Sự mạnh mẽ đích thực không đến từ kiểm soát, mà từ khả năng nâng người khác lên."
        },
        I:{name:"Influence — Người Ảnh Hưởng",color:T.orange,icon:"🌟",bars:[{l:"Giao tiếp",v:92},{l:"Kỷ luật",v:38},{l:"Sáng tạo",v:88},{l:"Chi tiết",v:32}],
          personality:"Bạn là người mang 'ánh sáng' vào mọi căn phòng. Khả năng giao tiếp và kết nối con người của bạn là thiên phú — người ta nhớ bạn không vì bạn nói gì, mà vì bạn làm họ CẢM THẤY thế nào. Bạn có sức thu hút tự nhiên, lôi cuốn và truyền cảm hứng.",
          habits:"Thói quen đặc trưng: hay nói chuyện điện thoại/nhắn tin, calendar luôn kín social events, có 5 ý tưởng mới mỗi ngày nhưng hoàn thành 1-2 cái. Bạn ghét routine, thích thay đổi, và thường mua sắm theo cảm hứng. Khi stress, bạn nói nhiều hơn bình thường hoặc trốn vào entertainment.",
          hobby:"Sở thích: du lịch, networking events, content sáng tạo, karaoke, lễ hội, thử nhà hàng mới. Bạn yêu mọi thứ MỚI và sợ nhất sự nhàm chán.",
          advice:"Lời khuyên: Hoàn thành 1 việc trước khi bắt đầu 3 việc mới. Sáng tạo chỉ có giá trị khi được KỶ LUẬT HÓA thành kết quả cụ thể."
        },
        S:{name:"Steadiness — Người Ổn Định",color:T.blue,icon:"🕊",bars:[{l:"Kiên nhẫn",v:90},{l:"Quyết đoán",v:35},{l:"Đồng cảm",v:92},{l:"Linh hoạt",v:38}],
          personality:"Bạn là trụ cột thầm lặng — người mà ai cũng tin tưởng nhưng ít ai nhận ra giá trị thật sự cho đến khi bạn vắng mặt. Trung thành, kiên nhẫn, và luôn đặt sự hòa thuận lên hàng đầu. Bạn là người lắng nghe tuyệt vời, và điều đó khiến mọi người tìm đến bạn khi cần tâm sự.",
          habits:"Thói quen: giữ routine rất tốt (ăn sáng cùng chỗ, cà phê cùng loại), diary/journal, chăm sóc cây cối hoặc thú cưng. Bạn có xu hướng chịu đựng quá lâu trước khi lên tiếng — và khi bùng nổ thì người xung quanh rất bất ngờ. Khi stress, bạn rút lui và im lặng.",
          hobby:"Sở thích: nấu ăn, làm vườn, đọc sách, yoga, dành thời gian với gia đình/bạn thân. Bạn không cần nhiều nhưng cần CHẤT LƯỢNG trong mọi trải nghiệm.",
          advice:"Lời khuyên: Đặt ranh giới không phải ích kỷ — đó là tự yêu thương. Nói 'không' với 1 thứ chính là nói 'có' với bản thân."
        },
        C:{name:"Conscientiousness — Người Tận Tâm",color:T.accent,icon:"🔬",bars:[{l:"Phân tích",v:92},{l:"Giao tiếp",v:38},{l:"Chi tiết",v:90},{l:"Linh hoạt",v:32}],
          personality:"Bạn là bộ não phân tích — thấy chi tiết mà người khác bỏ qua, phát hiện lỗi mà không ai nhận ra. Tiêu chuẩn của bạn rất cao, và bạn áp dụng điều đó cho cả bản thân lẫn công việc. Sự chính xác và logic là ngôn ngữ mẹ đẻ của bạn.",
          habits:"Thói quen: lên kế hoạch chi tiết cho mọi thứ (kể cả nghỉ phép), đọc review trước khi mua bất cứ gì, có folder riêng cho từng dự án, để ý từng đồng trong chi tiêu. Khi stress, bạn overthink và bị kẹt trong vòng lặp phân tích — biết cần hành động mà không dám bước.",
          hobby:"Sở thích: đọc non-fiction, nghiên cứu, coding, puzzle, cờ, sưu tầm, tối ưu hóa hệ thống cá nhân. Bạn tìm thấy sự thỏa mãn trong việc HIỂU SÂU một thứ hơn là biết rộng nhiều thứ.",
          advice:"Lời khuyên: Đôi khi 80% hoàn hảo nhưng xong > 100% hoàn hảo mà chưa bao giờ bắt đầu. Hãy tin vào bản năng bên cạnh logic."
        }
      };
      const dd=discData[disc];
      // Tứ Trụ elements
      const canArr=["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
      const chiArr=["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
      const elemArr=["Mộc","Mộc","Hỏa","Hỏa","Thổ","Thổ","Kim","Kim","Thủy","Thủy"];
      const yy=parseInt(ly),mm=parseInt(lm),dd2=parseInt(ld);
      const yCan=canArr[(yy-4)%10],yChi=chiArr[(yy-4)%12],yElem=elemArr[(yy-4)%10];
      const mIdx=(yy%5)*2+(mm+1)%10;const mCan=canArr[mIdx%10],mChi=chiArr[(mm+1)%12];
      const dIdx=((yy%100)*5+Math.floor((yy%100)/4)+dd2+Math.floor((mm*3+3)/5)+[0,0,31,59,90,120,151,181,212,243,273,304,334][mm])%10;
      const dCan=canArr[Math.abs(dIdx)%10],dChi=chiArr[Math.abs(dd2+mm)%12],dElem=elemArr[Math.abs(dIdx)%10];
      const napAmArr=[
        ["Hải Trung Kim","Kim"],["Lô Trung Hỏa","Hỏa"],["Đại Lâm Mộc","Mộc"],["Lộ Bàng Thổ","Thổ"],["Kiếm Phong Kim","Kim"],
        ["Sơn Đầu Hỏa","Hỏa"],["Giản Hạ Thủy","Thủy"],["Thành Đầu Thổ","Thổ"],["Bạch Lạp Kim","Kim"],["Dương Liễu Mộc","Mộc"],
        ["Tuyền Trung Thủy","Thủy"],["Ốc Thượng Thổ","Thổ"],["Tích Lịch Hỏa","Hỏa"],["Tùng Bách Mộc","Mộc"],["Trường Lưu Thủy","Thủy"],
        ["Sa Trung Kim","Kim"],["Sơn Hạ Hỏa","Hỏa"],["Bình Địa Mộc","Mộc"],["Bích Thượng Thổ","Thổ"],["Kim Bạch Kim","Kim"],
        ["Phú Đăng Hỏa","Hỏa"],["Thiên Hà Thủy","Thủy"],["Đại Trạch Thổ","Thổ"],["Thoa Xuyến Kim","Kim"],["Tang Đố Mộc","Mộc"],
        ["Đại Khê Thủy","Thủy"],["Sa Trung Thổ","Thổ"],["Thiên Thượng Hỏa","Hỏa"],["Thạch Lựu Mộc","Mộc"],["Đại Hải Thủy","Thủy"]
      ];
      const naIdx=Math.floor(((yy-4)%60)/2)%30;
      const napAm=napAmArr[naIdx]||["Thiên Hà Thủy","Thủy"];
      const elemDesc={
        "Kim":"Bạn mang bản chất KIM — cứng cỏi, quyết đoán như kim loại. Bên ngoài có thể lạnh lùng nhưng bên trong ẩn chứa giá trị lớn. Trong kinh doanh, bạn giỏi cắt giảm lãng phí và tối ưu hiệu suất. Mối nguy lớn nhất: cứng nhắc không chịu thay đổi khi thị trường đòi hỏi linh hoạt.",
        "Mộc":"Bạn mang bản chất MỘC — luôn phát triển, vươn lên như cây. Có tầm nhìn xa, biết chờ đợi mùa thu hoạch. Kinh doanh trong giáo dục, y tế, nông nghiệp rất hợp. Mối nguy: quá nóng nảy khi kết quả chưa đến — nhớ rằng cây đại thụ mất 10 năm, không phải 10 ngày.",
        "Thủy":"Bạn mang bản chất THỦY — linh hoạt, sâu sắc, biết len lỏi tìm đường. Trí tuệ là vũ khí chính. Kinh doanh công nghệ, logistics, tài chính rất thuận. Mối nguy: thiếu quyết đoán, hay lo lắng — nước chảy mãi cũng đến biển, tin vào hành trình.",
        "Hỏa":"Bạn mang bản chất HỎA — đam mê, nhiệt huyết, dẫn đầu. Sức lôi cuốn tự nhiên, thích hợp với marketing, giải trí, lãnh đạo. Mối nguy: bốc đồng trong đầu tư, chi tiêu quá tay khi hưng phấn. Năm 2026 (song Hỏa) cần đặc biệt cẩn thận — quá nhiều lửa dễ cháy.",
        "Thổ":"Bạn mang bản chất THỔ — ổn định, đáng tin, là nền tảng cho mọi thứ. BĐS, xây dựng, F&B rất hợp. Người ta tin tưởng giao tiền cho bạn quản lý. Mối nguy: quá thận trọng bỏ lỡ cơ hội — đất cần được cày mới sinh hoa màu."
      };
      const tuTruInteract=yElem==="Hỏa"&&dElem==="Thủy"?"Thiên Can Hỏa gặp Nhật Can Thủy — mâu thuẫn nội tại: bên ngoài nóng bỏng nhưng bên trong sâu lắng. Người đối diện thường đánh giá sai bạn.":yElem===dElem?"Năm sinh và Nhật Nguyên cùng hành "+yElem+" — năng lượng thuần nhất, chuyên môn sâu. Nhưng cần bổ sung hành tương sinh để cân bằng.":"Năm sinh ("+yElem+") và Nhật Nguyên ("+dElem+") tạo nên sự đa chiều trong tính cách — bạn vừa có nét "+yElem+" vừa mang năng lượng "+dElem+", rất phù hợp để kinh doanh đa ngành.";

      return <>
      {/* DISC Section */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"18px 16px",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <span style={{fontSize:24}}>{dd.icon}</span>
          <div>
            <div style={{color:dd.color,fontSize:9,fontWeight:700,letterSpacing:1.5}}>DISC PROFILE</div>
            <div style={{fontFamily:T.serif,fontSize:16,color:T.head,fontWeight:600}}>{dd.name}</div>
          </div>
        </div>
        {/* Mini bars */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 14px",marginBottom:14}}>
          {dd.bars.map((b,i)=><div key={i}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
              <span style={{fontSize:10,color:T.muted}}>{b.l}</span>
              <span style={{fontSize:10,color:b.v>70?T.accent:T.muted}}>{b.v}%</span>
            </div>
            <div style={{height:3,background:T.border,borderRadius:2}}>
              <div style={{height:"100%",width:`${b.v}%`,background:b.v>70?dd.color:`${T.muted}44`,borderRadius:2,transition:"width 0.8s"}} />
            </div>
          </div>)}
        </div>
        <p style={{color:T.body,fontSize:12,lineHeight:1.7,marginBottom:10}}>{dd.personality}</p>
        <p style={{color:T.body,fontSize:12,lineHeight:1.7,marginBottom:10}}>{dd.habits}</p>
        <p style={{color:T.body,fontSize:12,lineHeight:1.7,marginBottom:10}}>{dd.hobby}</p>
        <div style={{background:`${dd.color}08`,border:`1px solid ${dd.color}18`,borderRadius:8,padding:"10px 12px"}}>
          <p style={{color:dd.color,fontSize:11.5,lineHeight:1.6,fontStyle:"italic"}}>💡 {dd.advice}</p>
        </div>
      </div>

      {/* TỨ TRỤ / BÁT TỰ Section */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"18px 16px",marginBottom:14}}>
        <div style={{color:T.purple,fontSize:9,fontWeight:700,letterSpacing:1.5,marginBottom:12}}>☯ TỨ TRỤ BÁT TỰ — BẢN CHẤT NGUYÊN THỦY</div>
        {/* Pillars */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
          {[
            {label:"Trụ Năm",can:yCan,chi:yChi,elem:yElem,note:"Gốc rễ, gia tộc"},
            {label:"Trụ Tháng",can:mCan,chi:mChi,elem:elemArr[mIdx%10],note:"Sự nghiệp, xã hội"},
            {label:"Trụ Ngày (Nhật Nguyên)",can:dCan,chi:dChi,elem:dElem,note:"Bản ngã đích thực"},
          ].map((p,i)=><div key={i} style={{background:`${T.purple}08`,border:`1px solid ${T.purple}15`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
            <div style={{fontSize:8,color:T.muted,letterSpacing:1,marginBottom:4}}>{p.label}</div>
            <div style={{fontFamily:T.serif,fontSize:16,color:T.head,fontWeight:700}}>{p.can} {p.chi}</div>
            <div style={{fontSize:10,color:T.purple,fontWeight:600,marginTop:2}}>{p.elem}</div>
            <div style={{fontSize:8,color:T.muted,marginTop:4}}>{p.note}</div>
          </div>)}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"10px 12px",background:`${T.gold}06`,border:`1px solid ${T.gold}15`,borderRadius:8}}>
          <span style={{fontSize:16}}>🏷</span>
          <div>
            <div style={{fontSize:10,color:T.muted}}>Nạp Âm (Mệnh)</div>
            <div style={{fontFamily:T.serif,fontSize:14,color:T.gold,fontWeight:700}}>{napAm[0]} <span style={{fontSize:11,color:T.muted}}>— {napAm[1]}</span></div>
          </div>
        </div>
        <p style={{color:T.body,fontSize:12,lineHeight:1.7,marginBottom:10}}>{elemDesc[napAm[1]]||elemDesc["Thủy"]}</p>
        <p style={{color:T.body,fontSize:12,lineHeight:1.7,marginBottom:10}}>{tuTruInteract}</p>
        <p style={{color:T.body,fontSize:12,lineHeight:1.7}}>Năm 2026 là Bính Ngọ — Thiên Hà Thủy. {napAm[1]==="Thủy"?"Đây là năm CÁ GẶP NƯỚC cho bạn — mệnh Thủy gặp năm Thủy, mọi thứ thuận dòng. Hãy mạnh dạn mở rộng kinh doanh!":napAm[1]==="Kim"?"Kim được Thủy sinh — năm 2026 tài lộc chảy về bạn tự nhiên. Đầu tư vào tài sản liquid (cổ phiếu, crypto) sẽ thuận lợi hơn BĐS.":napAm[1]==="Mộc"?"Thủy sinh Mộc — năm nay bạn được nuôi dưỡng để PHÁT TRIỂN. Giáo dục, wellness, nông nghiệp sạch là những ngành mang lại nhiều cơ hội.":napAm[1]==="Hỏa"?"Hỏa bị Thủy khắc — năm 2026 cần CẨN THẬN đặc biệt với tài chính. Đừng đầu tư bốc đồng. Nên có cố vấn tài chính và tránh all-in vào một dự án.":"Thổ khắc Thủy — bạn có khả năng 'giữ' tiền tốt năm nay. BĐS cho thuê, passive income là chiến lược tối ưu. Tránh mở rộng quá nhanh."}</p>
      </div>
      </>;
    })()}

    {/* Blurred teaser */}
    <div style={{position:"relative",overflow:"hidden",borderRadius:12,marginBottom:14}}>
      <div style={{background:T.card,border:`1px solid ${T.border}`,padding:"14px 16px"}}>
        <div style={{color:T.gold,fontSize:9,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>🔮 BÍ THUẬT + HÀNH ĐỘNG THEO QUÝ</div>
        <p style={{color:T.body,fontSize:11.5,lineHeight:1.6,filter:"blur(3px)",userSelect:"none"}}>Q1: Khởi động dự án kinh doanh mới vào tháng {res.goldenM[0]}. Hướng tốt: Đông Nam. Màu may mắn: Vàng gold. Q2: Mở rộng đối tác. Đá phong thủy: Citrine kích hoạt tài lộc. Q3: Ký hợp đồng lớn...</p>
      </div>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(10,15,28,0.6)",backdropFilter:"blur(2px)"}}>
        <div style={{textAlign:"center"}}>
          <span style={{fontSize:20}}>🔒</span>
          <p style={{color:T.gold,fontSize:11,fontWeight:700,marginTop:4}}>Báo cáo đầy đủ gửi qua Email</p>
        </div>
      </div>
    </div>

    {/* Email capture */}
    {!le||!le.includes("@")?<div style={{display:"flex",gap:8}}>
      <input value={le} onChange={e=>setLe(e.target.value)} placeholder="Email nhận báo cáo chi tiết" style={{...fi,flex:1,textAlign:"left"}} />
      <Pill onClick={()=>{if(le&&le.includes("@"))setLe(le+"✓")}} glow small>Gửi</Pill>
    </div>:
    <div style={{background:`${T.accent}08`,border:`1px solid ${T.accent}22`,borderRadius:10,padding:"10px 14px",textAlign:"center"}}>
      <p style={{color:T.accent,fontSize:12,fontWeight:600}}>✓ Báo cáo đầy đủ gửi vào {le.replace("✓","")} sau 2-3 phút</p>
      <p style={{color:T.muted,fontSize:10}}>Kiểm tra Rác/Spam nếu không thấy</p>
    </div>}

    <div style={{textAlign:"center",marginTop:14}}>
      <Pill onClick={()=>go("thanso")} ghost small>Thử thêm Thần Số Học & Tử Vi →</Pill>
    </div>
  </div>;

  return <div style={{position:"relative",maxWidth:500,margin:"0 auto"}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10,marginBottom:12}}>
      <input value={ln} onChange={e=>setLn(e.target.value)} placeholder="Họ và tên" style={{...fi,textAlign:"left"}} />
      <input value={lp2} onChange={e=>setLp2(e.target.value)} placeholder="Số điện thoại" type="tel" style={{...fi,textAlign:"left"}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <input value={ld} onChange={e=>setLd(e.target.value)} placeholder="Ngày" type="number" style={fi} />
        <input value={lm} onChange={e=>setLm(e.target.value)} placeholder="Tháng" type="number" style={fi} />
        <input value={ly} onChange={e=>setLy(e.target.value)} placeholder="Năm sinh" type="number" style={fi} />
      </div>
      <input value={le} onChange={e=>setLe(e.target.value)} placeholder="Email (nhận báo cáo chi tiết)" style={{...fi,textAlign:"left"}} />
    </div>
    <Pill onClick={submit} glow style={{width:"100%",justifyContent:"center",padding:"16px 32px",fontSize:15}}>🔥 Kiểm Tra Vận Tài Lộc 2026 — Miễn Phí</Pill>
    <p style={{color:T.dim,fontSize:10,marginTop:10}}>Không spam • Bảo mật 100% • Kết quả trong 30 giây</p>
  </div>
};

// ========== HOME ==========
const Home=({go})=>{
  const px="clamp(20px,5vw,80px)";const mx=1140;
  return <div style={{paddingTop:60}}>

    {/* HERO — aurora bg + MoonRow gradient glow from top */}
    <Sec style={{padding:`140px ${px} 100px`,textAlign:"center",position:"relative",overflow:"hidden"}}>
      {/* MoonRow-style aurora glow — wide gradient spread from top, not a straight line */}
      <div style={{position:"absolute",top:"-30%",left:"20%",width:"60%",height:500,background:`radial-gradient(ellipse at 50% 0%,rgba(124,58,237,0.18) 0%,rgba(200,80,255,0.08) 30%,rgba(0,212,170,0.04) 60%,transparent 80%)`,filter:"blur(60px)",pointerEvents:"none",zIndex:0}} />
      <div style={{position:"absolute",top:"-15%",left:"30%",width:"40%",height:350,background:`radial-gradient(ellipse at 50% 0%,rgba(201,168,76,0.08) 0%,rgba(255,60,170,0.05) 40%,transparent 70%)`,filter:"blur(50px)",pointerEvents:"none",zIndex:0}} />
      {/* Teal + purple + blue orbs */}
      <div style={{position:"absolute",top:"-40%",left:"10%",width:700,height:700,borderRadius:"50%",background:`radial-gradient(circle,rgba(0,212,170,0.07),transparent 65%)`,filter:"blur(100px)",pointerEvents:"none"}} />
      <div style={{position:"absolute",top:"-25%",right:"5%",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,rgba(124,58,237,0.1),transparent 60%)`,filter:"blur(90px)",pointerEvents:"none"}} />
      <div style={{position:"absolute",top:"-20%",left:"45%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,rgba(0,102,255,0.05),transparent 65%)`,filter:"blur(70px)",pointerEvents:"none"}} />
      {/* Pink/magenta streaks */}
      <div style={{position:"absolute",top:"-20%",left:"25%",width:450,height:400,borderRadius:"50%",background:`radial-gradient(circle,rgba(255,60,170,0.07),transparent 55%)`,filter:"blur(80px)",pointerEvents:"none"}} />
      <div style={{position:"absolute",top:"-10%",right:"20%",width:350,height:350,borderRadius:"50%",background:`radial-gradient(circle,rgba(200,80,255,0.06),transparent 55%)`,filter:"blur(70px)",pointerEvents:"none"}} />

      <Tag>Huyền Học & AI</Tag>
      <h1 style={{fontFamily:T.serif,fontSize:"clamp(44px,7vw,82px)",fontWeight:400,fontStyle:"italic",color:T.head,lineHeight:1.1,marginTop:28,marginBottom:12}}>
        Khám Phá Vận Mệnh<br/><span style={{color:T.gold,fontWeight:700,fontStyle:"normal"}}>Bằng Trí Tuệ AI.</span>
      </h1>
      <p style={{color:T.body,fontSize:15,maxWidth:520,margin:"0 auto 36px",lineHeight:1.7}}>
        Kết hợp Thần Số Học, Tử Vi Đẩu Số, Tứ Trụ Bát Tự & DISC — cá nhân hóa hoàn toàn. Hành động cụ thể, không phán số.
      </p>
      <Pill onClick={()=>go("thanso")} glow>Bắt Đầu Khám Phá →</Pill>
    </Sec>

    {/* DIVIDER */}
    <Line w={120} />

    {/* LEAD CAPTURE — Kiểm Tra Vận Tài Lộc 2026 */}
    <Sec style={{padding:`80px ${px}`,maxWidth:mx,margin:"0 auto"}}>
      <div
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 0 50px rgba(201,168,76,0.18), 0 0 100px rgba(201,168,76,0.08), 0 20px 60px rgba(0,0,0,0.3)";e.currentTarget.style.borderColor="rgba(201,168,76,0.5)"}}
        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 0 40px rgba(201,168,76,0.1), 0 0 80px rgba(201,168,76,0.05)";e.currentTarget.style.borderColor="rgba(201,168,76,0.35)"}}
        style={{background:`linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.04),rgba(201,168,76,0.08))`,border:`1.5px solid rgba(201,168,76,0.35)`,borderRadius:24,padding:"48px 40px",position:"relative",overflow:"hidden",textAlign:"center",boxShadow:`0 0 40px rgba(201,168,76,0.1), 0 0 80px rgba(201,168,76,0.05)`,transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",cursor:"default"}}>
        <div style={{position:"absolute",top:"-30%",right:"-10%",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,rgba(201,168,76,0.1),transparent)`,filter:"blur(60px)",pointerEvents:"none"}} />
        <div style={{position:"absolute",bottom:"-20%",left:"-10%",width:250,height:250,borderRadius:"50%",background:`radial-gradient(circle,rgba(201,168,76,0.08),transparent)`,filter:"blur(50px)",pointerEvents:"none"}} />
        <div style={{fontSize:40,marginBottom:12,position:"relative"}}>🔥</div>
        <Tag color={T.gold}>HOT 2026</Tag>
        <h2 style={{fontFamily:T.serif,fontSize:"clamp(26px,4vw,40px)",color:T.gold,marginTop:16,marginBottom:8,position:"relative"}}>Kiểm Tra Vận Tài Lộc 2026</h2>
        <p style={{color:T.body,fontSize:14,maxWidth:480,margin:"0 auto 8px",lineHeight:1.7,position:"relative"}}>Năm 2026 — vận tài lộc của bạn ở mức nào? Nhập tên & ngày sinh để AI phân tích <strong style={{color:T.gold}}>miễn phí</strong> ngay.</p>
        <p style={{color:T.muted,fontSize:12,marginBottom:28,position:"relative"}}>✦ Dựa trên Thần Số Học + Tử Vi + Ngũ Hành — cá nhân hóa 100%</p>
        <LeadForm go={go} />
      </div>
    </Sec>

    <Line />

    {/* METHODS — 6 cards */}
    <Sec style={{padding:`100px ${px}`,maxWidth:mx,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:56}}>
        <Tag>Các Lăng Kính</Tag>
        <h2 style={{fontFamily:T.serif,fontSize:"clamp(36px,5vw,56px)",color:T.head,marginTop:16,marginBottom:8}}>Các Phương Pháp</h2>
        <p style={{color:T.muted,fontSize:14,maxWidth:520,margin:"0 auto"}}>Huyền học cổ xưa — số hóa bằng AI từ Du Già Mật Tông Thiên Cẩm Sơn</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:16}}>
        {[
          {i:"✦",t:"Tử Vi Đẩu Số",d:"Khám phá vận mệnh qua hệ thống Can Chi và 12 Con Giáp.",b:"Biết trước thời vận để ra quyết định lớn",inp:"Ngày giờ sinh",out:"Lá số trọn đời",tm:"Ngay lập tức",tag:"199K",tc:T.orange},
          {i:"#",t:"Thần Số Học",d:"Giải mã bản đồ số mệnh từ tên và ngày sinh theo Pythagorean.",b:"Thấu hiểu điểm mạnh & sứ mệnh cuộc đời",inp:"Họ tên, Ngày sinh",out:"Bản đồ vận mệnh",tm:"Ngay lập tức",tag:"MIỄN PHÍ",tc:T.accent},
          {i:"☯",t:"Tứ Trụ Bát Tự",d:"Phân tích Ngũ Hành, Thiên Can Địa Chi, tìm Dụng Thần.",b:"Cân bằng ngũ hành, tối ưu vận khí",inp:"Ngày giờ sinh",out:"Ngũ hành & Đại vận",tm:"Ngay lập tức",tag:"199K",tc:"#4A9EFF"},
          {i:"◉",t:"DISC Profile",d:"4 chiều tính cách: Dominance, Influence, Steadiness, Conscientiousness.",b:"Hiểu phong cách giao tiếp & lãnh đạo",inp:"Thần Số + AI",out:"Profile DISC",tm:"Ngay lập tức",tag:"MIỄN PHÍ",tc:T.accent},
          {i:"☰",t:"Dịch Lý — Kinh Dịch",d:"Ứng dụng 64 quẻ vào tình huống kinh doanh, tình cảm, sức khỏe.",b:"Trí tuệ 5000 năm cho câu hỏi cụ thể",inp:"Câu hỏi",out:"Quẻ + Hành động",tm:"AI ~30s",tag:"99K",tc:T.purple},
          {i:"◆",t:"Bản Định Hướng",d:"AI tổng hợp TOÀN BỘ → chiến lược kinh doanh, tình duyên, đặt tên.",b:"Bản đồ hành động 12 tháng chi tiết",inp:"Tất cả dữ liệu",out:"Báo cáo chiến lược",tm:"AI ~2 phút",tag:"CỐ VẤN",tc:T.gold},
        ].map((m,i)=>(
          <Card key={i} glow={m.tc} style={{padding:"24px 22px",cursor:"pointer"}} hover>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22,color:m.tc,opacity:0.8}}>{m.i}</span>
                <h3 style={{fontFamily:T.serif,fontSize:20,color:T.head,fontWeight:600}}>{m.t}</h3>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:m.tag==="MIỄN PHÍ"?T.accent:m.tag==="CỐ VẤN"?T.gold:T.body,
                background:m.tag==="MIỄN PHÍ"?`${T.accent}15`:m.tag==="CỐ VẤN"?`${T.gold}15`:"rgba(255,255,255,0.06)",
                padding:"3px 10px",borderRadius:6,letterSpacing:0.5}}>{m.tag}</span>
            </div>
            <p style={{fontSize:13,color:T.body,lineHeight:1.65,marginBottom:14}}>{m.d}</p>
            <div style={{background:`${m.tc}0A`,border:`1px solid ${m.tc}18`,borderRadius:8,padding:"7px 12px",marginBottom:14}}>
              <span style={{color:m.tc,fontSize:11.5,fontWeight:600}}>✦ {m.b}</span>
            </div>
            <div style={{display:"flex",gap:14,fontSize:11,color:T.muted}}>
              <span>⊙ {m.inp}</span><span>⊕ {m.out}</span>
            </div>
            <div style={{marginTop:5,fontSize:10.5,color:m.tm.includes("Ngay")?T.accent:T.gold}}>⏱ {m.tm}</div>
          </Card>
        ))}
      </div>
      <div style={{textAlign:"center",marginTop:40}}>
        <Pill onClick={()=>go("thanso")} ghost>Khám Phá Toàn Bộ 6 Lăng Kính →</Pill>
      </div>
    </Sec>

    <Line />

    {/* WHY DIFFERENT */}
    <Sec style={{padding:`100px ${px}`,maxWidth:mx,margin:"0 auto"}}>
      <h2 style={{fontFamily:T.serif,fontSize:"clamp(28px,3.5vw,40px)",color:T.head,textAlign:"center",marginBottom:6}}>Điều Gì Khiến 12,000+ Người Tin Dùng?</h2>
      <Line w={40} />
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,marginTop:48,marginBottom:64}}>
        {[
          {i:"🧬",c:T.accent,t:"6 phương pháp — 1 bản đồ duy nhất",d:"Không app nào kết hợp Thần Số + Tử Vi + Bát Tự + DISC + Dịch Lý + Phong Thủy trong cùng 1 hệ thống AI."},
          {i:"🎯",c:T.gold,t:"Hành động cụ thể theo từng THÁNG",d:"Không chung chung kiểu 'cẩn thận sức khỏe'. Mà là: tháng nào nên ký hợp đồng, tháng nào nên nghỉ ngơi."},
          {i:"⚡",c:T.red,t:"30 giây — Không cần đăng ký",d:"Nhập tên + ngày sinh → nhận ngay Thần Số Học + DISC + Năm Cá Nhân 2026. Hoàn toàn miễn phí, không email spam."},
        ].map((c,i)=>(
          <Card key={i} style={{padding:"32px 24px",textAlign:"center"}}>
            <div style={{fontSize:26,marginBottom:14}}>{c.i}</div>
            <h3 style={{fontSize:15,fontWeight:700,color:T.head,marginBottom:8}}>{c.t}</h3>
            <p style={{fontSize:12.5,color:T.body,lineHeight:1.7}}>{c.d}</p>
          </Card>
        ))}
      </div>
      {/* Stats — gradient text like MoonRow */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:20,textAlign:"center"}}>
        {[
          {i:"👥",v:12000,su:"+",l:"NGƯỜI ĐÃ MỞ KHÓA VẬN MỆNH"},
          {i:"⭐",v:4.9,su:"/5",l:"MỨC ĐỘ HÀI LÒNG"},
          {i:"📊",v:50000,su:"+",l:"BÁO CÁO ĐÃ XUẤT BẢN"},
          {i:"🔒",v:100,su:"%",l:"BẢO MẬT DỮ LIỆU"},
        ].map((s,i)=>(
          <div key={i}>
            <div style={{fontSize:18,marginBottom:6,opacity:0.5}}>{s.i}</div>
            <div style={{fontFamily:T.serif,fontSize:"clamp(32px,4vw,48px)",fontWeight:700,
              background:`linear-gradient(135deg,${T.accent},${T.gold})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              <AnimNum target={s.v} suffix={s.su} />
            </div>
            <div style={{fontSize:10,color:T.muted,letterSpacing:1.5,marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
    </Sec>

    <Line />

    {/* TOOLS */}
    <Sec style={{padding:`100px ${px}`,maxWidth:mx,margin:"0 auto",textAlign:"center"}}>
      <Tag color={T.gold}>Công Cụ Hỗ Trợ</Tag>
      <h2 style={{fontFamily:T.serif,fontSize:"clamp(28px,3.5vw,40px)",color:T.gold,marginTop:16,marginBottom:8}}>Công Cụ Theo Tình Huống</h2>
      <p style={{color:T.muted,fontSize:13,marginBottom:48}}>Giải pháp thực tế cho các vấn đề cụ thể trong cuộc sống</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
        {[
          {i:"❤️",c:T.red,t:"Xem Hợp Tuổi",s:"TÌNH CẢM & ĐỐI TÁC",d:"Đánh giá mức độ hòa hợp trong tình yêu hoặc hợp tác kinh doanh. Nhận diện điểm chung & dung hòa."},
          {i:"📅",c:T.accent,t:"Xem Ngày Tốt",s:"CHỌN THỜI ĐIỂM",d:"Lên kế hoạch sự kiện quan trọng: cưới hỏi, khai trương, xuất hành — thuận lợi trôi chảy."},
          {i:"🌙",c:T.blue,t:"Lịch Vạn Niên",s:"NĂNG LƯỢNG NGÀY",d:"Tra cứu ngày âm, tiết khí và năng lượng cát hung hàng ngày để chủ động công việc."},
          {i:"👶",c:T.gold,t:"Đặt Tên Cho Con",s:"HUYỀN HỌC + AI",d:"Chọn tên hợp mệnh, hợp ngũ hành, hợp tuổi cha mẹ. AI phân tích ý nghĩa & năng lượng từng con chữ."},
          {i:"🏢",c:T.orange,t:"Đặt Tên Doanh Nghiệp",s:"THƯƠNG HIỆU & VẬN KHÍ",d:"Tên công ty hợp phong thủy, hợp mệnh chủ, hợp ngành nghề. Tối ưu năng lượng thương hiệu."},
          {i:"🔥",c:"#FF6B6B",t:"Bí Thuật Gia Tăng Tài Lộc 2026",s:"ĐẶC BIỆT — CÁ NHÂN HÓA",d:"Phương pháp kích hoạt tài lộc theo đúng tên tuổi & mệnh của bạn. Hợp nhất huyền học + AI cho năm Bính Ngọ."},
        ].map((c,i)=>(
          <Card key={i} glow={c.c} style={{padding:"32px 24px",textAlign:"center",cursor:"pointer"}}>
            <div style={{fontSize:26,marginBottom:12}}>{c.i}</div>
            <h3 style={{fontFamily:T.serif,fontSize:17,color:T.head,marginBottom:4}}>{c.t}</h3>
            <div style={{fontSize:10,color:c.c,letterSpacing:2,fontWeight:700,marginBottom:12}}>{c.s}</div>
            <p style={{fontSize:12.5,color:T.body,lineHeight:1.7}}>{c.d}</p>
          </Card>
        ))}
      </div>
    </Sec>

    <Line />

    {/* 3 STEPS */}
    <Sec style={{padding:`100px ${px}`,maxWidth:mx,margin:"0 auto"}}>
      <h2 style={{fontFamily:T.serif,fontSize:"clamp(28px,3.5vw,40px)",color:T.head,textAlign:"center",marginBottom:56}}>3 Bước Mở Khóa Vận Mệnh</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:28}}>
        {[
          {n:"01",t:"Nhập thông tin",d:"Họ tên + Ngày giờ sinh. Mã hóa và bảo mật tuyệt đối.",c:T.accent},
          {n:"02",t:"AI phân tích đa chiều",d:"Kết hợp Thần Số, Tử Vi, Bát Tự, DISC — đồng bộ trong vài giây.",c:T.gold},
          {n:"03",t:"Nhận báo cáo & hành động",d:"Bản đồ vận mệnh + lộ trình hành động cụ thể theo từng tháng.",c:T.accent},
        ].map((s,i)=>(
          <div key={i} style={{textAlign:"center"}}>
            <div style={{width:52,height:52,borderRadius:"50%",border:`1.5px solid ${s.c}33`,background:`${s.c}08`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <span style={{fontFamily:T.serif,fontWeight:800,fontSize:18,color:s.c}}>{s.n}</span>
            </div>
            <h3 style={{fontSize:16,fontWeight:700,color:T.head,marginBottom:8}}>{s.t}</h3>
            <p style={{fontSize:12.5,color:T.body,lineHeight:1.7,maxWidth:280,margin:"0 auto"}}>{s.d}</p>
          </div>
        ))}
      </div>
    </Sec>

    <Line />

    {/* TESTIMONIALS */}
    <Sec style={{padding:`100px ${px}`,maxWidth:mx,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:48}}><Tag>Testimonials</Tag>
      <h2 style={{fontFamily:T.serif,fontSize:"clamp(28px,3.5vw,40px)",color:T.head,marginTop:16}}>Người Dùng Nói Gì?</h2></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>
        {[
          {n:"Trần Minh Đức",r:"CEO, TechVN",q:"Minh Sư AI giúp tôi chọn đúng thời điểm ký hợp đồng lớn. Q2 tăng 40% so với dự kiến."},
          {n:"Nguyễn Thị Hoa",r:"Freelancer",q:"Lần đầu thấy app kết hợp Thần Số + Tử Vi + DISC thành một bản đồ duy nhất. Rất dễ hiểu."},
          {n:"Lê Văn Hùng",r:"Investor",q:"Bản Định Hướng tài chính theo tháng chính xác đến bất ngờ. Đã chuyển từ hoài nghi sang tin dùng."},
        ].map((t,i)=>(
          <Card key={i} style={{padding:24}}>
            <div style={{color:T.gold,fontSize:13,marginBottom:10}}>{"★".repeat(5)}</div>
            <p style={{color:T.body,fontSize:13,lineHeight:1.7,fontStyle:"italic",marginBottom:18}}>"{t.q}"</p>
            <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:`${T.accent}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>👤</div>
              <div><div style={{color:T.head,fontSize:12,fontWeight:600}}>{t.n}</div><div style={{color:T.muted,fontSize:10.5}}>{t.r}</div></div>
            </div>
          </Card>
        ))}
      </div>
    </Sec>

    <Line />

    {/* COMPARE TABLE */}
    <Sec style={{padding:`100px ${px}`,maxWidth:mx,margin:"0 auto"}}>
      <h2 style={{fontFamily:T.serif,fontSize:"clamp(26px,3vw,38px)",color:T.head,textAlign:"center",marginBottom:40}}>Minh Sư AI vs. Phương Pháp Khác</h2>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 6px",fontSize:12.5}}>
          <thead><tr style={{color:T.muted,fontSize:10.5,letterSpacing:1}}>
            <th style={{textAlign:"left",padding:"10px 14px",fontWeight:500}}>TIÊU CHÍ</th>
            <th style={{textAlign:"center",padding:"10px 14px",color:T.accent,fontWeight:700}}>MINH SƯ AI</th>
            <th style={{textAlign:"center",padding:"10px 14px",fontWeight:500}}>Thầy truyền thống</th>
            <th style={{textAlign:"center",padding:"10px 14px",fontWeight:500}}>App khác</th>
          </tr></thead>
          <tbody>{[
            ["Kết hợp đa phương pháp","✅ Tất cả trong 1","❌ Thường 1 PP","⚠️ Tối đa 2"],
            ["Tốc độ","⚡ Ngay lập tức","🕐 1-7 ngày","⚡ Nhanh"],
            ["Hành động theo tháng","✅ AI Roadmap","⚠️ Tùy thầy","❌ Không"],
            ["Chi phí","💰 Dùng điểm, từ 0đ","💸 500K-5M","💰 Subscription"],
            ["Đặt tên con/công ty","✅ AI + Huyền Học","✅ Kinh nghiệm","❌ Không"],
            ["Bảo mật","🔒 Mã hóa 100%","⚠️ Không rõ","⚠️ Tùy app"],
          ].map((r,i)=>(
            <tr key={i} style={{background:T.card}}>
              {r.map((c,j)=><td key={j} style={{padding:"12px 14px",textAlign:j===0?"left":"center",color:j===1?T.accent:T.body,fontWeight:j===1?600:400,borderRadius:j===0?"10px 0 0 10px":j===3?"0 10px 10px 0":"0"}}>{c}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Sec>

    <Line />

    {/* CTA BANNER — MoonRow style compact */}
    <Sec style={{padding:`80px ${px}`,maxWidth:mx,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:24,background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"36px 32px"}}>
        <div>
          <h3 style={{fontFamily:T.serif,fontSize:24,color:T.head,marginBottom:6}}>Sẵn sàng khám phá vận mệnh?</h3>
          <p style={{color:T.muted,fontSize:13}}>30 giây nhập tên & ngày sinh — AI phân tích ngay. Hoàn toàn miễn phí.</p>
        </div>
        <Pill onClick={()=>go("thanso")} glow>Bắt Đầu Miễn Phí →</Pill>
      </div>
    </Sec>

    <Line />

    {/* RESULT PREVIEW — moved to bottom */}
    <Sec style={{padding:`100px ${px}`,maxWidth:mx,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"center"}}>
        <div>
          <Tag>Kết Quả Mẫu</Tag>
          <h2 style={{fontFamily:T.serif,fontSize:"clamp(26px,3vw,38px)",color:T.head,fontStyle:"italic",marginTop:16,marginBottom:14}}>Kết quả bạn nhận được</h2>
          <p style={{color:T.body,fontSize:13.5,lineHeight:1.7,marginBottom:24}}>Báo cáo cá nhân hóa hoàn toàn — hành động cụ thể, không chung chung.</p>
          {["Phân tích đa chiều (Tử Vi + Thần Số + Bát Tự)","Lời khuyên hành động cụ thể (Actionable)","Dự báo vận hạn & cơ hội theo THÁNG","DISC — phong cách lãnh đạo & giao tiếp","Đặt tên con / công ty theo huyền học"].map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{color:T.accent,fontSize:10}}>✓</span></div>
              <span style={{color:T.body,fontSize:13}}>{t}</span>
            </div>
          ))}
          <Card style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:12,marginTop:20,marginBottom:24}}>
            <span style={{fontSize:22}}>📄</span>
            <div><div style={{color:T.head,fontSize:13,fontWeight:600}}>Báo Cáo Vận Mệnh Chuyên Sâu</div>
            <div style={{color:T.accent,fontSize:11}}>Luận giải chi tiết • Hành động cụ thể</div></div>
          </Card>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            <Pill onClick={()=>go("thanso")} glow>Xem Chi Tiết Mẫu →</Pill>
            <span style={{color:T.muted,fontSize:12}}>🔒 Bảo mật 100%</span>
          </div>
        </div>
        <Card style={{padding:24}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${T.border}`}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold}33,${T.accent}22)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>👤</div>
            <div><div style={{color:T.head,fontSize:14,fontWeight:600}}>Nguyễn Văn A</div><div style={{color:T.muted,fontSize:11.5}}>15/08/1990 • KỶ TỴ</div></div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <span style={{color:T.body,fontSize:13}}>Số Chủ Đạo</span>
            <span style={{fontFamily:T.serif,fontSize:40,fontWeight:700,color:T.gold}}>8</span>
          </div>
          {[{l:"Sự nghiệp & Tài chính",v:85,c:T.red},{l:"Tình cảm & Gia đạo",v:60,c:T.orange},{l:"Sức khỏe & Nội tâm",v:75,c:T.blue}].map((b,i)=>(
            <div key={i} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:11.5,color:T.body}}>{b.l}</span>
                <span style={{fontSize:11.5,color:b.c,fontWeight:700}}>{b.v}%</span>
              </div>
              <div style={{height:4,background:T.border,borderRadius:2}}>
                <div style={{height:"100%",width:`${b.v}%`,background:`linear-gradient(90deg,${b.c},${b.c}88)`,borderRadius:2}} />
              </div>
            </div>
          ))}
          <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
            <div style={{color:T.gold,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:5}}>ĐIỂM MẠNH CỐT LÕI</div>
            <p style={{color:T.body,fontSize:12,lineHeight:1.6}}>Bạn sở hữu năng lực điều hành bẩm sinh và tư duy nhạy bén với các cơ hội tài chính...</p>
          </div>
          <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
            <div style={{color:T.red,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:5,opacity:0.8}}>ĐIỂM CẦN KHẮC PHỤC</div>
            <p style={{color:T.muted,fontSize:12,lineHeight:1.6,fontStyle:"italic"}}>Đôi khi sự thẳng thắn quá mức có thể gây tổn thương...</p>
          </div>
        </Card>
      </div>
    </Sec>

    {/* FOOTER */}
    <footer style={{padding:"40px 32px 28px",borderTop:`1px solid ${T.border}`,maxWidth:mx,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold},#8B6914)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:400,color:T.bg,fontFamily:"'Ma Shan Zheng','Noto Serif TC','KaiTi',cursive"}}>黃</div>
          <div><div style={{fontFamily:T.serif,fontSize:13,color:T.gold}}>Minh Sư AI</div><div style={{fontSize:9,color:T.dim}}>Du Già Mật Tông Thiên Cẩm Sơn</div></div>
        </div>
        <div style={{display:"flex",gap:20}}>{["Về chúng tôi","Bảo mật","Điều khoản","Chính sách thanh toán"].map((l,i)=><span key={i} style={{color:T.muted,fontSize:11.5,cursor:"pointer"}}>{l}</span>)}</div>
      </div>
      {/* Newsletter — MoonRow style */}
      <div style={{background:`${T.accent}08`,border:`1px solid ${T.accent}18`,borderRadius:12,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <span style={{color:T.accent,fontSize:12,fontWeight:600}}>📬 Nhận dự báo vận hạn hàng tháng qua email</span>
        <div style={{display:"flex",gap:8}}>
          <input placeholder="email@gmail.com" style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${T.border}`,borderRadius:20,padding:"8px 16px",color:T.head,fontSize:12,outline:"none",width:200}} />
          <Pill small>Đăng ký</Pill>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <span style={{color:T.dim,fontSize:10}}>Ứng dụng huyền học từ Du Già Mật Tông Thiên Cẩm Sơn</span>
        <span style={{color:T.dim,fontSize:10}}>© 2026 Minh Sư AI. All rights reserved.</span>
      </div>
    </footer>
  </div>
};

// ========== THAN SO PAGE ==========
const ThanSo=({go})=>{
  const[name,setName]=useState("");const[phone,setPhone]=useState("");const[day,setDay]=useState("");const[month,setMonth]=useState("");const[year,setYear]=useState("");const[email,setEmail]=useState("");
  const[method,setMethod]=useState("thanso");const[sent,setSent]=useState(false);const[res,setRes]=useState(null);
  const inp={width:"100%",background:"rgba(255,255,255,0.04)",border:`1px solid ${T.border}`,borderRadius:10,padding:"13px 16px",color:T.head,fontSize:15,fontFamily:T.sans,outline:"none",boxSizing:"border-box"};
  const submit=()=>{
    if(!name||!day||!month||!year||!email)return;
    const d=parseInt(day),m=parseInt(month),y=parseInt(year);
    if(d<1||d>31||m<1||m>12||y<1900||y>2025)return;
    const lp=N.lp(d,m,y),py=N.py(d,m,2026),expr=N.nm(name),soul=N.su(name),pers=N.pe(name),bday=N.bd(d);
    const data=LP[lp]||LP[9],disc=getDISC(lp),napAm=getNapAm(y);
    saveToSheet({
      name:name.trim(),phone:phone,email:email,dob:`${day}/${month}/${year}`,
      method:methods.find(mm=>mm.k===method)?.label||method,source:"ban-the",
      lifePath:lp,lifePath_name:data.t,expression:expr,soul:soul,personality:pers,birthday:bday,personalYear:py,
      disc:disc,disc_name:discFull[disc],disc_desc:discDesc[disc],
      napAm:napAm[0],element:napAm[1],
      strengths:data.s,challenges:data.c,career:data.w,finance:data.f
    });
    setRes({lp,py,expr,soul,pers,bday,data:data,name:name.trim(),disc,napAm});setSent(true);
  };
  const methods=[
    {k:"thanso",label:"Thần Số Học",icon:"#",desc:"Bản đồ số mệnh từ tên & ngày sinh",free:true},
    {k:"tuvi",label:"Tử Vi Đẩu Số",icon:"✦",desc:"Lá số trọn đời theo Can Chi",free:true},
    {k:"tailoc",label:"Vận Tài Lộc 2026",icon:"🔥",desc:"AI phân tích tài lộc cá nhân hóa",free:true},
  ];
  const scores=res?{thanso:[
    {l:"Sự nghiệp",v:res.lp===8?92:res.lp===1?85:res.lp===22?90:70+res.lp*2,c:T.gold},
    {l:"Tài lộc 2026",v:res.py<=3?82:res.py===8?95:60+res.py*3,c:T.accent},
    {l:"Tình cảm",v:res.soul<=3?78:res.soul===6?88:65+res.soul*2,c:T.red},
    {l:"Sức khỏe",v:70+res.lp,c:T.blue}
  ],tuvi:[
    {l:"Mệnh Cung",v:75+res.lp*2,c:T.gold},
    {l:"Quan Lộc",v:68+res.expr*2,c:T.accent},
    {l:"Tài Bạch",v:70+res.lp*2,c:T.orange},
    {l:"Phu Thê",v:60+res.soul*3,c:T.red}
  ],tailoc:[
    {l:"Tài Lộc Tổng",v:res.lp===8?92:res.lp===22?88:65+res.lp*3,c:T.gold},
    {l:"Cơ Hội Đầu Tư",v:60+res.py*4,c:T.accent},
    {l:"Thu Nhập Passive",v:55+res.expr*3,c:T.blue},
    {l:"Rủi Ro Tài Chính",v:Math.max(20,85-res.lp*4),c:T.red}
  ]}:null;
  const peakM=res?[1+res.lp%4, 4+res.lp%3, 8+res.py%2]:[];

  return <div style={{paddingTop:100,minHeight:"100vh"}}>
    <div style={{maxWidth:560,margin:"0 auto",padding:"0 24px"}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <Tag color={T.gold}>Bản Thể</Tag>
        <h1 style={{fontFamily:T.serif,fontSize:"clamp(32px,4.5vw,42px)",color:T.head,fontStyle:"italic",marginTop:16}}>Giải Mã Tử Vi</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:8}}>Chọn phương pháp → Nhập thông tin → Nhận kết quả qua Email</p>
      </div>

      {/* Method selector */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24}}>
        {methods.map(m=>(
          <div key={m.k} onClick={()=>{if(!sent){setMethod(m.k)}}} style={{
            background:method===m.k?`${T.gold}12`:T.card,
            border:method===m.k?`1.5px solid ${T.gold}44`:`1px solid ${T.border}`,
            borderRadius:14,padding:"16px 12px",cursor:sent?"default":"pointer",textAlign:"center",transition:"all 0.3s",
            boxShadow:method===m.k?`0 0 20px ${T.gold}11`:"none"
          }}>
            <div style={{fontSize:20,marginBottom:6}}>{m.icon}</div>
            <div style={{fontSize:12,fontWeight:700,color:method===m.k?T.gold:T.head,marginBottom:2}}>{m.label}</div>
            <div style={{fontSize:9.5,color:T.muted}}>{m.desc}</div>
            <div style={{fontSize:8,color:T.accent,fontWeight:700,marginTop:6,letterSpacing:1}}>MIỄN PHÍ</div>
          </div>
        ))}
      </div>

      {sent && res ? (
        /* INSTANT MINI RESULT */
        <div>
          {/* Profile card */}
          <Card style={{padding:24,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold}33,${T.accent}22)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🔮</div>
              <div style={{flex:1}}>
                <h2 style={{fontFamily:T.serif,fontSize:20,color:T.head}}>{res.name}</h2>
                <p style={{color:T.muted,fontSize:11}}>{day}/{month}/{year} • {res.data.t}</p>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:T.serif,fontSize:40,fontWeight:800,color:T.gold,lineHeight:1}}>{res.lp}</div>
                <div style={{fontSize:8,color:T.muted,letterSpacing:1.5}}>SỐ CHỦ ĐẠO</div>
              </div>
            </div>

            {/* Score bars */}
            {(scores[method]||scores.thanso).map((s,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:11.5,color:T.body}}>{s.l}</span>
                  <span style={{fontSize:11.5,color:s.c,fontWeight:700}}>{Math.min(s.v,98)}%</span>
                </div>
                <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(s.v,98)}%`,background:`linear-gradient(90deg,${s.c},${s.c}88)`,borderRadius:3,transition:"width 1.2s ease"}} />
                </div>
              </div>
            ))}
          </Card>

          {/* Quick insights */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            <Card style={{padding:"16px 14px"}}>
              <div style={{color:T.accent,fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:6}}>✦ ĐIỂM MẠNH</div>
              <p style={{color:T.body,fontSize:12,lineHeight:1.5}}>{res.data.s}</p>
            </Card>
            <Card style={{padding:"16px 14px"}}>
              <div style={{color:T.red,fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:6}}>⚡ LƯU Ý</div>
              <p style={{color:T.body,fontSize:12,lineHeight:1.5}}>{res.data.c}</p>
            </Card>
          </div>

          {/* Peak months */}
          {method==="tailoc" && <Card style={{padding:"16px 14px",marginBottom:16}}>
            <div style={{color:T.gold,fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:8}}>🔥 THÁNG VÀNG TÀI LỘC 2026</div>
            <div style={{display:"flex",gap:8}}>
              {peakM.map((m,i)=>(
                <div key={i} style={{flex:1,background:`${T.gold}10`,border:`1px solid ${T.gold}22`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                  <div style={{fontFamily:T.serif,fontSize:22,fontWeight:800,color:T.gold}}>T{m}</div>
                  <div style={{fontSize:8,color:T.muted}}>Peak</div>
                </div>
              ))}
            </div>
          </Card>}

          {/* Teaser — blurred content */}
          <Card style={{padding:"20px 18px",marginBottom:16,position:"relative",overflow:"hidden"}}>
            <div style={{color:T.gold,fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:10}}>📋 BÁO CÁO CHI TIẾT</div>
            <div style={{color:T.body,fontSize:12,lineHeight:1.6,filter:"blur(3px)",userSelect:"none"}}>
              Với số chủ đạo {res.lp} — "{res.data.t}", năm 2026 mang năng lượng đặc biệt cho bạn. Sự nghiệp phù hợp nhất: {res.data.w}. Chiến lược tài chính tối ưu: {res.data.f}. Hành động cụ thể theo từng tháng và bí thuật phong thủy cá nhân hóa...
            </div>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(10,15,28,0.5)",backdropFilter:"blur(2px)"}}>
              <div style={{textAlign:"center"}}>
                <span style={{fontSize:24}}>🔒</span>
                <p style={{color:T.gold,fontSize:12,fontWeight:700,marginTop:6}}>Chi tiết đầy đủ gửi qua Email</p>
              </div>
            </div>
          </Card>

          {/* Email confirmation */}
          <Card style={{padding:"24px 20px",textAlign:"center",background:`${T.accent}06`,border:`1px solid ${T.accent}18`}}>
            <p style={{color:T.head,fontSize:14,fontWeight:600,marginBottom:6}}>📧 Báo cáo đầy đủ đang được AI phân tích...</p>
            <p style={{color:T.body,fontSize:12.5,marginBottom:4}}>
              Gửi vào <strong style={{color:T.accent}}>{email}</strong> sau <strong style={{color:T.accent}}>2-3 phút</strong>
            </p>
            <p style={{color:T.muted,fontSize:11}}>Kiểm tra <strong style={{color:T.orange}}>Rác/Spam</strong> nếu không thấy</p>
          </Card>

          {/* Try another */}
          <div style={{textAlign:"center",marginTop:20}}>
            <p style={{color:T.muted,fontSize:11,marginBottom:12}}>Thử phương pháp khác:</p>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              {methods.filter(m=>m.k!==method).map(m=>(
                <Pill key={m.k} ghost small onClick={()=>{setSent(false);setRes(null);setMethod(m.k);setName("");setDay("");setMonth("");setYear("");setEmail("")}}>
                  {m.icon} {m.label}
                </Pill>
              ))}
              <Pill onClick={()=>go("home")} small ghost>← Trang Chủ</Pill>
            </div>
          </div>
        </div>
      ) : (
        /* Form */
        <Card style={{padding:28}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20,paddingBottom:14,borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:18}}>{methods.find(m=>m.k===method)?.icon}</span>
            <span style={{fontFamily:T.serif,fontSize:16,color:T.gold,fontWeight:600}}>{methods.find(m=>m.k===method)?.label}</span>
            <span style={{fontSize:9,color:T.accent,fontWeight:700,marginLeft:"auto",letterSpacing:1}}>MIỄN PHÍ</span>
          </div>
          <label style={{display:"block",fontSize:10.5,color:T.muted,marginBottom:6,letterSpacing:1.5}}>HỌ VÀ TÊN</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nguyen Van An" style={{...inp,marginBottom:16}} />
          <label style={{display:"block",fontSize:10.5,color:T.muted,marginBottom:6,letterSpacing:1.5}}>SỐ ĐIỆN THOẠI</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0901 234 567" type="tel" style={{...inp,marginBottom:16}} />
          <label style={{display:"block",fontSize:10.5,color:T.muted,marginBottom:6,letterSpacing:1.5}}>NGÀY SINH (DƯƠNG LỊCH)</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
            {[[day,setDay,"Ngày"],[month,setMonth,"Tháng"],[year,setYear,"Năm"]].map(([v,s,p],i)=><input key={i} value={v} onChange={e=>s(e.target.value)} placeholder={p} type="number" style={{...inp,textAlign:"center"}} />)}
          </div>
          <label style={{display:"block",fontSize:10.5,color:T.muted,marginBottom:6,letterSpacing:1.5}}>EMAIL (NHẬN KẾT QUẢ)</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{...inp,marginBottom:20}} />
          <Pill onClick={submit} glow style={{width:"100%",justifyContent:"center",padding:"16px",fontSize:15}}>
            {method==="tailoc"?"🔥":"✦"} Nhận Kết Quả Qua Email →
          </Pill>
          <p style={{color:T.dim,fontSize:10,textAlign:"center",marginTop:10}}>Kết quả gửi qua email trong 2-3 phút • Bảo mật 100%</p>
        </Card>
      )}
    </div>
  </div>
};

// ========== DICH VU PAGE ==========
const DichVu=({go})=>{
  const px="clamp(20px,5vw,80px)";const mx=1140;
  return <div style={{paddingTop:100,minHeight:"100vh"}}>
    <Sec style={{padding:`40px ${px}`,maxWidth:mx,margin:"0 auto",textAlign:"center"}}>
      <Tag>Công Cụ Hỗ Trợ</Tag>
      <h1 style={{fontFamily:T.serif,fontSize:"clamp(32px,4vw,48px)",color:T.head,marginTop:16,marginBottom:8}}>Công Cụ Theo Tình Huống</h1>
      <p style={{color:T.muted,fontSize:14,marginBottom:48}}>Giải pháp thực tế cho các vấn đề cụ thể trong cuộc sống</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,textAlign:"center"}}>
        {[
          {i:"❤️",c:T.red,t:"Xem Hợp Tuổi",s:"TÌNH CẢM & ĐỐI TÁC",d:"Đánh giá mức độ hòa hợp trong tình yêu hoặc hợp tác kinh doanh. Nhận diện điểm chung & dung hòa."},
          {i:"📅",c:T.accent,t:"Xem Ngày Tốt",s:"CHỌN THỜI ĐIỂM",d:"Lên kế hoạch sự kiện quan trọng: cưới hỏi, khai trương, xuất hành."},
          {i:"🌙",c:T.blue,t:"Lịch Vạn Niên",s:"NĂNG LƯỢNG NGÀY",d:"Tra cứu ngày âm, tiết khí và năng lượng cát hung hàng ngày."},
          {i:"👶",c:T.gold,t:"Đặt Tên Cho Con",s:"HUYỀN HỌC + AI",d:"Chọn tên hợp mệnh, hợp ngũ hành, hợp tuổi cha mẹ. AI phân tích ý nghĩa & năng lượng."},
          {i:"🏢",c:T.orange,t:"Đặt Tên Doanh Nghiệp",s:"THƯƠNG HIỆU & VẬN KHÍ",d:"Tên công ty hợp phong thủy, hợp mệnh chủ, hợp ngành nghề."},
          {i:"🔥",c:"#FF6B6B",t:"Bí Thuật Gia Tăng Tài Lộc 2026",s:"ĐẶC BIỆT",d:"Phương pháp kích hoạt tài lộc theo đúng tên tuổi & mệnh của bạn."},
        ].map((c,i)=>(
          <Card key={i} glow={c.c} style={{padding:"32px 24px",cursor:"pointer"}}>
            <div style={{fontSize:32,marginBottom:14}}>{c.i}</div>
            <h3 style={{fontFamily:T.serif,fontSize:19,color:T.head,marginBottom:4}}>{c.t}</h3>
            <div style={{fontSize:10,color:c.c,letterSpacing:2,fontWeight:700,marginBottom:14}}>{c.s}</div>
            <p style={{fontSize:13,color:T.body,lineHeight:1.7}}>{c.d}</p>
            <Pill onClick={()=>go("thanso")} small ghost style={{marginTop:16}}>Trải Nghiệm →</Pill>
          </Card>
        ))}
      </div>
    </Sec>
  </div>
};

// ========== APP ==========
export default function App(){
  const[page,setPage]=useState("home");
  const go=p=>{setPage(p);window.scrollTo({top:0,behavior:"smooth"})};
  return <div style={{minHeight:"100vh",background:`linear-gradient(180deg,${T.bg} 0%,${T.bg2} 50%,${T.bg} 100%)`,color:T.head,fontFamily:T.sans}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700;800&family=Ma+Shan+Zheng&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      ::selection{background:rgba(0,212,170,0.2);color:#E8E4F0}
      input::placeholder{color:rgba(255,255,255,0.18)}
      input:focus{border-color:${T.accent}55 !important;box-shadow:0 0 0 3px ${T.accent}11}
      button{transition:all 0.25s;font-family:'DM Sans',sans-serif} button:hover{opacity:0.88;transform:translateY(-1px)}
      ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:${T.bg}} ::-webkit-scrollbar-thumb{background:${T.accent}22;border-radius:2px}
      @media(max-width:768px){table{font-size:11px!important}}
    `}</style>
    <Nav go={go} page={page} />
    {page==="home"&&<Home go={go}/>}
    {page==="thanso"&&<ThanSo go={go}/>}
    {page==="dichvu"&&<DichVu go={go}/>}
    {page==="pricing"&&<Home go={go}/>}
  </div>
}
