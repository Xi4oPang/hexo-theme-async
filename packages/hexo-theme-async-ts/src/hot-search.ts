interface HotSearchItem {
    title: string;
    url: string;
}

async function fetchZhihuHotSearch(): Promise<HotSearchItem[]> {
    // Mock data
    return [
        { title: '知乎热搜第一条', url: '#' },
        { title: '知乎热搜第二条', url: '#' },
        { title: '知乎热搜第三条', url: '#' },
    ];
}

async function fetchCsdnHotSearch(): Promise<HotSearchItem[]> {
    // Mock data
    return [
        { title: 'CSDN热搜第一条', url: '#' },
        { title: 'CSDN热搜第二条', url: '#' },
        { title: 'CSDN热搜第三条', url: '#' },
    ];
}

function renderHotSearch(elementId: string, items: HotSearchItem[]) {
    const container = document.getElementById(elementId);
    if (container) {
        const ul = document.createElement('ul');
        ul.className = 'trm-list';
        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.url;
            a.target = '_blank';
            a.textContent = item.title;
            li.appendChild(a);
            ul.appendChild(li);
        });
        container.innerHTML = '';
        container.appendChild(ul);
    }
}

export async function initHotSearch() {
    const zhihuItems = await fetchZhihuHotSearch();
    renderHotSearch('zhihu-hot-search', zhihuItems);

    const csdnItems = await fetchCsdnHotSearch();
    renderHotSearch('csdn-hot-search', csdnItems);
}

document.addEventListener('DOMContentLoaded', initHotSearch);
// Since swup is used, we might need to re-run this on page changes.
// We will investigate this further after confirming the basic implementation.
document.addEventListener('swup:contentReplaced', initHotSearch);
