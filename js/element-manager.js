class GameElement {
    constructor(type, properties) {
        this.type = type;
        this.properties = properties;
        this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.isSelected = false;
    }

    update(properties) {
        this.properties = { ...this.properties, ...properties };
    }

    render(ctx) {
        // 각 요소 타입별 렌더링 로직
        switch (this.type) {
            case 'text':
                this.renderText(ctx);
                break;
            case 'image':
                this.renderImage(ctx);
                break;
            case 'shape':
                this.renderShape(ctx);
                break;
            case 'timer':
                this.renderTimer(ctx);
                break;
        }
    }

    renderText(ctx) {
        ctx.font = `${this.properties.fontSize}px ${this.properties.fontFamily}`;
        ctx.fillStyle = this.properties.color;
        ctx.textAlign = this.properties.textAlign;
        ctx.fillText(this.properties.text, this.properties.x, this.properties.y);
    }

    renderImage(ctx) {
        if (this.properties.image) {
            ctx.drawImage(
                this.properties.image,
                this.properties.x,
                this.properties.y,
                this.properties.width,
                this.properties.height
            );
        }
    }

    renderShape(ctx) {
        ctx.fillStyle = this.properties.color;
        switch (this.properties.shapeType) {
            case 'rectangle':
                ctx.fillRect(
                    this.properties.x,
                    this.properties.y,
                    this.properties.width,
                    this.properties.height
                );
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(
                    this.properties.x,
                    this.properties.y,
                    this.properties.radius,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                break;
        }
    }

    renderTimer(ctx) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        ctx.font = `${this.properties.fontSize}px ${this.properties.fontFamily}`;
        ctx.fillStyle = this.properties.color;
        ctx.textAlign = this.properties.textAlign;
        ctx.fillText(timeString, this.properties.x, this.properties.y);
    }
}

class ElementManager {
    constructor() {
        this.elements = [];
        this.selectedElement = null;
    }

    addElement(type, properties) {
        const element = new GameElement(type, properties);
        this.elements.push(element);
        return element;
    }

    removeElement(id) {
        this.elements = this.elements.filter(element => element.id !== id);
        if (this.selectedElement && this.selectedElement.id === id) {
            this.selectedElement = null;
        }
    }

    selectElement(id) {
        this.elements.forEach(element => {
            element.isSelected = element.id === id;
        });
        this.selectedElement = this.elements.find(element => element.id === id);
    }

    updateElement(id, properties) {
        const element = this.elements.find(element => element.id === id);
        if (element) {
            element.update(properties);
        }
    }

    render(ctx) {
        this.elements.forEach(element => {
            element.render(ctx);
        });
    }
} 