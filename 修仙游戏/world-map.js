// 世界地图系统
class WorldMapSystem {
    constructor() {
        this.regions = [
            {
                id: "qingyun_mountain",
                name: "青云山",
                level: 1,
                description: "灵气充沛的仙山，适合新手修炼",
                unlocked: true,
                reward: { spiritStone: 100, cultivation: 50 },
                exploreTime: 5000, // 5秒
                exploreCost: { spiritStone: 10 }
            },
            {
                id: "youming_valley",
                name: "幽冥谷",
                level: 2,
                description: "阴气森森的山谷，有妖兽出没",
                unlocked: false,
                requirement: { realm: "筑基期", cultivation: 500 },
                reward: { spiritStone: 300, cultivation: 150 },
                exploreTime: 10000, // 10秒
                exploreCost: { spiritStone: 30 }
            },
            {
                id: "tianjian_peak",
                name: "天剑峰",
                level: 3,
                description: "剑修圣地，剑气纵横",
                unlocked: false,
                requirement: { realm: "金丹期", cultivation: 2000 },
                reward: { spiritStone: 800, cultivation: 400 },
                exploreTime: 15000, // 15秒
                exploreCost: { spiritStone: 80 }
            },
            {
                id: "longyuan_sea",
                name: "龙渊海",
                level: 4,
                description: "深海龙宫，宝物无数",
                unlocked: false,
                requirement: { realm: "元婴期", cultivation: 8000 },
                reward: { spiritStone: 2000, cultivation: 1000 },
                exploreTime: 20000, // 20秒
                exploreCost: { spiritStone: 200 }
            },
            {
                id: "immortal_gate",
                name: "仙界之门",
                level: 5,
                description: "通往仙界的门户，终极挑战",
                unlocked: false,
                requirement: { realm: "化神期", cultivation: 30000 },
                reward: { spiritStone: 5000, cultivation: 3000 },
                exploreTime: 30000, // 30秒
                exploreCost: { spiritStone: 500 }
            }
        ];
        
        this.currentExploration = null;
        this.explorationTimer = null;
    }
    
    // 初始化地图系统
    init() {
        this.loadMapProgress();
        console.log("世界地图系统初始化完成");
    }
    
