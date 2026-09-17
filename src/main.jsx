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
    heroBody: '流式音视频联合生成 · 视频生成 · 视频生成 Agent', role: 'AIGC视频生成算法研究员',
    school: '北京航空航天大学 · 硕士研究生', location: '北京，中国', explore: '查看研究项目', resume: '查看简历',
    aboutLabel: '关于我', aboutTitle: '我在做一件具体的事：让生成模型更快、更长，也更可交互。',
    aboutBody: '我从语音驱动的 3D 数字人出发，沿着 2D 视频生成、时空局部编辑与实时流式音视频生成持续深入。工作覆盖数据构建、模型训练、推理优化与系统集成，也包含把生成链路收成可运行的视频 Agent。',
    facts: [['研究方向', '流式音视频生成、时空局部编辑、视频生成 Agent'], ['实践路径', '腾讯、阿里巴巴与创业团队的模型研发经历'], ['工程取向', '从训练实验到部署性能，关注完整闭环']],
    beyond: '研究之外，我画画、打 Beatbox 和架子鼓，也保持健身。美术和音乐训练提升我在生成模型研究中的品味。',
    research: '研究与项目', publications: '论文成果', skills: '技术能力', education: '教育背景', contact: '保持联系', viewProject: '查看项目页', play: '播放项目视频',
    presetPrompt: '预设 Prompt', customPrompt: '在线切换 Prompt',
  },
  en: {
    nav: ['About', 'Work', 'Papers', 'Skills', 'Contact'], heroTitle: 'Real-time generation, interactive experiences.',
    heroBody: 'Streaming audio-video generation · video generation · video agents', role: 'AIGC & Video Generation Researcher',
    school: 'M.S. student · Beihang University', location: 'Beijing, China', explore: 'Explore selected work', resume: 'View résumé',
    aboutLabel: 'About me', aboutTitle: 'I build generative video systems that are faster, longer, and responsive.',
    aboutBody: 'My path started with speech-driven 3D digital humans and moved through controllable 2D generation, spatiotemporal editing, and real-time streaming audio-video. I work across data, training, inference, and system integration, including turning generation pipelines into runnable video agents.',
    facts: [['Research', 'Streaming audio-video, spatiotemporal editing, video agents'], ['Experience', 'Model R&D across Tencent, Alibaba, and a startup team'], ['Engineering', 'End-to-end work from training experiments to deployment']],
    beyond: 'Beyond research, I draw, beatbox, play drums, and train. Art and music training enhance my taste in generative model research.',
    research: 'Research & selected work', publications: 'Publications', skills: 'Technical practice', education: 'Education', contact: 'Let’s connect', viewProject: 'Project page', play: 'Play project video',
    presetPrompt: 'Preset prompts', customPrompt: 'Live prompt switching',
  },
};

const streamDemos = [
  {id: 'magic', group: 'preset', src: './media/stream-ltx-preset-magic-woman.mp4', zh: '魔法女性', en: 'Mage'},
  {id: 'paper', group: 'preset', src: './media/stream-ltx-preset-paper-cut.mp4', zh: '剪纸', en: 'Paper cut'},
  {id: 'fox', group: 'preset', src: './media/stream-ltx-preset-fox.mp4', zh: '狐狸茶室', en: 'Fox teahouse'},
  {id: 'prompt', group: 'custom', src: './media/stream-ltx-custom-prompt.mp4', zh: '在线改 Prompt', en: 'Live prompt edit'},
  {id: 'qq', group: 'custom', src: './media/stream-ltx-custom-qq.mp4', zh: '自定义角色', en: 'Custom character'},
];

