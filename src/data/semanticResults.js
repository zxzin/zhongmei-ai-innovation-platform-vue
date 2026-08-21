import cn113047909aPreview from '../assets/patent-previews/cn113047909a.png'
import cn113047909bPreview from '../assets/patent-previews/cn113047909b.png'
import cn109976345aPreview from '../assets/patent-previews/cn109976345a.png'
import cn117301089aPreview from '../assets/patent-previews/cn117301089a.png'
import cn117301089bPreview from '../assets/patent-previews/cn117301089b.png'

const seedResults = [
  { id: 'p1', type: 'patent', similarity: '98%', number: 'CN115383750A', title: '一种煤矿井下巡检机器人及其控制方法', status: '审中', applicant: '安徽玄离智能科技股份有限公司', area: '煤矿自动化 · 智能巡检', filing: '2022-08-22', publication: '2022-11-25', summary: '围绕矿井现场巡检任务，集成移动底盘、环境感知、设备状态识别与任务控制策略。' },
  { id: 'p2', type: 'patent', similarity: '96%', number: 'CN118377301A', title: '一种基于多传感融合的井下智能巡检机器人', status: '审中', applicant: '中国矿业大学', area: '巡检机器人 · 融合感知', filing: '2024-04-09', publication: '2024-07-23', summary: '通过视觉、激光和惯导协同感知，提高复杂巷道环境中的识别和定位稳定性。' },
  { id: 'p3', type: 'patent', similarity: '95%', number: 'CN119871479A', title: '一种煤矿巷道巡检机器人自主导航系统', status: '审中', applicant: '中煤科工集团重庆研究院有限公司', area: '煤矿巷道 · 自主导航', filing: '2024-12-12', publication: '2025-04-29', summary: '建立环境地图、路径规划与异常工况降级策略，支持井下连续自主巡检。' },
  { id: 'p4', type: 'patent', similarity: '93%', number: 'CN116278025A', title: '一种矿用轮式巡检机器人及巡检方法', status: '有效', applicant: '南京双京电博特种机器人产业研究院有限公司', area: '矿用装备 · 轮式巡检', filing: '2023-02-16', publication: '2023-06-23', summary: '面向矿用复杂路面配置轮式移动、巡检任务调度和设备状态采集能力。' },
  { id: 'p5', type: 'patent', similarity: '92%', number: 'CN109882244A', title: '一种煤矿井下机器人巡检系统', status: '有效', applicant: '北京天玛智控科技股份有限公司', area: '煤矿井下 · 安全巡检', filing: '2019-03-29', publication: '2019-06-14', summary: '用于井下设备状态、环境参数和安全风险的移动巡检与数据回传。' },
  { id: 'p6', type: 'patent', similarity: '91%', number: 'CN223864999U', title: '一种煤矿井下智能巡检机器人', status: '有效', applicant: '中煤科工机器人科技有限公司', area: '煤矿智能化 · 移动装备', filing: '2025-05-12', publication: '2026-01-13', summary: '提供适配煤矿现场的机体结构、传感组件和巡检控制单元。' },
  { id: 'l1', type: 'paper', similarity: '89.6%', number: '《工矿自动化》2024', title: '煤矿井下巡检机器人关键技术与应用进展', status: '已发表', applicant: '中国矿业大学', area: '煤矿自动化 · 智能巡检', filing: '2023-07-10', publication: '2024-01-15', summary: '梳理移动巡检、多源感知、自主导航与井下适配的工程技术路径。' },
  { id: 'l2', type: 'paper', similarity: '87.9%', number: '《煤炭学报》2023', title: '面向煤矿智能巡检的移动机器人环境感知技术', status: '已发表', applicant: '太原理工大学', area: '环境感知 · 安全运行', filing: '2023-03-01', publication: '2023-10-20', summary: '讨论井下巡检机器人的环境识别、任务控制和安全运行约束。' },
  { id: 'p7', type: 'patent', similarity: '90%', number: 'CN119172626A', title: '一种煤矿井下轨道巡检机器人系统', status: '审中', applicant: '北京煤科天玛自动化科技有限公司', area: '轨道运输 · 自动巡检', filing: '2024-09-09', publication: '2025-01-07', summary: '采用轨道移动平台对井下设备、环境参数和异常事件进行连续巡检。' },
  { id: 'p8', type: 'patent', similarity: '89%', number: 'CN217144004U', title: '一种适用于煤矿井下的巡检机器人', status: '有效', applicant: '中煤科工集团沈阳研究院有限公司', area: '矿用装备 · 安全巡检', filing: '2021-11-19', publication: '2022-08-05', summary: '提供适配井下狭窄空间的移动结构与现场环境采集组件。' },
  { id: 'p9', type: 'patent', similarity: '88%', number: 'CN111049244A', title: '一种煤矿井下智能巡检装置及方法', status: '有效', applicant: '安标国家矿用产品安全标志中心有限公司', area: '矿山安全 · 自动巡检', filing: '2019-12-24', publication: '2020-04-21', summary: '实现设备状态、作业环境与安全风险的自动采集、识别和上报。' },
  { id: 'p10', type: 'patent', similarity: '87%', number: 'CN114760713A', title: '一种煤矿井下移动巡检机器人及其控制方法', status: '有效', applicant: '中国矿业大学', area: '矿井巷道 · 移动控制', filing: '2022-04-01', publication: '2022-07-15', summary: '通过路径规划与姿态控制实现巷道环境下的稳定巡检。' },
]

