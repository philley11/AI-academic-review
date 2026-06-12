/* ARGP Demo — 学生「我的项目」Mock 数据 */
(function () {
  var STATUS = {
    draft:     { badge: 'b-draft',     label: '草稿',   cls: 'st-draft' },
    guidance:  { badge: 'b-guidance',  label: '指导中', cls: 'st-guidance' },
    submitted: { badge: 'b-submitted', label: '已提交', cls: 'st-submitted' },
    review:    { badge: 'b-review',    label: '已评审', cls: 'st-review' },
    defense:   { badge: 'b-defense',   label: '已答辩', cls: 'st-defense' },
    pub:       { badge: 'b-pub',       label: '已公示', cls: 'st-pub' },
    archived:  { badge: 'b-pub',       label: '已公示', cls: 'st-pub' }
  };

  var PRE_GUIDANCE = { draft: 1, submitted: 1 };

  var STUDENT_PROJECTS = [
    {
      id: 'PROJ-2025-0087',
      title: '强化学习在机器人路径规划中的应用研究',
      mentor: '张明远 教授',
      status: 'guidance',
      stage: '导师审阅',
      aiScore: 82,
      updated: '2025-03-14',
      hasAiReport: true,
      showOnHome: true
    },
    {
      id: 'PROJ-2025-0063',
      title: '基于Transformer的中文医学文本理解',
      mentor: '刘教授',
      status: 'review',
      stage: '专家评审',
      aiScore: 91,
      updated: '2025-03-10',
      hasAiReport: true,
      showOnHome: true
    },
    {
      id: 'PROJ-2025-0045',
      title: '联邦学习框架下的数据隐私保护',
      mentor: '王教授',
      status: 'defense',
      stage: '答辩',
      aiScore: 88,
      updated: '2025-03-08',
      hasAiReport: true,
      showOnHome: true
    },
    {
      id: 'PROJ-2025-0029',
      title: '量子计算在密码学中的应用探索',
      mentor: '张教授',
      status: 'pub',
      stage: '公示',
      aiScore: 93,
      updated: '2025-03-01',
      hasAiReport: true,
      showOnHome: true
    },
    {
      id: 'PROJ-2025-0091',
      title: '知识图谱驱动的科研文献推荐系统',
      mentor: '张明远 教授',
      status: 'draft',
      stage: '撰写中',
      aiScore: null,
      updated: '2025-03-16',
      hasAiReport: false,
      showOnHome: false
    },
    {
      id: 'PROJ-2025-0110',
      title: '边缘计算下的物联网安全协议研究',
      mentor: '王教授',
      status: 'submitted',
      stage: '待导师审核',
      aiScore: 78,
      updated: '2025-03-15',
      hasAiReport: true,
      showOnHome: false
    },
    {
      id: 'PROJ-2024-0198',
      title: '深度学习图像分割新方法研究',
      mentor: '张教授',
      status: 'archived',
      stage: '已归档',
      aiScore: 89,
      updated: '2024-12-20',
      hasAiReport: true,
      showOnHome: false
    }
  ];

  function scoreClass(score) {
    if (score == null) return 'text-muted';
    if (score >= 85) return 'text-green';
    if (score >= 70) return 'text-warn';
    return 'text-danger';
  }

  function scoreBarColor(score) {
    if (score == null) return '#d1d5db';
    if (score >= 85) return '#059669';
    if (score >= 70) return '#b45309';
    return '#dc2626';
  }

  function isPreGuidance(p) {
    return !!(PRE_GUIDANCE[p.status]);
  }

  function canStudentEdit(p) {
    return p.status === 'draft';
  }

  function canShowAiReport(p) {
    return isPreGuidance(p) && p.hasAiReport;
  }

  var _currentDetailId = 'PROJ-2025-0087';

  function getProjectById(id) {
    for (var i = 0; i < STUDENT_PROJECTS.length; i++) {
      if (STUDENT_PROJECTS[i].id === id) return STUDENT_PROJECTS[i];
    }
    return null;
  }

  function openProjectDetail(projId) {
    if (projId) _currentDetailId = projId;
    if (window.ARGP_AI && window.ARGP_AI.setCurrentProjId) {
      window.ARGP_AI.setCurrentProjId(_currentDetailId);
    }
    if (typeof window.showPage === 'function') {
      window.showPage('proj-detail');
    }
  }

  function applyProjDetailView() {
    var p = getProjectById(_currentDetailId) || STUDENT_PROJECTS[0];
    if (!p) return;
    _currentDetailId = p.id;
    var st = STATUS[p.status] || STATUS.draft;
    var pre = isPreGuidance(p);
    var showAi = !!p.hasAiReport;

    var title = document.getElementById('proj-detail-title');
    var idEl = document.getElementById('proj-detail-id');
    var statusEl = document.getElementById('proj-detail-status');
    var aiBanner = document.getElementById('proj-detail-ai-banner');
    var guidanceNote = document.getElementById('proj-detail-guidance-note');
    var btnEdit = document.getElementById('proj-detail-btn-edit');
    var btnAi = document.getElementById('proj-detail-btn-ai');
    var aiScore = document.getElementById('proj-detail-ai-score');

    if (title) title.textContent = p.title;
    if (idEl) idEl.textContent = p.id;
    if (statusEl) {
      statusEl.textContent = st.label;
      statusEl.className = 'my-proj-status ' + st.cls;
    }
    if (aiScore && p.aiScore != null) aiScore.textContent = p.aiScore;

    if (aiBanner) {
      aiBanner.classList.toggle('role-hidden', !showAi);
      if (showAi) {
        var bannerStrong = aiBanner.querySelector('strong');
        if (bannerStrong) {
          bannerStrong.textContent = pre ? 'AI 质量自检（提交导师前）' : 'AI 质量自检（历史报告）';
        }
      }
    }
    if (guidanceNote) guidanceNote.classList.toggle('role-hidden', pre);
    if (btnEdit) btnEdit.classList.toggle('role-hidden', !canStudentEdit(p));
    if (btnAi) btnAi.classList.toggle('role-hidden', !showAi);

    if (window.ARGP_MOCK.closeVersionDetail) closeVersionDetail();
    renderVersionList();
  }

  function renderMyProjCard(p) {
    var st = STATUS[p.status] || STATUS.draft;
    return '<div class="my-proj-card" role="button" tabindex="0" data-proj-id="' + p.id + '" onclick="ARGP_MOCK.openProjectDetail(\'' + p.id + '\')">' +
      '<div class="my-proj-card-main">' +
        '<div class="my-proj-card-title">' + p.title + '</div>' +
        '<div class="my-proj-card-meta"><span class="mono">' + p.id + '</span><span>' + p.updated + '</span></div>' +
      '</div>' +
      '<span class="my-proj-status ' + st.cls + '">' + st.label + '</span>' +
    '</div>';
  }

  function renderSummaryItem(p) {
    var st = STATUS[p.status] || STATUS.draft;
    return '<div class="my-proj-card my-proj-card-compact" role="button" tabindex="0" onclick="ARGP_MOCK.openProjectDetail(\'' + p.id + '\')">' +
      '<div class="my-proj-card-main">' +
        '<div class="my-proj-card-title">' + p.title + '</div>' +
        '<div class="my-proj-card-meta mono">' + p.id + '</div>' +
      '</div>' +
      '<span class="my-proj-status ' + st.cls + '">' + st.label + '</span>' +
    '</div>';
  }

  function renderMyProjList() {
    var el = document.getElementById('my-proj-list');
    if (!el) return;
    var sorted = STUDENT_PROJECTS.slice().sort(function (a, b) {
      return b.updated.localeCompare(a.updated);
    });
    el.innerHTML = sorted.map(renderMyProjCard).join('');
  }

  function renderStudentProjectSummary() {
    var el = document.getElementById('home-my-proj-list');
    if (!el) return;
    var items = STUDENT_PROJECTS.filter(function (p) { return p.showOnHome; });
    el.innerHTML = items.map(renderSummaryItem).join('');
  }

  function updateMyProjMeta() {
    var sub = document.getElementById('my-proj-sub');
    var user = window.ARGP_AUTH && window.ARGP_AUTH.getUser();
    var name = user ? user.name : '李同学';
    if (sub) sub.textContent = name + ' · 共 ' + STUDENT_PROJECTS.length + ' 项';
  }

  function countByStatus() {
    var counts = {};
    STUDENT_PROJECTS.forEach(function (p) {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }

  function renderStudentHomeBoard() {
    var counts = countByStatus();
    var activeStatuses = ['draft', 'guidance', 'submitted', 'review', 'defense'];
    var activeTotal = 0;
    activeStatuses.forEach(function (s) {
      activeTotal += counts[s] || 0;
    });
    var activeEl = document.getElementById('home-active-count');
    var hintEl = document.getElementById('home-active-hint');
    if (activeEl) activeEl.textContent = String(activeTotal);
    if (hintEl) {
      var parts = [];
      if (counts.guidance) parts.push('指导中 ' + counts.guidance);
      if (counts.submitted) parts.push('待审核 ' + counts.submitted);
      if (counts.review) parts.push('评审 ' + counts.review);
      if (counts.defense) parts.push('答辩 ' + counts.defense);
      if (counts.draft) parts.push('草稿 ' + counts.draft);
      hintEl.textContent = parts.length ? parts.join(' · ') : '暂无进行中项目';
    }
    var boardEl = document.getElementById('home-stage-board-body');
    if (!boardEl) return;
    var chips = [
      { status: 'draft', hint: '撰写与自检' },
      { status: 'submitted', hint: '待导师审核' },
      { status: 'guidance', hint: '导师指导中' },
      { status: 'review', hint: '专家评审' },
      { status: 'defense', hint: '答辩环节' },
      { status: 'pub', hint: '已立项公示' }
    ];
    boardEl.innerHTML = chips.map(function (c) {
      var st = STATUS[c.status] || STATUS.draft;
      var n = counts[c.status] || 0;
      if (c.status === 'pub') n += counts.archived || 0;
      return '<button type="button" class="stage-chip" onclick="showPage(\'my-proj\')">' +
        '<span class="stage-chip-num">' + n + '</span>' +
        '<span class="stage-chip-lbl">' + st.label + '</span>' +
        '<span class="stage-chip-hint">' + c.hint + '</span>' +
      '</button>';
    }).join('');
  }

  function initStudentProjects() {
    renderStudentProjectSummary();
    renderMyProjList();
    updateMyProjMeta();
    renderStudentHomeBoard();
  }

  function getCurrentDetailId() {
    return _currentDetailId;
  }

  var VERSION_HISTORY = {
    'PROJ-2025-0087': [
      {
        id: 'v3',
        current: true,
        locked: true,
        note: '修复逻辑矛盾问题，更新第三章假设表述',
        meta: '2025-03-14 09:45 · 李明',
        title: '申请书正文 · v3',
        content:
          '<h3>一、研究背景与意义</h3>' +
          '<p>近年来，随着深度强化学习技术的快速发展，智能机器人在复杂动态环境中的自主导航能力得到了显著提升。<span class="hl-yellow">传统路径规划算法在静态已知地图上表现良好，但在动态障碍物频繁出现的真实场景中存在明显局限性（路径重规划延迟平均 &gt; 200ms）</span>。</p>' +
          '<div class="annotation a-blue">导师批注：定量数据已补充，表述改善</div>' +
          '<h3>二、研究目标与内容</h3>' +
          '<p>本项目研究目标为：（1）构建基于近端策略优化（PPO）的机器人路径规划框架；（2）设计融合环境感知的奖励函数体系；（3）在ROS仿真环境及真实机器人平台上验证方法有效性。</p>' +
          '<h3>三、研究假设</h3>' +
          '<p><span class="hl-yellow">H2：现有深度强化学习方法在高度动态障碍环境下避障成功率不足 70%</span>，需要本研究提出的新型课程学习策略加以改进。</p>' +
          '<div class="annotation">AI检测：逻辑一致性已改善，与绪论立场统一</div>' +
          '<h3>四、创新点</h3>' +
          '<p>创新点：提出多目标奖励函数动态平衡机制；设计课程学习驱动的分阶段训练策略。预期成果：发表EI/SCI论文1篇；开源路径规划工具包。</p>'
      },
      {
        id: 'v2',
        current: false,
        locked: false,
        note: '补充创新点说明，修改参考文献格式',
        meta: '2025-03-12 16:20 · 李明',
        title: '申请书正文 · v2',
        content:
          '<h3>一、研究背景与意义</h3>' +
          '<p>近年来，随着深度强化学习技术的快速发展，智能机器人在复杂动态环境中的自主导航能力得到了显著提升。传统路径规划算法在静态已知地图上表现良好，但在动态障碍物频繁出现的真实场景中存在明显局限性。</p>' +
          '<h3>二、研究目标与内容</h3>' +
          '<p>构建 PPO 路径规划框架；设计奖励函数体系；ROS 仿真验证。</p>' +
          '<h3>三、研究假设</h3>' +
          '<p><span class="hl-red">H2：现有深度强化学习方法无法有效处理动态障碍物避障问题</span>（与绪论表述矛盾，v3 已修订）</p>' +
          '<h3>四、创新点</h3>' +
          '<p>多目标奖励函数；课程学习训练策略。（本版补充了创新点详细描述）</p>'
      },
      {
        id: 'v1',
        current: false,
        locked: false,
        note: '初稿提交',
        meta: '2025-03-10 11:00 · 李明',
        title: '申请书正文 · v1',
        content:
          '<h3>一、研究背景与意义</h3>' +
          '<p>深度强化学习在机器人路径规划领域应用广泛，现有方法表现优秀。</p>' +
          '<h3>二、研究目标与内容</h3>' +
          '<p>构建强化学习路径规划系统。（初稿，内容较简略）</p>' +
          '<h3>三、研究假设</h3>' +
          '<p>H2：现有方法无法处理动态障碍物。</p>' +
          '<h3>四、创新点</h3>' +
          '<p>（待补充）</p>'
      }
    ]
  };

  var SAMPLE_PAPERS = [
    {
      id: 'sample-app-rl',
      type: '范例申请书',
      typeCls: 'sample-type-app',
      title: '2024年国创优秀项目申请书范例 · 强化学习方向',
      desc: '含完整章节结构、创新点表述与参考文献格式示范，适合国创计划申报参考。',
      meta: '计算机学院 · 匿名范例 · PDF 28页',
      content:
        '<h3>【范例】一、研究背景与意义</h3>' +
        '<p>本范例展示国创优秀项目的背景论述结构：先概述领域现状（附引用），再指出具体瓶颈（附数据），最后阐明本项目的研究价值与应用场景。</p>' +
        '<h3>【范例】二、研究目标与内容</h3>' +
        '<p>目标应可量化、可验证。范例采用"（1）（2）（3）"分条列举，每条对应一个可交付成果。</p>' +
        '<h3>【范例】三、技术路线</h3>' +
        '<p>建议配合技术路线图附件，正文简述各阶段输入输出与验证指标。</p>' +
        '<h3>【范例】四、创新点与预期成果</h3>' +
        '<p>创新点需与文献差异化对比；预期成果区分论文、专利、开源等类型并给出可考核指标。</p>'
    },
    {
      id: 'sample-paper-rl',
      type: '参考论文',
      typeCls: 'sample-type-paper',
      title: 'Deep Reinforcement Learning for Mobile Robot Navigation: A Survey',
      desc: '机器人路径规划领域综述论文，可作为研究现状与创新点对比的参考文献示范。',
      meta: 'IEEE T-RO · 2023 · 引用格式示范',
      content:
        '<h3>摘要（示范）</h3>' +
        '<p>本文系统综述了深度强化学习在移动机器人导航中的应用，涵盖价值型、策略梯度型及模型型方法，并讨论了 sim-to-real 迁移、安全约束与样本效率等开放问题。</p>' +
        '<h3>1. Introduction</h3>' +
        '<p>Mobile robot navigation in dynamic environments remains a fundamental challenge…</p>' +
        '<h3>2. Background</h3>' +
        '<p>强化学习框架、马尔可夫决策过程、PPO 与 SAC 等算法简介……</p>' +
        '<h3>3. Applications</h3>' +
        '<p>室内导航、仓储物流、服务机器人等场景应用案例……</p>' +
        '<p class="text-xs text-muted" style="margin-top:16px;">注：本文为 Demo 摘录示范，完整 PDF 请在图书馆数据库查阅。</p>'
    }
  ];

  function getVersionHistory(projId) {
    return VERSION_HISTORY[projId] || VERSION_HISTORY['PROJ-2025-0087'] || [];
  }

  function getVersionById(projId, versionId) {
    var list = getVersionHistory(projId);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === versionId) return list[i];
    }
    return null;
  }

  function getSamplePaper(id) {
    for (var i = 0; i < SAMPLE_PAPERS.length; i++) {
      if (SAMPLE_PAPERS[i].id === id) return SAMPLE_PAPERS[i];
    }
    return null;
  }

  function renderVersionStatusPills(v) {
    var html = '';
    if (v.current) {
      html += '<span class="version-status-pill is-current">当前版本</span>';
    } else {
      html += '<span class="version-status-pill is-history">历史版本</span>';
    }
    if (v.locked) {
      html += '<span class="version-status-pill is-locked">已锁定</span>';
    }
    return html;
  }

  function renderVersionList() {
    var listEl = document.getElementById('version-list-container');
    var sampleEl = document.getElementById('sample-paper-list');
    if (!listEl) return;
    var versions = getVersionHistory(_currentDetailId);
    if (!versions.length) {
      listEl.innerHTML = '<div class="ai-cap-empty" style="padding:24px;margin-bottom:12px;">该项目暂无版本记录</div>';
      return;
    }
    listEl.innerHTML = versions.map(function (v) {
      var actions = '<button class="btn btn-sm btn-secondary" type="button" onclick="ARGP_MOCK.openVersionDetail(\'' + v.id + '\')">查看详情</button>';
      if (!v.current) {
        actions += '<button class="btn btn-sm btn-ghost" type="button" onclick="showToast(\'版本对比功能（Demo）\',\'info\')">对比</button>';
        actions += '<button class="btn btn-sm btn-ghost" type="button" onclick="showToast(\'已恢复至 ' + v.id + '（Demo）\',\'success\')">恢复此版本</button>';
      }
      return '<div class="version-item">' +
        '<span class="version-tag">' + v.id + '</span>' +
        '<div class="v-info"><div class="v-note">' + v.note + '</div><div class="v-meta">' + v.meta + '</div></div>' +
        '<div class="v-status-group">' + renderVersionStatusPills(v) + '</div>' +
        '<div class="v-actions">' + actions + '</div></div>';
    }).join('');
    if (sampleEl) {
      sampleEl.innerHTML = SAMPLE_PAPERS.map(function (s) {
        return '<div class="sample-paper-item">' +
          '<div class="sample-paper-icon">' + (s.type === '参考论文' ? 'PDF' : 'DOC') + '</div>' +
          '<div class="sample-paper-body">' +
            '<div class="sample-paper-title">' + s.title + '</div>' +
            '<div class="sample-paper-desc">' + s.desc + '</div>' +
            '<div class="sample-paper-meta">' + s.meta + '</div>' +
          '</div>' +
          '<div class="sample-paper-actions">' +
            '<span class="sample-type-tag">' + s.type + '</span>' +
            '<button class="btn btn-sm btn-secondary" type="button" onclick="ARGP_MOCK.openSamplePaper(\'' + s.id + '\')">查看详情</button>' +
          '</div></div>';
      }).join('');
    }
  }

  function openVersionDetail(versionId) {
    var v = getVersionById(_currentDetailId, versionId);
    if (!v) return;
    var listView = document.getElementById('version-list-view');
    var detailView = document.getElementById('version-detail-view');
    if (listView) listView.style.display = 'none';
    if (detailView) detailView.style.display = '';
    var titleEl = document.getElementById('version-detail-title');
    var metaEl = document.getElementById('version-detail-meta');
    var bodyEl = document.getElementById('version-detail-body');
    var badgesEl = document.getElementById('version-detail-badges');
    var actionsEl = document.getElementById('version-detail-actions');
    if (titleEl) titleEl.textContent = v.title;
    if (metaEl) metaEl.textContent = v.meta;
    if (bodyEl) bodyEl.innerHTML = v.content;
    if (badgesEl) badgesEl.innerHTML = '<span class="version-tag">' + v.id + '</span>' + renderVersionStatusPills(v);
    if (actionsEl) {
      var btns = '<button class="btn btn-secondary" type="button" onclick="ARGP_MOCK.closeVersionDetail()">返回列表</button>';
      if (!v.current) {
        btns += '<button class="btn btn-ghost" type="button" onclick="showToast(\'版本对比（Demo）\',\'info\')">与当前版本对比</button>';
        btns += '<button class="btn btn-primary" type="button" onclick="showToast(\'已恢复至 ' + v.id + '（Demo）\',\'success\')">恢复此版本</button>';
      }
      actionsEl.innerHTML = btns;
    }
    window._openVersionId = versionId;
  }

  function closeVersionDetail() {
    var listView = document.getElementById('version-list-view');
    var detailView = document.getElementById('version-detail-view');
    if (listView) listView.style.display = '';
    if (detailView) detailView.style.display = 'none';
    window._openVersionId = null;
  }

  function openSamplePaper(paperId) {
    var s = getSamplePaper(paperId);
    if (!s) return;
    var listView = document.getElementById('version-list-view');
    var detailView = document.getElementById('version-detail-view');
    if (listView) listView.style.display = 'none';
    if (detailView) detailView.style.display = '';
    var titleEl = document.getElementById('version-detail-title');
    var metaEl = document.getElementById('version-detail-meta');
    var bodyEl = document.getElementById('version-detail-body');
    var badgesEl = document.getElementById('version-detail-badges');
    var actionsEl = document.getElementById('version-detail-actions');
    if (titleEl) titleEl.textContent = s.title;
    if (metaEl) metaEl.textContent = s.meta;
    if (bodyEl) bodyEl.innerHTML = s.content;
    if (badgesEl) {
      badgesEl.innerHTML = '<span class="sample-type-tag">' + s.type + '</span><span class="version-status-pill is-history">仅供参考</span>';
    }
    if (actionsEl) {
      actionsEl.innerHTML = '<button class="btn btn-secondary" type="button" onclick="ARGP_MOCK.closeVersionDetail()">返回列表</button>' +
        '<button class="btn btn-ghost" type="button" onclick="showToast(\'范例文件下载（Demo）\',\'info\')">下载 PDF</button>';
    }
    window._openVersionId = 'sample:' + paperId;
  }

  window.ARGP_MOCK = {
    STUDENT_PROJECTS: STUDENT_PROJECTS,
    STATUS: STATUS,
    PRE_GUIDANCE: PRE_GUIDANCE,
    isPreGuidance: isPreGuidance,
    canShowAiReport: canShowAiReport,
    getCurrentDetailId: getCurrentDetailId,
    getVersionHistory: getVersionHistory,
    renderVersionList: renderVersionList,
    openVersionDetail: openVersionDetail,
    closeVersionDetail: closeVersionDetail,
    openSamplePaper: openSamplePaper,
    openProjectDetail: openProjectDetail,
    applyProjDetailView: applyProjDetailView,
    initStudentProjects: initStudentProjects,
    renderMyProjList: renderMyProjList,
    renderStudentProjectSummary: renderStudentProjectSummary,
    renderStudentHomeBoard: renderStudentHomeBoard
  };
})();
