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
    formulaLines?: string[];
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
    problem: '在高不平衡且类别重叠的表格数据中，传统过采样方法通常只利用少数类自身的邻域关系来生成新样本。但在少数类样本极少、且与多数类分布明显重叠时，少数类自身提供的局部几何信息并不充分，普通插值很容易把新样本推到边界噪声区甚至多数类区域，进一步加剧类间重叠。',
    baseline: '方法本质上是在 SMOTE 类插值框架上继续改进，但重点不是再改线性插值公式本身，而是补上两个普通方法缺失的约束：第一，用多数类分布信息判断哪里属于高风险生成区域；第二，在生成后增加边界清理步骤。可以把它看成是“少数类插值 + 多数类密度约束 + 生成后清理”的组合改进。',
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
        formulaLines: [
          String.raw`d_M(x,\mu)=\sqrt{(x-\mu)^T\Sigma^{-1}(x-\mu)}`,
          String.raw`\rho(x)=f\!\left(d_M(x,\mu_M)\right)`,
        ],
        formulaNote: '第一行是马氏距离，第二行表示把距离映射成多数类密度值。Σ 是协方差矩阵，所以相关特征不会被重复计算。',
        purpose: '先知道哪里是高风险重叠区，后面生成时才不会随便越界。',
      },
      {
        title: '步骤 2：选择辅助点',
        action: '对每个少数类种子样本，在 5 个近邻里找一个与它密度最接近的点作为辅助点。',
        formulaLines: [
          String.raw`N_5(x_i)=\{x_j\mid x_j\text{ is one of the 5 nearest neighbors of }x_i\}`,
          String.raw`a=\arg\min_{x_j\in N_5(x_i)}\lvert \rho(x_j)-\rho(x_i)\rvert`,
        ],
        formulaNote: '先限定候选集合 N_5(x_i)，再选出与种子样本密度差最小的辅助点 a。这个约束的作用是避免辅助点落到风险水平差太大的区域。',
        purpose: '把生成位置限制在和种子样本风险水平接近的局部区域，减少一开始就跨进高风险重叠区的概率。',
      },
      {
        title: '步骤 3：生成新样本',
        action: '在种子样本和辅助点之间插值生成新样本。',
        formulaLines: [
          String.raw`\lambda\sim U(0,1)`,
          String.raw`x_{\mathrm{new}}=x_i+\lambda(a-x_i)`,
        ],
        formulaNote: '先从 0 到 1 的均匀分布采样 λ，再在种子样本 x_i 和辅助点 a 之间生成新样本。形式上还是插值，但辅助点已经过密度约束。',
        purpose: '让新样本落在更合理的位置，而不是像普通 SMOTE 那样只要是近邻就连线。',
      },
      {
        title: '步骤 4：边界清理',
        action: '对生成后的样本做 pair-wise cleaning，删除边界附近不干净的点。',
        formulaLines: [
          String.raw`\text{if }\operatorname{risk}(x_{\mathrm{new}})>\tau,\;\text{remove }x_{\mathrm{new}}`,
        ],
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
    problem: '传统 SMOTE 类方法大多依赖固定近邻、线性插值或预设参数来组织生成区域，这在局部密度变化明显、少数类结构复杂或存在噪声点和离群点时很容易失真。固定邻域可能无法真实反映局部结构，统一生成半径也容易让样本越界；同时很多方法会直接删除噪声点，导致有效边界信息被一并丢掉。',
    baseline: 'AHOBENN 主要是在 hypersphere oversampling 与 natural-neighborhood 思路上继续推进。它不是简单把样本放进球里生成，而是先用扩展自然邻域替代固定 k 近邻来描述局部结构，再围绕边界点构造自适应超球体，并给不同超球体分配不同采样权重。换句话说，它是在“自然邻域建模 + 超球体生成”两条线上的联合改进。',
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
        formulaLines: [
          String.raw`\mathrm{ENN}(x_i)=\mathrm{NNat}(x_i)\cup\mathrm{ExNat}(x_i)`,
        ],
        formulaNote: '这里把自然邻域和扩展邻域合在一起记为 ENN(x_i)。它不是固定 k 近邻，而是由局部结构决定。',
        purpose: '先把局部结构描述清楚，后面建球时才不会太僵硬。',
      },
      {
        title: '步骤 2：围绕边界点建超球体',
        action: '围绕少数类边界点构造超球体，把可生成区域限制在球内部。',
        formulaLines: [
          String.raw`B_i=\{x\mid \lVert x-c_i\rVert\le r_i\}`,
          String.raw`M\cap B_i=\varnothing`,
          String.raw`r_i=g\!\left(\mathrm{ENN}(x_i),\operatorname{border}(x_i)\right)`,
        ],
        formulaNote: '第一行定义第 i 个超球体，第二行表示球内不包含多数类样本，第三行表示半径 r_i 由扩展自然邻域和边界信息自适应决定。',
        purpose: '把生成区域限制在更安全的局部球体内，减少一开始就跨进多数类区域的风险。',
      },
      {
        title: '步骤 3：给每个球分配权重',
        action: '根据扩展自然邻域和局部结构信息，为每个超球体分配采样权重。',
        formulaLines: [
          String.raw`w_i=h\!\left(\mathrm{ENN}(x_i),\mathrm{gravitation}_i\right)`,
          String.raw`p_i=\frac{w_i}{\sum_j w_j}`,
        ],
        formulaNote: '先计算超球体权重 w_i，再归一化成采样概率 p_i。论文的关键点是：不同球生成样本的多少不一样。',
        purpose: '让不同区域生成样本的多少不同，而不是所有球一视同仁。',
      },
      {
        title: '步骤 4：球内采样并处理噪声点',
        action: '按权重在超球体内部生成新样本，同时用差分进化调整噪声点和离群点的位置。',
        formulaLines: [
          String.raw`i\sim \operatorname{Categorical}(p_1,\ldots,p_m)`,
          String.raw`x_{\mathrm{new}}\sim \operatorname{Uniform}(B_i)`,
          String.raw`x_{\mathrm{noise}}^{\ast}=\operatorname{DE}(x_{\mathrm{noise}})`,
        ],
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
  {
    id: 'enho-2025',
    title: 'A synthetic minority oversampling method with Elastic Net Hypergraph',
    year: 2025,
    authors: 'Pengfei Sun, Zhiping Wang, Peiwen Wang, Kaina Zhao',
    venue: 'Engineering Applications of Artificial Intelligence',
    keywords: ['hypergraph', 'elastic net', 'noise filtering', 'tabular', 'ENHO'],
    problem: '传统 SMOTE 及其变体主要依赖点对点近邻关系，无法表达样本间高阶关联；在噪声点和离群点附近生成样本会放大错误结构，加剧类重叠。',
    baseline: 'ENHO 本质上是在 SMOTE 类插值框架上继续改进，但重点不是再改线性插值公式本身，而是把”样本关系建模”从普通近邻图提升到 Elastic Net 超图，并在生成前做噪声过滤与样本配额分配。可以把它看成是”超图结构建模 + 配额分配 + 拉普拉斯高斯生成”的组合改进。',
    innovationSummary: '提出 ENHO：先用改进 Elastic Net 构建超图并过滤噪声，再按超边权重分配生成量，最后在拉普拉斯与高斯约束下生成样本。',
    detailedNotes: [
      '先通过稀疏表示的 Elastic Net 建立超图，保留样本间高阶结构关系。',
      '在超图建模阶段先过滤噪声点和离群点，减少后续污染。',
      '根据关联矩阵计算超边权重，再给每个少数类样本分配过采样规模。',
      '样本生成不是纯线性插值，而是结合拉普拉斯结构与高斯分布约束。',
      '方法重点是”先建结构、再分配、后生成”，三步缺一不可。',
    ],
    memorySummary: 'ENHO 的主线是：Elastic Net 超图建模并去噪 → 按超边权重分配生成预算 → 在拉普拉斯高斯约束下生成样本。',
    memoryAnchors: ['先建超图。', '先过滤噪声。', '按超边权重分配。', '最后拉普拉斯高斯生成。'],
    applicability: '适合样本关系复杂、点对点近邻不足以刻画局部结构的表格不平衡分类任务。',
    limitations: '超图构建与参数估计成本较高；在超高维或样本极少场景下，结构估计稳定性可能下降。',
    citation: 'Sun, P., Wang, Z., Wang, P., & Zhao, K. (2025). A synthetic minority oversampling method with Elastic Net Hypergraph. Engineering Applications of Artificial Intelligence, 142, 109885.',
    links: {},
    methodSteps: [
      {
        title: '步骤 1：Elastic Net 超图建模',
        action: '用改进的稀疏表示 Elastic Net 为每个少数类样本建立超边，构建超图。',
        formulaLines: [
          String.raw`\min_{\mathbf{z}} \|\mathbf{x}_i - \mathbf{X}\mathbf{z}\|_2^2 + \alpha\|\mathbf{z}\|_1 + \beta\|\mathbf{z}\|_2^2`,
        ],
        formulaNote: 'z 是稀疏表示系数，α 控制 L1 稀疏性，β 控制 L2 平滑性；非零系数对应的样本构成超边成员。',
        purpose: '用高阶关系替代点对点近邻，更完整地刻画少数类局部结构。',
      },
      {
        title: '步骤 2：噪声过滤与超边权重计算',
        action: '根据关联矩阵过滤噪声点和离群点，再计算每条超边的权重。',
        formulaLines: [
          String.raw`w(e) = \frac{1}{|e|}\sum_{x_i \in e} \text{sim}(x_i, \bar{x}_e)`,
        ],
        formulaNote: 'w(e) 是超边 e 的权重，|e| 是超边内样本数，sim 衡量样本与超边中心的相似度。',
        purpose: '先清除不可靠样本，再用超边权重反映局部结构的可信度。',
      },
      {
        title: '步骤 3：分配过采样规模',
        action: '根据超边权重给每个少数类样本分配生成数量。',
        formulaLines: [
          String.raw`n_i = \left\lfloor N_{\text{gen}} \cdot \frac{w_i}{\sum_j w_j} \right\rfloor`,
        ],
        formulaNote: 'N_gen 是总生成数量，w_i 是样本 i 所在超边的权重；权重越高，分配到的生成次数越多。',
        purpose: '把生成预算集中到结构更可靠的区域，而不是均匀分配。',
      },
      {
        title: '步骤 4：拉普拉斯高斯生成',
        action: '利用超图拉普拉斯矩阵和高斯分布生成新样本。',
        formulaLines: [
          String.raw`\mathbf{x}_{\text{new}} \sim \mathcal{N}(\mathbf{x}_i,\, \sigma^2 \mathbf{L}^+)`,
        ],
        formulaNote: 'L+ 是超图拉普拉斯的伪逆，σ² 控制生成范围；新样本在超图结构约束的局部区域内采样。',
        purpose: '让新样本贴合超图刻画的高阶局部结构，而不是简单线性插值。',
      },
    ],
    modules: [
      {
        key: 'sample-selection',
        moduleName: '样本选择策略',
        changeSummary: '先过滤噪声与离群样本，再按超边权重决定哪些样本优先生成。',
        detail: '样本是否被放大由超图结构和质量筛选共同决定，而非对所有少数类一视同仁。',
      },
      {
        key: 'generation-space',
        moduleName: '生成空间约束',
        changeSummary: '生成空间由超图拉普拉斯结构约束。',
        detail: '相比线段插值，它在结构一致性上更强，避免随意越界。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '基于超边权重分配生成数量，并按高斯分布在拉普拉斯约束下生成新样本。',
        detail: '生成过程是”先分配再采样”，不是固定次数的均匀插值。',
      },
      {
        key: 'quality-control',
        moduleName: '质量控制',
        changeSummary: '在生成前用超图建模过滤噪声和离群点。',
        detail: '把质量控制前置，减少噪声传播到合成样本。',
      },
    ],
  },
  {
    id: 'wrnd-2024',
    title: 'WRND: A weighted oversampling framework with relative neighborhood density for imbalanced noisy classification',
    year: 2024,
    authors: 'Min Li, Hao Zhou, Qun Liu, Xu Gong, Guoyin Wang',
    venue: 'Expert Systems with Applications',
    keywords: ['label noise', 'natural neighbor', 'density-aware', 'framework', 'WRND'],
    problem: 'SMOTE 类方法常依赖固定 k 近邻并随机选邻居插值，容易忽略分布差异、受噪声干扰并引入额外重叠样本；超参数 k 的选择也带来额外负担。',
    baseline: 'WRND 定位为”可叠加在多数 SMOTE 类算法上的加权框架”，而非单一替代算法。它不改变底层插值公式，而是在其上叠加两个约束：先用自然邻域自适应识别噪声，再用相对邻域密度指导生成数量与位置。可以把它看成是”自然邻域去噪 + 密度加权分配”的前处理框架。',
    innovationSummary: '提出 WRND 框架：用自然邻域自适应识别噪声，并以相对邻域密度统一指导样本生成配额与生成位置。',
    detailedNotes: [
      '先用自然邻域区分噪声点和离群点，避免它们参与合成。',
      '定义相对邻域密度，联合刻画类内和类间分布信息。',
      '不再盲目随机插值，而是按密度信息分配生成预算和位置。',
      '框架可与多种 SMOTE 变体结合，强调泛化可用性。',
      '目标是在噪声场景下提升稳健性并减小类重叠。',
    ],
    memorySummary: 'WRND 是”框架增强型”思路：自然邻域先去噪，再用相对邻域密度决定在哪里、生成多少。',
    memoryAnchors: ['先自然邻域去噪。', '再算相对邻域密度。', '密度指导数量和位置。', '可叠加到 SMOTE 变体。'],
    applicability: '适合含标签噪声、分布不均且希望在现有 SMOTE 流程上平滑增强的任务。',
    limitations: '框架效果依赖自然邻域与密度估计质量；在极端高维数据上邻域稳定性仍可能受限。',
    citation: 'Li, M., Zhou, H., Liu, Q., Gong, X., & Wang, G. (2024). WRND: A weighted oversampling framework with relative neighborhood density for imbalanced noisy classification. Expert Systems with Applications, 241, 122593.',
    links: {
      code: 'https://github.com/dream-Im/WRND_framework',
    },
    methodSteps: [
      {
        title: '步骤 1：自然邻域识别与噪声过滤',
        action: '用自然邻域方法自适应确定每个样本的邻域，并识别噪声点和离群点。',
        formulaLines: [
          String.raw`\mathrm{NaN}(x_i) = \{x_j \mid x_i \in \mathrm{kNN}(x_j)\}`,
        ],
        formulaNote: 'NaN(x_i) 是 x_i 的自然邻域：x_i 出现在哪些样本的 k 近邻中，那些样本就是它的自然邻居。邻域大小由数据自适应决定，无需手动设置 k。',
        purpose: '先把噪声点和离群点排除在生成候选之外，避免合成样本继承噪声结构。',
      },
      {
        title: '步骤 2：计算相对邻域密度',
        action: '在自然邻域内联合计算类内和类间分布信息，得到每个样本的相对邻域密度。',
        formulaLines: [
          String.raw`\rho_r(x_i) = \frac{|\mathrm{NaN}(x_i) \cap C_{\min}|}{|\mathrm{NaN}(x_i)|} \cdot \frac{1}{d(x_i, \bar{x}_{\mathrm{NaN}})}`,
        ],
        formulaNote: '分子反映邻域内少数类比例，分母反映到邻域中心的距离；密度越高说明该点处于少数类密集且结构清晰的区域。',
        purpose: '量化每个少数类样本的局部可靠性，为后续生成预算分配提供依据。',
      },
      {
        title: '步骤 3：加权分配生成预算与位置',
        action: '根据相对邻域密度为每个少数类样本分配生成数量，并指导合成位置。',
        formulaLines: [
          String.raw`n_i = \left\lfloor G \cdot \frac{\rho_r(x_i)}{\sum_j \rho_r(x_j)} \right\rfloor`,
        ],
        formulaNote: 'G 是总生成数量；密度越高的样本分配到越多的生成次数，生成位置也偏向其自然邻域内部。',
        purpose: '把生成预算集中到分布可靠的区域，减少在噪声或重叠区域盲目补样。',
      },
      {
        title: '步骤 4：调用底层 SMOTE 变体生成',
        action: '将加权分配结果传入底层 SMOTE 类算法，按指定数量和位置生成合成样本。',
        purpose: '框架本身不改变插值公式，而是通过前两步的约束让任意 SMOTE 变体都能更稳健地工作。',
      },
    ],
    modules: [
      {
        key: 'distance',
        moduleName: '邻域 / 距离定义',
        changeSummary: '以自然邻域替代固定 k 近邻作为局部关系基础。',
        detail: '通过自适应邻域减少超参数敏感性，并更稳健地刻画噪声场景中的局部结构。',
      },
      {
        key: 'sample-selection',
        moduleName: '样本选择策略',
        changeSummary: '先剔除噪声/离群样本，再对有效样本按相对邻域密度加权分配生成预算。',
        detail: '生成预算依据相对邻域密度而非均匀分配。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '在原有 SMOTE 生成机制上叠加密度加权控制。',
        detail: '它强调”框架增强”而非重写底层插值公式。',
      },
      {
        key: 'quality-control',
        moduleName: '质量控制',
        changeSummary: '自然邻域驱动的噪声过滤与重叠抑制贯穿生成流程。',
        detail: '同时控制噪声传播和越界生成，提升鲁棒性。',
      },
    ],
  },
  {
    id: 'gdo-2022',
    title: 'Gaussian Distribution Based Oversampling for Imbalanced Data Classification',
    year: 2022,
    authors: 'Yuxi Xie, Min Qiu, Haibo Zhang, Lizhi Peng, Zhenxiang Chen',
    venue: 'IEEE Transactions on Knowledge and Data Engineering',
    keywords: ['gaussian distribution', 'probabilistic anchor', 'density-aware', 'tabular', 'GDO'],
    problem: '传统重采样方法主要依据局部近邻线性插值，容易生成不必要或错误样本，且对全局分布信息利用不足，导致生成样本质量参差不齐。',
    baseline: 'GDO 本质上是在 SMOTE 类”先选起点再生成”的框架上继续改进，但重点不是再改线性插值公式本身，而是把锚点选择从随机近邻改为密度与距离联合的概率机制，并把生成方式从线性插值改为高斯分布采样。可以把它看成是”概率锚点选择 + 高斯生成”的组合改进。',
    innovationSummary: '提出 GDO：通过密度与距离联合的概率机制选择少数类锚点，并按高斯分布生成新样本。',
    detailedNotes: [
      '锚点不是均匀随机选择，而是根据密度和距离信息按概率选取。',
      '生成阶段采用高斯分布采样，弱化单一线性插值的刚性。',
      '方法兼顾局部信息与分布信息，减少无效样本生成。',
      '实验报告在 AUC、G-mean 等指标上优于多种对比方法，且内存占用更低。',
    ],
    memorySummary: 'GDO 可以记成两步：先按密度距离概率选锚点，再按高斯分布生成。',
    memoryAnchors: ['锚点概率选择。', '密度距离联合决定概率。', '高斯分布生成新样本。'],
    applicability: '适合希望降低线性插值局限、又不引入过重模型复杂度的表格不平衡任务。',
    limitations: '参数设置与高斯分布假设会影响效果；在明显非高斯结构下可能存在拟合偏差。',
    citation: 'Xie, Y., Qiu, M., Zhang, H., Peng, L., & Chen, Z. (2022). Gaussian Distribution Based Oversampling for Imbalanced Data Classification. IEEE Transactions on Knowledge and Data Engineering, 34(2), 667-679. https://doi.org/10.1109/TKDE.2020.2985965',
    links: {
      doi: 'https://doi.org/10.1109/TKDE.2020.2985965',
    },
    methodSteps: [
      {
        title: '步骤 1：概率锚点选择',
        action: '根据每个少数类样本的密度和距离信息计算被选为锚点的概率。',
        formulaLines: [
          String.raw`p_i = \frac{d(x_i, \bar{x}) \cdot \rho(x_i)}{\sum_j d(x_j, \bar{x}) \cdot \rho(x_j)}`,
        ],
        formulaNote: 'd(x_i, x̄) 是样本到少数类均值的距离，ρ(x_i) 是局部密度；距离远且密度适中的样本更可能被选为锚点。',
        purpose: '把生成起点集中到分布边缘但结构可靠的区域，而不是随机选取。',
      },
      {
        title: '步骤 2：高斯分布生成',
        action: '以选中的锚点为中心，按高斯分布生成新的少数类样本。',
        formulaLines: [
          String.raw`x_{\text{new}} \sim \mathcal{N}(x_{\text{anchor}},\, \sigma^2 \mathbf{I})`,
        ],
        formulaNote: 'σ² 由局部邻域距离自适应估计；新样本在锚点周围的高斯球内采样，而不是在两点连线上插值。',
        purpose: '让新样本在锚点附近的合理区域内分布，而不是被限制在线段上。',
      },
    ],
    modules: [
      {
        key: 'sample-selection',
        moduleName: '样本选择策略',
        changeSummary: '通过密度与距离信息进行概率锚点选择。',
        detail: '不同少数类样本被选为生成起点的概率不同，边缘且密度适中的样本优先。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '由高斯分布采样生成新样本，替代线性插值。',
        detail: '生成方向不再被限制在两点连线上，提升分布灵活性。',
      },
      {
        key: 'generation-space',
        moduleName: '生成空间约束',
        changeSummary: '生成空间由锚点周围的高斯概率轮廓约束。',
        detail: '通过分布建模减少明显不合理区域的生成。',
      },
    ],
  },
  {
    id: 'knnor-2022',
    title: 'KNNOR: An oversampling technique for imbalanced datasets',
    year: 2022,
    authors: 'Ashhadul Islam, Samir Brahim Belhaouari, Atiq Ur Rehman, Halima Bensmail',
    venue: 'Applied Soft Computing',
    keywords: ['KNNOR', 'relative density', 'small disjunct', 'noise-resilient', 'tabular'],
    problem: 'SMOTE/ADASYN 在类内不平衡与 small disjunct 场景下表现不稳，且容易在不安全区域生成样本；它们不考虑少数类相对于整体分布的位置与紧致度。',
    baseline: 'KNNOR 在近邻过采样范式上继续改进，不仅考虑最近邻关系，还显式考虑少数类位置、紧致度和与其他类的相对关系。它通过三阶段流程先识别关键与安全区域，再结合整体相对密度生成样本，而不是直接近邻插值。',
    innovationSummary: '提出 KNNOR：通过三阶段流程识别关键与安全增强区域，并结合整体相对密度更稳健地生成少数类样本。',
    detailedNotes: [
      '方法强调先识别可安全增强区域，再执行样本生成。',
      '把少数类相对位置与紧致度纳入生成决策，缓解 small disjunct。',
      '生成过程考虑整体相对密度，减少噪声诱导的错误扩增。',
      '三阶段：识别关键区域 → 识别安全区域 → 按相对密度生成。',
      '实验中在多个数据集上较稳定地优于多种过采样方法。',
    ],
    memorySummary: 'KNNOR 的关键是先判”哪里安全可补”，再结合相对密度生成，而不是直接近邻插值。',
    memoryAnchors: ['先划分关键/安全区域。', '考虑位置和紧致度。', '结合相对密度生成。'],
    applicability: '适合存在类内结构不均、簇规模差异明显或含噪的表格不平衡分类问题。',
    limitations: '性能依赖邻域结构估计；在特征空间极稀疏或高维场景下可能需要更谨慎参数设置。',
    citation: 'Islam, A., Belhaouari, S. B., Rehman, A. U., & Bensmail, H. (2022). KNNOR: An oversampling technique for imbalanced datasets. Applied Soft Computing, 115, 108288. https://doi.org/10.1016/j.asoc.2021.108288',
    links: {
      doi: 'https://doi.org/10.1016/j.asoc.2021.108288',
    },
    methodSteps: [
      {
        title: '步骤 1：识别关键区域',
        action: '计算每个少数类样本与多数类样本的相对位置，识别处于关键（边界）区域的少数类样本。',
        formulaLines: [
          String.raw`\text{critical}(x_i) = \frac{|\mathrm{kNN}(x_i) \cap C_{\text{maj}}|}{k} > \theta`,
        ],
        formulaNote: '若少数类样本的 k 近邻中多数类比例超过阈值 θ，则判定为关键样本；这些样本处于决策边界附近。',
        purpose: '先找出最需要被增强的边界少数类样本。',
      },
      {
        title: '步骤 2：识别安全区域',
        action: '在关键样本中进一步筛选出处于安全区域的样本，排除噪声点。',
        formulaLines: [
          String.raw`\text{safe}(x_i) = \text{critical}(x_i) \;\wedge\; \rho_r(x_i) > \delta`,
        ],
        formulaNote: 'ρ_r(x_i) 是相对密度，δ 是安全阈值；只有密度足够高的关键样本才被认为是安全可增强的。',
        purpose: '避免在噪声点或孤立点附近生成样本，提升生成质量。',
      },
      {
        title: '步骤 3：按相对密度生成样本',
        action: '对安全区域内的少数类样本，按相对密度分配生成数量并插值生成新样本。',
        formulaLines: [
          String.raw`x_{\text{new}} = x_i + \lambda (x_j - x_i), \quad \lambda \sim U(0,1)`,
          String.raw`n_i \propto \rho_r(x_i)`,
        ],
        formulaNote: '生成公式与 SMOTE 类似，但生成数量 n_i 由相对密度决定；密度越高的安全样本生成越多。',
        purpose: '在安全区域内按密度比例补样，兼顾边界增强与噪声鲁棒性。',
      },
    ],
    modules: [
      {
        key: 'sample-selection',
        moduleName: '样本选择策略',
        changeSummary: '先识别关键与安全区域，再确定生成候选样本。',
        detail: '样本选择由区域安全性驱动，而不是均匀对待所有少数类点。',
      },
      {
        key: 'generation-space',
        moduleName: '生成空间约束',
        changeSummary: '在判定为安全的局部区域内生成样本。',
        detail: '通过空间约束减少越界和噪声传播风险。',
      },
      {
        key: 'quality-control',
        moduleName: '质量控制',
        changeSummary: '利用相对密度与区域判定增强噪声鲁棒性。',
        detail: '核心目的是避免在不可靠区域盲目补样。',
      },
    ],
  },
  {
    id: 'symprod-2020',
    title: 'A Synthetic Minority Based on Probabilistic Distribution (SyMProD) Oversampling for Imbalanced Datasets',
    year: 2020,
    authors: 'Intouch Kunakorntum, Woranich Hinthong, Phond Phunchongharn',
    venue: 'IEEE Access',
    keywords: ['probabilistic distribution', 'noise removal', 'z-score', 'tabular', 'SyMProD'],
    problem: '多种过采样方法缺少对目标分布的显式建模，容易带来类重叠、噪声生成与过度泛化；同时未对数据做标准化预处理，导致生成样本受量纲影响。',
    baseline: 'SyMProD 本质上是在 SMOTE 类”先选点再插值”的框架上继续改进，但重点不是再改插值公式本身，而是把样本选择从几何近邻改为概率分布驱动，并把归一化和去噪前置到生成前。可以把它看成是”Z-score 标准化 + 去噪 + 概率分布选点 + 近邻插值”的组合改进。',
    innovationSummary: '提出 SyMProD：先做 Z-score 标准化与去噪，再基于两类概率分布选择少数类样本并生成新实例。',
    detailedNotes: [
      '先标准化并清理噪声，减少后续生成被异常值牵引。',
      '样本选择依据多数类和少数类的概率分布，而非仅靠几何近邻。',
      '生成目标是覆盖少数类分布，同时降低重叠与过泛化。',
      '属于”分布先行”的过采样思路，把分布建模前置到选点阶段。',
    ],
    memorySummary: 'SyMProD 主线：先 Z-score 标准化去噪，再按两类概率分布选点，最后近邻插值生成。',
    memoryAnchors: ['先 Z-score。', '先去噪。', '按两类分布选点。', '减少重叠和过泛化。'],
    applicability: '适合对噪声敏感、且希望显式利用类分布信息来指导过采样的任务。',
    limitations: '依赖分布估计与预处理质量；若分布刻画不准，生成优势会减弱。',
    citation: 'Kunakorntum, I., Hinthong, W., & Phunchongharn, P. (2020). A Synthetic Minority Based on Probabilistic Distribution (SyMProD) Oversampling for Imbalanced Datasets. IEEE Access, 8, 118848-118863. https://doi.org/10.1109/ACCESS.2020.3003346',
    links: {
      doi: 'https://doi.org/10.1109/ACCESS.2020.3003346',
    },
    methodSteps: [
      {
        title: '步骤 1：Z-score 标准化与噪声清理',
        action: '对所有特征做 Z-score 标准化，再移除噪声样本。',
        formulaLines: [
          String.raw`z = \frac{x - \mu}{\sigma}`,
        ],
        formulaNote: 'μ 和 σ 分别是特征均值和标准差；标准化后再用统计方法识别并移除离群噪声点。',
        purpose: '消除量纲影响并清除噪声，让后续分布建模更准确。',
      },
      {
        title: '步骤 2：基于概率分布选择少数类样本',
        action: '根据少数类和多数类的概率分布，为每个少数类样本计算被选为生成起点的概率。',
        formulaLines: [
          String.raw`p_i \propto P_{\min}(x_i) \cdot (1 - P_{\text{maj}}(x_i))`,
        ],
        formulaNote: 'P_min(x_i) 是 x_i 在少数类分布下的概率，P_maj(x_i) 是在多数类分布下的概率；少数类概率高且多数类概率低的样本优先被选。',
        purpose: '把生成起点集中到少数类分布核心区域，同时远离多数类重叠区。',
      },
      {
        title: '步骤 3：近邻插值生成',
        action: '对选中的少数类样本，在其少数类近邻之间插值生成新样本。',
        formulaLines: [
          String.raw`x_{\text{new}} = x_i + \lambda (x_j - x_i), \quad \lambda \sim U(0,1)`,
        ],
        formulaNote: 'x_j 是 x_i 的少数类近邻，λ 是随机插值系数；生成公式与 SMOTE 类似，但起点由概率分布决定。',
        purpose: '在分布合理的区域内生成新样本，覆盖少数类分布并减少重叠。',
      },
    ],
    modules: [
      {
        key: 'sample-selection',
        moduleName: '样本选择策略',
        changeSummary: '根据两类概率分布选择更合适的少数类生成起点。',
        detail: '不再只由局部近邻决定哪些点被放大，而是由分布概率驱动。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '在分布约束下与少数类邻居插值生成新样本。',
        detail: '强调覆盖少数类分布而非单纯补数量。',
      },
      {
        key: 'quality-control',
        moduleName: '质量控制',
        changeSummary: '在生成前执行 Z-score 标准化与噪声清理。',
        detail: '通过前置预处理降低噪声传播与过度泛化。',
      },
    ],
  },
  {
    id: 'smote-rsb-2011',
    title: 'SMOTE-RSB: a hybrid preprocessing approach based on oversampling and undersampling for high imbalanced data-sets using SMOTE and rough sets theory',
    year: 2011,
    authors: 'Enislay Ramentol, Yail Caballero, Rafael Bello, Francisco Herrera',
    venue: 'Knowledge and Information Systems',
    keywords: ['hybrid sampling', 'rough set theory', 'SMOTE', 'editing', 'SMOTE-RSB'],
    problem: '在高不平衡数据中，单独过采样容易引入噪声样本并加剧边界混乱，单独欠采样又可能丢失重要多数类信息；两者单独使用都难以同时解决高不平衡与边界噪声问题。',
    baseline: 'SMOTE-RSB 本质上是在 SMOTE 过采样框架上叠加粗糙集编辑步骤，而非单纯改进生成机制。它不改变 SMOTE 的插值公式，而是在生成后用粗糙集下近似对样本集做编辑清理。可以把它看成是”SMOTE 过采样 + 粗糙集编辑欠采样”的混合预处理流程。',
    innovationSummary: '提出 SMOTE-RSB：先用 SMOTE 扩增少数类，再用粗糙集下近似进行编辑清理，实现混合重采样。',
    detailedNotes: [
      '方法定位为混合预处理，不是纯过采样。',
      '先补齐少数类，再通过粗糙集编辑去掉不可靠样本。',
      '粗糙集下近似保留分类确定性高的样本，去除边界模糊样本。',
      '重点在于降低高不平衡场景下的噪声和边界混乱。',
      '数据层方案与分类器解耦，可复用到不同学习器。',
    ],
    memorySummary: 'SMOTE-RSB 就是”先 SMOTE 增样，再用粗糙集下近似编辑清理”。',
    memoryAnchors: ['先过采样。', '再粗糙集编辑。', '下近似保留确定性高的样本。', '混合采样抑制噪声。'],
    applicability: '适合高不平衡场景，尤其是希望兼顾少数类补样与边界清理时。',
    limitations: '多阶段流程带来额外计算与参数选择成本；不同数据上编辑强度需平衡。',
    citation: 'Ramentol, E., Caballero, Y., Bello, R., & Herrera, F. (2011). SMOTE-RSB: a hybrid preprocessing approach based on oversampling and undersampling for high imbalanced data-sets using SMOTE and rough sets theory. Knowledge and Information Systems. https://doi.org/10.1007/s10115-011-0465-6',
    links: {
      doi: 'https://doi.org/10.1007/s10115-011-0465-6',
    },
    methodSteps: [
      {
        title: '步骤 1：SMOTE 过采样',
        action: '用 SMOTE 对少数类样本进行插值过采样，使类别分布趋于平衡。',
        formulaLines: [
          String.raw`x_{\text{new}} = x_i + \lambda (x_j - x_i), \quad \lambda \sim U(0,1)`,
        ],
        formulaNote: 'x_j 是 x_i 的少数类近邻；生成公式与标准 SMOTE 相同，此步骤不做改动。',
        purpose: '先补足少数类数量，为后续编辑提供足够的样本基础。',
      },
      {
        title: '步骤 2：粗糙集下近似计算',
        action: '用粗糙集理论计算训练集的下近似，识别分类确定性高的样本。',
        formulaLines: [
          String.raw`\underline{R}(C) = \{x \mid [x]_R \subseteq C\}`,
        ],
        formulaNote: '[x]_R 是样本 x 在等价关系 R 下的等价类；若等价类完全包含在类别 C 中，则 x 属于下近似，即分类确定性高。',
        purpose: '找出分类边界清晰、不含歧义的样本子集。',
      },
      {
        title: '步骤 3：编辑清理',
        action: '保留下近似中的样本，移除边界模糊或不可靠的样本。',
        formulaLines: [
          String.raw`S_{\text{clean}} = \underline{R}(C_{\min}) \cup \underline{R}(C_{\text{maj}})`,
        ],
        formulaNote: '对少数类和多数类分别计算下近似，取并集作为清理后的训练集；边界模糊样本被自然排除。',
        purpose: '减少噪声和边界混乱样本，提升分类器在高不平衡场景下的鲁棒性。',
      },
    ],
    modules: [
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '沿用 SMOTE 机制先生成少数类样本。',
        detail: '生成阶段本身并非主要创新点，重点在于后续编辑步骤。',
      },
      {
        key: 'quality-control',
        moduleName: '质量控制',
        changeSummary: '用粗糙集下近似编辑步骤清理不可靠样本。',
        detail: '通过下近似相关思想减少噪声与边界模糊样本。',
      },
      {
        key: 'task-coupling',
        moduleName: '任务耦合',
        changeSummary: '以分类性能为目标做预处理级联合优化。',
        detail: '虽然不与分类器联训，但流程是围绕下游分类鲁棒性设计。',
      },
    ],
  },
  {
    id: 'smomccs-2026',
    title: 'SMOMCCS: Minimum compact coverage oversampling approach for imbalanced data classification',
    year: 2026,
    authors: 'Leifu Gao, Mengyao Zhang, Shijie Zhao',
    venue: 'Expert Systems with Applications',
    keywords: ['compact coverage sphere', 'natural neighbor', 'geometric integrity', 'overlap control', 'SMOMCCS'],
    problem: '常见 SMOTE 变体在 small disjunct 与类重叠下容易破坏少数类子簇几何完整性，并引入边界噪声，导致生成样本偏离真实少数类子空间。',
    baseline: 'SMOMCCS 本质上是在"几何子空间约束生成"思路上推进：先识别少数类子簇，再构建覆盖球并优化半径约束，不再依赖简单线段插值。可以把它看成是"子簇识别 + 覆盖球半径优化 + 角度约束生成"的组合改进。SMOMCCS-NaN 进一步叠加自然邻域去噪。',
    innovationSummary: '提出 SMOMCCS：通过密度驱动子簇识别与最小紧凑覆盖球半径优化，在受角度相似性约束的子空间内生成样本。',
    detailedNotes: [
      '先用自适应核密度识别少数类子簇。',
      '为子簇构建紧凑覆盖球，并通过 Coverage Factor 优化半径。',
      '在子空间内按角度相似性控制合成，保持几何一致性。',
      'SMOMCCS-NaN 版本引入无参数自然邻域做噪声过滤。',
      '目标是同时改善类重叠与小簇结构破坏问题。',
    ],
    memorySummary: 'SMOMCCS 主线：先找子簇，再建并优化覆盖球，最后在球内按角度约束生成。',
    memoryAnchors: ['先密度识别子簇。', '覆盖球半径要优化。', '角度相似性控制生成。', 'NaN 版本加自然邻域去噪。'],
    applicability: '适合少数类呈多子簇结构且类重叠明显的复杂不平衡分类任务。',
    limitations: '流程较复杂，涉及密度估计与覆盖因子优化；在极高维场景可能增加计算负担。',
    citation: 'Gao, L., Zhang, M., & Zhao, S. (2026). SMOMCCS: Minimum compact coverage oversampling approach for imbalanced data classification. Expert Systems with Applications, 296, 128918.',
    links: {},
    methodSteps: [
      {
        title: '步骤 1：自适应核密度识别少数类子簇',
        action: '对少数类样本做核密度估计，并按密度峰值划分少数类子簇。',
        formulaLines: [
          String.raw`\hat{f}(x)=\frac{1}{nh^d}\sum_{i=1}^{n}K\!\left(\frac{x-x_i}{h}\right)`,
        ],
        formulaNote: 'h 是带宽，K 是核函数；通过密度峰和谷识别子簇边界。',
        purpose: '先恢复少数类的真实子簇结构，避免把不同子簇混在一起生成。',
      },
      {
        title: '步骤 2：构建最小紧凑覆盖球并优化半径',
        action: '为每个子簇构建紧凑覆盖球，并通过 Coverage Factor 约束优化球半径。',
        formulaLines: [
          String.raw`B_k=\{x\mid \|x-c_k\|\le r_k\}`,
          String.raw`r_k^{*}=\arg\min_{r_k}\;\mathrm{CF}(B_k,r_k)`,
        ],
        formulaNote: 'c_k 是子簇中心，r_k 是覆盖球半径；CF 同时平衡覆盖充分性与紧凑性。',
        purpose: '让生成空间既覆盖子簇有效区域，又避免球体过大导致越界。',
      },
      {
        title: '步骤 3：角度相似性约束生成',
        action: '在覆盖球内部按角度相似性约束合成新样本。',
        formulaLines: [
          String.raw`\cos\theta = \frac{(x_i-c_k)^T(x_j-c_k)}{\|x_i-c_k\|\,\|x_j-c_k\|}`,
          String.raw`x_{\text{new}} = x_i + \lambda (x_j-x_i),\; \cos\theta \ge \tau`,
        ],
        formulaNote: '只有角度相似性达到阈值 τ 的样本对才参与生成，避免方向突变。',
        purpose: '保持生成方向与子簇几何方向一致，减少结构扭曲。',
      },
      {
        title: '步骤 4：SMOMCCS-NaN 去噪（可选）',
        action: '在 SMOMCCS 基础上，使用无参数自然邻域过滤噪声样本。',
        formulaLines: [
          String.raw`\mathrm{NaN}(x_i)=\{x_j\mid x_i \in \mathrm{kNN}(x_j)\}`,
        ],
        formulaNote: '通过邻域标签一致性识别噪声点，NaN 版本无需人工调参。',
        purpose: '进一步锐化类别边界，减少噪声对生成空间的污染。',
      },
    ],
    modules: [
      {
        key: 'sample-selection',
        moduleName: '样本选择策略',
        changeSummary: '通过自适应核密度先识别少数类子簇后再分配生成。',
        detail: '以子簇为单位组织生成，避免逐点独立处理。',
      },
      {
        key: 'generation-space',
        moduleName: '生成空间约束',
        changeSummary: '在最小紧凑覆盖球子空间内生成样本。',
        detail: '覆盖球半径由 Coverage Factor 优化，强调几何完整性。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '在受角度相似性约束的子空间内合成新样本。',
        detail: '相比线性插值更强调局部方向一致性。',
      },
      {
        key: 'quality-control',
        moduleName: '质量控制',
        changeSummary: 'SMOMCCS-NaN 通过无参数自然邻域过滤噪声。',
        detail: '利用邻域标签一致性进一步锐化类别边界。',
      },
    ],
  },
  {
    id: 'mdo-2016',
    title: 'To Combat Multi-Class Imbalanced Problems by Means of Over-Sampling Techniques',
    year: 2016,
    authors: 'Lida Abdi, Sattar Hashemi',
    venue: 'IEEE Transactions on Knowledge and Data Engineering',
    keywords: ['multi-class imbalance', 'Mahalanobis distance', 'MDO', 'covariance-preserving'],
    problem: '多分类不平衡场景中，常规过采样容易忽略类别协方差结构，导致过拟合、过泛化或类间重叠加剧。',
    baseline: 'MDO 本质上是在 SMOTE 类插值框架上继续改进，但重点不是再改近邻线段插值，而是把生成约束改为马氏距离概率等高线。它通过保持少数类样本到类均值的马氏距离层级来保留协方差结构。可以把它看成是"马氏距离建模 + 协方差保持生成"的改进。',
    innovationSummary: '提出 MDO：生成与目标类均值保持相同马氏距离层级的新样本，以保持少数类协方差结构并降低多类重叠风险。',
    detailedNotes: [
      '核心对象是多分类不平衡，而不仅是二分类。',
      '生成位置参考马氏距离等值轮廓，保留类内协方差形状。',
      '强调在提升少数类识别的同时减少类间重叠。',
      '论文报告在 MAUC 与 precision 上优于多种对比过采样方法。',
    ],
    memorySummary: 'MDO 的关键是“按马氏距离等高线补样”，而不是简单近邻插值。',
    memoryAnchors: ['面向多分类不平衡。', '保留协方差结构。', '按马氏距离轮廓生成。'],
    applicability: '适合多分类不平衡且类间重叠敏感的表格分类任务。',
    limitations: '依赖协方差估计稳定性；当类别样本很少或分布非椭球时效果可能受限。',
    citation: 'Abdi, L., & Hashemi, S. (2016). To Combat Multi-Class Imbalanced Problems by Means of Over-Sampling Techniques. IEEE Transactions on Knowledge and Data Engineering, 28(1), 238-251.',
    links: {},
    methodSteps: [
      {
        title: '步骤 1：估计少数类均值与协方差',
        action: '对目标少数类估计均值向量和协方差矩阵。',
        formulaLines: [
          String.raw`\mu_c = \frac{1}{n_c}\sum_{i=1}^{n_c} x_i`,
          String.raw`\Sigma_c = \frac{1}{n_c-1}\sum_{i=1}^{n_c}(x_i-\mu_c)(x_i-\mu_c)^T`,
        ],
        formulaNote: 'μ_c 和 Σ_c 分别描述该少数类的中心与形状。',
        purpose: '为马氏距离建模和等高线生成提供统计基础。',
      },
      {
        title: '步骤 2：计算样本马氏距离层级',
        action: '计算每个少数类样本到类均值的马氏距离，形成距离层级。',
        formulaLines: [
          String.raw`d_M(x_i,\mu_c)=\sqrt{(x_i-\mu_c)^T\Sigma_c^{-1}(x_i-\mu_c)}`,
        ],
        formulaNote: '马氏距离显式考虑协方差，可反映椭球分布结构而非球形欧氏结构。',
        purpose: '确定生成样本应落在哪个概率等高线层级上。',
      },
      {
        title: '步骤 3：在等高线上采样生成',
        action: '生成与现有少数类样本保持相同马氏距离层级的新样本。',
        formulaLines: [
          String.raw`\{x_{\text{new}}\mid (x_{\text{new}}-\mu_c)^T\Sigma_c^{-1}(x_{\text{new}}-\mu_c)=d_M(x_i,\mu_c)^2\}`,
        ],
        formulaNote: '新样本被约束在与原样本同层的马氏距离等值面上，从而保持类别协方差结构。',
        purpose: '在补样的同时维持类内形状一致性，减少多类重叠风险。',
      },
    ],
    modules: [
      {
        key: 'distance',
        moduleName: '邻域 / 距离定义',
        changeSummary: '以马氏距离替代普通欧氏近邻度量。',
        detail: '显式把类内协方差结构纳入距离计算。',
      },
      {
        key: 'generation-space',
        moduleName: '生成空间约束',
        changeSummary: '在马氏距离等值轮廓上生成新样本。',
        detail: '使新样本更贴合目标类分布形状，减少随机越界。',
      },
      {
        key: 'generation-mechanism',
        moduleName: '生成机制',
        changeSummary: '基于概率轮廓而非纯线段插值生成。',
        detail: '重点是分布保持与多类边界控制。',
      },
    ],
  },
];
