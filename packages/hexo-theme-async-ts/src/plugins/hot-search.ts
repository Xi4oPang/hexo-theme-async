interface HotSearchItem {
    title: string;
    url: string;
}

// 模拟数据作为备选方案
const MOCK_DATA = {
    tieba: [
        { title: "【热门话题】贴吧热门讨论", url: "https://tieba.baidu.com" },
        { title: "贴吧热门话题1", url: "https://tieba.baidu.com" },
        { title: "贴吧热门话题2", url: "https://tieba.baidu.com" },
        { title: "贴吧热门话题3", url: "https://tieba.baidu.com" },
        { title: "贴吧热门话题4", url: "https://tieba.baidu.com" }
    ],
    csdn: [
        { title: "CSDN热门文章1", url: "https://www.csdn.net" },
        { title: "CSDN热门文章2", url: "https://www.csdn.net" },
        { title: "CSDN热门文章3", url: "https://www.csdn.net" },
        { title: "CSDN热门文章4", url: "https://www.csdn.net" },
        { title: "CSDN热门文章5", url: "https://www.csdn.net" }
    ],
    bilibili: [
        { title: "B站热门视频1", url: "https://www.bilibili.com" },
        { title: "B站热门视频2", url: "https://www.bilibili.com" },
        { title: "B站热门视频3", url: "https://www.bilibili.com" },
        { title: "B站热门视频4", url: "https://www.bilibili.com" },
        { title: "B站热门视频5", url: "https://www.bilibili.com" }
    ],
    juejin: [
        { title: "掘金热门文章1", url: "https://juejin.cn" },
        { title: "掘金热门文章2", url: "https://juejin.cn" },
        { title: "掘金热门文章3", url: "https://juejin.cn" },
        { title: "掘金热门文章4", url: "https://juejin.cn" },
        { title: "掘金热门文章5", url: "https://juejin.cn" }
    ],
    hupu: [
        { title: "虎扑热门话题1", url: "https://www.hupu.com" },
        { title: "虎扑热门话题2", url: "https://www.hupu.com" },
        { title: "虎扑热门话题3", url: "https://www.hupu.com" },
        { title: "虎扑热门话题4", url: "https://www.hupu.com" },
        { title: "虎扑热门话题5", url: "https://www.hupu.com" }
    ],
    smzdm: [
        { title: "什么值得买热门1", url: "https://www.smzdm.com" },
        { title: "什么值得买热门2", url: "https://www.smzdm.com" },
        { title: "什么值得买热门3", url: "https://www.smzdm.com" },
        { title: "什么值得买热门4", url: "https://www.smzdm.com" },
        { title: "什么值得买热门5", url: "https://www.smzdm.com" }
    ]
};

async function fetchTiebaHotSearch(): Promise<HotSearchItem[]> {
    try {
        const response = await fetch('https://cors.eu.org/https://tieba.baidu.com/hottopic/browse/topicList');
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
            console.log('Tieba API failed, using mock data');
            return MOCK_DATA.tieba;
        }
    } catch (error) {
        console.log('Tieba API error, using mock data:', error);
        return MOCK_DATA.tieba;
    }
}

async function fetchCsdnHotSearch(): Promise<HotSearchItem[]> {
    try {
        const response = await fetch('https://cors.eu.org/https://blog.csdn.net/phoenix/web/blog/hot-rank');
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
            console.log('CSDN API failed, using mock data');
            return MOCK_DATA.csdn;
        }
    } catch (error) {
        console.log('CSDN API error, using mock data:', error);
        return MOCK_DATA.csdn;
    }
}

