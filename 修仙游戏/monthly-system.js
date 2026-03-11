// 月卡/会员系统 - 修仙放置手游
class MonthlySystem {
    constructor() {
        this.monthlyCard = {
            active: false,
            purchaseDate: null,
            expiryDate: null,
            dailyReward: 1000,
            claimedToday: false
        };
        
        this.vipLevels = [
            { level: 1, name: "普通修士", requirement: 0, benefits: ["每日登录奖励"] },
            { level: 2, name: "内门弟子", requirement: 100, benefits: ["修炼速度+10%", "探索奖励+20%"] },
            { level: 3, name: "核心真传", requirement: 500, benefits: ["自动修炼", "突破成功率+10%"] },
            { level: 4, name: "长老", requirement: 2000, benefits: ["双倍奖励", "专属称号"] },
            { level: 5, name: "太上长老", requirement: 10000, benefits: ["全属性+30%", "无限自动修炼"] }
        ];
        
        this.vipPoints = 0;
        this.currentVipLevel = 1;
        this.dailyLoginStreak = 0;
        this.lastLoginDate = null;
    }
    
    // 初始化
    init() {
        this.loadMonthlyData();
        this.checkDailyLogin();
        console.log("月卡系统初始化完成");
        return this;
    }
    
    // 加载月卡数据
    loadMonthlyData() {
        try {
            const savedData = localStorage.getItem("immortal_game_monthly");
            if (savedData) {
                const data = JSON.parse(savedData);
                this.monthlyCard = data.monthlyCard || this.monthlyCard;
                this.vipPoints = data.vipPoints || 0;
                this.currentVipLevel = data.currentVipLevel || 1;
                this.dailyLoginStreak = data.dailyLoginStreak || 0;
                this.lastLoginDate = data.lastLoginDate;
            }
        } catch (error) {
            console.error("加载月卡数据失败:", error);
        }
        return this;
    }
    
    // 保存月卡数据
    saveMonthlyData() {
        try {
            const data = {
                monthlyCard: this.monthlyCard,
                vipPoints: this.vipPoints,
                currentVipLevel: this.currentVipLevel,
                dailyLoginStreak: this.dailyLoginStreak,
                lastLoginDate: this.lastLoginDate
            };
            localStorage.setItem("immortal_game_monthly", JSON.stringify(data));
        } catch (error) {
            console.error("保存月卡数据失败:", error);
        }
        return this;
    }
    
    // 检查每日登录
    checkDailyLogin() {
        const today = new Date().toDateString();
        
        if (this.lastLoginDate !== today) {
            this.dailyLoginStreak++;
            this.lastLoginDate = today;
            
            // 给予每日登录奖励
            const reward = this.giveDailyLoginReward();
            
            this.saveMonthlyData();
            
            return {
                success: true,
                message: `第${this.dailyLoginStreak}天连续登录，获得${reward}灵石`,
                streak: this.dailyLoginStreak,
                reward: reward
            };
        }
        
        return { success: false, message: "今日已登录" };
    }
    
    // 给予每日登录奖励
    giveDailyLoginReward() {
        let reward = 100; // 基础奖励
        
        // 连续登录奖励
        if (this.dailyLoginStreak >= 7) reward += 200;
        if (this.dailyLoginStreak >= 30) reward += 500;
        if (this.dailyLoginStreak >= 100) reward += 1000;
        
        // VIP等级加成
        const vipBonus = this.currentVipLevel * 50;
        reward += vipBonus;
        
        // 月卡加成
        if (this.monthlyCard.active) {
            reward *= 2;
        }
        
        return reward;
    }
    