const patentReferenceResults = [
  { id: 'p1', type: 'patent', similarity: '86%', number: 'CN113047909A', title: '一种井下巷道与硐室全方位巡检轮式机器人及其控制方法', status: '授权', applicant: '中国矿业大学', areaTags: ['采矿装置', '机械手'], filing: '2021-05-05', publication: '2021-06-29', summary: '适用于煤矿井下巷道与硐室环境的全方位巡检轮式机器人及其控制方法。', preview: { image: cn113047909aPreview, abstract: '本发明公开了一种井下巷道与硐室全方位巡检轮式机器人及其控制方法，包括巡检感知系统、外部环境监测系统、行走越障系统和控制系统；巡检感知系统选用激光雷达、深度相机、红外热像传感器等传感器，利用激光雷达、深度相机、红外热像传感器等多传感器融合实现更加可靠的巡检；外部环境监测系统包括烟雾传感器、声音传感器、瓦斯传感器等传感器，保证机器人巡检期间的安全性；控制系统包括主控制箱，上、下位机与电源，毫米波雷达用于机器人行驶避障；采用差动平衡杆为主的行走越障机构，采用六轮结构，确保机器人在巷道与硐室之间实现变空间越障，更加稳固可靠。本发明可以应用于井下巷道硐室等复杂环境下，实现对巷道硐室问题的超前预判预警。' } },
  { id: 'p2', type: 'patent', similarity: '86%', number: 'CN113047909B', title: '一种井下巷道与硐室全方位巡检轮式机器人及其控制方法', status: '授权', applicant: '中国矿业大学', areaTags: ['采矿装置', '机械手'], filing: '2021-05-05', publication: '2021-12-17', summary: '适用于煤矿井下巷道与硐室环境的全方位巡检轮式机器人及其控制方法。', preview: { image: cn113047909bPreview, abstract: '本发明公开了一种井下巷道与硐室全方位巡检轮式机器人及其控制方法，包括巡检感知系统、外部环境监测系统、行走越障系统和控制系统；巡检感知系统选用激光雷达、深度相机、红外热像传感器等传感器，利用激光雷达、深度相机、红外热像传感器等多传感器融合实现更加可靠的巡检；外部环境监测系统包括烟雾传感器、声音传感器、瓦斯传感器等传感器，保证机器人巡检期间的安全性；控制系统包括主控制箱，上、下位机与电源，毫米波雷达用于机器人行驶避障；采用差动平衡杆为主的行走越障机构，采用六轮结构，确保机器人在巷道与硐室之间实现变空间越障，更加稳固可靠。本发明可以应用于井下巷道硐室等复杂环境下，实现对巷道硐室问题的超前预判预警。' } },
  { id: 'p3', type: 'patent', similarity: '84%', number: 'CN109976345A', title: '一种巡检机器人在井下复杂环境的自主导航定位', status: '驳回', applicant: '安徽玄离智能科技股份有限公司', areaTags: ['采矿装置', '二维的位置/航道控制'], filing: '2019-04-02', publication: '2019-07-05', summary: '面向井下复杂环境的巡检机器人自主导航与定位方法。', preview: { image: cn109976345aPreview, abstract: '本发明公开了一种巡检机器人在井下复杂环境的自主导航定位，包括矿道、定位节点、双光纤环网、光纤环网交换器、地面控制站和巡检机器人，矿道内布置用于无线定位的定位节点和双光纤环网，矿道内布置有指示牌，巡检机器人上安装有GPS模块、射频定位模块和无线通讯模块，巡检机器人上还安装有摄像头、矿灯、激光雷达和RFID读卡器，摄像头、矿灯、激光雷达和RFID读卡器均与巡检机器人的中央处理器连接；本发明一种巡检机器人在井下复杂环境的自主导航定位，该种巡检机器人在井下复杂环境的自主导航定位，通过采用紫外线传感器判断巡检机器人所处环境，并融合了GPS定位技术和惯导技术，实现深部开采井上下实时灵活定位导航，适用于井下复杂环境。' } },
  { id: 'p4', type: 'patent', similarity: '84%', number: 'CN117301089A', title: '一种综掘工作面多功能巡检机器人装置及使用方法', status: '授权', applicant: '安徽理工大学', areaTags: ['采矿装置', '机械手'], filing: '2023-11-02', publication: '2023-12-29', summary: '面向综掘工作面的多功能巡检机器人装置及使用方法。', preview: { image: cn117301089aPreview, abstract: '本发明涉及煤矿巡检技术领域，具体的公开了一种综掘工作面多功能巡检机器人装置及使用方法，包括机器人本体机架，机器人本体机架上安装有用于障碍物清理的伺服机械手抓取系统，机器人本体机架上安装有用于感知信息的混合机械臂及其末端局部感知子系统以及机器人本体及其全局感知子系统，机器人本体机架底部安装有用于行走的行走系统，机器人本体机架底部还安装用于保护电池的防爆电池系统。本发明能够实现在综掘工作面复杂环境下的行走、障碍物清理以及综掘装备智能巡检作业。' } },
  { id: 'p5', type: 'patent', similarity: '84%', number: 'CN117301089B', title: '一种综掘工作面多功能巡检机器人装置及使用方法', status: '授权', applicant: '安徽理工大学', areaTags: ['采矿装置', '机械手'], filing: '2023-11-02', publication: '2025-12-19', summary: '面向综掘工作面的多功能巡检机器人装置及使用方法。', preview: { image: cn117301089bPreview, abstract: '本发明涉及煤矿巡检技术领域，具体的公开了一种综掘工作面多功能巡检机器人装置及使用方法，包括机器人本体机架，机器人本体机架上安装有用于障碍物清理的伺服机械手抓取系统，机器人本体机架上安装有用于感知信息的混合机械臂及其末端局部感知子系统以及机器人本体及其全局感知子系统，机器人本体机架底部安装有用于行走的行走系统，机器人本体机架底部还安装用于保护电池的防爆电池系统。本发明能够实现在综掘工作面复杂环境下的行走、障碍物清理以及综掘装备智能巡检作业。' } },
  { id: 'p6', type: 'patent', similarity: '83%', number: 'CN113858221A', title: '一种煤矿井下巡检作业机器人', status: '驳回', applicant: '山东省科学院自动化研究所', areaTags: ['分析气体混合物', '机械手', '电磁波的再辐射'], filing: '2021-09-15', publication: '2021-12-31', summary: '用于煤矿井下巡检作业的机器人系统。' },
  { id: 'p7', type: 'patent', similarity: '83%', number: 'CN113246152A', title: '一种矿用井下变电所智能巡检机器人', status: '驳回|权利转移', applicant: '中煤科工集团沈阳研究院有限公司\n中煤科工机器人科技有限公司', areaTags: ['程序控制机械手'], filing: '2021-05-31', publication: '2021-08-13', summary: '用于矿用井下变电所的智能巡检机器人。' },
  { id: 'p8', type: 'patent', similarity: '83%', number: 'CN120382513A', title: '基于多模态感知与智能识别的矿难救援机器人', status: '实质审查', applicant: '中国地质大学(武汉)', areaTags: ['通过速度/加速度测量进行导航', '生物学模型', '字符和模式识别', '+4'], filing: '2025-04-18', publication: '2025-07-29', summary: '基于多模态感知与智能识别的矿难救援机器人。' },
  { id: 'p9', type: 'patent', similarity: '83%', number: 'CN113858232A', title: '一种防爆智能巡检机器人', status: '撤回-视为撤回|一案双申', applicant: '中创新海(天津)认证服务有限公司\n中海油天津化工研究设计院有限公司', areaTags: ['机械手'], filing: '2021-10-29', publication: '2021-12-31', summary: '适用于防爆场景的智能巡检机器人。' },
  { id: 'p10', type: 'patent', similarity: '82%', number: 'CN113829363A', title: '一种5G基站数据中心智能巡检机器人及巡检方法', status: '驳回', applicant: '武汉工程大学', areaTags: ['闭路电视系统', '机械手', '二维的位置/航道控制'], filing: '2021-09-16', publication: '2021-12-24', summary: '面向5G基站数据中心的智能巡检机器人及巡检方法。' },
  { id: 'p11', type: 'patent', similarity: '82%', number: 'CN111624641A', title: '一种防爆型油库区智能巡检机器人', status: '驳回', applicant: '上海东古智能科技有限公司', areaTags: ['通过速度/加速度测量进行导航', '卫星无线电信标定位系统'], filing: '2020-04-21', publication: '2020-09-04', summary: '适用于油库区防爆场景的智能巡检机器人。' },
  { id: 'p12', type: 'patent', similarity: '81%', number: 'CN114035562A', title: '一种用于爆炸性环境的多信息融合采集机器人', status: '未缴年费|权利转移', applicant: '新兴际华集团有限公司\n新兴际华科技集团有限公司\n浙江国研科技股份有限公司', areaTags: ['履带车辆', '二维的位置/航道控制'], filing: '2021-07-20', publication: '2022-02-11', summary: '用于爆炸性环境的多信息融合采集机器人。' },
  { id: 'p13', type: 'patent', similarity: '81%', number: 'CN109866235A', title: '一种适用于煤矿井下的巡检机器人', status: '驳回', applicant: '安徽玄离智能科技股份有限公司', areaTags: ['机械手', '分析材料', '声波的再辐射'], filing: '2019-04-02', publication: '2019-06-11', summary: '适用于煤矿井下环境的巡检机器人。' },
  { id: 'p14', type: 'patent', similarity: '81%', number: 'CN119704137A', title: '一种变电站巡检机器人及其智能巡检系统', status: '实质审查', applicant: '太原理工大学', areaTags: ['机械手'], filing: '2025-01-17', publication: '2025-03-28', summary: '用于变电站场景的巡检机器人及智能巡检系统。' },
  { id: 'p15', type: 'patent', similarity: '81%', number: 'CN114952886A', title: '一种附带机械臂的矿用防爆巡检机器人', status: '实质审查', applicant: '中煤科工集团沈阳研究院有限公司\n中煤科工机器人科技有限公司', areaTags: ['程序控制机械手'], filing: '2022-05-30', publication: '2022-08-30', summary: '附带机械臂的矿用防爆巡检机器人。' },
  { id: 'p16', type: 'patent', similarity: '81%', number: 'CN117532634A', title: '一种加氢站智能巡检机器人系统', status: '实质审查', applicant: '上海舜华新能源系统有限公司', areaTags: ['机械手'], filing: '2023-12-28', publication: '2024-02-09', summary: '用于加氢站场景的智能巡检机器人系统。' },
  { id: 'p17', type: 'patent', similarity: '81%', number: 'CN111813130A', title: '一种输变电站智能巡检机器人自主导航避障系统', status: '驳回|一案双申', applicant: '江南大学', areaTags: ['程序控制机械手', '测量装置', '二维的位置/航道控制'], filing: '2020-08-19', publication: '2020-10-23', summary: '用于输变电站智能巡检机器人的自主导航避障系统。' },
  { id: 'p18', type: 'patent', similarity: '81%', number: 'CN117001689A', title: '一种特殊危化场景防爆轮式巡检机器人及其巡检控制方法', status: '驳回|权利转移', applicant: '隆讯(徐州)智能科技有限公司', areaTags: ['机械手'], filing: '2023-09-06', publication: '2023-11-07', summary: '用于特殊危化场景的防爆轮式巡检机器人及其巡检控制方法。' },
  { id: 'p19', type: 'patent', similarity: '81%', number: 'CN118322162A', title: '一种防爆智能巡检机器人', status: '实质审查', applicant: '国家能源集团煤焦化有限责任公司西来峰分公司', areaTags: ['机械手'], filing: '2024-04-24', publication: '2024-07-12', summary: '用于防爆场景的智能巡检机器人。' },
  { id: 'p20', type: 'patent', similarity: '81%', number: 'CN114670170A', title: '一种煤矿灾后救援机器人及其定位和通讯方法', status: '撤回-主动撤回', applicant: '淮北矿业股份有限公司', areaTags: ['程序控制机械手'], filing: '2022-03-11', publication: '2022-06-28', summary: '用于煤矿灾后救援的机器人及其定位和通讯方法。' },
]

