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
  };
  figure?: {
    src: string;
    alt: string;
    caption: string;
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
      '这篇论文最值得记住的不是“马氏距离”四个字本身，而是它把多数类分布正式拉进了过采样决策过程：先看多数类概率轮廓，再决定少数类样本该往哪里生成。',
      '作者的判断是：在极端少数类稀缺时，只靠少数类自身近邻并不足以支撑可靠生成，因为可用局部结构太少，稍微插值就可能越过真实边界。',
      'MLOS 的第一步是用马氏距离刻画多数类概率密度轮廓，让模型知道哪些区域属于“高风险重叠区”，从而避免像普通 SMOTE 那样只在少数类内部盲目连线。',
      '第二步是给每个少数类种子样本找一个局部辅助点，而且要求辅助点与种子样本在多数类密度意义下相近；这相当于给生成位置加了一道“局部一致性”约束。',
      '第三步不是生成完就结束，而是再做 pair-wise data cleaning，根据合成样本的概率密度清理边界附近不干净的样本，因此它在“生成后修边界”上也有明确设计。',
      '如果你要把它和普通边界型方法区分开，一个很好的记忆方式是：别的方法主要在问“哪些少数类点更值得放大”，而 MLOS 在问“多数类密度允许你把新样本放到哪里”。',
    ],
    memorySummary: '把 MLOS 记成“三段式”：先用多数类密度定危险轮廓，再用相似密度辅助点限位生成，最后用 pair-wise cleaning 把边界重新擦干净。',
    memoryAnchors: [
      '不是只看少数类，而是先看多数类密度。',
      '马氏距离 = 用协方差结构刻画多数类概率轮廓。',
      '辅助点 = 给生成位置加局部一致性约束。',
      '生成之后还要清边界，不是生成完就结束。',
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
      src: '/paper-assets/mlos-2025/method-memory-map.svg',
      alt: 'MLOS 方法记忆图：多数类密度轮廓、辅助点约束生成、pair-wise 清理',
      caption: '记忆要点：MLOS 不是只在少数类内部插值，而是先借助多数类密度判断危险区域，再约束生成，最后清理边界。',
    },
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
