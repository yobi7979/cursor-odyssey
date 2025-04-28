class PropertyPanel {
    constructor(elementManager) {
        this.elementManager = elementManager;
        this.panel = document.getElementById('property-content');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('add-text').addEventListener('click', () => this.addTextElement());
        document.getElementById('add-image').addEventListener('click', () => this.addImageElement());
        document.getElementById('add-shape').addEventListener('click', () => this.addShapeElement());
        document.getElementById('add-timer').addEventListener('click', () => this.addTimerElement());
    }

    addTextElement() {
        const element = this.elementManager.addElement('text', {
            text: '새 텍스트',
            x: 100,
            y: 100,
            fontSize: 16,
            fontFamily: 'Arial',
            color: '#000000',
            textAlign: 'left'
        });
        this.updatePropertyPanel(element);
    }

    addImageElement() {
        const element = this.elementManager.addElement('image', {
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            image: null
        });
        this.updatePropertyPanel(element);
    }

    addShapeElement() {
        const element = this.elementManager.addElement('shape', {
            shapeType: 'rectangle',
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            color: '#000000'
        });
        this.updatePropertyPanel(element);
    }

    addTimerElement() {
        const element = this.elementManager.addElement('timer', {
            x: 100,
            y: 100,
            fontSize: 16,
            fontFamily: 'Arial',
            color: '#000000',
            textAlign: 'left'
        });
        this.updatePropertyPanel(element);
    }

    updatePropertyPanel(element) {
        this.panel.innerHTML = '';
        
        if (!element) return;

        const properties = this.getPropertiesForType(element.type);
        properties.forEach(property => {
            const propertyItem = document.createElement('div');
            propertyItem.className = 'property-item';
            
            const label = document.createElement('label');
            label.textContent = property.label;
            
            const input = this.createInputForProperty(property, element);
            
            propertyItem.appendChild(label);
            propertyItem.appendChild(input);
            this.panel.appendChild(propertyItem);
        });
    }

    getPropertiesForType(type) {
        switch (type) {
            case 'text':
                return [
                    { name: 'text', label: '텍스트', type: 'text' },
                    { name: 'x', label: 'X 위치', type: 'number' },
                    { name: 'y', label: 'Y 위치', type: 'number' },
                    { name: 'fontSize', label: '글자 크기', type: 'number' },
                    { name: 'color', label: '색상', type: 'color' },
                    { name: 'textAlign', label: '정렬', type: 'select', options: ['left', 'center', 'right'] }
                ];
            case 'image':
                return [
                    { name: 'x', label: 'X 위치', type: 'number' },
                    { name: 'y', label: 'Y 위치', type: 'number' },
                    { name: 'width', label: '너비', type: 'number' },
                    { name: 'height', label: '높이', type: 'number' }
                ];
            case 'shape':
                return [
                    { name: 'shapeType', label: '도형 종류', type: 'select', options: ['rectangle', 'circle'] },
                    { name: 'x', label: 'X 위치', type: 'number' },
                    { name: 'y', label: 'Y 위치', type: 'number' },
                    { name: 'width', label: '너비', type: 'number' },
                    { name: 'height', label: '높이', type: 'number' },
                    { name: 'color', label: '색상', type: 'color' }
                ];
            case 'timer':
                return [
                    { name: 'x', label: 'X 위치', type: 'number' },
                    { name: 'y', label: 'Y 위치', type: 'number' },
                    { name: 'fontSize', label: '글자 크기', type: 'number' },
                    { name: 'color', label: '색상', type: 'color' },
                    { name: 'textAlign', label: '정렬', type: 'select', options: ['left', 'center', 'right'] }
                ];
            default:
                return [];
        }
    }

    createInputForProperty(property, element) {
        let input;
        
        switch (property.type) {
            case 'select':
                input = document.createElement('select');
                property.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    input.appendChild(optionElement);
                });
                break;
            case 'color':
                input = document.createElement('input');
                input.type = 'color';
                break;
            default:
                input = document.createElement('input');
                input.type = property.type;
        }
        
        input.value = element.properties[property.name];
        
        input.addEventListener('change', (e) => {
            const newProperties = { ...element.properties };
            newProperties[property.name] = e.target.value;
            this.elementManager.updateElement(element.id, newProperties);
        });
        
        return input;
    }
} 