async function fetchBilibiliHotSearch(): Promise<HotSearchItem[]> {
    try {
        console.log('Fetching Bilibili hot search...');
        
        // 尝试多个CORS代理服务和B站API端点
        const apiConfigs = [
            {
                proxy: '', // 直接请求，不使用代理
                endpoint: 'https://api.bilibili.com/x/web-interface/popular',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                }
            },
            {
                proxy: 'https://cors.eu.org/',
                endpoint: 'https://api.bilibili.com/x/web-interface/popular',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                }
            },
            {
                proxy: 'https://api.allorigins.win/raw?url=',
                endpoint: 'https://api.bilibili.com/x/web-interface/popular',
                headers: {}
            },
            {
                proxy: 'https://cors-anywhere.herokuapp.com/',
                endpoint: 'https://api.bilibili.com/x/web-interface/popular',
                headers: {}
            },
            {
                proxy: 'https://thingproxy.freeboard.io/fetch/',
                endpoint: 'https://api.bilibili.com/x/web-interface/popular',
                headers: {}
            }
        ];

        for (const config of apiConfigs) {
            try {
                const fullUrl = config.proxy + config.endpoint;
                console.log(`Trying Bilibili API with proxy: ${config.proxy || 'direct'}`);
                
                // 添加延迟避免请求过快
                if (config.proxy) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: config.headers,
                    mode: config.proxy ? 'cors' : 'no-cors'
                });
                
                console.log(`Bilibili API response status: ${response.status}`);
                
                if (!response.ok) {
                    console.log(`Bilibili API failed with status: ${response.status}`);
                    continue;
                }
                
                const data = await response.json();
                console.log('Bilibili API response data:', data);
                
                if (data && data.code === 0 && data.data) {
                    let list = data.data.list || data.data;
                    if (Array.isArray(list)) {
                        console.log(`Bilibili API success, found ${list.length} items`);
                        return list.map((item: any) => ({
                            title: item.title,
                            url: `https://www.bilibili.com/video/${item.bvid}`,
                        }));
                    } else {
                        console.log(`Bilibili API data.list is not an array:`, list);
                    }
                } else {
                    console.log(`Bilibili API invalid response structure:`, data);
                }
            } catch (e) {
                console.log(`Bilibili API error with proxy ${config.proxy}:`, e);
                continue;
            }
        }
        
        console.log('All Bilibili APIs failed, using mock data');
        return MOCK_DATA.bilibili;
    } catch (error) {
        console.log('Bilibili API error, using mock data:', error);
        return MOCK_DATA.bilibili;
    }
}

async function fetchJuejinHotSearch(): Promise<HotSearchItem[]> {
    try {
        // 尝试多个掘金API端点
        const apis = [
            'https://cors.eu.org/https://api.juejin.cn/content_api/v1/content/article_rank',
            'https://cors.eu.org/https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed',
            'https://cors.eu.org/https://api.juejin.cn/content_api/v1/content/article_list'
        ];

        for (const api of apis) {
            try {
                const response = await fetch(api, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://juejin.cn/'
                    }
                });
                
                if (!response.ok) continue;
                
                const data = await response.json();
                if (data && data.err_no === 0 && data.data && Array.isArray(data.data)) {
                    return data.data.map((item: any) => ({
                        title: item.content?.title || item.title,
                        url: `https://juejin.cn/post/${item.content?.content_id || item.id}`,
                    }));
                }
            } catch (e) {
                console.log(`Juejin API ${api} failed:`, e);
                continue;
            }
        }
        
        console.log('All Juejin APIs failed, using mock data');
        return MOCK_DATA.juejin;
    } catch (error) {
        console.log('Juejin API error, using mock data:', error);
        return MOCK_DATA.juejin;
    }
}

async function fetchHupuHotSearch(): Promise<HotSearchItem[]> {
    try {
        // 尝试多个虎扑API端点
        const apis = [
            'https://cors.eu.org/https://api.hupu.com/v1/news/list',
            'https://cors.eu.org/https://tenapi.cn/huputop',
            'https://cors.eu.org/https://api.hupu.com/v1/news/hot'
        ];

        for (const api of apis) {
            try {
                const response = await fetch(api, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                if (!response.ok) continue;
                
                const data = await response.json();
                if (data && (data.success || data.code === 200) && Array.isArray(data.data)) {
                    return data.data.map((item: any) => ({
                        title: item.title || item.name,
                        url: item.url || `https://www.hupu.com/news/${item.id}`,
                    }));
                }
            } catch (e) {
                console.log(`Hupu API ${api} failed:`, e);
                continue;
            }
        }
        
        console.log('All Hupu APIs failed, using mock data');
        return MOCK_DATA.hupu;
    } catch (error) {
        console.log('Hupu API error, using mock data:', error);
        return MOCK_DATA.hupu;
    }
}

async function fetchSmzdmHotSearch(): Promise<HotSearchItem[]> {
    try {
        const response = await fetch('https://cors.eu.org/https://www.smzdm.com/top/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        
        // 改进的HTML解析
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        let items: HotSearchItem[] = [];
        
        // 查找热门文章链接
        const articleLinks = doc.querySelectorAll('a[href*="/p/"], a[href*="/article/"], a[href*="/post/"]');
        if (articleLinks.length > 0) {
            for (let i = 0; i < articleLinks.length; i++) {
                const link = articleLinks[i] as HTMLAnchorElement;
                const title = link.textContent?.trim();
                const url = link.href;
                if (title && url && title.length > 5 && title.length < 100) {
                    items.push({ title, url });
                }
            }
        }
        
        // 如果上面的方法失败，使用正则表达式
        if (items.length === 0) {
            const titleMatches = html.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi);
            const linkMatches = html.match(/href="([^"]*)"[^>]*>/g);
            
            if (titleMatches && linkMatches) {
                const maxItems = Math.min(titleMatches.length, linkMatches.length);
                
                for (let i = 0; i < maxItems; i++) {
                    const title = titleMatches[i].replace(/<[^>]*>/g, '').trim();
                    const urlMatch = linkMatches[i].match(/href="([^"]*)"/);
                    if (urlMatch) {
                        const url = urlMatch[1];
                        if (title && url && url.startsWith('http') && title.length > 5 && title.length < 100) {
                            items.push({ title, url });
                        }
                    }
                }
            }
        }
        
        if (items.length > 0) {
            return items;
        } else {
            console.log('SMZDM HTML parsing failed, using mock data');
            return MOCK_DATA.smzdm;
        }
    } catch (error) {
        console.log('SMZDM API error, using mock data:', error);
        return MOCK_DATA.smzdm;
    }
}

