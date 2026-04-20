export type ModuleKey =
  | 'distance'
  | 'sample-selection'
  | 'generation-space'
  | 'generation-mechanism'
  | 'quality-control'
  | 'task-coupling';

export interface PaperModule {
  key: ModuleKey;
  moduleName: string;
  changeSummary: string;
  detail: string;
}

export interface PaperEntry {
  id: string;
  title: string;
  year: number;
  authors: string;
  venue: string;
  keywords: string[];
  problem: string;
  baseline: string;
  innovationSummary: string;
  detailedNotes: string[];
  memorySummary?: string;
  memoryAnchors?: string[];
  applicability: string;
  limitations: string;
  citation: string;
  links: {
    paper?: string;
    code?: string;
    doi?: string;
  };
  figure?: {
    src: string;
    alt: string;
    caption: string;
    kind?: 'flowchart' | 'result-figure';
  };
  methodSteps?: {
    title: string;
    action: string;
    formula?: string;
    formulaNote?: string;
    purpose: string;
  }[];
  modules: PaperModule[];
}

export interface ModuleDefinition {
  key: ModuleKey;
  slug: string;
  name: string;
  shortDescription: string;
  guidingQuestion: string;
}

export const moduleDefinitions: ModuleDefinition[] = [
  {
    key: 'distance',
    slug: 'distance',
    name: '邻域 / 距离定义',
    shortDescription: '论文如何定义“谁是近邻”，以及距离度量如何被改进。',
    guidingQuestion: '它如何改变少数类样本之间或少数类与多数类之间的距离计算？',
  },
  {
    key: 'sample-selection',
    slug: 'sample-selection',
    name: '样本选择策略',
    shortDescription: '论文优先对哪些样本做过采样，是否强调边界、难例或去噪。',
    guidingQuestion: '它如何挑选更值得生成新样本的少数类样本？',
  },
  {
    key: 'generation-space',
    slug: 'generation-space',
    name: '生成空间约束',
    shortDescription: '新样本被限制在线段、超球体、簇内部还是更复杂的局部流形。',
    guidingQuestion: '新样本被允许出现在哪些区域，如何避免生成到错误区域？',
  },
  {
    key: 'generation-mechanism',
    slug: 'generation-mechanism',
    name: '生成机制',
    shortDescription: '论文到底怎样生成样本：插值、扰动、加权、聚类或别的机制。',
    guidingQuestion: '它用什么方法真正合成新的少数类样本？',
  },
  {
    key: 'quality-control',
    slug: 'quality-control',
    name: '质量控制',
    shortDescription: '论文如何抑制噪声、越界样本与低质量样本。',
    guidingQuestion: '它如何判断生成的新样本是否可靠？',
  },
  {
    key: 'task-coupling',
    slug: 'task-coupling',
    name: '任务耦合',
    shortDescription: '过采样是否与分类器、集成学习或代价敏感策略一起设计。',
    guidingQuestion: '它是否和后续分类任务一起协同优化？',
  },
];

