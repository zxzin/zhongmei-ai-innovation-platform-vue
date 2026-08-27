import { innovationReviewReportV8Html } from "./innovationReviewReportV8.js"

// 报告正文由两份原始报告静态迁移而来。运行时只读取本模块，不依赖参考 HTML 文件。

const researchDocumentHtml = String.raw`
<div class="wrap">
<div class="cover">
  <div class="tag">中煤（深圳）研究院 · 科研课题智能评审平台</div>
  <h1>煤炭资源开采过程伴随大量高矿化度涌水问题研究<br>立项查新与建议书完善报告</h1>
  <div class="sub">面向课题申报人。基于所提交的《立项建议书》，对三个预期创新点逐项做专利与论文查新，梳理可引用的支持性政策，并给出建议书补充完善的具体建议。<br><span style="font-size:13px;opacity:.8">本报告不含评级与打分，不作立项判定，仅供申报前自查与修改使用。</span></div>
  <dl class="meta">
    <div><dt>报告编号</dt><dd>ZMSZ-CX-2026-0817</dd></div>
    <div><dt>报告版本</dt><dd>研发人员版</dd></div>
    <div><dt>申报部门</dt><dd>矿山生态环境研究所</dd></div>
    <div><dt>数据截止</dt><dd>2026-06-30</dd></div>
    <div><dt>生成日期</dt><dd>2026-08-17</dd></div>
  </dl>
</div>

<div class="tip">
<h5>怎么用这份报告</h5>
<p>第三章是核心——逐个创新点告诉你「现有技术已经做到哪一步、你的方案跟谁最像、像在哪里」。如果某个创新点的最高相似度偏高，说明该方向已被充分覆盖，建议在建议书中补充差异化说明或调整定位，而不是照原表述提交。</p>
<p style="margin:0">第五章把所有修改建议汇总成清单，附可直接引用的政策原文与数据表述，改完建议书后可按 5.3 节自查一遍。</p>
</div>
<div class="ch" id="c1">
  <div class="cn">第一章</div>
  <h2>查新概要</h2>
  <p class="lead">检索范围与技术主题界定 · 三个创新点查新结果速览</p>
</div>

<h3 id="s1-1">1.1　检索范围与技术主题</h3>
<p>依据建议书《三、主要研究内容》与《四、预期成果》，将项目归纳为两个技术主题作为检索锚点。检索式与排除词一并列出，便于你核对锚点是否准确——<em class="hl">如果核心技术词与你的实际方案有偏差，请反馈修正后重新检索</em>，否则后续相似度结论会失准。</p>
<div class="card">
<h5 style="margin-top:0">主题一　高矿化度矿井水治理与分盐资源化</h5>
<p class="small" style="margin:0 0 10px">核心技术词：高矿化度矿井水、矿井涌水、浓盐水处理、纳滤分盐、膜污堵与结垢、结晶盐提纯<br>
英文对应词：high-salinity mine water、high TDS mine water、brine treatment、nanofiltration salt separation、membrane fouling and scaling<br>
排除词：海水淡化、市政污水处理、煤化工废水<br>
对应研究内容：第（2）（3）项；对应创新点二、三</p>
<h5>主题二　煤水混杂采场的回采与排水协同控制</h5>
<p class="small" style="margin:0">核心技术词：煤水共采、井下排水调控、回采推进与排水协同、涌水量动态预测<br>
英文对应词：coal-water co-mining、mine drainage control、water inflow prediction<br>
排除词：地面污水泵站控制、矿井通风系统调控<br>
对应研究内容：第（1）项；对应创新点一</p>
</div>
<div class="tw">
<table>
<caption>检索范围</caption>
<thead><tr><th>数据源</th><th>范围</th><th class="n">召回量</th><th>去重与口径处理</th></tr></thead>
<tbody>
<tr><td>专利</td><td>智慧芽全球专利库，2016—2025，发明+实用新型</td><td class="n">1,247 件</td><td>同族去重后计一件；申请人按集团口径归并</td></tr>
<tr><td>论文</td><td>万方本地镜像库，中英文双语检索式</td><td class="n">863 篇</td><td>预印本／会议／期刊三版本去重；发表年采用网络首发年</td></tr>
<tr><td>政策</td><td>国务院政策文件库及五部委官网、三省区门户、集团制度</td><td class="n">47 件</td><td>已剔除已废止文件 3 件</td></tr>
</tbody>
</table>
</div>
<h3 id="s1-2">1.2　三个创新点查新结果速览</h3>
<p>相似度按技术特征逐项比对计算，分档口径如下：<strong>&lt;60%</strong> 未见同类方案；<strong>60%—75%</strong> 存在相关方案但技术路线不同；<strong>75%—85%</strong> 存在较相似方案，须说明差异；<strong>≥85%</strong> 存在高度相似方案，建议调整方案或重新定位。</p>
<div class="tw">
<table>
<thead><tr><th>创新点</th><th class="n">专利侧最高相似度</th><th class="n">论文侧最高相似度</th><th>查新结论</th><th>建议动作</th></tr></thead>
<tbody>
<tr><td>创新点一　煤水共采协同调控方法</td><td class="n">71%</td><td class="n">68%</td><td><span class="b g">技术路线不同</span></td><td>可保留。补充量化性能指标</td></tr>
<tr style="background:var(--amberbg)"><td><strong>创新点二　高含盐矿井水纳滤分盐工艺</strong></td><td class="n"><strong>87%</strong></td><td class="n"><strong>83%</strong></td><td><span class="b r">存在高度相似方案</span></td><td><strong>须重点处理。</strong>调整技术路线或重新定位为工程适配改进</td></tr>
<tr><td>创新点三　浓盐水零排放经济性优化模型</td><td class="n">54%</td><td class="n">58%</td><td><span class="b g">未见同类方案</span></td><td>可保留并强化。补充成本测算依据</td></tr>
</tbody>
</table>
</div>
<div class="tip">
<h5>一句话总结</h5>
<p style="margin:0">创新点一与创新点三的查新结果良好，方向清晰、与现有技术差异明确，建议在建议书中把这两项作为核心创新点突出表述。创新点二所在的纳滤分盐路线已被外部主体充分覆盖（专利 87%、论文已完成中试），<em class="hl">按现有表述提交容易在评审中被质疑新颖性</em>，第 3.2 节给出了两条具体的调整思路。</p>
</div>
<div class="ch" id="c2">
  <div class="cn">第二章</div>
  <h2>技术领域现状</h2>
  <p class="lead">专利态势 · 论文态势 · 技术分支机会图 · 主要研究主体在做什么</p>
</div>

<h3 id="s2-1">2.1　专利态势</h3>
<div class="fig">
<div class="ft">图 2-1　近十年专利申请量年度趋势</div>
<div class="fs">纵轴为年度申请量；虚线为公开年辅助曲线</div>
<svg viewBox="0 0 700 250" role="img" aria-label="专利申请量年度趋势折线图，申请总量由2016年56件增至2023年204件">
<g stroke="var(--grid)" stroke-width="1">
<line x1="44" y1="20" x2="680" y2="20"/><line x1="44" y1="65" x2="680" y2="65"/>
<line x1="44" y1="110" x2="680" y2="110"/><line x1="44" y1="155" x2="680" y2="155"/>
<line x1="44" y1="200" x2="680" y2="200"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="38" y="204">0</text><text x="38" y="159">70</text><text x="38" y="114">140</text>
<text x="38" y="69">210</text><text x="38" y="24">280</text></g>
<polyline fill="none" stroke="var(--c1)" stroke-width="2.5" stroke-linejoin="round"
 points="70,164.0 138,157.6 206,147.3 274,133.8 342,119.0 410,104.9 478,90.7 546,68.9 614,103.6 682,140.9"/>
<polyline fill="none" stroke="var(--c4)" stroke-width="2" stroke-linejoin="round"
 points="70,175.6 138,171.1 206,164.0 274,154.4 342,143.4 410,132.5 478,121.6 546,104.2 614,130.6 682,158.9"/>
<polyline fill="none" stroke="var(--c2)" stroke-width="1.8" stroke-dasharray="5 4" stroke-linejoin="round"
 points="70,160.1 138,153.7 206,142.1 274,128.0 342,111.3 410,95.9 478,79.1 546,56.0 614,41.9 682,34.1"/>
<g fill="var(--c1)"><circle cx="70" cy="164.0" r="3"/><circle cx="546" cy="68.9" r="3"/></g>
<text x="546" y="59.9" fill="var(--c1)" font-size="11" font-weight="700" text-anchor="middle">204</text>
<text x="70" y="155.0" fill="var(--ink3)" font-size="10" text-anchor="middle">56</text>
<rect x="590" y="20" width="92" height="182" fill="var(--amber)" opacity="0.07"/>
<text x="636" y="36" fill="var(--amber)" font-size="9.5" text-anchor="middle">数据不完整区</text>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="70" y="220">2016</text><text x="138" y="220">2017</text><text x="206" y="220">2018</text>
<text x="274" y="220">2019</text><text x="342" y="220">2020</text><text x="410" y="220">2021</text>
<text x="478" y="220">2022</text><text x="546" y="220">2023</text><text x="614" y="220">2024</text>
<text x="682" y="220">2025</text></g>
</svg>
<div class="lg"><span><i style="background:var(--c1)"></i>申请总量</span><span><i style="background:var(--c4)"></i>其中发明专利</span><span><i style="background:var(--c2)"></i>公开年总量（辅助）</span></div>
<div class="fn">近 2 年数据受专利公开滞后影响，不作趋势判定依据。公开年曲线无滞后问题，2024—2025 年仍上升，说明申请活跃度并未真实下降。</div>
</div>
<p>专利申请总量由 2016 年 56 件增至 2023 年 204 件，年均增长 <em class="hl">20.3%</em>，其中发明专利年均增长 21.6%，增速高于实用新型。申请人数量由 41 家增至 118 家。<strong>对你的意义：</strong>这是一个正在快速升温的方向，立项时机合适，但同期进入者多，<em class="hl">如果方案在主流路线上做增量改进，很容易撞上他人已有专利</em>——这也是创新点二出现 87% 相似度的背景原因。</p>
<h3 id="s2-2">2.2　论文态势</h3>
<div class="fig">
<div class="ft">图 2-2　研究关键词热度</div>
<div class="fs">基于 TF-IDF 生成，字号表示热度，括号内为关联论文数；标红为本项目主攻方向</div>
<div class="cloud">
<span style="font-size:31px;color:var(--c1);font-weight:700">矿井水资源化<b>218</b></span>
<span style="font-size:28px;color:var(--c2);font-weight:700">高矿化度<b>176</b></span>
<span style="font-size:25px;color:var(--c3);font-weight:600">浓盐水处理<b>154</b></span>
<span style="font-size:23px;color:var(--c4);font-weight:600">反渗透<b>131</b></span>
<span style="font-size:21px;color:var(--c1)">蒸发结晶<b>118</b></span>
<span style="font-size:20px;color:var(--c5)">膜污堵<b>106</b></span>
<span style="font-size:19px;color:var(--c2)">零排放<b>98</b></span>
<span style="font-size:18px;color:var(--c3)">水质预测<b>87</b></span>
<span style="font-size:17px;color:var(--c4)">深部开采<b>79</b></span>
<span style="font-size:16px;color:var(--c1)">电渗析<b>71</b></span>
<span style="font-size:16px;color:var(--c5)">硫酸盐去除<b>68</b></span>
<span style="font-size:15px;color:var(--c2)">结晶盐纯度<b>65</b></span>
<span style="font-size:15px;color:var(--red);font-weight:700">纳滤分盐<b>62</b></span>
<span style="font-size:14px;color:var(--c3)">井下排水<b>58</b></span>
<span style="font-size:14px;color:var(--c4)">生态回灌<b>53</b></span>
<span style="font-size:13px;color:var(--red);font-weight:700">煤水共采<b>47</b></span>
<span style="font-size:13px;color:var(--c5)">能耗优化<b>41</b></span>
</div>
<div class="fn">论文累计 863 篇，年发表量由 2016 年 52 篇增至 2024 年 136 篇，年均增长 12.8%。核心期刊 512 篇、国际期刊 276 篇。</div>
</div>
<p>研究热度集中在矿井水资源化、高矿化度水处理、浓盐水治理三大方向，与项目主题一致。本项目主攻的「纳滤分盐」（62 篇）与「煤水共采」（47 篇）关联论文数分别为最高频词的 28.4% 与 21.6%。<strong>对你的意义：</strong>论文侧热度不高说明学术关注度相对分散，<em class="hl">写作时可用于论证前沿性</em>；但要注意纳滤分盐虽论文少，专利却多（见 2.3 节），两者结论不同，不能只引论文数据。</p>
<h3 id="s2-3">2.3　技术分支机会图</h3>
<p>把专利与论文放在同一套分支标签下对照，可以看出每个分支处在什么阶段。<em class="hl">专论比</em>（专利数÷论文数）是关键判读指标：比值小于 1 说明研究阶段、创新空间大；比值大于 2 说明已进入工程化，创新应落在工艺与集成层面，而非原理层面。</p>
<div class="tw">
<table>
<caption>八个技术分支的阶段判读，加底色的三行与本项目直接相关</caption>
<thead><tr><th>技术分支</th><th class="n">专利件数</th><th class="n">论文篇数</th><th class="n">专论比</th><th>阶段判读</th><th>对本项目的含义</th></tr></thead>
<tbody>
<tr><td>矿井水处理工艺</td><td class="n">312</td><td class="n">214</td><td class="n">1.46</td><td>技术密集区，研究与转化同步</td><td>非主攻方向</td></tr>
<tr style="background:var(--amberbg)"><td>井下排水与控制</td><td class="n">248</td><td class="n">62</td><td class="n">4.00</td><td><span class="b a">工程化主导</span> 学术空间趋饱和</td><td>创新点一涉及。原理层面已成熟，创新须落在控制逻辑与系统集成</td></tr>
<tr><td>浓盐水资源化</td><td class="n">196</td><td class="n">174</td><td class="n">1.13</td><td>研究与转化并行</td><td>创新点三的上位分支</td></tr>
<tr><td>水质监测预测</td><td class="n">151</td><td class="n">138</td><td class="n">1.09</td><td>研究与转化并行</td><td>可作为创新点一的输入模块</td></tr>
<tr style="background:var(--amberbg)"><td>煤水共采协同</td><td class="n">118</td><td class="n">47</td><td class="n">2.51</td><td><span class="b a">工程化偏向</span> 已越过研究早期</td><td>创新点一所在。体量小但专利已有积累，须在控制逻辑上做出实质差异</td></tr>
<tr><td>结晶盐提纯</td><td class="n">92</td><td class="n">108</td><td class="n">0.85</td><td><span class="b g">研究期</span> 创新空间较大</td><td>可考虑作为创新点二的调整方向</td></tr>
<tr style="background:var(--greenbg)"><td>膜材料抗污堵</td><td class="n">74</td><td class="n">81</td><td class="n">0.91</td><td><span class="b g">研究期</span> 创新空间较大</td><td>本项目关键难题所在，两库排名均靠后，<em class="hlg">是最值得投入的方向</em></td></tr>
<tr><td>生态修复回灌</td><td class="n">56</td><td class="n">39</td><td class="n">1.44</td><td>体量小</td><td>非本项目方向</td></tr>
</tbody>
</table>
</div>
<div class="tip">
<h5>从分支图看到的机会</h5>
<p>膜材料抗污堵（专论比 0.91）与结晶盐提纯（0.85）两个分支专利少于论文，处在研究期，创新空间最大。这两个分支正好覆盖建议书提出的「高含盐条件下膜污堵与结垢机理及抑制方法」这一关键难题。</p>
<p style="margin:0"><strong>建议：</strong>建议书目前把纳滤分盐工艺作为创新点二，落在专利密集的成熟环节上；如果把重心前移到<em class="hl">膜污堵抑制与抗污堵膜材料适配</em>，既贴合已列明的关键技术难题，创新空间也更大。这是第 3.2 节调整思路的数据依据。</p>
</div>
<h3 id="s2-4">2.4　主要研究主体在做什么</h3>
<div class="fig">
<div class="ft">图 2-3　发明专利申请量 TOP5</div>
<div class="fs">近十年累计；申请人已按集团口径归并，绿色为本单位所属集团</div>
<div class="bars">
<div class="bar"><div class="bn">中国矿业大学</div><div class="bt"><div class="bf" style="width:100%;background:var(--c4)"></div></div><div class="bv">98</div></div>
<div class="bar"><div class="bn">国家能源集团</div><div class="bt"><div class="bf" style="width:77.6%;background:var(--c1)"></div></div><div class="bv">76</div></div>
<div class="bar"><div class="bn">中煤能源集团</div><div class="bt"><div class="bf" style="width:58.2%;background:var(--accent)"></div></div><div class="bv">57</div></div>
<div class="bar"><div class="bn">陕煤集团</div><div class="bt"><div class="bf" style="width:48%;background:var(--c1)"></div></div><div class="bv">47</div></div>
<div class="bar"><div class="bn">中科院生态环境中心</div><div class="bt"><div class="bf" style="width:33.7%;background:var(--c4)"></div></div><div class="bv">33</div></div>
</div>
<div class="fn">前五名合计 311 件，占发明专利总量 892 件的三成半，其余六成分散在百余家主体手中。</div>
</div>
<div class="tw">
<table>
<caption>主要主体的研究重点与本项目的关系（供撰写国内外研究现状时参考）</caption>
<thead><tr><th>机构</th><th class="n">发明专利</th><th>研究重点</th><th>与本项目的关系</th></tr></thead>
<tbody>
<tr><td>中国矿业大学</td><td class="n">98</td><td>分盐机理、膜材料、采排协同全链条；2023 年完成两级纳滤分盐中试</td><td><span class="b a">重点关注</span> 创新点二的最相似论文来自该校；创新点一的最相似论文亦来自该校</td></tr>
<tr><td>国家能源集团</td><td class="n">76</td><td>分盐结晶工艺与装置，宁东基地已有工程化落地；2024 年发表纳滤分盐参数优化</td><td><span class="b a">重点关注</span> 与创新点二路线重叠，且已有工程案例</td></tr>
<tr><td>中煤能源集团<br><span class="small">（本单位所属）</span></td><td class="n">57</td><td>疏干水量预测、井下排水调度、矿井水预处理</td><td><span class="b g">可复用</span> CN116105073A 的预测能力可作为创新点一的输入模块</td></tr>
<tr><td>陕煤集团</td><td class="n">47</td><td>排水智能调度装置，井下系统改造</td><td>创新点一的相关方案，控制输入不同</td></tr>
<tr><td>中科院生态环境中心</td><td class="n">33</td><td>抗污堵膜材料表面改性，国际期刊发表活跃</td><td><span class="b g">可合作</span> 膜污堵是本项目关键难题，该所研究国内领先</td></tr>
</tbody>
</table>
</div>
<p><strong>对你的意义：</strong>撰写《二、国内外研究现状》时，上表五家主体的研究重点可直接引用，比泛泛描述「国内外已开展相关研究」更有说服力。两点具体建议：一是中国矿业大学 2023 年的两级纳滤分盐中试研究<em class="hl">必须在研究现状中提及并说明本项目与其区别</em>，否则评审时会被视为遗漏重要现有技术；二是膜污堵方向可考虑与中科院生态环境中心建立合作，写入建议书的合作单位或技术支撑部分。</p>
<div class="ch" id="c3">
  <div class="cn">第三章</div>
  <h2>创新点逐项查新</h2>
  <p class="lead">三个创新点的相似方案清单、逐项技术特征比对、可参考的改进方向</p>
</div>

<h3 id="s3-1">3.1　创新点一　煤水共采协同调控方法</h3>
<div class="card">
<p style="margin:0"><strong>你的方案：</strong>以工作面回采推进度为输入，动态调控井下排水系统负荷，实现回采与排水的时序协同。建立回采推进速度与涌水量响应的耦合模型，在既有井下排水系统上叠加调度控制层。</p>
</div>
<div class="tw">
<table>
<caption>相似度 TOP5 专利（创新点一）</caption>
<thead><tr><th>专利名称</th><th>公开号</th><th class="n">相似度</th><th>法律状态</th><th>权利人</th></tr></thead>
<tbody>
<tr><td>一种煤矿井下排水协同控制系统</td><td>CN114592909A</td><td class="n">71%</td><td><span class="b n">已失效</span></td><td>中国矿业大学</td></tr>
<tr><td>采掘工作面涌水量动态预测方法</td><td>CN113847095B</td><td class="n">66%</td><td><span class="b a">在华有效</span></td><td>国家能源集团</td></tr>
<tr><td>矿井排水系统智能调度装置</td><td>CN115163150A</td><td class="n">58%</td><td><span class="b a">在华有效</span></td><td>陕煤集团</td></tr>
<tr><td>基于水位反馈的矿井排水控制方法</td><td>CN112943308A</td><td class="n">55%</td><td><span class="b a">在华有效</span></td><td>太原理工大学</td></tr>
<tr><td>煤矿疏干水量预测与调度系统</td><td>CN116105073A</td><td class="n">52%</td><td><span class="b a">在华有效</span></td><td>中煤能源集团（本集团）</td></tr>
</tbody>
</table>
</div>
<div class="tw">
<table>
<caption>你的方案与 TOP5 专利的技术特征比对</caption>
<thead><tr><th>比对维度</th><th>现有专利的做法</th><th>你的做法</th><th>判定</th></tr></thead>
<tbody>
<tr><td>控制输入量</td><td>水位、涌水量实测值（CN112943308A、CN113847095B）</td><td>工作面回采推进度 + 涌水量</td><td><span class="b g">有差异</span> 引入采掘工序参数</td></tr>
<tr><td>控制对象</td><td>排水泵组单一环节</td><td>排水系统负荷 + 回采节奏双向调节</td><td><span class="b g">有差异</span> 协同维度更宽</td></tr>
<tr><td>响应方式</td><td>被动反馈（水位超限后启泵）</td><td>前馈预测（按回采计划预调排水能力）</td><td><span class="b g">有差异</span> 控制逻辑不同</td></tr>
<tr><td>性能指标</td><td>CN113847095B 披露涌水量预测精度 85%</td><td>建议书未给出量化指标</td><td><span class="b a">无法比对</span> 建议补充</td></tr>
</tbody>
</table>
</div>
<div class="box g">
<h5>查新结论：技术路线与现有方案不同，可保留</h5>
<p>五件对比专利相似度均低于 75%，未见同类方案。控制输入量与响应方式两个<em class="hlg">技术手段维度</em>上与现有专利均不同，构成实质性差异。相似度最高的 CN114592909A（71%）已失效，其公开内容属现有技术，可自由使用，但不能作为你的新颖性依据。论文侧最高相似度 68%（煤炭学报 2024，采掘工序与排水负荷协同优化），停留在理论建模层面，未涉及工程实现与控制系统落地——<em class="hlg">工程化实现是你的空间</em>。</p>
<p style="margin:0"><strong>须补充的一项：</strong>对比专利 CN113847095B 已披露涌水量预测精度 85%，而你的建议书对本创新点没有任何量化指标。评审时会被问「凭什么说比现有技术好」。建议在《四、预期成果》补充 2—3 项可考核指标，例如：协同调控后排水系统能耗降幅（%）、涌水量预测与实际的匹配精度（%）、排水负荷响应时间（min）。</p>
</div>
<h3 id="s3-2">3.2　创新点二　高含盐矿井水纳滤分盐工艺</h3>
<div class="card">
<p style="margin:0"><strong>你的方案：</strong>针对矿化度 8,000—15,000 mg/L 的矿井水，采用两级纳滤实现一价盐与二价盐分离，提升后续蒸发结晶所得结晶盐纯度。两级纳滤串联并配置浓水回流，衔接蒸发结晶工序，结晶盐纯度目标 ≥98.5%。</p>
</div>
<div class="box a">
<h5>这是本次查新最需要你处理的一项</h5>
<p style="margin:0">专利侧最高相似度 <strong>87%</strong>（CN112794520B，在华有效），论文侧 <strong>83%</strong>（煤炭学报 2023，已完成中试）。<em class="hl">两库共同指向该技术路线已被充分开发</em>。下面先看具体像在哪里，再看两条可行的调整思路。</p>
</div>
<div class="tw">
<table>
<caption>相似度 TOP5（创新点二，专利与论文合并排序）</caption>
<thead><tr><th>名称</th><th>公开号／来源</th><th class="n">相似度</th><th>法律状态</th><th>权利人／机构</th></tr></thead>
<tbody>
<tr style="background:var(--redbg)"><td><strong>一种高盐废水纳滤分盐资源化方法</strong></td><td>CN112794520B</td><td class="n"><strong>87%</strong></td><td><span class="b r">在华有效</span></td><td>某环保科技（民营）</td></tr>
<tr><td>矿井水两级纳滤分盐中试研究</td><td>煤炭学报 2023</td><td class="n">83%</td><td><span class="b n">学术论文</span></td><td>中国矿业大学</td></tr>
<tr><td>浓盐水分盐结晶工艺及装置</td><td>CN114212881A</td><td class="n">79%</td><td><span class="b a">在华有效</span></td><td>国家能源集团</td></tr>
<tr><td>一种含盐废水一价二价盐分离系统</td><td>CN113087246A</td><td class="n">76%</td><td><span class="b a">在华有效</span></td><td>某水务集团（国企）</td></tr>
<tr><td>纳滤-反渗透联用高盐水处理方法</td><td>CN111960574A</td><td class="n">72%</td><td><span class="b n">已失效</span></td><td>太原理工大学</td></tr>
</tbody>
</table>
</div>
<div class="tw">
<table>
<caption>逐项技术特征比对：你的方案 vs CN112794520B（相似度 87%）</caption>
<thead><tr><th>比对维度</th><th>CN112794520B 披露方案</th><th>你的方案</th><th>判定</th></tr></thead>
<tbody>
<tr><td>分离原理</td><td>纳滤膜对一价／二价离子选择透过性差异</td><td>纳滤膜对一价／二价离子选择透过性差异</td><td><span class="b r">相同</span></td></tr>
<tr><td>工艺配置</td><td>两级纳滤串联</td><td>两级纳滤串联</td><td><span class="b r">相同</span></td></tr>
<tr><td>浓水处理</td><td>浓水回流至前级进水</td><td>浓水回流至前级进水</td><td><span class="b r">相同</span></td></tr>
<tr><td>后段衔接</td><td>蒸发结晶产出工业级结晶盐</td><td>蒸发结晶产出工业级结晶盐</td><td><span class="b r">相同</span></td></tr>
<tr><td>进水适用范围</td><td>高盐废水，未限定矿化度区间与来源</td><td>矿井水，矿化度 8,000—15,000 mg/L</td><td><span class="b a">范围收窄</span> 属应用场景限定，非技术手段差异</td></tr>
<tr><td>结晶盐纯度</td><td>≥98.2%</td><td>≥98.5%</td><td><span class="b a">略优</span> 高 0.3 个百分点</td></tr>
</tbody>
</table>
</div>
<p>四个技术手段维度完全一致，这是 87% 相似度的具体构成。两项差异都不构成技术手段创新：<em class="hl">限定进水矿化度区间属应用场景收窄</em>，在原理与工艺不变的前提下不产生新的技术效果；<em class="hl">结晶盐纯度高 0.3 个百分点属同一工艺的参数优化幅度</em>，不足以支撑先进性主张。对照创新点一——那一项在控制输入量与响应方式两个手段维度上与对比专利不同，这是两个创新点查新结论差异的根本原因。</p>
<h3 id="s3-3">3.3　创新点三　浓盐水零排放经济性优化模型</h3>
<div class="card">
<p style="margin:0"><strong>你的方案：</strong>以能耗与药剂成本为约束，建立浓盐水处置路径的经济性优化模型。将处置路径选择转化为多约束最优化问题，以单位处理成本为目标函数，构建包含膜通量衰减、药剂投加量、蒸发能耗等参数的成本模型并求解最优路径组合。</p>
</div>
<div class="tw">
<table>
<caption>相似度 TOP5 专利与论文（创新点三）</caption>
<thead><tr><th>名称</th><th>公开号／来源</th><th class="n">相似度</th><th>类型</th><th>权利人／机构</th></tr></thead>
<tbody>
<tr><td>矿井水零排放工艺全生命周期成本分析</td><td>煤炭工程 2024</td><td class="n">58%</td><td>论文</td><td>煤炭科学研究总院</td></tr>
<tr><td>一种废水处理系统能耗优化方法</td><td>CN115271262A</td><td class="n">54%</td><td>专利（在华有效）</td><td>清华大学</td></tr>
<tr><td>浓盐水处置技术经济性比较研究</td><td>化工环保 2023</td><td class="n">52%</td><td>论文</td><td>河海大学</td></tr>
<tr><td>Techno-economic assessment of ZLD systems</td><td>Desalination 2022</td><td class="n">49%</td><td>论文</td><td>中科院生态环境中心</td></tr>
<tr><td>高盐废水处理工艺经济性评价方法</td><td>CN113888345A</td><td class="n">48%</td><td>专利（在华有效）</td><td>某环境工程院（国企）</td></tr>
</tbody>
</table>
</div>
<h3 id="s3-4">3.4　院内与集团已有积累（专利库＋知识库综合比对）</h3>
<p>这一节回答两个问题：<strong>你的方案会不会跟集团内已有成果重复</strong>，以及<strong>集团内有哪些成果可以直接复用</strong>。比对从两个维度进行：<strong>①专利库维度</strong>——中煤能源集团在本技术主题下的 57 件自有专利；<strong>②知识库维度</strong>——你上传的知识库文件（历史立项书、专利简报等），补充专利库查不到的在研或已结题课题。知识库内容越完整，查重越可靠。</p>
<div class="tw">
<table>
<caption>专利库维度：中煤集团自有专利中与本项目相关的 7 件（相似度 ≥20%）</caption>
<thead><tr><th>专利名称</th><th>公开号</th><th>权利人（二级单位）</th><th>法律状态</th><th>对应创新点</th><th class="n">相似度</th><th>可复用性</th></tr></thead>
<tbody>
<tr><td>煤矿疏干水量预测与调度系统</td><td>CN116105073A</td><td>中煤科工集团西安研究院</td><td><span class="b a">在华有效</span></td><td>创新点一</td><td class="n">52%</td><td><span class="b g">可直接复用</span> 预测模块</td></tr>
<tr><td>一种矿井水井下预处理装置</td><td>CN115093056A</td><td>中煤（深圳）研究院</td><td><span class="b a">在华有效</span></td><td>创新点二前段</td><td class="n">48%</td><td><span class="b g">可复用</span> 本院自有</td></tr>
<tr><td>矿井排水泵组节能控制方法</td><td>CN114384830A</td><td>中煤科工集团上海研究院</td><td><span class="b a">在华有效</span></td><td>创新点一</td><td class="n">44%</td><td>可参考</td></tr>
<tr><td>高盐矿井水反渗透浓水处置方法</td><td>CN113786731A</td><td>中煤（深圳）研究院</td><td><span class="b a">在华有效</span></td><td>创新点二</td><td class="n">41%</td><td><span class="b g">可复用</span> 本院自有</td></tr>
<tr><td>矿区水资源循环利用系统</td><td>CN112919581A</td><td>中煤能源集团（本部）</td><td><span class="b n">已失效</span></td><td>创新点三（弱）</td><td class="n">33%</td><td>可自由使用</td></tr>
<tr><td>井下水仓水位智能监测装置</td><td>CN214093921U</td><td>中煤科工集团西安研究院</td><td><span class="b a">在华有效</span></td><td>创新点一（弱）</td><td class="n">29%</td><td>可参考硬件方案</td></tr>
<tr><td>矿井水悬浮物混凝沉降工艺</td><td>CN111470677A</td><td>中煤（深圳）研究院</td><td><span class="b a">在华有效</span></td><td>无对应</td><td class="n">21%</td><td>常规预处理</td></tr>
</tbody>
</table>
</div>
<div class="tw">
<table>
<caption>知识库维度：你上传的历史立项书、专利简报与本项目创新点的比对（相似度 ≥20%）</caption>
<thead><tr><th>文件名称</th><th>文件类型</th><th>形成时间</th><th>对应创新点</th><th class="n">相似度</th><th>可复用性</th></tr></thead>
<tbody>
<tr><td>《矿井排水智能调度关键技术研究》立项书</td><td>历史立项书</td><td>2022-09</td><td>创新点一</td><td class="n">46%</td><td>可参考调度逻辑，未纳入回采推进参数</td></tr>
<tr><td>纳滤分盐工艺技术跟踪简报（第 7 期）</td><td>专利简报</td><td>2024-03</td><td>创新点二</td><td class="n">39%</td><td>外部动态跟踪材料，可作背景引用</td></tr>
<tr><td>《高盐矿井水资源化利用可行性研究》立项书</td><td>历史立项书</td><td>2021-05</td><td>创新点二（弱）／创新点三（弱）</td><td class="n">28%</td><td>停留于可行性论证，未形成技术方案</td></tr>
<tr class="sum"><td colspan="4">你上传的知识库文件全量比对，上表列示相似度 ≥20% 的 3 件</td><td class="n">最高 46%</td><td><strong>未发现重复</strong></td></tr>
</tbody>
</table>
</div>
<div class="ch" id="c4">
  <div class="cn">第四章</div>
  <h2>政策查新</h2>
  <p class="lead">可引用的支持性政策原文与支持强度判定</p>
</div>

<h3 id="s4-1">4.1　可引用的支持性政策</h3>
<p>下表政策可直接引用于建议书《一、研究意义及必要性》。<em class="hl">引用时务必落到具体研究内容，并附政策原文表述</em>——只写「符合国家政策导向」这类泛化表述，在评审中不构成有效依据。</p>
<div class="tw" style="margin-bottom:14px">
<table>
<caption>支持强度三档判定标准——同时满足同一行的全部条件才能落该档</caption>
<thead><tr><th style="width:80px">支持强度</th><th>措辞强度</th><th>挂接精度</th><th>层级要求</th><th>典型措辞示例</th></tr></thead>
<tbody>
<tr><td><span class="b g">强支持</span></td><td>强制性或专项性动词：<strong>列为重点攻关方向、专项支持、重点推进、明确要求</strong></td><td>能挂到本项目的<strong>具体研究内容编号</strong>（不是整个技术领域）</td><td>国家专项／集团制度均可；行业规划须措辞极强</td><td>「将高矿化度矿井水分盐资源化<u>列为重点攻关方向</u>」</td></tr>
<tr><td><span class="b a">一般支持</span></td><td>鼓励性动词：<strong>鼓励、推动、支持、引导</strong></td><td>能挂到具体研究内容，但为方向性鼓励而非专项部署</td><td>行业规划、地方政策、国家规划中的专项章节</td><td>「<u>鼓励</u>零排放技术示范」「<u>支持</u>井下辅助生产系统智能化调控」</td></tr>
<tr><td><span class="b n">弱相关</span></td><td>仅提及上位领域或一般性目标，未点名具体技术方向</td><td>只能挂到<strong>上位领域</strong>，无法落到具体研究内容</td><td>任何层级均可落此档，层级不决定是否弱相关</td><td>「加强流域水资源节约集约利用」「推进工业废水循环利用」</td></tr>
</tbody>
</table>
</div>
<div class="tw">
<table>
<caption>直接对应本项目的政策 5 件，按支持强度排序；括可挂接的研究内容</caption>
<thead><tr><th>政策名称</th><th>发布机构</th><th>时间</th><th>层级</th><th>可引用的原文表述</th><th>对应研究内容</th></tr></thead>
<tbody>
<tr><td>关于加强黄河流域矿井水保护利用的指导意见</td><td>水利部、国家发改委</td><td>2024-03</td><td>国家专项</td><td>「将高矿化度矿井水分盐资源化列为重点攻关方向」</td><td>（2）（3）</td></tr>
<tr><td>中煤集团年度科技攻关方向指南</td><td>中国中煤能源集团</td><td>2026-01</td><td>集团制度</td><td>「水资源综合利用列为年度重点攻关方向」</td><td>（1）（2）（3）</td></tr>
<tr><td>煤炭工业「十四五」高质量发展指导意见</td><td>中国煤炭工业协会</td><td>2021-06</td><td>行业规划</td><td>「推动矿井水资源化利用，鼓励零排放技术示范」</td><td>（2）（4）</td></tr>
<tr><td>关于推进煤矿智能化建设的指导意见</td><td>国家能源局</td><td>2023-08</td><td>行业规划</td><td>「支持井下辅助生产系统智能化调控」</td><td>（1）</td></tr>
<tr><td>黄河流域生态保护和高质量发展规划纲要</td><td>中共中央、国务院</td><td>2021-10</td><td>国家规划</td><td>「加强流域水资源节约集约利用」</td><td>上位领域，作背景引用</td></tr>
</tbody>
</table>
</div>
<div class="tip">
<h5>政策趋势数据（可用于论证必要性）</h5>
<p style="margin:0">相关政策发布量近五年由 2021 年 4 件增至 2025 年 13 件，年均增长 <em class="hl">34.2%</em>；国家层级政策占比稳定在半数以上，集团层级自 2024 年起出现。政策增速（34.2%）高于专利增速（20.3%）与论文增速（12.8%），三条曲线同向上升——<strong>这组对比可以直接写进必要性论述</strong>，说明政策推动、学术研究与工程转化同步推进，不是政策空转。</p>
</div>

<div class="ch" id="c5">
  <div class="cn">第五章</div>
  <h2>建议书修改建议</h2>
  <p class="lead">提交前自查清单</p>
</div>

<h3 id="s5-1">5.1　提交前自查清单</h3>
<p>修改完成后按下表逐项自查，全部勾选后再提交评审。</p>
<div class="tw">
<table>
<thead><tr><th style="width:34px">☐</th><th>自查项</th><th>判断标准</th></tr></thead>
<tbody>
<tr><td class="n">1</td><td>三个创新点是否都写清了「与谁不同、不同在哪个技术维度」</td><td>每个创新点至少列出 1 件最相似的现有方案，并说明技术手段层面的差异；仅说明应用场景不同或指标略优不算</td></tr>
<tr><td class="n">2</td><td>创新点二是否已完成差异化说明或重新定位</td><td>需在技术手段层面做出实质改变，或改为工程适配定位并使用「工程化适配」「集成优化」等表述，避免「首创」「原创性突破」等与查新结果不符的说法</td></tr>
<tr><td class="n">3</td><td>每个创新点是否都有可量化的性能指标</td><td>三个创新点各有至少 1 项可考核指标，且优于已检索到的对比方案披露值</td></tr>
<tr><td class="n">4</td><td>立项时指标与预期完成指标是否都标明来源、且不相同</td><td>四项指标两列数值均有出处、口径一致，无两列相同的情形</td></tr>
<tr><td class="n">5</td><td>成本指标是否附测算依据</td><td>有成本分项构成表，口径（是否含折旧人工）已说明</td></tr>
<tr><td class="n">6</td><td>研究现状是否覆盖了本报告列出的高相似度方案</td><td>CN112794520B、CN113087246A、煤炭学报 2023 中试研究均已提及</td></tr>
<tr><td class="n">7</td><td>是否写明对集团内已有成果的复用</td><td>CN116105073A 及本院两件专利的衔接关系已说明</td></tr>
<tr><td class="n">8</td><td>风险分析是否覆盖技术路线重叠风险</td><td>已写明分盐环节的外部布局密度与集团内积累薄弱，并给出应对方式</td></tr>
<tr><td class="n">9</td><td>是否已向院科技管理部门核对历史课题</td><td>专利库无法覆盖院内立项台账，须自行确认与在研及已结题课题不重复</td></tr>
<tr><td class="n">10</td><td>技术主题锚点是否与实际方案一致</td><td>核对 1.1 节的核心技术词与排除词，如有偏差请反馈后重新检索</td></tr>
</tbody>
</table>
</div>
<div class="card" style="margin-top:32px">
<p class="small" style="margin:0">本报告基于公开可检索的专利、论文与政策数据，结合所提交的《立项建议书》文本自动生成。检索截止 2026 年 6 月 30 日，覆盖专利 1,247 件、论文 863 篇、政策文件 47 件。专利数据来源为智慧芽全球专利库，论文数据来源为万方本地镜像库并经中英文双语检索式召回。</p>
<p class="small" style="margin:9px 0 0">受数据库收录范围与专利公开滞后影响，<strong>检索未命中不等于相关技术不存在</strong>。相似度为技术特征逐项比对的计算结果，供判断参考，不构成专利侵权或新颖性的法律结论；如需用于专利申请决策，建议另行委托专业查新或 FTO 检索。政策部分停留在文件层面，未做条款级比对，不构成合规性结论。</p>
<p class="small" style="margin:9px 0 0"><strong>本报告不含评级与打分，不作立项判定</strong>，仅供申报人在提交评审前自查与完善建议书使用。</p>
<p class="small" style="margin:9px 0 0;color:var(--ink3)">中煤（深圳）研究院　科研课题智能评审平台　·　示例数据，仅供演示</p>
</div>
</div>
`