// 创建静态展示的热搜容器（不滚动）
function createScrollingContainer(elementId: string, items: HotSearchItem[]): void {
    const container = document.getElementById(elementId);
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">暂无数据</p>';
        return;
    }

    // 创建静态容器
    const staticContainer = document.createElement('div');
    staticContainer.className = 'hot-search-static-container';
    staticContainer.style.cssText = `
        background: var(--card-bg-color, #fff);
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;

    // 添加所有项目
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'hot-search-item';
        itemDiv.style.cssText = `
            padding: 8px 0;
            border-bottom: 1px solid var(--border-color, #eee);
            transition: all 0.3s ease;
        `;

        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.textContent = `${index + 1}. ${item.title}`;
        link.style.cssText = `
            color: var(--text-color, #333);
            text-decoration: none;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            line-height: 1.4;
        `;

        // 悬停效果
        link.addEventListener('mouseenter', () => {
            itemDiv.style.backgroundColor = 'var(--primary-10, rgba(175, 180, 43, 0.1))';
            link.style.color = 'var(--primary, #afb42b)';
        });

        link.addEventListener('mouseleave', () => {
            itemDiv.style.backgroundColor = 'transparent';
            link.style.color = 'var(--text-color, #333)';
        });

        itemDiv.appendChild(link);
        staticContainer.appendChild(itemDiv);
    });

    // 清空容器并添加新内容
    container.innerHTML = '';
    container.appendChild(staticContainer);
}

export async function initHotSearch() {
    console.log('Initializing hot search...');
    
    try {
        const tiebaItems = await fetchTiebaHotSearch();
        console.log('Tieba items:', tiebaItems.length);
        createScrollingContainer('tieba-hot-search', tiebaItems);

        const csdnItems = await fetchCsdnHotSearch();
        console.log('CSDN items:', csdnItems.length);
        createScrollingContainer('csdn-hot-search', csdnItems);

        const bilibiliItems = await fetchBilibiliHotSearch();
        console.log('Bilibili items:', bilibiliItems.length);
        createScrollingContainer('bilibili-hot-search', bilibiliItems);

        const juejinItems = await fetchJuejinHotSearch();
        console.log('Juejin items:', juejinItems.length);
        createScrollingContainer('juejin-hot-search', juejinItems);

        const hupuItems = await fetchHupuHotSearch();
        console.log('Hupu items:', hupuItems.length);
        createScrollingContainer('hupu-hot-search', hupuItems);

        const smzdmItems = await fetchSmzdmHotSearch();
        console.log('SMZDM items:', smzdmItems.length);
        createScrollingContainer('smzdm-hot-search', smzdmItems);
        
        console.log('Hot search initialization completed');
    } catch (error) {
        console.error('Error during hot search initialization:', error);
    }
}

document.addEventListener('DOMContentLoaded', initHotSearch);
// Since swup is used, we might need to re-run this on page changes.
document.addEventListener('swup:contentReplaced', initHotSearch);