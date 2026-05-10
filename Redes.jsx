import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   CONFIGURACIÓN  — XposedOrNot (open source, sin API key)
═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
DATOS
═══════════════════════════════════════════════════ */
const QUESTIONS = [
{
emoji: "🌐",
text: "¿Cómo tienes configurado tu perfil principal en redes?",
hint: "Instagram, TikTok, X, Facebook…",
options: [
{ text: "Público", detail: "Cualquier persona en el mundo puede verlo", value: 2 },
{ text: "Semi-público", detail: "Algunas cosas visibles, otras no", value: 1 },
{ text: "Privado 🔒", detail: "Solo quienes yo apruebo pueden verlo", value: 0 },
],
},
{
emoji: "📍",
text: "¿Con qué frecuencia etiquetas ubicaciones o haces check-in?",
hint: "Restaurantes, campus, viajes, eventos…",
options: [
{ text: "Frecuentemente", detail: "Es parte de cómo comparto mi vida", value: 2 },
{ text: "A veces", detail: "Solo en ocasiones especiales", value: 1 },
{ text: "Casi nunca", detail: "Prefiero no revelar dónde estoy", value: 0 },
],
},
{
emoji: "🪪",
text: "¿Usas el mismo nombre de usuario en varias redes?",
hint: "",
options: [
{ text: "Sí, siempre", detail: "Es más fácil para que me encuentren", value: 2 },
{ text: "En algunas", detail: "Depende de la red", value: 1 },
{ text: "No, todos distintos", detail: "Mantengo identidades separadas", value: 0 },
],
},
{
emoji: "📋",
text: "¿Llenas formularios en línea con tu nombre real y correo?",
hint: "Apps, concursos, descuentos, suscripciones…",
options: [
{ text: "Con frecuencia", detail: "No le doy mucha importancia", value: 2 },
{ text: "Pocas veces", detail: "Solo cuando es indispensable", value: 1 },
{ text: "Casi nunca", detail: "Uso un correo alternativo para eso", value: 0 },
],
},
{
emoji: "📸",
text: "¿Has publicado fotos donde se ve tu escuela, trabajo o colonia?",
hint: "",
options: [
{ text: "Sí, muchas veces", detail: "Suelo mostrar mi entorno cotidiano", value: 2 },
{ text: "Alguna vez", detail: "Sin pensarlo mucho en ese momento", value: 1 },
{ text: "Lo evito", detail: "Cuido lo que aparece de fondo", value: 0 },
],
},
{
emoji: "💬",
text: "¿Quién puede ver tu foto y descripción de WhatsApp?",
hint: "",
options: [
{ text: "Cualquier persona", detail: "Mi perfil está completamente abierto", value: 2 },
{ text: "No lo sé", detail: "Nunca he revisado esa configuración", value: 1 },
{ text: "Solo mis contactos", detail: "Lo tengo configurado en privado", value: 0 },
],
},
{
emoji: "🕰️",
text: "¿Tienes cuentas antiguas activas que ya no usas?",
hint: "Ask.fm, Tumblr, musical.ly, Vine, Snapchat…",
options: [
{ text: "Sí, varias", detail: "Por olvido o porque no recuerdo la clave", value: 2 },
{ text: "Una o dos", detail: "Creo que sí, no estoy seguro/a", value: 1 },
{ text: "No, las elimino", detail: "Tengo control de todas mis cuentas", value: 0 },
],
},
{
emoji: "🤖",
text: "¿Sabes qué datos recopila tu red social favorita sobre ti?",
hint: "",
options: [
{ text: "No tengo idea", detail: "Nunca me he puesto a leer eso", value: 2 },
{ text: "Algo, pero poco", detail: "He visto cosas pero no a detalle", value: 1 },
{ text: "Sí, lo reviso", detail: "Conozco mis ajustes de privacidad", value: 0 },
],
},
{
emoji: "🗺️",
text: "¿Podría alguien deducir tu rutina diaria revisando tus redes?",
hint: "Horarios, lugares frecuentes, personas cercanas…",
options: [
{ text: "Fácilmente", detail: "Mi día a día es bastante visible", value: 2 },
{ text: "Con bastante esfuerzo", detail: "Habría que conectar muchos puntos", value: 1 },
{ text: "Sería muy difícil", detail: "No doy suficientes pistas", value: 0 },
],
},
];

