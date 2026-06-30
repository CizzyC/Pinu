# Pinu Leaderboard Demo

这个目录用于演示排行榜 V1.0 的核心体验，不改动 `Pinu_game/` 现有 Bingo demo。

## Demo 目标

- 首页排行榜入口：在 Pinu 首页视觉体系中加入本周榜单入口。
- 排行榜页面：展示新星周榜、结算倒计时、本人当前排名、本周 XP、本人高亮和本人固定条。
- 名次上升动画：模拟完成有效学习后获得 XP，从第 6 名上升到第 3 名。
- 周结算反馈：模拟自然周结算后展示上周排名、上周 XP、较上周 XP 变化幅度和获得的第 3 名专属挂件。
- 挂件发放和自动佩戴：模拟 V1.0 自动发放、自动领取、自动佩戴第 3 名专属挂件，并同步到榜单本人行和个人档案。
- 个人档案：展示昵称、头像、本周 XP、累计 XP、当前佩戴挂件和最近获得挂件。

## 本地打开

```bash
open /Users/cizzyc/Documents/Pinu/Pinu_leaderboard_demo/index.html
```

## 参考来源

- Pinu 当前视觉：`/Users/cizzyc/Documents/Pinu/Pinu_game/index.html`
- Pinu 首页资产：`/Users/cizzyc/Documents/Pinu/Pinu_game/assets/home-background.png`
- Pinu 页面截图：`/Users/cizzyc/Documents/Pinu/Pinu截图/`、`/Users/cizzyc/Documents/Pinu/Pinu_demo/项目截图/`
- 多邻国参考：`/Users/cizzyc/Documents/Pinu/多邻国截图/`
- 排行榜需求：`/Users/cizzyc/Documents/Pinu/leaderboard_v1_rich_paste.html`

## 交互说明

- 点击首页底部导航的奖杯入口，进入排行榜页。
- 点击排行榜页底部「播放上升」，模拟 XP 增长、名片卡上升和飘彩带氛围反馈。
- 点击排行榜页右上角「结算」或底部「结算本周」，进入周结算反馈页。
- 在周结算反馈页点击「继续」，播放金黄色奖章挂件盖章落入、冲击波和碎金点动画；动画完成后显示「已自动佩戴，继续学习」，再次点击返回学习路径。
- 点击排行榜本人行或本人固定条，可进入个人档案查看当前佩戴挂件。

## MVP 边界

- 这是用于评审的前端演示 demo，不包含真实账号、服务端分桶、XP 幂等或结算任务。
- 排行榜数据为本地模拟数据，目的是验证 UI 表达和激励反馈是否清晰。
- 后续接入真实产品时，需要由服务端提供 `weekly_xp`、`rank`、`gap_to_next`、`group_id` 和结算状态。
