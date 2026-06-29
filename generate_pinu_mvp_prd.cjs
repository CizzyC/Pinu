const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageBreak,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  TextRun,
  WidthType,
} = require("/Users/cizzyc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/docx");

const outputPath = "/Users/cizzyc/Documents/Pinu/Pinu最小MVP激励系统_PRD.docx";

const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;
const MARGIN = 1080;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const colors = {
  blue: "D9EAF7",
  green: "DFF5ED",
  gray: "F3F4F6",
  dark: "111827",
  border: "D9E2EC",
};

const border = { style: BorderStyle.SINGLE, size: 1, color: colors.border };
const borders = { top: border, bottom: border, left: border, right: border };

function textRun(text, opts = {}) {
  return new TextRun({
    text: String(text),
    font: "Arial",
    size: opts.size || 22,
    bold: opts.bold || false,
    color: opts.color || colors.dark,
  });
}

function p(text = "", opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before || 80, after: opts.after || 80, line: 320 },
    alignment: opts.alignment || AlignmentType.LEFT,
    children: [textRun(text, opts)],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    children: [textRun(text, { bold: true, size: 32 })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
    children: [textRun(text, { bold: true, size: 28 })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [textRun(text, { bold: true, size: 24 })],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 40, after: 40 },
    children: [textRun(text)],
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "numbers", level },
    spacing: { before: 40, after: 40 },
    children: [textRun(text)],
  });
}

function cell(content, width, opts = {}) {
  const children = Array.isArray(content)
    ? content.flatMap((item) => {
        if (item instanceof Paragraph || item instanceof Table) return [item];
        return String(item)
          .split("\n")
          .map((line) => p(line, { before: 0, after: 40, size: opts.size || 20 }));
      })
    : String(content)
        .split("\n")
        .map((line) => p(line, { before: 0, after: 40, size: opts.size || 20, bold: opts.bold || false }));

  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders,
    shading: opts.header ? { fill: opts.fill || colors.blue, type: ShadingType.CLEAR } : undefined,
    margins: { top: 90, bottom: 90, left: 120, right: 120 },
    children,
  });
}

function table(headers, rows, widths) {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((header, i) => cell(header, widths[i], { header: true, bold: true })),
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: row.map((value, i) => cell(value, widths[i])),
          }),
      ),
    ],
  });
}

function sectionTitleBlock() {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 420, after: 180 },
      children: [textRun("【功能需求】Pinu 最小 MVP 激励系统", { bold: true, size: 36 })],
    }),
    p("版本：V0.1｜阶段：最小 MVP 验证｜归档：Week 2", { alignment: AlignmentType.CENTER, size: 20 }),
    p("定位：用于评审和推动第一版激励系统落地，重点验证 XP、等级、排行榜与轻奖励是否能提升留存和学习投入。", {
      alignment: AlignmentType.CENTER,
      size: 20,
    }),
  ];
}