const patentDetailContent = {
  p1: {
    patentTitle: '通过多传感器融合和六轮悬挂摇臂机构，实现井下巷道和硐室的全方位巡检，解决了现有技术中巡检精度差和难以自主导航的问题，提高了井下设备的安全稳定性。',
    aiSummary: [
      { title: '技术问题', content: '现有井下巡检机器人难以实现对巷道和硐室的全方位巡检，传统单传感器定位易受信号遮挡影响，且传统人工巡检精度差、劳动强度大，无法满足井下复杂环境的需求。' },
      { title: '技术手段', content: '设计了一种井下巷道与硐室全方位巡检轮式机器人，采用多传感器融合技术，包括巡检感知系统、外部环境监测系统和行走越障系统，利用毫米波雷达、深度相机、激光雷达、红外热像传感器、烟雾传感器等，结合六轮悬挂摇臂机构和差动平衡杆，实现自主导航和越障能力。' },
      { title: '技术功效', content: '实现了对井下巷道和硐室的全方位巡检，提高了巡检精度和范围，能够在复杂环境中自主导航，确保安全性和稳定性，替代传统人工巡检，提高了井下设备的安全稳定运行。' },
    ],
  },
  p2: {
    patentTitle: '通过多传感器融合和六轮悬挂摇臂机构，实现井下巷道和硐室的全方位巡检，解决了现有技术中巡检精度差和劳动强度大的问题，提供了更高效的井下巡检解决方案。',
    aiSummary: [
      { title: '技术问题', content: '现有井下巡检机器人难以实现对巷道和硐室的全方位巡检，传统单传感器定位易受信号遮挡影响，且传统人工巡检精度差、劳动强度大，无法满足井下复杂环境的需求。' },
      { title: '技术手段', content: '设计了一种井下巷道与硐室全方位巡检轮式机器人，采用多传感器融合技术，包括巡检感知系统、外部环境监测系统和行走越障系统，利用毫米波雷达、深度相机、激光雷达、红外热像传感器、烟雾传感器等，结合六轮悬挂摇臂机构和差动平衡杆，实现自主导航和越障能力。' },
      { title: '技术功效', content: '实现了对井下巷道和硐室的全方位巡检，提高了巡检精度和范围，能够自主导航，适应复杂地面环境，减少了人工巡检的劳动强度和错误率。' },
    ],
  },
  p3: {
    patentTitle: '通过紫外线传感器和GPS/惯导技术结合，结合指示牌文字识别和次声波发生器，解决了井下导航信号穿透性和地形复杂性问题，实现了井下巡检机器人的自主导航和紧急救援。',
    aiSummary: [
      { title: '技术问题', content: '在井下复杂环境中，现有的导航定位技术无法有效工作，因为全球卫星导航信号无法穿透地表，且地下地形复杂和电磁信号反射导致定位不准确，且依赖网络电源，容易在供电中止或信号中断时失效。' },
      { title: '技术手段', content: '采用紫外线传感器判断环境，结合GPS和惯导技术进行导航定位，并通过指示牌和图片文字识别技术在无线通讯中断时规划路径，使用次声波发生器在紧急情况下传递位置信息。' },
      { title: '技术功效', content: '实现了井下复杂环境中的实时灵活导航，减少了因无线通讯中断导致的损失，并在紧急情况下确保位置信息的传递和救援。' },
    ],
  },
  p4: {
    patentTitle: '通过在煤矿综掘工作面上设计多功能巡检机器人，利用混合机械臂和柔性机械臂的多源信息融合感知系统和伺服机械手，解决了现有技术中信息融合感知能力差和障碍物清理难的问题，实现了对综掘装备的全方位感知和高效巡检。',
    aiSummary: [
      { title: '技术问题', content: '现有巡检机器人在煤矿综掘工作面环境中多源信息融合感知能力差，难以适应复杂场景，且缺乏障碍物清理手段，存在巡检盲区和效率低的问题。' },
      { title: '技术手段', content: '设计了一种综掘工作面多功能巡检机器人装置，采用混合机械臂和柔性机械臂结合的多源信息融合感知系统，配备伺服机械手抓取系统，实现对综掘装备的全方位感知和障碍物清理，通过激光雷达、工业相机和超声波传感器进行三维环境感知和障碍物定位。' },
      { title: '技术功效', content: '实现了在高粉尘、低光照和多障碍物环境下的多源信息融合感知和快速决策控制，形成了“互联互通、精准监测”的感知联动体系，提高了巡检效率和安全性。' },
    ],
  },
  p5: {
    patentTitle: '通过结合混合机械臂、伺服机械手和多源传感器的巡检机器人装置，解决了综掘工作面复杂环境下的多源信息融合感知和障碍物清理问题，实现了全方位的实时巡检和高效的障碍物清理。',
    aiSummary: [
      { title: '技术问题', content: '现有巡检机器人在综掘工作面环境下多源信息融合感知能力差，难以适应复杂作业工况，存在障碍物清理困难和巡检盲区，无法实现全方位感知与监测。' },
      { title: '技术手段', content: '采用混合机械臂及其末端局部感知子系统与机器人本体全局感知子系统，结合伺服机械手抓取系统，实现多源信息融合感知，通过激光雷达、工业相机与超声波传感器进行三维环境建模与障碍物清理，形成全局与局部感知联动，实现闭环作业。' },
      { title: '技术功效', content: '在复杂环境下实现了多装备的全方位实时巡检，能够清理障碍物，提高了巡检效率和精准度，适应综掘工作面的多种障碍物无规律分布。' },
    ],
  },
}

