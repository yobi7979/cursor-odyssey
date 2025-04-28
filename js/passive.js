class Passive {
    constructor(name, description, effect) {
        this.name = name;
        this.description = description;
        this.effect = effect;
    }

    apply(player) {
        this.effect(player);
    }
}

class PassiveManager {
    constructor() {
        this.availablePassives = [
            new Passive(
                '데미지 감소',
                '받는 데미지가 20% 감소합니다.',
                (player) => {
                    player.defense *= 1.2;
                }
            ),
            new Passive(
                '회복 효과 증가',
                '받는 회복 효과가 30% 증가합니다.',
                (player) => {
                    player.healingMultiplier = 1.3;
                }
            ),
            new Passive(
                '장목 충전',
                '스킬 쿨다운이 15% 감소합니다.',
                (player) => {
                    player.cooldownReduction = 0.15;
                }
            )
        ];
    }

    getRandomPassives(count) {
        const shuffled = [...this.availablePassives].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
} 