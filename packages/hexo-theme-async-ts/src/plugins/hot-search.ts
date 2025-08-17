interface HotSearchItem {
    title: string;
    url: string;
}

// 获取掘金分类信息，优先获取后端分类
async function getJuejinCategory(): Promise<string> {
    const apis = [
        'https://corsproxy.io/?https://api.juejin.cn/tag_api/v1/query_category_briefs',
        'https://api.allorigins.win/raw?url=https://api.juejin.cn/tag_api/v1/query_category_briefs',
        'https://cors-anywhere.herokuapp.com/https://api.juejin.cn/tag_api/v1/query_category_briefs',
        'https://thingproxy.freeboard.io/fetch/https://api.juejin.cn/tag_api/v1/query_category_briefs',
        'https://cors.eu.org/https://api.juejin.cn/tag_api/v1/query_category_briefs',
        'https://proxy.cors.sh/https://api.juejin.cn/tag_api/v1/query_category_briefs'
    ];

    for (let i = 0; i < apis.length; i++) {
        try {
            console.log(`Trying Juejin Category API ${i + 1}: ${apis[i]}`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时
            
            const response = await fetch(apis[i], {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.log(`Juejin Category API ${i + 1} failed with status: ${response.status}`);
                continue;
            }
            
            const data = await response.json();
            console.log(`Juejin Category API ${i + 1} response:`, data);
            
            if (data && data.err_no === 0 && data.data && Array.isArray(data.data)) {
                // 查找后端分类
                const backendCategory = data.data.find((cat: any) => 
                    cat.category_name === '后端' || cat.category_url === 'backend'
                );
                
                if (backendCategory) {
                    console.log(`Found backend category: ${backendCategory.category_name} (ID: ${backendCategory.category_id})`);
                    return backendCategory.category_id;
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`Juejin Category API ${i + 1} timed out`);
            } else {
                console.log(`Juejin Category API ${i + 1} error:`, error);
            }
            continue;
        }
    }
    
    console.log('All Juejin Category APIs failed, using default backend category ID');
    return '6809637769959178254'; // 默认后端分类ID
}



async function fetchCsdnHotSearch(): Promise<HotSearchItem[]> {
    const apis = [
        {
            url: 'https://api.allorigins.win/raw?url=https://blog.csdn.net/phoenix/web/blog/hot-rank',
            headers: {}
        },
        {
            url: 'https://cors-anywhere.herokuapp.com/https://blog.csdn.net/phoenix/web/blog/hot-rank',
            headers: {}
        },
        {
            url: 'https://thingproxy.freeboard.io/fetch/https://blog.csdn.net/phoenix/web/blog/hot-rank',
            headers: {}
        },
        {
            url: 'https://cors.eu.org/https://blog.csdn.net/phoenix/web/blog/hot-rank',
            headers: {}
        },
        {
            url: 'https://proxy.cors.sh/https://blog.csdn.net/phoenix/web/blog/hot-rank',
            headers: { 'x-cors-api-key': 'temp_1234567890' }
        }
    ];

    for (let i = 0; i < apis.length; i++) {
        try {
            console.log(`Trying CSDN API ${i + 1}: ${apis[i].url}`);
            
            // 添加超时控制
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
            
            const response = await fetch(apis[i].url, {
                headers: {
                    ...apis[i].headers,
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.log(`CSDN API ${i + 1} failed with status: ${response.status}`);
                continue;
            }
            
            const data = await response.json();
            console.log(`CSDN API ${i + 1} response:`, data);
            
            if (data && data.code === 200 && Array.isArray(data.data)) {
                console.log(`CSDN API ${i + 1} succeeded`);
                return data.data.map((item: any) => ({
                    title: item.articleTitle,
                    url: item.articleDetailUrl,
                }));
            } else {
                console.log(`CSDN API ${i + 1} response format is not as expected.`);
                continue;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`CSDN API ${i + 1} timed out`);
            } else {
                console.log(`CSDN API ${i + 1} error:`, error);
            }
            continue;
        }
    }

    console.log('All CSDN APIs failed, using mock data');
    return [
        { title: 'CSDN热门文章1', url: 'https://blog.csdn.net/article1' },
        { title: 'CSDN热门文章2', url: 'https://blog.csdn.net/article2' },
        { title: 'CSDN热门文章3', url: 'https://blog.csdn.net/article3' },
        { title: 'CSDN热门文章4', url: 'https://blog.csdn.net/article4' },
        { title: 'CSDN热门文章5', url: 'https://blog.csdn.net/article5' }
    ];
}

async function fetchBilibiliHotSearch(): Promise<HotSearchItem[]> {
    const apis = [
        {
            url: 'https://api.allorigins.win/raw?url=https://api.bilibili.com/x/web-interface/popular',
            headers: {}
        },
        {
            url: 'https://cors-anywhere.herokuapp.com/https://api.bilibili.com/x/web-interface/popular',
            headers: {}
        },
        {
            url: 'https://thingproxy.freeboard.io/fetch/https://api.bilibili.com/x/web-interface/popular',
            headers: {}
        },
        {
            url: 'https://cors.eu.org/https://api.bilibili.com/x/web-interface/popular',
            headers: {}
        },
        {
            url: 'https://proxy.cors.sh/https://api.bilibili.com/x/web-interface/popular/series/one',
            headers: { 'x-cors-api-key': 'temp_1234567890' }
        }
    ];

    for (let i = 0; i < apis.length; i++) {
        try {
            console.log(`Trying Bilibili API ${i + 1}: ${apis[i].url}`);
            
            // 添加超时控制
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
            
            const response = await fetch(apis[i].url, {
                headers: {
                    ...apis[i].headers,
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.log(`Bilibili API ${i + 1} failed with status: ${response.status}`);
                continue;
            }
            
            const data = await response.json();
            if (data && data.code === 0 && data.data && Array.isArray(data.data.list)) {
                console.log(`Bilibili API ${i + 1} succeeded`);
                return data.data.list.map((item: any) => ({
                    title: item.title,
                    url: `https://www.bilibili.com/video/${item.bvid}`,
                }));
            } else {
                console.log(`Bilibili API ${i + 1} response format is not as expected.`);
                continue;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`Bilibili API ${i + 1} timed out`);
            } else {
                console.log(`Bilibili API ${i + 1} error:`, error);
            }
            continue;
        }
    }

    console.log('All Bilibili APIs failed, using mock data');
    return [
        { title: 'B站热门视频1', url: 'https://www.bilibili.com/video/BV1xx411c7mu' },
        { title: 'B站热门视频2', url: 'https://www.bilibili.com/video/BV1xx411c7mv' },
        { title: 'B站热门视频3', url: 'https://www.bilibili.com/video/BV1xx411c7mw' },
        { title: 'B站热门视频4', url: 'https://www.bilibili.com/video/BV1xx411c7mx' },
        { title: 'B站热门视频5', url: 'https://www.bilibili.com/video/BV1xx411c7my' }
    ];
}

async function getJuejinHotSearch(): Promise<HotSearchItem[]> {
  // 动态获取后端分类ID
  const cate_id = await getJuejinCategory();
  console.log(`Using Juejin category ID: ${cate_id}`);
  
  const apis = [
    {
      url: 'https://corsproxy.io/?https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed',
      method: 'POST',
      body: JSON.stringify({
        id_type: 2,
        sort_type: 3,
        cate_id: cate_id,
        cursor: "0",
        limit: 20
      })
    },
    {
      url: 'https://api.allorigins.win/raw?url=https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed',
      method: 'POST',
      body: JSON.stringify({
        id_type: 2,
        sort_type: 3,
        cate_id: cate_id,
        cursor: "0",
        limit: 20
      })
    },
    {
      url: 'https://cors-anywhere.herokuapp.com/https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed',
      method: 'POST',
      body: JSON.stringify({
        id_type: 2,
        sort_type: 3,
        cate_id: cate_id,
        cursor: "0",
        limit: 20
      })
    },
    {
      url: 'https://thingproxy.freeboard.io/fetch/https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed',
      method: 'POST',
      body: JSON.stringify({
        id_type: 2,
        sort_type: 3,
        cate_id: cate_id,
        cursor: "0",
        limit: 20
      })
    },
    {
      url: 'https://cors.eu.org/https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed',
      method: 'POST',
      body: JSON.stringify({
        id_type: 2,
        sort_type: 3,
        cate_id: cate_id,
        cursor: "0",
        limit: 20
      })
    },
    {
      url: 'https://proxy.cors.sh/https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed',
      method: 'POST',
      body: JSON.stringify({
        id_type: 2,
        sort_type: 3,
        cate_id: cate_id,
        cursor: "0",
        limit: 20
      }),
      headers: {
        'x-cors-api-key': 'temp_1234567890'
      }
    }
  ];

  for (let i = 0; i < apis.length; i++) {
    try {
      console.log(`Trying Juejin API ${i + 1}: ${apis[i].url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(apis[i].url, {
        method: apis[i].method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...apis[i].headers
        },
        body: apis[i].body,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.log(`Juejin API ${i + 1} failed with status: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`Juejin API ${i + 1} response:`, data);
      
      if (data && data.err_no === 0 && data.data && Array.isArray(data.data)) {
        console.log(`Juejin API ${i + 1} succeeded, found ${data.data.length} articles`);
        return data.data.map(item => {
          const title = item.article_info?.title || '掘金热门文章';
          const url = `https://juejin.cn/post/${item.article_id}`;
          return { title, url };
        });
      }
      
      if (data && !data.data) {
        console.log(`Juejin API ${i + 1} - No data field found`);
        continue;
      } else {
        console.log(`Juejin API ${i + 1} response format is not as expected.`);
        continue;
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Juejin API ${i + 1} timed out`);
      } else {
        console.log(`Juejin API ${i + 1} error:`, error);
      }
      continue;
    }
  }
  
  console.log('All Juejin APIs failed, using mock data');
  return [
    { title: '掘金热门文章1', url: 'https://juejin.cn/post/123456' },
    { title: '掘金热门文章2', url: 'https://juejin.cn/post/123457' },
    { title: '掘金热门文章3', url: 'https://juejin.cn/post/123458' },
    { title: '掘金热门文章4', url: 'https://juejin.cn/post/123459' },
    { title: '掘金热门文章5', url: 'https://juejin.cn/post/123460' }
  ];
}



async function fetchGithubHotSearch(): Promise<HotSearchItem[]> {
    // GitHub Trending API
    const apis = [
        {
            url: 'https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=10',
            headers: {}
        },
        {
            url: 'https://api.allorigins.win/raw?url=https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=10',
            headers: {}
        },
        {
            url: 'https://cors-anywhere.herokuapp.com/https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=10',
            headers: {}
        },
        {
            url: 'https://thingproxy.freeboard.io/fetch/https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=10',
            headers: {}
        },
        {
            url: 'https://proxy.cors.sh/https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=10',
            headers: { 'x-cors-api-key': 'temp_1234567890' }
        },
        {
            url: 'https://cors.eu.org/https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=10',
            headers: {}
        }
    ];

    for (let i = 0; i < apis.length; i++) {
        try {
            console.log(`Trying GitHub API ${i + 1}: ${apis[i].url}`);
            
            // 添加超时控制
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
            
            const response = await fetch(apis[i].url, {
                headers: {
                    ...apis[i].headers,
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.log(`GitHub API ${i + 1} failed with status: ${response.status}`);
                continue;
            }
            
            const data = await response.json();
            
            if (data && Array.isArray(data.items)) {
                console.log(`GitHub API ${i + 1} succeeded, found ${data.items.length} repositories`);
                return data.items.map((item: any) => ({
                    title: `${item.name} - ${item.description?.substring(0, 50) || ''}`,
                    url: item.html_url,
                }));
            } else {
                console.log(`GitHub API ${i + 1} response format is not as expected.`);
                continue;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`GitHub API ${i + 1} timed out`);
            } else {
                console.log(`GitHub API ${i + 1} error:`, error);
            }
            continue;
        }
    }

    console.log('All GitHub APIs failed, using mock data');
    return [
        { title: 'GitHub热门项目1', url: 'https://github.com/project1' },
        { title: 'GitHub热门项目2', url: 'https://github.com/project2' },
        { title: 'GitHub热门项目3', url: 'https://github.com/project3' },
        { title: 'GitHub热门项目4', url: 'https://github.com/project4' },
        { title: 'GitHub热门项目5', url: 'https://github.com/project5' }
    ];
}

async function fetchCnblogsHotSearch(): Promise<HotSearchItem[]> {
    // 博客园热门文章API
    const apis = [
        {
            url: 'https://www.cnblogs.com/aggsite/headline',
            headers: {}
        },
        {
            url: 'https://api.allorigins.win/raw?url=https://www.cnblogs.com/aggsite/headline',
            headers: {}
        },
        {
            url: 'https://cors-anywhere.herokuapp.com/https://www.cnblogs.com/aggsite/headline',
            headers: {}
        },
        {
            url: 'https://thingproxy.freeboard.io/fetch/https://www.cnblogs.com/aggsite/headline',
            headers: {}
        },
        {
            url: 'https://proxy.cors.sh/https://www.cnblogs.com/aggsite/headline',
            headers: { 'x-cors-api-key': 'temp_1234567890' }
        },
        {
            url: 'https://cors.eu.org/https://www.cnblogs.com/aggsite/headline',
            headers: {}
        },
        {
            url: 'https://api.allorigins.win/get?url=https://www.cnblogs.com/cate/108703/',
            headers: {}
        }
    ];

    for (let i = 0; i < apis.length; i++) {
        try {
            console.log(`Trying CNBlogs API ${i + 1}: ${apis[i].url}`);
            
            // 添加超时控制
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
            
            const response = await fetch(apis[i].url, {
                headers: {
                    ...apis[i].headers,
                    'Accept': 'application/json,text/html',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.log(`CNBlogs API ${i + 1} failed with status: ${response.status}`);
                continue;
            }
            
            // 判断是否为JSON响应
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                
                // 处理headline API的JSON格式
                if (Array.isArray(data)) {
                    console.log(`CNBlogs API ${i + 1} succeeded (JSON format)`);
                    return data.slice(0, 10).map((item: any) => ({
                        title: item.Title || item.title,
                        url: item.Url || item.url,
                    }));
                }
                // 处理allorigins格式
                else if (data && data.contents) {
                    const html = data.contents;
                    return parseCnblogsHTML(html);
                }
            } else {
                // 处理HTML响应
                const html = await response.text();
                const items = parseCnblogsHTML(html);
                if (items.length > 0) {
                    console.log(`CNBlogs API ${i + 1} succeeded (HTML format), found ${items.length} items`);
                    return items;
                }
            }
            
            console.log(`CNBlogs API ${i + 1} response format is not as expected.`);
            continue;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`CNBlogs API ${i + 1} timed out`);
            } else {
                console.log(`CNBlogs API ${i + 1} error:`, error);
            }
            continue;
        }
    }

    console.log('All CNBlogs APIs failed, using mock data');
    return [
        { title: '博客园热门文章1', url: 'https://www.cnblogs.com/article1' },
        { title: '博客园热门文章2', url: 'https://www.cnblogs.com/article2' },
        { title: '博客园热门文章3', url: 'https://www.cnblogs.com/article3' },
        { title: '博客园热门文章4', url: 'https://www.cnblogs.com/article4' },
        { title: '博客园热门文章5', url: 'https://www.cnblogs.com/article5' }
    ];
}

function parseCnblogsHTML(html: string): HotSearchItem[] {
    const items: HotSearchItem[] = [];
    
    // 解析博客园HTML页面中的文章链接
    const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let match;
    let count = 0;
    
    while ((match = linkRegex.exec(html)) !== null && count < 10) {
        const url = match[1];
        const title = match[2].trim();
        
        // 过滤掉无效链接和太短的标题
        if (url && title && 
            title.length > 10 && 
            !url.includes('javascript:') && 
            !url.includes('#') &&
            (url.startsWith('https://www.cnblogs.com/') || url.startsWith('/p/'))) {
            
            const fullUrl = url.startsWith('/') ? `https://www.cnblogs.com${url}` : url;
            items.push({
                title: title,
                url: fullUrl
            });
            count++;
        }
    }
    
    return items;
}

function renderHotSearch(elementId: string, items: HotSearchItem[]) {
    const container = document.getElementById(elementId);
    if (container) {
        const ul = document.createElement('ul');
        ul.className = 'trm-list';
        items.forEach((item, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.url;
            a.target = '_blank';
            
            // 创建排名数字元素
            const rankSpan = document.createElement('span');
            rankSpan.className = 'hot-rank';
            rankSpan.textContent = (index + 1).toString();
            
            // 创建标题元素
            const titleSpan = document.createElement('span');
            titleSpan.className = 'hot-title';
            titleSpan.textContent = item.title;
            
            // 组装链接内容
            a.appendChild(rankSpan);
            a.appendChild(titleSpan);
            
            li.appendChild(a);
            ul.appendChild(li);
        });
        container.innerHTML = '';
        container.appendChild(ul);
    }
}

export async function initHotSearch() {
    const csdnItems = await fetchCsdnHotSearch();
    renderHotSearch('csdn-hot-search', csdnItems);

    const bilibiliItems = await fetchBilibiliHotSearch();
    renderHotSearch('bilibili-hot-search', bilibiliItems);

    const juejinItems = await getJuejinHotSearch();
    renderHotSearch('juejin-hot-search', juejinItems);

    const githubItems = await fetchGithubHotSearch();
    renderHotSearch('github-hot-search', githubItems);

    const cnblogsItems = await fetchCnblogsHotSearch();
    renderHotSearch('cnblogs-hot-search', cnblogsItems);
}

document.addEventListener('DOMContentLoaded', initHotSearch);
document.addEventListener('swup:contentReplaced', initHotSearch);