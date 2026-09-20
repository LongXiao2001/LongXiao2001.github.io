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
    heroBody: '视频生成算法 · 流式音视频生成', role: '视频生成算法研究员',
    school: '北京航空航天大学 · 硕士研究生', location: '北京，中国', explore: '查看研究项目', resume: '查看简历',
    aboutLabel: '关于我', aboutTitle: '我在做一件具体的事：让生成模型更快、更长，也更可交互。',
    aboutBody: '我从语音驱动的数字人出发，沿着可控视频生成、局部编辑与实时流式音视频持续深入。工作覆盖数据构建、模型训练、推理优化与系统集成，也包含把生成链路收成可运行的视频 Agent。',
    facts: [['研究方向', '流式音视频生成、视频局部编辑、视频生成 Agent'], ['实践路径', '腾讯、阿里巴巴与创业团队的模型研发经历'], ['工程取向', '从训练实验到部署性能，关注完整闭环']],
    beyond: '研究之外，我画画、打 Beatbox 和架子鼓，也保持健身。美术和音乐训练提升我在生成模型研究中的品味。',
    research: '研究与项目', publications: '论文成果', skills: '技术能力', education: '教育背景', contact: '保持联系', viewProject: '查看项目页', play: '播放项目视频',
    presetPrompt: '预设 Prompt', customPrompt: '在线切换 Prompt',
  },
  en: {
    nav: ['About', 'Work', 'Papers', 'Skills', 'Contact'], heroTitle: 'Real-time generation, interactive experiences.',
    heroBody: 'Video generation · streaming audio-video', role: 'Video Generation Researcher',
    school: 'M.S. student · Beihang University', location: 'Beijing, China', explore: 'Explore selected work', resume: 'View résumé',
    aboutLabel: 'About me', aboutTitle: 'I build generative video systems that are faster, longer, and responsive.',
    aboutBody: 'My path started with speech-driven digital humans and moved through controllable video generation, local editing, and real-time streaming audio-video. I work across data, training, inference, and system integration, including turning generation pipelines into runnable video agents.',
    facts: [['Research', 'Streaming audio-video, local video editing, video agents'], ['Experience', 'Model R&D across Tencent, Alibaba, and a startup team'], ['Engineering', 'End-to-end work from training experiments to deployment']],
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
    zh: {title: '流式可交互音视频生成', org: '腾讯 PCG · QQ 影像研究中心 · 2026.06–2026.09', body: '把双向 LTX-2.3 改为块因果音视频生成模型：按 1 秒对齐不同帧率的音视频 latent，并为模态内与跨模态注意力加因果掩码。Teacher / Diffusion / Resample Forcing 分阶段训练，用模型 rollout 历史作监督，再把采样从 30 步蒸馏到 4 步；分层 KV 支持十分钟级连续生成，Global / Local Prompt 可在生成过程中更新指令。去噪级多卡流水在 512×768 下达到 43 fps 的 DiT 稳态吞吐；端到端实时生成，首帧约 2 秒预热。'},
    en: {title: 'Streaming Interactive Audio-Video Generation', org: 'Tencent PCG · QQ Imaging · Jun–Sep 2026', body: 'Turned bidirectional LTX-2.3 into a block-causal audio-video model: 1-second chunks align latents of different frame rates, with causal masks on intra- and cross-modal attention. Teacher, Diffusion, and Resample Forcing train on model-rollout history, then distill 30 steps to 4. A hierarchical KV cache supports ten-minute streams, and Global / Local prompts can be updated while generating. Denoising-stage multi-GPU pipelining reaches 43 fps DiT throughput at 512×768; end-to-end realtime generation warms up in about 2 seconds.'},
    metric: '43 FPS DiT · 4-step · 10-min', videos: streamDemos, images: ['./media/streaming-training.png', './media/streaming-parallelism.png'], tags: ['LTX-2.3', 'Block-Causal', 'Resample Forcing', 'Live Prompt'], link: 'https://longxiao2001.github.io/StreamLTX/',
  },
  {
    zh: {title: '视频局部重绘与表情编辑', org: '阿里巴巴 · 优酷 · 2025.10–2026.04', body: '基于 Wan2.2，用逐帧向量化 timestep 控制噪声强度，指定时间段重绘而无需额外掩码分支；条件帧按编辑强度加噪，再沿缩放后的噪声轨迹去噪。编辑边界用时间步线性过渡，按进度调配同步、随机异步与连续段重绘，并为高低噪专家分别训练 LoRA。同步搭建 UE Metahuman 表情管线与评测集，用于 PerformRecast（CVPR 2026）。'},
    en: {title: 'Local Video Repainting & Expression Editing', org: 'Alibaba Youku · Oct 2025–Apr 2026', body: 'On Wan2.2, per-frame vectorized timesteps control noise so a chosen time span can be repainted without a mask branch; conditioned frames are noised by edit strength and denoised along a scaled trajectory. A linear timestep ramp smooths edit boundaries, a staged curriculum mixes sync, async, and segment edits, and split LoRAs match high/low-noise experts. Built a UE MetaHuman expression pipeline and eval set for PerformRecast (CVPR 2026).'},
    video: './media/repaint-demo.mp4', images: ['./media/repaint-framework.png'], tags: ['Wan2.2', 'Vectorized Timestep', 'LoRA', 'PerformRecast'], link: 'https://youku-aigc.github.io/PerformRecast/',
  },
  {
    zh: {title: '数字人生成与论文讲解视频 Agent', org: '右脑科技 · 2025.06–2025.10', body: '基于 VACE 与 LivePortrait 融合姿态、文本与音频，分段生成并跨片段衔接扩展时长，配合 CausVid 蒸馏与权重动态加载完成 14B 推理。用 LangGraph 搭建从论文解析、脚本到成片的视频 Agent，以 TTS 字符级时间戳对齐分镜、幻灯片与口播，并支持并行生成、失败重试与工具降级。'},
    en: {title: 'Digital Human & Paper-Talk Video Agent', org: 'RightBrain AI · Jun–Oct 2025', body: 'Fused pose, text, and audio with VACE and LivePortrait, extending duration through segmented generation, then ran the 14B model with CausVid distillation and dynamic weight loading. Built a LangGraph agent from paper parsing and scripting to the final video, using character-level TTS timestamps to align shots, slides, and speech, with parallel generation, retries, and tool fallbacks.'},
    video: './media/talking-avatar2.mp4', tags: ['VACE', 'LivePortrait', 'LangGraph', 'Video Agent'],
  },
  {
    zh: {title: '交互游戏 NPC 与语音驱动表情生成', org: '腾讯 IEG · 光子 · 2025.02–2025.06', body: '集成 ASR–LLM–TTS–UE 交互链路，完成模块接口与推理联调，并按环节分配时延预算。同时基于前期语音驱动表情工作继续开发：以 WavLM-Large、情绪与历史表情为条件，在 185 维 Metahuman 控制参数上做扩散生成，用速度损失约束抖动，滑窗重叠衔接长音频。'},
    en: {title: 'Interactive Game NPC & Speech-driven Expression', org: 'Tencent IEG · Lightspeed · Feb–Jun 2025', body: 'Integrated an ASR–LLM–TTS–Unreal loop, wired the module APIs, and allocated latency budgets across stages. Continued earlier speech-driven expression work: WavLM-Large, emotion, and history expressions condition an MDM Transformer on 185-dim MetaHuman controls, with a velocity loss to suppress jitter and overlapping windows for long audio.'},
    video: './media/npc-demo.mp4', images: ['./media/npc-framework.png'], tags: ['ASR', 'LLM', 'TTS', 'MetaHuman'],
  },
  {
    zh: {title: '语音驱动的情感化 3D 数字人表情生成', org: '本科毕业设计 · 2024.01–2024.06', body: '冻结 WavLM-Large 编码语音，与情绪和历史表情共同作为条件，用 MDM Transformer 在 185 维 Metahuman 控制参数上做扩散生成，并加入速度损失抑制抖动。长音频按滑窗滚动生成，重叠区线性混合，导出 JSON 驱动 Metahuman 渲染。'},
    en: {title: 'Speech-driven Emotional 3D Expression Generation', org: 'Undergraduate thesis · Jan–Jun 2024', body: 'Froze WavLM-Large for speech and conditioned an MDM Transformer on emotion and history expressions to generate 185-dim MetaHuman controls, with a velocity loss to suppress jitter. Long audio is rolled in overlapping windows and exported as JSON for rendering.'},
    video: './media/digital-human.mp4', images: ['./media/digital-human-framework.png'], tags: ['WavLM', 'MDM', 'MetaHuman', 'Facial Animation'],
  },
];

const skillGroups = [
  ['Generative modeling', 'Diffusion / Flow Matching · DiT · Block-causal & cross-modal attention · Joint AV'],
  ['Training & editing', 'Teacher / Diffusion / Resample Forcing · DMD few-step · LoRA'],
  ['Streaming inference', 'Hierarchical KV Cache · Timestep parallelism · FlashAttention-3'],
  ['Interactive systems', 'LangGraph · UE MetaHuman · Video Agent'],
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