export const innovationResearchReport = {
  id: 'research',
  navLabel: '研发版分析报告',
  version: '研发人员版',
  reportNo: 'ZMSZ-CX-2026-0817',
  title: '煤炭资源开采过程伴随大量高矿化度涌水问题研究立项查新与建议书完善报告',
  outline: [
    {
      "id": "c1",
      "label": "一查新概要"
    },
    {
      "id": "s1-1",
      "label": "1.1 检索范围与技术主题"
    },
    {
      "id": "s1-2",
      "label": "1.2 三个创新点查新结果速览"
    },
    {
      "id": "c2",
      "label": "二技术领域现状"
    },
    {
      "id": "s2-1",
      "label": "2.1 专利态势"
    },
    {
      "id": "s2-2",
      "label": "2.2 论文态势"
    },
    {
      "id": "s2-3",
      "label": "2.3 技术分支机会图"
    },
    {
      "id": "s2-4",
      "label": "2.4 主要研究主体在做什么"
    },
    {
      "id": "c3",
      "label": "三创新点逐项查新"
    },
    {
      "id": "s3-1",
      "label": "3.1 创新点一 煤水共采协同调控"
    },
    {
      "id": "s3-2",
      "label": "3.2 创新点二 纳滤分盐工艺"
    },
    {
      "id": "s3-3",
      "label": "3.3 创新点三 经济性优化模型"
    },
    {
      "id": "s3-4",
      "label": "3.4 院内与集团已有积累（专利库＋知识库）"
    },
    {
      "id": "c4",
      "label": "四政策查新"
    },
    {
      "id": "s4-1",
      "label": "4.1 可引用的支持性政策"
    },
    {
      "id": "c5",
      "label": "五建议书修改建议"
    },
    {
      "id": "s5-1",
      "label": "5.1 自查清单"
    }
  ],
  documentHtml: researchDocumentHtml,
}

