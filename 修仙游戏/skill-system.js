// 技能系统 - 修仙放置手游
class SkillSystem {
    constructor() {
        this.skills = [
            {
                id: "cultivation_mastery",
                name: "修炼精通",
                description: "增加修炼效率20%",
                cost: 1000,
                level: 0,
                maxLevel: 5,
                effect: (level) => ({ cultivationBonus: 0.2 * level })
            },
            {
                id: "exploration_expert",
                name: "探索专家",
                description: "探索奖励增加30%",
                cost: 2000,
                level: 0,
                maxLevel: 3,
                effect: (level) => ({ explorationBonus: 0.3 * level })
            },
            {
                id: "lifespan_extension",
                name: "延寿诀",
                description: "寿命增加50年",
                cost: 5000,
                level: 0,
                maxLevel: 2,
                effect: (level) => ({ lifespanBonus: 50 * level })
            },
            {
                id: "breakthrough_insight",
                name: "突破顿悟",
                description: "突破成功率+15%",
                cost: 8000,
                level: 0,
                maxLevel: 4,
                effect: (level) => ({ breakthroughBonus: 0.15 * level })
            },
            {
                id: "spirit_stone_magnet",
                name: "灵石吸引",
                description: "自动收集灵石",
                cost: 15000,
                level: 0,
                maxLevel: 1,
                effect: (level) => ({ autoCollect: level > 0 })
            },
            {
                id: "auto_cultivation",
                name: "自动修炼",
                description: "开启自动修炼功能",
                cost: 30000,
                level: 0,
                maxLevel: 1,
                effect: (level) => ({ autoCultivate: level > 0 })
            }
        ];
        
        this.skillPoints = 0;
        this.learnedSkills = [];
    }
    
    // 初始化技能系统
    init() {
        this.loadSkills();
        console.log("技能系统初始化完成");
        return this;
    }
    
    // 加载技能数据
    loadSkills() {
        try {
            const savedSkills = localStorage.getItem("immortal_game_skills");
            if (savedSkills) {
                const data = JSON.parse(savedSkills);
                this.skills = data.skills || this.skills;
                this.skillPoints = data.skillPoints || 0;
                this.learnedSkills = data.learnedSkills || [];
            }
        } catch (error) {
            console.error("加载技能数据失败:", error);
        }
        return this;
    }
    
    // 保存技能数据
    saveSkills() {
        try {
            const data = {
                skills: this.skills,
                skillPoints: this.skillPoints,
                learnedSkills: this.learnedSkills
            };
            localStorage.setItem("immortal_game_skills", JSON.stringify(data));
        } catch (error) {
            console.error("保存技能数据失败:", error);
        }
        return this;
    }
    
    // 获取技能点数
    getSkillPoints() {
        return this.skillPoints;
    }
    
    // 增加技能点数
    addSkillPoints(points) {
        this.skillPoints += points;
        this.saveSkills();
        return this.skillPoints;
    }
    
