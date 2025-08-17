# Hexo Theme Async - 热搜功能

这是一个为Hexo主题Async添加的多平台热搜功能，支持获取掘金、贴吧、CSDN、B站、虎扑、GitHub、博客园等平台的热门内容。

## 功能特性

- 🚀 **多平台支持**: 掘金、贴吧、CSDN、B站、虎扑、GitHub、博客园
- 🔄 **智能重试**: 使用多个CORS代理服务，自动重试失败的请求
- ⏱️ **超时控制**: 15秒请求超时，避免长时间等待
- 🎯 **优雅降级**: 所有API失败时自动使用模拟数据
- 📱 **响应式设计**: 适配各种设备屏幕
- 🎨 **美观UI**: 现代化的卡片式设计

## 使用方法

### 1. 在主题模板中添加容器

在需要显示热搜的页面模板中添加以下HTML容器：

```html
<!-- 掘金热搜 -->
<div id="juejin-hot-search"></div>

<!-- 贴吧热搜 -->
<div id="tieba-hot-search"></div>

<!-- CSDN热搜 -->
<div id="csdn-hot-search"></div>

<!-- B站热搜 -->
<div id="bilibili-hot-search"></div>

<!-- 虎扑热搜 -->
<div id="hupu-hot-search"></div>

<!-- GitHub热搜 -->
<div id="github-hot-search"></div>

<!-- 博客园热搜 -->
<div id="cnblogs-hot-search"></div>
```

### 2. 自动初始化

热搜功能会在以下时机自动初始化：
- 页面加载完成时 (`DOMContentLoaded`)
- 使用Swup进行页面切换时 (`swup:contentReplaced`)

### 3. 手动初始化

如果需要手动初始化，可以调用：

```javascript
import { initHotSearch } from './plugins/hot-search';
initHotSearch();
```

## 技术实现

### CORS代理服务

由于浏览器的同源策略限制，我们使用多个CORS代理服务来访问第三方API：

1. **api.allorigins.win** - 稳定可靠的CORS代理
2. **cors-anywhere.herokuapp.com** - 广泛使用的CORS代理
3. **thingproxy.freeboard.io** - 免费的CORS代理服务
4. **cors.eu.org** - 欧洲地区的CORS代理
5. **proxy.cors.sh** - 需要API密钥的CORS代理

### 错误处理策略

- **超时控制**: 每个请求15秒超时
- **重试机制**: 自动尝试下一个CORS代理
- **降级处理**: 所有API失败时使用模拟数据
- **用户反馈**: 清晰显示成功/失败状态

### 数据格式

每个热搜项目包含以下字段：

```typescript
interface HotSearchItem {
    title: string;    // 标题
    url: string;      // 链接
}
```

## 开发说明

### 构建项目

```bash
npm run build
```

构建后的文件会输出到 `../hexo-theme-async/source/js/main.js`

### 开发模式

```bash
npm run dev
```

### 添加新的热搜源

1. 创建新的获取函数，例如：

```typescript
async function fetchNewPlatformHotSearch(): Promise<HotSearchItem[]> {
    const apis = [
        {
            url: 'https://cors-proxy.com/api-url',
            headers: {}
        }
    ];
    
    // 实现获取逻辑...
}
```

2. 在 `initHotSearch` 函数中添加调用：

```typescript
const newPlatformItems = await fetchNewPlatformHotSearch();
renderHotSearch('new-platform-hot-search', newPlatformItems);
```

3. 在模板中添加容器：

```html
<div id="new-platform-hot-search"></div>
```

## 测试

### 本地测试

使用提供的测试页面 `test-juejin.html` 来测试掘金API：

```bash
# 在浏览器中打开
file:///path/to/test-juejin.html
```

### 注意事项

- 本地文件访问时可能遇到CORS限制
- 建议在真实的Web服务器上测试
- 某些CORS代理服务可能有访问频率限制

## 故障排除

### 常见问题

1. **所有API都失败**
   - 检查网络连接
   - 确认CORS代理服务可用性
   - 查看浏览器控制台错误信息

2. **请求超时**
   - 网络延迟较高
   - CORS代理服务响应慢
   - 可以适当增加超时时间

3. **数据格式错误**
   - 第三方API可能已更新
   - 需要调整数据解析逻辑

### 调试技巧

- 查看浏览器控制台日志
- 使用网络面板检查请求状态
- 测试单个CORS代理服务

## 许可证

本项目遵循MIT许可证。

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 更新日志

### v1.1.0
- 添加超时控制和更好的错误处理
- 优化CORS代理服务列表
- 改进用户界面和用户体验
- 添加详细的调试信息

### v1.0.0
- 初始版本发布
- 支持7个平台的热搜功能
- 基本的CORS代理支持

