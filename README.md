# Oversampling Notes

这是一个偏学术风格的静态网站，用来整理 **不平衡表格数据中过采样算法** 的论文、方法与创新点。

## 你以后最常用的文件

- `src/data/papers.ts`：所有论文内容都在这里
- `src/pages/guide.astro`：站内维护说明页面
- `src/pages/papers/`：论文页面路由
- `src/pages/modules/`：模块页面路由

## 本地运行

在 `site` 目录里打开终端后运行：

```bash
npm install
npm run dev
```

本地构建：

```bash
npm run build
```

## 如何新增一篇论文

打开 `src/data/papers.ts`，在 `papers` 数组中复制一条现有记录并修改。

建议最少先填这些字段：

- `id`
- `title`
- `year`
- `innovationSummary`
- `modules`

### modules 怎么写

每个模块都写成：

```ts
{
  key: 'distance',
  moduleName: '邻域 / 距离定义',
  changeSummary: '一句话说明改了什么',
  detail: '再补一句详细解释',
}
```

可选模块 key：

- `distance`
- `sample-selection`
- `generation-space`
- `generation-mechanism`
- `quality-control`
- `task-coupling`

## GitHub Pages 发布

### 第一步：修改站点配置

打开 `astro.config.mjs`，把下面两项改成你自己的：

- `site`: 你的 GitHub Pages 域名，例如 `https://你的用户名.github.io`
- `base`: 你的仓库名，例如 `/oversampling-notes`

如果你未来把网站放在用户名主页仓库（`用户名.github.io`）里，可以把 `base` 改成 `/`。

### 第二步：推送到 GitHub

把整个 `site` 文件夹作为一个 GitHub 仓库上传。

### 第三步：开启 GitHub Pages

仓库里已经带了 GitHub Actions 工作流。你只需要在 GitHub 仓库设置里启用 Pages，并选择 **GitHub Actions** 作为部署来源。

之后每次你提交并推送更新，网站都会自动重新发布。

## 你现在的网站结构

- 首页：研究方向介绍和入口
- `/papers`：按论文浏览
- `/papers/[id]`：论文详情
- `/modules`：按模块浏览
- `/modules/[slug]`：模块详情
- `/guide`：维护说明

## 建议你的录入节奏

- 每读完一篇论文：先补 `innovationSummary`
- 然后只写它涉及的模块，不要强行写满六个模块
- 如果以后再深入读，再补 `detailedNotes`、`applicability`、`limitations`

这样最容易长期坚持。
