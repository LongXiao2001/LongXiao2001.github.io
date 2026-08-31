import React, {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {HeroSequence} from './hero-sequence';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const copy = {
  zh: {
    nav: ['简介', '项目', '论文', '能力', '联系'], heroTitle: '实时生成，虚拟交互。',
    heroBody: '视频生成 · 世界模型 · 实时交互式音视频生成', role: 'AIGC视频生成算法研究员',
    school: '北京航空航天大学 · 硕士研究生', location: '北京，中国', explore: '查看研究项目', resume: '查看简历',
    aboutLabel: '关于我', aboutTitle: '我在做一件具体的事：让生成模型更快、更长，也更可交互。',
    aboutBody: '我从语音驱动的 3D 数字人出发，沿着 2D 视频生成、时空局部编辑与实时因果生成持续深入。我的工作横跨数据构建、模型训练、推理优化与系统集成，希望把生成模型从离线样片推进到可以实时响应人的连续世界。',
    facts: [['研究方向', '因果视频生成、扩散模型、世界模型与数字人'], ['实践路径', '腾讯、阿里巴巴与创业团队的模型研发经历'], ['工程取向', '从训练实验到部署性能，关注完整闭环']],
    beyond: '研究之外，我画画、打 Beatbox 和架子鼓，也保持健身。美术训练让我习惯观察结构、节奏和细节——这些也影响着我理解运动与生成。',
    research: '研究与项目', publications: '论文成果', skills: '技术能力', education: '教育背景', contact: '保持联系', viewProject: '查看项目页', play: '播放项目视频',
  },
  en: {
    nav: ['About', 'Work', 'Papers', 'Skills', 'Contact'], heroTitle: 'Real-time generation, interactive experiences.',
    heroBody: 'Video generation · world models · interactive audio-visual systems', role: 'AIGC & Video Generation Researcher',
    school: 'M.S. student · Beihang University', location: 'Beijing, China', explore: 'Explore selected work', resume: 'View résumé',
    aboutLabel: 'About me', aboutTitle: 'I build generative video systems that are faster, longer, and responsive.',
    aboutBody: 'My path started with speech-driven 3D digital humans and moved through controllable 2D generation, spatiotemporal editing, and real-time causal video. I work across data, training, inference optimization, and system integration—pushing generative models beyond offline clips toward continuous worlds that can respond to people.',
    facts: [['Research', 'Causal video generation, diffusion, world models, digital humans'], ['Experience', 'Model R&D across Tencent, Alibaba, and a startup team'], ['Engineering', 'End-to-end work from training experiments to deployment']],
    beyond: 'Beyond research, I draw, beatbox, play drums, and train. Art taught me to notice structure, rhythm, and detail—the same instincts shape how I think about motion and generation.',
    research: 'Research & selected work', publications: 'Publications', skills: 'Technical practice', education: 'Education', contact: 'Let’s connect', viewProject: 'Project page', play: 'Play project video',
  },
};

const projects = [
  {
    zh: {title: '实时流式交互音视频生成', org: '腾讯 · 2026.06–2026.09', body: '以 LTX-2.3 为基座完成双向扩散模型因果化训练，引入 Resample Forcing 与长序列 KV Cache 策略，支持生成过程中 Prompt 在线切换与连续响应。推进 DMD 少步蒸馏与 Timestep-Forcing 多卡并行推理。'},
    en: {title: 'Streaming Causal Video Generation', org: 'Tencent · Jun–Sep 2026', body: 'Causalized LTX-2.3 with real long-video data, Resample Forcing, and long-context KV-cache strategies. Added online prompt updates, DMD few-step distillation, and multi-GPU Timestep-Forcing inference.'},
    metric: '43 FPS · 4×H800 · 512×768 · minute-long', video: './media/streaming-causal.mp4', images: ['./media/streaming-training.png', './media/streaming-parallelism.png'], tags: ['LTX-2.3', 'Causal Diffusion', 'DMD', 'Timestep-Forcing'],
  },
  {
    zh: {title: '视频时空局部重绘', org: '阿里巴巴 · 2025.10–2026.04', body: '基于 Wan2.2 进行 LoRA 微调，设计 token-level timestep map，让不同时间片段与空间区域采用差异化去噪进程，实现视频内容的时空局部重绘。'},
    en: {title: 'Spatiotemporal Video Repainting', org: 'Alibaba · Oct 2025–Apr 2026', body: 'Fine-tuned Wan2.2 with LoRA and designed a token-level timestep map so different temporal segments and spatial regions follow distinct denoising schedules.'},
    video: './media/repaint-demo.mp4', images: ['./media/repaint-framework.png'], tags: ['Wan2.2', 'LoRA', 'Timestep Map', 'Video Editing'],
  },
  {
    zh: {title: '2D Talking Avatar', org: '右脑科技 · 2025.06–2025.10', body: '融合 Pose、Text 与 Audio 条件，实现多模态可控数字人生成。采用分段生成与跨片段衔接扩展时长，并以 CausVid 蒸馏、显存切片和权重动态加载在单张 RTX 4090 上完成 VACE 14B 推理。'},
    en: {title: '2D Talking Avatar', org: 'RightBrain AI · Jun–Oct 2025', body: 'Combined pose, text, and audio conditioning for controllable avatars. Extended duration through segmented generation and cross-clip continuity, then deployed VACE 14B on one RTX 4090 with CausVid distillation and memory optimization.'},
    video: './media/talking-avatar2.mp4', tags: ['VACE', 'LivePortrait', 'CausVid', 'RTX 4090'],
  },
  {
    zh: {title: 'LLM 驱动的交互游戏 NPC', org: '腾讯 · 2025.02–2025.06', body: '设计并集成 ASR–LLM–TTS–UE 端到端交互链路，覆盖玩家语音输入、上下文对话、语音合成与数字人驱动，完成系统模块化封装与推理流程联调。'},
    en: {title: 'LLM-driven Interactive Game NPC', org: 'Tencent · Feb–Jun 2025', body: 'Designed an ASR–LLM–TTS–Unreal end-to-end loop for player speech, contextual dialogue, synthesis, and avatar control, including modular services and inference orchestration.'},
    video: './media/npc-demo.mp4', images: ['./media/npc-framework.png'], tags: ['ASR', 'LLM', 'TTS', 'Unreal Engine'],
  },
  {
    zh: {title: '3D 数字人表情生成', org: '本科毕业设计 · 2024.01–2024.06', body: '使用 WavLM 编码语音表征，将音频、情绪标签与种子表情作为联合条件，以 DiT 预测连续面部表情序列，并接入 Metahuman 完成动画渲染与音画同步。'},
    en: {title: '3D Digital Human Expression Generation', org: 'Undergraduate thesis · Jan–Jun 2024', body: 'Encoded speech with WavLM and conditioned a DiT on audio, emotion labels, and seed expressions to predict continuous facial animation, rendered and synchronized through MetaHuman.'},
    video: './media/digital-human.mp4', images: ['./media/digital-human-framework.png'], tags: ['WavLM', 'DiT', 'MetaHuman', 'Facial Animation'],
  },
];

const skillGroups = [
  ['Generative modeling', 'Diffusion · Flow Matching · Transformer · Forcing · LoRA · DMD'],
  ['Video & world models', 'LTX-2.3 · Wan2.2 · VACE · CogVideoX · World Models'],
  ['Training & systems', 'PyTorch · Data pipelines · Multi-GPU · Deployment · LangGraph'],
  ['Interactive media', 'Audio / Video · UE MetaHuman'],
];

function ArrowIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>; }