const children = [
  ...sectionTitleBlock(),
  h1("修订记录"),
  table(
    ["版本", "日期", "修订人", "说明"],
    [["V0.1", "2026-06-24", "柴智元", "基于最小 MVP 路线图、今日讨论和既有激励系统模板整理初版 PRD。"]],
    [1300, 1800, 1600, CONTENT_WIDTH - 4700],
  ),

  h1("〇、术语表"),
  table(
    ["术语", "定义", "备注"],
    [
      ["XP / 经验值", "用户完成有效学习行为后获得的即时反馈数值，也是等级成长和排行榜排名的基础。", "第一版不引入 Coins，避免经济系统过重。"],
      ["等级", "用户累计 XP 达到等级门槛后自动提升，用于长期成长感和个人档案展示。", "等级不随周榜清零。"],
      ["周榜 XP / 有效 XP", "用于排行榜排名的 XP，按周清零，并受复习上限和每日软上限约束。", "与累计等级 XP 来自同一批学习事件，但统计周期不同。"],
      ["新星榜", "新手阶段的专属榜单，目标是让用户快速看到排名提升和胜利反馈。", "底层可使用人机陪跑机制。"],
      ["活跃周榜", "满足解锁条件后进入的正式周榜，按自然周结算。", "第一版不做升降级。"],
      ["TSLW", "Time Spent Learning Well，有效学习时间，用于监控用户是否真的在学习而非刷 XP。", "重点看口语/听力占比、复习 XP 占比、Top 用户 XP 来源。"],
    ],
    [1800, 5200, CONTENT_WIDTH - 7000],
  ),

  h1("一、需求背景&目标"),
  h2("1.1 背景"),
  p("Pinu 当前处于早期阶段，尚未形成完整的经验系统、任务系统和排行榜系统。用户完成学习后的即时反馈较弱，长期成长目标和每周回访理由也不够明确。"),
  p("参考多邻国，XP、排行榜、任务、勋章和经济系统共同构成成熟激励循环。但 Pinu 当前不宜一次性引入 Coins、商店、倍卡和任务经济，否则会增加解释成本、通胀风险和实现复杂度。"),
  p("因此，本期目标是先用最小闭环验证：用户完成学习后能否获得即时反馈；排行榜是否能提升留存、学习频次和周内回访；勋章/称号是否能提供轻量身份反馈。"),
  h2("1.2 产品目标"),
  bullet("提升 D1 / D7 / CURR 留存，让用户产生“我这周为什么还要多回来几次”的理由。"),
  bullet("让用户每次完成学习后立刻获得 XP、等级进度和排名反馈。"),
  bullet("通过新星榜降低新手挫败感，让用户在 1-3 次学习内看到明显排名变化。"),
  bullet("通过活跃周榜让相近活跃度用户竞争，激发更多有效学习。"),
  h2("1.3 本期范围"),
  table(
    ["模块", "是否本期交付", "说明"],
    [
      ["XP 规则", "是", "上线 10/15/30/5 四档 XP，支持复习上限和每日软上限。"],
      ["等级系统", "是", "累计 XP 驱动等级成长，引用已产出的等级经验曲线。"],
      ["新星榜", "是", "新手专属榜，底层使用人机陪跑策略。"],
      ["活跃周榜", "是", "下个自然周自动解锁，按学习频率和有效 XP 分组。"],
      ["勋章/称号", "是", "作为非经济型奖励，展示在个人档案。"],
      ["基础个人档案", "是", "展示头像、昵称、等级、本周 XP、勋章。"],
      ["Coins / 商店", "否", "第一版不做，避免经济循环过重。"],
      ["任务系统 / 倍卡", "否", "仅保留后续接入规则，不在一期发放。"],
    ],
    [2200, 1800, CONTENT_WIDTH - 4000],
  ),
  h2("1.4 关键决策快照"),
  table(
    ["决策", "结论", "原因"],
    [
      ["排行榜优先于任务系统", "先做 XP + 排行榜 + 勋章", "当前目标是验证学习反馈和周回访，不先做复杂任务体系。"],
      ["第一版不引入 Coins", "不做 Coins、商店、付费兑换", "没有消耗口时 Coins 会通胀，并引入付费和公平性问题。"],
      ["排行榜依据", "使用 XP，不使用学习时长或单纯学习数量", "时长可挂机，数量可刷简单课；XP 可按题型难度和质量约束调整。"],
      ["新手榜入正式榜", "满足条件后下个自然周进入活跃周榜", "避免周三/周五中途入榜造成天然劣势。"],
      ["新手榜策略", "前台叫新星榜，底层人机陪跑", "保证新手快速看到排名提升和胜利反馈。"],
    ],
    [2300, 3000, CONTENT_WIDTH - 5300],
  ),

  h1("二、Feature List"),
  table(
    ["优先级", "需求名称", "需求描述", "一期是否交付", "备注"],
    [
      ["P0", "XP 经验规则", "完成不同难度学习行为获得 XP，支持复习和每日软上限。", "是", "排行榜和等级系统地基。"],
      ["P0", "等级系统", "累计 XP 达到门槛后升级，个人档案展示等级。", "是", "引用等级经验曲线表。"],
      ["P0", "新星榜", "新手专属榜，低压力、快速排名提升、易赢。", "是", "底层使用人机陪跑。"],
      ["P0", "活跃周榜", "正式周榜，按相近学习频率和学习强度分组。", "是", "前期不做升降级。"],
      ["P1", "勋章/称号", "根据新星榜、周榜、个人目标产出轻奖励。", "是", "先不发经济资源。"],
      ["P1", "个人档案", "展示头像、昵称、等级、本周 XP、勋章。", "是", "满足最小展示闭环。"],
      ["P2", "任务系统", "每日/每周/月度任务体系。", "否", "后续接入，不直接膨胀 XP。"],
      ["P2", "倍卡 / Coins", "经验倍卡、金币、商店等经济系统。", "否", "后续独立评估。"],
    ],
    [900, 1700, 3900, 1300, CONTENT_WIDTH - 7800],
  ),

  h1("三、需求描述"),
  h2("3.1 整体激励闭环"),
  p("本期最小闭环为：用户完成有效学习行为 → 获得 XP → 等级进度增长 → 排行榜排名变化 → 结算获得勋章/称号 → 在个人档案中展示。"),
  p("该闭环对应用户的三个问题：我刚学完有没有即时反馈；我这周为什么还要回来；我努力之后有没有留下可展示的成果。"),

  h2("3.2 XP 经验规则"),
  h3("3.2.1 XP 产出规则"),
  table(
    ["行为类型", "XP", "说明"],
    [
      ["基础难度题型", "10 XP", "普通学习、基础选择、基础句子练习。作为最小正反馈单位。"],
      ["进阶难度题型", "15 XP", "口语、听力、组合表达、较高认知负荷题。"],
      ["挑战类玩法", "30 XP", "限时挑战、综合挑战、阶段挑战、跳级测试等。"],
      ["复习", "5 XP", "奖励巩固旧内容，但避免复习成为刷榜主路径。"],
    ],
    [2600, 1600, CONTENT_WIDTH - 4200],
  ),
  h3("3.2.2 复习 XP 限制"),
  p("复习每日上限：复习 XP 每日最多 30 XP 计入周榜和累计等级，超过上限后可继续复习，但不再发放 XP 或仅保留复习完成反馈。"),
  table(
    ["规则", "建议值", "说明"],
    [
      ["复习单次 XP", "5 XP", "低于新内容学习。"],
      ["每日可计入周榜的复习 XP 上限", "30 XP", "超过上限可继续复习，但不再计入榜单 XP。"],
      ["每日可计入累计等级的复习 XP 上限", "30 XP", "避免刷旧题过快提升等级。"],
      ["到期复习优先", "是", "到期复习给 XP，非到期重复复习可不给或递减。"],
    ],
    [2800, 1800, CONTENT_WIDTH - 4600],
  ),
  h3("3.2.3 每日有效 XP 软上限"),
  table(
    ["当日有效 XP 区间", "计入比例", "设计目的"],
    [
      ["0-200 XP", "100%", "覆盖普通和积极学习用户。"],
      ["201-400 XP", "50%", "允许高投入用户领先，但降低刷榜收益。"],
      ["400+ XP", "20%", "抑制极端刷分拉爆榜单。"],
    ],
    [2600, 1800, CONTENT_WIDTH - 4400],
  ),
  h3("3.2.4 异常与兜底"),
  bullet("用户 XP 增加、等级提升优先本地表现，上传失败时后台重试，用户无感知。"),
  bullet("以服务端最终累计 XP 和等级为准；用户不会出现等级后退或累计 XP 减少。"),
  bullet("同一学习事件应具备去重标识，避免重复上报导致重复发 XP。"),

  h2("3.3 等级系统"),
  p("等级系统使用累计 XP 驱动，服务于长期成长感。等级经验曲线已产出于：/Users/cizzyc/Documents/Pinu/Pinu_demo/outputs/level_xp_model/Pinu等级经验曲线_简版.xlsx。"),
  table(
    ["节点", "目标等级", "累计 XP 参考", "说明"],
    [
      ["D1", "Lv3", "约 30 XP", "首日完成少量学习即可升级，建立正反馈。"],
      ["D7", "Lv10", "约 230 XP", "首周形成轻量目标。"],
      ["D30", "Lv25", "约 1,150 XP", "一个月内有明显成长。"],
      ["D60", "Lv37", "约 2,650 XP", "两个月后升级速度放缓。"],
      ["D90", "Lv45", "约 4,450 XP", "季度目标。"],
      ["D180", "Lv65", "约 11,000 XP", "半年留存目标。"],
      ["D365", "Lv100", "约 27,600 XP", "年度长期成长。"],
    ],
    [1400, 1600, 2000, CONTENT_WIDTH - 5000],
  ),

  h2("3.4 新星榜"),
  h3("3.4.1 定位与目标"),
  p("新星榜是新手专属榜，目标是让新用户排名进步快、更容易赢。前台不暴露机器人机制，用户看到的是“新手专属榜/新星榜”。"),
  h3("3.4.2 入榜与周期"),
  table(
    ["规则", "建议"],
    [
      ["入榜时机", "用户完成首次有效学习后进入新星榜。"],
      ["榜单人数", "10-15 人，第一版暂定 10 人。"],
      ["真实用户展示", "第一版只展示当前用户自己和陪跑对象，不混入其他真实新手。"],
      ["榜单周期", "从首次学习起至本自然周周日 23:59，满足条件后下周进入活跃周榜。"],
    ],
    [2800, CONTENT_WIDTH - 2800],
  ),
  h3("3.4.3 人机陪跑策略"),
  table(
    ["策略", "规则", "目的"],
    [
      ["首次跃升", "用户首次获得 10 XP 后，排名至少上升 2-4 名。", "让用户立刻感到学习有效。"],
      ["陪跑对象", "每个新手分配固定机器人头像和昵称。", "降低榜单空感，形成陪伴。"],
      ["低压竞争", "榜首 XP 不设过高，用户完成 3-5 次学习有机会冲第一。", "降低新手挫败感。"],
      ["动态追赶", "用户冷启动时，低于用户的少量机器人可小幅增加 5-15 XP。", "制造轻微竞争，但不立刻反超。"],
      ["保底胜利", "完成 3 次有效学习大概率进入 Top 3，完成 5 次有效学习基本可第 1。", "让新手获得一次胜利体验。"],
    ],
    [1800, 4600, CONTENT_WIDTH - 6400],
  ),
  h3("3.4.4 新手毕业条件"),
  table(
    ["条件", "说明", "状态"],
    [
      ["新增满 3 天", "用于排除极短期新用户，需补数据验证。", "待验证"],
      ["完成 3 次有效学习", "包括新内容学习和复习；建议作为主条件。", "建议采用"],
      ["满足条件后进入正式榜", "下个自然周自动进入活跃周榜。", "建议采用"],
    ],
    [2200, 4100, CONTENT_WIDTH - 6300],
  ),

  h2("3.5 活跃周榜"),
  h3("3.5.1 定位"),
  p("活跃周榜是正式榜，目标是让相同活跃度用户排名，激发用户学更多。第一版不做升降级，避免解释成本过高。"),
  h3("3.5.2 入榜与结算"),
  bullet("满足新手毕业条件后，下个自然周一 00:00 进入活跃周榜。"),
  bullet("周榜 XP 从自然周一 00:00 开始计数，周日 23:59 结算。"),
  bullet("周内不把新手中途插入正式榜，避免周三/周五入榜天然吃亏。"),
  h3("3.5.3 分桶与分组"),
  table(
    ["第一层：学习频率", "条件", "说明"],
    [
      ["低频", "近 7 日学习 1-2 天", "轻量学习用户。"],
      ["中频", "近 7 日学习 3-4 天", "普通稳定学习用户。"],
      ["高频", "近 7 日学习 5 天以上", "高习惯用户。"],
    ],
    [2200, 2800, CONTENT_WIDTH - 5000],
  ),
  table(
    ["第二层：学习强度", "近 7 日有效 XP", "参考解释"],
    [
      ["轻度尝试", "0-50 XP", "约 0-5 课/周。"],
      ["普通学习", "51-150 XP", "约 5-15 课/周。"],
      ["稳定学习", "151-300 XP", "约 15-30 课/周。"],
      ["重度学习", "300+ XP", "约 30+ 课/周。"],
    ],
    [2200, 2600, CONTENT_WIDTH - 4800],
  ),
  p("分组策略：先按学习频率分桶，再按近 7 日有效 XP 排序切组。当前 DAU 约 1500、DNU 约 200，活跃周榜每组暂定 20 人；未来 DAU 10000+ 时可扩展到更细的地区、活跃时间、升降级维度。"),

  h2("3.6 勋章/称号"),
  table(
    ["来源", "条件", "奖励"],
    [
      ["新星榜", "第 1 名", "新星冠军徽章。"],
      ["新星榜", "前 3 名", "新手 Top 3 标记。"],
      ["新星榜", "完成 3 次有效学习", "启航徽章。"],
      ["活跃周榜", "第 1 名", "本周学习冠军徽章。"],
      ["活跃周榜", "前 3 名", "本周 Top 3 称号。"],
      ["活跃周榜", "前 30%", "本周优秀学习者标记。"],
    ],
    [2200, 3200, CONTENT_WIDTH - 5400],
  ),

  h2("3.7 个人档案"),
  table(
    ["模块", "字段", "说明"],
    [
      ["基础信息", "头像 / 昵称 / 等级", "排行榜和个人页展示的最小身份信息。"],
      ["学习信息", "在学课程 / 本周 XP / 连胜天数", "提供用户当前状态和周榜关联信息。"],
      ["勋章展示", "已解锁勋章 / 称号", "承接排行榜结算奖励。"],
      ["头像框", "可选", "第一版可作为轻量可见奖励，不接入经济系统。"],
    ],
    [1800, 2800, CONTENT_WIDTH - 4600],
  ),

  h2("3.8 后续系统预留"),
  table(
    ["系统", "一期处理", "预留原则"],
    [
      ["任务系统", "不做或仅展示型目标", "后续任务 XP 不应无限直接进入累计等级或周榜。"],
      ["倍卡", "不投放", "上线时需要限额，避免 XP 膨胀。"],
      ["Coins", "不做", "需先明确消耗口和付费边界。"],
      ["月度挑战", "不做", "后续优先按完成任务数，不按 XP 数。"],
    ],
    [1800, 2600, CONTENT_WIDTH - 4400],
  ),

  h1("四、数据验证"),
  h2("4.1 MVP 成功指标"),
  table(
    ["指标", "观察方式", "预期方向"],
    [
      ["D1 / D7 / CURR 留存", "对比上线前后或实验组/对照组", "提升。"],
      ["人均 XP/天", "监控均值、中位数、P90", "从当前约 30 XP/天提升到合理区间。"],
      ["周内学习天数", "看 1-2 天、3-4 天、5 天以上占比变化", "3 天以上用户占比提升。"],
      ["周末回访", "观察周榜结算前后的回访", "周末回访提升。"],
      ["口语/听力占比", "看进阶题 XP 与 TSLW 占比", "占比提升。"],
    ],
    [2200, 4200, CONTENT_WIDTH - 6400],
  ),
  h2("4.2 风险指标"),
  table(
    ["风险", "监控指标", "处理方向"],
    [
      ["刷复习 XP", "复习 XP 占比、复习上限打满人数", "下调复习上限或非到期复习不给 XP。"],
      ["榜首 XP 过高", "各榜 Top 10 XP 分布", "调整每日软上限或分桶规则。"],
      ["新手挫败", "新星榜新手首次学习后排名变化、次日回访", "降低机器人难度。"],
      ["榜单冷清", "每组实际产生 XP 的人数", "降低组人数或合并相邻桶。"],
      ["学习质量下降", "XP/TSLW、挑战/复习来源占比", "提高有效学习约束。"],
    ],
    [2200, 3600, CONTENT_WIDTH - 5800],
  ),
  h2("4.3 需补充的数据查询"),
  numbered("近 7 日学习 1-2 天 / 3-4 天 / 5 天以上用户，在可入榜学习用户中的占比和绝对值。"),
  numbered("每个学习天数组内，近 7 日完成 lesson 数分布、P50/P75/P90。"),
  numbered("每个学习天数组内，近 7 日有效 XP 分布、P50/P75/P90。"),
  numbered("新手满足毕业条件的人数：新增满 3 天、完成 3 次有效学习分别覆盖多少用户。"),
  numbered("复习行为占比和复习 XP 打满人数，用于验证复习上限是否合理。"),

  h1("五、附录"),
  h2("5.1 多邻国参考与 Pinu 取舍"),
  table(
    ["多邻国做法", "Pinu 一期取舍"],
    [
      ["XP 作为即时反馈和排行榜燃料。", "采用 XP，但加入复习上限和每日软上限。"],
      ["任务、排行榜、宝石、商店、订阅形成成熟循环。", "一期不做 Coins 和商店，先验证 XP + 排行榜。"],
      ["长期有联赛、晋级降级和周结算。", "一期先做活跃周榜，不做升降级。"],
      ["任务逐渐从纯 XP 转向更强调学习质量。", "一期就预留 TSLW 和 XP 来源监控。"],
    ],
    [4200, CONTENT_WIDTH - 4200],
  ),
  h2("5.2 关联产物"),
  bullet("最小 MVP 路线图：/Users/cizzyc/Documents/最小mvp路线.xmind"),
  bullet("等级经验曲线：/Users/cizzyc/Documents/Pinu/Pinu_demo/outputs/level_xp_model/Pinu等级经验曲线_简版.xlsx"),
  bullet("参考模板：/Users/cizzyc/Documents/作业帮-pinu/激励系统一期.docx"),
  bullet("参考评审文档：/Users/cizzyc/Documents/作业帮-pinu/已评审-【功能需求】V1.2.0-能量（Power）.docx"),
];

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, color: colors.dark } },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: colors.dark },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: colors.dark },
        paragraph: { spacing: { before: 260, after: 120 }, outlineLevel: 1 },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: colors.dark },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 520, hanging: 260 } } },
          },
        ],
      },
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 520, hanging: 260 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log(outputPath);
});
