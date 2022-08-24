import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import React from "react";
const ItemTypes = {
    ITEM: "item"
};

export const DndItem = React.memo(({
    Component,
    id,
    index,
    children,
    onHover,
    color,
    className,
    opacityEffect,
    disAbleDrag,
    onMouseDown,
    handleDropItems,
    setDisbaleDrag,
    type
}) => {
    const ref = useRef(null);

    const [{ isOver }, drop] = useDrop({
        accept: type,
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        }),

        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }


            if (isOver) {
                onHover(dragIndex, hoverIndex);

                item.index = hoverIndex;
            }
        },
        drop: () => {
            if (handleDropItems) {
                handleDropItems(setDisbaleDrag);
            }
            if (setDisbaleDrag) {
                setDisbaleDrag(true);
            }
        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: type,
        item: () => {
            return { id, index };
        },
        canDrag: () => {
            if (disAbleDrag) {
                return false;
            }
            return true;
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const opacity = isDragging ? 0 : 1;
    // const opacity= isOver  ? 0 : 1

    drag(drop(ref));
    return (
        <Component
            // onMouseDown={onMouseDown}
            ref={ref}
            className={`dropable ${className}`}
            style={{
                opacity: opacity
            }}
        >
            {children}
        </Component>
    );
});
