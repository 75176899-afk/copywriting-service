// 游戏配置文件
const GameConfig = {
    // 游戏版本
    version: "1.0.0",
    gameName: "修仙放置手游",
    
    // 境界配置
    realms: [
        { name: "炼气期", requirement: 0, lifespanBonus: 0, cultivationSpeed: 10 },
        { name: "筑基期", requirement: 500, lifespanBonus: 100, cultivationSpeed: 15 },
        { name: "金丹期", requirement: 2000, lifespanBonus: 300, cultivationSpeed: 25 },
        { name: "元婴期", requirement: 8000, lifespanBonus: 800, cultivationSpeed: 40 },
        { name: "化神期", requirement: 30000, lifespanBonus: 2000, cultivationSpeed: 60 },
        { name: "渡劫期", requirement: 100000, lifespanBonus: 5000, cultivationSpeed: 100 }
    ],
    
    // 修炼操作配置
    cultivationActions: {
        normal: { name: "普通修炼", cultivationGain: 10, timeCost: 0 },
        meditation: { name: "闭关修炼", cultivationGain: 50, lifespanCost: 1 },
        auto: { name: "自动修炼", cultivationGain: 5, interval: 3000 }
    },
    
    // 探索配置
    explorationRewards: [
        { type: "灵石", amount: 50, probability: 0.4, message: "发现小型灵石矿脉" },
        { type: "灵石", amount: 200, probability: 0.3, message: "发现中型灵石矿脉" },
        { type: "灵石", amount: 500, probability: 0.2, message: "发现大型灵石矿脉" },
        { type: "修为", amount: 100, probability: 0.08, message: "偶遇仙人指点" },
        { type: "奇遇", amount: 1000, probability: 0.02, message: "获得上古传承" }
    ],
    
    // 付费配置
    paymentPackages: [
        { id: "first_charge", name: "首充6元礼包", price: 6, 
          rewards: { spiritStone: 5000, cultivation: 1000, cultivationSpeed: 5 } },
        { id: "monthly_card", name: "月卡30元", price: 30, 
          rewards: { spiritStone: 3000, dailySpiritStone: 1000 } },
        { id: "package_68", name: "68元礼包", price: 68, 
          rewards: { spiritStone: 6800, cultivation: 2000 } },
        { id: "package_128", name: "128元礼包", price: 128, 
          rewards: { spiritStone: 15000, cultivation: 5000 } },
        { id: "package_328", name: "328元礼包", price: 328, 
          rewards: { spiritStone: 40000, cultivation: 15000 } },
        { id: "package_648", name: "648元礼包", price: 648, 
          rewards: { spiritStone: 80000, cultivation: 30000, cultivationSpeed: 10 } }
    ],
    
    // 技能系统配置
    skills: [
        { id: "cultivation_mastery", name: "修炼精通", description: "增加修炼效率20%", cost: 1000 },
        { id: "exploration_expert", name: "探索专家", description: "探索奖励增加30%", cost: 2000 },
        { id: "lifespan_extension", name: "延寿诀", description: "寿命增加50年", cost: 5000 },
        { id: "breakthrough_insight", name: "突破顿悟", description: "突破成功率+15%", cost: 8000 }
    ],
    
    // 世界地图配置
    worldMap: [
        { name: "青云山", level: 1, reward: { spiritStone: 100, cultivation: 50 } },
        { name: "幽冥谷", level: 2, reward: { spiritStone: 300, cultivation: 150 } },
        { name: "天剑峰", level: 3, reward: { spiritStone: 800, cultivation: 400 } },
        { name: "龙渊海", level: 4, reward: { spiritStone: 2000, cultivation: 1000 } },
        { name: "仙界之门", level: 5, reward: { spiritStone: 5000, cultivation: 3000 } }
    ],
    
    // 月卡系统配置
    monthlySystem: {
        dailyReward: 1000,
        vipLevels: [
            { level: 1, name: "普通修士", requirement: 0, benefits: ["每日登录奖励"] },
            { level: 2, name: "内门弟子", requirement: 100, benefits: ["修炼速度+10%", "探索奖励+20%"] },
            { level: 3, name: "核心真传", requirement: 500, benefits: ["自动修炼", "突破成功率+10%"] },
            { level: 4, name: "长老", requirement: 2000, benefits: ["双倍奖励", "专属称号"] },
            { level: 5, name: "太上长老", requirement: 10000, benefits: ["全属性+30%", "无限自动修炼"] }
        ]
    },
    
    // 游戏保存配置
    saveConfig: {
        autoSaveInterval: 30000, // 30秒自动保存
        maxSaveSlots: 5,
        cloudSaveEnabled: false
    },
    
    // 游戏平衡参数
    balance: {
        cultivationDecayRate: 0.01, // 修为衰减率
        maxLifespan: 10000,
        minCultivationSpeed: 5,
maxCultivationSpeed: 200
}
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
module.exports = GameConfig;
}