const projects = [
  {
    zh: {title: '实时流式可交互音视频生成', org: '腾讯 · 2026.06–2026.09', body: '把双向 LTX-2.3 改造为块因果模型：按 1 秒对齐音视频联合块，并对全部 6 路注意力加因果掩码。Teacher Forcing 之后用 Resample Forcing 缓解误差累积；长序列 KV 分为 anchor、内容 memory 与 FIFO。分层 Prompt 支持流式过程中在线切换；去噪级多卡流水配合少步蒸馏，512×768 下达到 43 fps（仅 DiT 稳态去噪吞吐，不含文本编码、VAE / 音频解码与封装）、十分钟级连续生成无误差累积。'},
    en: {title: 'Streaming Interactive Audio-Video Generation', org: 'Tencent · Jun–Sep 2026', body: 'Turned bidirectional LTX-2.3 into a block-causal model with 1-second AV chunks and causal masks on all six attention paths. Teacher then Resample Forcing reduces exposure bias; a three-tier KV cache holds long context. Hierarchical prompts enable live switching during generation; denoising-level multi-GPU pipelining with few-step distillation reaches 43 fps at 512×768 (steady-state DiT throughput, excluding text encoding, VAE and audio decoding and muxing) for ten-minute streams with no visible drift.'},
    metric: '43 FPS (DiT only) · 512×768 · 10-min continuous', videos: streamDemos, images: ['./media/streaming-training.png', './media/streaming-parallelism.png'], tags: ['LTX-2.3', 'Block-Causal', 'Resample Forcing', 'Live Prompt'], link: 'https://longxiao2001.github.io/StreamLTX/',
  },
  {
    zh: {title: '视频时空局部重绘', org: '阿里巴巴 · 2025.10–2026.04', body: '基于 Wan2.2 做时空局部重绘，用逐帧向量化 timestep 代替额外掩码分支：flow matching 中的 σ 作为逐位置混合权重，保留、重绘或做部分编辑，不改模型结构。结构化重绘课程配合边界平滑，并按高低噪专家分别训练 LoRA，可指定任意时间段重绘而其余片段不变。'},
    en: {title: 'Spatiotemporal Video Repainting', org: 'Alibaba · Oct 2025–Apr 2026', body: 'Repainted Wan2.2 video with per-frame vectorized timesteps instead of a mask branch: σ in flow matching is a per-location mix weight for keep, edit, or full redraw, with no extra parameters. A structured curriculum and split LoRAs for high/low-noise experts let any time span be edited while the rest stays fixed.'},
    video: './media/repaint-demo.mp4', images: ['./media/repaint-framework.png'], tags: ['Wan2.2', 'Vectorized Timestep', 'LoRA', 'Video Editing'], link: 'https://youku-aigc.github.io/PerformRecast/',
  },
  {
    zh: {title: '2D Talking Avatar 与论文讲解视频 Agent', org: '右脑科技 · 2025.06–2025.10', body: '融合 Pose / Text / Audio 条件生成 2D 数字人，分段生成并跨片段衔接扩展时长，再用 CausVid 蒸馏把采样压到少步。同时用 LangGraph 搭建论文讲解视频 Agent：PDF 解析、大纲与口播稿、幻灯片、TTS、数字人口播到成片，并用 TTS 字符级时间戳对齐分镜时长。'},
    en: {title: '2D Talking Avatar & Paper-Talk Video Agent', org: 'RightBrain AI · Jun–Oct 2025', body: 'Fused pose, text, and audio for controllable 2D avatars, extending duration with segmented generation and CausVid few-step distillation. Built a LangGraph paper-talk video agent from PDF parsing through slides, TTS, avatar delivery, and muxing, using character-level TTS timestamps as the shot clock.'},
    video: './media/talking-avatar2.mp4', tags: ['VACE', 'LivePortrait', 'LangGraph', 'Video Agent'],
  },
  {
    zh: {title: 'LLM 驱动的交互游戏 NPC', org: '腾讯 · 2025.02–2025.06', body: '设计并集成 ASR–LLM–TTS–UE 端到端交互链路，完成模块封装、接口编排与推理流程联调，并在各环节间分配时延预算，满足实时交互。'},
    en: {title: 'LLM-driven Interactive Game NPC', org: 'Tencent · Feb–Jun 2025', body: 'Designed an ASR–LLM–TTS–Unreal end-to-end loop, packaged the modules, orchestrated inference, and allocated latency budgets across stages for real-time interaction.'},
    video: './media/npc-demo.mp4', images: ['./media/npc-framework.png'], tags: ['ASR', 'LLM', 'TTS', 'Unreal Engine'],
  },
  {
    zh: {title: '语音驱动的情感化 3D 数字人表情生成', org: '本科毕业设计 · 2024.01–2024.06', body: '冻结 WavLM-Large 编码语音，与情绪嵌入和种子表情共同作为条件，在 185 维 Metahuman control rig 上做扩散生成，并加入速度损失抑制抖动。长音频按窗口滚动生成，重叠区线性混合，导出 JSON 驱动 Metahuman 渲染。'},
    en: {title: 'Speech-driven Emotional 3D Expression Generation', org: 'Undergraduate thesis · Jan–Jun 2024', body: 'Froze WavLM-Large for speech, conditioned a diffusion backbone on emotion embeddings and seed expressions, and generated 185-dim MetaHuman control-rig motion with a velocity loss to suppress jitter. Long audio is rolled in overlapping windows and exported as JSON for rendering.'},
    video: './media/digital-human.mp4', images: ['./media/digital-human-framework.png'], tags: ['WavLM', 'Diffusion', 'MetaHuman', 'Facial Animation'],
  },
];