const LEVELS = [
{ min: 0,  max: 4,  label: "Ninja Digital", emoji: "🥷", color: "#059669", bg: "#ECFDF5", border: "#6EE7B7", desc: "Tu huella digital es notablemente discreta. Eres de los pocos que realmente piensa antes de publicar." },
{ min: 5,  max: 9,  label: "Consciente",    emoji: "🧭", color: "#D97706", bg: "#FFFBEB", border: "#FCD34D", desc: "Tienes buena conciencia digital, aunque hay áreas donde podrías reducir tu exposición fácilmente." },
{ min: 10, max: 13, label: "Visible",        emoji: "👁️", color: "#EA580C", bg: "#FFF7ED", border: "#FDBA74", desc: "Tu presencia digital es amplia. Algoritmos, empresas y personas pueden rastrearte con facilidad." },
{ min: 14, max: 18, label: "Libro Abierto",  emoji: "📖", color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5", desc: "Tu huella digital es muy extensa. Cualquiera con acceso básico a internet puede construir un perfil detallado tuyo." },
];

const getLevel = (s) => LEVELS.find((l) => s >= l.min && s <= l.max) || LEVELS[3];

/* ═══════════════════════════════════════════════════
ESTILOS GLOBALES
═══════════════════════════════════════════════════ */
function useStyles() {
useEffect(() => {
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap";
document.head.appendChild(link);

const s = document.createElement("style");
s.id = "hd-styles";
s.textContent = `
  *{box-sizing:border-box;}
  body{margin:0;padding:0;font-family:'Sora',-apple-system,sans-serif;background:#E8E6FF;}

  @keyframes fadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideIn {from{opacity:0;transform:translateX(34px)}to{opacity:1;transform:translateX(0)}}
  @keyframes float   {0%,100%{transform:translateY(0)}50%{transform:translateY(-11px)}}
  @keyframes orb     {to{transform:rotate(360deg)}}
  @keyframes pulse   {0%{transform:scale(.9);opacity:.9}100%{transform:scale(2.8);opacity:0}}
  @keyframes spinEl  {to{transform:rotate(360deg)}}
  @keyframes pop     {0%{opacity:0;transform:scale(.4)}60%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
  @keyframes shimmer {0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes shake   {0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}

  .fu {animation:fadeUp .55s cubic-bezier(.16,1,.3,1) both}
  .fu1{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) .08s both}
  .fu2{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) .16s both}
  .fu3{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) .24s both}
  .fu4{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) .32s both}
  .fu5{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) .40s both}
  .fu6{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) .50s both}
  .fu7{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) .60s both}
  .si {animation:slideIn .45s cubic-bezier(.16,1,.3,1) both}
  .fl {animation:float 3.2s ease-in-out infinite}
  .pop{animation:pop .45s cubic-bezier(.34,1.56,.64,1) both}

  .opt{width:100%;background:white;border:2px solid #EAEAF6;border-radius:18px;padding:15px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;text-align:left;transition:all .2s ease;font-family:'Sora',sans-serif;margin-bottom:10px;}
  .opt:hover{border-color:#A5B4FC;background:#F8F7FF;transform:translateX(4px);box-shadow:0 4px 16px rgba(99,102,241,.11)}
  .opt.sel{border-color:#4F46E5;background:linear-gradient(135deg,#EEF2FF,#F5F3FF);box-shadow:0 6px 24px rgba(79,70,229,.18);transform:translateX(4px)}

  .btn{width:100%;background:linear-gradient(135deg,#4F46E5 0%,#6D28D9 100%);color:white;border:none;border-radius:100px;padding:17px 24px;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;letter-spacing:-.2px;cursor:pointer;transition:all .2s ease;box-shadow:0 8px 28px rgba(79,70,229,.38);display:flex;align-items:center;justify-content:center;gap:8px;}
  .btn:hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(79,70,229,.46)}
  .btn:active{transform:translateY(0)}
  .btn:disabled{opacity:.32;cursor:not-allowed;transform:none;box-shadow:none}

  .ghost-btn{background:none;border:2px solid #E0E0F0;border-radius:100px;padding:13px 20px;font-family:'Sora',sans-serif;font-size:13px;font-weight:600;color:#9CA3AF;cursor:pointer;transition:all .2s ease;width:100%;display:flex;align-items:center;justify-content:center;gap:6px;}
  .ghost-btn:hover{border-color:#C7D2FE;color:#4F46E5;background:#F5F3FF}

  .card{background:rgba(255,255,255,.9);backdrop-filter:blur(20px);border:1.5px solid rgba(255,255,255,.95);border-radius:26px;box-shadow:0 4px 30px rgba(79,70,229,.07),0 1px 0 rgba(255,255,255,1) inset;}
  .insight{background:white;border:1.5px solid #F0F0FA;border-radius:18px;padding:16px 18px;display:flex;align-items:flex-start;gap:13px;box-shadow:0 2px 12px rgba(0,0,0,.035);margin-bottom:10px;}
  .breach-item{background:white;border:1.5px solid #FEE2E2;border-radius:14px;padding:13px 16px;margin-bottom:8px;display:flex;align-items:flex-start;gap:12px;}

  .email-input{width:100%;background:white;border:2px solid #EAEAF6;border-radius:16px;padding:16px 18px;font-family:'Sora',sans-serif;font-size:15px;color:#1E1B4B;outline:none;transition:all .2s ease;}
  .email-input:focus{border-color:#4F46E5;box-shadow:0 0 0 4px rgba(79,70,229,.1)}
  .email-input::placeholder{color:#C4C4D4}
  .email-input.err{animation:shake .3s ease;border-color:#EF4444!important}

  .tag{background:white;border:1.5px solid #E9EAFF;border-radius:100px;padding:6px 14px;font-size:12px;font-weight:600;color:#4338CA;box-shadow:0 2px 8px rgba(79,70,229,.07);}
  .progress-bar{height:4px;background:#EAEAF8;border-radius:100px;overflow:hidden;margin-bottom:14px}
  .progress-fill{height:100%;background:linear-gradient(90deg,#4F46E5,#7C3AED);border-radius:100px;transition:width .4s ease}
  .scroll-wrap{overflow-y:auto;-webkit-overflow-scrolling:touch}
  .scroll-wrap::-webkit-scrollbar{display:none}
  .shimmer-text{background:linear-gradient(90deg,#4F46E5 0%,#A78BFA 40%,#4F46E5 80%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 2.4s linear infinite;}
`;
document.head.appendChild(s);
return () => { document.head.removeChild(s); };
}, []);
}

/* ═══════════════════════════════════════════════════
   XposedOrNot API  — open source, sin API key
   https://xposedornot.com/api_doc
═══════════════════════════════════════════════════ */
async function checkBreaches(email) {
  try {
    const res = await fetch(
      `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`
    );
    if (res.status === 404) return [];
    if (!res.ok) return null;
    const data = await res.json();
    if (data.Error === "Not found") return [];
    // Normalizar la respuesta a un formato uniforme
    const details = data.ExposedBreaches?.breaches_details || [];
    const riskInfo = data.BreachMetrics?.risk?.[0] || {};
    return {
      breaches: details.map((b) => ({
        Title: b.breach || b.domain,
        BreachDate: b.xposed_date || "?",
        DataClasses: (b.xposed_data || "").split(";").map((s) => s.trim()).filter(Boolean),
        Domain: b.domain || "",
        Industry: b.industry || "",
        Records: b.xposed_records || 0,
        PasswordRisk: b.password_risk || "unknown",
      })),
      riskScore: riskInfo.risk_score ?? null,
      riskLabel: riskInfo.risk_label ?? null,
    };
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════
AI  — sintetiza quiz + filtraciones reales
═══════════════════════════════════════════════════ */
async function fetchInsights(score, answers, breaches) {
try {
const quizSummary = QUESTIONS.map((q, i) => {
const picked = q.options.find((o) => o.value === answers[i]);
return `• ${q.text} → ${picked?.text || "—"}`;
}).join("\n");

const breachList = breaches?.breaches || breaches;
const isArray = Array.isArray(breachList);
const breachContext =
  breaches === null
    ? "No fue posible verificar filtraciones (error de red)."
    : (isArray && breachList.length === 0) || (!isArray && (!breachList || breachList.length === 0))
    ? "Su correo NO apareció en ninguna filtración de datos conocida. ✓"
    : `Su correo apareció en ${breachList.length} filtraciones reales (Riesgo: ${breaches?.riskLabel || "N/A"}, Score: ${breaches?.riskScore ?? "N/A"}):\n${breachList.slice(0, 6).map((b) => `  - ${b.Title} (${b.BreachDate || "?"}) — datos: ${(b.DataClasses || []).slice(0, 3).join(", ")}`).join("\n")}`;

const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 900,
    system: `Eres experto en privacidad digital para jóvenes universitarios en México.
Responde ÚNICAMENTE con JSON válido sin backticks:
{"insights":["texto1","texto2","texto3"]}
Reglas:

- Sintetiza AMBAS fuentes: hábitos del quiz Y filtraciones reales.
- Si hay filtraciones, menciona al menos una específicamente por nombre.
- Máximo 2 oraciones por insight. Tuteo informal. Impactar sin alarmar.
- El tercer insight debe ser una acción concreta ejecutable esta semana.`, messages: [{ role: "user", content: `Universitario en México. Puntaje de huella digital: ${score}/18.\n\nHábitos:\n${quizSummary}\n\nFiltraciones:\n${breachContext}\n\nGenera 3 insights que conecten ambas fuentes.`,
  }],
  }),
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || "{}";
  return JSON.parse(text).insights || fallbackInsights(score, breaches);
  } catch {
  return fallbackInsights(score, breaches);
  }
  }

function fallbackInsights(score, breaches) {
  const breachList = breaches?.breaches || breaches;
  const hasBreaches = breachList && Array.isArray(breachList) && breachList.length > 0;
  if (hasBreaches) return [
    `Tu correo apareció en ${breachList.length} filtraciones reales. Combinado con tus hábitos actuales, tu exposición digital es concreta y verificable, no solo teórica.`,
  "Las filtraciones antiguas siguen siendo útiles para atacantes porque la mayoría de personas reutiliza contraseñas en múltiples servicios.",
  "Acción esta semana: activa verificación en dos pasos en tu correo principal — son 5 minutos que cambian mucho.",
  ];
  if (score <= 6) return [
  "Tu configuración es más cuidadosa que la mayoría, aunque los metadatos (hora, dispositivo, IP) también construyen una huella invisible.",
  "Incluso sin publicar mucho, las apps recopilan en segundo plano: ubicación, contactos, micrófono y patrones de uso.",
  "Acción esta semana: revisa qué apps tienen acceso a tu ubicación en segundo plano en tu celular.",
  ];
  return [
  "Tus hábitos permiten que alguien externo construya un mapa bastante preciso de tu vida cotidiana sin que lo sepas.",
  "Los datos que compartes voluntariamente y los que se filtran sin tu consentimiento se combinan creando un perfil más completo de lo que imaginas.",
  "Acción esta semana: pon en privado tu perfil principal y revisa qué apps de terceros tienen acceso a tus redes.",
  ];
}

/* ═══════════════════════════════════════════════════
PANTALLA: BIENVENIDA
═══════════════════════════════════════════════════ */
function Welcome({ onStart }) {
return (
<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "44px 24px", textAlign: "center", position: "relative" }}>
<div style={{ position: "absolute", top: 50, left: -50, width: 220, height: 220, background: "radial-gradient(circle,rgba(167,139,250,.22) 0%,transparent 70%)", pointerEvents: "none" }} />
<div style={{ position: "absolute", bottom: 80, right: -50, width: 260, height: 260, background: "radial-gradient(circle,rgba(99,102,241,.16) 0%,transparent 70%)", pointerEvents: "none" }} />

  <div className="fl" style={{ fontSize: 76, lineHeight: 1, marginBottom: 6, position: "relative" }}>🔍</div>

  <div className="fu" style={{ display: "inline-block", background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", border: "1.5px solid #C7D2FE", borderRadius: 100, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#4F46E5", letterSpacing: 1, textTransform: "uppercase", marginTop: 18, marginBottom: 14, position: "relative" }}>
    Universidad Marista de Mérida
  </div>

  <h1 className="fu1" style={{ fontSize: 36, fontWeight: 800, color: "#1E1B4B", lineHeight: 1.18, letterSpacing: -1.4, margin: "0 0 14px", position: "relative" }}>
    ¿Cuánto sabe<br />internet <span className="shimmer-text">de ti?</span>
  </h1>

  <p className="fu2" style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.68, maxWidth: 285, margin: "0 auto 28px", position: "relative" }}>
    Descubre tu huella digital en <strong>3 minutos</strong>. Verificación real de filtraciones + análisis personalizado con IA.
  </p>

  <div className="fu3" style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 36, position: "relative" }}>
    {[{ i: "⏱️", l: "3 minutos" }, { i: "❓", l: "9 preguntas" }, { i: "🔓", l: "Verificación real" }, { i: "✦", l: "IA personalizada" }].map(t => (
      <span key={t.l} className="tag">{t.i} {t.l}</span>
    ))}
  </div>

  <div className="fu4" style={{ width: "100%", maxWidth: 320, position: "relative" }}>
    <button className="btn" onClick={onStart}>Descubrir mi huella digital →</button>
  </div>

  <p className="fu5" style={{ fontSize: 11, color: "#B0B8CC", marginTop: 18, lineHeight: 1.6, position: "relative" }}>
    No almacenamos tus respuestas ni tu correo.<br />Todo se analiza en tiempo real.
  </p>