    // 学习技能
    learnSkill(skillId) {
        const skill = this.skills.find(s => s.id === skillId);
        
        if (!skill) {
            return { success: false, message: "技能不存在" };
        }
        
        if (skill.level >= skill.maxLevel) {
            return { success: false, message: "技能已达最大等级" };
        }
        
        if (this.skillPoints < skill.cost) {
            return { success: false, message: "技能点数不足" };
        }
        
        // 扣除技能点数
        this.skillPoints -= skill.cost;
        
        // 升级技能
        skill.level++;
        
        // 添加到已学习技能列表
        if (!this.learnedSkills.includes(skillId)) {
this.learnedSkills.push(skillId);
}
    // 保存数据
    this.saveSkills();
    
    return { 
        success: true, 
        message: `成功学习 ${skill.name} Lv.${skill.level}`,
        skill: skill
    };
}
// 获取技能效果
getSkillEffects() {
    const effects = {
        cultivationBonus: 0,
        explorationBonus: 0,
        lifespanBonus: 0,
        breakthroughBonus: 0,
        autoCollect: false,
        autoCultivate: false
    };
    
    this.skills.forEach(skill => {
        if (skill.level > 0) {
            const skillEffect = skill.effect(skill.level);
            Object.keys(skillEffect).forEach(key => {
                if (typeof effects[key] === 'number') {
                    effects[key] += skillEffect[key];
                } else {
                    effects[key] = skillEffect[key];
                }
            });
        }
    });
    
    return effects;
}
// 获取所有技能
getAllSkills() {
    return this.skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        cost: skill.cost,
        level: skill.level,
        maxLevel: skill.maxLevel,
        canLearn: this.skillPoints >= skill.cost && skill.level < skill.maxLevel
    }));
}
// 获取已学习技能
getLearnedSkills() {
    return this.skills
        .filter(skill => skill.level > 0)
        .map(skill => ({
            id: skill.id,
            name: skill.name,
            level: skill.level,
            maxLevel: skill.maxLevel,
            effect: skill.effect(skill.level)
        }));
}
// 重置技能（需要确认）
resetSkills() {
    if (confirm("确定要重置所有技能吗？这将返还50%的技能点数。")) {
        const totalSpent = this.skills.reduce((sum, skill) => {
            return sum + (skill.cost * skill.level);
        }, 0);
        
        const refund = Math.floor(totalSpent * 0.5);
        
        // 重置所有技能
        this.skills.forEach(skill => {
            skill.level = 0;
        });
        
        this.learnedSkills = [];
        this.skillPoints += refund;
        
        this.saveSkills();
        
        return {
            success: true,
            message: `技能已重置，返还${refund}技能点数`,
            refund: refund
        };
    }
    
    return { success: false, message: "取消重置" };
}
// 显示技能界面
showSkillInterface() {
    const skills = this.getAllSkills();
    const effects = this.getSkillEffects();
    
    let html = `
        <div class="skill-interface">
            <h3>🧠 技能系统</h3>
            <div class="skill-points">
                <strong>技能点数:</strong> ${this.skillPoints}
            </div>
            
            <div class="current-effects">
                <h4>当前效果:</h4>
                <ul>
                    ${effects.cultivationBonus > 0 ? `<li>修炼效率: +${(effects.cultivationBonus * 100).toFixed(0)}%</li>` : ''}
                    ${effects.explorationBonus > 0 ? `<li>探索奖励: +${(effects.explorationBonus * 100).toFixed(0)}%</li>` : ''}
                    ${effects.lifespanBonus > 0 ? `<li>寿命增加: +${effects.lifespanBonus}年</li>` : ''}
                    ${effects.breakthroughBonus > 0 ? `<li>突破成功率: +${(effects.breakthroughBonus * 100).toFixed(0)}%</li>` : ''}
                    ${effects.autoCollect ? `<li>自动收集灵石</li>` : ''}
                    ${effects.autoCultivate ? `<li>自动修炼</li>` : ''}
                </ul>
            </div>
            
            <div class="skill-list">
                <h4>可学习技能:</h4>
    `;
skills.forEach(skill => {
html += <div class="skill-item ${skill.canLearn ? 'can-learn' : 'cannot-learn'}"> <div class="skill-header"> <strong>${skill.name}</strong> <span>Lv.${skill.level}/${skill.maxLevel}</span> </div> <div class="skill-description">${skill.description}</div> <div class="skill-cost">消耗: ${skill.cost} 技能点数</div> ${skill.canLearn ? <button onclick="window.skillSystem.learnSkill('${skill.id}')" class="skill-learn-btn">学习</button>: <button class="skill-learn-btn disabled" disabled>${skill.level >= skill.maxLevel ? '已满级' : '点数不足'}</button>} </div>;
});
    html += `
            </div>
            
            <div class="skill-actions">
                <button onclick="window.skillSystem.resetSkills()" class="reset-btn">重置技能</button>
            </div>
        </div>
    `;
    
    return html;
}
// 应用技能效果到游戏数据
applyEffects(gameData) {
    const effects = this.getSkillEffects();
    
    // 应用修炼加成
    if (effects.cultivationBonus > 0) {
        gameData.cultivationSpeed = Math.floor(gameData.cultivationSpeed * (1 + effects.cultivationBonus));
    }
    
    // 应用寿命加成
    if (effects.lifespanBonus > 0) {
        gameData.lifespan += effects.lifespanBonus;
    }
    
    // 应用自动修炼
    if (effects.autoCultivate) {
        gameData.autoCultivate = true;
    }
    
    return gameData;
}
// 技能点数奖励（成就、突破等）
awardSkillPoints(source, amount) {
    this.addSkillPoints(amount);
    
    const messages = {
        'breakthrough': `突破境界获得${amount}技能点数`,
        'achievement': `达成成就获得${amount}技能点数`,
        'exploration': `探索发现获得${amount}技能点数`,
        'level_up': `等级提升获得${amount}技能点数`
    };
    
    return {
        success: true,
        message: messages[source] || `获得${amount}技能点数`,
        newTotal: this.skillPoints
    };
}
}

// 创建全局技能系统实例
const skillSystem = new SkillSystem();

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
skillSystem.init();
window.skillSystem = skillSystem; // 暴露到全局
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
module.exports = SkillSystem;
}
## 文件5：world-map.js（世界地图系统）
在 `D:\修仙游戏\` 中创建 `world-map.js`：
```javascript
// 世界地图系统
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
    
    // 开始探索
    this.currentRegion = regionId;
    this.explorationProgress = 0;
    
    // 模拟探索过程
    const exploreInterval = setInterval(() => {
        this.explorationProgress += 10;
        
        if (this.explorationProgress >= 100) {
            clearInterval(exploreInterval);
            this.completeExploration(region, playerData);
        }
    }, 1000);
    
    return {
        success: true,
        message: `开始探索${region.name}`,
        region: region,
        interval: exploreInterval
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
    // 可以在这里触发UI更新或其他事件
    console.log(`探索完成: ${region.name}`);
    
    // 显示探索完成消息
    if (typeof window.showMessage === 'function') {
        window.showMessage(`成功探索${region.name}，获得丰厚奖励！`);
    }
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
            rewards: region.rewards
        }));
}
// 获取已探索区域
getExploredRegions() {
    return this.regions