const generatedTitles = [
  '一种煤矿井下智能巡检机器人系统及方法',
  '一种矿用移动巡检机器人的环境感知方法',
  '一种井下巡检机器人的导航与控制装置',
  '一种煤矿设备自主巡检机器人平台',
  '一种适用于井下巷道的智能巡检系统',
  '一种矿用防爆巡检机器人的任务控制方法',
]
const generatedApplicants = ['安徽玄离智能科技股份有限公司', '中国矿业大学', '中煤科工集团重庆研究院有限公司', '南京双京电博特种机器人产业研究院有限公司', '北京天玛智控科技股份有限公司', '中煤科工机器人科技有限公司']
const generatedTypes = ['patent', 'patent', 'patent', 'patent', 'paper', 'paper', 'policy', 'internal']

const paperReferenceResults = [
  { id: 'paper-1', type: 'paper', similarity: '100%', number: '10.1016/j.comnet.2018.10.022', year: '2019', filing: '2019', publication: '2019', title: '基于多传感器融合和活动分类的巷道环境人员定位方法', originalTitle: 'Approach of personnel location in roadway environment based on multi-sensor fusion and activity classification', authors: 'Yazhou Yuan, Xiaoqin Sun, Zhixin Liu, Yuefeng Li, Xinping Guan', journal: 'Computer Networks', citations: '16', source: 'api.elsevier.com', applicant: 'Yanshan University · Shanghai Jiao Tong University', topics: ['Activity recognition', 'Fusion mechanism', 'Real-time computing', 'Robustness'], area: '活动识别 · 多传感器融合 · 实时计算', status: '已发表', summary: '针对地下矿井定位系统的需求，精度和广义能力是评估定位算法性能的关键指标，直接影响安全监控系统的可靠性和感知性能。由于不规则隧道环境尘土飞扬、潮湿且嘈杂，定位无线网络的可靠性和普遍能力是迫切且具有挑战性的问题。本文使用多种传感器收集数据，并设计融合机制提高定位方法鲁棒性。' },
  { id: 'paper-2', type: 'paper', similarity: '99.5%', number: '10.3390/s22207794', year: '2022', filing: '2022', publication: '2022', title: '复杂仓储环境下基于多传感器融合的物流巡检机器人导航系统', originalTitle: 'The Navigation System of a Logistics Inspection Robot Based on Multi-Sensor Fusion in a Complex Storage Environment', authors: 'Zhang, Yang · Zhou, Yanjun · Li, Hehua · Hao, Hao · Chen, Weijiong', journal: 'SENSORS', citations: '12', source: 'www.mdpi.com', applicant: 'Shanghai Polytechnic University · Shanghai Maritime University', topics: ['Robot navigation', 'Multi-sensor fusion', 'Laser radar'], area: '机器人导航 · 多传感器融合 · 激光雷达', status: '已发表', summary: '为可靠实现复杂物流仓储环境下机器人的自主导航和巡航功能，提出基于视觉与多线激光雷达信息融合的新型机器人导航系统；该系统兼顾丰富信息、准确地图边缘与实时定位导航，并通过仿真和实际验证证明了可行性与鲁棒性。' },
  { id: 'paper-3', type: 'paper', similarity: '99%', number: '10.1109/icmt.2011.6003037', year: '2011', filing: '2011', publication: '2011', title: '基于多传感器数据融合的局部环境识别', originalTitle: 'Local environment recognition based on multi-sensor data fusion', authors: 'Xianzhong Chen · Chunlei Ji · Haijun Wang', journal: '2011 International Conference on Multimedia Technology', citations: '-', source: '-', applicant: '-', topics: ['Artificial intelligence', 'Autonomous robot', 'Computer vision', 'Feature extraction'], area: '人工智能 · 自主机器人 · 计算机视觉', status: '已发表', summary: '作为具有视觉和距离信息获取能力的自主机器人，可靠探索未知环境至关重要。本文提出基于数据融合的局部环境识别方法：利用 SIFT 识别目标作为导航地标，并结合对环境噪声和亮度不敏感的激光扫描数据，实验结果证明了算法有效性。' },
  { id: 'paper-4', type: 'paper', similarity: '98.5%', number: '10.3390/s22165989', year: '2022', filing: '2022', publication: '2022', title: '基于异构多传感器融合的无人矿用卡车检测与跟踪方法', originalTitle: 'A Detection and Tracking Method Based on Heterogeneous Multi-Sensor Fusion for Unmanned Mining Trucks', authors: 'Liu, Haitao · Pan, Wenbo · Hu, Yunqing · Li, Cheng · Yuan, Xiwen', journal: 'SENSORS', citations: '27', source: 'www.mdpi.com', applicant: 'CRRC Zhuzhou Institute Co., Ltd.', topics: ['Mining truck', 'Object detection', 'Radar fusion'], area: '矿用卡车 · 目标检测 · 异构融合', status: '已发表', summary: '针对露天矿运输中道路未铺装、粉尘较多及小型不规则障碍物稳定检测难的问题，提出激光雷达与毫米波雷达融合的多目标检测和跟踪方法，并以自适应策略提升粉尘环境下目标检测和跟踪能力。' },
  { id: 'paper-5', type: 'paper', similarity: '98%', number: '—', year: '—', filing: '—', publication: '—', title: '基于图的多传感器融合，用于一致定位自主施工机器人', originalTitle: 'Graph-based Multi-sensor Fusion for Consistent Localization of Autonomous Construction Robots', authors: 'Julian Nubert · Shehryar Khattak · Marco Hutter', journal: 'ArXiv', citations: '-', source: 'arxiv.org', applicant: '-', topics: ['Robot localization', 'State estimation', 'Sensor fusion'], area: '机器人定位 · 状态估计 · 多传感器融合', status: '预印本', summary: '为促进大型建筑机械自主操作，本文提出用于机器人状态估计与定位的多模态传感器融合方法。该方法基于图的预测更新循环，兼顾滤波与平滑优势，支持异步传感器测量，并可在传感器丢失阶段保持一致的姿态估计。' },
  { id: 'paper-6', type: 'paper', similarity: '97.5%', number: '10.1007/978-3-642-32527-4_52', year: '2012', filing: '2012', publication: '2012', title: '基于超声测距数据模糊传感器融合的未知环境地图构建', originalTitle: 'Map Building of Unknown Environment Based on Fuzzy Sensor Fusion of Ultrasonic Ranging Data', authors: 'I-Hsum Lee · Ming Chih Lu · Chen-Chien James Hsu · Shih-Shiun Lin', journal: 'Lecture Notes in Computer Science', citations: '4', source: 'link.springer.com', applicant: "Lee-Ming Institute of Technology · St. John's University · National Taiwan Normal University", topics: ['Fuzzy logic', 'Grid map', 'Computer vision'], area: '模糊逻辑 · 栅格地图 · 计算机视觉', status: '已发表', summary: '研究使用移动机器人超声传感器收集的测距数据，基于模糊传感器融合为未知室内环境构建占用栅格图。该方法应对超声测量的不确定性与多次反射问题，并持续计算、更新栅格信息以支持定位或路径规划。' },
  { id: 'paper-7', type: 'paper', similarity: '97%', number: '10.22260/isarc2014/0112', year: '2014', filing: '2014', publication: '2014', title: '建筑工地环境监测用粉尘传感器的对比实验评价', originalTitle: 'Comparative Experimental Evaluation of Dust Sensors for Environmental Monitoring on Construction Sites', authors: 'Carbonari, A. · Fava, G. · Naticchia, B.', journal: 'Proceedings of the International Symposium on Automation and Robotics in Construction (IAARC)', citations: '2', source: 'doi.org', applicant: '-', topics: ['Dust sensor', 'Environmental monitoring', 'Real-time computing'], area: '粉尘传感器 · 环境监测 · 实时计算', status: '已发表', summary: '本文围绕无线、实时粉尘浓度监测系统，比较两种粉尘传感器在不同粒径和粉尘类型下的性能，并以参考仪器作为基准评价其对突发浓度变化及颗粒分布不均场景的可靠性。' },
  { id: 'paper-8', type: 'paper', similarity: '96.5%', number: '10.1109/geoinformatics.2016.7578972', year: '2016', filing: '2016', publication: '2016', title: '煤矿巷道气流动态特性及粉尘控制的三维仿真', originalTitle: '3D simulation for dynamic characteristics of airflow and dust control in a laneway of coal mine', authors: 'Hui Liu · Shanjun Mao · Mei Li', journal: '2016 24th International Conference on Geoinformatics', citations: '2', source: 'xplorestaging.ieee.org', applicant: '-', topics: ['Airflow', 'Coal mining', 'Dust control', 'Environmental geology'], area: '气流 · 煤矿 · 粉尘控制', status: '已发表', summary: '基于计算流体动力学方法，对煤矿巷道典型结构下气流与粉尘扩散规律进行动态描述；研究结合湍流模型、离散相模型及不同气流速度，分析复杂空气扩散随时间推移产生的粉尘扩散和运动。' },
  { id: 'paper-9', type: 'paper', similarity: '96%', number: '—', year: '2006', filing: '2006', publication: '2006', title: '粉尘浓度传感器的研究与应用', originalTitle: 'Research on and Application of Dust Concentration Sensor', authors: 'Wang Ziliang', journal: 'Industrial Safety and Environmental Protection', citations: '-', source: 'en.cnki.com.cn', applicant: '-', topics: ['Coal mining', 'Environmental engineering', 'Monitoring system'], area: '煤矿 · 环境工程 · 监测系统', status: '已发表', summary: '介绍粉尘浓度传感器的原理、结构及其在淮南矿业集团公司谢桥煤矿的实验情况。传感器可联网使用并可与安全监控系统配合，实验结果显示测量误差在 15% 以下。' },
  { id: 'paper-10', type: 'paper', similarity: '95.5%', number: '10.3390/su15032816', year: '2023', filing: '2023', publication: '2023', title: '粉尘环境下煤矿巷道围岩变形状态实时感知评价', originalTitle: 'Evaluation of Real-Time Perception of Deformation State of Host Rocks in Coal Mine Roadways in Dusty Environment', authors: 'Shan, Pengfei · Yan, Chengwei · Lai, Xingping', journal: 'Sustainability', citations: '8', source: 'www.mdpi.com', applicant: "Xi'an University of Science & Technology", topics: ['Binocular vision', 'Computer vision', 'Deformation perception'], area: '双目视觉 · 计算机视觉 · 形变感知', status: '已发表', summary: '针对围岩监测误差大、信息滞后和采集频率低的问题，提出基于双目视觉的巷道变形感知方法 RSBV；利用低照度图像增强、K-medoids 分割与 SIFT 特征匹配，实现昏暗高粉尘环境下围岩相对变形的动态、准确实时采集。' },
  { id: 'paper-11', type: 'paper', similarity: '95%', number: '10.3390/electronics13224346', year: '2024', filing: '2024', publication: '2024', title: '弱光环境下基于多传感器融合的机器人定位方法', originalTitle: 'Robot Localization Method Based on Multi-Sensor Fusion in Low-Light Environment', authors: 'Wang, Mengqi · Lian, Zengzeng · Núñez-Andrés, María Amparo · Wang, Penghui · Tian, Yalin', journal: 'Electronics', citations: '3', source: 'www.mdpi.com', applicant: 'Henan Polytechnic University · Polytechnic University of Catalonia', topics: ['Low-light vision', 'Visual inertial odometry', 'Robot localization'], area: '弱光视觉 · 视觉惯性里程计 · 机器人定位', status: '已发表', summary: '针对弱光和不均匀照明导致视觉里程计特征减少、跟踪丢失的问题，提出基于多状态约束卡尔曼滤波器的视觉惯性里程计方法，将 IMU 数据与立体视觉里程计融合，并加入图像增强和陀螺仪零偏差校正机制。' },
  { id: 'paper-12', type: 'paper', similarity: '94.5%', number: '10.1016/j.jsm.2017.01.001', year: '2016', filing: '2016', publication: '2016', title: '地下煤矿巷道连续粉尘监测', originalTitle: 'Continuous dust monitoring in headings in underground coal mines', authors: 'Kazimierz Lebecki · Marcin Małachowski · Tomasz Sołtysiak', journal: 'Journal of sustainable mining', citations: '16', source: 'api.elsevier.com', applicant: '-', topics: ['Coal mine', 'Dust monitoring', 'Ventilation'], area: '煤矿 · 粉尘监测 · 通风', status: '已发表', summary: '基于掘进机在地下岩煤工作面作业现场的粉尘浓度测量结果，分析组合通风与除尘条件下空气粉尘的危害状况，并以三种测量方法检验、评价实际掘进现场的粉尘浓度控制效果。' },
  { id: 'paper-13', type: 'paper', similarity: '94%', number: '10.1109/icet.2018.8603597', year: '2018', filing: '2018', publication: '2018', title: '基于多传感器融合的室内外环境机器人定位', originalTitle: 'Robot Localization in Indoor and Outdoor Environments by Multi-sensor Fusion', authors: 'Sofia Yousuf · Muhammad Bilal Kadri', journal: '2018 14th International Conference on Emerging Technologies (ICET)', citations: '8', source: 'xplorestaging.ieee.org', applicant: 'Karachi Institute of Economics & Technology', topics: ['GPS', 'Mobile robot', 'Kalman filter', 'Computer vision'], area: 'GPS · 移动机器人 · 卡尔曼滤波', status: '已发表', summary: '介绍通过多传感器数据融合在室内外环境中实现机器人可靠定位的方法：室外融合 INS、GPS 与里程表信息，室内在 GPS 受阻时采用多层感知器神经网络提供位置估计，以支持机器人跟踪、路径规划与控制。' },
  { id: 'paper-14', type: 'paper', similarity: '93.5%', number: '10.1109/wcica.2010.5555046', year: '2010', filing: '2010', publication: '2010', title: '基于多传感器的智能服务机器人高效室内环境地图构建', originalTitle: 'Multisensor based effective indoor environment map build-up for intelligent service robot', authors: 'Ren C. Luo · Chun C. Lai', journal: '2010 8th World Congress on Intelligent Control and Automation', citations: '1', source: 'xplorestaging.ieee.org', applicant: 'National Taiwan University', topics: ['Computer vision', 'Covariance intersection', 'Indoor map'], area: '计算机视觉 · 协方差交叉 · 室内地图', status: '已发表', summary: '本文面向智能服务机器人自主导航，研究通过激光测距仪构建由环境几何组成的一致地图；利用协方差交叉方法融合机器人姿态估计，并结合快速深度成像技术，完成统一定位与制图过程。' },
  { id: 'paper-15', type: 'paper', similarity: '93%', number: '—', year: '2004', filing: '2004', publication: '2004', title: '智能粉尘传感器微粒的表征、验证、融合和驱动', originalTitle: 'Smart Dust Sensor Mote Characterization, Validation, Fusion and Actuation', authors: 'Yao-Jung Wen · David E. Culler', journal: '—', citations: '1', source: '-', applicant: '-', topics: ['Computer hardware', 'Electrical engineering', 'Sensor fusion'], area: '计算机硬件 · 电子工程 · 传感器融合', status: '已发表', summary: '—' },
  { id: 'paper-16', type: 'paper', similarity: '92.5%', number: '10.25018/0236-1493-2017-12-29-9-18', year: '2017', filing: '2017', publication: '2017', title: '煤矿巷道粉尘控制方法分析', originalTitle: 'Analysis of the methods of dust control of mine workings in coal mines', authors: 'Kubrin, S.S. · Reshetnyak, S.N. · Degtyarev, V.V.', journal: 'Mining Informational and Analytical Bulletin', citations: '-', source: 'doi.org', applicant: '-', topics: ['Coal mine', 'Dust control'], area: '煤矿 · 粉尘控制', status: '已发表', summary: '—' },
  { id: 'paper-17', type: 'paper', similarity: '92%', number: '10.1109/rcar47638.2019.9044006', year: '2019', filing: '2019', publication: '2019', title: '室内移动机器人的多传感器融合定位', originalTitle: 'Multi-Sensor Fusion Localization of Indoor Mobile Robot', authors: 'Yi Li · Li He · Xiang Zhang', journal: '2019 IEEE International Conference on Real-time Computing and Robotics (RCAR)', citations: '3', source: 'xplorestaging.ieee.org', applicant: '-', topics: ['Extended Kalman filter', 'Mobile robot', 'SLAM'], area: '扩展卡尔曼滤波 · 移动机器人 · SLAM', status: '已发表', summary: '本文提出基于低成本、易重新配置摄像机标记系统的测距融合方法，通过扩展卡尔曼滤波组合不同传感器模块与位置估计系统，直接估计定位方差；室内实验表明，该方法显著提升 SLAM 定位精度。' },
  { id: 'paper-18', type: 'paper', similarity: '91.5%', number: '10.1109/ccieng.2011.6008096', year: '2011', filing: '2011', publication: '2011', title: '基于多传感器融合的救援机器人定位系统', originalTitle: 'Localization system of rescue robot based on multi-sensor fusion', authors: 'Zhenlong Hu', journal: '2011 IEEE 2nd International Conference on Computing, Control and Industrial Engineering', citations: '4', source: 'xplorestaging.ieee.org', applicant: '-', topics: ['Algorithm design', 'Coal mining', 'Mobile robot'], area: '算法设计 · 煤矿 · 移动机器人', status: '已发表', summary: '提出基于信任度加法的救援机器人定位系统新算法，并通过四种数据融合算法比较与 Matlab 仿真验证其可行性；在模拟煤矿环境的机器人平台实验中证明该算法可滤除多重干扰，具有良好鲁棒性。' },
  { id: 'paper-19', type: 'paper', similarity: '91%', number: '—', year: '2013', filing: '2013', publication: '2013', title: '矿用粉尘浓度传感器的设计与应用', originalTitle: 'Design and application of mine-used dust concentration sensor', authors: 'Feng Yu-dong', journal: 'Industry and Mine Automation', citations: '-', source: 'en.cnki.com.cn', applicant: '-', topics: ['Coal', 'Laser', 'Lens optics', 'Acoustics'], area: '煤炭 · 激光 · 光学透镜', status: '已发表', summary: '针对现有粉尘测量方法不能实时反映现场空气中粉尘浓度的问题，设计矿用粉尘浓度传感器，介绍其组成、工作原理及在自动降尘喷雾装置中的应用。该传感器采用激光散射原理并配合刷镜机构，保证测量可靠性和准确性。' },
  { id: 'paper-20', type: 'paper', similarity: '90.5%', number: '—', year: '2011', filing: '2011', publication: '2011', title: '基于多传感器融合的改进机器人定位决策', originalTitle: 'Improved Robots Localization Decisions Based on Multi-Sensor Fusion', authors: 'Tang Ji', journal: 'Computer Systems and Applications', citations: '-', source: 'en.cnki.com.cn', applicant: '-', topics: ['Artificial intelligence', 'Mobile robot', 'Particle filter'], area: '人工智能 · 移动机器人 · 粒子滤波', status: '已发表', summary: '在复杂不确定环境中，针对单传感器机器人定位精度和可靠性差、易受干扰的问题，改进基于粒子滤波的移动机器人 SLAM 算法。新算法融合特征级观测信息并利用冗余传感数据估计机器人路径与环境特征，提升定位准确性和可靠性。' },
]