</div>
);
}

/* ═══════════════════════════════════════════════════
PANTALLA: QUIZ
═══════════════════════════════════════════════════ */
function Quiz({ index, total, onAnswer }) {
const [sel, setSel] = useState(null);
const q = QUESTIONS[index];
const pct = (index / total) * 100;

return (
<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingBottom: 36 }}>
<div style={{ padding: "24px 22px 16px" }}>
<div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
<div style={{ display: "flex", justifyContent: "space-between" }}>
<span style={{ fontSize: 13, fontWeight: 700, color: "#4F46E5" }}>{index + 1} <span style={{ color: "#CBD5E1" }}>/</span> {total}</span>
<span style={{ fontSize: 11, fontWeight: 600, color: "#B0B8CC", letterSpacing: .8, textTransform: "uppercase" }}>Huella Digital</span>
</div>
</div>

  <div className="si" style={{ padding: "0 20px", flex: 1, display: "flex", flexDirection: "column" }}>
    <div className="card" style={{ padding: "26px 22px", marginBottom: 18 }}>
      <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 14 }}>{q.emoji}</div>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1E1B4B", lineHeight: 1.38, letterSpacing: -.4, margin: 0 }}>{q.text}</h2>
      {q.hint && <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 7, marginBottom: 0 }}>{q.hint}</p>}
    </div>

    <div style={{ flex: 1 }}>
      {q.options.map((opt, i) => (
        <button key={i} className={`opt${sel === i ? " sel" : ""}`} onClick={() => setSel(i)}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, border: `2.5px solid ${sel === i ? "#4F46E5" : "#D1D5DB"}`, background: sel === i ? "#4F46E5" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .18s" }}>
            {sel === i && <div style={{ width: 7, height: 7, background: "white", borderRadius: "50%" }} />}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1F2937", letterSpacing: -.2 }}>{opt.text}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{opt.detail}</div>
          </div>
        </button>
      ))}
    </div>

    <div style={{ marginTop: 8 }}>
      <button className="btn" disabled={sel === null} onClick={() => onAnswer(q.options[sel].value)}>
        {index < total - 1 ? "Siguiente →" : "Casi listo →"}
      </button>
    </div>
  </div>
