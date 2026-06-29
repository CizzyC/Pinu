# Pinu

Pinu 项目总目录，用于集中保存当前产品策略、激励系统、小游戏验证、流程图、教学图和 PRD 产物。

## 子项目

| 目录 | 说明 | 线上仓库 |
|---|---|---|
| `Pinu_demo` | Pinu 产品策略、激励系统、能量系统、XP 等级模型等资料 | `https://github.com/CizzyC/Pinu_demo` |
| `Pinu_game` | Pinu 小游戏原型，当前重点是 Bingo Challenge | `https://github.com/CizzyC/Pinu_game` |

这两个目录在本仓库中以 git submodule 方式保存。恢复完整项目时使用：

```bash
git clone --recurse-submodules https://github.com/CizzyC/Pinu.git
```

如果已经 clone 了根仓库，再拉取子项目：

```bash
git submodule update --init --recursive
```

## 根目录资料

根目录保存跨项目资料和临时沉淀资产，包括：

- Bingo 流程图 draw.io 文件。
- Bingo 图文教学 HTML / PNG。
- Pinu 最小 MVP 激励系统 PRD。
- 生成流程图和 PRD 的脚本。