const additionalPatentResults = Array.from({ length: 891 }, (_, index) => {
  const base = seedResults.filter((item) => item.type === 'patent')[index % 10]
  const number = String(118500000 + index * 791).padStart(9, '0')
  const year = 2020 + (index % 6)
  return { ...base, id: `patent-demo-${index + 1}`, type: 'patent', number: `CN${number}${index % 4 === 0 ? 'U' : 'A'}`, similarity: `${Math.max(52, 80 - Math.floor(index / 24))}%`, filing: `${year}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`, publication: `${year + 1}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}` }
})

const additionalPaperResults = Array.from({ length: 934 }, (_, index) => {
  const base = paperReferenceResults[index % paperReferenceResults.length]
  const year = 2020 + (index % 6)
  return { ...base, id: `paper-demo-${index + 1}`, number: `文献-${String(index + 21).padStart(4, '0')}`, title: ['煤矿巡检机器人多模态环境感知方法研究', '复杂巷道环境下智能巡检机器人自主导航研究', '煤矿井下移动机器人的弱网连续作业策略'][index % 3], originalTitle: ['Multi-modal Environmental Perception for Mine Inspection Robots', 'Autonomous Navigation of Inspection Robots in Complex Roadways', 'Weak-Network Continuous Operation Strategy for Underground Robots'][index % 3], similarity: `${Math.max(52, 89 - Math.floor(index / 26))}%`, year: String(year), filing: String(year), publication: String(year), journal: ['煤炭科学技术', '工矿自动化', '煤炭学报'][index % 3], authors: ['中国矿业大学研究团队', '太原理工大学研究团队', '中煤科工集团研究团队'][index % 3], citations: String(index % 18), source: '文献数据库', applicant: ['中国矿业大学', '太原理工大学', '中煤科工集团重庆研究院有限公司'][index % 3], topics: ['智能巡检', '多模态感知', '自主导航'], area: '智能巡检 · 多模态感知 · 自主导航', summary: '围绕煤矿井下机器人感知、定位、任务控制和安全运行约束开展的技术研究。' }
})