function App() {
  const [lang, setLang] = useState('zh');
  const root = useRef(null);
  const t = copy[lang];

  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', {y: 24, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out'});
      gsap.utils.toArray('.reveal').forEach((el) => gsap.from(el, {y: 34, opacity: 0, duration: 0.75, ease: 'power2.out', scrollTrigger: {trigger: el, start: 'top 86%', once: true}}));
      gsap.utils.toArray('.media-mask').forEach((el) => gsap.fromTo(el, {clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.inOut', scrollTrigger: {trigger: el, start: 'top 82%', once: true}}));
      gsap.utils.toArray('.project-progress i').forEach((el) => gsap.fromTo(el, {scaleX: 0}, {scaleX: 1, ease: 'none', scrollTrigger: {trigger: el.closest('.project'), start: 'top 65%', end: 'bottom 45%', scrub: 0.6}}));
    }, root);
    return () => ctx.revert();
  }, []);

  const switchLang = (next) => { setLang(next); document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'; };

  return <main ref={root}>
    <header className="site-header">
      <a className="mark" href="#top" aria-label="Long Xiao home">LX</a>
      <nav aria-label="Primary navigation">{['about', 'work', 'papers', 'skills', 'contact'].map((id, i) => <a key={id} href={`#${id}`}>{t.nav[i]}</a>)}</nav>
      <div className="language" aria-label="Language"><button className={lang === 'zh' ? 'active' : ''} onClick={() => switchLang('zh')}>中</button><span>/</span><button className={lang === 'en' ? 'active' : ''} onClick={() => switchLang('en')}>EN</button></div>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <h1><span>龙潇</span><small>LONG XIAO</small></h1><h2>{t.heroTitle}</h2><p className="hero-field">{t.heroBody}</p>
        <div className="hero-actions"><a className="button primary" href="#work">{t.explore}<ArrowIcon /></a><a className="button" href="./reference/Long_Xiao_AIGC_Resume.tex">{t.resume}</a></div>
        <dl className="identity-list"><div><dt>01</dt><dd>{t.school}</dd></div><div><dt>02</dt><dd>{t.role}</dd></div><div><dt>03</dt><dd>{t.location}</dd></div></dl>
      </div>
      <div className="hero-player" aria-label="120-frame causal video generation visualization"><Player component={HeroSequence} durationInFrames={120} compositionWidth={1280} compositionHeight={720} fps={30} autoPlay loop initiallyMuted controls={false} acknowledgeRemotionLicense style={{width: '100%'}} /></div>
    </section>

    <section className="about section-grid" id="about">
      <div className="section-label reveal"><span>ABOUT</span><strong>{t.aboutLabel}</strong></div>
      <div className="about-content"><h2 className="reveal">{t.aboutTitle}</h2><p className="about-lede reveal">{t.aboutBody}</p>
        <div className="facts reveal">{t.facts.map(([title, body], i) => <div key={title}><b>0{i + 1}</b><strong>{title}</strong><p>{body}</p></div>)}</div>
        <div className="beyond reveal"><strong>BEYOND RESEARCH</strong><p>{t.beyond}</p><span>DRAWING · BEATBOX · DRUMS · FITNESS</span></div>
      </div>
    </section>

    <section className="work" id="work"><div className="work-title reveal"><span>01—05</span><h2>{t.research}</h2></div>
      {projects.map((project, index) => { const p = project[lang]; return <article className="project" key={project.en.title}>
        <div className="project-index"><b>{String(index + 1).padStart(2, '0')}</b><span>SCROLL<br />PLAYHEAD</span></div>
        <div className="project-main"><header className="project-head reveal"><div><h3>{p.title}</h3><p>{p.org}</p></div>{project.metric && <strong>{project.metric}</strong>}</header>
          <div className="project-layout"><div className="project-media media-mask"><video src={project.video} controls playsInline preload="metadata" aria-label={`${t.play}: ${p.title}`} /></div>
            <div className="project-copy reveal"><p>{p.body}</p><ul>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>{index === 1 && <a href="https://youku-aigc.github.io/PerformRecast/" target="_blank" rel="noreferrer">{t.viewProject}<ArrowIcon /></a>}</div></div>
          {project.images && <div className={`project-figures figures-${project.images.length}`}>{project.images.map((src, i) => <figure className="media-mask" key={src}><img src={src} alt={`${p.title} ${i + 1}`} loading="lazy" /></figure>)}</div>}
          <div className="project-progress" aria-hidden="true"><i /></div>
        </div>
      </article>; })}
    </section>

    <section className="papers section-grid" id="papers"><div className="section-label reveal"><span>PAPERS</span><strong>{t.publications}</strong></div><div className="paper-list">
      <article className="reveal"><b>01</b><div><h3>PerformRecast: Expression and Head Pose Disentanglement for Portrait Video Editing</h3><p>J. Liang, B. Xiong, J. Tian, H. Li, <strong>X. Long</strong>, Y. Zheng, H. Fu</p></div><a href="https://youku-aigc.github.io/PerformRecast/" target="_blank" rel="noreferrer">CVPR 2026 <ArrowIcon /></a></article>
      <article className="reveal"><b>02</b><div><h3>Toward Diffusion-Based Deep Reinforcement Learning for Discrete Decision-Making: Methods and Evaluations</h3><p>Z. Chen, <strong>X. Long</strong>, L. Zhang, W. Cai</p></div><span>IEEE TNSE</span></article>
    </div></section>

    <section className="skills section-grid" id="skills"><div className="section-label reveal"><span>STACK</span><strong>{t.skills}</strong></div><div className="skill-grid">{skillGroups.map(([title, body], i) => <div className="reveal" key={title}><b>0{i + 1}</b><h3>{title}</h3><p>{body}</p></div>)}</div></section>

    <section className="education section-grid"><div className="section-label reveal"><span>EDU</span><strong>{t.education}</strong></div><div className="education-list">
      <article className="reveal"><span>2024—2027</span><h3>{lang === 'zh' ? '北京航空航天大学' : 'Beihang University'}</h3><p>{lang === 'zh' ? '自动化科学与电气工程学院 · 硕士' : 'M.S., School of Automation Science and Electrical Engineering'}</p></article>
      <article className="reveal"><span>2020—2024</span><h3>{lang === 'zh' ? '东南大学' : 'Southeast University'}</h3><p>{lang === 'zh' ? '自动化学院 · 本科' : 'B.Eng., School of Automation'}</p></article>
    </div></section>

    <footer id="contact"><div><span>CONTACT</span><h2>{t.contact}</h2></div><a href="mailto:1215497652@qq.com">longxiao202110@gmail.com <ArrowIcon /></a><a href="https://github.com/longxiao2001" target="_blank" rel="noreferrer">GitHub <ArrowIcon /></a><p>© 2026 Long Xiao · Built frame by frame.</p></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
