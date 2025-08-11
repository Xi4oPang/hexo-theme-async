interface HotSearchItem {
    title: string;
    url: string;
}


async function fetchTiebaHotSearch(): Promise<HotSearchItem[]> {
    try {
        const response = await fetch('https://proxy.cors.sh/https://tieba.baidu.com/hottopic/browse/topicList', {
            headers: {
                'x-cors-api-key': 'temp_1234567890'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.errno === 0 && data.data && data.data.bang_topic && Array.isArray(data.data.bang_topic.topic_list)) {
            return data.data.bang_topic.topic_list.map((item: any) => ({
                title: item.topic_name,
                url: item.topic_url,
            }));
        } else {
            console.error('Tieba API response format is not as expected.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching Tieba hot search:', error);
        return [];
    }
}

async function fetchCsdnHotSearch(): Promise<HotSearchItem[]> {
    try {
        const response = await fetch('https://proxy.cors.sh/https://blog.csdn.net/phoenix/web/blog/hot-rank', {
            headers: {
                'x-cors-api-key': 'temp_1234567890'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.code === 200 && Array.isArray(data.data)) {
            return data.data.map((item: any) => ({
                title: item.articleTitle,
                url: item.articleDetailUrl,
            }));
        } else {
            console.error('CSDN API response format is not as expected.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching CSDN hot search:', error);
        return [];
    }
}

async function fetchBilibiliHotSearch(): Promise<HotSearchItem[]> {
    try {
        const response = await fetch('https://proxy.cors.sh/https://api.bilibili.com/x/web-interface/popular', {
            headers: {
                'x-cors-api-key': 'temp_1234567890'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.code === 0 && data.data && Array.isArray(data.data.list)) {
            return data.data.list.map((item: any) => ({
                title: item.title,
                url: item.short_link_v2 || item.uri,
            }));
        } else {
            console.error('Bilibili API response format is not as expected.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching Bilibili hot search:', error);
        return [];
    }
}

async function fetchJuejinHotSearch(): Promise<HotSearchItem[]> {
    try {
        const response = await fetch('https://proxy.cors.sh/https://api.juejin.cn/content_api/v1/content/article_rank', {
            headers: {
                'x-cors-api-key': 'temp_1234567890'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.err_no === 0 && data.data && Array.isArray(data.data)) {
            return data.data.map((item: any) => ({
                title: item.content.title,
                url: `https://juejin.cn/post/${item.content.content_id}`,
            }));
        } else {
            console.error('Juejin API response format is not as expected.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching Juejin hot search:', error);
        return [];
    }
}

async function fetchHupuHotSearch(): Promise<HotSearchItem[]> {
    try {
        const response = await fetch('https://proxy.cors.sh/https://tenapi.cn/huputop', {
            headers: {
                'x-cors-api-key': 'temp_1234567890'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.code === 200 && Array.isArray(data.data)) {
            return data.data.map((item: any) => ({
                title: item.name,
                url: item.url,
            }));
        } else {
            console.error('Hupu API response format is not as expected.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching Hupu hot search:', error);
        return [];
    }
}

async function fetchSmzdmHotSearch(): Promise<HotSearchItem[]> {
    try {
        const response = await fetch('https://proxy.cors.sh/https://www.smzdm.com/top/', {
            headers: {
                'x-cors-api-key': 'temp_1234567890'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        // 由于SMZDM返回的是HTML页面，我们需要解析HTML来提取热门内容
        // 这里使用简单的正则表达式来提取标题和链接
        const titleMatches = html.match(/<h3[^>]*>([^<]+)<\/h3>/g);
        const linkMatches = html.match(/href="([^"]*)"[^>]*>/g);
        
        if (titleMatches && linkMatches) {
            const items: HotSearchItem[] = [];
            const maxItems = Math.min(titleMatches.length, linkMatches.length, 10);
            
            for (let i = 0; i < maxItems; i++) {
                const title = titleMatches[i].replace(/<[^>]*>/g, '').trim();
                const url = linkMatches[i].match(/href="([^"]*)"/)?.[1];
                if (title && url && url.startsWith('http')) {
                    items.push({ title, url });
                }
            }
            return items;
        } else {
            console.error('SMZDM HTML parsing failed.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching SMZDM hot search:', error);
        return [];
    }
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
    const tiebaItems = await fetchTiebaHotSearch();
    renderHotSearch('tieba-hot-search', tiebaItems);

    const csdnItems = await fetchCsdnHotSearch();
    renderHotSearch('csdn-hot-search', csdnItems);

    const bilibiliItems = await fetchBilibiliHotSearch();
    renderHotSearch('bilibili-hot-search', bilibiliItems);

    const juejinItems = await fetchJuejinHotSearch();
    renderHotSearch('juejin-hot-search', juejinItems);

    const hupuItems = await fetchHupuHotSearch();
    renderHotSearch('hupu-hot-search', hupuItems);

    const smzdmItems = await fetchSmzdmHotSearch();
    renderHotSearch('smzdm-hot-search', smzdmItems);
}

document.addEventListener('DOMContentLoaded', initHotSearch);
// Since swup is used, we might need to re-run this on page changes.
// We will investigate this further after confirming the basic implementation.
document.addEventListener('swup:contentReplaced', initHotSearch);
