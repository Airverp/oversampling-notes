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
  applicability: string;
  limitations: string;
  citation: string;
  links: {
    paper?: string;
    code?: string;
  };
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
      '它的核心价值是把“复制样本”变成“在近邻之间生成新样本”。',
      '后续很多方法都可以被看成是在 SMOTE 的某个模块上做局部改造。',
    ],
    applicability: '适合作为所有表格型过采样方法的比较基线。',
    limitations: '容易在类重叠区域或噪声点附近生成不可靠样本。',
    citation: 'Chawla et al., 2002',
    links: {},
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
      '它最重要的创新是样本选择策略，而不是生成公式本身。',
      '很多后续论文都继承了“优先放大边界区域”的思路。',
    ],
    applicability: '适合边界模糊、少数类被多数类包围较严重的表格数据。',
    limitations: '如果危险样本本身受噪声污染，生成结果可能仍然不稳定。',
    citation: 'Han et al., 2005',
    links: {},
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
      'ADASYN 把“生成多少”也纳入设计，而不是只关心“怎么生成”。',
      '它适合归入样本选择与任务耦合之间的桥梁型方法。',
    ],
    applicability: '适合局部难度分布不均的表格数据。',
    limitations: '如果难样本区域本身含噪，可能会过度放大噪声。',
    citation: 'He et al., 2008',
    links: {},
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
    id: 'maha-sampling-example',
    title: 'Mahalanobis-Distance Guided Oversampling for Tabular Imbalance',
    year: 2021,
    authors: 'Example Placeholder',
    venue: 'Example Venue',
    keywords: ['Mahalanobis', 'distance metric', 'tabular', 'placeholder'],
    problem: '欧氏距离在特征相关性强、量纲差异大的表格数据上可能失真。',
    baseline: 'SMOTE-like methods',
    innovationSummary: '在邻域构建阶段引入马氏距离，使近邻搜索更符合特征协方差结构。',
    detailedNotes: [
      '这类论文的关键不一定是生成方式，而是在“谁被视为近邻”这一步进行了重新定义。',
      '如果你以后看到真正使用马氏距离的论文，可以直接替换这条占位记录。',
    ],
    applicability: '适合特征相关性明显、不同维度尺度差异大的表格型数据。',
    limitations: '依赖协方差估计质量，在高维小样本场景下可能不稳。',
    citation: 'Replace with your actual paper',
    links: {},
    modules: [
      {
        key: 'distance',
        moduleName: '邻域 / 距离定义',
        changeSummary: '使用马氏距离重定义近邻关系。',
        detail: '通过考虑特征协方差缓解欧氏距离在相关特征下的失真。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '通常仍沿用插值式生成。',
        detail: '创新重点主要放在近邻质量，而非新样本公式。',
      },
    ],
  },
  {
    id: 'enn-ahso-2026',
    title: 'A novel adaptive hyperspherical oversampling method based on extended natural neighborhood for imbalanced classification',
    year: 2026,
    authors: 'To be completed from the paper metadata',
    venue: 'Knowledge-Based Systems',
    keywords: ['hypersphere', 'natural neighborhood', 'adaptive', 'tabular', 'oversampling'],
    problem: '传统 SMOTE 类方法往往依赖固定近邻或线性插值，难以准确反映局部数据密度与少数类真实几何结构。',
    baseline: 'SMOTE, ADASYN and related oversampling methods',
    innovationSummary: '基于扩展自然邻域自适应构造超球体，并在球内生成少数类样本，使生成半径能随局部结构变化而调整。',
    detailedNotes: [
      '这篇论文的核心不只是“用超球体生成”，更关键的是先用扩展自然邻域刻画局部结构，再据此自适应确定球体半径。',
      '如果你要和普通 hypersphere 类方法比较，可以重点看它如何把自然邻域信息引入生成空间控制。',
    ],
    applicability: '适合局部密度不均、少数类结构较复杂的表格型不平衡分类任务。',
    limitations: '方法效果依赖自然邻域与局部半径估计质量，在高维、小样本或强噪声场景下可能更敏感。',
    citation: 'Knowledge-Based Systems, 2026',
    links: {
      paper: 'https://www.sciencedirect.com/science/article/pii/S0950705126003849',
    },
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
