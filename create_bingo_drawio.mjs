import { writeFileSync } from "node:fs";

const out = "/Users/cizzyc/Documents/Pinu/Bingo流程图_drawio版.drawio";

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function model(cells, width = 1400, height = 900) {
  return `<mxGraphModel dx="${width}" dy="${height}" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join("")}</root></mxGraphModel>`;
}

function node(id, text, x, y, w = 160, h = 58, color = "blue") {
  const colors = {
    blue: "fillColor=#dae8fc;strokeColor=#6c8ebf;fontColor=#172033;",
    green: "fillColor=#d5e8d4;strokeColor=#82b366;fontColor=#172033;",
    gray: "fillColor=#f5f5f5;strokeColor=#9aa9b8;fontColor=#172033;",
    white: "fillColor=#ffffff;strokeColor=#9aa9b8;fontColor=#172033;",
  };
  return `<mxCell id="${id}" value="${esc(text)}" style="rounded=1;whiteSpace=wrap;html=1;arcSize=14;strokeWidth=1.5;${colors[color] || colors.white}" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;
}

function decision(id, text, x, y, w = 150, h = 90) {
  return `<mxCell id="${id}" value="${esc(text)}" style="rhombus;whiteSpace=wrap;html=1;strokeWidth=1.5;fillColor=#fff2cc;strokeColor=#d6b656;fontColor=#172033;" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;
}

function groupLabel(id, text, x, y, w) {
  return `<mxCell id="${id}" value="${esc(text)}" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontStyle=1;fontSize=15;fontColor=#29415f;" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${w}" height="28" as="geometry"/></mxCell>`;
}

