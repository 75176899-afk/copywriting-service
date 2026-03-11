## 文件3：game-save.js（游戏保存系统）
在 `D:\修仙游戏\` 中创建 `game-save.js`：
```javascript
// 游戏保存系统
class GameSaveSystem {
    constructor() {
        this.saveKey = "immortal_game_save";
        this.autoSaveInterval = null;
        this.saveData = null;
    }
    
    // 初始化保存系统
    init() {
        this.load();
        
        // 设置自动保存
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, 30000); // 每30秒自动保存
        
        console.log("游戏保存系统初始化完成");
    }
    
    // 加载游戏数据
    load() {
        try {
            const savedData = localStorage.getItem(this.saveKey);
            if (savedData) {
                this.saveData = JSON.parse(savedData);
                console.log("游戏数据加载成功");
                return this.saveData;
            } else {
                // 创建新游戏数据
                this.saveData = this.createNewGame();
                this.save();
                console.log("创建新游戏数据");
                return this.saveData;
            }
        } catch (error) {
            console.error("加载游戏数据失败:", error);
            this.saveData = this.createNewGame();
            return this.saveData;
        }
    }
    
    // 创建新游戏数据
    createNewGame() {
        return {
            version: "1.0.0",
            player: {
                name: "修仙者",
                realm: "炼气期",
                realmLevel: 1,
                cultivation: 100,
                spiritStone: 1000,
                lifespan: 100,
                cultivationSpeed: 10,
                totalCultivation: 100
            },
            stats: {
                playTime: 0,
                breakthroughCount: 0,
                explorationCount: 0,
                totalSpiritStoneEarned: 1000,
                totalCultivationEarned: 100
            },
            inventory: {
                items: [],
                equipment: []
            },
            skills: {
                learned: [],
                points: 0
            },
            achievements: {
                unlocked: [],
                progress: {}
            },
            payment: {
                firstCharge: false,
                monthlyCard: false,
                totalSpent: 0,
                packages: []
            },
            settings: {
                sound: true,
                music: true,
                autoSave: true,
                notifications: true
            },
            timestamp: Date.now(),
            lastSave: Date.now()
        };
    }
    
    // 保存游戏数据
    save() {
        try {
            if (this.saveData) {
                this.saveData.lastSave = Date.now();
                this.saveData.stats.playTime = Math.floor((Date.now() - this.saveData.timestamp) / 1000);
                
                localStorage.setItem(this.saveKey, JSON.stringify(this.saveData));
                console.log("游戏数据保存成功");
                return true;
            }
            return false;
        } catch (error) {
            console.error("保存游戏数据失败:", error);
            return false;
        }
    }
    
    // 自动保存
    autoSave() {
        if (this.saveData && this.saveData.settings.autoSave) {
            this.save();
            this.showNotification("游戏已自动保存");
        }
    }
    
    // 导出游戏数据
    exportData() {
        if (this.saveData) {
            const dataStr = JSON.stringify(this.saveData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `immortal_game_save_${Date.now()}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            return true;
        }
return false;
}
// 导入游戏数据
importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                
                // 验证数据格式
                if (this.validateSaveData(importedData)) {
                    this.saveData = importedData;
                    this.save();
                    resolve(true);
                } else {
                    reject("存档数据格式无效");
                }
            } catch (error) {
                reject("解析存档数据失败");
            }
        };
        
        reader.onerror = () => {
            reject("读取文件失败");
        };
        
        reader.readAsText(file);
    });
}
// 验证保存数据
validateSaveData(data) {
    return data && 
           data.player && 
           data.stats && 
           data.version;
}
// 删除存档
deleteSave() {
    localStorage.removeItem(this.saveKey);
    this.saveData = null;
    console.log("游戏存档已删除");
    return true;
}
// 显示通知
showNotification(message) {
    if (this.saveData && this.saveData.settings.notifications) {
        // 在实际游戏中可以显示UI通知
        console.log("通知:", message);
    }
}
// 更新玩家数据
updatePlayerData(updates) {
    if (this.saveData && this.saveData.player) {
        Object.assign(this.saveData.player, updates);
        this.save();
        return true;
    }
    return false;
}
// 更新统计数据
updateStats(updates) {
    if (this.saveData && this.saveData.stats) {
        Object.assign(this.saveData.stats, updates);
        this.save();
        return true;
    }
    return false;
}
// 添加成就
addAchievement(achievementId) {
    if (this.saveData && this.saveData.achievements) {
        if (!this.saveData.achievements.unlocked.includes(achievementId)) {
            this.saveData.achievements.unlocked.push(achievementId);
            this.save();
            this.showNotification(`成就解锁: ${achievementId}`);
            return true;
        }
    }
    return false;
}
// 获取游戏时间
getPlayTime() {
    if (this.saveData) {
        return this.saveData.stats.playTime;
    }
    return 0;
}
// 清理
cleanup() {
    if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
    }
}
}

// 创建全局保存系统实例
const gameSaveSystem = new GameSaveSystem();

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
gameSaveSystem.init();
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
gameSaveSystem.save();
gameSaveSystem.cleanup();
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
module.exports = GameSaveSystem;
}