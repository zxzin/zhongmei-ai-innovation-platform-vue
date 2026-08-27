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

const reviewDocumentHtml = String.raw`
<div class="wrap">
<div class="cover">
  <div class="tag">中煤（深圳）研究院 · 科研课题智能评审平台</div>
  <h1>煤炭资源开采过程伴随大量高矿化度涌水问题研究<br>立项审查报告</h1>
  <div class="sub">依据《立项建议书》文本，结合专利、论文、政策三库检索数据，对项目的技术领域态势、竞争格局、创新性、政策契合度与承接能力五个维度作出评估，输出量化评分与需专家关注的事项。<br><span style="font-size:13px;opacity:.8">本报告为评审辅助材料，仅提供数据依据与评分参考，立项与否由评审专家及决策机构判定。</span></div>
  <dl class="meta">
    <div><dt>报告编号</dt><dd>ZMSZ-YS-2026-0817</dd></div>
    <div><dt>报告版本</dt><dd>评审专家版</dd></div>
    <div><dt>申报部门</dt><dd>矿山生态环境研究所</dd></div>
    <div><dt>执行期限</dt><dd>36 个月</dd></div>
    <div><dt>数据截止</dt><dd>2026-06-30</dd></div>
    <div><dt>生成日期</dt><dd>2026-08-17</dd></div>
  </dl>
</div>

<div class="verdict">
  <div class="grade">
    <div class="g" style="color:var(--green)">B</div>
    <div class="gl">项目评级</div>
    <div class="sc">74.0<span> ／100</span></div>
    <div class="note" style="color:var(--ink3)">评分依据见第六章</div>
  </div>
  <div class="kpis">
    <div class="kpi"><div class="kl">技术领域态势</div><div class="kv">活跃增长<small> 16.0／20</small></div><div class="kd">专利增速达标、论文增速未达 15%；预期成果成熟度暂按较高档，待专家确认</div></div>
    <div class="kpi"><div class="kl">竞争格局</div><div class="kv">第 3 位<small> ／118 家</small></div><div class="kd">中煤 57 件发明专利，申请人由 41 家增至 118 家，竞争激烈</div></div>
    <div class="kpi"><div class="kl">创新性</div><div class="kv">15.4<small> ／30</small></div><div class="kd">创新点二相似度 87%，为全项最低分维度</div></div>
    <div class="kpi"><div class="kl">政策契合度</div><div class="kv">强支持<small> 20.0／20</small></div><div class="kd">国家专项与集团攻关指南均列为重点方向</div></div>
    <div class="kpi"><div class="kl">承接能力</div><div class="kv">13.6<small> ／15</small></div><div class="kd">近五年连续积累，与建议书自述一致</div></div>
    
  </div>
</div>

<div class="ch" id="c1">
  <div class="cn">第一章</div>
  <h2>项目概述</h2>
  <p class="lead">数据来源：《立项建议书》项目基本信息表、一、研究意义及必要性、三、主要研究内容、四、预期成果</p>
</div>

<div class="card">
<p>本项目聚焦矿山生态环境板块下的矿井水处理方向，具体面向高矿化度矿井水资源化利用。蒙陕矿区随开采深度增加，矿井涌水量与矿化度同步上升，部分矿井涌水含盐量已达 <em class="hl">8,000—15,000 mg/L</em>，常规预处理加反渗透工艺出水难以稳定达标，浓盐水与结晶盐处置缺乏成熟路径。高含盐条件下的膜污堵与结垢、煤水混杂采场的排水协同控制、浓盐水零排放的经济性三方面难题尚未解决，直接制约矿区水资源循环利用与达标排放，并影响矿井生产接续。</p>
<p>项目拟采用<em class="hl">煤水共采协同调控与矿井水分盐资源化技术路线</em>，通过工作面回采、井下排水与地面处理三段联动，以回采推进度为输入动态调控井下排水系统负荷，并采用两级纳滤实现一价盐与二价盐分离，区别于现有单一排水环节控制与常规反渗透工艺。项目目标为形成适用于深部矿区高矿化度矿井水的协同调控与分盐资源化技术体系，实现高比例回用与结晶盐资源化，并建成工业示范。</p>
</div>

<h3>关键指标对照</h3>
<div class="tw">
<table>
<caption>两列指标均逐项标注取值出处；凡建议书未载明者一律标为「建议书未载明」，不作推算</caption>
<thead><tr><th>指标名称</th><th class="n">立项时指标</th><th>立项时指标出处</th><th class="n">预期完成指标</th><th>预期完成指标出处</th><th>核实结论</th></tr></thead>
<tbody>
<tr><td>矿井水回用率</td><td class="n">62%</td><td>《一、研究意义及必要性》第 2 段，申报方自述示范矿井现状值</td><td class="n">≥88%</td><td>《四、预期成果》技术指标表第 1 行</td><td><span class="b g">来源明确</span> 两列均出自建议书</td></tr>
<tr><td>结晶盐纯度</td><td class="n">92%</td><td>《二、（一）国内外研究现状》第 3 段，申报方自述现有工艺水平</td><td class="n">≥98.5%</td><td>《四、预期成果》技术指标表第 2 行</td><td><span class="b g">来源明确</span> 两列均出自建议书</td></tr>
<tr><td>单位处理成本</td><td class="n">18.6 元/m³</td><td>《八、经费估算》说明段落，口径为示范矿井现行运行成本</td><td class="n">≤13 元/m³</td><td>《四、预期成果》技术指标表第 3 行</td><td><span class="b a">口径待核</span> 立项时值取自经费章节而非现状章节，与回用率、纯度两项不同章，是否同一测算口径建议核实</td></tr>
<tr><td>工业示范</td><td class="n">无示范工程</td><td>《一、研究意义及必要性》第 4 段</td><td class="n">建成 1 项</td><td>《四、预期成果》成果形式表；要求稳定运行不少于 6 个月</td><td><span class="b g">来源明确</span> 属定性指标，无对比基准</td></tr>
</tbody>
</table>
</div>

<div class="box i">
<h5>指标数据来源核实说明</h5>
<p>上表两列指标<strong>全部出自《立项建议书》原文，无外部数据代入、无系统推算</strong>。其中「预期完成指标」四项集中取自《四、预期成果》；「立项时指标」分散于《一、研究意义及必要性》《二、（一）国内外研究现状》《八、经费估算》三处，均为申报方自述值。</p>
<p style="margin:0">须提示两点：一是「立项时指标」为申报方单方自述，本平台未获取示范矿井实测数据予以交叉验证，其真实性建议由评审专家结合现场情况判断；二是单位处理成本的立项时值（18.6 元/m³）取自经费估算章节，与其余三项不在同一章节，是否采用同一成本口径（是否含折旧、人工）建议书未说明，<em class="hl">建议要求申报方补充测算口径</em>。行业对比基准方面，回用率 85%、结晶盐纯度 98% 两项系建议书自行披露的行业水平，本平台未在检索库中核到同口径公开数据，引用时按「建议书披露」标注。</p>
</div>

<h3>拟解决的关键技术难题与预期成果</h3>
<div class="two">
<div class="card" style="margin:0">
<h5 style="margin-top:0">拟解决的关键技术难题</h5>
<p style="margin:0 0 8px">1. 高含盐条件下的膜污堵与结垢机理及抑制方法</p>
<p style="margin:0 0 8px">2. 煤水混杂采场环境下回采推进与排水负荷的时序耦合控制</p>
<p style="margin:0">3. 浓盐水零排放路径的经济性约束</p>
</div>
<div class="card" style="margin:0">
<h5 style="margin-top:0">预期成果</h5>
<p style="margin:0 0 8px">发明专利 6 项、核心期刊论文 4 篇</p>
<p style="margin:0 0 8px">新技术/工艺 3 项、工业示范 1 项</p>
<p style="margin:0 0 8px">研究报告 1 项</p>
<p class="small" style="margin:0">申报方自述整体水平为国内领先</p>
</div>
</div>
<div class="ch" id="c2">
  <div class="cn">第二章</div>
  <h2>项目整体分析</h2>
  <p class="lead">研究技术主题界定 · 专利检索与分析 · 论文检索与分析 · 领域技术趋势总结</p>
</div>

<h3 id="s2-1">2.1　研究技术主题</h3>
<div class="card">
<p>本项目研究技术主题归纳为两个方向，作为专利、论文、政策三库检索的统一锚点。</p>
<h5>主题一　煤炭资源开采过程伴随大量高矿化度涌水的治理问题</h5>
<p>煤炭开采随深度增加，矿井涌水量与矿化度同步上升，涌水含盐量达 8,000—15,000 mg/L，常规预处理加反渗透工艺出水难以稳定达标。该问题涉及涌水减量、高含盐水处理、浓盐水分盐与结晶盐提纯等技术环节，其中高含盐条件下的膜污堵与结垢是核心技术障碍。</p>
<p class="small">核心技术词：高矿化度矿井水、矿井涌水、浓盐水处理、纳滤分盐、膜污堵与结垢、结晶盐提纯<br>
英文对应词：high-salinity mine water、high TDS mine water、brine treatment、nanofiltration salt separation、membrane fouling and scaling<br>
排除词：海水淡化（盐分组成与矿井水差异大，工艺参数不可比）；市政污水处理（水质特征与处理目标不同）；煤化工废水（污染物以有机物为主）<br>
对应研究内容：研究内容第（2）（3）项；创新点（2）（3）</p>
<h5>主题二　煤水混杂采场环境下工作面回采与井下排水的协同控制问题</h5>
<p>在煤水混杂的采场作业环境中，工作面回采推进与井下排水负荷缺乏时序耦合，排水系统按固定工况运行，难以匹配回采过程中涌水量的动态变化。该问题涉及回采推进度感知、排水负荷动态调控、井下水处理设施布置与排水系统调度等技术环节。</p>
<p class="small">核心技术词：煤水共采、井下排水调控、回采推进与排水协同、涌水量动态预测<br>
英文对应词：coal-water co-mining、mine drainage control、water inflow prediction<br>
排除词：地面污水泵站控制（应用场景与约束条件不同）；矿井通风系统调控（技术对象非水系统）<br>
对应研究内容：研究内容第（1）项；创新点（1）</p>
</div>

<h3 id="s2-2">2.2　专利检索与分析</h3>
<p>以上述两个技术主题为锚点，近十年（2016—2025）共召回相关专利 <em class="hl">1,247 件</em>，其中发明 892 件、实用新型 355 件。趋势分析采用专利申请总量（发明与实用新型合计），并另列发明专利曲线作为对照，以区分技术含量结构变化。</p>

<h4>（1）专利数量与年度分布</h4>
<div class="fig">
<div class="ft">图 2-1　近十年专利申请量年度趋势（申请年／公开年双口径）</div>
<div class="fs">纵轴为专利年度申请量（发明+实用新型）；虚线为公开年辅助曲线</div>
<svg viewBox="0 0 700 250" role="img" aria-label="专利申请量年度趋势折线图，申请总量由2016年56件增至2023年204件，其中发明专利由38件增至149件">
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
<g fill="var(--c1)"><circle cx="70" cy="164.0" r="3"/><circle cx="138" cy="157.6" r="3"/><circle cx="206" cy="147.3" r="3"/><circle cx="274" cy="133.8" r="3"/><circle cx="342" cy="119.0" r="3"/><circle cx="410" cy="104.9" r="3"/><circle cx="478" cy="90.7" r="3"/><circle cx="546" cy="68.9" r="3"/></g>
<text x="546" y="59.900000000000006" fill="var(--c1)" font-size="11" font-weight="700" text-anchor="middle">204</text>
<text x="70" y="155.0" fill="var(--ink3)" font-size="10" text-anchor="middle">56</text>
<text x="546" y="119.2" fill="var(--c4)" font-size="10" text-anchor="middle">149</text>
<rect x="590" y="20" width="92" height="182" fill="var(--amber)" opacity="0.07"/>
<text x="636" y="36" fill="var(--amber)" font-size="9.5" text-anchor="middle">数据不完整区</text>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="70" y="220">2016</text><text x="138" y="220">2017</text><text x="206" y="220">2018</text>
<text x="274" y="220">2019</text><text x="342" y="220">2020</text><text x="410" y="220">2021</text>
<text x="478" y="220">2022</text><text x="546" y="220">2023</text><text x="614" y="220">2024</text>
<text x="682" y="220">2025</text></g>
</svg>
<div class="lg"><span><i style="background:var(--c1)"></i>申请总量（发明+实用新型）</span><span><i style="background:var(--c4)"></i>其中发明专利</span><span><i style="background:var(--c2)"></i>公开年总量（辅助）</span></div>
<div class="fn">增长率按申请总量计算，发明与实用新型均纳入统计，另列发明专利曲线以观察申请结构变化。近 2 年数据受专利公开滞后影响，不作趋势判定依据；如需观察近期动向，以公开年曲线为准——公开年口径无滞后问题，2024—2025 年仍呈上升，说明申请活跃度并未真实下降。</div>
</div>
<p>专利申请总量由 2016 年 56 件增至 2023 年 204 件，年均增长 <em class="hl">20.3%</em>；其中发明专利由 38 件增至 149 件，年均增长 21.6%，增速高于实用新型，说明申请结构<em class="hl">向高技术含量一侧倾斜</em>。与本主题前五年均值相比，近五年专利总量增长 62%，处于<em class="hl">技术上升期</em>。申请人数量由 2016 年 41 家增至 2023 年 118 家，逐年增多，说明该方向活跃度强、同时竞争趋于激烈。</p>
<div class="fig">
<div class="ft">图 2-2　专利技术分支聚类分布</div>
<div class="fs">圆面积表示该技术分支的专利数量；分支标签由专利与论文合集统一聚类后生成，共 8 个分支</div>
<div class="bub">
<div style="width:118px;height:118px;background:var(--c1)"><span>矿井水处理工艺</span><b>312</b></div>
<div style="width:106px;height:106px;background:var(--c2)"><span>井下排水与控制</span><b>248</b></div>
<div style="width:94px;height:94px;background:var(--c3)"><span>浓盐水资源化</span><b>196</b></div>
<div style="width:83px;height:83px;background:var(--c4)"><span>水质监测预测</span><b>151</b></div>
<div style="width:73px;height:73px;background:var(--c5)"><span>煤水共采协同</span><b>118</b></div>
<div style="width:65px;height:65px;background:var(--c2);opacity:.72"><span>结晶盐提纯</span><b>92</b></div>
<div style="width:58px;height:58px;background:var(--c3);opacity:.72"><span>膜材料抗污堵</span><b>74</b></div>
<div style="width:51px;height:51px;background:var(--c4);opacity:.72"><span>生态修复回灌</span><b>56</b></div>
</div>
<div class="fn">8 个技术分支覆盖从井下涌水控制、地面水处理到浓盐水资源化的完整链条。本项目主攻的「煤水共采协同」与「膜材料抗污堵」分别为第 5 位与第 7 位。</div>
</div>
<p>专利聚类显示该领域已形成 8 个主要技术分支，覆盖<em class="hl">从井下涌水控制、地面水处理到浓盐水资源化的完整技术链条</em>，技术覆盖范围较广、应用成熟度较高。其中「矿井水处理工艺」与「井下排水与控制」合计占比 44.9%，为技术密集区。本项目主攻的「煤水共采协同」（118 件，9.5%）与「膜材料抗污堵」（74 件，5.9%）体量相对较小，为本主题内的低密度分支，<em class="hl">尚有创新空间</em>。应用广度上，专利涉及煤炭开采、水处理、化工结晶、生态修复四个应用领域，具备跨领域推广基础。</p>
<h4>（2）专利布局与竞争格局</h4>
<div class="fig">
<div class="ft">图 2-3　专利受理局地域布局分布</div>
<div class="fs">按受理局统计，同族去重后计一件</div>
<div class="bars">
<div class="bar"><div class="bn">中国</div><div class="bt"><div class="bf" style="width:100%;background:var(--c1)"></div></div><div class="bv">1,042</div></div>
<div class="bar"><div class="bn">美国</div><div class="bt"><div class="bf" style="width:7.3%;background:var(--c2)"></div></div><div class="bv">76</div></div>
<div class="bar"><div class="bn">澳大利亚</div><div class="bt"><div class="bf" style="width:5.9%;background:var(--c2)"></div></div><div class="bv">61</div></div>
<div class="bar"><div class="bn">欧专局</div><div class="bt"><div class="bf" style="width:4.5%;background:var(--c2)"></div></div><div class="bv">47</div></div>
<div class="bar"><div class="bn">南非</div><div class="bt"><div class="bf" style="width:2%;background:var(--c2)"></div></div><div class="bv">21</div></div>
</div>
<div class="fn">中国占 83.6%；境外布局合计 205 件（16.4%），集中于同为煤炭生产国的美国、澳大利亚、南非。覆盖受理局数量 5 个，对应评估模型「潜在市场价值」指标。</div>
</div>
<p>专利受理局分布高度集中于中国（1,042 件，83.6%），说明该技术<em class="hl">以国内需求驱动为主</em>。境外布局虽有限但指向明确——美国、澳大利亚、南非同为煤炭生产国，说明技术成果具备一定国际推广价值。考虑到高矿化度矿井水问题在我国蒙陕、新疆等深部矿区尤为突出，国内市场本身即构成充分的应用空间。</p>

<div class="fig">
<div class="ft">图 2-4　发明专利申请量排名 TOP5</div>
<div class="fs">近十年累计；申请人已按集团口径归并，同一集团下属单位归入集团并保留二级单位明细</div>
<div class="bars">
<div class="bar"><div class="bn">中国矿业大学</div><div class="bt"><div class="bf" style="width:100%;background:var(--c4)"></div></div><div class="bv">98</div></div>
<div class="bar"><div class="bn">国家能源集团</div><div class="bt"><div class="bf" style="width:77.6%;background:var(--c1)"></div></div><div class="bv">76</div></div>
<div class="bar"><div class="bn">中煤能源集团</div><div class="bt"><div class="bf" style="width:58.2%;background:var(--accent)"></div></div><div class="bv">57</div></div>
<div class="bar"><div class="bn">陕煤集团</div><div class="bt"><div class="bf" style="width:48%;background:var(--c1)"></div></div><div class="bv">47</div></div>
<div class="bar"><div class="bn">中科院生态环境中心</div><div class="bt"><div class="bf" style="width:33.7%;background:var(--c4)"></div></div><div class="bv">33</div></div>
</div>
<div class="fn">前五名合计 311 件，占发明专利总量 892 件的三成半。绿色为申报单位所属集团。归并明细：中煤能源集团 57 件中，中煤科工集团 21 件、中煤（深圳）研究院 9 件、其余二级单位 27 件。</div>
</div>
<p>头部主体以高校与大型能源集团为主，高校侧重基础研究，能源集团侧重工程应用。中煤集团以 57 件发明专利居<em class="hl">第三位</em>，已有一定技术积累但非领先地位。前五名合计份额不足总量四成，其余六成分散在百余家主体手中，头部主体虽明确但未形成主导，新进入者仍有空间。需注意本项目与国家能源集团在纳滤分盐方向存在技术路线重叠，须形成差异化优势。</p>
<div class="fig">
<div class="ft">图 2-5　企业 TOP5 专利申请趋势</div>
<div class="fs">2016—2024 年，纵轴为年度申请量</div>
<svg viewBox="0 0 700 230" role="img" aria-label="五家头部企业近九年专利申请趋势折线图，均呈上升">
<g stroke="var(--grid)" stroke-width="1">
<line x1="40" y1="20" x2="680" y2="20"/><line x1="40" y1="65" x2="680" y2="65"/>
<line x1="40" y1="110" x2="680" y2="110"/><line x1="40" y1="155" x2="680" y2="155"/>
<line x1="40" y1="185" x2="680" y2="185"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="34" y="189">0</text><text x="34" y="159">4</text><text x="34" y="114">8</text>
<text x="34" y="69">12</text><text x="34" y="24">16</text></g>
<polyline fill="none" stroke="var(--c1)" stroke-width="2.2" points="70,163 146,152 222,141 298,119 374,97 450,86 526,64 602,53 678,75"/>
<polyline fill="none" stroke="var(--accent)" stroke-width="2.2" points="70,174 146,166 222,152 298,141 374,130 450,108 526,97 602,86 678,101"/>
<polyline fill="none" stroke="var(--c3)" stroke-width="2" points="70,178 146,174 222,163 298,152 374,145 450,130 526,119 602,112 678,126"/>
<polyline fill="none" stroke="var(--c4)" stroke-width="2" points="70,181 146,178 222,170 298,163 374,152 450,145 526,134 602,123 678,137"/>
<polyline fill="none" stroke="var(--c5)" stroke-width="2" points="70,183 146,181 222,176 298,170 374,163 450,156 526,148 602,141 678,152"/>
<text x="602" y="45" fill="var(--c1)" font-size="10.5" font-weight="700" text-anchor="middle">13</text>
<rect x="640" y="20" width="40" height="165" fill="var(--amber)" opacity="0.07"/>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="70" y="205">2016</text><text x="146" y="205">2017</text><text x="222" y="205">2018</text>
<text x="298" y="205">2019</text><text x="374" y="205">2020</text><text x="450" y="205">2021</text>
<text x="526" y="205">2022</text><text x="602" y="205">2023</text><text x="678" y="205">2024</text></g>
</svg>
<div class="lg"><span><i style="background:var(--c1)"></i>国家能源集团</span><span><i style="background:var(--accent)"></i>中煤能源集团</span><span><i style="background:var(--c3)"></i>陕煤集团</span><span><i style="background:var(--c4)"></i>山东能源集团</span><span><i style="background:var(--c5)"></i>华能集团</span></div>
<div class="fn">五家均持续增长。2024 年小幅回落系公开滞后所致，不代表投入减少。</div>
</div>
<p>五家头部企业近十年申请量均<em class="hl">持续增长</em>，其中国家能源集团增长最快（2016 年 3 件增至 2023 年 13 件），中煤集团稳居第二且趋势平稳向上。企业侧的持续投入说明该技术<em class="hl">已进入工程应用阶段、市场需求明确</em>。结合外部产品化检索，头部企业中国家能源集团已有 2 项相关技术形成工程化应用（宁东基地矿井水处理示范），说明行业成熟度较高，本项目须在细分路线上形成差异，正面竞争难度大。</p>

<div class="fig">
<div class="ft">图 2-6　科研院所 TOP5 专利申请趋势</div>
<div class="fs">2016—2024 年，纵轴为年度申请量</div>
<svg viewBox="0 0 700 230" role="img" aria-label="五家科研院所近九年专利申请趋势折线图，中国矿业大学2023年达18件领先">
<g stroke="var(--grid)" stroke-width="1">
<line x1="40" y1="20" x2="680" y2="20"/><line x1="40" y1="61" x2="680" y2="61"/>
<line x1="40" y1="102" x2="680" y2="102"/><line x1="40" y1="143" x2="680" y2="143"/>
<line x1="40" y1="185" x2="680" y2="185"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="34" y="189">0</text><text x="34" y="147">5</text><text x="34" y="106">10</text>
<text x="34" y="65">15</text><text x="34" y="24">20</text></g>
<polyline fill="none" stroke="var(--c4)" stroke-width="2.4" points="70,152 146,143 222,127 298,110 374,94 450,69 526,53 602,37 678,61"/>
<polyline fill="none" stroke="var(--c1)" stroke-width="2" points="70,168 146,160 222,152 298,135 374,127 450,110 526,94 602,86 678,102"/>
<polyline fill="none" stroke="var(--c2)" stroke-width="2" points="70,172 146,168 222,160 298,152 374,143 450,127 526,118 602,102 678,118"/>
<polyline fill="none" stroke="var(--c3)" stroke-width="2" points="70,178 146,172 222,168 298,160 374,152 450,143 526,135 602,118 678,135"/>
<polyline fill="none" stroke="var(--c5)" stroke-width="2" points="70,181 146,178 222,172 298,168 374,160 450,152 526,143 602,135 678,148"/>
<text x="602" y="29" fill="var(--c4)" font-size="10.5" font-weight="700" text-anchor="middle">18</text>
<rect x="640" y="20" width="40" height="165" fill="var(--amber)" opacity="0.07"/>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="70" y="205">2016</text><text x="146" y="205">2017</text><text x="222" y="205">2018</text>
<text x="298" y="205">2019</text><text x="374" y="205">2020</text><text x="450" y="205">2021</text>
<text x="526" y="205">2022</text><text x="602" y="205">2023</text><text x="678" y="205">2024</text></g>
</svg>
<div class="lg"><span><i style="background:var(--c4)"></i>中国矿业大学</span><span><i style="background:var(--c1)"></i>太原理工大学</span><span><i style="background:var(--c2)"></i>中科院生态环境中心</span><span><i style="background:var(--c3)"></i>煤炭科学研究总院</span><span><i style="background:var(--c5)"></i>西安科技大学</span></div>
</div>
<p>科研院所申请量同样<em class="hl">逐年攀升</em>，中国矿业大学以 2023 年 18 件显著领先，五家院所合计年申请量由 2016 年 13 件增至 2023 年 57 件。院所端的持续高投入表明该技术方向<em class="hl">仍具备较强创新热度</em>，基础研究尚未见顶，本项目在此背景下开展研究具备学术支撑与合作基础。</p>
<h3 id="s2-3">2.3　论文检索与分析</h3>
<p>以同一技术主题锚点、经中英文双语检索式召回，近十年共获相关论文 <em class="hl">863 篇</em>，其中核心期刊 512 篇、国际期刊 276 篇。已按标题相似度与作者重合度对预印本、会议与期刊三版本做去重，发表年统一采用网络首发年口径。</p>

<h4>（1）论文主题与热点分析</h4>
<div class="fig">
<div class="ft">图 2-7　近十年论文发表量年度趋势</div>
<div class="fs">纵轴为年度发表量，采用网络首发年口径</div>
<svg viewBox="0 0 700 230" role="img" aria-label="论文发表量年度趋势折线图，由2016年52篇增至2024年136篇">
<g stroke="var(--grid)" stroke-width="1">
<line x1="40" y1="20" x2="680" y2="20"/><line x1="40" y1="61" x2="680" y2="61"/>
<line x1="40" y1="102" x2="680" y2="102"/><line x1="40" y1="143" x2="680" y2="143"/>
<line x1="40" y1="185" x2="680" y2="185"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="34" y="189">0</text><text x="34" y="147">40</text><text x="34" y="106">80</text>
<text x="34" y="65">120</text><text x="34" y="24">160</text></g>
<polyline fill="none" stroke="var(--c2)" stroke-width="2.5" stroke-linejoin="round"
 points="70,131 146,124 222,116 298,105 374,92 450,78 526,63 602,54 678,44"/>
<g fill="var(--c2)">
<circle cx="70" cy="131" r="3"/><circle cx="146" cy="124" r="3"/><circle cx="222" cy="116" r="3"/>
<circle cx="298" cy="105" r="3"/><circle cx="374" cy="92" r="3"/><circle cx="450" cy="78" r="3"/>
<circle cx="526" cy="63" r="3"/><circle cx="602" cy="54" r="3"/><circle cx="678" cy="44" r="3.5"/></g>
<text x="70" y="123" fill="var(--ink3)" font-size="10" text-anchor="middle">52</text>
<text x="678" y="36" fill="var(--c2)" font-size="11" font-weight="700" text-anchor="middle">136</text>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="70" y="205">2016</text><text x="146" y="205">2017</text><text x="222" y="205">2018</text>
<text x="298" y="205">2019</text><text x="374" y="205">2020</text><text x="450" y="205">2021</text>
<text x="526" y="205">2022</text><text x="602" y="205">2023</text><text x="678" y="205">2024</text></g>
</svg>
<div class="fn">论文无公开滞后问题，2024 年数据完整可用于趋势判定。见刊周期滞后已通过网络首发年口径消除。</div>
</div>
<p>论文发表量由 2016 年 52 篇增至 2024 年 136 篇，年均增长 <em class="hl">12.8%</em>，较本主题前五年均值增长 48%。论文持续增加且作者机构数逐年增多，代表该方向<em class="hl">属活跃前沿方向</em>。</p>

<div class="fig">
<div class="ft">图 2-8　研究关键词云</div>
<div class="fs">基于 TF-IDF 算法生成，字号表示关键词热度，括号内为关联论文数</div>
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
<div class="fn">高频词集中于矿井水资源化、高矿化度、浓盐水处理、反渗透。标红两项为本项目主攻方向，热度相对较低。</div>
</div>
<p>关键词云显示研究热度集中于<em class="hl">矿井水资源化、高矿化度水处理与浓盐水治理</em>三大方向，与本项目立项主题高度一致。本项目主攻的「纳滤分盐」（62 篇）与「煤水共采」（47 篇）关联论文数分别为最高频词的 28.4% 与 21.6%，说明这两个细分方向<em class="hl">研究尚不充分、属新兴前沿领域</em>，本项目切入时机较好。而「反渗透」「蒸发结晶」等传统工艺研究已较为成熟，单纯沿用难以形成创新。</p>
<div class="fig">
<div class="ft">图 2-9　论文技术分支聚类分布</div>
<div class="fs">采用与专利同一套分支标签（合集聚类后回填），柱长表示论文数量</div>
<div class="bars">
<div class="bar"><div class="bn">矿井水处理工艺</div><div class="bt"><div class="bf" style="width:100%;background:var(--c1)"></div></div><div class="bv">214</div></div>
<div class="bar"><div class="bn">浓盐水资源化</div><div class="bt"><div class="bf" style="width:81.3%;background:var(--c3)"></div></div><div class="bv">174</div></div>
<div class="bar"><div class="bn">水质监测预测</div><div class="bt"><div class="bf" style="width:64.5%;background:var(--c4)"></div></div><div class="bv">138</div></div>
<div class="bar"><div class="bn">结晶盐提纯</div><div class="bt"><div class="bf" style="width:50.5%;background:var(--c2)"></div></div><div class="bv">108</div></div>
<div class="bar"><div class="bn">膜材料抗污堵</div><div class="bt"><div class="bf" style="width:37.9%;background:var(--c3);opacity:.75"></div></div><div class="bv">81</div></div>
<div class="bar"><div class="bn">井下排水与控制</div><div class="bt"><div class="bf" style="width:29%;background:var(--c2);opacity:.75"></div></div><div class="bv">62</div></div>
<div class="bar"><div class="bn">煤水共采协同</div><div class="bt"><div class="bf" style="width:22%;background:var(--c5)"></div></div><div class="bv">47</div></div>
<div class="bar"><div class="bn">生态修复回灌</div><div class="bt"><div class="bf" style="width:18.2%;background:var(--c4);opacity:.75"></div></div><div class="bv">39</div></div>
</div>
<div class="fn">与专利使用同一套 8 个分支标签，可直接横向对照。注意「井下排水与控制」在专利侧为第 2 位（248 件）、论文侧为第 6 位（62 篇），呈明显的工程化主导特征。</div>
</div>
<p>论文聚类与专利聚类的分支对照揭示两处结构性差异，是两库交叉印证的直接价值：</p>
<div class="tw">
<table>
<caption>专利与论文分支分布对照（同一套聚类标签）</caption>
<thead><tr><th>技术分支</th><th class="n">专利件数</th><th class="n">论文篇数</th><th class="n">专论比</th><th>特征判读</th></tr></thead>
<tbody>
<tr><td>矿井水处理工艺</td><td class="n">312</td><td class="n">214</td><td class="n">1.46</td><td>技术密集区，研究与转化同步</td></tr>
<tr><td>井下排水与控制</td><td class="n">248</td><td class="n">62</td><td class="n">4.00</td><td><span class="b a">工程化主导</span> 学术空间趋饱和</td></tr>
<tr><td>浓盐水资源化</td><td class="n">196</td><td class="n">174</td><td class="n">1.13</td><td>研究与转化并行</td></tr>
<tr><td>水质监测预测</td><td class="n">151</td><td class="n">138</td><td class="n">1.09</td><td>研究与转化并行</td></tr>
<tr><td>煤水共采协同</td><td class="n">118</td><td class="n">47</td><td class="n">2.51</td><td><span class="b a">工程化偏向</span> 本项目创新点一所在</td></tr>
<tr><td>结晶盐提纯</td><td class="n">92</td><td class="n">108</td><td class="n">0.85</td><td><span class="b g">研究期</span> 创新空间较大</td></tr>
<tr><td>膜材料抗污堵</td><td class="n">74</td><td class="n">81</td><td class="n">0.91</td><td><span class="b g">研究期</span> 本项目关键难题所在</td></tr>
<tr><td>生态修复回灌</td><td class="n">56</td><td class="n">39</td><td class="n">1.44</td><td>体量小，非本项目方向</td></tr>
</tbody>
</table>
</div>
<p>本项目涉及的两个分支阶段并不相同，须分开判读。膜材料抗污堵专利 74 件／论文 81 篇，专论比 0.91，专利少于论文，<em class="hl">属研究期，创新空间较大</em>，且两库排名均靠后、方向一致，说明这不是检索偏差。煤水共采协同虽绝对量同样不高，但专论比 2.51，专利为论文的 2.5 倍，按四象限口径<em class="hl">属工程化偏向、已越过研究早期</em>，不可与前者合并称「研究早期」。「井下排水与控制」专论比进一步达 4.00，属工程化主导——学术空间已饱和。本项目创新点一落在煤水共采与井下排水两个工程化侧分支上，创新应落在工艺与集成层面而非原理层面。</p>
<h4>（2）论文分布与学术影响力</h4>
<div class="fig">
<div class="ft">图 2-10　论文发表期刊所在国家／地区分布</div>
<div class="fs">按论文发表期刊的出版国统计</div>
<div class="bars">
<div class="bar"><div class="bn">中国</div><div class="bt"><div class="bf" style="width:100%;background:var(--c1)"></div></div><div class="bv">587</div></div>
<div class="bar"><div class="bn">美国</div><div class="bt"><div class="bf" style="width:21.1%;background:var(--c2)"></div></div><div class="bv">124</div></div>
<div class="bar"><div class="bn">荷兰</div><div class="bt"><div class="bf" style="width:15.8%;background:var(--c2)"></div></div><div class="bv">93</div></div>
<div class="bar"><div class="bn">英国</div><div class="bt"><div class="bf" style="width:6.3%;background:var(--c2)"></div></div><div class="bv">37</div></div>
<div class="bar"><div class="bn">德国</div><div class="bt"><div class="bf" style="width:3.7%;background:var(--c2)"></div></div><div class="bv">22</div></div>
</div>
<div class="fn">中国占 68.0%；国际期刊合计 276 篇（32.0%），主要为 Desalination、Water Research、Journal of Membrane Science 等水处理领域核心刊。国际部分依赖英文检索式召回，中文检索式无法覆盖。</div>
</div>
<p>论文发表国分布以中国为主（587 篇，68.0%），国际期刊占 32.0%。这说明该技术方向<em class="hl">既是我国的现实需求，也已进入国际学术视野</em>，研究成果具备发表于国际核心期刊的通道。对本项目预期的 4 篇核心期刊论文指标而言，目标合理可达。</p>

<div class="fig">
<div class="ft">图 2-11　企业 TOP5 论文发表趋势</div>
<div class="fs">2016—2024 年，纵轴为年度发表量；机构名已按与专利侧同一套归并规则处理</div>
<svg viewBox="0 0 700 230" role="img" aria-label="五家企业论文发表趋势折线图，全部逐年增加无下滑">
<g stroke="var(--grid)" stroke-width="1">
<line x1="40" y1="20" x2="680" y2="20"/><line x1="40" y1="61" x2="680" y2="61"/>
<line x1="40" y1="102" x2="680" y2="102"/><line x1="40" y1="143" x2="680" y2="143"/>
<line x1="40" y1="185" x2="680" y2="185"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="34" y="189">0</text><text x="34" y="147">4</text><text x="34" y="106">8</text>
<text x="34" y="65">12</text><text x="34" y="24">16</text></g>
<polyline fill="none" stroke="var(--c1)" stroke-width="2.2" points="70,143 146,133 222,122 298,112 374,91 450,81 526,60 602,50 678,30"/>
<polyline fill="none" stroke="var(--accent)" stroke-width="2.2" points="70,154 146,148 222,133 298,122 374,112 450,101 526,81 602,70 678,60"/>
<polyline fill="none" stroke="var(--c3)" stroke-width="2" points="70,164 146,159 222,148 298,138 374,127 450,117 526,101 602,91 678,81"/>
<polyline fill="none" stroke="var(--c4)" stroke-width="2" points="70,169 146,164 222,159 298,148 374,138 450,127 526,117 602,106 678,96"/>
<polyline fill="none" stroke="var(--c5)" stroke-width="2" points="70,175 146,171 222,164 298,159 374,148 450,138 526,127 602,122 678,112"/>
<text x="678" y="22" fill="var(--c1)" font-size="10.5" font-weight="700" text-anchor="middle">15</text>
<text x="678" y="53" fill="var(--accent)" font-size="10.5" font-weight="700" text-anchor="middle">12</text>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="70" y="205">2016</text><text x="146" y="205">2017</text><text x="222" y="205">2018</text>
<text x="298" y="205">2019</text><text x="374" y="205">2020</text><text x="450" y="205">2021</text>
<text x="526" y="205">2022</text><text x="602" y="205">2023</text><text x="678" y="205">2024</text></g>
</svg>
<div class="lg"><span><i style="background:var(--c1)"></i>国家能源集团</span><span><i style="background:var(--accent)"></i>中煤能源集团</span><span><i style="background:var(--c3)"></i>陕煤集团</span><span><i style="background:var(--c4)"></i>中煤科工集团</span><span><i style="background:var(--c5)"></i>华能集团</span></div>
</div>
<p>企业论文发表量<em class="hl">逐年稳定增加</em>，无一家出现下滑。国家能源集团由 2016 年 4 篇增至 2024 年 15 篇，中煤集团由 3 篇增至 12 篇。企业持续发表论文而非仅申请专利，说明该技术<em class="hl">应用前景明确</em>，企业愿意在基础研究层面持续投入，而非仅作短期专利储备。</p>

<div class="fig">
<div class="ft">图 2-12　科研院所 TOP5 论文发表趋势</div>
<div class="fs">2016—2024 年，纵轴为年度发表量</div>
<svg viewBox="0 0 700 230" role="img" aria-label="五家科研院所论文发表趋势折线图，中国矿业大学2024年达28篇">
<g stroke="var(--grid)" stroke-width="1">
<line x1="40" y1="20" x2="680" y2="20"/><line x1="40" y1="61" x2="680" y2="61"/>
<line x1="40" y1="102" x2="680" y2="102"/><line x1="40" y1="143" x2="680" y2="143"/>
<line x1="40" y1="185" x2="680" y2="185"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="34" y="189">0</text><text x="34" y="147">8</text><text x="34" y="106">16</text>
<text x="34" y="65">24</text><text x="34" y="24">32</text></g>
<polyline fill="none" stroke="var(--c4)" stroke-width="2.4" points="70,144 146,133 222,123 298,108 374,93 450,77 526,62 602,51 678,41"/>
<polyline fill="none" stroke="var(--c1)" stroke-width="2" points="70,159 146,154 222,144 298,133 374,123 450,108 526,98 602,87 678,77"/>
<polyline fill="none" stroke="var(--c2)" stroke-width="2" points="70,164 146,159 222,154 298,144 374,133 450,123 526,113 602,98 678,87"/>
<polyline fill="none" stroke="var(--c3)" stroke-width="2" points="70,172 146,167 222,159 298,154 374,144 450,133 526,123 602,113 678,103"/>
<polyline fill="none" stroke="var(--c5)" stroke-width="2" points="70,177 146,172 222,167 298,162 374,154 450,144 526,136 602,126 678,118"/>
<text x="678" y="33" fill="var(--c4)" font-size="10.5" font-weight="700" text-anchor="middle">28</text>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="70" y="205">2016</text><text x="146" y="205">2017</text><text x="222" y="205">2018</text>
<text x="298" y="205">2019</text><text x="374" y="205">2020</text><text x="450" y="205">2021</text>
<text x="526" y="205">2022</text><text x="602" y="205">2023</text><text x="678" y="205">2024</text></g>
</svg>
<div class="lg"><span><i style="background:var(--c4)"></i>中国矿业大学</span><span><i style="background:var(--c1)"></i>太原理工大学</span><span><i style="background:var(--c2)"></i>中科院生态环境中心</span><span><i style="background:var(--c3)"></i>西安科技大学</span><span><i style="background:var(--c5)"></i>河海大学</span></div>
</div>
<p>科研院所论文发表呈<em class="hl">明显加速态势</em>，中国矿业大学由 2016 年 8 篇增至 2024 年 28 篇，五家院所合计由 22 篇增至 92 篇，翻两倍以上。大机构<em class="hl">持续高强度投入</em>是该领域研究前景良好的直接证据。综合企业与院所两条曲线，该技术方向<em class="hl">学术研究与工程应用双向活跃</em>，本项目具备良好的外部学术环境与合作基础。</p>

<h5>核心期刊与项目技术关联</h5>
<div class="tw">
<table>
<caption>本项目核心技术特征词与核心期刊的匹配情况（期刊名录由甲方提供）</caption>
<thead><tr><th>期刊名称</th><th class="n">相关论文</th><th>主要研究机构</th><th>技术进展与衍生专利</th></tr></thead>
<tbody>
<tr><td>煤炭学报</td><td class="n">87 篇</td><td>中国矿业大学、煤炭科学研究总院</td><td>2023 年发表两级纳滤分盐中试研究，衍生专利 3 件</td></tr>
<tr><td>Desalination</td><td class="n">64 篇</td><td>中科院生态环境中心、河海大学</td><td>膜污堵机理研究为主，衍生专利较少</td></tr>
<tr><td>煤炭科学技术</td><td class="n">58 篇</td><td>国家能源集团、陕煤集团</td><td>工程应用类为主，衍生专利 11 件</td></tr>
<tr><td>Water Research</td><td class="n">41 篇</td><td>中国矿业大学、太原理工大学</td><td>浓盐水资源化基础研究，尚未见工程化</td></tr>
<tr><td>Journal of Membrane Science</td><td class="n">33 篇</td><td>中科院生态环境中心</td><td>抗污堵膜材料，2024 年起专利活跃</td></tr>
</tbody>
</table>
</div>
<p>项目核心技术与上述五种核心期刊均有关联，其中《煤炭学报》与《煤炭科学技术》的关联度最高、且已产生衍生专利，说明本项目技术方向<em class="hl">处于学术成果向工程转化的活跃通道上</em>。需特别注意《煤炭学报》2023 年发表的两级纳滤分盐中试研究由中国矿业大学完成，与本项目创新点二高度相关，详见第三章。</p>
<h3 id="s2-4">2.4　领域技术趋势总结</h3>
<p>综合专利与论文两库数据，从技术阶段、新兴方向、成熟度、突破点、先进性五个方面判读。数量规模仍采用相对基准；涉及增长率、专论比和评分的项目，则严格采用下表列示的显式规则，避免以“热度”替代“先进性”。</p>

<div class="fig">
<div class="ft">图 2-13　专利与论文双曲线对照及四象限定位</div>
<div class="fs">左：双曲线增长率与自身时间基准对照；右：四象限定位</div>
<div class="two" style="gap:22px">
<div>
<div class="tw" style="margin:0">
<table style="min-width:0">
<thead><tr><th>口径</th><th class="n">本主题</th></tr></thead>
<tbody>
<tr><td>专利年均增长<br><span class="small">发明+实用新型</span></td><td class="n">20.3%</td></tr>
<tr><td>其中发明专利</td><td class="n">21.6%</td></tr>
<tr><td>论文年均增长</td><td class="n">12.8%</td></tr>
<tr><td>专利较前5年均值</td><td class="n">+62%</td></tr>
<tr><td>论文较前5年均值</td><td class="n">+48%</td></tr>
<tr><td>申请人数量</td><td class="n">41→118（2.88×）</td></tr>
</tbody>
</table>
</div>
</div>
<div>
<svg viewBox="0 0 300 250" role="img" aria-label="四象限定位图，本主题落在论文多专利多的技术热点象限">
<rect x="150" y="15" width="130" height="105" fill="var(--brand2)" opacity="0.09"/>
<line x1="40" y1="120" x2="280" y2="120" stroke="var(--line)" stroke-width="1.5"/>
<line x1="150" y1="15" x2="150" y2="222" stroke="var(--line)" stroke-width="1.5"/>

<text x="95" y="47" fill="var(--ink3)" font-size="9.5" text-anchor="middle">论文多·专利少</text>
<text x="95" y="61" fill="var(--ink2)" font-size="9.5" text-anchor="middle">研究期</text>
<text x="95" y="74" fill="var(--ink3)" font-size="9" text-anchor="middle">创新空间大</text>

<text x="207" y="47" fill="var(--ink3)" font-size="9.5" text-anchor="middle">论文多·专利多</text>
<text x="207" y="61" fill="var(--brand2)" font-size="9.5" font-weight="700" text-anchor="middle">技术热点·趋于稳定</text>
<text x="207" y="74" fill="var(--ink3)" font-size="9" text-anchor="middle">竞争激烈</text>

<text x="95" y="157" fill="var(--ink3)" font-size="9.5" text-anchor="middle">论文少·专利少</text>
<text x="95" y="171" fill="var(--amber)" font-size="9.5" font-weight="700" text-anchor="middle">需人工研判</text>
<text x="95" y="184" fill="var(--ink3)" font-size="9" text-anchor="middle">不得直接判先进</text>

<text x="207" y="157" fill="var(--ink3)" font-size="9.5" text-anchor="middle">论文少·专利多</text>
<text x="207" y="171" fill="var(--ink2)" font-size="9.5" text-anchor="middle">工程化主导</text>
<text x="207" y="184" fill="var(--ink3)" font-size="9" text-anchor="middle">聚焦工艺与集成</text>

<circle cx="262" cy="100" r="5.5" fill="var(--red)"/>
<circle cx="262" cy="100" r="10" fill="none" stroke="var(--red)" stroke-width="1" opacity="0.45"/>
<text x="262" y="115" fill="var(--red)" font-size="9" font-weight="700" text-anchor="middle">本主题</text>

<text x="150" y="240" fill="var(--ink3)" font-size="9" text-anchor="middle">← 专利密度 →</text>
</svg>
</div>
</div>
<div class="fn">本主题专利与论文两项增长率较前五年均值均显著上升，落入「论文多·专利多」象限，判定为技术热点、趋于稳定、竞争激烈。四象限判定以自身时间基准为参照，禁止无基准的「多／少」表述。</div>
</div>

<div class="tw">
<table>
<caption>领域技术趋势五项判读</caption>
<thead><tr><th style="width:150px">判读项</th><th>数据依据</th><th>结论</th></tr></thead>
<tbody>
<tr><td>是否处于快速发展期</td><td><b>判断规则（须同时满足）：</b>专利年均增长 ≥15%；论文年均增长 ≥15%；申请人与论文作者单位数量逐年增加。实测：专利 20.3%，论文 12.8%；申请人 41→118，单位数量逐年增加。</td><td><span class="b a">未满足快速发展期全部条件</span> 专利增速及主体增长达标，但论文年均增长 12.8% 未达到 15%；据此判为活跃增长期，不判为快速发展期</td></tr>
<tr><td>新兴技术方向是否显现</td><td><b>判断规则（满足其一）：</b>某技术分支近 3 年专利或论文年均增长 ≥30%；或者该分支专利／论文比＜1。按统一标签：膜材料抗污堵专利 74 件／论文 81 篇，专论比 0.91；煤水共采协同专论比 2.51。各分支近 3 年增速须单独计算，不以领域总体增速替代。</td><td><span class="b g">新兴方向已显现</span> 膜材料抗污堵专论比 0.91＜1，已满足判定规则；煤水共采协同未因专论比满足规则，须待其近 3 年增速达到 30% 后方可据增长条件认定</td></tr>
<tr><td>现有技术成熟度与应用拓展</td><td><b>应用拓展规则：</b>从 TOP10 申请人的专利文本（摘要、权利要求及实施例）提取应用领域，合并同义领域后统计覆盖范围。提取结果涉及煤炭开采、水处理、化工结晶、生态修复四类。<br><b>成熟度规则：</b>对每个技术分支分别由专家人工确认成熟度，不由专利／论文数量自动推断。</td><td><span class="b a">应用领域已拓展；成熟度待分支确认</span> 当前文本证据表明应用覆盖四类领域；预处理+反渗透、纳滤分盐等分支的成熟度结论须由专家逐项确认并留痕</td></tr>
<tr><td>未来可能的技术突破点</td><td>提取论文技术难点与未来展望：高含盐条件下膜通量衰减机理、抗污堵膜材料改性、浓盐水零排放全流程能耗优化、结晶盐杂质控制</td><td>四项待突破，其中前两项与本项目关键难题重合</td></tr>
<tr><td>项目现阶段先进性</td><td><b>判断规则：</b>直接采用第六章“创新性”维度加权得分及其分项证据，不再以专利、论文热度代替先进性判断。本项目创新性得分 15.4／30，得分率 51.3%。</td><td><span class="b a">现阶段先进性证据中等偏弱</span> 以第六章创新性得分为准；主要受创新点二最高相似度 87%、S4 落 30 档影响</td></tr>
</tbody>
</table>
</div>
<p>综合判读：该领域<em class="hl">专利侧反映的行业成熟度较高，论文侧反映的创新活跃度同样较强</em>，两条曲线同步上升，属技术热点期。对本项目的直接含义是——立项方向没有选错，政策与市场需求真实存在，但<em class="hlr">正面竞争压力大</em>，项目价值取决于能否在低密度分支（煤水共采协同、膜材料抗污堵、结晶盐提纯）上形成实质差异，而非在主流工艺上做增量改进。</p>
<div class="ch" id="c3">
  <div class="cn">第三章</div>
  <h2>创新点分析</h2>
  <p class="lead">每个创新点的专利分析 · 论文分析 · 创新性评估</p>
</div>

<p>建议书提出三个预期创新点。本章对每个创新点分别进行专利检索与论文检索，分析相似度分布与法律状态，评估创新空间。按 S4 判定分档：最高相似度 &lt;60% 为未见同类方案，60%—75% 为存在相关方案但技术路线不同，75%—85% 为存在较相似方案须说明差异，≥85% 为存在高度相似方案。多个创新点时取最低档位计分。</p>

<div class="tw">
<table>
<caption>三个创新点综合评估表</caption>
<thead><tr><th>创新点</th><th>与现有专利最高相似度</th><th>创新空间判定</th><th>S4 档位</th></tr></thead>
<tbody>
<tr><td>创新点一　煤水共采协同调控方法</td><td class="n">71%</td><td>技术路线不同</td><td><span class="b g">80</span></td></tr>
<tr><td>创新点二　高含盐矿井水纳滤分盐工艺</td><td class="n">87%</td><td>存在高度相似方案</td><td><span class="b r">30</span></td></tr>
<tr><td>创新点三　浓盐水零排放经济性优化模型</td><td class="n">54%</td><td>未见同类方案</td><td><span class="b g">100</span></td></tr>
</tbody>
</table>
</div>
<h3 id="s3-1">3.1　创新点一　煤水共采协同调控方法</h3>
<h4>（1）创新点描述</h4>
<div class="card">
<p style="margin:0">以工作面回采推进度为输入，动态调控井下排水系统负荷，实现回采与排水的时序协同。技术原理为建立回采推进速度与涌水量响应的耦合模型，据此动态分配排水能力；实现方式为在既有井下排水系统上叠加调度控制层；应用场景为煤水混杂的深部矿井采场作业环境。与现有技术的区别在于，现有方案均针对单一排水环节做控制优化，本创新点将回采推进与排水负荷耦合，属新的协同维度。</p>
</div>

<h4>（2）专利分析</h4>
<div class="fig">
<div class="ft">图 3-1　创新点一相似专利年度申请趋势</div>
<div class="fs">2016—2024 年，纵轴为年度申请量（相似度 ≥50% 的专利）</div>
<svg viewBox="0 0 700 200" role="img" aria-label="创新点一相似专利年度趋势，2016年3件平缓增至2024年14件">
<g stroke="var(--grid)" stroke-width="1">
<line x1="40" y1="20" x2="680" y2="20"/><line x1="40" y1="60" x2="680" y2="60"/>
<line x1="40" y1="100" x2="680" y2="100"/><line x1="40" y1="140" x2="680" y2="140"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="34" y="144">0</text><text x="34" y="104">6</text><text x="34" y="64">12</text><text x="34" y="24">18</text></g>
<g fill="var(--c5)">
<rect x="56" y="120" width="30" height="20"/><rect x="132" y="113" width="30" height="27"/>
<rect x="208" y="113" width="30" height="27"/><rect x="284" y="107" width="30" height="33"/>
<rect x="360" y="100" width="30" height="40"/><rect x="436" y="93" width="30" height="47"/>
<rect x="512" y="87" width="30" height="53"/><rect x="588" y="73" width="30" height="67"/>
<rect x="650" y="47" width="30" height="93"/></g>
<text x="665" y="39" fill="var(--c5)" font-size="10.5" font-weight="700" text-anchor="middle">14</text>
<text x="71" y="112" fill="var(--ink3)" font-size="10" text-anchor="middle">3</text>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="71" y="160">2016</text><text x="147" y="160">2017</text><text x="223" y="160">2018</text>
<text x="299" y="160">2019</text><text x="375" y="160">2020</text><text x="451" y="160">2021</text>
<text x="527" y="160">2022</text><text x="603" y="160">2023</text><text x="665" y="160">2024</text></g>
</svg>
<div class="fn">近十年相似专利由 3 件增至 14 件，2023—2024 年出现明显加速（同比 +40%、+56%）。</div>
</div>
<p>相似专利近十年持续平缓增长，但<em class="hl">近两年出现明显加速</em>，2023 年 9 件、2024 年 14 件。按框架判定口径，专利之前持续平缓、近年爆涨表示趋势凸显、技术方向有优势——说明煤水协同调控正在成为新的技术关注点，本项目切入时机恰当。同时也提示竞争者正在进入，须加快布局节奏。</p>

<div class="tw">
<table>
<caption>相似度 TOP5 专利对比（创新点一）</caption>
<thead><tr><th>专利名称</th><th>公开号</th><th class="n">相似度</th><th>法律状态</th><th>权利人</th></tr></thead>
<tbody>
<tr><td>一种煤矿井下排水协同控制系统</td><td>CN114592909A</td><td class="n">71%</td><td><span class="b n">已失效</span></td><td>中国矿业大学</td></tr>
<tr><td>采掘工作面涌水量动态预测方法</td><td>CN113847095B</td><td class="n">66%</td><td><span class="b a">在华有效</span></td><td>国家能源集团</td></tr>
<tr><td>矿井排水系统智能调度装置</td><td>CN115163150A</td><td class="n">58%</td><td><span class="b a">在华有效</span></td><td>陕煤集团</td></tr>
<tr><td>基于水位反馈的矿井排水控制方法</td><td>CN112943308A</td><td class="n">55%</td><td><span class="b a">在华有效</span></td><td>太原理工大学</td></tr>
<tr><td>煤矿疏干水量预测与调度系统</td><td>CN116105073A</td><td class="n">52%</td><td><span class="b a">在华有效</span></td><td>中煤能源集团</td></tr>
</tbody>
</table>
</div>
<h5>技术方案与性能指标对比</h5>
<div class="tw">
<table>
<caption>本创新点与 TOP5 专利的技术特征比对</caption>
<thead><tr><th>比对维度</th><th>TOP5 专利披露方案</th><th>本创新点方案</th><th>判定</th></tr></thead>
<tbody>
<tr><td>控制输入量</td><td>水位、涌水量实测值（CN112943308A、CN113847095B）</td><td>工作面回采推进度 + 涌水量</td><td><span class="b g">有差异</span> 引入采掘工序参数</td></tr>
<tr><td>控制对象</td><td>排水泵组单一环节</td><td>排水系统负荷 + 回采节奏双向调节</td><td><span class="b g">有差异</span> 协同维度更宽</td></tr>
<tr><td>响应方式</td><td>被动反馈（水位超限后启泵）</td><td>前馈预测（按回采计划预调排水能力）</td><td><span class="b g">有差异</span> 控制逻辑不同</td></tr>
<tr><td>性能指标</td><td>CN113847095B 披露涌水量预测精度 85%</td><td>建议书未给出本创新点的量化指标</td><td><span class="b a">无法比对</span> 建议补充</td></tr>
</tbody>
</table>
</div>
<div class="box g">
<h5>有利条件：与现有技术存在实质差异</h5>
<p style="margin:0">五件对比专利相似度均低于 75%，未见同类方案，本创新点新颖性尚可。其中相似度最高的 CN114592909A（71%）其公开内容已属现有技术，构成本项目的技术起点；在控制输入量与响应方式两个维度上，五件专利均与本创新点不同，构成<em class="hlg">实质性技术差异</em>。</p>
</div>
<div class="box a">
<h5>需补充：本创新点缺少量化指标</h5>
<p style="margin:0">对比专利 CN113847095B 已披露涌水量预测精度 85%，而建议书未就创新点一给出可量化的性能指标（如协同调控后的排水能耗降幅、涌水量匹配精度）。无量化指标则无法证明技术先进性，建议在《四、预期成果》中补充。</p>
</div>
<h4>（3）论文分析</h4>
<div class="fig">
<div class="ft">图 3-2　创新点一相似论文年度发表趋势</div>
<div class="fs">2016—2024 年，纵轴为年度发表量</div>
<svg viewBox="0 0 700 190" role="img" aria-label="创新点一相似论文年度趋势，由2016年2篇增至2024年9篇">
<g stroke="var(--grid)" stroke-width="1">
<line x1="40" y1="20" x2="680" y2="20"/><line x1="40" y1="60" x2="680" y2="60"/>
<line x1="40" y1="100" x2="680" y2="100"/><line x1="40" y1="135" x2="680" y2="135"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="34" y="139">0</text><text x="34" y="104">4</text><text x="34" y="64">8</text><text x="34" y="24">12</text></g>
<polyline fill="none" stroke="var(--c2)" stroke-width="2.4" points="70,118 146,113 222,109 298,100 374,92 450,83 526,74 602,66 678,57"/>
<g fill="var(--c2)"><circle cx="70" cy="118" r="2.8"/><circle cx="678" cy="57" r="3.2"/></g>
<text x="70" y="110" fill="var(--ink3)" font-size="10" text-anchor="middle">2</text>
<text x="678" y="49" fill="var(--c2)" font-size="10.5" font-weight="700" text-anchor="middle">9</text>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="70" y="155">2016</text><text x="146" y="155">2017</text><text x="222" y="155">2018</text>
<text x="298" y="155">2019</text><text x="374" y="155">2020</text><text x="450" y="155">2021</text>
<text x="526" y="155">2022</text><text x="602" y="155">2023</text><text x="678" y="155">2024</text></g>
</svg>
<div class="fn">相似论文由 2 篇增至 9 篇，累计 47 篇，持续增加但绝对量偏低。</div>
</div>
<div class="tw">
<table>
<caption>相似度 TOP5 论文（创新点一）</caption>
<thead><tr><th>论文标题</th><th>来源</th><th class="n">相似度</th><th>研究机构</th></tr></thead>
<tbody>
<tr><td>采掘工序与矿井排水负荷协同优化研究</td><td>煤炭学报 2024</td><td class="n">68%</td><td>中国矿业大学</td></tr>
<tr><td>深部矿井涌水量动态响应规律及预测模型</td><td>煤炭科学技术 2023</td><td class="n">62%</td><td>煤炭科学研究总院</td></tr>
<tr><td>基于回采进度的矿井水害预警方法</td><td>采矿与安全工程学报 2023</td><td class="n">57%</td><td>太原理工大学</td></tr>
<tr><td>Mine drainage scheduling under dynamic inflow</td><td>Mine Water Environ 2022</td><td class="n">53%</td><td>西安科技大学</td></tr>
<tr><td>煤水双资源协调开采技术研究进展</td><td>煤田地质与勘探 2022</td><td class="n">51%</td><td>中国矿业大学</td></tr>
</tbody>
</table>
</div>
<p>论文侧最高相似度 68%（煤炭学报 2024），研究了采掘工序与排水负荷的协同优化，与本创新点思路接近但停留在理论建模层面，未涉及工程实现与控制系统落地。本创新点的可行性有学术支撑——相关理论研究正在活跃，但工程化实现尚属空白，具备<em class="hl">潜在价值与前沿性</em>。</p>

<h4>（4）创新性评估</h4>
<div class="tw">
<table>
<thead><tr><th style="width:150px">评估项</th><th>数据依据</th><th>结论</th></tr></thead>
<tbody>
<tr><td>是否容易形成技术壁垒</td><td>相似专利累计 118 件（煤水共采分支）、相似论文 47 篇，专论比 2.51，属工程化偏向分支；两库绝对量均不高但专利侧已有一定积累</td><td><span class="b a">壁垒中等</span> 非刚萌芽状态，专利侧已有布局，形成壁垒需在控制逻辑上取得实质差异</td></tr>
<tr><td>是否具有技术领先性</td><td>专利侧：最高相似度 71% 且已失效，在华有效者均 &lt;75%，控制输入量与响应方式不同；论文侧：最高 68%，理论研究活跃但工程化空白</td><td><span class="b g">具有领先性</span> 前馈预测+双向协同为新的技术组合，工程化实现属空白</td></tr>
</tbody>
</table>
</div>
<div class="box g">
<h5>创新点一评估结论</h5>
<p style="margin:0">技术路线与现有专利存在实质差异，五件对比专利相似度均低于 75%，工程化实现属空白，<em class="hlg">创新空间明确</em>。主要不足是缺少量化性能指标，建议补充后可作为本项目的核心创新点之一。</p>
</div>
<h3 id="s3-2">3.2　创新点二　高含盐矿井水纳滤分盐工艺</h3>
<h4>（1）创新点描述</h4>
<div class="card">
<p style="margin:0">针对矿化度 8,000—15,000 mg/L 的矿井水，采用两级纳滤实现一价盐与二价盐分离，提升后续蒸发结晶所得结晶盐纯度。技术原理为利用纳滤膜对一价与二价离子的选择透过性差异实现分级截留；实现方式为两级纳滤串联并配置浓水回流；应用场景为高矿化度矿井水的地面处理段，衔接蒸发结晶工序。</p>
</div>

<h4>（2）专利分析</h4>
<div class="fig">
<div class="ft">图 3-3　创新点二相似专利年度申请趋势</div>
<div class="fs">2016—2024 年，纵轴为年度申请量（相似度 ≥50% 的专利）</div>
<svg viewBox="0 0 700 200" role="img" aria-label="创新点二相似专利年度趋势，持续增长由2016年5件增至2024年31件">
<g stroke="var(--grid)" stroke-width="1">
<line x1="40" y1="20" x2="680" y2="20"/><line x1="40" y1="60" x2="680" y2="60"/>
<line x1="40" y1="100" x2="680" y2="100"/><line x1="40" y1="140" x2="680" y2="140"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="34" y="144">0</text><text x="34" y="104">12</text><text x="34" y="64">24</text><text x="34" y="24">36</text></g>
<g fill="var(--red)" opacity="0.8">
<rect x="56" y="123" width="30" height="17"/><rect x="132" y="117" width="30" height="23"/>
<rect x="208" y="107" width="30" height="33"/><rect x="284" y="97" width="30" height="43"/>
<rect x="360" y="87" width="30" height="53"/><rect x="436" y="73" width="30" height="67"/>
<rect x="512" y="63" width="30" height="77"/><rect x="588" y="50" width="30" height="90"/>
<rect x="650" y="37" width="30" height="103"/></g>
<text x="665" y="29" fill="var(--red)" font-size="10.5" font-weight="700" text-anchor="middle">31</text>
<text x="71" y="115" fill="var(--ink3)" font-size="10" text-anchor="middle">5</text>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="71" y="160">2016</text><text x="147" y="160">2017</text><text x="223" y="160">2018</text>
<text x="299" y="160">2019</text><text x="375" y="160">2020</text><text x="451" y="160">2021</text>
<text x="527" y="160">2022</text><text x="603" y="160">2023</text><text x="665" y="160">2024</text></g>
</svg>
<div class="fn">相似专利近十年持续稳定增长，累计 187 件，无明显波谷。</div>
</div>
<p>相似专利<em class="hlr">近十年持续增长</em>，由 2016 年 5 件增至 2024 年 31 件，累计 187 件，且无波谷。按框架判定口径，专利一直持续增长表示<em class="hlr">竞争激烈、本方案不具备明显优势</em>。这与创新点一的「近年爆涨」形态不同——持续增长意味着该技术方向早已被充分关注、进入者众多，后来者难以取得先发优势。</p>

<div class="tw">
<table>
<caption>相似度 TOP5 专利／论文对比（创新点二）</caption>
<thead><tr><th>名称</th><th>公开号／来源</th><th class="n">相似度</th><th>法律状态</th><th>权利人</th></tr></thead>
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
<caption>技术路线逐项比对（本创新点 vs CN112794520B，相似度 87%）</caption>
<thead><tr><th>比对维度</th><th>CN112794520B 披露方案</th><th>本创新点方案</th><th>判定</th></tr></thead>
<tbody>
<tr><td>分离原理</td><td>纳滤膜对一价／二价离子选择透过性差异</td><td>纳滤膜对一价／二价离子选择透过性差异</td><td><span class="b r">相同</span> 原理层面无差异</td></tr>
<tr><td>工艺配置</td><td>两级纳滤串联</td><td>两级纳滤串联</td><td><span class="b r">相同</span> 级数与串联方式一致</td></tr>
<tr><td>浓水处理</td><td>浓水回流至前级进水</td><td>浓水回流至前级进水</td><td><span class="b r">相同</span> 回流路径一致</td></tr>
<tr><td>后段衔接</td><td>蒸发结晶产出工业级结晶盐</td><td>蒸发结晶产出工业级结晶盐</td><td><span class="b r">相同</span> 工序衔接一致</td></tr>
<tr><td>进水适用范围</td><td>高盐废水，未限定矿化度区间与来源</td><td>矿井水，矿化度 8,000—15,000 mg/L</td><td><span class="b a">范围收窄</span> 属应用场景限定，非技术手段差异</td></tr>
<tr><td>结晶盐纯度</td><td>≥98.2%</td><td>≥98.5%</td><td><span class="b a">略优</span> 高 0.3 个百分点</td></tr>
</tbody>
</table>
</div>
<p>四个技术手段维度（分离原理、工艺配置、浓水处理、后段衔接）与对比专利<em class="hlr">完全一致</em>，这是相似度达 87% 的具体构成。两项差异均不构成技术手段创新：进水矿化度区间的限定属应用场景收窄，在原理与工艺不变的前提下不产生新的技术效果；结晶盐纯度高 0.3 个百分点属同一工艺的参数优化幅度。相较之下，创新点一在控制输入量与响应方式两个<em class="hl">手段维度</em>上与对比专利不同，这是两个创新点判定差异的根本原因。</p>

<h4>（3）论文分析</h4>
<div class="fig">
<div class="ft">图 3-4　创新点二相似论文年度发表趋势</div>
<div class="fs">2016—2024 年，纵轴为年度发表量</div>
<svg viewBox="0 0 700 190" role="img" aria-label="创新点二相似论文年度趋势，由2016年3篇增至2024年12篇">
<g stroke="var(--grid)" stroke-width="1">
<line x1="40" y1="20" x2="680" y2="20"/><line x1="40" y1="60" x2="680" y2="60"/>
<line x1="40" y1="100" x2="680" y2="100"/><line x1="40" y1="135" x2="680" y2="135"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="34" y="139">0</text><text x="34" y="104">5</text><text x="34" y="64">10</text><text x="34" y="24">15</text></g>
<polyline fill="none" stroke="var(--c2)" stroke-width="2.4" points="70,111 146,103 222,95 298,87 374,79 450,71 526,63 602,55 678,43"/>
<g fill="var(--c2)"><circle cx="70" cy="111" r="2.8"/><circle cx="678" cy="43" r="3.2"/></g>
<text x="70" y="103" fill="var(--ink3)" font-size="10" text-anchor="middle">3</text>
<text x="678" y="35" fill="var(--c2)" font-size="10.5" font-weight="700" text-anchor="middle">12</text>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="70" y="155">2016</text><text x="146" y="155">2017</text><text x="222" y="155">2018</text>
<text x="298" y="155">2019</text><text x="374" y="155">2020</text><text x="450" y="155">2021</text>
<text x="526" y="155">2022</text><text x="602" y="155">2023</text><text x="678" y="155">2024</text></g>
</svg>
<div class="fn">相似论文累计 62 篇，持续增长；最高相似度论文为煤炭学报 2023 年发表的两级纳滤分盐中试研究（83%）。</div>
</div>
<div class="tw">
<table>
<caption>相似度 TOP5 论文（创新点二）</caption>
<thead><tr><th>论文标题</th><th>来源</th><th class="n">相似度</th><th>研究机构</th></tr></thead>
<tbody>
<tr><td>矿井水两级纳滤分盐中试研究</td><td>煤炭学报 2023</td><td class="n">83%</td><td>中国矿业大学</td></tr>
<tr><td>高盐矿井水纳滤分盐工艺参数优化</td><td>煤炭科学技术 2024</td><td class="n">78%</td><td>国家能源集团</td></tr>
<tr><td>Mono/divalent salt separation by two-stage NF</td><td>Desalination 2023</td><td class="n">74%</td><td>中科院生态环境中心</td></tr>
<tr><td>纳滤膜分盐过程中的结垢行为研究</td><td>膜科学与技术 2023</td><td class="n">69%</td><td>太原理工大学</td></tr>
<tr><td>浓盐水分质结晶技术研究进展</td><td>化工进展 2022</td><td class="n">65%</td><td>河海大学</td></tr>
</tbody>
</table>
</div>
<p>论文侧最高相似度 83%，为中国矿业大学 2023 年发表的中试研究，说明该技术路线<em class="hlr">已完成中试验证、技术成熟度较高</em>，学术层面不再属前沿探索。国家能源集团 2024 年发表的参数优化研究进一步说明头部企业已在该方向做工程化推进。论文与专利两侧共同指向同一结论：该方向<em class="hlr">研究与转化均已充分展开</em>，本创新点的前沿性有限。</p>

<h4>（4）创新性评估</h4>
<div class="tw">
<table>
<thead><tr><th style="width:150px">评估项</th><th>数据依据</th><th>结论</th></tr></thead>
<tbody>
<tr><td>是否容易形成技术壁垒</td><td>相似专利 187 件、相似论文 62 篇，两库均持续增长；核心路线已有多家主体密集布局，最高相似度 87%</td><td><span class="b r">难以形成壁垒</span> 技术已充分开发，本项目在该路线上无差异化空间</td></tr>
<tr><td>是否具有技术领先性</td><td>专利侧最高相似 87% 且在华有效；论文侧最高 83% 已完成中试；本项目结晶盐纯度指标 ≥98.5% 仅优于对比专利 0.3 个百分点</td><td><span class="b a">领先性依据不足</span> 与现有方案技术路线一致，指标优势幅度有限，须补充差异说明</td></tr>
</tbody>
</table>
</div>
<div class="box a">
<h5>创新点二评估结论：须补充差异化说明</h5>
<p>该创新点的核心技术组合与 CN112794520B 在分离原理、工艺配置、浓水处理、后段衔接四个维度一致，相似度 87%；论文侧最高相似度 83% 的中试研究亦已完成验证。<em class="hl">按现有建议书表述，尚不足以支撑该创新点的新颖性主张</em>——进水矿化度区间限定属应用场景收窄，结晶盐纯度高 0.3 个百分点属同一工艺的参数优化。该项是 S4 技术方案新颖性落入 30 档的直接原因。</p>
<p style="margin:0"><strong>两条可行的改进方向供申报方选择：</strong>一是提出与现有方案在技术手段层面有实质差异的路线，例如改变分盐机理、调整膜组合方式或引入新的预处理耦合环节；二是将该创新点重新定位为<em class="hl">工程集成与工艺适配层面的改进</em>——即在既有分盐原理下，针对矿井水特有的硬度、硅含量与水质波动做系统适配，并以运行稳定性、膜寿命、吨水能耗等工程指标体现价值。后者更贴合本项目「建成工业示范」的成果定位，也与第二章判定的该分支「工程化主导」特征一致。</p>
</div>
<h3 id="s3-3">3.3　创新点三　浓盐水零排放经济性优化模型</h3>
<h4>（1）创新点描述</h4>
<div class="card">
<p style="margin:0">以能耗与药剂成本为约束，建立浓盐水处置路径的经济性优化模型，在达标前提下降低单位水量处理成本。技术原理为将处置路径选择转化为多约束条件下的最优化问题，以单位处理成本为目标函数；实现方式为构建包含膜通量衰减、药剂投加量、蒸发能耗等参数的成本模型并求解最优路径组合；应用场景为浓盐水处置工艺路线设计与运行参数调优。</p>
</div>

<h4>（2）专利分析</h4>
<div class="fig">
<div class="ft">图 3-5　创新点三相似专利年度申请趋势</div>
<div class="fs">2016—2024 年，纵轴为年度申请量（相似度 ≥40% 的专利，因高相似度专利过少故放宽阈值）</div>
<svg viewBox="0 0 700 190" role="img" aria-label="创新点三相似专利年度趋势，数量低且平缓，2024年仅6件">
<g stroke="var(--grid)" stroke-width="1">
<line x1="40" y1="20" x2="680" y2="20"/><line x1="40" y1="60" x2="680" y2="60"/>
<line x1="40" y1="100" x2="680" y2="100"/><line x1="40" y1="135" x2="680" y2="135"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="34" y="139">0</text><text x="34" y="104">3</text><text x="34" y="64">6</text><text x="34" y="24">9</text></g>
<g fill="var(--c4)" opacity="0.8">
<rect x="56" y="122" width="30" height="13"/><rect x="132" y="122" width="30" height="13"/>
<rect x="208" y="109" width="30" height="26"/><rect x="284" y="122" width="30" height="13"/>
<rect x="360" y="109" width="30" height="26"/><rect x="436" y="96" width="30" height="39"/>
<rect x="512" y="109" width="30" height="26"/><rect x="588" y="83" width="30" height="52"/>
<rect x="650" y="57" width="30" height="78"/></g>
<text x="665" y="49" fill="var(--c4)" font-size="10.5" font-weight="700" text-anchor="middle">6</text>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="71" y="155">2016</text><text x="147" y="155">2017</text><text x="223" y="155">2018</text>
<text x="299" y="155">2019</text><text x="375" y="155">2020</text><text x="451" y="155">2021</text>
<text x="527" y="155">2022</text><text x="603" y="155">2023</text><text x="665" y="155">2024</text></g>
</svg>
<div class="fn">相似专利累计仅 29 件，年度分布低且波动，无稳定增长趋势。已放宽相似度阈值至 40%，说明该方向专利布局稀疏。</div>
</div>
<div class="tw">
<table>
<caption>相似度 TOP5 专利（创新点三）</caption>
<thead><tr><th>专利名称</th><th>公开号</th><th class="n">相似度</th><th>法律状态</th><th>权利人</th></tr></thead>
<tbody>
<tr><td>一种废水处理系统能耗优化方法</td><td>CN115271262A</td><td class="n">54%</td><td><span class="b a">在华有效</span></td><td>清华大学</td></tr>
<tr><td>高盐废水处理工艺经济性评价方法</td><td>CN113888345A</td><td class="n">48%</td><td><span class="b a">在华有效</span></td><td>某环境工程院（国企）</td></tr>
<tr><td>蒸发结晶系统运行参数优化装置</td><td>CN114873661A</td><td class="n">45%</td><td><span class="b a">在华有效</span></td><td>国家能源集团</td></tr>
<tr><td>污水处理厂药剂投加量优化控制方法</td><td>CN112960764A</td><td class="n">43%</td><td><span class="b n">已失效</span></td><td>某水务集团</td></tr>
<tr><td>基于成本约束的水处理路径选择方法</td><td>CN116263804A</td><td class="n">41%</td><td><span class="b a">在华有效</span></td><td>浙江大学</td></tr>
</tbody>
</table>
</div>
<p>最高相似度仅 <em class="hlg">54%</em>，且该专利（CN115271262A）为通用废水处理能耗优化方法，未针对浓盐水零排放场景，亦未将药剂成本与膜通量衰减纳入同一模型。其余专利相似度均低于 50%，分别属能耗优化、经济性评价、参数优化等邻近但不同的技术问题。<em class="hlg">未检索到同类方案</em>，五件对比专利相似度均低于 60%，新颖性充分。</p>

<h4>（3）论文分析</h4>
<div class="tw">
<table>
<caption>相似度 TOP5 论文（创新点三）</caption>
<thead><tr><th>论文标题</th><th>来源</th><th class="n">相似度</th><th>研究机构</th></tr></thead>
<tbody>
<tr><td>矿井水零排放工艺全生命周期成本分析</td><td>煤炭工程 2024</td><td class="n">58%</td><td>煤炭科学研究总院</td></tr>
<tr><td>浓盐水处置技术经济性比较研究</td><td>化工环保 2023</td><td class="n">52%</td><td>河海大学</td></tr>
<tr><td>Techno-economic assessment of ZLD systems</td><td>Desalination 2022</td><td class="n">49%</td><td>中科院生态环境中心</td></tr>
<tr><td>蒸发结晶能耗影响因素研究</td><td>膜科学与技术 2022</td><td class="n">44%</td><td>太原理工大学</td></tr>
<tr><td>高盐废水处理成本构成分析</td><td>水处理技术 2021</td><td class="n">41%</td><td>西安科技大学</td></tr>
</tbody>
</table>
</div>
<p>论文侧最高相似度 58%，累计相似论文 34 篇。现有研究以<em class="hl">事后成本分析与技术经济比较</em>为主——先确定工艺再算成本，而本创新点将经济性作为<em class="hl">目标函数前置于路径选择</em>，属建模思路上的差异。国际期刊 Desalination 2022 年的 ZLD 技术经济评估同样属评估类研究，非优化建模。该方向研究整体偏少且方法层面尚未收敛，具备前沿性。</p>

<h4>（4）创新性评估</h4>
<div class="tw">
<table>
<thead><tr><th style="width:150px">评估项</th><th>数据依据</th><th>结论</th></tr></thead>
<tbody>
<tr><td>是否容易形成技术壁垒</td><td>相似专利 29 件、相似论文 34 篇，两库绝对量均低，年度分布无稳定增长；结晶盐提纯分支专论比 0.85 属研究期</td><td><span class="b g">容易形成壁垒</span> 专利少、论文少，方向刚萌芽，潜力空间大</td></tr>
<tr><td>是否具有技术领先性</td><td>专利侧最高 54%（通用方法，非本场景）；论文侧最高 58%（事后评估类，非优化建模）；建模思路存在实质差异</td><td><span class="b g">具有领先性</span> 以经济性为目标函数的优化建模未见同类方案</td></tr>
</tbody>
</table>
</div>
<div class="box g">
<h5>创新点三评估结论</h5>
<p style="margin:0">最高相似度 54%，未检索到同类方案，新颖性充分，<em class="hlg">创新空间明确且容易形成技术壁垒</em>。现有研究多聚焦工艺可行性与事后成本分析，鲜见以经济性为目标函数的优化建模。建议将该创新点作为本项目差异化定位的重点方向。需注意的是，建议书的单位处理成本指标（≤13 元/m³）缺少行业公开对比数据，建议补充测算依据与成本分项构成以增强说服力。</p>
</div>
<h3 id="s3-4">3.4　集团自有专利与知识库综合比对（重复立项判断）</h3>
<p>本节从两个维度判断本项目是否与集团内既有成果重复：<strong>①专利库维度</strong>——以中煤能源集团（含各二级单位）在本技术主题下的 57 件自有专利为比对基准，逐件计算与三个创新点的相似度；<strong>②知识库维度</strong>——以申报单位上传的知识库文件（历史立项书、定期跟踪专利简报等内部文档）为补充比对基准，识别专利库查不到的在研或已结题课题积累。<em class="hl">两个维度任一出现相似度 ≥80% 且预期指标无实质提升者，视为疑似重复立项</em>；60%—80% 者视为已有基础、须说明继承与改进关系。</p>
<div class="box i" style="margin-bottom:14px">
<h5>知识库比对说明</h5>
<p style="margin:0">知识库文件由申报单位在系统中上传，系统自动提取各文件的技术主题、研究对象、核心方法，再与本项目三个创新点做语义相似度比对。比对范围以申报单位实际上传的文件为准——上传内容越完整，覆盖面越广，漏判风险越低。本节若无知识库上传记录，则此维度缺失，仅凭专利库维度判断，须在报告中显式声明。</p>
</div>
<div class="fig">
<div class="ft">图 3-6　中煤集团自有专利在八个技术分支上的分布</div>
<div class="fs">近十年 57 件发明专利，按与第二章同一套分支标签归类</div>
<div class="bars">
<div class="bar"><div class="bn">井下排水与控制</div><div class="bt"><div class="bf" style="width:100%;background:var(--accent)"></div></div><div class="bv">16</div></div>
<div class="bar"><div class="bn">矿井水处理工艺</div><div class="bt"><div class="bf" style="width:81.3%;background:var(--c1)"></div></div><div class="bv">13</div></div>
<div class="bar"><div class="bn">水质监测预测</div><div class="bt"><div class="bf" style="width:62.5%;background:var(--c4)"></div></div><div class="bv">10</div></div>
<div class="bar"><div class="bn">煤水共采协同</div><div class="bt"><div class="bf" style="width:43.8%;background:var(--c5)"></div></div><div class="bv">7</div></div>
<div class="bar"><div class="bn">浓盐水资源化</div><div class="bt"><div class="bf" style="width:31.3%;background:var(--c3)"></div></div><div class="bv">5</div></div>
<div class="bar"><div class="bn">生态修复回灌</div><div class="bt"><div class="bf" style="width:18.8%;background:var(--c4);opacity:.7"></div></div><div class="bv">3</div></div>
<div class="bar"><div class="bn">结晶盐提纯</div><div class="bt"><div class="bf" style="width:12.5%;background:var(--c2);opacity:.7"></div></div><div class="bv">2</div></div>
<div class="bar"><div class="bn">膜材料抗污堵</div><div class="bt"><div class="bf" style="width:6.3%;background:var(--c3);opacity:.7"></div></div><div class="bv">1</div></div>
</div>
<div class="fn">集团自有积累集中在井下排水与控制、矿井水处理工艺两个分支（合计 29 件，50.9%）；本项目关键难题所在的膜材料抗污堵仅 1 件、结晶盐提纯 2 件，为集团内薄弱环节。</div>
</div>

<h4>（1）中煤集团相关专利清单（专利库维度，按与本项目最高相似度排序）</h4>
<div class="tw">
<table>
<caption>中煤能源集团自有专利与本项目创新点的逐件比对；申请人已按集团口径归并，括注二级单位</caption>
<thead><tr><th>序号</th><th>专利名称</th><th>公开号</th><th>申请日</th><th>权利人（二级单位）</th><th>法律状态</th><th>对应本项目创新点</th><th class="n">相似度</th><th>重复性判定</th></tr></thead>
<tbody>
<tr><td class="n">1</td><td>煤矿疏干水量预测与调度系统</td><td>CN116105073A</td><td>2022-11</td><td>中煤科工集团西安研究院</td><td><span class="b a">在华有效</span></td><td>创新点一</td><td class="n">52%</td><td><span class="b g">不重复</span> 属基础，输入量不同</td></tr>
<tr><td class="n">2</td><td>一种矿井水井下预处理装置</td><td>CN115093056A</td><td>2022-06</td><td>中煤（深圳）研究院</td><td><span class="b a">在华有效</span></td><td>创新点二（前段）</td><td class="n">48%</td><td><span class="b g">不重复</span> 属前段预处理</td></tr>
<tr><td class="n">3</td><td>矿井排水泵组节能控制方法</td><td>CN114384830A</td><td>2021-12</td><td>中煤科工集团上海研究院</td><td><span class="b a">在华有效</span></td><td>创新点一</td><td class="n">44%</td><td><span class="b g">不重复</span> 单一环节节能</td></tr>
<tr><td class="n">4</td><td>高盐矿井水反渗透浓水处置方法</td><td>CN113786731A</td><td>2021-08</td><td>中煤（深圳）研究院</td><td><span class="b a">在华有效</span></td><td>创新点二</td><td class="n">41%</td><td><span class="b g">不重复</span> 未涉及纳滤分盐</td></tr>
<tr><td class="n">5</td><td>矿区水资源循环利用系统</td><td>CN112919581A</td><td>2021-03</td><td>中煤能源集团（本部）</td><td><span class="b n">已失效</span></td><td>创新点三（弱）</td><td class="n">33%</td><td><span class="b g">不重复</span> 系统集成层面</td></tr>
<tr><td class="n">6</td><td>井下水仓水位智能监测装置</td><td>CN214093921U</td><td>2020-09</td><td>中煤科工集团西安研究院</td><td><span class="b a">在华有效</span></td><td>创新点一（弱）</td><td class="n">29%</td><td><span class="b g">不重复</span> 实用新型，监测硬件</td></tr>
<tr><td class="n">7</td><td>矿井水悬浮物混凝沉降工艺</td><td>CN111470677A</td><td>2020-04</td><td>中煤（深圳）研究院</td><td><span class="b a">在华有效</span></td><td>无对应</td><td class="n">21%</td><td><span class="b g">不重复</span> 常规预处理</td></tr>
<tr class="sum"><td colspan="7">57 件全量比对，上表列示相似度 ≥20% 的 7 件；其余 50 件相似度均 &lt;20%</td><td class="n">最高 52%</td><td><strong>未发现重复</strong></td></tr>
</tbody>
</table>
</div>

<h4>（2）三个创新点与集团自有专利的相似度分布（专利库维度）</h4>
<div class="tw">
<table>
<thead><tr><th>创新点</th><th class="n">集团相关专利件数</th><th class="n">与集团专利最高相似度</th><th class="n">与外部专利最高相似度</th><th>集团内技术继承关系</th></tr></thead>
<tbody>
<tr><td>创新点一　煤水共采协同调控方法</td><td class="n">7</td><td class="n">52%</td><td class="n">71%</td><td>CN116105073A 提供涌水量预测能力，可作为本创新点的输入模块直接复用，属<em class="hl">继承式改进</em></td></tr>
<tr><td>创新点二　高含盐矿井水纳滤分盐工艺</td><td class="n">4</td><td class="n">48%</td><td class="n">87%</td><td>集团自有仅覆盖预处理与浓水处置，<em class="hlr">纳滤分盐核心环节无自有专利</em>，须外部引进或自主突破</td></tr>
<tr><td>创新点三　浓盐水零排放经济性优化模型</td><td class="n">2</td><td class="n">33%</td><td class="n">54%</td><td>集团内无相关积累，属<em class="hlg">全新方向</em></td></tr>
</tbody>
</table>
</div>
<h4>（3）与院内知识库的比对（知识库维度）</h4>
<div class="tw">
<table>
<caption>知识库文件（历史立项书、专利简报等）与本项目三个创新点的相似度比对</caption>
<thead><tr><th>文件名称</th><th>文件类型</th><th>形成时间</th><th>对应本项目创新点</th><th class="n">相似度</th><th>重复性判定</th></tr></thead>
<tbody>
<tr><td>《矿井排水智能调度关键技术研究》立项书</td><td>历史立项书</td><td>2022-09</td><td>创新点一</td><td class="n">46%</td><td><span class="b g">不重复</span> 仅涉及排水单环节调度，未纳入回采推进参数</td></tr>
<tr><td>纳滤分盐工艺技术跟踪简报（第 7 期）</td><td>专利简报</td><td>2024-03</td><td>创新点二</td><td class="n">39%</td><td><span class="b g">不重复</span> 简报为外部动态跟踪，非本院立项成果</td></tr>
<tr><td>《高盐矿井水资源化利用可行性研究》立项书</td><td>历史立项书</td><td>2021-05</td><td>创新点二（弱）／创新点三（弱）</td><td class="n">28%</td><td><span class="b g">不重复</span> 停留于可行性论证阶段，未形成技术方案</td></tr>
<tr class="sum"><td colspan="4">知识库文件全量比对，上表列示相似度 ≥20% 的 3 件；其余文件相似度均 &lt;20%</td><td class="n">最高 46%</td><td><strong>未发现重复</strong></td></tr>
</tbody>
</table>
</div>
<div class="ch" id="c4">
  <div class="cn">第四章</div>
  <h2>政策分析</h2>
  <p class="lead">政策数据分类与覆盖范围 · 政策全景与趋势 · 匹配度分析 · 政策维度结论</p>
</div>

<h3 id="s4-0">4.1　政策数据分类与覆盖范围</h3>
<p>本次政策分析共纳入政策文件 <em class="hl">47 件</em>。按发布层级分类如下，层级决定政策的权威性与约束力，是 4.3 节支持强度加权的依据。</p>

<h4>按发布层级分类</h4>
<div class="tw">
<table>
<caption>层级决定政策的权威性与约束力，是支持强度加权的依据</caption>
<thead><tr><th>层级</th><th class="n">件数</th><th class="n">占比</th><th>典型发布机构</th><th>层级权重</th></tr></thead>
<tbody>
<tr><td>国家专项政策<br><span class="small">针对特定领域的专门文件</span></td><td class="n">8</td><td class="n">17.0%</td><td>水利部、国家发改委联合发文</td><td class="n">1.0</td></tr>
<tr><td>国家规划纲要<br><span class="small">五年规划、区域战略</span></td><td class="n">11</td><td class="n">23.4%</td><td>中共中央、国务院</td><td class="n">0.9</td></tr>
<tr><td>行业规划与指导意见</td><td class="n">14</td><td class="n">29.8%</td><td>国家能源局、煤炭工业协会、生态环境部</td><td class="n">0.7</td></tr>
<tr><td>地方政策</td><td class="n">11</td><td class="n">23.4%</td><td>内蒙古、陕西、宁夏三省区政府及主管部门</td><td class="n">0.5</td></tr>
<tr><td>集团内部制度</td><td class="n">3</td><td class="n">6.4%</td><td>中国中煤能源集团</td><td class="n">0.8</td></tr>
<tr class="sum"><td>合计</td><td class="n">47</td><td class="n">100%</td><td colspan="2">国家层级合计 19 件（40.4%）</td></tr>
</tbody>
</table>
</div>

<div class="box i">
<h5>数据来源与覆盖边界</h5>
<p>政策来源为国务院政策文件库、国家发改委、水利部、国家能源局、生态环境部官方网站，地方政策取自内蒙古、陕西、宁夏三省区政府门户，集团制度由申报单位提供。已核验效力状态，剔除已废止文件 3 件。</p>
<p style="margin:0"><strong>覆盖边界：</strong>本次分析<em class="hl">停留在政策文件层面，未做条款级逐条比对</em>。行业协会规范、尚未公开的地方细则、企业内部未公开文件不在范围内。政策与项目的契合判断基于政策原文的方向性表述，<strong>不构成合规性结论</strong>——项目的合规性须在示范工程实施阶段通过环评、取水许可、排污许可等法定程序确认。</p>
</div>

<h3 id="s4-1">4.2　政策全景与趋势分析</h3>
<div class="fig">
<div class="ft">图 4-1　近五年相关政策发布数量趋势（按层级堆叠）</div>
<div class="fs">2021—2025 年，纵轴为政策发布件数</div>
<svg viewBox="0 0 700 210" role="img" aria-label="近五年政策发布数量堆叠柱状图，由2021年4件增至2025年13件">
<g stroke="var(--grid)" stroke-width="1">
<line x1="40" y1="20" x2="680" y2="20"/><line x1="40" y1="60" x2="680" y2="60"/>
<line x1="40" y1="100" x2="680" y2="100"/><line x1="40" y1="140" x2="680" y2="140"/></g>
<g fill="var(--ink3)" font-size="10" text-anchor="end">
<text x="34" y="144">0</text><text x="34" y="104">5</text><text x="34" y="64">10</text><text x="34" y="24">15</text></g>
<g>
<rect x="80" y="124" width="58" height="16" fill="var(--c1)"/><rect x="80" y="108" width="58" height="16" fill="var(--c2)"/>
<rect x="200" y="116" width="58" height="24" fill="var(--c1)"/><rect x="200" y="100" width="58" height="16" fill="var(--c2)"/><rect x="200" y="92" width="58" height="8" fill="var(--c3)"/>
<rect x="320" y="108" width="58" height="32" fill="var(--c1)"/><rect x="320" y="92" width="58" height="16" fill="var(--c2)"/><rect x="320" y="84" width="58" height="8" fill="var(--c3)"/>
<rect x="440" y="100" width="58" height="40" fill="var(--c1)"/><rect x="440" y="76" width="58" height="24" fill="var(--c2)"/><rect x="440" y="68" width="58" height="8" fill="var(--c3)"/><rect x="440" y="60" width="58" height="8" fill="var(--c4)"/>
<rect x="560" y="92" width="58" height="48" fill="var(--c1)"/><rect x="560" y="60" width="58" height="32" fill="var(--c2)"/><rect x="560" y="52" width="58" height="8" fill="var(--c3)"/><rect x="560" y="36" width="58" height="16" fill="var(--c4)"/>
</g>
<text x="109" y="102" fill="var(--ink3)" font-size="10.5" font-weight="700" text-anchor="middle">4</text>
<text x="589" y="30" fill="var(--brand2)" font-size="10.5" font-weight="700" text-anchor="middle">13</text>
<g fill="var(--ink3)" font-size="10" text-anchor="middle">
<text x="109" y="160">2021</text><text x="229" y="160">2022</text><text x="349" y="160">2023</text>
<text x="469" y="160">2024</text><text x="589" y="160">2025</text></g>
</svg>
<div class="lg"><span><i style="background:var(--c1)"></i>国家层级</span><span><i style="background:var(--c2)"></i>行业层级</span><span><i style="background:var(--c3)"></i>地方层级</span><span><i style="background:var(--c4)"></i>集团层级</span></div>
<div class="fn">法律与强制性标准不受近五年限制，已全量纳入合规审查。</div>
</div>
<div class="fig">
<div class="ft">图 4-2　政策发布机构分布</div>
<div class="fs">近五年，按发布机构统计政策件数</div>
<div class="bars">
<div class="bar"><div class="bn">国家发改委</div><div class="bt"><div class="bf" style="width:100%;background:var(--c1)"></div></div><div class="bv">9</div></div>
<div class="bar"><div class="bn">水利部</div><div class="bt"><div class="bf" style="width:77.8%;background:var(--c1)"></div></div><div class="bv">7</div></div>
<div class="bar"><div class="bn">国家能源局</div><div class="bt"><div class="bf" style="width:66.7%;background:var(--c2)"></div></div><div class="bv">6</div></div>
<div class="bar"><div class="bn">生态环境部</div><div class="bt"><div class="bf" style="width:55.6%;background:var(--c2)"></div></div><div class="bv">5</div></div>
<div class="bar"><div class="bn">中煤集团</div><div class="bt"><div class="bf" style="width:33.3%;background:var(--accent)"></div></div><div class="bv">3</div></div>
<div class="bar"><div class="bn">其他</div><div class="bt"><div class="bf" style="width:22.2%;background:var(--line)"></div></div><div class="bv">2</div></div>
</div>
<div class="fn">主要推动部门为国家发改委与水利部，二者合计占 50%，反映政策驱动力来自黄河流域治理与水资源管理两条主线。</div>
</div>
<p>近五年相关政策发布量由 2021 年 4 件增至 2025 年 13 件，年均增长 <em class="hl">34.2%</em>，远高于判定口径中「上升期」的 10% 门槛，属<em class="hl">政策窗口开启期</em>。层级结构上，国家层级政策占比稳定在半数以上，集团层级自 2024 年起出现并在 2025 年增至 2 件，说明该方向<em class="hl">已由国家战略逐层传导至集团内部攻关方向</em>。</p>
<p>与第二章技术趋势的交叉印证：政策发布增速（34.2%）显著高于专利增速（20.3%）与论文增速（12.8%），三条曲线同向上升，说明这不是政策空转——政策推动、学术研究与工程转化同步推进，方向真实且需求明确。</p>
<h3 id="s4-3">4.3　政策匹配度分析</h3>
<h4>政策支持力度分析</h4>
<p>每条政策必须挂到具体研究内容，仅领域大方向提及者判为弱相关、折叠展示、不计入支持度评分。</p>
<div class="tw" style="margin-bottom:14px">
<table>
<caption>支持强度三档判定标准——同时满足同一行的全部条件才能落该档</caption>
<thead><tr><th style="width:80px">支持强度</th><th>措辞强度</th><th>挂接精度</th><th>层级要求</th><th>典型措辞示例</th></tr></thead>
<tbody>
<tr><td><span class="b g">强支持</span></td><td>政策原文使用<strong>强制性或专项性动词</strong>：列为重点攻关方向、专项支持、重点推进、明确要求</td><td>能挂到本项目的<strong>具体研究内容编号</strong>（不是整个技术领域）</td><td>国家专项／集团制度均可；行业规划须措辞极强（「专项支持」以上）</td><td>「将高矿化度矿井水分盐资源化<u>列为重点攻关方向</u>」</td></tr>
<tr><td><span class="b a">一般支持</span></td><td>政策原文使用<strong>鼓励性动词</strong>：鼓励、推动、支持、引导</td><td>能挂到具体研究内容，但措辞为方向性鼓励而非专项部署</td><td>行业规划、地方政策、国家规划中的专项章节</td><td>「<u>鼓励</u>零排放技术示范」「<u>支持</u>井下辅助生产系统智能化调控」</td></tr>
<tr><td><span class="b n">弱相关</span></td><td>仅提及上位领域或一般性目标，未点名具体技术方向</td><td>只能挂到<strong>上位领域</strong>，无法落到具体研究内容</td><td>任何层级均可落此档，层级不决定是否弱相关</td><td>「加强流域水资源节约集约利用」「推进工业废水循环利用」</td></tr>
</tbody>
</table>
</div>
<div class="tw">
<table>
<caption>政策支持清单（按支持强度排序）</caption>
<thead><tr><th>政策名称</th><th>发布机构</th><th>时间</th><th>层级</th><th>鼓励方向原文摘要</th><th>对应研究内容</th><th>支持强度</th></tr></thead>
<tbody>
<tr><td>关于加强黄河流域矿井水保护利用的指导意见</td><td>水利部、国家发改委</td><td>2024-03</td><td>国家专项</td><td>「将高矿化度矿井水分盐资源化列为重点攻关方向」</td><td>研究内容（2）（3）</td><td><span class="b g">强支持</span></td></tr>
<tr><td>中煤集团年度科技攻关方向指南</td><td>中国中煤能源集团</td><td>2026-01</td><td>集团制度</td><td>「水资源综合利用列为年度重点攻关方向」</td><td>研究内容（1）（2）（3）</td><td><span class="b g">强支持</span></td></tr>
<tr><td>煤炭工业「十四五」高质量发展指导意见</td><td>中国煤炭工业协会</td><td>2021-06</td><td>行业规划</td><td>「推动矿井水资源化利用，鼓励零排放技术示范」</td><td>研究内容（2）（4）</td><td><span class="b a">一般支持</span></td></tr>
<tr><td>关于推进煤矿智能化建设的指导意见</td><td>国家能源局</td><td>2023-08</td><td>行业规划</td><td>「支持井下辅助生产系统智能化调控」</td><td>研究内容（1）</td><td><span class="b a">一般支持</span></td></tr>
<tr><td>黄河流域生态保护和高质量发展规划纲要</td><td>中共中央、国务院</td><td>2021-10</td><td>国家规划</td><td>「加强流域水资源节约集约利用」</td><td>上位领域对应</td><td><span class="b n">弱相关</span></td></tr>
<tr><td>「十四五」节能减排综合工作方案</td><td>国务院</td><td>2022-01</td><td>国家规划</td><td>「推进工业废水循环利用」</td><td>上位领域对应</td><td><span class="b n">弱相关</span></td></tr>
</tbody>
</table>
</div>
<div class="box g">
<h5>支持力度结论：强支持</h5>
<p style="margin:0">《关于加强黄河流域矿井水保护利用的指导意见》明确将「高矿化度矿井水分盐资源化」列为<em class="hlg">重点攻关方向</em>，与本项目技术主题直接对应，属国家专项层级强支持；集团年度攻关方向指南亦将水资源综合利用列为年度重点，三项研究内容全部覆盖。两条强支持均为直接对应而非上位领域泛化，符合「每条政策必须挂到具体研究内容」的要求。两条弱相关政策（黄河流域规划纲要、节能减排方案）仅在上位领域层面提及，已折叠处理、不计入评分。</p>
</div>

<h3 id="s4-4">4.4　政策维度结论</h3>
<div class="tw">
<table>
<caption>政策维度汇总</caption>
<thead><tr><th>分析环节</th><th>数据依据</th><th>结论</th></tr></thead>
<tbody>
<tr><td>4.1 政策数据分类</td><td>47 件政策按发布层级分类，已核验效力状态</td><td>国家层级 19 件（40.4%），集团制度 3 件</td></tr>
<tr><td>4.2 政策趋势</td><td>近五年发布量由 4 件增至 13 件，年均增长 34.2%</td><td><span class="b g">政策窗口开启期</span></td></tr>
<tr><td>4.3 支持力度</td><td>国家专项政策与集团年度攻关指南各 1 件为强支持，均直接对应具体研究内容</td><td><span class="b g">强支持</span> 三项研究内容全覆盖</td></tr>
<tr class="sum"><td>政策维度得分</td><td>S7 政策匹配分析</td><td>20.0／20</td></tr>
</tbody>
</table>
</div>
<div class="box g">
<h5>政策维度结论：政策契合度高，政策环境处于上升期</h5>
<p>项目与国家专项政策及集团攻关方向<em class="hlg">直接对应</em>。《关于加强黄河流域矿井水保护利用的指导意见》将「高矿化度矿井水分盐资源化」列为重点攻关方向，集团 2026 年度科技攻关方向指南将水资源综合利用列为年度重点，两条政策合计覆盖本项目全部三项研究内容。政策发布量近五年年均增长 34.2%，且政策增速高于专利与论文增速，三条曲线同向上升，方向真实、需求明确。政策维度按二级指标加权计分 <em class="hlg">20.0／20</em>。</p>
<p style="margin:0"><strong>供专家参考：</strong>本节分析停留在政策文件层面，未做条款级比对，<em class="hl">不构成合规性结论</em>；项目合规性须在示范工程实施阶段通过环评、取水许可、排污许可等法定程序确认。</p>
</div>
<div class="ch" id="c5">
  <div class="cn">第五章</div>
  <h2>审查建议</h2>
  <p class="lead">行业发展趋势契合度 · 主要竞争主体及研究进展（专利与论文双维度）· 行业机遇与挑战</p>
</div>

<h3 id="s5-1">5.1　行业发展趋势契合度评估</h3>
<div class="box g">
<h5>结论：本项目符合行业发展趋势</h5>
<p style="margin:0">基于第二章「领域技术趋势总结」、第三章「创新性评估」与第四章「政策分析」三项判断，本项目<em class="hlg">符合</em>行业发展趋势。</p>
</div>
<div class="tw">
<table>
<thead><tr><th style="width:180px">判断项</th><th>依据来源</th><th>结论</th></tr></thead>
<tbody>
<tr><td>项目与行业创新方向一致</td><td>领域技术趋势总结 + 创新性评估</td><td><span class="b g">一致</span> 矿井水零排放与分盐资源化已成行业共识，专利与论文双升且较前五年均值显著增长；本项目三个创新点中两项创新空间明确，方向与行业技术演进路径吻合</td></tr>
<tr><td>能有效应对行业技术挑战</td><td>项目概述 + 创新性评估</td><td><span class="b g">能应对</span> 高矿化度涌水治理是深部开采的刚性需求；项目针对膜污堵与结垢、采排时序耦合、零排放经济性三项难题提出方案，其中膜污堵与结垢对应分支专论比 0.91，属研究期、创新空间较大；采排时序耦合对应分支专论比 2.51，属工程化偏向，创新须落在工艺与集成层面</td></tr>
<tr><td>顺应法规政策变化</td><td>政策分析</td><td><span class="b g">顺应</span> 受黄河流域矿井水保护利用专项政策直接驱动，政策发布量年均增长 34.2%，且政策增速高于专利与论文增速，方向与政策导向一致</td></tr>
</tbody>
</table>
</div>
<p>需附带说明的一点：符合行业趋势与具备竞争优势是两个不同的判断。本项目所处领域已进入「论文多·专利多」的技术热点期，头部主体持续投入且已有工程化案例，项目价值取决于差异化程度。三个创新点中，创新点一与创新点三落在低密度分支上、差异明确；<em class="hl">创新点二落在最主流、竞争最充分的分支上，须以差异化设计取得空间</em>。这是趋势契合度高与细分环节竞争激烈并存的具体表现，也是本报告建议重点补强的环节。</p>

<h3 id="s5-2">5.2　主要竞争主体及研究进展总结</h3>
<p>本节从专利与论文两个维度识别竞争主体。<em class="hl">两库单独统计、不合并计数</em>：专利反映工程转化与权利布局，论文反映基础研究投入与技术走向，同一主体在两库的位置往往不同——这个差异本身即是判断该主体处于什么阶段的依据。</p>

<h4>（1）专利维度：工程转化与权利布局</h4>
<div class="tw">
<table>
<caption>取专利申请人 TOP5，已按集团口径归并</caption>
<thead><tr><th>企业／机构</th><th class="n">发明专利</th><th>核心优势</th><th>新技术成果（技术问题-方案-功效）</th><th>关键专利</th></tr></thead>
<tbody>
<tr><td>中国矿业大学</td><td class="n">98</td><td>基础研究能力最强，覆盖分盐机理、膜材料、采排协同全链条，与多家能源集团有合作通道</td><td>针对两级纳滤分盐工艺参数不明确，通过中试装置系统标定分离率与能耗关系，实现一价盐分离率提升至 92% 以上</td><td>CN114592909A（已失效）</td></tr>
<tr><td>国家能源集团</td><td class="n">76</td><td>工程化能力与示范场景资源突出，宁东基地已有落地案例，增速最快</td><td>针对浓盐水结晶盐品质不稳定，通过分盐结晶工艺与装置组合控制杂质离子，实现工业级结晶盐稳定产出</td><td>CN114212881A（在华有效）</td></tr>
<tr><td>中煤能源集团<br><span class="small">（申报单位所属）</span></td><td class="n">57</td><td>矿区分布广、应用场景多，具备成果内部推广条件；研究时间连续性好</td><td>针对疏干水量预测精度不足，通过水文动态监测与预测模型结合，支撑排水系统调度</td><td>CN116105073A（在华有效）</td></tr>
<tr><td>陕煤集团</td><td class="n">47</td><td>深部矿区实践经验丰富，井下系统改造能力强</td><td>针对排水调度依赖人工经验，通过智能调度装置实现自动化控制</td><td>CN115163150A（在华有效）</td></tr>
<tr><td>中科院生态环境中心</td><td class="n">33</td><td>膜材料研究国内领先，国际期刊发表活跃</td><td>针对高含盐条件下膜污堵，通过膜材料表面改性提升抗污堵性能</td><td>膜材料类专利群</td></tr>
</tbody>
</table>
</div>
<p>专利侧头部主体以高校与大型能源集团为主，前五名合计 311 件、占发明专利总量三成半。中煤集团居第三位，已有积累但非领先。国家能源集团增速最快且已有工程化落地案例，是本项目在分盐结晶环节的主要竞争者。</p>

<h4>（2）论文维度：基础研究投入与技术走向</h4>
<div class="tw">
<table>
<caption>取论文发表机构 TOP5，机构名已按与专利侧同一套归并规则处理；近十年累计</caption>
<thead><tr><th>企业／机构</th><th class="n">论文篇数</th><th>研究重点与投入特征</th><th>代表性研究进展</th><th>主要发表期刊</th></tr></thead>
<tbody>
<tr><td>中国矿业大学</td><td class="n">142</td><td>两库均居首位，投入强度最大：年发表量由 2016 年 8 篇增至 2024 年 28 篇，覆盖分盐机理、膜材料、采排协同全链条</td><td>2023 年完成矿井水两级纳滤分盐中试研究，标定分离率与能耗关系；2024 年发表采掘工序与排水负荷协同优化研究，停留在理论建模层面</td><td>煤炭学报、Water Research、煤田地质与勘探</td></tr>
<tr><td>中科院生态环境中心</td><td class="n">96</td><td><em class="hl">论文第 2 位、专利第 5 位</em>，明显偏基础研究；国际期刊发表活跃，膜材料方向国内领先</td><td>抗污堵膜材料表面改性机理研究，2024 年起相关专利开始活跃，呈现由论文向专利转化的迹象</td><td>Journal of Membrane Science、Desalination</td></tr>
<tr><td>太原理工大学</td><td class="n">78</td><td>膜过程与结垢行为研究为主，专利侧未进 TOP5，属研究型主体</td><td>纳滤膜分盐过程中的结垢行为研究；基于水位反馈的排水控制方法（相关专利已失效）</td><td>膜科学与技术、煤炭科学技术</td></tr>
<tr><td>国家能源集团</td><td class="n">68</td><td>企业中发表量最高，由 2016 年 4 篇增至 2024 年 15 篇；<em class="hl">专利与论文双高</em>，研究与转化同步推进</td><td>2024 年发表高盐矿井水纳滤分盐工艺参数优化研究，与其分盐结晶专利形成呼应，属工程化前置研究</td><td>煤炭科学技术、Desalination</td></tr>
<tr><td>中煤能源集团<br><span class="small">（申报单位所属）</span></td><td class="n">34</td><td>由 2016 年 3 篇增至 2024 年 12 篇，持续增长且与建议书自述一致；研究重点为疏干水预测与井下排水</td><td>疏干水量预测与排水调度方向有连续积累；<em class="hlr">分盐机理与膜材料方向发表量偏低</em></td><td>煤炭科学技术、煤炭工程</td></tr>
</tbody>
</table>
</div>
<p>论文侧五家机构合计年发表量由 2016 年 22 篇增至 2024 年 92 篇，翻两倍以上，院所端持续高投入表明该方向基础研究尚未见顶。<em class="hl">值得注意的是企业也在持续发表论文而非仅申请专利</em>——国家能源集团、中煤集团两家的论文量均逐年增加，说明企业愿意在基础研究层面投入，而非仅作短期专利储备，这从侧面印证该技术的应用前景明确。</p>

<h4>（3）两库交叉对照：识别各主体所处阶段</h4>
<p>把同一主体在两库的位次放在一起看，可以判断该主体是偏基础研究、偏工程转化，还是两端并重。这是单看一个库得不出的信息。</p>
<div class="tw">
<table>
<caption>专论比 = 该机构专利件数 ÷ 论文篇数；比值高者偏工程转化，低者偏基础研究</caption>
<thead><tr><th>机构</th><th class="n">专利<br>件数</th><th class="n">专利<br>位次</th><th class="n">论文<br>篇数</th><th class="n">论文<br>位次</th><th class="n">专论比</th><th>阶段判读与对本项目的含义</th></tr></thead>
<tbody>
<tr><td>中国矿业大学</td><td class="n">98</td><td class="n">1</td><td class="n">142</td><td class="n">1</td><td class="n">0.69</td><td><span class="b a">两端并重、偏研究</span> 两库均居首位，从机理到中试全链条覆盖。创新点一、创新点二的最相似论文均出自该校，是<em class="hl">技术对标的首要对象</em>，也具备合作条件</td></tr>
<tr><td>国家能源集团</td><td class="n">76</td><td class="n">2</td><td class="n">68</td><td class="n">4</td><td class="n">1.12</td><td><span class="b r">两端并重、偏转化</span> 论文先行、专利跟进、工程落地，完整链条已走通。<em class="hlr">在分盐结晶环节构成最直接竞争</em></td></tr>
<tr><td>中煤能源集团<br><span class="small">（申报单位所属）</span></td><td class="n">57</td><td class="n">3</td><td class="n">34</td><td class="n">5</td><td class="n">1.68</td><td><span class="b a">偏工程转化</span> 专利多于论文，工程侧强、机理研究相对薄弱。创新点二涉及的分盐机理与膜材料是<em class="hl">自身短板，须外部补强</em></td></tr>
<tr><td>陕煤集团</td><td class="n">47</td><td class="n">4</td><td class="n">—</td><td class="n">未进 TOP5</td><td class="n">高</td><td><span class="b n">工程主导</span> 以井下系统改造与装置类专利为主，基础研究投入少，竞争集中在采排环节的工程实现</td></tr>
<tr><td>中科院生态环境中心</td><td class="n">33</td><td class="n">5</td><td class="n">96</td><td class="n">2</td><td class="n">0.34</td><td><span class="b g">研究主导</span> 论文远多于专利，膜材料机理研究国内领先且转化刚起步。<em class="hlg">与本项目非直接竞争关系，是膜污堵难题的优先合作对象</em></td></tr>
<tr><td>太原理工大学</td><td class="n">—</td><td class="n">未进 TOP5</td><td class="n">78</td><td class="n">3</td><td class="n">低</td><td><span class="b g">研究主导</span> 结垢行为研究有积累，相关专利已失效、可自由使用</td></tr>
</tbody>
</table>
</div>
<div class="box i">
<h5>两库对照得出的三条判断</h5>
<p><strong>1. 真正的竞争者是国家能源集团，而非中国矿业大学。</strong>矿大专论比 0.69、偏研究侧，其成果多以论文公开、部分专利已失效，对本项目更多是技术起点与合作可能；国家能源集团专论比 1.12、论文与专利同步推进且已工程落地，与本项目在分盐结晶环节的路线重叠最实质。</p>
<p><strong>2. 中煤集团的短板在机理侧而非工程侧。</strong>本集团专论比 1.68，为六家中最高（除纯工程型的陕煤），说明工程转化能力不弱，但基础研究相对薄弱——论文位次（第 5）低于专利位次（第 3）。这与 3.4 节的发现一致：集团在膜材料抗污堵仅 1 件专利、结晶盐提纯 2 件。<em class="hl">创新点二恰好落在这个薄弱区间</em>。</p>
<p style="margin:0"><strong>3. 中科院生态环境中心是合作而非竞争关系。</strong>专论比 0.34，研究主导、转化刚起步，与本项目在专利层面几乎不构成冲突，而其膜材料改性研究正对应本项目的第一项关键技术难题。建议评审时关注建议书是否考虑了外部合作路径。</p>
</div>

<h4>（4）本项目与主要竞争主体的技术优势对比</h4>
<div class="tw">
<table>
<thead><tr><th>对比维度</th><th>竞争主体技术方案</th><th>本项目方案</th><th>优势判定</th></tr></thead>
<tbody>
<tr><td>采排协同</td><td>陕煤集团、中煤集团均为单一排水环节的智能调度或水量预测，控制输入为水位与涌水量实测值</td><td>以回采推进度为输入的前馈预测式双向协同调控</td><td><span class="b g">具备优势</span> 控制逻辑与协同维度不同，工程化实现属空白</td></tr>
<tr><td>纳滤分盐</td><td>国家能源集团分盐结晶工艺已布局；中国矿业大学已完成中试；外部民营主体在同一路线上已有专利积累</td><td>两级纳滤分盐，结晶盐纯度 ≥98.5%</td><td><span class="b a">优势待建立</span> 技术路线与现有方案一致，最高相似度 87%，指标优于对比方案 0.3 个百分点，须补充差异化设计</td></tr>
<tr><td>经济性优化</td><td>各主体均未见以经济性为目标函数的优化建模，现有研究为事后成本分析</td><td>以能耗与药剂成本为约束的路径优化模型</td><td><span class="b g">具备优势</span> 未见同类方案，容易形成技术壁垒</td></tr>
<tr><td>示范场景资源</td><td>国家能源集团已有宁东基地落地案例</td><td>蒙陕深部矿区示范矿井，处理量 5,000 m³/d</td><td><span class="b a">基本持平</span> 场景资源具备，但落地经验少于国家能源集团</td></tr>
</tbody>
</table>
</div>
<p>综合判断：本项目在<em class="hlg">采排协同与经济性优化两个方向具备实质技术优势</em>，均属现有主体未充分布局的方向，是本项目最值得强化的差异化定位。<em class="hl">纳滤分盐工序上优势尚未建立</em>，该方向已有多家主体密集布局，与国家能源集团的路线重叠集中在分盐与结晶环节，建议在该环节补充差异化设计说明或明确工程适配层面的价值主张。</p>
<p>结合两库交叉对照，本项目的竞争态势可概括为：<em class="hl">工程侧站位不弱，机理侧存在缺口</em>。中煤集团专论比 1.68，工程转化能力在六家主体中偏强，示范场景资源具备，这支撑了创新点一的采排协同与创新点三的经济性优化——两者都是工艺与集成层面的创新。但创新点二依赖分盐机理与膜材料的基础研究能力，而这恰是本集团论文位次低于专利位次所反映的短板，同时又是矿大与中科院生态环境中心的强项。<em class="hl">建议评审时关注建议书是否就该环节提出了合作或引进安排</em>，仅靠自有力量在该环节与已完成中试的主体正面竞争，难度较大。</p>

<h3 id="s5-3">5.3　行业机遇与挑战总结</h3>
<div class="two">
<div class="card" style="margin:0;border-left:3px solid var(--green)">
<h5 style="margin-top:0;color:var(--green)">机遇</h5>
<p style="margin:0 0 9px">1. 政策扶持持续加大，近五年相关政策发布量年均增长 34.2%，处于政策窗口开启期</p>
<p style="margin:0 0 9px">2. 黄河流域矿井水利用已上升为国家战略，专项政策明确将高矿化度矿井水分盐资源化列为重点攻关方向</p>
<p style="margin:0 0 9px">3. 集团已将水资源综合利用列入 2026 年度科技攻关方向指南，条目级匹配</p>
<p style="margin:0 0 9px">4. 申报单位具备连续五年的技术积累，57 件专利、34 篇论文，与自述一致</p>
<p style="margin:0">5. 领域内学术研究与工程应用双向活跃，院所端持续高投入，具备充分的合作与借鉴基础</p>
</div>
<div class="card" style="margin:0;border-left:3px solid var(--red)">
<h5 style="margin-top:0;color:var(--red)">挑战</h5>
<p style="margin:0 0 9px">1. 纳滤分盐核心工艺与现有方案最高相似度 87%，差异化空间须通过工程适配或工艺组合调整建立</p>
<p style="margin:0 0 9px">2. 高含盐条件下膜污堵与结垢问题尚未根本解决，属论文中反复提及的未突破难题</p>
<p style="margin:0 0 9px">3. 浓盐水零排放的经济性仍需优化，单位处理成本指标缺少行业公开对比基准</p>
<p style="margin:0 0 9px">4. 与国家能源集团技术路线在分盐结晶环节部分重叠，且对方已有工程化案例</p>
<p style="margin:0">5. 领域 申请人由 41 家增至 118 家，近三倍增长，竞争持续加剧</p>
</div>
</div>
<h5>应对技术难题的方案（基于研究内容与研究意义提炼）</h5>
<div class="tw">
<table>
<thead><tr><th>技术难题</th><th>建议书已有应对</th><th>充分性判定</th></tr></thead>
<tbody>
<tr><td>膜污堵与结垢</td><td>研究内容（2）拟通过两级纳滤配置浓水回流缓解结垢；拟研究抑制方法</td><td><span class="b a">部分充分</span> 提出方向但未给出量化目标</td></tr>
<tr><td>采排时序耦合控制</td><td>研究内容（1）建立回采推进与涌水量响应耦合模型</td><td><span class="b g">充分</span> 路径明确</td></tr>
<tr><td>零排放经济性</td><td>研究内容（3）建立经济性优化模型，目标成本 ≤13 元/m³</td><td><span class="b g">充分</span> 有量化目标</td></tr>
<tr><td>分盐路线的差异化定位</td><td>《七、风险分析》未涉及与现有方案的技术路线重叠问题</td><td><span class="b a">建议补充</span> 补充与现有方案的差异化设计说明或工程适配价值主张</td></tr>
</tbody>
</table>
</div>
<div class="ch" id="c6">
  <div class="cn">第六章</div>
  <h2>项目评级</h2>
  <p class="lead">十项二级量化指标 · 等级映射与置信度 · 评分汇总 · 建议补充完善的事项</p>
</div>

<h3 id="s6-2">6.1　二级量化指标计分</h3>
<p>评分为数据驱动的量化参考，供专家评审时对照使用。计分方式分三步，全程可回溯：</p>
<div class="box i">
<h5>得分是怎么来的</h5>
<p style="margin:0 0 7px"><strong>第一步　取实测值。</strong>每项指标从对应章节取一个客观可核的数值或判定结果，来源已在下表「二级指标」列标注（如 S4 取自 3.1—3.3 的相似度比对，S7 取自 4.3 的政策支持清单）。这一步不含主观判断。</p>
<p style="margin:0 0 7px"><strong>第二步　实测值落档。</strong>按下表「档位判定规则」列的四档阈值，将实测值映射为 100／80／60／30 四个档位之一。规则中加粗的一档即本项目所落档位。四档制而非连续打分，是为了避免在数据精度不足的情况下制造虚假的分辨力。</p>
<p style="margin:0"><strong>第三步　加权求和。</strong>单项得分 ＝ 权重 × 档位，十项相加得总分。技术领域态势内部权重调整为 S1 7%、S2 6%、S2a 7%，该一级维度总权重仍为 20%，其他维度权重不变。本项目 <strong>5.6＋4.8＋5.6＋9.0＋4.2＋4.8＋6.4＋20.0＋8.0＋5.6 ＝ 74.0</strong>。</p>
</div>
<div class="tw">
<table>
<caption>十项二级量化指标计分表</caption>
<thead><tr><th>一级维度</th><th>二级指标</th><th class="n">权重</th><th>本项实测值</th><th>档位判定规则</th><th class="n">档位</th><th class="n">得分<br><span class="small">权重×档位</span></th></tr></thead>
<tbody>
<tr><td rowspan="3">技术领域态势</td><td>S1 技术热度趋势<br><span class="small">数据来源 2.2、2.3</span></td><td class="n">7%</td><td>专利年均增速 <strong>20.3%</strong>；论文年均增速 <strong>12.8%</strong>；申请人与单位逐年增加。论文增速未达到快速发展期 15% 门槛。</td><td>100＝专利与论文年均增速均 ≥15%，且申请人与单位逐年增加<br><strong>80</strong>＝三项条件满足两项<br>60＝仅满足一项<br>30＝均不满足</td><td class="n">80</td><td class="n">5.6<br><span class="small">7%×80</span></td></tr>
<tr><td>S2 技术阶段定位<br><span class="small">数据来源 2.4 四象限</span></td><td class="n">6%</td><td>落入<strong>「论文多·专利多」</strong>象限<br>专利 1,247 件、论文 863 篇，两项均高于前五年均值</td><td>100＝论文多·专利少（研究期，空间大）<br><strong>80</strong>＝论文多·专利多（热点，竞争激烈）<br>60＝论文少·专利多（工程化主导）<br>30＝论文少·专利少（须人工研判）</td><td class="n">80</td><td class="n">4.8<br><span class="small">6%×80</span></td></tr>
<tr><td>S2a 预期技术成熟度<br><span class="small">数据来源 建议书预期成果＋专家判断</span></td><td class="n">7%</td><td>以项目预期成果全部完成后的成熟度为评价时点；建议书包含工艺、示范工程等成果，暂按<strong>较高成熟度</strong>预评分，最终档位由专家对各技术分支人工确认。</td><td>100＝专家确认成熟度高，可在实际运行环境形成定型应用<br><strong>80</strong>＝成熟度较高，可完成示范或相关环境验证<br>60＝成熟度中等，仅完成样机／中试验证<br>30＝成熟度较低，主要为原理或实验室验证<br><span class="small">专家未确认时仅作预评分并显著标注</span></td><td class="n">80<br><span class="small">待确认</span></td><td class="n">5.6<br><span class="small">7%×80，暂计</span></td></tr>
<tr><td>竞争格局</td><td>S3 竞争密集度<br><span class="small">数据来源 2.2</span></td><td class="n">15%</td><td>申请人由 41 家增至 <strong>118 家</strong>（2.88 倍）<br>前五名合计份额 <strong>34.9%</strong>（311／892）</td><td>100＝申请人少且增长平缓（格局宽松）<br>80＝申请人温和增长<br><strong>60</strong>＝申请人激增（＞2 倍）且份额分散，竞争激烈<br>30＝申请人激增且头部高度集中</td><td class="n">60</td><td class="n">9.0<br><span class="small">15%×60</span></td></tr>
<tr><td rowspan="3">创新性</td><td>S4 技术方案新颖性<br><span class="small">数据来源 3.1—3.3</span></td><td class="n">14%</td><td>各创新点与专利的最高相似度：<br>创新点一 <strong>71%</strong>（对应 80 档）<br>创新点二 <strong>87%</strong>（对应 30 档）<br>创新点三 <strong>54%</strong>（对应 100 档）<br><span class="small">取最低档位 → 30</span></td><td>100＝最高相似度 &lt;60%，未见同类方案<br>80＝60%—75%，路线不同<br>60＝75%—85%，较相似须说明差异<br><strong>30</strong>＝≥85%，存在高度相似方案<br><span class="small">多创新点时取最低档位计分</span></td><td class="n">30</td><td class="n">4.2<br><span class="small">14%×30</span></td></tr>
<tr><td>S5 创新点可量化程度<br><span class="small">数据来源 建议书 D4 与 E1 对应校验</span></td><td class="n">8%</td><td>创新点总数 <strong>3</strong> 个<br>已配可量化指标 <strong>2</strong> 个（创新点二：结晶盐纯度 ≥98.5%；创新点三：成本 ≤13 元/m³）<br>无指标 <strong>1</strong> 个（创新点一）<br><span class="small">缺口 1／3，未过半</span></td><td>100＝全部创新点有一一对应的可量化指标<br>80＝全部有指标但个别对应关系须推断<br><strong>60</strong>＝部分无对应指标，缺口不超过半数<br>30＝半数以上无指标，或仅有整体性指标</td><td class="n">60</td><td class="n">4.8<br><span class="small">8%×60</span></td></tr>
<tr><td>S6 指标先进性<br><span class="small">数据来源 1、3.2</span></td><td class="n">8%</td><td>回用率 ≥88% vs 现有最优 85%　<span class="b g">优于</span><br>结晶盐纯度 ≥98.5% vs 98.2%　<span class="b a">持平</span><br>成本 ≤13 元/m³ vs 无同口径基准　<span class="b n">无法比对</span><br><span class="small">3 项中 1 项优于、1 项持平、1 项无基准</span></td><td>100＝全部指标优于对比方案披露值<br><strong>80</strong>＝部分优于、部分持平，无劣于项<br>60＝以持平为主<br>30＝存在劣于对比方案或劣于标准限值的指标</td><td class="n">80</td><td class="n">6.4<br><span class="small">8%×80</span></td></tr>
<tr><td>政策</td><td>S7 政策匹配分析<br><span class="small">数据来源 4.3</span></td><td class="n">20%</td><td>强支持政策 2 条，均为直接对应：<br>国家专项 1 条 × 层级权重 <strong>1.0</strong><br>集团制度 1 条 × 层级权重 <strong>0.8</strong><br><span class="small">加权支持度 1.8，覆盖全部三项研究内容</span></td><td><strong>100</strong>＝存在国家级层级的直接对应强支持<br>80＝仅行业或地方层级强支持，或强支持为上位领域对应<br>60＝仅一般支持<br>30＝仅弱相关，无可挂接的具体研究内容</td><td class="n">100</td><td class="n">20.0<br><span class="small">20%×100</span></td></tr>
<tr><td rowspan="2">承接能力</td><td>S8 申报单位研究基础<br><span class="small">数据来源 2.4、3.4（专利库＋知识库）</span></td><td class="n">8%</td><td>自有专利 <strong>57 件</strong>、论文 <strong>34 篇</strong><br>近五年连续无断档<br>与建议书《五、研究基础》自述<strong>一致</strong><br>知识库比对：最高相似度 <strong>46%</strong>，未发现历史立项重复</td><td><strong>100</strong>＝有连续积累、与自述一致、知识库无高相似历史立项<br>80＝有积累但个别年度断档，或知识库有 60—80% 相似课题须说明继承关系<br>60＝积累较少或与自述有出入<br>30＝未检索到相关积累、自述明显不符，或知识库发现疑似重复立项</td><td class="n">100</td><td class="n">8.0<br><span class="small">8%×100</span></td></tr>
<tr><td>S9 成果可交付性<br><span class="small">数据来源 建议书 E1 规则校验</span></td><td class="n">7%</td><td>成果类型齐备（专利 6、论文 4、工艺 3、示范 1、报告 1）　<span class="b g">符合</span><br>完成时指标全部可量化　<span class="b g">符合</span><br>附考核方式　<span class="b a">部分</span>（示范工程有，其余无）<br>成本指标缺测算依据　<span class="b a">不符</span></td><td>100＝四项校验全部通过<br><strong>80</strong>＝通过三项，一至两项存在可补齐的资料缺口<br>60＝两项不通过<br>30＝指标不可量化或成果类型不齐备</td><td class="n">80</td><td class="n">5.6<br><span class="small">7%×80</span></td></tr>
<tr class="sum"><td colspan="2">合计</td><td class="n">100%</td><td colspan="2">十项得分逐项相加：5.6＋4.8＋5.6＋9.0＋4.2＋4.8＋6.4＋20.0＋8.0＋5.6；其中 S2a 为待专家确认的暂评分</td><td class="n">—</td><td class="n">74.0</td></tr>
</tbody>
</table>
</div>
<div class="fig">
<div class="ft">图 6-1　五个一级维度得分与满分对照</div>
<div class="fs">灰色为满分，彩色为实得分</div>
<div class="bars">
<div class="bar"><div class="bn">技术领域态势</div><div class="bt" style="position:relative"><div class="bf" style="width:80%;background:var(--c2)"></div></div><div class="bv">16.0／20</div></div>
<div class="bar"><div class="bn">竞争格局</div><div class="bt"><div class="bf" style="width:60%;background:var(--c3)"></div></div><div class="bv">9.0／15</div></div>
<div class="bar"><div class="bn">创新性</div><div class="bt"><div class="bf" style="width:51.3%;background:var(--red)"></div></div><div class="bv">15.4／30</div></div>
<div class="bar"><div class="bn">政策契合度</div><div class="bt"><div class="bf" style="width:100%;background:var(--c1)"></div></div><div class="bv">20.0／20</div></div>
<div class="bar"><div class="bn">承接能力</div><div class="bt"><div class="bf" style="width:90.7%;background:var(--accent)"></div></div><div class="bv">13.6／15</div></div>
</div>
<div class="fn">各维度得分由所属二级指标得分相加：技术领域态势＝S1 5.6＋S2 4.8＋S2a 5.6（暂计）＝16.0；竞争格局＝S3 9.0；创新性＝S4 4.2＋S5 4.8＋S6 6.4；政策＝S7 20.0；承接能力＝S8 8.0＋S9 5.6。S2a 以预期成果完成后为评价时点，最终分值须经专家对各分支成熟度确认后更新。创新性维度得分率 51.3%，为五个维度最低。</div>
</div>
<h3 id="s6-3">6.2　等级映射与置信度</h3>
<div class="tw">
<table>
<caption>等级为量化评分的区间映射，仅表示数据层面的完备程度，不含立项结论</caption>
<thead><tr><th>等级</th><th>分数线</th><th>数据层面含义</th><th>本项目</th></tr></thead>
<tbody>
<tr><td>A</td><td class="n">≥85 分</td><td>各维度数据依据充分，未见明显缺口</td><td></td></tr>
<tr><td>B</td><td class="n">70—84 分</td><td>整体数据依据较充分，个别维度存在可补强项</td><td><span class="b g">本项目（暂定加权总分 74.0，成熟度待专家确认）</span></td></tr>
<tr><td>C</td><td class="n">55—69 分</td><td>多个维度存在数据缺口，建议补充材料后重新比对</td><td></td></tr>
<tr><td>D</td><td class="n">&lt;55 分</td><td>数据依据不足，难以支撑量化评价</td><td></td></tr>
</tbody>
</table>
</div>
<h3 id="s6-4">6.3　评分汇总</h3>
<div class="verdict" style="margin-bottom:16px">
  <div class="grade">
    <div class="g" style="color:var(--green)">B</div>
    <div class="gl">量化评分等级</div>
    <div class="sc">74.0<span> ／100</span></div>
    <div class="note" style="color:var(--ink3)">数据依据较充分</div>
  </div>
  <div style="align-self:center">
    <p>本项目<em class="hlg">政策契合度高、研究基础扎实、技术领域处于活跃增长期</em>，暂定加权总分 74.0 分，落在 B 级区间（70—84）。其中技术成熟度按预期成果完成后“较高”档暂计，须经专家对各分支确认后形成最终总分。三个创新点中创新点一（最高相似度 71%）、创新点三（54%）新颖性较充分，与集团自有 57 件专利的最高相似度仅 52%，未发现与集团内既有成果重复。</p>
    <p>须提请专家关注的一项：创新点二「高含盐矿井水纳滤分盐工艺」与 CN112794520B 在分离原理、工艺配置、浓水处理、后段衔接四个维度一致，相似度 87%，S4 一项因此落入最低档。该项是本次评分的主要扣分来源。</p>
    <p style="margin:0">建议将<em class="hl">创新点二的技术方案差异化说明</em>作为需申报方补充的重点事项，补充后可重新比对并更新该项评分。</p>
  </div>
</div>
<div class="two" style="margin-bottom:16px">
<div class="card" style="margin:0">
<h5 style="margin-top:0;color:var(--green)">数据层面的有利条件</h5>
<p style="margin:0 0 7px">获国家专项政策与集团年度攻关指南直接对应支持，三项研究内容全覆盖</p>
<p style="margin:0 0 7px">技术领域处于活跃增长期但未达到快速发展期全部门槛；政策发布量年均增长 34.2%、专利 20.3%，论文 12.8% 未达到 15% 判定线</p>
<p style="margin:0 0 7px">申报单位近五年连续积累 57 件专利、34 篇论文，与建议书自述一致</p>
<p style="margin:0 0 7px">创新点一、创新点三未检索到同类方案，最高相似度 71%、54%</p>
<p style="margin:0">与集团自有专利最高相似度 52%，未发现重复立项</p>
</div>
<div class="card" style="margin:0">
<h5 style="margin-top:0;color:var(--amber)">建议补充完善的事项</h5>
<p style="margin:0 0 7px">创新点二与 CN112794520B 相似度 87%、CN113087246A 76%，建议补充技术方案差异说明</p>
<p style="margin:0 0 7px">创新点一建议补充量化性能指标（能耗降幅、匹配精度）</p>
<p style="margin:0 0 7px">单位处理成本 ≤13 元/m³ 建议补充测算口径与成本分项构成</p>
<p style="margin:0">纳滤分盐方向自有积累 4 件专利、3 篇论文，建议明确外部合作或技术引进路径</p>
</div>
</div>

<h3 id="s6-5">6.4　建议补充完善的事项汇总</h3>
<p>下表汇总本报告各章提出的补充建议，按对评分的影响程度排序，供专家评审时作为反馈依据。</p>
<div class="tw">
<table>
<thead><tr><th>序号</th><th>补充事项</th><th>对应章节</th><th>影响的评分项</th><th>补充后的预期效果</th></tr></thead>
<tbody>
<tr><td class="n">1</td><td>创新点二的技术方案差异化说明：说明与 CN112794520B 在技术手段层面的实质差异，或调整为工程集成层面的改进定位</td><td>3.2</td><td>S4 技术方案新颖性（14%）</td><td>若差异成立，S4 档位可由 30 上调，总分具备上升空间</td></tr>
<tr><td class="n">2</td><td>创新点一的量化性能指标：补充协同调控后的排水能耗降幅、涌水量匹配精度等可考核指标</td><td>3.1</td><td>S5 创新点可量化程度（8%）</td><td>三个创新点全部可量化，S5 可由 60 上调至 80 以上</td></tr>
<tr><td class="n">3</td><td>单位处理成本的测算依据：明确 18.6 与 13 元/m³ 两个数值的成本口径、分项构成与是否含折旧人工</td><td>1、3.3</td><td>S6 指标先进性（8%）、S9 成果可交付性（7%）</td><td>成本项获得可比基准，两项均有上调空间</td></tr>
<tr><td class="n">4</td><td>集团内成果继承关系：写明创新点一对 CN116105073A 疏干水量预测能力的复用关系</td><td>3.4</td><td>S8 申报单位研究基础（8%）</td><td>体现集团内成果接续利用，缩短研发周期</td></tr>
<tr><td class="n">5</td><td>院内历史课题查重：以院立项台账核验与在研及已结题课题的重复性</td><td>3.4</td><td>不参与计分</td><td>补齐专利库无法覆盖的查重维度</td></tr>
</tbody>
</table>
</div>
<div class="card" style="margin-top:32px">
<p class="small" style="margin:0">本报告基于公开可检索的专利、论文与政策数据，结合《立项建议书》文本自动生成。检索截止 2026 年 6 月 30 日，覆盖专利 1,247 件、论文 863 篇、政策文件 47 件。专利数据来源为智慧芽全球专利库，论文数据来源为万方本地镜像库并经中英文双语检索式召回，政策数据来源与分类口径见 4.1 节。</p>
<p class="small" style="margin:9px 0 0">受数据库收录范围、专利公开滞后与政策库覆盖边界影响，<strong>检索未命中不等于相关技术或政策不存在</strong>。技术分支聚类标签由专利与论文合集统一生成，申请人与作者机构已按同一套集团口径归并。评分分数线与权重为初始建议值，待历史建议书回标校准后确定。<strong>本报告为评审辅助材料，提供数据依据与量化参考，不含立项与否的结论性意见</strong>，立项判定由评审专家与决策机构作出。建议专家结合专业判断，重点关注 6.4 节的补充事项汇总。</p>
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
      "label": "4.3 政策匹配度分析"
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
  documentHtml: reviewDocumentHtml,
}

export const innovationReports = {
  research: innovationResearchReport,
  review: innovationReviewReport,
}

