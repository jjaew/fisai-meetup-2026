/* FISAI MeetUP 과제Ⅰ: 원본 CSV로 생성된 데이터를 이용한 정적 검색 페이지 */
(() => {
  'use strict';
  const payload = window.FISAI_DATA;
  const cardsRoot = document.getElementById('cards');
  const input = document.getElementById('service-search');
  const clearButton = document.getElementById('clear-search');
  const emptyButton = document.getElementById('empty-clear');
  const emptyState = document.getElementById('empty-results');
  const resultLabel = document.getElementById('search-result');

  if (!payload || !Array.isArray(payload.services) || !Array.isArray(payload.summary)) {
    resultLabel.textContent = '데이터를 불러오지 못했습니다.';
    return;
  }
  const iconByCategory = {
    '민원': { emoji: '📄', bg: '#e9f0ff' },
    '복지': { emoji: '🤝', bg: '#e8f7f3' },
    '세금': { emoji: '🧾', bg: '#fff3e5' },
    '교통': { emoji: '🚌', bg: '#e9f6fb' },
    '재난': { emoji: '🛟', bg: '#fff0ef' },
    '일자리': { emoji: '💼', bg: '#f1edff' },
    '교육': { emoji: '🎓', bg: '#fff3e8' }
  };
  const groups = payload.summary.map((item, index) => ({
    category: String(item['카테고리'] || ''),
    count: Number(item['건수'] || 0),
    agency: String(item['대표 문의기관'] || '미기재'),
    index,
    services: payload.services.filter(service => service['카테고리'] === item['카테고리'])
  }));
  const total = payload.services.length;
  const online = payload.services.filter(row => row['온라인안내'] === '가능').length;
  document.getElementById('hero-total').textContent = total.toLocaleString('ko-KR');
  document.getElementById('hero-categories').textContent = String(groups.length);
  document.getElementById('hero-online').textContent = String(online);
  document.getElementById('overall-category-count').textContent = String(groups.length);

  const text = (tag, className, content) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = content;
    return el;
  };
  const line = (label, value, list) => {
    const element = text('span', '', '');
    const labelNode = text('b', '', label + ' ');
    element.append(labelNode, document.createTextNode(value || '미기재'));
    list.append(element);
  };

  function makeCard(group) {
    const article = document.createElement('article');
    article.className = 'category-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'card-toggle';
    button.setAttribute('aria-expanded', 'false');
    const detailsId = 'services-' + group.index;
    button.setAttribute('aria-controls', detailsId);
    button.setAttribute('aria-label', `${group.category} 카테고리 ${group.count}건, 대표 문의기관 ${group.agency}. 세부 서비스 펼치기`);

    const header = text('div', 'card-top', '');
    const icon = text('span', 'card-icon', (iconByCategory[group.category] || { emoji: '📁' }).emoji);
    icon.style.setProperty('--icon-bg', (iconByCategory[group.category] || { bg: '#edf3ff' }).bg);
    icon.setAttribute('aria-hidden', 'true');
    header.append(icon, text('span', 'card-arrow', '⌄'));
    const name = text('h3', 'card-name', group.category);
    const meta = text('p', 'card-meta', '안내서비스 ');
    meta.append(text('strong', '', `${group.count}건`));
    const divider = text('div', 'card-divider', '');
    divider.setAttribute('aria-hidden', 'true');
    button.append(header, name, meta, divider, text('div', 'agency-label', '대표 문의기관'), text('div', 'agency-value', group.agency));

    const detail = text('div', 'service-list', '');
    detail.id = detailsId;
    detail.hidden = true;
    detail.append(text('div', 'service-count', `서비스 상세 · ${group.services.length}건`));
    group.services.forEach(service => {
      const item = text('div', 'service-item', '');
      item.append(text('p', 'service-item-heading', service['서비스명'] || '서비스명 없음'));
      const info = text('div', 'service-meta', '');
      line('문의', service['문의기관'], info);
      line('온라인 안내', service['온라인안내'], info);
      line('콜센터', service['콜센터'], info);
      item.append(info);
      detail.append(item);
    });
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      article.classList.toggle('expanded', expanded);
      detail.hidden = !expanded;
      button.setAttribute('aria-label', `${group.category} 카테고리 ${group.count}건, 대표 문의기관 ${group.agency}. 세부 서비스 ${expanded ? '접기' : '펼치기'}`);
    });
    article.append(button, detail);
    return article;
  }
  const normalize = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase('ko-KR').trim();

  function render() {
    const query = normalize(input.value);
    const filtered = groups.filter(g =>
      !query || normalize(g.category).includes(query) || g.services.some(s => normalize(s['문의기관']).includes(query))
    );
    cardsRoot.replaceChildren(...filtered.map(makeCard));
    resultLabel.textContent = `결과 ${filtered.length}건`;
    clearButton.hidden = !query;
    emptyState.hidden = filtered.length !== 0;
  }
  const clear = () => {input.value = '';render();input.focus();};
  input.addEventListener('input', render);
  clearButton.addEventListener('click', clear);
  emptyButton.addEventListener('click', clear);
  render();
})();
