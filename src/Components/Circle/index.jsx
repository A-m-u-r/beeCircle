import React, {useEffect, useState} from "react";

const Circle = ({size, position, color, onDragEnd, onDelete, isSelected, onSelect, onDeselect}) => {
    // Состояние для отслеживания, перетаскивается ли круг
    const [isDragging, setIsDragging] = useState(false);
    // Состояние для отслеживания смещения указателя мыши от позиции круга
    const [offset, setOffset] = useState({x: 0, y: 0});

    // Эффект для установки обработчиков событий перемещения мыши и отпускания мыши во время перетаскивания
    useEffect(() => {
        const handleMouseMove = (event) => {
            // Если круг перетаскивается, обновить позицию в соответствии с перемещением мыши
            if (isDragging) {
                onDragEnd({
                    x: event.clientX - offset.x,
                    y: event.clientY - offset.y,
                }, event.ctrlKey);
            }
        };

        const handleMouseUp = () => {
            // Установить isDragging в false, когда мышь отпущена
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offset, onDragEnd]);

    // Обработчик события нажатия мыши, который начинает перетаскивание
    const handleMouseDown = (event) => {
        if (event.button === 0) {
            setIsDragging(true);
            setOffset({
                x: event.clientX - position.x,
                y: event.clientY - position.y,
            });
        }
    };

    // Обработчик контекстного меню (правый клик), который удаляет круг
    const handleContextMenu = (event) => {
        event.preventDefault();
        if (!event.ctrlKey) {
            onDeselect();
        }
        onDelete();
    };

    // Обработчик события клика, который выбирает/отменяет выбор круга
    const handleClick = (event) => {
        if (event.ctrlKey) {
            onSelect();
        }
    };

    // Изменить цвет круга в зависимости от состояния выбора
    const darkenedColor = isSelected ? '#888888' : color;

    // Отрендерить элемент круга
    return (
        <div
            className="circle"
            style={{
                width: size,
                height: size,
                left: position.x,
                top: position.y,
                backgroundColor: darkenedColor,
            }}
            onMouseDown={handleMouseDown}
            onContextMenu={handleContextMenu}
            onClick={handleClick}
        />
    );
};

export default Circle;