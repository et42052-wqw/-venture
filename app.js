// ==========================================================
// Gangwon Regional SMEs and Startups Administration Web App JS
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Policy Trend Tabs Logic
  const tabButtons = document.querySelectorAll('.trend-tabs .tab-btn');
  const tabPanes = document.querySelectorAll('.tab-contents .tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      button.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // ==========================================================
  // [NEW] 2-1. Citizen Benefit Survey & Checklist Logic
  // ==========================================================
  const personaFilterBtns = document.querySelectorAll('.persona-filter-group .persona-btn');
  const checklistCards = document.querySelectorAll('.checklist-grid .check-item-card');
  const selectedCountEl = document.getElementById('selected-count');
  const resetChecklistBtn = document.getElementById('reset-checklist-btn');
  const resultsContainer = document.getElementById('survey-results-container');
  const summarySubtext = document.getElementById('summary-subtext');

  // Detailed benefit dictionary mapping
  const surveyBenefitMap = {
    'startup_idea': {
      title: '모두의 창업 프로젝트 & 예비창업패키지',
      dept: '지역혁신과 창업벤처팀 (033-260-1630)',
      agency: '강원창조경제혁신센터 협력',
      desc: '아이디어를 가진 국민 누구나 신청 가능! 창업활동자금 200만 원 및 1:1 맞춤형 AI/전문가 비즈니스 모델 고도화 솔루션을 제공합니다.',
      benefit: '활동비 200만 원, 창업 멘토링, 차기 사업화 자금(최대 1억 원) 연계',
      link: 'https://www.mss.go.kr/site/gangwon/main.do'
    },
    'loan_interest': {
      title: '소상공인 정책자금 대환대출 & 신용보증재단 특례보증',
      dept: '지역정책과 소상공인지원팀 (033-260-1620)',
      agency: '소상공인시장진흥공단 / 강원신용보증재단',
      desc: '7% 이상 고금리 대출을 저금리(4%대) 장기 분할상환 대출로 전환하고, 긴급 경영안정자금에 대한 보증 수수료 인하 혜택을 드립니다.',
      benefit: '최대 5천만 원 대환 융자, 특례보증 100% 전액 보증',
      link: 'https://www.semas.or.kr'
    },
    'local_sales': {
      title: '동행축제 특별판매전 입점 & 라이콘(LICORN) 육성',
      dept: '지역정책과 소상공인지원팀 (033-260-1622)',
      agency: '원주 라이콘스페이스 / 중기부',
      desc: '강원도 내 명품 특산품 및 골목 매장의 제품을 춘천 금빛장터, 동행축제 in 강릉 등 대형 오프라인 장터와 네이버·쿠팡 기획전에 입점 지원합니다.',
      benefit: '라이브커머스 무료 제작 송출, 대형 유통망 MD 매칭 상담',
      link: 'https://www.mss.go.kr/site/gangwon/main.do'
    },
    'smart_store': {
      title: '스마트상점 기술보급 사업 (디지털 전환)',
      dept: '지역정책과 소상공인지원팀 (033-260-1620)',
      agency: '소상공인시장진흥공단 강원본부',
      desc: '무인 결제 키오스크, 테이블 오더, AI 서빙로봇 도입 비용을 최대 70%(최대 500만~1,500만 원)까지 국비로 무상 지원합니다.',
      benefit: '도입 비용 최대 70% 국비 지원, 무상 AS 및 사용 교육',
      link: 'https://www.semas.or.kr'
    },
    'store_reboot': {
      title: '희망리턴패키지 & 1:1 경영위기 종합상담',
      dept: '지역정책과 소상공인지원팀 (033-260-1623)',
      agency: '소상공인시장진흥공단 원주·춘천센터',
      desc: '경영 위기 극복을 위한 1:1 현장 경영클리닉을 지원하며, 불가피한 폐업 시 점포 철거·원상복구비(최대 250만 원)와 전업 채무상담을 지원합니다.',
      benefit: '점포철거비 최대 250만 원, 폐업 후 취업 장려수당 최대 100만 원',
      link: 'https://www.semas.or.kr'
    },
    'rnd_grant': {
      title: '창업성장기술개발 디딤돌 과제 & 지역특화 R&D',
      dept: '지역혁신과 기술혁신팀 (033-260-1640)',
      agency: '중소기업기술정보진흥원(TIPA)',
      desc: '도내 유망 중소·벤처기업의 신기술·신제품 개발에 필요한 연구 인건비와 시제품 제작비를 정부 무상 출연금으로 지원합니다.',
      benefit: '기업당 1~2년간 최대 1.2억~2억 원 무상 연구개발비 출연',
      link: 'https://www.mss.go.kr/site/gangwon/main.do'
    },
    'smart_factory': {
      title: '중소기업 스마트제조혁신(스마트공장) 보급사업',
      dept: '지역혁신과 스마트제조팀 (033-260-1645)',
      agency: '강원테크노파크 스마트제조혁신센터',
      desc: '제조 현장의 센서 부착, ERP/MES 생산관리 전산화, 로봇 자동화 공정 구축 비용을 50% 국비 매칭 지원합니다.',
      benefit: '기초·고도화 스마트공장 솔루션 구축비 5천만~2억 원 지원',
      link: 'https://www.mss.go.kr/site/gangwon/main.do'
    },
    'public_buy': {
      title: '기술개발제품 시범구매제도 & 공공구매 촉진',
      dept: '지역정책과 공공구매팀 (033-260-1615)',
      agency: '강원지방중소벤처기업청 본청',
      desc: '납품 실적이 없는 신규 개발 혁신제품에 대해 공공기관이 우선 구매하도록 지원하여 조달청 및 공공시장 진입 장벽을 없앱니다.',
      benefit: '실적 평가 면제, 공공기관 우선구매 매칭, 조달시장 우대',
      link: 'https://www.mss.go.kr/site/gangwon/main.do'
    },
    'global_export': {
      title: '수출바우처 사업 & 글로벌 강소기업 육성 프로젝트',
      dept: '지역정책과 수출지원팀 (033-260-1618)',
      agency: '중소벤처기업진흥공단 강원지역본부',
      desc: '수출 준비 기업에 3천만~1억 원 상당 바우처를 지급하여 해외 전시회 참가, 해외 바이어 발굴, CE/FDA 등 해외 규격 인증 비용을 전액 활용할 수 있습니다.',
      benefit: '수출바우처 최대 1억 원, 해외 바이어 매칭, 국제인증 취득비',
      link: 'https://www.mss.go.kr/site/gangwon/main.do'
    }
  };

  // Persona filtering
  personaFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      personaFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const persona = btn.getAttribute('data-persona');

      checklistCards.forEach(card => {
        const cardPersona = card.getAttribute('data-persona');
        if (persona === 'all' || cardPersona === persona) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Checklist Item Click Toggle
  checklistCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const checkbox = card.querySelector('input.survey-checkbox');
      // If the direct click wasn't on the checkbox itself, toggle it
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      if (checkbox.checked) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
      renderSurveyResults();
    });
  });

  // Reset Checklist
  if (resetChecklistBtn) {
    resetChecklistBtn.addEventListener('click', () => {
      checklistCards.forEach(card => {
        const cb = card.querySelector('input.survey-checkbox');
        cb.checked = false;
        card.classList.remove('selected');
      });
      renderSurveyResults();
    });
  }

  // Render Survey Results
  function renderSurveyResults() {
    const checkedBoxes = document.querySelectorAll('input.survey-checkbox:checked');
    const count = checkedBoxes.length;
    selectedCountEl.textContent = count;

    if (count === 0) {
      summarySubtext.textContent = '위 체크리스트에서 나에게 해당되는 고민이나 필요 항목을 선택해 보세요.';
      resultsContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-square-check"></i>
          <p>체크박스를 클릭하시면 <strong>내가 받을 수 있는 구체적인 혜택, 신청 기관, 담당 부서 연락처</strong>가 여기에 정리됩니다.</p>
        </div>
      `;
      return;
    }

    summarySubtext.innerHTML = `선택하신 <strong>${count}가지 고민</strong>에 대해 강원중기청에서 다음의 직접적인 지원 혜택을 제공받으실 수 있습니다.`;

    let html = '<div class="result-items-list">';
    checkedBoxes.forEach((cb, idx) => {
      const item = surveyBenefitMap[cb.value];
      if (item) {
        html += `
          <div class="report-item-card">
            <div class="report-item-info">
              <h4><i class="fa-solid fa-circle-check" style="color: #0b5ed7;"></i> ${idx + 1}. ${item.title}</h4>
              <p>${item.desc}</p>
              <div class="report-tags">
                <div class="report-tag-item"><i class="fa-solid fa-gift"></i> <strong>제공 혜택:</strong> ${item.benefit}</div>
                <div class="report-tag-item"><i class="fa-solid fa-building"></i> <strong>담당 부서:</strong> ${item.dept}</div>
                <div class="report-tag-item"><i class="fa-solid fa-handshake"></i> <strong>협력 기관:</strong> ${item.agency}</div>
              </div>
            </div>
            <div>
              <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="report-action-btn">
                공고·신청 바로가기 <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>
        `;
      }
    });
    html += '</div>';
    resultsContainer.innerHTML = html;
  }

  // 2. News Category Filter Logic
  const filterBtns = document.querySelectorAll('.news-filter .filter-btn');
  const newsCards = document.querySelectorAll('.news-grid .news-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      newsCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Interactive Finder (맞춤 정책 간편 진단기)
  const typeBtns = document.querySelectorAll('#type-options .opt-btn');
  const needBtns = document.querySelectorAll('#need-options .opt-btn');

  let selectedType = 'startup';
  let selectedNeed = 'fund';

  // Recommendations Database
  const recommendations = {
    'startup-fund': {
      title: '모두의 창업 프로젝트 & 예비창업패키지',
      desc: '아이디어 구체화 및 시제품 제작을 위한 활동비(200만 원)와 최대 1억 원 규모의 사업화 자금을 지원합니다.',
      dept: '지역혁신과 (창업벤처팀)',
      benefit: '창업활동비, AI 멘토링, 시제품 제작비 지원'
    },
    'startup-market': {
      title: '초기창업패키지 & 판로 개척 멘토링',
      desc: '초기 창업 기업이 대형 유통망 및 온라인 오픈마켓에 진입할 수 있도록 상세페이지 제작 및 입점 컨설팅을 제공합니다.',
      dept: '지역정책과 (판로수출팀)',
      benefit: '공공조달 등록 지원, 온라인 플랫폼 입점 수수료 지원'
    },
    'startup-tech': {
      title: '창업성장기술개발(R&D) 디딤돌 과제',
      desc: '창업 7년 이하 기업의 독창적인 아이디어와 신기술을 보유한 유망 스타트업에 최대 1.2억 원 내외 연구개발비를 지원합니다.',
      dept: '지역혁신과 (기술혁신팀)',
      benefit: '기술개발 연구비, 시제품 고도화, 지식재산권(특허) 출원비'
    },
    'startup-consult': {
      title: '창업 멘토링 프로그램 & 강원창조경제혁신센터 연계',
      desc: '투자 유치(IR) 피칭 코칭, 세무·노무·법률 분야 전문가를 1:1로 매칭하여 창업 초기 리스크를 최소화합니다.',
      dept: '지역혁신과 / 강원창조경제혁신센터',
      benefit: '전문가 1:1 밀착 코칭, IR 데모데이 참가 기회'
    },
    'smallbiz-fund': {
      title: '소상공인 정책자금 (희망플러스 특례보증 / 대환대출)',
      desc: '고금리 장기화로 자금난을 겪는 소상공인과 자영업자를 위해 저금리 운전자금 융자 및 이차보전을 제공합니다.',
      dept: '지역정책과 / 소상공인시장진흥공단',
      benefit: '저리 정책대출, 신용보증재단 연계 보증료 감면'
    },
    'smallbiz-market': {
      title: '동행축제 연계 판로 지원 & 라이콘(LICORN) 육성',
      desc: '도내 우수 골목상권 제품을 전 국민 소비 축제인 동행축제 및 라이콘스페이스를 통해 전국 소비자에게 판매 홍보합니다.',
      dept: '지역정책과 (소상공인지원팀)',
      benefit: '지역 상권 기획전 입점, 라이브커머스 방송 송출 지원'
    },
    'smallbiz-tech': {
      title: '스마트상점 & 스마트공방 기술 보급 사업',
      desc: '키오스크, 테이블오더, AI 서빙로봇 등 골목상점의 디지털 전환 설비 도입 비용(최대 70%)을 지원합니다.',
      dept: '소상공인시장진흥공단 강원본부',
      benefit: '디지털 기기 구입비 최대 70% 지원, 현장 세팅 교육'
    },
    'smallbiz-consult': {
      title: '1:1 맞춤형 위기극복 종합상담회 & 희망리턴패키지',
      desc: '경영 위기에 처한 사업자에게 경영개선 컨설팅을 제공하고, 불가피한 폐업 시 원상복구비 및 재취업을 체계적으로 돕습니다.',
      dept: '지역정책과 / 소상공인종합상담센터',
      benefit: '점포철거비 최대 지원, 채무조정 무료 법률자문'
    },
    'sme-fund': {
      title: '중소기업 정책자금 (혁신성장자금 & 시설자금)',
      desc: '제조 공장 증설, 노후설비 교체 및 대규모 설비 투자를 희망하는 도내 제조업체에 장기 저리 정책융자를 제공합니다.',
      dept: '중소벤처기업진흥공단 강원지역본부',
      benefit: '시설자금 거치기간 확대, 원스톱 온라인 융자 심사'
    },
    'sme-market': {
      title: '기술개발제품 시범구매제도 & 공공구매 촉진',
      desc: '납품 실적이 부족한 중소기업의 혁신 개발제품을 공공기관이 의무적으로 우선 구매하도록 연결합니다.',
      dept: '지역정책과 (공공구매팀)',
      benefit: '공공기관 우선 납품 기회, 공공조달 성능인증(EPC)'
    },
    'sme-tech': {
      title: '중소기업 스마트제조혁신(스마트공장) & R&D',
      desc: '생산 공정의 스마트화·자동화 및 고도화 솔루션 도입비를 지원하여 도내 제조업의 생산성과 품질을 대폭 향상합니다.',
      dept: '지역혁신과 (스마트제조팀)',
      benefit: '스마트공장 구축비 최대 50%, 제조 빅데이터 분석 솔루션'
    },
    'sme-consult': {
      title: '비즈니스지원단 전문가 1:1 현장 클리닉',
      desc: '경영, 기술, 수출, 특허, 노무 등 다양한 분야의 현장 전문가가 직접 기업을 방문하여 애로사항을 즉시 진단·해결합니다.',
      dept: '지역정책과 비즈니스지원단',
      benefit: '전문위원 무료 현장 파견, 컨설팅 비용 70~80% 정부 지원'
    },
    'export-fund': {
      title: '글로벌 진출 전용 수출마케팅 바우처',
      desc: '해외 시장 개척을 위한 바이어 매칭, 물류비 보조, 해외 지사화 사업 비용을 바우처 형태로 자유롭게 활용할 수 있습니다.',
      dept: '지역정책과 (수출지원팀)',
      benefit: '최대 1억 원 상당 바우처 메뉴판 자율 선택'
    },
    'export-market': {
      title: '해외 유명 전시회 참가 지원 및 무역사절단',
      desc: '동남아, 북미, 유럽 등 유망 해외 박람회 부스 임차료, 항공료, 통역을 종합 패키지로 지원합니다.',
      dept: '지역정책과 / 한국무역협회 강원지부',
      benefit: '해외 부스비 80% 지원, 바이어 1:1 비즈니스 매칭'
    },
    'export-tech': {
      title: '해외 규격 인증 획득 지원사업 (CE, FDA, ISO)',
      desc: '수출 상대국에서 요구하는 각종 까다로운 안전·품질 인증 취득에 소요되는 시험검사비와 컨설팅 비용을 지원합니다.',
      dept: '지역혁신과 (수출인증지원)',
      benefit: '해외 인증비 실비 지원, 인증 전문가 멘토링'
    },
    'export-consult': {
      title: '글로벌 강소기업 1,000+ 프로젝트 지정 컨설팅',
      desc: '혁신성과 성장잠재력을 갖춘 도내 수출 중소기업을 발굴하여 해외 마케팅 및 금융 우대 혜택을 집중 지원합니다.',
      dept: '지역정책과 수출지원센터',
      benefit: '수출보증료 할인, 금리 우대, R&D 가점 부여'
    }
  };

  function updateFinderResult() {
    const key = `${selectedType}-${selectedNeed}`;
    const result = recommendations[key] || recommendations['startup-fund'];

    const titleEl = document.getElementById('result-title');
    const descEl = document.getElementById('result-desc');
    const deptEl = document.getElementById('result-dept');
    const benefitEl = document.getElementById('result-benefit');

    if (titleEl && descEl && deptEl && benefitEl) {
      titleEl.textContent = result.title;
      descEl.textContent = result.desc;
      deptEl.textContent = result.dept;
      benefitEl.textContent = result.benefit;

      // Subtle animation
      const box = document.getElementById('finder-result-box');
      if (box) {
        box.classList.remove('pulse-anim');
        void box.offsetWidth; // trigger reflow
        box.classList.add('pulse-anim');
      }
    }
  }

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedType = btn.getAttribute('data-val');
      updateFinderResult();
    });
  });

  needBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      needBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedNeed = btn.getAttribute('data-val');
      updateFinderResult();
    });
  });

  // 4. Scroll To Top Button & Active Nav Highlight
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.style.display = 'flex';
    } else {
      scrollTopBtn.style.display = 'none';
    }

    // ScrollSpy
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
    });
  });
});