export const papers: PaperEntry[] = [
  {
    id: 'smote-2002',
    title: 'SMOTE: Synthetic Minority Over-sampling Technique',
    year: 2002,
    authors: 'Nitesh V. Chawla, Kevin W. Bowyer, Lawrence O. Hall, W. Philip Kegelmeyer',
    venue: 'Journal of Artificial Intelligence Research',
    keywords: ['SMOTE', 'baseline', 'tabular', 'interpolation'],
    problem: '直接复制少数类样本容易导致过拟合，无法改善决策边界。',
    baseline: '随机过采样',
    innovationSummary: '在少数类近邻连线上做线性插值，建立了后续多数过采样方法的标准基线。',
    detailedNotes: [
      '先为每个少数类样本找到少数类近邻。',
      '再在样本和近邻之间插值生成新样本。',
      '新样本落在线段内部，而不是直接复制原样本。',
      '目标是扩大少数类分布范围，减轻简单复制带来的过拟合。',
    ],
    memorySummary: 'SMOTE 就是一句话：找近邻，连成线，再在线段上插值。',
    memoryAnchors: ['先找少数类近邻。', '再在线段上插值。', '不复制，改为生成中间点。'],
    applicability: '适合作为所有表格型过采样方法的比较基线。',
    limitations: '容易在类重叠区域或噪声点附近生成不可靠样本。',
    citation: 'Chawla et al., 2002',
    links: {},
    methodSteps: [
      {
        title: '步骤 1：寻找近邻',
        action: '对每个少数类样本找到 k 个少数类近邻。',
        formula: 'N_k(x_i)',
        formulaNote: 'N_k(x_i) 表示样本 x_i 的 k 个少数类近邻。',
        purpose: '先确定插值要连向哪些点。',
      },
      {
        title: '步骤 2：线性插值',
        action: '在样本和某个近邻之间生成新样本。',
        formula: 'x_new = x_i + λ (x_j - x_i),   λ ∈ (0, 1)',
        formulaNote: 'x_j 是少数类近邻，λ 是 0 到 1 之间的随机数。',
        purpose: '让新样本出现在少数类局部区域内部，而不是简单复制原样本。',
      },
      {
        title: '步骤 3：补足数量',
        action: '重复插值，直到少数类样本数达到设定目标。',
        purpose: '用生成样本平衡类别分布。',
      },
    ],
    modules: [
      {
        key: 'sample-selection',
        moduleName: '样本选择策略',
        changeSummary: '默认从少数类样本及其近邻中选择生成基础点。',
        detail: '并不专门强调边界样本、难例样本或噪声过滤。',
      },
      {
        key: 'generation-space',
        moduleName: '生成空间约束',
        changeSummary: '新样本被限制在少数类样本与其近邻的连线段内部。',
        detail: '这一约束简单高效，但对复杂流形的表达能力有限。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '采用线性插值生成新样本。',
        detail: '新样本由原样本和某个近邻按照随机比例混合得到。',
      },
    ],
  },
  {
    id: 'borderline-smote-2005',
    title: 'Borderline-SMOTE: A New Over-Sampling Method in Imbalanced Data Sets Learning',
    year: 2005,
    authors: 'Han Hui, Wang Wen-Yuan, Mao Bing-Huan',
    venue: 'ICIC',
    keywords: ['Borderline-SMOTE', 'boundary', 'tabular'],
    problem: 'SMOTE 对所有少数类样本一视同仁，可能把生成预算浪费在容易分类的区域。',
    baseline: 'SMOTE',
    innovationSummary: '把重点从“所有少数类”转向“决策边界附近的危险样本”，强化边界学习。',
    detailedNotes: [
      '先统计少数类样本周围的多数类比例。',
      '只对危险区里的少数类样本做过采样。',
      '生成方式仍然是在少数类近邻之间插值。',
      '重点不是改公式，而是改“哪些点值得生成”。',
    ],
    memorySummary: 'Borderline-SMOTE 的核心不是新公式，而是先找边界危险点，再只放大这些点。',
    memoryAnchors: ['先判定危险样本。', '只放大边界区。', '插值公式基本不变。'],
    applicability: '适合边界模糊、少数类被多数类包围较严重的表格数据。',
    limitations: '如果危险样本本身受噪声污染，生成结果可能仍然不稳定。',
    citation: 'Han et al., 2005',
    links: {},
    methodSteps: [
      {
        title: '步骤 1：判断是否在边界',
        action: '统计少数类样本邻域里多数类样本所占比例。',
        formula: 'r_i = (# majority in N_k(x_i)) / k',
        formulaNote: 'r_i 越大，说明该点越靠近边界或越危险。',
        purpose: '先找出最需要被放大的少数类样本。',
      },
      {
        title: '步骤 2：选择危险样本',
        action: '只对危险区里的少数类样本做过采样。',
        purpose: '把生成预算集中到决策边界附近。',
      },
      {
        title: '步骤 3：插值生成',
        action: '在危险样本与少数类近邻之间插值生成新样本。',
        formula: 'x_new = x_i + λ (x_j - x_i),   λ ∈ (0, 1)',
        formulaNote: '公式和 SMOTE 基本一样，变化主要在于选谁生成。',
        purpose: '增强边界区域的少数类密度。',
      },
    ],
    modules: [
      {
        key: 'sample-selection',
        moduleName: '样本选择策略',
        changeSummary: '优先选择处于危险区的边界少数类样本。',
        detail: '通过邻域中多数类比例判断样本是否位于边界附近。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '仍然沿用近邻线性插值。',
        detail: '它的主要提升来自“选谁生成”，而不是“怎么生成”。',
      },
      {
        key: 'quality-control',
        moduleName: '质量控制',
        changeSummary: '通过危险区检测避免在明显安全区盲目扩增。',
        detail: '虽然不是严格的样本筛选器，但一定程度上减少了无效生成。',
      },
    ],
  },
  {
    id: 'adasyn-2008',
    title: 'ADASYN: Adaptive Synthetic Sampling Approach for Imbalanced Learning',
    year: 2008,
    authors: 'He Haibo, Bai Yang, Garcia Edwardo A., Li Shutao',
    venue: 'IJCNN',
    keywords: ['ADASYN', 'adaptive', 'difficulty-aware', 'tabular'],
    problem: '不同少数类样本的学习难度不同，统一生成强度可能效率不高。',
    baseline: 'SMOTE',
    innovationSummary: '根据局部学习难度自适应分配生成数量，让难学样本附近生成更多新样本。',
    detailedNotes: [
      '先计算每个少数类样本的局部难度。',
      '难度越高的样本，分到的生成数量越多。',
      '真正生成时，仍然是在少数类近邻之间插值。',
      '重点不是改插值公式，而是改每个样本该生成多少次。',
    ],
    memorySummary: 'ADASYN 的关键是按难度分配生成次数：越难的点，周围生成得越多。',
    memoryAnchors: ['先算难度。', '再按难度分配数量。', '最后仍用插值生成。'],
    applicability: '适合局部难度分布不均的表格数据。',
    limitations: '如果难样本区域本身含噪，可能会过度放大噪声。',
    citation: 'He et al., 2008',
    links: {},
    methodSteps: [
      {
        title: '步骤 1：计算局部难度',
        action: '统计每个少数类样本邻域里的多数类比例。',
        formula: 'r_i = (# majority in N_k(x_i)) / k',
        formulaNote: 'r_i 越大，表示该点越难学。',
        purpose: '先知道哪些少数类样本更需要被补。',
      },
      {
        title: '步骤 2：分配生成数量',
        action: '根据难度给每个少数类样本分配不同的生成次数。',
        formula: 'g_i = (r_i / Σ r_i) × G',
        formulaNote: 'G 是总共要生成的新样本数。',
        purpose: '把更多生成预算分给更难学习的区域。',
      },
      {
        title: '步骤 3：插值生成',
        action: '按分配结果，在少数类近邻之间插值生成样本。',
        formula: 'x_new = x_i + λ (x_j - x_i)',
        formulaNote: '生成公式与 SMOTE 类似，重点在于数量分配。',
        purpose: '让困难区域得到更多补样。',
      },
    ],
    modules: [
      {
        key: 'sample-selection',
        moduleName: '样本选择策略',
        changeSummary: '根据局部难度分配不同的生成权重。',
        detail: '越难学习的少数类样本，周围会生成越多的新样本。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '生成方式仍基于 SMOTE 式插值。',
        detail: '它改变的是生成预算分配，而不是插值骨架本身。',
      },
      {
        key: 'task-coupling',
        moduleName: '任务耦合',
        changeSummary: '隐式地把分类难度引入过采样过程。',
        detail: '虽然没有和分类器联训，但已经开始根据学习任务反馈调整采样。',
      },
    ],
  },
  {
    id: 'mlos-2025',
    title: 'Synthetic oversampling with Mahalanobis distance and local information for highly imbalanced class-overlapped data',
    year: 2025,
    authors: 'Yuanting Yan, Lei Zheng, Shuangyue Han, Chengjin Yu, Peng Zhou',
    venue: 'Expert Systems with Applications',
    keywords: ['Mahalanobis distance', 'class overlap', 'highly imbalanced data', 'density-guided oversampling', 'MLOS'],
    problem: '在高不平衡且类别重叠的表格数据中，传统过采样方法容易在边界附近生成噪声样本，导致少数类扩增与多数类分布冲突。',
    baseline: '17 oversampling baselines on 16 datasets',
    innovationSummary: '提出 MLOS：在马氏距离空间中结合多数类分布与局部密度信息引导少数类样本生成，并配合边界清理减少重叠区域噪声。',
    detailedNotes: [
      '先用多数类样本估计概率密度轮廓，判断哪些区域容易发生类重叠。',
      '辅助点不是随便选，而是在 5 个近邻里找与种子样本密度最接近的点。',
      '新样本只在种子样本和辅助点之间生成，不会直接往高风险区域外推。',
      '生成后再做 pair-wise cleaning，删除边界附近不干净的合成样本。',
      '这篇方法的关键不是单纯“换距离”，而是先用多数类密度限制生成位置，再决定如何生成。',
    ],
    memorySummary: 'MLOS 的主线是：先用多数类密度画危险区域，再选密度接近的辅助点，在两点之间生成，最后清理边界。',
    memoryAnchors: [
      '先画多数类密度图。',
      '辅助点必须密度接近。',
      '新样本只在两点之间生成。',
      '最后清理边界样本。',
    ],
    applicability: '适合类别极不平衡且存在明显类间重叠的表格分类任务，尤其是在欧氏距离难以刻画局部结构时。',
    limitations: '依赖马氏距离与局部密度估计质量；在高维、小样本或协方差估计不稳定的场景下，效果可能受限。',
    citation: 'Yan, Y., Zheng, L., Han, S., Yu, C., & Zhou, P. (2025). Synthetic oversampling with Mahalanobis distance and local information for highly imbalanced class-overlapped data. Expert Systems with Applications. https://doi.org/10.1016/j.eswa.2024.125422',
    links: {
      paper: 'https://www.sciencedirect.com/science/article/abs/pii/S0957417424022899',
      code: 'https://github.com/ytyancp/MLOS',
      doi: 'https://doi.org/10.1016/j.eswa.2024.125422',
    },
    figure: {
      src: 'paper-assets/mlos-2025/figure-paper.jpg',
      alt: 'MLOS 论文中的实验可视化图',
      caption: '论文原图：不同过采样方法在重叠数据上的结果对比，其中右下角为 MLOS。',
      kind: 'result-figure',
    },
    methodSteps: [
      {
        title: '步骤 1：多数类密度建模',
        action: '用马氏距离刻画多数类样本的概率密度轮廓。',
        formula: String.raw`\begin{aligned}
d_M(x,\mu) &= \sqrt{(x-\mu)^T\Sigma^{-1}(x-\mu)} \\
\rho(x) &= f\!\left(d_M(x,\mu_M)\right)
\end{aligned}`,
        formulaNote: '第一行是马氏距离，第二行表示把距离映射成多数类密度值。Σ 是协方差矩阵，所以相关特征不会被重复计算。',
        purpose: '先知道哪里是高风险重叠区，后面生成时才不会随便越界。',
      },
      {
        title: '步骤 2：选择辅助点',
        action: '对每个少数类种子样本，在 5 个近邻里找一个与它密度最接近的点作为辅助点。',
        formula: String.raw`\begin{aligned}
N_5(x_i) &= \{x_j \mid x_j\text{ 是 }x_i\text{ 的 5 个近邻之一}\} \\
a &= \arg\min_{x_j\in N_5(x_i)} \lvert \rho(x_j)-\rho(x_i) \rvert
\end{aligned}`,
        formulaNote: '先限定候选集合 N_5(x_i)，再选出与种子样本密度差最小的辅助点 a。这个约束的作用是避免辅助点落到风险水平差太大的区域。',
        purpose: '把生成位置限制在和种子样本风险水平接近的局部区域，减少一开始就跨进高风险重叠区的概率。',
      },
      {
        title: '步骤 3：生成新样本',
        action: '在种子样本和辅助点之间插值生成新样本。',
        formula: String.raw`\begin{aligned}
\lambda &\sim U(0,1) \\
x_{\mathrm{new}} &= x_i + \lambda\,(a-x_i)
\end{aligned}`,
        formulaNote: '先从 0 到 1 的均匀分布采样 λ，再在种子样本 x_i 和辅助点 a 之间生成新样本。形式上还是插值，但辅助点已经过密度约束。',
        purpose: '让新样本落在更合理的位置，而不是像普通 SMOTE 那样只要是近邻就连线。',
      },
      {
        title: '步骤 4：边界清理',
        action: '对生成后的样本做 pair-wise cleaning，删除边界附近不干净的点。',
        formula: String.raw`\text{if }\operatorname{risk}(x_{\mathrm{new}}) > \tau,\; \text{remove }x_{\mathrm{new}}`,
        formulaNote: 'τ 表示清理阈值。论文重点不是复杂公式，而是生成后还要再筛一遍边界样本。',
        purpose: '减少新样本侵入多数类区域，降低类重叠。',
      },
    ],
    modules: [
      {
        key: 'distance',
        moduleName: '邻域 / 距离定义',
        changeSummary: '在马氏距离空间中刻画样本间关系。',
        detail: '相比欧氏距离，它显式考虑特征协方差结构，用于更合理地描述重叠数据中的局部邻域。',
      },
      {
        key: 'generation-space',
        moduleName: '生成空间约束',
        changeSummary: '利用多数类分布与局部辅助点共同约束合成位置。',
        detail: '新样本不是在任意少数类邻域中直接插值，而是受到多数类密度和局部结构的一致性限制。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '在局部密度相近的少数类区域内生成合成样本。',
        detail: '方法结合近邻与辅助点策略，尽量让新样本贴合少数类局部几何，而不是简单线性外推。',
      },
      {
        key: 'quality-control',
        moduleName: '质量控制',
        changeSummary: '加入边界清理步骤以抑制重叠区域噪声。',
        detail: '生成后再进行清理，减少新样本侵入多数类边界附近区域的风险。',
      },
    ],
  },
  {
    id: 'enn-ahso-2026',
    title: 'A novel adaptive hyperspherical oversampling method based on extended natural neighborhood for imbalanced classification',
    year: 2026,
    authors: 'Yu Zhou, Xuezhen Yue, Jiguang Li, Xing Liu, Weiming Sun, Jichun Li',
    venue: 'Knowledge-Based Systems',
    keywords: ['hypersphere', 'natural neighborhood', 'adaptive', 'tabular', 'oversampling', 'AHOBENN'],
    problem: '传统 SMOTE 类方法往往依赖固定近邻或线性插值，难以准确反映局部数据密度与少数类真实几何结构。',
    baseline: 'SMOTE, ADASYN and related oversampling methods',
    innovationSummary: '提出 AHOBENN：先用扩展自然邻域划分局部区域，再围绕边界少数类点构造自适应超球体，并按权重在球内生成样本。',
    detailedNotes: [
      '先用扩展自然邻域划分局部区域，而不是先固定一个全局 k 值。',
      '再围绕少数类边界点构造超球体，决定样本可以生成在哪一块区域。',
      '超球体内部不包含多数类样本，这样生成空间先天就更安全。',
      '每个超球体的采样权重不是固定的，而是根据局部结构自适应分配。',
      '噪声点和离群点不直接删除，而是用差分进化调整位置。',
      '最终在多个加权超球体内部生成新样本。',
    ],
    memorySummary: 'AHOBENN 的主线是：先用扩展自然邻域分区，再围绕边界点建不含多数类样本的自适应超球体，最后按球体权重在球内采样。',
    memoryAnchors: ['先做扩展自然邻域分区。', '再围绕边界点建球。', '球内不放多数类样本。', '球半径和权重都自适应。', '最后在球内采样。'],
    applicability: '适合局部密度不均、少数类结构较复杂的表格型不平衡分类任务。',
    limitations: '方法效果依赖自然邻域与局部半径估计质量，在高维、小样本或强噪声场景下可能更敏感。',
    citation: 'Zhou, Y., Yue, X., Li, J., Liu, X., Sun, W., & Li, J. (2026). A novel adaptive hyperspherical oversampling method based on extended natural neighborhood for imbalanced classification. Knowledge-Based Systems, 339, 115644.',
    links: {
      paper: 'https://www.sciencedirect.com/science/article/pii/S0950705126003849',
    },
    methodSteps: [
      {
        title: '步骤 1：扩展自然邻域分区',
        action: '先用扩展自然邻域方法划分局部区域，建立每个样本周围的自然邻域关系。',
        formula: String.raw`\mathrm{ENN}(x_i)=\mathrm{NNat}(x_i)\cup\mathrm{ExNat}(x_i)`,
        formulaNote: '这里把自然邻域和扩展邻域合在一起记为 ENN(x_i)。它不是固定 k 近邻，而是由局部结构决定。',
        purpose: '先把局部结构描述清楚，后面建球时才不会太僵硬。',
      },
      {
        title: '步骤 2：围绕边界点建超球体',
        action: '围绕少数类边界点构造超球体，把可生成区域限制在球内部。',
        formula: String.raw`\begin{aligned}
B_i &= \{x \mid \lVert x-c_i \rVert \le r_i\} \\
M \cap B_i &= \varnothing \\
r_i &= g\!\left(\mathrm{ENN}(x_i),\operatorname{border}(x_i)\right)
\end{aligned}`,
        formulaNote: '第一行定义第 i 个超球体，第二行表示球内不包含多数类样本，第三行表示半径 r_i 由扩展自然邻域和边界信息自适应决定。',
        purpose: '把生成区域限制在更安全的局部球体内，减少一开始就跨进多数类区域的风险。',
      },
      {
        title: '步骤 3：给每个球分配权重',
        action: '根据扩展自然邻域和局部结构信息，为每个超球体分配采样权重。',
        formula: String.raw`\begin{aligned}
w_i &= h\!\left(\mathrm{ENN}(x_i),\mathrm{gravitation}_i\right) \\
p_i &= \frac{w_i}{\sum_j w_j}
\end{aligned}`,
        formulaNote: '先计算超球体权重 w_i，再归一化成采样概率 p_i。论文的关键点是：不同球生成样本的多少不一样。',
        purpose: '让不同区域生成样本的多少不同，而不是所有球一视同仁。',
      },
      {
        title: '步骤 4：球内采样并处理噪声点',
        action: '按权重在超球体内部生成新样本，同时用差分进化调整噪声点和离群点的位置。',
        formula: String.raw`\begin{aligned}
i &\sim \operatorname{Categorical}(p_1,\ldots,p_m) \\
x_{\mathrm{new}} &\sim \operatorname{Uniform}(B_i) \\
x_{\mathrm{noise}}^{\ast} &= \operatorname{DE}(x_{\mathrm{noise}})
\end{aligned}`,
        formulaNote: '先按概率选一个超球体，再在该球内部采样生成新样本。噪声点不是直接删除，而是用差分进化优化到更合理的位置。',
        purpose: '在更贴合局部几何的区域里生成样本，同时减少噪声点的破坏。',
      },
    ],
    modules: [
      {
        key: 'distance',
        moduleName: '邻域 / 距离定义',
        changeSummary: '基于扩展自然邻域构建局部邻域关系，而不是依赖固定 k 近邻。',
        detail: '它用自然邻域思想描述样本周围真实局部结构，减少固定近邻参数带来的刚性限制。',
      },
      {
        key: 'sample-selection',
        moduleName: '样本选择策略',
        changeSummary: '以少数类样本及其扩展自然邻域为基础组织生成单元。',
        detail: '样本并非被平均对待，而是嵌入到各自局部邻域结构中进行处理。',
      },
      {
        key: 'generation-space',
        moduleName: '生成空间约束',
        changeSummary: '在自适应超球体内部生成新样本。',
        detail: '球体半径根据局部邻域距离自适应确定，而不是使用统一固定范围。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '通过超球体内部均匀采样生成新样本。',
        detail: '相比线段插值，它允许在局部区域内产生更丰富的方向与分布形态。',
      },
      {
        key: 'quality-control',
        moduleName: '质量控制',
        changeSummary: '利用局部邻域结构与自适应半径抑制越界生成。',
        detail: '方法目标是更好地贴合少数类几何形状，并减少侵入多数类区域的风险。',
      },
    ],
  },
];