function lane(id, x, y, w, h) {
  return `<mxCell id="${id}" value="" style="rounded=1;whiteSpace=wrap;html=1;arcSize=8;dashed=1;strokeColor=#c8d3e1;fillColor=#fbfdff;" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;
}

function edge(id, source, target, label = "") {
  return `<mxCell id="${id}" value="${esc(label)}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=1.4;strokeColor=#6b7b90;fontColor=#5b6980;endArrow=block;endFill=1;" edge="1" parent="1" source="${source}" target="${target}"><mxGeometry relative="1" as="geometry"/></mxCell>`;
}

function page(name, id, cells, width, height) {
  return `<diagram id="${id}" name="${esc(name)}">${model(cells, width, height)}</diagram>`;
}

const pages = [];

{
  const c = [];
  c.push(groupLabel("t1", "入口与模式分流", 40, 30, 240));
  c.push(node("start", "用户进入 Pinu", 60, 90, 150, 56, "blue"));
  c.push(decision("source", "判断用户来源", 280, 75, 150, 90));
  c.push(lane("lane1", 60, 220, 360, 440));
  c.push(groupLabel("l1", "投放或首次试玩", 140, 235, 200));
  c.push(node("card", "首页轻量卡片", 160, 285));
  c.push(node("trial", "进入试玩模式", 160, 365));
  c.push(node("teach1", "展示局内教学引导", 160, 445));
  c.push(node("trialDone", "完成试玩局", 160, 525));
  c.push(node("home", "返回首页并引导继续学习", 145, 605, 190, 58, "green"));
  c.push(lane("lane2", 500, 220, 620, 440));
  c.push(groupLabel("l2", "常规用户每日挑战", 710, 235, 220));
  c.push(node("task", "任务页 Bingo 挑战入口", 720, 285, 190));
  c.push(decision("v16", "已学可用词达到 16 个", 740, 365, 170, 96));
  c.push(node("locked", "锁定态或不展示入口", 555, 500, 180));
  c.push(node("learn", "提示继续学习", 555, 585, 180));
  c.push(node("practice", "进入练模式", 935, 500, 160));
  c.push(decision("v24", "可用词达到 24 个", 930, 580, 170, 96));
  c.push(node("open4", "不足 24 个：开启 4x4", 780, 720, 190));
  c.push(node("open5", "达到 24 个：开启 5x5", 1020, 720, 190));
  c.push(node("play", "开始 Bingo 挑战并结算", 900, 820, 210, 58, "green"));
  c.push(edge("e1", "start", "source"));
  c.push(edge("e2", "source", "card", "投放或首次"));
  c.push(edge("e3", "source", "task", "常规用户"));
  c.push(edge("e4", "card", "trial"));
  c.push(edge("e5", "trial", "teach1"));
  c.push(edge("e6", "teach1", "trialDone"));
  c.push(edge("e7", "trialDone", "home"));
  c.push(edge("e8", "task", "v16"));
  c.push(edge("e9", "v16", "locked", "否"));
  c.push(edge("e10", "locked", "learn"));
  c.push(edge("e11", "v16", "practice", "是"));
  c.push(edge("e12", "practice", "v24"));
  c.push(edge("e13", "v24", "open4", "否"));
  c.push(edge("e14", "v24", "open5", "是"));
  c.push(edge("e15", "open4", "play"));
  c.push(edge("e16", "open5", "play"));
  pages.push(page("1 入口与模式分流", "bingo-entry", c, 1280, 940));
}

{
  const c = [];
  c.push(groupLabel("t2", "单局游戏状态流转", 40, 30, 260));
  c.push(node("start", "进入游戏页", 560, 80, 160));
  c.push(decision("first", "是否首次进入 Bingo", 555, 165, 170, 96));
  c.push(node("teach", "展示教学引导", 340, 310));
  c.push(node("skip", "完成或跳过教学", 340, 390));
  c.push(node("countdown", "进入开局倒计时", 760, 350, 180));
  c.push(node("board", "生成棋盘和题目队列", 550, 480, 190));
  c.push(node("call", "开始计时并叫题", 550, 560, 190));
  c.push(decision("valid", "点击是否有效", 565, 650, 160, 92));
  c.push(node("score", "加分并标记词卡", 340, 800));
  c.push(node("combo", "更新 Combo 和 Fever", 340, 880, 190));
  c.push(decision("line", "是否产生新连线", 355, 975, 170, 96));
  c.push(node("invalid", "轻反馈", 780, 805));
  c.push(node("continue1", "继续叫题", 780, 885));
  c.push(node("noLine", "无新连线：继续叫题", 250, 1120, 190));
  c.push(node("claim", "有新连线：领取 Bingo 分数", 500, 1120, 230));
  c.push(decision("finish", "本局是否结束", 555, 1245, 170, 96));
  c.push(node("loop", "未结束：继续叫题", 330, 1400, 190));
  c.push(node("settle", "已结束：进入结算页", 760, 1400, 190, 58, "green"));
  c.push(edge("e1", "start", "first"));
  c.push(edge("e2", "first", "teach", "是"));
  c.push(edge("e3", "teach", "skip"));
  c.push(edge("e4", "skip", "countdown"));
  c.push(edge("e5", "first", "countdown", "否"));
  c.push(edge("e6", "countdown", "board"));
  c.push(edge("e7", "board", "call"));
  c.push(edge("e8", "call", "valid"));
  c.push(edge("e9", "valid", "score", "有效"));
  c.push(edge("e10", "score", "combo"));
  c.push(edge("e11", "combo", "line"));
  c.push(edge("e12", "valid", "invalid", "无效"));
  c.push(edge("e13", "invalid", "continue1"));
  c.push(edge("e14", "line", "noLine", "否"));
  c.push(edge("e15", "line", "claim", "是"));
  c.push(edge("e16", "noLine", "finish"));
  c.push(edge("e17", "claim", "finish"));
  c.push(edge("e18", "continue1", "finish"));
  c.push(edge("e19", "finish", "loop", "否"));
  c.push(edge("e20", "loop", "call"));
  c.push(edge("e21", "finish", "settle", "是"));
  pages.push(page("2 单局游戏状态流转", "bingo-game-state", c, 1280, 1520));
}

{
  const c = [];
  c.push(groupLabel("t3", "目标分与 XP 结算", 40, 30, 260));
  c.push(node("end", "游戏结束", 560, 80, 160));
  c.push(node("score", "计算本局总分", 560, 165, 160));
  c.push(node("target", "读取本局目标分", 560, 250, 160));
  c.push(node("ratio", "计算达成比例", 560, 335, 160));
  c.push(decision("tier", "判断达成比例档位", 555, 430, 170, 96));
  c.push(node("t0", "低于 40 档：无分档 XP", 140, 590, 210));
  c.push(node("t40", "达到 40 档：获得 40 档 XP", 390, 590, 220));
  c.push(node("t70", "达到 70 档：获得 70 档 XP", 650, 590, 220));
  c.push(node("t90", "达到 90 档：获得 90 档 XP", 910, 590, 220));
  c.push(decision("bingo", "是否完成 Bingo", 555, 760, 170, 96));
  c.push(node("bYes", "增加 Bingo 奖励 XP", 340, 915, 190));
  c.push(node("bNo", "不增加 Bingo 奖励 XP", 760, 915, 210));
  c.push(decision("high", "是否刷新最高分", 555, 1060, 170, 96));
  c.push(node("hYes", "增加最高分 XP", 340, 1215, 180));
  c.push(node("hNo", "不增加最高分 XP", 760, 1215, 190));
  c.push(node("cap", "应用单局 XP 上限", 555, 1340, 180));
  c.push(node("record", "服务端记录 XP、分数和最高分", 520, 1430, 250, 58, "green"));
  c.push(edge("e1", "end", "score"));
  c.push(edge("e2", "score", "target"));
  c.push(edge("e3", "target", "ratio"));
  c.push(edge("e4", "ratio", "tier"));
  c.push(edge("e5", "tier", "t0", "低于 40"));
  c.push(edge("e6", "tier", "t40", "40 档"));
  c.push(edge("e7", "tier", "t70", "70 档"));
  c.push(edge("e8", "tier", "t90", "90 档"));
  c.push(edge("e9", "t0", "bingo"));
  c.push(edge("e10", "t40", "bingo"));
  c.push(edge("e11", "t70", "bingo"));
  c.push(edge("e12", "t90", "bingo"));
  c.push(edge("e13", "bingo", "bYes", "是"));
  c.push(edge("e14", "bingo", "bNo", "否"));
  c.push(edge("e15", "bYes", "high"));
  c.push(edge("e16", "bNo", "high"));
  c.push(edge("e17", "high", "hYes", "是"));
  c.push(edge("e18", "high", "hNo", "否"));
  c.push(edge("e19", "hYes", "cap"));
  c.push(edge("e20", "hNo", "cap"));
  c.push(edge("e21", "cap", "record"));
  pages.push(page("3 目标分与 XP 结算", "bingo-xp", c, 1280, 1540));
}

{
  const c = [];
  c.push(groupLabel("t4", "棋盘选择与词量判断", 40, 30, 280));
  c.push(node("start", "用户点击开始 Bingo", 560, 80, 190));
  c.push(decision("mode", "当前模式", 580, 175, 150, 90));
  c.push(lane("lane1", 80, 340, 440, 440));
  c.push(groupLabel("l1", "试玩模式", 205, 355, 180));
  c.push(node("trialPack", "使用试玩词包", 215, 420, 180));
  c.push(decision("trialEnough", "词包是否满足词量", 220, 510, 170, 96));
  c.push(node("trialOpen", "满足：按配置开局", 120, 665, 180));
  c.push(node("trialFallback", "不满足：降级或提示不可玩", 320, 665, 210));
  c.push(lane("lane2", 640, 340, 500, 540));
  c.push(groupLabel("l2", "练模式", 800, 355, 180));
  c.push(node("pool", "读取用户已学词池", 800, 420, 190));
  c.push(node("filter", "筛选可用词卡", 800, 500, 190));
  c.push(decision("v24", "可用词达到 24 个", 810, 590, 170, 96));
  c.push(node("open5", "是：开启 5x5", 680, 740, 160));
  c.push(node("next16", "否：继续判断 16 个词门槛", 910, 740, 230));
  c.push(decision("v16", "可用词达到 16 个", 810, 830, 170, 96));
  c.push(node("open4", "是：开启 4x4", 680, 985, 160));
  c.push(node("locked", "否：不开局，提示继续学习", 910, 985, 230));
  c.push(node("gen", "生成棋盘和随机题目队列", 535, 1135, 250, 58, "green"));
  c.push(edge("e1", "start", "mode"));
  c.push(edge("e2", "mode", "trialPack", "试玩模式"));
  c.push(edge("e3", "trialPack", "trialEnough"));
  c.push(edge("e4", "trialEnough", "trialOpen", "是"));
  c.push(edge("e5", "trialEnough", "trialFallback", "否"));
  c.push(edge("e6", "mode", "pool", "练模式"));
  c.push(edge("e7", "pool", "filter"));
  c.push(edge("e8", "filter", "v24"));
  c.push(edge("e9", "v24", "open5", "是"));
  c.push(edge("e10", "v24", "next16", "否"));
  c.push(edge("e11", "next16", "v16"));
  c.push(edge("e12", "v16", "open4", "是"));
  c.push(edge("e13", "v16", "locked", "否"));
  c.push(edge("e14", "trialOpen", "gen"));
  c.push(edge("e15", "open5", "gen"));
  c.push(edge("e16", "open4", "gen"));
  pages.push(page("4 棋盘选择与词量判断", "bingo-board", c, 1280, 1240));
}

const now = new Date().toISOString();
const file = `<?xml version="1.0" encoding="UTF-8"?><mxfile host="app.diagrams.net" modified="${now}" agent="Codex" version="24.7.17" type="device">${pages.join("")}</mxfile>`;

writeFileSync(out, file, "utf8");
console.log(out);