const skillGroups = [
  ['Causal generation', 'Block-Causal Attention · Teacher / Resample Forcing · KV Cache'],
  ['Models', 'LTX-2.3 · Wan2.2 · CogVideoX · MiniMax-H3 · VACE'],
  ['Training & inference', 'Few-step distillation · Timestep parallelism · LoRA · LangGraph'],
  ['Interactive media', 'Streaming AV · UE MetaHuman · Video Agent'],
];

function ArrowIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>; }

function StreamDemoReel({videos, lang, playLabel, labels}) {
  const [active, setActive] = useState(0);
  const clip = videos[active];
  const groups = [
    {id: 'preset', label: labels.presetPrompt},
    {id: 'custom', label: labels.customPrompt},
  ];

  return <div className="stream-demos">
    <div className="project-media media-mask stream">
      <video key={clip.src} src={clip.src} controls playsInline preload="metadata" aria-label={`${playLabel}: ${clip[lang]}`} />
    </div>
    <div className="demo-switcher">
      {groups.map((group) => <div className="demo-group" key={group.id}>
        <span>{group.label}</span>
        {videos.map((clipItem, index) => clipItem.group === group.id && (
          <button key={clipItem.id} type="button" className={index === active ? 'active' : ''} onClick={() => setActive(index)}>{clipItem[lang]}</button>
        ))}
      </div>)}
    </div>
  </div>;
}

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
        <div className="hero-actions"><a className="button primary" href="#work">{t.explore}<ArrowIcon /></a><a className="button" href="./reference/Long_Xiao_AIGC_Resume.pdf">{t.resume}</a></div>
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
          <div className={`project-layout${project.videos ? ' project-layout-stream' : ''}`}>
            {project.videos
              ? <StreamDemoReel videos={project.videos} lang={lang} playLabel={t.play} labels={t} />
              : <div className="project-media media-mask"><video src={project.video} controls playsInline preload="metadata" aria-label={`${t.play}: ${p.title}`} /></div>}
            <div className="project-copy reveal"><p>{p.body}</p><ul>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>{project.link && <a href={project.link} target="_blank" rel="noreferrer">{t.viewProject}<ArrowIcon /></a>}</div>
          </div>
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

    <footer id="contact"><div><span>CONTACT</span><h2>{t.contact}</h2></div><a href="mailto:1215497652@qq.com">longxiao202110@gmail.com <ArrowIcon /></a><a href="https://github.com/longxiao2001" target="_blank" rel="noreferrer">GitHub <ArrowIcon /></a><a href="https://www.zhihu.com/people/nong-xiao-suan-24/posts" target="_blank" rel="noreferrer">{lang === 'zh' ? '知乎' : 'Zhihu'} <ArrowIcon /></a><p>© 2026 Long Xiao · Built frame by frame.</p></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