</div>
);
}

/* ═══════════════════════════════════════════════════
   PANTALLA: CORREO (XposedOrNot)
═══════════════════════════════════════════════════ */
function EmailCheck({ onSubmit, onSkip }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState(false);

  const handleSubmit = () => {
    const valid = /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email.trim());
    if (!valid) { setErr(true); setTimeout(() => setErr(false), 700); return; }
    onSubmit(email.trim());
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div className="fu" style={{ fontSize: 62, lineHeight: 1, marginBottom: 16 }}>🔓</div>

        <div className="fu1" style={{ display: "inline-block", background: "#EEF2FF", border: "1.5px solid #C7D2FE", borderRadius: 100, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#4F46E5", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
          Paso final
        </div>

        <h2 className="fu2" style={{ fontSize: 24, fontWeight: 800, color: "#1E1B4B", letterSpacing: -.8, margin: "0 0 12px" }}>
          ¿Tu correo apareció<br />en alguna filtración real?
        </h2>

        <p className="fu3" style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.68, margin: "0 auto", maxWidth: 300 }}>
          Lo verificamos en tiempo real con XposedOrNot, una plataforma open source de referencia en ciberseguridad. La IA usará ese resultado para personalizar tu análisis.
        </p>
      </div>

      <div className="fu4" style={{ marginBottom: 12 }}>
        <input
          className={`email-input${err ? " err" : ""}`}
          type="email"
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        {err && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 6, marginLeft: 4 }}>Ingresa un correo válido</p>}
      </div>

      <div className="fu5" style={{ marginBottom: 10 }}>
        <button className="btn" onClick={handleSubmit}>
          Verificar y analizar →
        </button>
      </div>

      <div className="fu6" style={{ marginBottom: 20 }}>
        <button className="ghost-btn" onClick={onSkip}>Saltar este paso</button>
      </div>

      <div className="fu7" style={{ background: "#F8F7FF", border: "1.5px solid #E0E0F4", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>🔒</span>
        <p style={{ margin: 0, fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
          Tu correo se consulta de forma segura a través de XposedOrNot, una plataforma open source. No lo almacenamos ni compartimos. Solo verificamos si aparece en bases de datos de filtraciones conocidas.
        </p>
      </div>
    </div>
);
}

/* ═══════════════════════════════════════════════════
   PANTALLA: CALCULANDO
═══════════════════════════════════════════════════ */
function Calculating({ checkingBreaches }) {
  const [step, setStep] = useState(0);
  const msgs = checkingBreaches
    ? ["Verificando filtraciones de datos…", "Consultando XposedOrNot…", "La IA analiza tu perfil completo…", "Generando tu resultado…"]
    : ["Analizando tus hábitos digitales…", "Evaluando tu exposición…", "La IA procesa tu perfil…", "Generando tu resultado…"];

useEffect(() => {
const t = setInterval(() => setStep((s) => Math.min(s + 1, msgs.length - 1)), 1000);
return () => clearInterval(t);
}, []);

return (
<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", background: "linear-gradient(155deg,#1E1B4B 0%,#312E81 100%)" }}>
<div style={{ position: "relative", width: 140, height: 140, marginBottom: 44 }}>
<div style={{ position: "absolute", top: "50%", left: "50%", width: 78, height: 78, marginTop: -39, marginLeft: -39, borderRadius: "50%", border: "2px solid rgba(167,139,250,.3)", animation: "pulse 2.3s ease-out infinite" }} />
<div style={{ position: "absolute", top: "50%", left: "50%", width: 78, height: 78, marginTop: -39, marginLeft: -39, borderRadius: "50%", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, boxShadow: "0 8px 32px rgba(79,70,229,.55)", transition: "all .4s" }}>
{step < 2 ? "🔍" : "🤖"}
</div>
<div style={{ position: "absolute", top: "50%", left: "50%", width: 132, height: 132, marginTop: -66, marginLeft: -66, animation: "orb 2s linear infinite", transformOrigin: "center" }}>
<div style={{ position: "absolute", top: 0, left: "50%", width: 13, height: 13, borderRadius: "50%", background: "#A78BFA", marginLeft: -6.5, marginTop: -6.5, boxShadow: "0 0 10px #A78BFA" }} />
</div>
<div style={{ position: "absolute", top: "50%", left: "50%", width: 110, height: 110, marginTop: -55, marginLeft: -55, animation: "orb 3.2s linear infinite reverse", transformOrigin: "center" }}>
<div style={{ position: "absolute", top: 0, left: "50%", width: 9, height: 9, borderRadius: "50%", background: "#818CF8", marginLeft: -4.5, marginTop: -4.5 }} />
</div>
</div>

  <p style={{ fontSize: 17, fontWeight: 600, color: "white", letterSpacing: -.3, marginBottom: 8 }}>{msgs[step]}</p>
  <p style={{ fontSize: 13, color: "rgba(255,255,255,.38)", marginBottom: 44 }}>Esto solo tardará un momento</p>
  <div style={{ display: "flex", gap: 8 }}>
    {msgs.map((_, i) => (
      <div key={i} style={{ height: 8, borderRadius: 100, width: i <= step ? 28 : 8, background: i <= step ? "#818CF8" : "rgba(255,255,255,.18)", transition: "all .4s ease" }} />
    ))}
  </div>
</div>
);
}

/* ═══════════════════════════════════════════════════
PANTALLA: RESULTADOS
═══════════════════════════════════════════════════ */
function Results({ score, level, insights, loadingAI, breaches, onRestart }) {
const [animPct, setAnimPct] = useState(0);
const ARC = 251.3;

useEffect(() => {
const duration = 1700, target = score / 18, start = Date.now();
const tick = () => {
const t = Math.min((Date.now() - start) / duration, 1);
setAnimPct((1 - Math.pow(1 - t, 3)) * target);
if (t < 1) requestAnimationFrame(tick);
};
const timer = setTimeout(() => requestAnimationFrame(tick), 350);
return () => clearTimeout(timer);
}, [score]);

const fill = animPct * ARC;
const pctDisplay = Math.round(animPct * 100);
  const breachList = breaches?.breaches || (Array.isArray(breaches) ? breaches : null);
  const hasBreachData = breachList !== null;
  const breachCount = hasBreachData ? breachList.length : 0;
  const riskLabel = breaches?.riskLabel || null;
  const riskScore = breaches?.riskScore ?? null;

return (
<div className="scroll-wrap" style={{ minHeight: "100vh", padding: "32px 20px 64px" }}>

  <div className="fu" style={{ textAlign: "center", marginBottom: 22 }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: "#4F46E5", letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 6 }}>Tu resultado</div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1E1B4B", letterSpacing: -1.1, margin: 0 }}>Huella Digital</h2>
  </div>

  <div className="fu1 card" style={{ padding: "28px 22px 26px", marginBottom: 16, textAlign: "center" }}>
    <svg viewBox="0 0 200 140" style={{ width: "100%", maxWidth: 220, display: "block", margin: "0 auto" }}>
      {/* Arco invertido: curva hacia arriba */}
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#EAEAF6" strokeWidth="13" strokeLinecap="round" />
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={level.color} strokeWidth="13" strokeLinecap="round" strokeDasharray={`${fill.toFixed(2)} 999`} />
      {/* Textos debajo del arco */}
      <text x="100" y="122" textAnchor="middle" style={{ fontFamily: "Sora,sans-serif", fontSize: 32, fontWeight: 800, fill: "#1E1B4B" }}>{pctDisplay}%</text>
      <text x="100" y="139" textAnchor="middle" style={{ fontFamily: "Sora,sans-serif", fontSize: 10, fill: "#9CA3AF", fontWeight: 500, letterSpacing: .5 }}>VISIBILIDAD</text>
    </svg>

    <div className="pop" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: level.bg, border: `1.5px solid ${level.border}`, color: level.color, padding: "9px 22px", borderRadius: 100, fontSize: 15, fontWeight: 700, marginTop: 16, marginBottom: 14 }}>
      <span>{level.emoji}</span><span>{level.label}</span>
    </div>
    <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.68, margin: 0 }}>{level.desc}</p>
  </div>

  {hasBreachData && (
    <div className="fu2 card" style={{ padding: "20px", marginBottom: 16 }}>
      {breachCount === 0 ? (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>✅</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#059669", marginBottom: 3 }}>Sin filtraciones encontradas</div>
            <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.55 }}>Tu correo no aparece en ninguna base de datos filtrada conocida — una buena señal.</div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ background: "#FEF2F2", color: "#DC2626", borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 700, display: "inline-block" }}>
              ⚠️ {breachCount} {breachCount === 1 ? "filtración detectada" : "filtraciones detectadas"}
            </div>
          </div>
          {riskLabel && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "8px 14px", background: "#FFF7ED", border: "1.5px solid #FDBA74", borderRadius: 12 }}>
              <span style={{ fontSize: 14 }}>📊</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#9A3412" }}>Nivel de riesgo: {riskLabel} {riskScore !== null ? `(${riskScore}/10)` : ""}</span>
            </div>
          )}
          {breachList.slice(0, 5).map((b, i) => (
            <div key={i} className="breach-item">
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF1F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🔴</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937" }}>{b.Title}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                  {b.BreachDate || "?"} · {(b.DataClasses || []).slice(0, 3).join(" · ")}
                </div>
                {b.Industry && <div style={{ fontSize: 10, color: "#A78BFA", marginTop: 2 }}>{b.Industry}</div>}
              </div>
            </div>
          ))}
          {breachCount > 5 && (
            <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", margin: "6px 0 0" }}>
              + {breachCount - 5} más en xposedornot.com
            </p>
          )}
        </>
      )}
    </div>
  )}

  <div className="fu3" style={{ marginBottom: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,#E0E0F4)" }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: "#4F46E5", letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>✦ Análisis con IA</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,#E0E0F4,transparent)" }} />
    </div>
    <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 14, textAlign: "center" }}>
      {hasBreachData && breachCount > 0
        ? "La IA cruzó tus hábitos con las filtraciones reales encontradas"
        : "La IA analizó tus hábitos digitales y generó recomendaciones"}
    </p>

    {loadingAI ? (
      <div style={{ textAlign: "center", padding: "28px 0", color: "#B0B8CC" }}>
        <div style={{ fontSize: 28, marginBottom: 10, display: "inline-block", animation: "spinEl 1.3s linear infinite" }}>⏳</div>
        <p style={{ margin: 0, fontSize: 13 }}>Generando análisis personalizado…</p>
      </div>
    ) : (
      insights?.map((text, i) => (
        <div key={i} className={`insight fu${i + 4}`}>
          <span style={{ fontSize: 19, flexShrink: 0, lineHeight: 1.45 }}>{["⚠️", "🔍", "✅"][i]}</span>
          <p style={{ margin: 0, fontSize: 13.5, color: "#374151", lineHeight: 1.68 }}>{text}</p>
        </div>
      ))
    )}
  </div>

  <div className="fu6">
    <div style={{ background: "linear-gradient(160deg,#EEF2FF 0%,#F5F0FF 50%,#EFF6FF 100%)", border: "1.5px solid #C7D2FE", borderRadius: 26, padding: "30px 24px", marginBottom: 20 }}>
      <div style={{ fontSize: 28, marginBottom: 16, textAlign: "center" }}>📚</div>

      <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.78, margin: "0 0 14px" }}>
        Lo que acabas de vivir en estos minutos es exactamente lo que la materia propone como punto de partida: tomar conciencia de que tu vida digital ya existe, la hayas construido conscientemente o no. Pero el análisis no termina aquí.
      </p>

      <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.78, margin: "0 0 14px" }}>
        En <strong>Redes Sociales y Cultura Digital</strong> no vas a aprender a usar Instagram — eso ya lo sabes. Vas a entender el sistema en el que ya vives: cómo funcionan los algoritmos que moldean lo que ves, lo que compras y lo que piensas, y cómo moverte en ese entorno con inteligencia, ética y estrategia.
      </p>

      <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.78, margin: "0 0 18px" }}>
        No importa tu carrera. La cultura digital no es un tema exclusivo de comunicación o sistemas — es el entorno en el que todos vivimos, trabajamos y nos relacionamos hoy. Entenderlo a fondo <strong>es una ventaja competitiva real</strong> para cualquier profesionista del siglo XXI.
      </p>

      <div style={{ background: "rgba(79,70,229,.07)", borderRadius: 16, padding: "16px 18px", borderLeft: "3.5px solid #4F46E5" }}>
        <p style={{ margin: 0, fontSize: 13.5, color: "#374151", lineHeight: 1.7, fontStyle: "italic" }}>
          "Tu huella digital ya existe. La diferencia está en si la construyes tú con criterio o la dejas en manos del algoritmo."
        </p>
      </div>
    </div>

    <button className="btn" style={{ marginBottom: 12, cursor: "default" }}>
      Te invitamos a inscribirte
    </button>

    <p style={{ textAlign: "center", fontSize: 12, color: "#B0B8CC", marginBottom: 22, lineHeight: 1.6 }}>
      Universidad Marista de Mérida · Optativa
    </p>

    <button className="ghost-btn" onClick={onRestart}>↺ Volver a intentar</button>
  </div>
