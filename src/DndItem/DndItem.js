import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import React from "react";
import { useState } from "react";
const ItemTypes = {
    ITEM: "item"
};

export const DndItem = React.memo(({
    Component,
    _id,
    index,
    children,
    onDrag,
    className,
    disableDrag,
    handleDropItems,
    setDisableDrag,
    type,
    task,
    items,
    setItems,
    container,
    onDragToDiffCon,
    title,
    description,
    onDrop
}) => {

    const ref = useRef(null);
    let opacity;
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: type,
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        }),

        hover(item, monitor) {


            const dragIndex = item.index;
            const hoverIndex = index;



            if (!ref.current) {
                return;
            }
            if (container !== item.container) {


                onDragToDiffCon(dragIndex, hoverIndex, item, task.container)


                item.container = container
                item.index = index


                return item
            }
            if (dragIndex === hoverIndex) {

                return;
            }




            if (isOver) {

                onDrag(dragIndex, hoverIndex, items, setItems);

                item.index = hoverIndex;
            }
        },
        drop: () => {
            onDrop && onDrop()
            setDisableDrag && setDisableDrag(true)

        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: type,
        item: (monitor) => {
            return { _id, index, container, title, description };
        },
        canDrag: () => {
            if (disableDrag) {
                return false;
            }
            return true;
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        }),
        isDragging: (monitor) => {
            return monitor.getItem()._id === _id
            // console.log(monitor.getItem()._id)
        }
    });

    opacity = isDragging ? 0 : 1;

    // const opacity = isOver ? 0 : 1

    drag(drop(ref));
    return (
        <Component

            ref={ref}
            className={`dropable ${className}`}
            style={{
                opacity: opacity,

            }}
        >
            {children}
        </Component>
    );
});