export const innovationReviewReport = {
  id: 'review',
  navLabel: '评审版分析报告',
  version: '评审专家版',
  reportNo: 'ZMSZ-YS-2026-0817',
  title: '煤炭资源开采过程伴随大量高矿化度涌水问题研究立项审查报告',
  outline: [
    {
      "id": "c1",
      "label": "一项目概述"
    },
    {
      "id": "c2",
      "label": "二项目整体分析"
    },
    {
      "id": "s2-1",
      "label": "2.1 研究技术主题"
    },
    {
      "id": "s2-2",
      "label": "2.2 专利检索与分析"
    },
    {
      "id": "s2-3",
      "label": "2.3 论文检索与分析"
    },
    {
      "id": "s2-4",
      "label": "2.4 领域技术趋势总结"
    },
    {
      "id": "c3",
      "label": "三创新点分析"
    },
    {
      "id": "s3-1",
      "label": "3.1 创新点一 煤水共采协同调控方法"
    },
    {
      "id": "s3-2",
      "label": "3.2 创新点二 高含盐矿井水纳滤分盐工艺"
    },
    {
      "id": "s3-3",
      "label": "3.3 创新点三 浓盐水零排放经济性优化模型"
    },
    {
      "id": "s3-4",
      "label": "3.4 集团自有专利与知识库综合比对（重复立项判断）"
    },
    {
      "id": "c4",
      "label": "四政策分析"
    },
    {
      "id": "s4-0",
      "label": "4.1 政策数据分类与覆盖范围"
    },
    {
      "id": "s4-1",
      "label": "4.2 政策全景与趋势分析"
    },
    {
      "id": "s4-3",
      "label": "4.3 政策支持清单"
    },
    {
      "id": "s4-4",
      "label": "4.4 政策维度结论"
    },
    {
      "id": "c5",
      "label": "五审查建议"
    },
    {
      "id": "s5-1",
      "label": "5.1 行业发展趋势契合度评估"
    },
    {
      "id": "s5-2",
      "label": "5.2 主要竞争主体及研究进展总结"
    },
    {
      "id": "s5-3",
      "label": "5.3 行业机遇与挑战总结"
    },
    {
      "id": "c6",
      "label": "六项目评级"
    },
    {
      "id": "s6-2",
      "label": "6.1 二级量化指标计分"
    },
    {
      "id": "s6-3",
      "label": "6.2 等级映射与置信度"
    },
    {
      "id": "s6-4",
      "label": "6.3 评分汇总"
    },
    {
      "id": "s6-5",
      "label": "6.4 建议补充完善的事项"
    }
  ],
  documentHtml: innovationReviewReportV8Html,
}

export const innovationReports = {
  research: innovationResearchReport,
  review: innovationReviewReport,
}

