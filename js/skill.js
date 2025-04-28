class Skill {
    constructor(name, description, cooldown, effect) {
        this.name = name;
        this.description = description;
        this.cooldown = 0;
        this.maxCooldown = cooldown;
        this.effect = effect;
    }

    use(player) {
        if (this.cooldown <= 0) {
            this.effect(player);
            this.cooldown = this.maxCooldown;
            return true;
        }
        return false;
    }
}

class SkillManager {
    constructor() {
        this.availableSkills = [
            new Skill(
                '공격장',
                '공격력이 50% 증가합니다.',
                10,
                (player) => {
                    player.attackPower *= 1.5;
                    setTimeout(() => {
                        player.attackPower /= 1.5;
                    }, 5000);
                }
            ),
            new Skill(
                '장갑치',
                '방어력이 50% 증가합니다.',
                10,
                (player) => {
                    player.defense *= 1.5;
                    setTimeout(() => {
                        player.defense /= 1.5;
                    }, 5000);
                }
            ),
            new Skill(
                '시간적 회복',
                '5초 동안 초당 체력의 10%를 회복합니다.',
                20,
                (player) => {
                    const healInterval = setInterval(() => {
                        player.heal(player.maxHealth * 0.1);
                    }, 1000);
                    setTimeout(() => {
                        clearInterval(healInterval);
                    }, 5000);
                }
            ),
            new Skill(
                '무적 상태',
                '3초 동안 무적 상태가 됩니다.',
                30,
                (player) => {
                    const originalDefense = player.defense;
                    player.defense = 9999;
                    setTimeout(() => {
                        player.defense = originalDefense;
                    }, 3000);
                }
            )
        ];
    }

    getRandomSkills(count) {
        const shuffled = [...this.availableSkills].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
} 