    // 加载地图进度
    loadMapProgress() {
        try {
            const savedProgress = localStorage.getItem("immortal_game_map");
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                this.regions = progress.regions || this.regions;
            }
        } catch (error) {
            console.error("加载地图进度失败:", error);
        }
    }
    
    // 保存地图进度
    saveMapProgress() {
        try {
            const progress = {
                regions: this.regions,
                timestamp: Date.now()
            };
            localStorage.setItem("immortal_game_map", JSON.stringify(progress));
        } catch (error) {
            console.error("保存地图进度失败:", error);
        }
    }
    
    // 检查区域是否解锁
    checkRegionUnlock(region, playerData) {
        if (region.unlocked) return true;
if (region.requirement) {
const realmIndex = this.getRealmIndex(playerData.realm);
const requiredRealmIndex = this.getRealmIndex(region.requirement.realm);
        if (realmIndex >= requiredRealmIndex && 
            playerData.cultivation >= region.requirement.cultivation) {
            region.unlocked = true;
            this.saveMapProgress();
            return true;
        }
    }
    
    return false;
}
// 获取境界索引
getRealmIndex(realmName) {
    const realms = ["炼气期", "筑基期", "金丹期", "元婴期", "化神期", "渡劫期"];
    return realms.indexOf(realmName);
}
// 开始探索
startExploration(regionId, playerData) {
    const region = this.regions.find(r => r.id === regionId);
    
    if (!region) {
        return { success: false, message: "区域不存在" };
    }
    
    if (!this.checkRegionUnlock(region, playerData)) {
        return { success: false, message: "区域未解锁" };
    }
    
    if (this.currentExploration) {
        return { success: false, message: "已有探索在进行中" };
    }
    
    // 检查探索成本
    if (playerData.spiritStone < region.exploreCost.spiritStone) {
        return { success: false, message: "灵石不足" };
    }
    
    // 扣除成本
    playerData.spiritStone -= region.exploreCost.spiritStone;
    
    // 开始探索
    this.currentExploration = {
        regionId: regionId,
        startTime: Date.now(),
        endTime: Date.now() + region.exploreTime,
        reward: region.reward
    };
    
    // 设置探索计时器
    this.explorationTimer = setTimeout(() => {
        this.completeExploration();
    }, region.exploreTime);
    
    return { 
        success: true, 
        message: `开始探索${region.name}，预计${region.exploreTime/1000}秒后完成`,
        exploration: this.currentExploration
    };
}
// 完成探索
completeExploration() {
    if (!this.currentExploration) return;
    
    const region = this.regions.find(r => r.id === this.currentExploration.regionId);
    
    // 发放奖励
    const reward = {
        spiritStone: this.currentExploration.reward.spiritStone,
        cultivation: this.currentExploration.reward.cultivation
    };
    
    // 触发事件
    this.onExplorationComplete({
        region: region,
        reward: reward,
        exploration: this.currentExploration
    });
    
    // 清理
    this.currentExploration = null;
    this.explorationTimer = null;
}
// 探索完成事件
onExplorationComplete(data) {
    // 在实际游戏中，这里会更新UI和游戏数据
    console.log("探索完成:", data);
    
    // 显示奖励
    this.showRewardNotification(data);
}
// 显示奖励通知
showRewardNotification(data) {
    const message = `探索${data.region.name}完成！\n` +
                   `获得：${data.reward.spiritStone}灵石 + ${data.reward.cultivation}修为`;
    
    // 在实际游戏中可以显示UI通知
    alert(message);
}
// 取消探索
cancelExploration() {
    if (this.currentExploration && this.explorationTimer) {
        clearTimeout(this.explorationTimer);
        this.currentExploration = null;
        this.explorationTimer = null;
        return true;
    }
    return false;
}
// 获取探索剩余时间
getExplorationRemainingTime() {
    if (!this.currentExploration) return 0;
    
    const remaining = this.currentExploration.endTime - Date.now();
    return Math.max(0, remaining);
}
// 获取所有可探索区域
getAvailableRegions(playerData) {
    return this.regions.filter(region => 
        this.checkRegionUnlock(region, playerData)
    );
}
// 获取区域信息
getRegionInfo(regionId) {
    return this.regions.find(r => r.id === regionId);
}
// 更新区域解锁状态
updateRegionUnlocks(playerData) {
this.regions.forEach(region => {
this.checkRegionUnlock(region, playerData);
});
this.saveMapProgress();
}
// 获取探索进度
getExplorationProgress() {
    if (!this.currentExploration) return null;
    
    const totalTime = this.currentExploration.endTime - this.currentExploration.startTime;
    const elapsed = Date.now() - this.currentExploration.startTime;
    const progress = Math.min(100, (elapsed / totalTime) * 100);
    
    return {
        progress: progress,
        remainingTime: this.getExplorationRemainingTime(),
        region: this.getRegionInfo(this.currentExploration.regionId)
    };
}
}

// 创建全局地图系统实例
const worldMapSystem = new WorldMapSystem();

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
worldMapSystem.init();
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
module.exports = WorldMapSystem;
}
// 世界地图系统 - 完整版
class WorldMapSystem {
    constructor() {
        this.regions = [
            {
                id: "qingyun_mountain",
                name: "青云山",
                level: 1,
                description: "灵气充沛的修炼圣地，适合新手修士",
                unlocked: true,
                explored: false,
                rewards: { spiritStone: 100, cultivation: 50 },
                requirements: { realm: "炼气期" }
            },
            {
                id: "youming_valley",
                name: "幽冥谷",
                level: 2,
                description: "阴气森森的山谷，隐藏着古老秘密",
                unlocked: false,
                explored: false,
                rewards: { spiritStone: 300, cultivation: 150 },
                requirements: { realm: "筑基期", cultivation: 500 }
            },
            {
                id: "tianjian_peak",
                name: "天剑峰",
                level: 3,
                description: "剑修圣地，剑气纵横三万里",
                unlocked: false,
                explored: false,
                rewards: { spiritStone: 800, cultivation: 400 },
                requirements: { realm: "金丹期", cultivation: 2000 }
            },
            {
                id: "longyuan_sea",
                name: "龙渊海",
                level: 4,
                description: "深海龙宫，蕴藏无尽宝藏",
                unlocked: false,
                explored: false,
                rewards: { spiritStone: 2000, cultivation: 1000 },
                requirements: { realm: "元婴期", cultivation: 8000 }
            },
            {
                id: "immortal_gate",
                name: "仙界之门",
                level: 5,
                description: "通往仙界的门户，只有最强者才能进入",
                unlocked: false,
                explored: false,
                rewards: { spiritStone: 5000, cultivation: 3000 },
                requirements: { realm: "化神期", cultivation: 30000 }
            }
        ];
        
        this.currentRegion = null;
        this.explorationProgress = 0;
        this.explorationTimer = null;
    }
    
