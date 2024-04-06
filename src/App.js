import React, {useState, useEffect} from 'react';
import './App.css';
import Circle from "./Components/Circle";

// Компонент App
const App = () => {
    // Состояние для хранения списка кругов
    const [circles, setCircles] = useState([]);
    // Состояние для хранения текущего цвета
    const [color, setColor] = useState('#000000');
    // Состояние для хранения индексов выбранных кругов
    const [selectedCircles, setSelectedCircles] = useState([]);

    // Обработчик события нажатия мыши на слайде, который сбрасывает выбор кругов
    const handleSlideMouseDown = (event) => {
        if (event.button === 0 && !event.target.closest('.circle')) {
            setSelectedCircles([]);
        }
    };

    // Обработчик удаления выбранных кругов
    const handleDeleteSelectedCircles = () => {
        setCircles(circles.filter((_, index) => !selectedCircles.includes(index)));
        setSelectedCircles([]);
    };

    // Эффект для установки обработчика события нажатия клавиши Backspace, который удаляет выбранные круги
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Backspace') {
                handleDeleteSelectedCircles();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedCircles, circles]);

    // Функция для получения случайного числа в заданном диапазоне
    const getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    // Функция для добавления нового круга
    const addCircle = () => {
        const slideWidth = document.querySelector('.slide').clientWidth;
        const slideHeight = document.querySelector('.slide').clientHeight;
        const size = Math.floor(getRandomNumber(0.05, 0.2) * slideWidth);
        const position = {
            x: Math.floor(Math.random() * (slideWidth - size)),
            y: Math.floor(Math.random() * (slideHeight - size)),
        };

        // Обеспечить, чтобы круг не выходил за пределы слайда
        if (position.x + size > slideWidth) {
            position.x = slideWidth - size;
        }
        if (position.y + size > slideHeight) {
            position.y = slideHeight - size;
        }

        setCircles([...circles, {size, position, color}]);
    };

    // Обработчик окончания перетаскивания круга(ов)
    const handleDragEnd = (index, position) => {
        const updatedCircles = [...circles];
        const selectedCircle = updatedCircles[index];
        const dx = position.x - selectedCircle.position.x;
        const dy = position.y - selectedCircle.position.y;

        // Обновить позицию всех выбранных кругов
        selectedCircles.forEach((selectedIndex) => {
            const circle = updatedCircles[selectedIndex];
            circle.position = {
                x: circle.position.x + dx,
                y: circle.position.y + dy,
            };
        });

        // Если нет выбранных кругов, обновить позицию только текущего круга
        if (selectedCircles.length === 0) {
            updatedCircles[index].position = position;
        }

        // Обновить состояние кругов
        setCircles(updatedCircles);
    };
    // Обработчик изменения цвета
    const handleColorChange = (event) => {
        setColor(event.target.value);
    };

// Обработчик удаления круга
    const handleDeleteCircle = (index) => {
        setCircles(circles.filter((_, i) => i !== index));
    };

// Обработчик выбора круга
    const handleSelectCircle = (index) => {
        const selectedIndex = selectedCircles.indexOf(index);
        if (selectedIndex > -1) {
            setSelectedCircles(selectedCircles.filter((i) => i !== index));
        } else {
            setSelectedCircles([...selectedCircles, index]);
        }
    };

// Обработчик отмены выбора круга
    const handleDeselectCircle = (index) => {
        setSelectedCircles(selectedCircles.filter((i) => i !== index));
    };

// Отрендерить приложение
    return (
        <div className="app">
            <div className="controls">
                <button onClick={addCircle}>Добавить круг</button>
                <input type="color" value={color} onChange={handleColorChange}/>
            </div>
            <div className="slide" style={{overflow: 'hidden'}} onMouseDown={handleSlideMouseDown}>
                {circles.map((circle, index) => (
                    <Circle
                        key={index}
                        size={circle.size}
                        position={circle.position}
                        color={circle.color}
                        onDragEnd={(position, isCtrlKey) => handleDragEnd(index, position, isCtrlKey)}
                        onDelete={() => handleDeleteCircle(index)}
                        isSelected={selectedCircles.includes(index)}
                        onSelect={() => handleSelectCircle(index)}
                        onDeselect={() => handleDeselectCircle(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;