export const semanticReferenceResults = [
  ...patentReferenceResults.map((item) => ({ ...item, ...(patentDetailContent[item.id] || {}) })),
  ...paperReferenceResults,
  ...seedResults.filter((item) => item.type === 'paper'),
  ...Array.from({ length: 177 }, (_, index) => {
    const base = seedResults[index % seedResults.length]
    const number = String(118500000 + index * 791).padStart(9, '0')
    const year = 2020 + (index % 6)
    const type = generatedTypes[index % generatedTypes.length]
    const sourceContent = {
      patent: { number: `CN${number}${index % 4 === 0 ? 'U' : 'A'}`, title: generatedTitles[index % generatedTitles.length], status: index % 3 === 0 ? '审中' : '有效', applicant: generatedApplicants[index % generatedApplicants.length], area: ['矿山智能化 · 安全巡检', '矿井巷道 · 自主导航', '多传感感知 · 移动控制'][index % 3], summary: '面向煤矿井下巡检任务，覆盖移动平台、环境感知、自主导航、任务控制或安全防护等相关技术要点。' },
      paper: { number: `《煤炭科学技术》${year}`, title: ['煤矿巡检机器人多模态环境感知方法研究', '复杂巷道环境下智能巡检机器人自主导航研究', '煤矿井下移动机器人的弱网连续作业策略'][index % 3], status: '已发表', applicant: ['中国矿业大学', '太原理工大学', '中煤科工集团重庆研究院有限公司'][index % 3], area: ['智能巡检 · 多模态感知', '矿井巷道 · 自主导航', '弱网通信 · 连续作业'][index % 3], summary: '围绕煤矿井下机器人感知、定位、任务控制和安全运行约束开展的技术研究。' },
      policy: { number: `煤炭智能化建设政策 ${year}`, title: ['煤矿智能化建设指南', '煤矿机器人重点研发目录', '矿山安全生产智能化建设要求'][index % 3], status: '现行', applicant: ['国家能源局', '国家矿山安全监察局', '工业和信息化部'][index % 3], area: ['煤矿智能化 · 建设要求', '矿山机器人 · 技术导向', '矿山安全 · 管理要求'][index % 3], summary: '与煤矿智能化建设、矿用机器人应用和安全生产管理有关的政策资料。' },
      internal: { number: `内部资料-${year}-${String(index + 1).padStart(3, '0')}`, title: ['煤矿井下智能巡检机器人技术调研报告', '矿用机器人弱网通信场景验证记录', '井下复杂环境自主巡检方案评审材料'][index % 3], status: ((index * 37 + 11) % 10) < 4 ? '个人' : '企业', applicant: ['中煤科工集团深圳研究院', '中煤科工集团技术中心', '煤矿智能化项目组'][index % 3], area: ['技术调研 · 智能巡检', '场景验证 · 任务控制', '方案评审 · 安全防护'][index % 3], summary: '面向项目技术路线、场景验证和实施方案形成的内部沉淀资料。' },
    }[type]
    if (type === 'policy') sourceContent.status = ['现行', '现行', '即将施行', '征求意见', '已废止'][(index * 19 + 7) % 5]
    return {
      ...base,
      type,
      id: `demo-${index + seedResults.length + 1}`,
      ...sourceContent,
      similarity: `${Math.max(52, 74 - Math.floor(index / 8))}%`,
      filing: `${year}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
      publication: `${year + 1}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
    }
  }),
  ...additionalPatentResults,
  ...additionalPaperResults,
]