    // 初始化
    init() {
        this.loadMapData();
        console.log("世界地图系统初始化完成");
        return this;
    }
    
    // 加载地图数据
    loadMapData() {
        try {
            const savedData = localStorage.getItem("immortal_game_worldmap");
            if (savedData) {
                const data = JSON.parse(savedData);
                this.regions = data.regions || this.regions;
                this.currentRegion = data.currentRegion;
                this.explorationProgress = data.explorationProgress || 0;
            }
        } catch (error) {
            console.error("加载地图数据失败:", error);
        }
        return this;
    }
    
    // 保存地图数据
    saveMapData() {
        try {
            const data = {
                regions: this.regions,
                currentRegion: this.currentRegion,
                explorationProgress: this.explorationProgress
            };
            localStorage.setItem("immortal_game_worldmap", JSON.stringify(data));
        } catch (error) {
            console.error("保存地图数据失败:", error);
        }
        return this;
    }
    
    // 检查区域是否解锁
    checkRegionUnlock(playerData) {
        const unlockedRegions = [];
        
        this.regions.forEach(region => {
            if (!region.unlocked) {
                const meetsRealm = !region.requirements.realm || 
                    this.compareRealms(playerData.realm, region.requirements.realm);
                const meetsCultivation = !region.requirements.cultivation || 
                    playerData.cultivation >= region.requirements.cultivation;
                
                if (meetsRealm && meetsCultivation) {
                    region.unlocked = true;
                    unlockedRegions.push(region);
                }
            }
        });
        
        if (unlockedRegions.length > 0) {
            this.saveMapData();
        }
return unlockedRegions;
}
// 比较境界
compareRealms(playerRealm, requiredRealm) {
    const realmOrder = ["炼气期", "筑基期", "金丹期", "元婴期", "化神期", "渡劫期"];
    const playerIndex = realmOrder.indexOf(playerRealm);
    const requiredIndex = realmOrder.indexOf(requiredRealm);
    
    return playerIndex >= requiredIndex;
}
// 探索区域
exploreRegion(regionId, playerData) {
    const region = this.regions.find(r => r.id === regionId);
    
    if (!region) {
        return { success: false, message: "区域不存在" };
    }
    
    if (!region.unlocked) {
        return { success: false, message: "区域未解锁" };
    }
    
    if (region.explored) {
        return { success: false, message: "区域已探索完成" };
    }
    
    if (this.currentRegion) {
        return { success: false, message: "已有探索在进行中" };
    }
    
    // 开始探索
    this.currentRegion = regionId;
    this.explorationProgress = 0;
    
    // 设置探索计时器
    const exploreTime = 10000; // 10秒探索时间
    
    this.explorationTimer = setInterval(() => {
        this.explorationProgress += 10;
        
        if (this.explorationProgress >= 100) {
            clearInterval(this.explorationTimer);
            this.completeExploration(region, playerData);
        }
    }, exploreTime / 10);
    
    return {
        success: true,
        message: `开始探索${region.name}，预计${exploreTime/1000}秒后完成`,
        region: region,
        exploreTime: exploreTime
    };
}
// 完成探索
completeExploration(region, playerData) {
    region.explored = true;
    this.currentRegion = null;
    this.explorationProgress = 0;
    
    // 给予奖励
    playerData.spiritStone += region.rewards.spiritStone;
    playerData.cultivation += region.rewards.cultivation;
    
    this.saveMapData();
    
    // 触发事件
    this.onExplorationComplete(region);
    
    return {
        success: true,
        message: `探索完成！获得${region.rewards.spiritStone}灵石和${region.rewards.cultivation}修为`,
        rewards: region.rewards
    };
}
// 探索完成事件
onExplorationComplete(region) {
    // 显示探索完成消息
    const message = `🎉 成功探索${region.name}！\n` +
                   `获得：${region.rewards.spiritStone}灵石 + ${region.rewards.cultivation}修为`;
    
    // 在实际游戏中可以显示UI通知
    if (typeof window.showNotification === 'function') {
        window.showNotification(message);
    } else {
        alert(message);
    }
}
// 取消探索
cancelExploration() {
    if (this.explorationTimer) {
        clearInterval(this.explorationTimer);
        this.explorationTimer = null;
        this.currentRegion = null;
        this.explorationProgress = 0;
        return true;
    }
    return false;
}
// 获取可探索区域
getExplorableRegions(playerData) {
    this.checkRegionUnlock(playerData);
    
    return this.regions
        .filter(region => region.unlocked && !region.explored)
        .map(region => ({
            id: region.id,
            name: region.name,
            description: region.description,
            level: region.level,
            rewards: region.rewards,
            requirements: region.requirements
        }));
}
// 获取已探索区域
getExploredRegions() {
    return this.regions
        .filter(region => region.explored)
        .map(region => ({
            id: region.id,
            name: region.name,
            level: region.level,
            rewards: region.rewards,
            exploredAt: Date.now()
        }));
}
// 获取探索进度
getExplorationProgress() {
    if (!this.currentRegion) return null;
const region = this.regions.find(r => r.id === this.currentRegion);
    return {
        region: region,
        progress: this.explorationProgress,
        currentRegion: this.currentRegion
    };
}
// 显示地图界面
showMapInterface(playerData) {
    const explorableRegions = this.getExplorableRegions(playerData);
    const exploredRegions = this.getExploredRegions();
    const currentProgress = this.getExplorationProgress();
    
    let html = `
        <div class="map-interface">
            <h3>🗺️ 世界地图</h3>
            
            ${currentProgress ? `
            <div class="current-exploration">
                <h4>当前探索:</h4>
                <p>正在探索: ${currentProgress.region.name}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${currentProgress.progress}%"></div>
                </div>
                <p>进度: ${currentProgress.progress}%</p>
                <button onclick="window.worldMapSystem.cancelExploration()" class="cancel-btn">取消探索</button>
            </div>
            ` : ''}
            
            <div class="explorable-regions">
                <h4>可探索区域:</h4>
    `;
    
    if (explorableRegions.length > 0) {
        explorableRegions.forEach(region => {
            html += `
                <div class="region-item">
                    <div class="region-header">
                        <strong>${region.name}</strong>
                        <span class="region-level">Lv.${region.level}</span>
                    </div>
                    <div class="region-description">${region.description}</div>
                    <div class="region-rewards">
                        奖励: ${region.rewards.spiritStone}灵石 + ${region.rewards.cultivation}修为
                    </div>
                    <button onclick="window.worldMapSystem.exploreRegion('${region.id}', window.gameData)" 
                            class="explore-btn" ${currentProgress ? 'disabled' : ''}>
                        探索
                    </button>
                </div>
            `;
        });
    } else {
        html += `<p>暂无可探索区域，提升境界解锁更多区域</p>`;
    }
    
    html += `
            </div>
            
            ${exploredRegions.length > 0 ? `
            <div class="explored-regions">
                <h4>已探索区域:</h4>
                <ul>
            ` : ''}
            
            ${exploredRegions.map(region => `
                <li>${region.name} (Lv.${region.level}) - 已探索</li>
            `).join('')}
            
            ${exploredRegions.length > 0 ? `
                </ul>
            </div>
            ` : ''}
        </div>
    `;
    
    return html;
}
}

// 创建全局地图系统实例
const worldMapSystem = new WorldMapSystem();

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
worldMapSystem.init();
window.worldMapSystem = worldMapSystem; // 暴露到全局
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
module.exports = WorldMapSystem;
}