    // 购买月卡
    purchaseMonthlyCard() {
        if (this.monthlyCard.active) {
            return { success: false, message: "月卡已激活" };
        }
        
        this.monthlyCard.active = true;
        this.monthlyCard.purchaseDate = Date.now();
        this.monthlyCard.expiryDate = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30天
        this.monthlyCard.claimedToday = false;
        
        // 增加VIP点数
        this.addVipPoints(100);
this.saveMonthlyData();
    return {
        success: true,
        message: "月卡购买成功！有效期30天",
        expiryDate: new Date(this.monthlyCard.expiryDate).toLocaleDateString(),
        vipPointsAdded: 100
    };
}
// 领取月卡每日奖励
claimMonthlyReward() {
    if (!this.monthlyCard.active) {
        return { success: false, message: "未激活月卡" };
    }
    
    if (this.monthlyCard.claimedToday) {
        return { success: false, message: "今日奖励已领取" };
    }
    
    // 检查月卡是否过期
    if (Date.now() > this.monthlyCard.expiryDate) {
        this.monthlyCard.active = false;
        this.saveMonthlyData();
        return { success: false, message: "月卡已过期" };
    }
    
    this.monthlyCard.claimedToday = true;
    
    const reward = this.monthlyCard.dailyReward;
    
    this.saveMonthlyData();
    
    return {
        success: true,
        message: `领取月卡每日奖励：${reward}灵石`,
        reward: reward
    };
}
// 增加VIP点数
addVipPoints(points) {
    this.vipPoints += points;
    
    // 检查VIP等级提升
    const levelUpResult = this.checkVipLevelUp();
    
    this.saveMonthlyData();
    
    return {
        success: true,
        message: `获得${points}VIP点数`,
        totalPoints: this.vipPoints,
        currentLevel: this.currentVipLevel,
        levelUp: levelUpResult.levelUp,
        newLevel: levelUpResult.newLevel
    };
}
// 检查VIP等级提升
checkVipLevelUp() {
    const newLevel = this.calculateVipLevel();
    
    if (newLevel > this.currentVipLevel) {
        const oldLevel = this.currentVipLevel;
        this.currentVipLevel = newLevel;
        
        return {
            levelUp: true,
            oldLevel: oldLevel,
            newLevel: newLevel,
            benefits: this.getVipLevel().benefits
        };
    }
    
    return { levelUp: false };
}
// 计算VIP等级
calculateVipLevel() {
    for (let i = this.vipLevels.length - 1; i >= 0; i--) {
        if (this.vipPoints >= this.vipLevels[i].requirement) {
            return this.vipLevels[i].level;
        }
    }
    return 1;
}
// 获取当前VIP等级信息
getVipLevel() {
    return this.vipLevels.find(level => level.level === this.currentVipLevel) || this.vipLevels[0];
}
// 获取VIP进度
getVipProgress() {
    const currentLevel = this.getVipLevel();
    const nextLevel = this.vipLevels.find(level => level.level === this.currentVipLevel + 1);
    
    if (!nextLevel) {
        return {
            currentLevel: currentLevel,
            nextLevel: null,
            progress: 100,
            pointsToNext: 0
        };
    }
    
    const pointsInCurrentLevel = this.vipPoints - currentLevel.requirement;
    const pointsNeededForNext = nextLevel.requirement - currentLevel.requirement;
    const progress = Math.min(100, (pointsInCurrentLevel / pointsNeededForNext) * 100);
    
    return {
        currentLevel: currentLevel,
        nextLevel: nextLevel,
        progress: progress,
        pointsToNext: nextLevel.requirement - this.vipPoints
    };
}
// 获取VIP加成效果
getVipBenefits() {
    const level = this.getVipLevel();
    const benefits = {
        cultivationSpeed: 0,
        explorationBonus: 0,
        breakthroughBonus: 0,
        autoCultivate: false,
        doubleRewards: false,
        allStatsBonus: 0
    };
    
    if (level.level >= 2) {
        benefits.cultivationSpeed = 0.1;
        benefits.explorationBonus = 0.2;
    }
    
    if (level.level >= 3) {
        benefits.autoCultivate = true;
        benefits.breakthroughBonus = 0.1;
    }
if (level.level >= 4) {
benefits.doubleRewards = true;
}
    if (level.level >= 5) {
        benefits.allStatsBonus = 0.3;
    }
    
    return benefits;
}
// 显示月卡界面
showMonthlyInterface() {
    const vipProgress = this.getVipProgress();
    const vipBenefits = this.getVipBenefits();
    const monthlyStatus = this.monthlyCard.active ? 
        `激活中 (到期: ${new Date(this.monthlyCard.expiryDate).toLocaleDateString()})` : 
        "未激活";
    
    let html = `
        <div class="monthly-interface">
            <h3>💰 月卡/VIP系统</h3>
            
            <div class="monthly-card">
                <h4>月卡状态:</h4>
                <p><strong>${monthlyStatus}</strong></p>
                ${this.monthlyCard.active ? `
                    <p>每日奖励: ${this.monthlyCard.dailyReward}灵石</p>
                    ${!this.monthlyCard.claimedToday ? 
                        `<button onclick="window.monthlySystem.claimMonthlyReward()" class="claim-btn">领取今日奖励</button>` : 
                        `<p class="claimed">今日奖励已领取</p>`
                    }
                ` : `
                    <button onclick="window.monthlySystem.purchaseMonthlyCard()" class="purchase-btn">购买月卡 (30天)</button>
                    <p class="price">价格: 30元</p>
                `}
            </div>
            
            <div class="vip-system">
                <h4>VIP等级: ${vipProgress.currentLevel.name} (Lv.${vipProgress.currentLevel.level})</h4>
                <div class="vip-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${vipProgress.progress}%"></div>
                    </div>
                    <p>VIP点数: ${this.vipPoints}</p>
                    ${vipProgress.nextLevel ? 
                        `<p>距离下一级还需: ${vipProgress.pointsToNext}点</p>` : 
                        `<p>已达最高等级</p>`
                    }
                </div>
                
                <div class="vip-benefits">
                    <h5>当前特权:</h5>
                    <ul>
                        ${vipProgress.currentLevel.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="login-streak">
                <h4>连续登录: ${this.dailyLoginStreak}天</h4>
                <p>每日登录奖励已自动发放</p>
            </div>
        </div>
    `;
    
    return html;
}
// 重置每日状态
resetDailyStatus() {
    this.monthlyCard.claimedToday = false;
    this.saveMonthlyData();
}
}

// 创建全局月卡系统实例
const monthlySystem = new MonthlySystem();

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
monthlySystem.init();
window.monthlySystem = monthlySystem; // 暴露到全局
});

// 每日重置
setInterval(() => {
const now = new Date();
if (now.getHours() === 0 && now.getMinutes() === 0) {
monthlySystem.resetDailyStatus();
}
}, 60000); // 每分钟检查一次

// 导出
if (typeof module !== 'undefined' && module.exports) {
module.exports = MonthlySystem;
}
