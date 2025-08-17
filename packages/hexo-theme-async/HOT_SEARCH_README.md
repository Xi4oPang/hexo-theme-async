# 热门搜索功能使用说明

## 功能概述

热门搜索功能可以自动获取各个平台的热门内容，包括：
- B站热门视频
- CSDN技术文章
- 掘金热门文章
- 虎扑热门话题
- 什么值得买热门商品

## 配置说明

### 1. 启用功能

在主题配置文件 `_config.yml` 中确保以下配置：

```yaml
# Hot search | 热门搜索
hot_search:
  enable: true # 启用热门搜索功能
  el: .trm-hot-search-list # 容器选择器
  sources: # 数据源配置
    - name: Bilibili
      url: https://api.bilibili.com/x/web-interface/popular
    - name: CSDN
      url: https://blog.csdn.net/phoenix/web/blog/hot-rank
    - name: Juejin
      url: https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed
    - name: Hupu
      url: https://bbs.hupu.com/all-gambia
    - name: SMZDM
      url: https://www.smzdm.com/api/v1/hot_list
```

### 2. 插件配置

确保在 `assets.plugin` 中配置了热门搜索插件：

```yaml
assets:
  plugin:
    hexo_theme_async:
      hot_search: js/plugins/hot-search.js
```

### 3. 导航菜单

在 `top_bars` 中添加热门搜索页面链接：

```yaml
top_bars:
  - title: menu.hot_search
    url: /hot-search/
```

## 使用方法

### 1. 访问页面

访问 `/hot-search/` 路径即可看到热门搜索页面。

### 2. 功能特性

- **智能降级**：当API请求失败时，自动显示模拟数据
- **实时更新**：页面加载后自动获取最新热门内容
- **响应式设计**：支持移动端和桌面端
- **美观界面**：排名、标题、热度信息清晰展示

### 3. 数据更新

热门内容会在页面加载后1秒自动更新，如果API请求失败，会显示备用数据。

## 故障排除

### 1. 页面显示空白

- 检查浏览器控制台是否有错误信息
- 确认JavaScript插件是否正确加载
- 验证HTML模板结构是否正确

### 2. API请求失败

- 检查网络连接
- 确认API端点是否可访问
- 查看浏览器控制台的错误日志

### 3. 样式显示异常

- 确认CSS文件是否正确引入
- 检查浏览器开发者工具中的样式
- 验证CSS选择器是否正确

## 自定义配置

### 1. 修改数据源

可以在 `sources` 配置中添加或修改数据源：

```yaml
sources:
  - name: 自定义平台
    url: https://api.example.com/hot
```

### 2. 调整样式

可以通过修改 `source/css/_components/hot-search.less` 来自定义样式。

### 3. 扩展功能

可以在 `source/js/plugins/hot-search.js` 中添加新的平台支持。

## 注意事项

1. **API限制**：某些平台可能有API调用频率限制
2. **网络环境**：确保服务器能够访问外部API
3. **数据准确性**：模拟数据仅作为备用，实际使用建议配置有效的API
4. **性能考虑**：API请求会延迟1秒执行，避免阻塞页面加载

## 技术支持

如果遇到问题，请：
1. 检查浏览器控制台的错误信息
2. 确认配置文件格式正确
3. 验证所有相关文件是否存在
4. 查看网络请求是否成功