</div>
);
}

/* ═══════════════════════════════════════════════════
APP ROOT
═══════════════════════════════════════════════════ */
export default function App() {
useStyles();

const [screen, setScreen] = useState("welcome");
const [qIndex, setQIndex] = useState(0);
const [answers, setAnswers] = useState([]);
const [score, setScore] = useState(0);
const [email, setEmail] = useState("");
const [breaches, setBreaches] = useState(null);
const [insights, setInsights] = useState(null);
const [loadingAI, setLoadingAI] = useState(false);

const handleStart = () => { setScreen("quiz"); setQIndex(0); setAnswers([]); };

const handleAnswer = (value) => {
const newAnswers = [...answers, value];
setAnswers(newAnswers);
if (qIndex < QUESTIONS.length - 1) {
setQIndex(qIndex + 1);
} else {
setScore(newAnswers.reduce((a, b) => a + b, 0));
setScreen("email");
}
};

const runAnalysis = async (emailInput, savedAnswers, savedScore) => {
    setScreen("calculating");
    setLoadingAI(true);
    setInsights(null);
    setBreaches(null);

    let breachData = null;
    if (emailInput) {
      breachData = await checkBreaches(emailInput);
      setBreaches(breachData);
    }

    const minWait = new Promise((r) => setTimeout(r, 3600));
    const aiCall = fetchInsights(savedScore, savedAnswers, breachData);

    minWait.then(() => setScreen("results"));
    aiCall.then((data) => { setInsights(data); setLoadingAI(false); });
};

const handleEmailSubmit = (emailInput) => {
setEmail(emailInput);
runAnalysis(emailInput, answers, score);
};

const handleSkip = () => runAnalysis("", answers, score);

const handleRestart = () => {
setScreen("welcome");
setQIndex(0); setAnswers([]); setScore(0);
setEmail(""); setBreaches(null); setInsights(null); setLoadingAI(false);
};

const wrapBg = screen === "calculating"
? "linear-gradient(155deg,#1E1B4B 0%,#312E81 100%)"
: "linear-gradient(155deg,#F5F3FF 0%,#FFF8F5 55%,#EFF6FF 100%)";

return (
<div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: wrapBg, transition: "background .8s ease", position: "relative", overflow: "hidden" }}>
{screen === "welcome"     && <Welcome onStart={handleStart} />}
{screen === "quiz"        && <Quiz key={qIndex} index={qIndex} total={QUESTIONS.length} onAnswer={handleAnswer} />}
{screen === "email"       && <EmailCheck onSubmit={handleEmailSubmit} onSkip={handleSkip} />}
{screen === "calculating" && <Calculating checkingBreaches={!!email} />}
{screen === "results"     && <Results score={score} level={getLevel(score)} insights={insights} loadingAI={loadingAI} breaches={breaches} onRestart={handleRestart} />}
</div>
);
}